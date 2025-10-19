import { Router } from 'express';
import { DataSyncService } from '../services/data-sync';
import { JiraIntegrationService } from '../services/jira-integration';

const router = Router();
const syncService = new DataSyncService();

/**
 * POST /sync/project
 * Trigger a sync for a Jira project
 * 
 * Body: { projectKey: string, maxIssues?: number }
 */
router.post('/project', async (req, res) => {
  try {
    const { projectKey, maxIssues } = req.body;

    if (!projectKey) {
      return res.status(400).json({ error: 'projectKey is required' });
    }

    console.log(`Starting sync for project: ${projectKey}`);
    const result = await syncService.syncProject(projectKey, maxIssues || 50);

    res.json({
      success: result.success,
      data: {
        issuesProcessed: result.issuesProcessed,
        eventsCreated: result.eventsCreated,
        duration: result.endTime.getTime() - result.startTime.getTime(),
        startTime: result.startTime,
        endTime: result.endTime,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (err: any) {
    console.error('Sync error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /sync/status
 * Get sync configuration status and recent activity
 */
router.get('/status', async (req, res) => {
  try {
    const status = await syncService.getSyncStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (err: any) {
    console.error('Status error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /sync/test-jira
 * Test Jira connection and fetch a sample issue
 */
router.get('/test-jira', async (req, res) => {
  try {
    const { projectKey } = req.query;

    if (!projectKey || typeof projectKey !== 'string') {
      return res.status(400).json({ error: 'projectKey query parameter is required' });
    }

    const jiraService = new JiraIntegrationService();

    if (!jiraService.isConfigured()) {
      return res.status(400).json({ error: 'Jira integration not configured' });
    }

    // Fetch just one issue to test connection
    const issues = await jiraService.fetchIssues(projectKey, undefined, 1);

    if (issues.length === 0) {
      return res.json({
        success: true,
        message: 'Connection successful but no issues found',
        data: { issueCount: 0 },
      });
    }

    // Fetch dev info for the first issue
    const devInfo = await jiraService.fetchDevelopmentInfo(issues[0].key);

    res.json({
      success: true,
      message: 'Jira connection successful',
      data: {
        issueCount: issues.length,
        sampleIssue: issues[0],
        devInfo: {
          commits: devInfo.commits.length,
          pullRequests: devInfo.pullRequests.length,
          branches: devInfo.branches.length,
        },
      },
    });
  } catch (err: any) {
    console.error('Jira test error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to connect to Jira',
    });
  }
});

/**
 * POST /sync/issue
 * Sync a specific Jira issue
 * 
 * Body: { issueKey: string }
 */
router.post('/issue', async (req, res) => {
  try {
    const { issueKey } = req.body;

    if (!issueKey) {
      return res.status(400).json({ error: 'issueKey is required' });
    }

    const jiraService = new JiraIntegrationService();

    if (!jiraService.isConfigured()) {
      return res.status(400).json({ error: 'Jira integration not configured' });
    }

    // Fetch dev info for the issue
    const devInfo = await jiraService.fetchDevelopmentInfo(issueKey);

    res.json({
      success: true,
      data: {
        issueKey,
        commits: devInfo.commits,
        pullRequests: devInfo.pullRequests,
        branches: devInfo.branches,
      },
    });
  } catch (err: any) {
    console.error('Issue sync error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to fetch issue data',
    });
  }
});

export default router;

