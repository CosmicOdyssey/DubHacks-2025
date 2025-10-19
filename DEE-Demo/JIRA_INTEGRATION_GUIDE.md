# Jira Integration Guide - Fetching GitHub/GitLab Data

## Overview

This guide explains how to integrate Jira with GitHub and GitLab to automatically fetch contribution data for the DEE (Dynamic Equity Engine) algorithm.

The integration allows you to:
- Fetch Jira issues and their linked development information (commits, PRs, branches)
- Enrich the data with detailed metrics from GitHub/GitLab APIs
- Automatically convert this data into scored events for equity calculations

## Architecture

```
Jira Issues
    ↓
Jira Dev Info API (linked commits, PRs, branches)
    ↓
GitHub/GitLab APIs (enrichment with detailed metrics)
    ↓
Event Mappers (normalize to standard format)
    ↓
Database (stored as events for scoring)
```

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token

# GitHub Configuration (optional, for enrichment)
GITHUB_API_TOKEN=your_github_personal_access_token

# GitLab Configuration (optional, for enrichment)
GITLAB_API_TOKEN=your_gitlab_personal_access_token
GITLAB_BASE_URL=https://gitlab.com/api/v4  # Or your self-hosted instance
```

### Getting API Tokens

#### Jira API Token
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label (e.g., "DEE Integration")
4. Copy the token and save it to your `.env` file

#### GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (Full control of private repositories)
4. Generate and copy the token

#### GitLab Personal Access Token
1. Go to https://gitlab.com/-/profile/personal_access_tokens
2. Create a token with `api` scope
3. Copy the token

## Jira Integration Setup

### 1. Link GitHub/GitLab to Jira

For the integration to work, you need to connect your GitHub/GitLab repositories to Jira:

#### GitHub + Jira
1. Install the GitHub for Jira app from Atlassian Marketplace
2. Connect your GitHub organization/repositories
3. Make sure your commits and PRs reference Jira issue keys (e.g., `PROJ-123`)

#### GitLab + Jira
1. In GitLab, go to Settings → Integrations → Jira
2. Enter your Jira URL and credentials
3. Enable the integration
4. Reference Jira issue keys in commits and merge requests

### 2. Referencing Jira Issues

In your commits and PRs, reference Jira issues using the format: `PROJECTKEY-NUMBER`

Example commit messages:
```
PROJ-123: Add user authentication feature
Fix PROJ-456 - resolve bug in payment processing
```

Example PR titles:
```
[PROJ-789] Implement dashboard analytics
PROJ-234: Refactor database queries
```

## API Endpoints

### 1. Sync Entire Project

Fetch all issues from a Jira project and their linked development data:

```bash
POST /sync/project
Content-Type: application/json

{
  "projectKey": "PROJ",
  "maxIssues": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "issuesProcessed": 45,
    "eventsCreated": 238,
    "duration": 12453,
    "startTime": "2025-10-19T10:30:00Z",
    "endTime": "2025-10-19T10:30:12Z"
  },
  "errors": []
}
```

### 2. Get Sync Status

Check configuration status and recent sync activity:

```bash
GET /sync/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jiraConfigured": true,
    "githubConfigured": true,
    "gitlabConfigured": false,
    "totalEvents": 1523,
    "eventsByProvider": {
      "github": 1200,
      "jira": 150,
      "gitlab": 173
    },
    "lastSyncedEvents": [
      {
        "eventId": "abc-123",
        "ts": "2025-10-19T10:30:00Z",
        "type": "merge",
        "repo": "owner/repo"
      }
    ]
  }
}
```

### 3. Test Jira Connection

Test your Jira configuration and fetch a sample issue:

```bash
GET /sync/test-jira?projectKey=PROJ
```

**Response:**
```json
{
  "success": true,
  "message": "Jira connection successful",
  "data": {
    "issueCount": 1,
    "sampleIssue": {
      "key": "PROJ-123",
      "fields": {
        "summary": "Implement user dashboard",
        "status": { "name": "Done" }
      }
    },
    "devInfo": {
      "commits": 15,
      "pullRequests": 3,
      "branches": 2
    }
  }
}
```

### 4. Sync Single Issue

Fetch development data for a specific issue:

```bash
POST /sync/issue
Content-Type: application/json

{
  "issueKey": "PROJ-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "issueKey": "PROJ-123",
    "commits": [
      {
        "id": "abc123",
        "author": { "name": "John Doe", "email": "john@example.com" },
        "message": "PROJ-123: Implement feature",
        "timestamp": "2025-10-15T14:30:00Z",
        "url": "https://github.com/owner/repo/commit/abc123"
      }
    ],
    "pullRequests": [
      {
        "id": "123",
        "title": "PROJ-123: Add user dashboard",
        "status": "MERGED",
        "author": { "name": "John Doe" },
        "url": "https://github.com/owner/repo/pull/123"
      }
    ],
    "branches": []
  }
}
```

## Webhook Support

In addition to on-demand syncing, you can configure webhooks for real-time updates:

### GitHub Webhook
```
POST /webhooks/github
```

### GitLab Webhook
```
POST /webhooks/gitlab
```

### Jira Webhook
```
POST /webhooks/jira
```

## Data Flow

### 1. From Jira
When syncing from Jira:
1. Fetch issues using Jira REST API
2. For each issue, fetch development information (commits, PRs, branches)
3. Parse repository URIs to identify GitHub vs GitLab
4. Enrich data by calling GitHub/GitLab APIs
5. Map to normalized event format
6. Store in database

### 2. From Webhooks
When receiving webhooks:
1. Receive webhook payload from GitHub/GitLab/Jira
2. Map payload to normalized event format
3. Extract Jira issue keys from commit messages and PR titles
4. Store in database

## Event Types

The system creates the following event types:

- **commit**: Individual commits to repositories
- **merge**: Merged pull requests/merge requests
- **review**: Code reviews and comments
- **deploy**: Successful deployments (from CI/CD pipelines)
- **incident_fix**: Bug fixes and incident resolutions (from Jira)

## Scoring Features

Events are enriched with features used for scoring:

### Commits
- `additions`: Lines added
- `deletions`: Lines deleted
- `size`: Total lines changed
- `files`: Number of files changed

### Pull Requests / Merge Requests
- `additions`: Lines added
- `deletions`: Lines deleted
- `size`: Total lines changed
- `changed_files`: Number of files changed
- `tests_passed`: 1 if CI passed, 0 otherwise

## Usage Examples

### Example 1: Initial Sync

Sync your entire project for the first time:

```bash
# Test connection first
curl -X GET "http://localhost:4000/sync/test-jira?projectKey=MYPROJ"

# If successful, sync the project
curl -X POST http://localhost:4000/sync/project \
  -H "Content-Type: application/json" \
  -d '{
    "projectKey": "MYPROJ",
    "maxIssues": 100
  }'
```

### Example 2: Regular Sync Script

Create a script to sync regularly:

```bash
#!/bin/bash
# sync-jira.sh

PROJECT_KEY="MYPROJ"
API_URL="http://localhost:4000"

echo "Starting sync for project $PROJECT_KEY..."

response=$(curl -s -X POST $API_URL/sync/project \
  -H "Content-Type: application/json" \
  -d "{\"projectKey\": \"$PROJECT_KEY\", \"maxIssues\": 50}")

echo $response | jq '.'

events_created=$(echo $response | jq '.data.eventsCreated')
echo "Created $events_created events"
```

Run it with cron:
```
# Sync every 6 hours
0 */6 * * * /path/to/sync-jira.sh
```

### Example 3: Sync Specific Issue

When working on a specific issue, sync just that issue:

```bash
curl -X POST http://localhost:4000/sync/issue \
  -H "Content-Type: application/json" \
  -d '{"issueKey": "MYPROJ-123"}'
```

## Troubleshooting

### "Jira integration not configured"

Check that all required environment variables are set:
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

### "No development information found"

1. Verify GitHub/GitLab is connected to Jira
2. Check that commits reference Jira issue keys
3. Ensure the Jira issue has linked development work

### Rate Limiting

If you hit rate limits:
1. For GitHub: Increase `GITHUB_API_TOKEN` (increases rate limit to 5000/hour)
2. For GitLab: Use a premium token or reduce sync frequency
3. Reduce `maxIssues` parameter in sync requests

### Events Not Appearing

Check:
1. Database connection is working
2. Issue keys are properly formatted (e.g., `PROJ-123`)
3. Repository URIs are being parsed correctly
4. Review API response for errors

## Best Practices

1. **Start Small**: Test with a small `maxIssues` value first
2. **Use Webhooks**: Set up webhooks for real-time updates
3. **Regular Syncs**: Run periodic syncs to catch missed events
4. **Monitor Logs**: Watch API logs for errors and warnings
5. **Issue Naming**: Always reference Jira keys in commits and PRs
6. **API Tokens**: Use dedicated service accounts for API tokens
7. **Rate Limits**: Be mindful of API rate limits, especially for large projects

## Security Considerations

1. **Store Tokens Securely**: Never commit API tokens to version control
2. **Use Environment Variables**: Load tokens from `.env` file
3. **Limit Token Scopes**: Give tokens only the permissions they need
4. **Rotate Tokens**: Periodically rotate API tokens
5. **Monitor Access**: Review API token usage in provider dashboards

## Advanced Usage

### Custom Sync Logic

You can customize the sync logic by modifying:
- `services/api/src/services/data-sync.ts` - Main sync orchestration
- `services/api/src/services/jira-integration.ts` - Jira API client
- `services/api/src/services/github-client.ts` - GitHub API client
- `services/api/src/services/gitlab-client.ts` - GitLab API client

### Filtering Sync Data

Modify the JQL query in `jira-integration.ts`:

```typescript
const searchJql = `project = ${projectKey} AND status = Done AND updated >= -30d`;
```

### Custom Event Mapping

Extend the mappers in `mappers/` directory to handle custom event types or additional metadata.

## Support

For issues or questions:
1. Check the logs: Review API server logs for error details
2. Test endpoints: Use `/sync/test-jira` to verify configuration
3. Check status: Use `/sync/status` to see what's configured
4. Review docs: See `BACKEND_IMPLEMENTATION_SUMMARY.md` for API details

## Next Steps

After setting up the integration:

1. ✅ Configure environment variables
2. ✅ Test Jira connection
3. ✅ Run initial sync
4. ✅ Set up webhooks for real-time updates
5. ✅ Schedule regular syncs
6. ✅ Monitor sync status and logs
7. ✅ Verify events are being scored correctly

---

**Status**: Integration Complete ✅

All components are implemented and ready for use!

