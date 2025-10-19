import { config } from '../config';

export type GitLabCommit = {
  id: string;
  short_id: string;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  stats?: { additions: number; deletions: number; total: number };
};

export type GitLabMergeRequest = {
  id: number;
  iid: number;
  title: string;
  description: string | null;
  state: string;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  author: { id: number; username: string; name: string };
  merge_status: string;
  changes_count?: string;
  labels?: string[];
};

/**
 * GitLab API Client
 * Fetches detailed information from GitLab API
 */
export class GitLabClient {
  private token: string;
  private baseUrl: string;

  constructor() {
    this.token = config.gitlabApiToken || '';
    this.baseUrl = config.gitlabBaseUrl || 'https://gitlab.com/api/v4';
  }

  /**
   * Check if GitLab client is configured
   */
  isConfigured(): boolean {
    return Boolean(this.token);
  }

  /**
   * Get authentication headers for GitLab API
   */
  private getHeaders(): Record<string, string> {
    return {
      'PRIVATE-TOKEN': this.token,
      'Accept': 'application/json',
    };
  }

  /**
   * Get project ID from owner/repo format
   * GitLab uses URL-encoded project path as ID: "owner/repo" -> "owner%2Frepo"
   */
  private getProjectId(owner: string, repo: string): string {
    return encodeURIComponent(`${owner}/${repo}`);
  }

  /**
   * Fetch detailed commit information
   */
  async fetchCommit(owner: string, repo: string, sha: string): Promise<GitLabCommit | null> {
    if (!this.isConfigured()) {
      console.warn('GitLab client not configured');
      return null;
    }

    const projectId = this.getProjectId(owner, repo);
    const url = `${this.baseUrl}/projects/${projectId}/repository/commits/${sha}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitLab API error fetching commit ${sha}: ${response.status}`);
        return null;
      }

      const commit = await response.json();

      // Fetch commit stats separately
      const statsUrl = `${this.baseUrl}/projects/${projectId}/repository/commits/${sha}/diff`;
      const statsResponse = await fetch(statsUrl, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (statsResponse.ok) {
        const diffs = await statsResponse.json();
        let additions = 0;
        let deletions = 0;

        // Calculate stats from diff
        for (const diff of diffs) {
          const diffText = diff.diff || '';
          const addLines = (diffText.match(/^\+[^+]/gm) || []).length;
          const delLines = (diffText.match(/^-[^-]/gm) || []).length;
          additions += addLines;
          deletions += delLines;
        }

        commit.stats = { additions, deletions, total: additions + deletions };
      }

      return commit;
    } catch (err) {
      console.error(`Failed to fetch GitLab commit ${sha}:`, err);
      return null;
    }
  }

  /**
   * Fetch detailed merge request information
   */
  async fetchMergeRequest(owner: string, repo: string, mrIid: number): Promise<GitLabMergeRequest | null> {
    if (!this.isConfigured()) {
      console.warn('GitLab client not configured');
      return null;
    }

    const projectId = this.getProjectId(owner, repo);
    const url = `${this.baseUrl}/projects/${projectId}/merge_requests/${mrIid}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitLab API error fetching MR !${mrIid}: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error(`Failed to fetch GitLab MR !${mrIid}:`, err);
      return null;
    }
  }

  /**
   * Fetch commits from a repository within a date range
   */
  async fetchCommits(
    owner: string,
    repo: string,
    options?: { since?: string; until?: string; per_page?: number }
  ): Promise<GitLabCommit[]> {
    if (!this.isConfigured()) {
      console.warn('GitLab client not configured');
      return [];
    }

    const projectId = this.getProjectId(owner, repo);
    const params = new URLSearchParams();
    if (options?.since) params.append('since', options.since);
    if (options?.until) params.append('until', options.until);
    params.append('per_page', String(options?.per_page || 100));

    const url = `${this.baseUrl}/projects/${projectId}/repository/commits?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitLab API error fetching commits: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to fetch GitLab commits:', err);
      return [];
    }
  }

  /**
   * Fetch merge requests from a repository
   */
  async fetchMergeRequests(
    owner: string,
    repo: string,
    options?: { state?: 'opened' | 'closed' | 'merged' | 'all'; per_page?: number }
  ): Promise<GitLabMergeRequest[]> {
    if (!this.isConfigured()) {
      console.warn('GitLab client not configured');
      return [];
    }

    const projectId = this.getProjectId(owner, repo);
    const params = new URLSearchParams();
    if (options?.state) params.append('state', options.state);
    params.append('per_page', String(options?.per_page || 100));
    params.append('order_by', 'updated_at');
    params.append('sort', 'desc');

    const url = `${this.baseUrl}/projects/${projectId}/merge_requests?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitLab API error fetching MRs: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to fetch GitLab MRs:', err);
      return [];
    }
  }

  /**
   * Extract MR IID from GitLab URL
   */
  static extractMRNumber(url: string): number | null {
    const match = url.match(/\/merge_requests\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Extract commit SHA from GitLab URL
   */
  static extractCommitSHA(url: string): string | null {
    const match = url.match(/\/commit\/([a-f0-9]{40})/i);
    return match ? match[1] : null;
  }
}

