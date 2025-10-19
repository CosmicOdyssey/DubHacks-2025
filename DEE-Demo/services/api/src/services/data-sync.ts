import { randomUUID } from 'crypto';
import prisma from '../db/client';
import { JiraIntegrationService } from './jira-integration';
import { GitHubClient } from './github-client';
import { GitLabClient } from './gitlab-client';

type EventOut = {
  eventId: string;
  contributorId: string;
  repo: string;
  type: 'commit' | 'merge' | 'review' | 'doc' | 'deploy' | 'incident_fix';
  ts: Date;
  tags: string[];
  issueKeys: string[];
  prId?: string;
  isMilestone?: boolean;
  rawFeatures: Record<string, unknown>;
  provenance: Record<string, unknown>;
};

export type SyncResult = {
  success: boolean;
  issuesProcessed: number;
  eventsCreated: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
};

/**
 * Data Sync Service
 * Orchestrates fetching data from Jira and enriching with GitHub/GitLab data
 */
export class DataSyncService {
  private jiraService: JiraIntegrationService;
  private githubClient: GitHubClient;
  private gitlabClient: GitLabClient;

  constructor() {
    this.jiraService = new JiraIntegrationService();
    this.githubClient = new GitHubClient();
    this.gitlabClient = new GitLabClient();
  }

  /**
   * Sync data from Jira project, enriching with GitHub/GitLab information
   */
  async syncProject(projectKey: string, maxIssues: number = 50): Promise<SyncResult> {
    const startTime = new Date();
    const errors: string[] = [];
    let issuesProcessed = 0;
    let eventsCreated = 0;

    console.log(`Starting data sync for Jira project: ${projectKey}`);

    if (!this.jiraService.isConfigured()) {
      errors.push('Jira integration not configured');
      return {
        success: false,
        issuesProcessed,
        eventsCreated,
        errors,
        startTime,
        endTime: new Date(),
      };
    }

    try {
      // Fetch all issues with their development info from Jira
      const issuesWithDev = await this.jiraService.fetchProjectWithDevInfo(projectKey, maxIssues);
      console.log(`Fetched ${issuesWithDev.length} issues from Jira`);

      for (const { issue, devInfo } of issuesWithDev) {
        try {
          issuesProcessed++;

          // Process commits
          for (const commit of devInfo.commits) {
            try {
              const event = await this.processCommit(commit, issue.key);
              if (event) {
                await this.saveEvent(event);
                eventsCreated++;
              }
            } catch (err: any) {
              errors.push(`Failed to process commit ${commit.id}: ${err.message}`);
            }
          }

          // Process pull requests
          for (const pr of devInfo.pullRequests) {
            try {
              const event = await this.processPullRequest(pr, issue.key);
              if (event) {
                await this.saveEvent(event);
                eventsCreated++;
              }
            } catch (err: any) {
              errors.push(`Failed to process PR ${pr.id}: ${err.message}`);
            }
          }

          // Add small delay to avoid rate limiting
          if (issuesProcessed % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (err: any) {
          errors.push(`Failed to process issue ${issue.key}: ${err.message}`);
        }
      }

      console.log(`Data sync complete: ${eventsCreated} events created from ${issuesProcessed} issues`);

      return {
        success: true,
        issuesProcessed,
        eventsCreated,
        errors,
        startTime,
        endTime: new Date(),
      };
    } catch (err: any) {
      errors.push(`Fatal error during sync: ${err.message}`);
      return {
        success: false,
        issuesProcessed,
        eventsCreated,
        errors,
        startTime,
        endTime: new Date(),
      };
    }
  }

  /**
   * Process a commit from Jira dev info
   */
  private async processCommit(commit: any, issueKey: string): Promise<EventOut | null> {
    const provider = JiraIntegrationService.extractProvider(commit.repositoryUri);
    const repoInfo = JiraIntegrationService.parseRepositoryUri(commit.repositoryUri);

    if (!repoInfo) {
      console.warn(`Could not parse repository URI: ${commit.repositoryUri}`);
      return null;
    }

    const repo = `${repoInfo.owner}/${repoInfo.repo}`;
    let features: Record<string, unknown> = { value: 1 };

    // Try to enrich with API data
    if (provider === 'github' && this.githubClient.isConfigured()) {
      const sha = GitHubClient.extractCommitSHA(commit.url) || commit.id;
      if (sha) {
        const enriched = await this.githubClient.fetchCommit(repoInfo.owner, repoInfo.repo, sha);
        if (enriched?.stats) {
          features = {
            additions: enriched.stats.additions,
            deletions: enriched.stats.deletions,
            size: enriched.stats.total,
            files: enriched.files?.length || 0,
          };
        }
      }
    } else if (provider === 'gitlab' && this.gitlabClient.isConfigured()) {
      const sha = GitLabClient.extractCommitSHA(commit.url) || commit.id;
      if (sha) {
        const enriched = await this.gitlabClient.fetchCommit(repoInfo.owner, repoInfo.repo, sha);
        if (enriched?.stats) {
          features = {
            additions: enriched.stats.additions,
            deletions: enriched.stats.deletions,
            size: enriched.stats.total,
          };
        }
      }
    }

    // Extract contributor ID
    const contributorId = commit.author?.email || commit.author?.name || 'unknown';

    return {
      eventId: randomUUID(),
      contributorId,
      repo,
      type: 'commit',
      ts: new Date(commit.timestamp),
      tags: [],
      issueKeys: [issueKey],
      rawFeatures: features,
      provenance: {
        provider,
        source: 'jira_dev_info',
        commitId: commit.id,
        url: commit.url,
      },
    };
  }

  /**
   * Process a pull request from Jira dev info
   */
  private async processPullRequest(pr: any, issueKey: string): Promise<EventOut | null> {
    const provider = JiraIntegrationService.extractProvider(pr.repositoryUri);
    const repoInfo = JiraIntegrationService.parseRepositoryUri(pr.repositoryUri);

    if (!repoInfo) {
      console.warn(`Could not parse repository URI: ${pr.repositoryUri}`);
      return null;
    }

    const repo = `${repoInfo.owner}/${repoInfo.repo}`;
    const isMerged = pr.status?.toLowerCase().includes('merged') || pr.status === 'MERGED';
    let features: Record<string, unknown> = { value: 1 };

    // Try to enrich with API data
    if (provider === 'github' && this.githubClient.isConfigured()) {
      const prNumber = GitHubClient.extractPRNumber(pr.url);
      if (prNumber) {
        const enriched = await this.githubClient.fetchPullRequest(repoInfo.owner, repoInfo.repo, prNumber);
        if (enriched) {
          features = {
            additions: enriched.additions,
            deletions: enriched.deletions,
            size: enriched.additions + enriched.deletions,
            changed_files: enriched.changed_files,
            tests_passed: enriched.mergeable_state === 'clean' ? 1 : 0,
          };
        }
      }
    } else if (provider === 'gitlab' && this.gitlabClient.isConfigured()) {
      const mrNumber = GitLabClient.extractMRNumber(pr.url);
      if (mrNumber) {
        const enriched = await this.gitlabClient.fetchMergeRequest(repoInfo.owner, repoInfo.repo, mrNumber);
        if (enriched) {
          features = {
            changes_count: enriched.changes_count ? parseInt(enriched.changes_count, 10) : 0,
            size: enriched.changes_count ? parseInt(enriched.changes_count, 10) : 0,
            tests_passed: enriched.merge_status === 'can_be_merged' ? 1 : 0,
          };
        }
      }
    }

    // Extract contributor ID
    const contributorId = pr.author?.email || pr.author?.name || 'unknown';

    return {
      eventId: randomUUID(),
      contributorId,
      repo,
      type: isMerged ? 'merge' : 'commit',
      ts: new Date(pr.lastUpdate),
      tags: [],
      issueKeys: [issueKey],
      prId: pr.id,
      isMilestone: false,
      rawFeatures: features,
      provenance: {
        provider,
        source: 'jira_dev_info',
        prId: pr.id,
        url: pr.url,
        status: pr.status,
      },
    };
  }

  /**
   * Save event to database
   */
  private async saveEvent(event: EventOut): Promise<void> {
    await prisma.event.upsert({
      where: { eventId: event.eventId },
      create: {
        eventId: event.eventId,
        contributorId: event.contributorId,
        repo: event.repo,
        type: event.type as any,
        ts: event.ts,
        tags: event.tags,
        issueKeys: event.issueKeys,
        prId: event.prId,
        isMilestone: Boolean(event.isMilestone),
        rawFeatures: event.rawFeatures,
        provenance: event.provenance,
      },
      update: {
        // Update if exists to refresh data
        rawFeatures: event.rawFeatures,
        provenance: event.provenance,
      },
    });
  }

  /**
   * Get sync status and statistics
   */
  async getSyncStatus(): Promise<{
    jiraConfigured: boolean;
    githubConfigured: boolean;
    gitlabConfigured: boolean;
    totalEvents: number;
    eventsByProvider: Record<string, number>;
    lastSyncedEvents: Array<{ eventId: string; ts: Date; type: string; repo: string }>;
  }> {
    const totalEvents = await prisma.event.count();

    // Get events grouped by provider
    const allEvents = await prisma.event.findMany({
      select: { provenance: true },
    });

    const eventsByProvider: Record<string, number> = {};
    for (const event of allEvents) {
      const provider = (event.provenance as any)?.provider || 'unknown';
      eventsByProvider[provider] = (eventsByProvider[provider] || 0) + 1;
    }

    // Get last synced events from Jira
    const lastSyncedEvents = await prisma.event.findMany({
      where: {
        provenance: {
          path: ['source'],
          equals: 'jira_dev_info',
        },
      },
      select: { eventId: true, ts: true, type: true, repo: true },
      orderBy: { ts: 'desc' },
      take: 10,
    });

    return {
      jiraConfigured: this.jiraService.isConfigured(),
      githubConfigured: this.githubClient.isConfigured(),
      gitlabConfigured: this.gitlabClient.isConfigured(),
      totalEvents,
      eventsByProvider,
      lastSyncedEvents,
    };
  }
}

