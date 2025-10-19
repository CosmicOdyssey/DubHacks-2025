import { config } from '../config';

export type GitHubCommit = {
  sha: string;
  commit: {
    author: { name: string; email: string; date: string };
    message: string;
  };
  author: { login: string } | null;
  stats?: { additions: number; deletions: number; total: number };
  files?: Array<{ filename: string; status: string; additions: number; deletions: number }>;
};

export type GitHubPullRequest = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  merged: boolean;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  user: { login: string };
  additions: number;
  deletions: number;
  changed_files: number;
  mergeable_state?: string;
};

/**
 * GitHub API Client
 * Fetches detailed information from GitHub API
 */
export class GitHubClient {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor() {
    this.token = config.githubApiToken || '';
  }

  /**
   * Check if GitHub client is configured
   */
  isConfigured(): boolean {
    return Boolean(this.token);
  }

  /**
   * Get authentication headers for GitHub API
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DEE-API',
    };
  }

  /**
   * Fetch detailed commit information
   */
  async fetchCommit(owner: string, repo: string, sha: string): Promise<GitHubCommit | null> {
    if (!this.isConfigured()) {
      console.warn('GitHub client not configured');
      return null;
    }

    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits/${sha}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitHub API error fetching commit ${sha}: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error(`Failed to fetch GitHub commit ${sha}:`, err);
      return null;
    }
  }

  /**
   * Fetch detailed pull request information
   */
  async fetchPullRequest(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest | null> {
    if (!this.isConfigured()) {
      console.warn('GitHub client not configured');
      return null;
    }

    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitHub API error fetching PR #${prNumber}: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error(`Failed to fetch GitHub PR #${prNumber}:`, err);
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
  ): Promise<GitHubCommit[]> {
    if (!this.isConfigured()) {
      console.warn('GitHub client not configured');
      return [];
    }

    const params = new URLSearchParams();
    if (options?.since) params.append('since', options.since);
    if (options?.until) params.append('until', options.until);
    params.append('per_page', String(options?.per_page || 100));

    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitHub API error fetching commits: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to fetch GitHub commits:', err);
      return [];
    }
  }

  /**
   * Fetch pull requests from a repository
   */
  async fetchPullRequests(
    owner: string,
    repo: string,
    options?: { state?: 'open' | 'closed' | 'all'; per_page?: number }
  ): Promise<GitHubPullRequest[]> {
    if (!this.isConfigured()) {
      console.warn('GitHub client not configured');
      return [];
    }

    const params = new URLSearchParams();
    params.append('state', options?.state || 'all');
    params.append('per_page', String(options?.per_page || 100));
    params.append('sort', 'updated');
    params.append('direction', 'desc');

    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`GitHub API error fetching PRs: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to fetch GitHub PRs:', err);
      return [];
    }
  }

  /**
   * Extract PR number from GitHub URL
   */
  static extractPRNumber(url: string): number | null {
    const match = url.match(/\/pull\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Extract commit SHA from GitHub URL
   */
  static extractCommitSHA(url: string): string | null {
    const match = url.match(/\/commit\/([a-f0-9]{40})/i);
    return match ? match[1] : null;
  }
}

