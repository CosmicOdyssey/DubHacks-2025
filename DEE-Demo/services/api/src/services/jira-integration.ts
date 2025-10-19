import { config } from '../config';

export type JiraIssue = {
  key: string;
  id: string;
  fields: {
    summary: string;
    status: { name: string };
    issuetype: { name: string };
    created: string;
    updated: string;
    assignee?: { accountId: string; displayName: string; emailAddress?: string };
    reporter?: { accountId: string; displayName: string; emailAddress?: string };
  };
};

export type JiraDevInfo = {
  commits: Array<{
    id: string;
    repositoryUri: string;
    author: { name: string; email: string };
    message: string;
    timestamp: string;
    url: string;
    files?: Array<{ path: string; changeType: string }>;
  }>;
  pullRequests: Array<{
    id: string;
    title: string;
    status: string;
    author: { name: string; email?: string };
    url: string;
    lastUpdate: string;
    repositoryUri: string;
  }>;
  branches: Array<{
    name: string;
    repositoryUri: string;
    url: string;
    lastCommit?: { timestamp: string };
  }>;
};

/**
 * Jira Integration Service
 * Fetches issues and their linked development information from Jira
 */
export class JiraIntegrationService {
  private baseUrl: string;
  private email: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = config.jiraBaseUrl || '';
    this.email = config.jiraEmail || '';
    this.apiToken = config.jiraApiToken || '';
  }

  /**
   * Check if Jira integration is configured
   */
  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.email && this.apiToken);
  }

  /**
   * Get authentication headers for Jira API
   */
  private getHeaders(): Record<string, string> {
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetch issues from a Jira project with optional JQL filter
   */
  async fetchIssues(projectKey: string, jql?: string, maxResults: number = 100): Promise<JiraIssue[]> {
    if (!this.isConfigured()) {
      throw new Error('Jira integration not configured');
    }

    const searchJql = jql || `project = ${projectKey} ORDER BY updated DESC`;
    const url = `${this.baseUrl}/rest/api/3/search`;
    
    const body = {
      jql: searchJql,
      maxResults,
      fields: ['summary', 'status', 'issuetype', 'created', 'updated', 'assignee', 'reporter'],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.issues || [];
  }

  /**
   * Fetch development information (commits, PRs, branches) for a Jira issue
   * Uses Jira's development information REST API
   */
  async fetchDevelopmentInfo(issueKey: string): Promise<JiraDevInfo> {
    if (!this.isConfigured()) {
      throw new Error('Jira integration not configured');
    }

    const url = `${this.baseUrl}/rest/dev-status/latest/issue/detail`;
    const params = new URLSearchParams({
      issueId: issueKey,
      applicationType: 'GitHub', // This includes GitLab when properly integrated
      dataType: 'repository',
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      // If dev info endpoint fails, return empty data instead of throwing
      console.warn(`Failed to fetch dev info for ${issueKey}: ${response.status}`);
      return { commits: [], pullRequests: [], branches: [] };
    }

    const data = await response.json();
    return this.parseDevInfo(data);
  }

  /**
   * Parse raw Jira development info into structured format
   */
  private parseDevInfo(data: any): JiraDevInfo {
    const commits: JiraDevInfo['commits'] = [];
    const pullRequests: JiraDevInfo['pullRequests'] = [];
    const branches: JiraDevInfo['branches'] = [];

    // Parse commits from detail.devStatus
    if (data.detail && Array.isArray(data.detail)) {
      for (const detailItem of data.detail) {
        // Parse commits
        if (detailItem.commits && Array.isArray(detailItem.commits)) {
          for (const commit of detailItem.commits) {
            commits.push({
              id: commit.id || commit.commitId || '',
              repositoryUri: commit.repositoryUri || detailItem.repository?.url || '',
              author: {
                name: commit.author?.name || commit.authorName || 'unknown',
                email: commit.author?.email || commit.authorEmail || '',
              },
              message: commit.message || '',
              timestamp: commit.timestamp || commit.authorTimestamp || new Date().toISOString(),
              url: commit.url || '',
              files: commit.files || [],
            });
          }
        }

        // Parse pull requests
        if (detailItem.pullRequests && Array.isArray(detailItem.pullRequests)) {
          for (const pr of detailItem.pullRequests) {
            pullRequests.push({
              id: pr.id || '',
              title: pr.name || pr.title || '',
              status: pr.status || pr.state || 'UNKNOWN',
              author: {
                name: pr.author?.name || 'unknown',
                email: pr.author?.email || '',
              },
              url: pr.url || '',
              lastUpdate: pr.lastUpdate || pr.updateDate || new Date().toISOString(),
              repositoryUri: detailItem.repository?.url || '',
            });
          }
        }

        // Parse branches
        if (detailItem.branches && Array.isArray(detailItem.branches)) {
          for (const branch of detailItem.branches) {
            branches.push({
              name: branch.name || '',
              repositoryUri: detailItem.repository?.url || '',
              url: branch.url || '',
              lastCommit: branch.lastCommit ? { timestamp: branch.lastCommit.timestamp } : undefined,
            });
          }
        }
      }
    }

    return { commits, pullRequests, branches };
  }

  /**
   * Fetch all issues from a project along with their development info
   */
  async fetchProjectWithDevInfo(projectKey: string, maxIssues: number = 50): Promise<Array<{
    issue: JiraIssue;
    devInfo: JiraDevInfo;
  }>> {
    const issues = await this.fetchIssues(projectKey, undefined, maxIssues);
    const results = [];

    for (const issue of issues) {
      try {
        const devInfo = await this.fetchDevelopmentInfo(issue.key);
        results.push({ issue, devInfo });
      } catch (err) {
        console.error(`Failed to fetch dev info for ${issue.key}:`, err);
        results.push({ issue, devInfo: { commits: [], pullRequests: [], branches: [] } });
      }
    }

    return results;
  }

  /**
   * Extract repository provider (github, gitlab) from repository URI
   */
  static extractProvider(repositoryUri: string): 'github' | 'gitlab' | 'unknown' {
    const lower = repositoryUri.toLowerCase();
    if (lower.includes('github.com')) return 'github';
    if (lower.includes('gitlab.com') || lower.includes('gitlab')) return 'gitlab';
    return 'unknown';
  }

  /**
   * Extract owner and repo from repository URI
   * e.g., "https://github.com/owner/repo" -> { owner: "owner", repo: "repo" }
   */
  static parseRepositoryUri(repositoryUri: string): { owner: string; repo: string } | null {
    try {
      const url = new URL(repositoryUri);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
      }
    } catch (err) {
      console.warn('Failed to parse repository URI:', repositoryUri);
    }
    return null;
  }
}

