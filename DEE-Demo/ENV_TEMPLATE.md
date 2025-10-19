# Environment Variables Template

Copy this content to `services/api/.env` and fill in your values:

```bash
# API Server Configuration
PORT=4000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dee_db

# GitHub Integration
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
GITHUB_API_TOKEN=ghp_your_github_personal_access_token

# Bitbucket Integration
BITBUCKET_WEBHOOK_SECRET=your_bitbucket_webhook_secret

# Jira Integration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_SHARED_SECRET=your_jira_shared_secret

# GitLab Integration
GITLAB_API_TOKEN=glpat_your_gitlab_personal_access_token
GITLAB_BASE_URL=https://gitlab.com/api/v4

# AWS S3 (for webhook storage)
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional: AWS Credentials (if not using IAM roles)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Getting Your Credentials

### Jira API Token
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token

### GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Generate new token with `repo` scope
3. Copy the token

### GitLab Personal Access Token
1. Go to https://gitlab.com/-/profile/personal_access_tokens
2. Create token with `api` scope
3. Copy the token

## Quick Setup

```bash
# Copy the template
cp ENV_TEMPLATE.md services/api/.env

# Edit with your values
nano services/api/.env

# Restart the API server
cd services/api
npm start
```

