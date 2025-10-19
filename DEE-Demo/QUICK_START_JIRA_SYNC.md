# Quick Start: Jira → GitHub/GitLab Sync

Get your data syncing in 5 minutes!

## Step 1: Get Your API Tokens (5 minutes)

### Jira API Token
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it "DEE Integration"
4. **Copy the token** ← Save this!

### GitHub Token (Optional but recommended)
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scope: `repo`
4. **Copy the token** ← Save this!

### GitLab Token (Optional but recommended)
1. Go to: https://gitlab.com/-/profile/personal_access_tokens
2. Name: "DEE Integration"
3. Scope: `api`
4. **Copy the token** ← Save this!

## Step 2: Configure Environment Variables

Create or edit `services/api/.env`:

```bash
# Required for Jira sync
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=paste_your_jira_token_here

# Optional: GitHub enrichment (recommended)
GITHUB_API_TOKEN=ghp_paste_your_github_token_here

# Optional: GitLab enrichment (recommended)
GITLAB_API_TOKEN=glpat_paste_your_gitlab_token_here
```

## Step 3: Link Jira to GitHub/GitLab

### For GitHub
1. In Jira, go to **Apps → Find new apps**
2. Search for "GitHub for Jira"
3. Install and connect your GitHub organization

### For GitLab
1. In GitLab, go to **Settings → Integrations**
2. Select **Jira**
3. Enter your Jira URL and credentials
4. Enable integration

## Step 4: Test Connection

```bash
cd services/api

# Start the API server (if not running)
npm start

# Test Jira connection (in another terminal)
curl "http://localhost:4000/sync/test-jira?projectKey=YOUR_PROJECT_KEY"
```

Replace `YOUR_PROJECT_KEY` with your actual Jira project key (e.g., `MYPROJ`).

**Expected response:**
```json
{
  "success": true,
  "message": "Jira connection successful",
  "data": {
    "issueCount": 1,
    "sampleIssue": { ... },
    "devInfo": {
      "commits": 15,
      "pullRequests": 3,
      "branches": 2
    }
  }
}
```

## Step 5: Run Your First Sync

```bash
curl -X POST http://localhost:4000/sync/project \
  -H "Content-Type: application/json" \
  -d '{
    "projectKey": "YOUR_PROJECT_KEY",
    "maxIssues": 10
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "issuesProcessed": 10,
    "eventsCreated": 47,
    "duration": 5432,
    "startTime": "2025-10-19T...",
    "endTime": "2025-10-19T..."
  }
}
```

🎉 **Success!** Your contributions are now synced.

## Step 6: Verify Data

Check sync status:
```bash
curl http://localhost:4000/sync/status
```

**You should see:**
```json
{
  "success": true,
  "data": {
    "jiraConfigured": true,
    "githubConfigured": true,
    "gitlabConfigured": true,
    "totalEvents": 47,
    "eventsByProvider": {
      "github": 35,
      "gitlab": 12
    },
    "lastSyncedEvents": [ ... ]
  }
}
```

## What's Next?

### Option A: Set Up Regular Syncs

Create a cron job to sync regularly:

```bash
# Create sync script
cat > sync-cron.sh << 'EOF'
#!/bin/bash
curl -X POST http://localhost:4000/sync/project \
  -H "Content-Type: application/json" \
  -d '{"projectKey": "YOUR_PROJECT_KEY", "maxIssues": 50}'
EOF

chmod +x sync-cron.sh

# Add to crontab (sync every 6 hours)
crontab -e
# Add this line:
0 */6 * * * /path/to/sync-cron.sh
```

### Option B: Set Up Webhooks

For real-time updates, configure webhooks:

**GitHub Webhook:**
```
URL: https://your-domain.com/webhooks/github
Content type: application/json
Secret: your_webhook_secret
Events: Pull requests, Pushes
```

**GitLab Webhook:**
```
URL: https://your-domain.com/webhooks/gitlab
Secret token: your_webhook_secret
Trigger: Push events, Merge request events, Pipeline events
```

**Jira Webhook:**
```
URL: https://your-domain.com/webhooks/jira
Events: Issue updated, Issue created
```

## Troubleshooting

### ❌ "Jira integration not configured"

**Solution:** Check your `.env` file has:
- `JIRA_BASE_URL` (with https://)
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

### ❌ "No development information found"

**Solutions:**
1. Ensure GitHub/GitLab is linked to Jira (Step 3)
2. Check that commits reference issue keys (e.g., `PROJ-123` in commit messages)
3. Verify the issue exists and has linked work

### ❌ "Connection refused"

**Solution:** Make sure the API server is running:
```bash
cd services/api
npm start
```

### ❌ Rate limiting errors

**Solutions:**
1. Add GitHub/GitLab tokens to `.env` (increases rate limits)
2. Reduce `maxIssues` in your sync request
3. Add delays between syncs

## Best Practices

### 1. Reference Jira Keys in Commits

Always include issue keys in your commits:
```bash
git commit -m "PROJ-123: Add user authentication"
```

### 2. Reference in PR/MR Titles

```
Title: [PROJ-456] Implement payment processing
```

### 3. Start Small

For first sync, use a small `maxIssues` value:
```json
{ "projectKey": "PROJ", "maxIssues": 5 }
```

### 4. Monitor Progress

Check logs while syncing:
```bash
# In API directory
npm start

# Watch for sync progress in console
```

### 5. Regular Syncs

Set up automated syncing every 6-12 hours to catch any missed webhook events.

## Commands Cheat Sheet

```bash
# Test connection
curl "http://localhost:4000/sync/test-jira?projectKey=PROJ"

# Sync project
curl -X POST http://localhost:4000/sync/project \
  -H "Content-Type: application/json" \
  -d '{"projectKey": "PROJ", "maxIssues": 50}'

# Check status
curl http://localhost:4000/sync/status

# Sync single issue
curl -X POST http://localhost:4000/sync/issue \
  -H "Content-Type: application/json" \
  -d '{"issueKey": "PROJ-123"}'
```

## Understanding the Data Flow

```
1. Your commit: "PROJ-123: Fix bug"
        ↓
2. GitHub/GitLab detects commit
        ↓
3. Links commit to Jira issue PROJ-123
        ↓
4. Sync runs (manually or scheduled)
        ↓
5. Fetches issue PROJ-123 from Jira
        ↓
6. Gets linked commits from Jira dev info
        ↓
7. Enriches with GitHub/GitLab API (lines changed, files, etc.)
        ↓
8. Creates event in database
        ↓
9. Event is scored by DEE algorithm
        ↓
10. Equity is calculated and distributed
```

## Support

For detailed documentation, see:
- `JIRA_INTEGRATION_GUIDE.md` - Full integration guide
- `JIRA_GITHUB_GITLAB_INTEGRATION.md` - Technical implementation details
- `ENV_TEMPLATE.md` - Environment variable reference

## Summary Checklist

- [ ] Got Jira API token
- [ ] Got GitHub token (optional)
- [ ] Got GitLab token (optional)
- [ ] Configured `.env` file
- [ ] Linked GitHub/GitLab to Jira
- [ ] Tested connection (`/sync/test-jira`)
- [ ] Ran first sync (`/sync/project`)
- [ ] Verified data (`/sync/status`)
- [ ] Set up webhooks or cron job

---

**🎉 You're all set!** Your contributions are now automatically tracked and scored.

