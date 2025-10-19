# System Architecture: DEE with Jira/GitHub/GitLab Integration

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐ │
│  │  GitHub   │    │  GitLab   │    │   Jira    │    │Bitbucket │ │
│  │           │    │           │    │           │    │          │ │
│  │ • Commits │    │ • Commits │    │ • Issues  │    │• Commits │ │
│  │ • PRs     │    │ • MRs     │    │ • Bugs    │    │• PRs     │ │
│  │ • Reviews │    │ • Reviews │    │ • Stories │    │          │ │
│  └─────┬─────┘    └─────┬─────┘    └─────┬─────┘    └────┬─────┘ │
│        │                │                │               │        │
└────────┼────────────────┼────────────────┼───────────────┼────────┘
         │                │                │               │
         │  Webhooks      │  Webhooks      │  Webhooks     │ Webhooks
         │  (Real-time)   │  (Real-time)   │  (Real-time)  │ (Real-time)
         │                │                │               │
         ▼                ▼                ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      WEBHOOK RECEIVERS                               │
│                   (services/api/src/routes/webhooks.ts)             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  POST /webhooks/github    POST /webhooks/gitlab                    │
│  POST /webhooks/jira      POST /webhooks/bitbucket                 │
│  POST /webhooks/ci                                                 │
│                                                                     │
│  • Signature verification                                          │
│  • Payload validation                                              │
│  • Archive to S3                                                   │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │    On-Demand Sync (NEW!)               │
         │ /sync/project - Sync entire project    │
         │ /sync/issue - Sync specific issue      │
         │ /sync/test-jira - Test connection      │
         └────────────────┬───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    JIRA INTEGRATION SERVICE (NEW!)                  │
│                (services/api/src/services/jira-integration.ts)      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  • Fetch issues from Jira projects                                 │
│  • Get development info (linked commits, PRs, branches)            │
│  • Parse repository URIs                                           │
│  • Identify provider (GitHub/GitLab/Bitbucket)                     │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA ENRICHMENT LAYER (NEW!)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐          ┌─────────────────────┐         │
│  │  GitHub API Client  │          │  GitLab API Client  │         │
│  │  (github-client.ts) │          │  (gitlab-client.ts) │         │
│  ├─────────────────────┤          ├─────────────────────┤         │
│  │ • Fetch commits     │          │ • Fetch commits     │         │
│  │ • Fetch PRs         │          │ • Fetch MRs         │         │
│  │ • Get additions     │          │ • Get diffs         │         │
│  │ • Get deletions     │          │ • Get stats         │         │
│  │ • Get test status   │          │ • Get test status   │         │
│  │ • Get files changed │          │ • Get changes count │         │
│  └─────────────────────┘          └─────────────────────┘         │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA SYNC SERVICE (NEW!)                         │
│                  (services/api/src/services/data-sync.ts)           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Orchestrates the entire sync process:                             │
│  1. Fetch issues from Jira                                         │
│  2. Get linked dev info for each issue                             │
│  3. Parse repository URIs and identify providers                   │
│  4. Enrich with detailed metrics from GitHub/GitLab APIs           │
│  5. Convert to normalized event format                             │
│  6. Handle errors and rate limits                                  │
│  7. Save to database                                               │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          EVENT MAPPERS                              │
│                    (services/api/src/mappers/)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  mapGitHub()      mapGitLab()      mapJira()      mapBitbucket()  │
│  mapCI()                                                           │
│                                                                     │
│  Convert provider-specific payloads to normalized events:          │
│                                                                     │
│  {                                                                  │
│    eventId: string                                                 │
│    contributorId: string                                           │
│    repo: string                                                    │
│    type: 'commit' | 'merge' | 'review' | 'deploy' | 'incident_fix'│
│    ts: Date                                                        │
│    tags: string[]                                                  │
│    issueKeys: string[]     ← Links to Jira                        │
│    rawFeatures: {                                                  │
│      size: number         ← Lines changed                         │
│      additions: number    ← Lines added                           │
│      deletions: number    ← Lines deleted                         │
│      tests_passed: 0|1    ← CI status                             │
│    }                                                               │
│    provenance: { provider, url, ... }                             │
│  }                                                                  │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EVENT STORAGE                                │
│                    (Postgres via Prisma)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Tables:                                                           │
│  • events - All contribution events                                │
│  • contributors - Contributor state (MB, MF)                       │
│  • payouts - Equity distributions                                  │
│  • epochs - Time periods                                           │
│  • incidentsLink - Incident tracking                               │
│  • normStats - Normalization statistics                            │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DEE ALGORITHM PIPELINE                         │
│                     (services/api/src/services/)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. NORMALIZER (normalizer.ts)                                     │
│     • Compute statistics (quantiles, mean, std)                    │
│     • Normalize features by scope (repo/lang/stack)                │
│                                                                     │
│  2. SCORER (scorer.ts)                                             │
│     • Score events → MB (Merit-Based)                              │
│     • Score events → MF (Milestone-Focused)                        │
│     • Quality, complexity, risk, business, velocity                │
│                                                                     │
│  3. STATE MANAGER (state.ts)                                       │
│     • Update contributor MB totals                                 │
│     • Update contributor MF with decay                             │
│     • Track contributor rankings                                   │
│                                                                     │
│  4. ISSUER (issuer.ts)                                             │
│     • Calculate equity allocations                                 │
│     • Apply policy gate (α, β, ρ)                                  │
│     • Generate payouts                                             │
│     • Track KPI changes                                            │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API ENDPOINTS                              │
│                    (services/api/src/routes/)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  UI ENDPOINTS (ui.ts)                                              │
│  GET /ui/summary              - Dashboard metrics                  │
│  GET /ui/contributors         - Contributor leaderboard            │
│  GET /ui/payouts              - Payout history                     │
│  GET /ui/epochs               - Epoch history                      │
│  GET /ui/events               - Event feed                         │
│  GET /ui/contributor/:id      - Contributor details                │
│                                                                     │
│  ADMIN ENDPOINTS (admin.ts)                                        │
│  POST /admin/epoch/run        - Trigger epoch calculation          │
│  POST /admin/policy/update    - Update policy parameters           │
│                                                                     │
│  SYNC ENDPOINTS (sync.ts) [NEW!]                                   │
│  POST /sync/project           - Sync Jira project                  │
│  POST /sync/issue             - Sync single issue                  │
│  GET  /sync/status            - Get sync status                    │
│  GET  /sync/test-jira         - Test Jira connection               │
│                                                                     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND / CONSUMERS                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────┐       ┌─────────────────────┐             │
│  │  Jira Forge App    │       │  External Dashboards │             │
│  │  (PM Dashboard)    │       │  (Custom integrations)│            │
│  │                    │       │                      │             │
│  │ • Dashboard tab    │       │ • API consumers      │             │
│  │ • Contributors tab │       │ • Analytics tools    │             │
│  │ • Payouts tab      │       │ • Reporting systems  │             │
│  │ • Epochs tab       │       │                      │             │
│  │ • Events tab       │       │                      │             │
│  └────────────────────┘       └─────────────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Real-time GitHub Commit

```
1. Developer commits: "PROJ-123: Fix authentication bug"
         ↓
2. GitHub sends webhook to /webhooks/github
         ↓
3. mapGitHub() extracts:
   - Contributor: "john@example.com"
   - Issue keys: ["PROJ-123"]
   - Type: "commit"
   - Features: { size: 150, tests_passed: 1 }
         ↓
4. Event saved to database
         ↓
5. Next epoch run:
   - Normalizer normalizes size by repo
   - Scorer calculates MB and MF
   - State manager updates contributor totals
   - Issuer calculates equity payout
         ↓
6. Results visible in UI
```

### Example 2: Jira Sync (NEW!)

```
1. Admin triggers: POST /sync/project {"projectKey": "PROJ"}
         ↓
2. JiraIntegrationService fetches:
   - All issues in project PROJ
   - Development info for each issue
         ↓
3. For issue PROJ-123 with linked GitHub PR:
   a. Parse repo URI: "github.com/org/repo"
   b. Identify provider: GitHub
   c. Extract PR number from URL
   d. Call GitHub API: GET /repos/org/repo/pulls/456
   e. Get detailed metrics: { additions: 120, deletions: 30, ... }
         ↓
4. DataSyncService creates event:
   {
     contributorId: "john@example.com",
     type: "merge",
     issueKeys: ["PROJ-123"],
     rawFeatures: { size: 150, additions: 120, deletions: 30 }
   }
         ↓
5. Event saved to database
         ↓
6. Processed in next epoch run
```

### Example 3: GitLab Merge Request (NEW!)

```
1. Developer creates MR: "PROJ-456: Add user dashboard"
         ↓
2. GitLab sends webhook to /webhooks/gitlab
         ↓
3. mapGitLab() processes payload:
   - Object kind: "merge_request"
   - Extract issue keys from title and description
   - Get merge status, changes count, labels
         ↓
4. Event created and saved
         ↓
5. OR sync later via /sync/project:
   - Jira provides basic info
   - GitLab API enriches with details
   - More accurate metrics
         ↓
6. Scored and processed in epoch
```

## Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   .env Configuration                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  # Database                                                 │
│  DATABASE_URL=postgresql://...                             │
│                                                             │
│  # GitHub                                                   │
│  GITHUB_WEBHOOK_SECRET=secret123                           │
│  GITHUB_API_TOKEN=ghp_xxxxx          [NEW!]               │
│                                                             │
│  # GitLab                                                   │
│  GITLAB_API_TOKEN=glpat_xxxxx        [NEW!]               │
│  GITLAB_BASE_URL=https://gitlab.com/api/v4  [NEW!]        │
│                                                             │
│  # Jira                                                     │
│  JIRA_BASE_URL=https://domain.atlassian.net  [NEW!]       │
│  JIRA_EMAIL=user@example.com        [NEW!]                │
│  JIRA_API_TOKEN=xxxxx               [NEW!]                │
│  JIRA_SHARED_SECRET=xxxxx                                  │
│                                                             │
│  # AWS S3                                                   │
│  AWS_REGION=us-east-1                                      │
│  AWS_S3_BUCKET=bucket-name                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                services/api/src/config.ts                    │
│  • Loads environment variables                              │
│  • Type-safe configuration object                           │
│  • Exported to all services                                 │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│              Used by service classes                         │
│  • JiraIntegrationService                                   │
│  • GitHubClient                                             │
│  • GitLabClient                                             │
│  • DataSyncService                                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Interactions

```
┌──────────────────────────────────────────────────────────────┐
│                    DataSyncService                            │
│                                                              │
│  Uses:                                                       │
│  ├─ JiraIntegrationService                                  │
│  │   └─ Fetches issues and dev info                        │
│  │                                                           │
│  ├─ GitHubClient                                            │
│  │   └─ Enriches GitHub commits and PRs                    │
│  │                                                           │
│  └─ GitLabClient                                            │
│      └─ Enriches GitLab commits and MRs                    │
│                                                              │
│  Outputs: Normalized events → Database                      │
└──────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Provider Abstraction
- Each provider (GitHub/GitLab) has its own client
- Common interface through event mappers
- Easy to add new providers

### 2. Two-Stage Data Collection
- **Stage 1**: Webhooks for real-time (basic data)
- **Stage 2**: Jira sync for enrichment (detailed metrics)

### 3. Idempotent Operations
- Events use `upsert` (no duplicates)
- Safe to run sync multiple times
- Late-arriving webhooks handled correctly

### 4. Graceful Degradation
- Works without API tokens (uses basic webhook data)
- Works without Jira (webhook-only mode)
- Continues on partial failures

### 5. Modular Architecture
- Each service is independent
- Easy to test and maintain
- Clear separation of concerns

## File Map

```
services/api/src/
│
├── mappers/                    # Convert provider payloads to events
│   ├── github.ts              # GitHub webhook mapper
│   ├── gitlab.ts              # GitLab webhook mapper [NEW!]
│   ├── jira.ts                # Jira webhook mapper
│   ├── bitbucket.ts           # Bitbucket webhook mapper
│   └── ci.ts                  # CI/CD webhook mapper
│
├── services/                   # Business logic services
│   ├── jira-integration.ts    # Jira API client [NEW!]
│   ├── github-client.ts       # GitHub API client [NEW!]
│   ├── gitlab-client.ts       # GitLab API client [NEW!]
│   ├── data-sync.ts           # Sync orchestration [NEW!]
│   ├── normalizer.ts          # Feature normalization
│   ├── scorer.ts              # Event scoring
│   ├── state.ts               # Contributor state management
│   ├── orchestrator.ts        # Epoch orchestration
│   └── issuer.ts              # Equity issuance
│
├── routes/                     # API endpoints
│   ├── webhooks.ts            # Webhook receivers (updated)
│   ├── sync.ts                # Sync endpoints [NEW!]
│   ├── ui.ts                  # UI data endpoints
│   ├── admin.ts               # Admin operations
│   ├── policy.ts              # Policy management
│   └── index.ts               # Route aggregation (updated)
│
├── lib/                        # Utilities
│   ├── signatures.ts          # Webhook signature verification
│   ├── s3.ts                  # S3 operations
│   ├── policy.ts              # Policy parsing
│   ├── ema.ts                 # Exponential moving average
│   └── math.ts                # Math utilities
│
├── db/
│   └── client.ts              # Prisma client
│
├── middleware/
│   └── rawBody.ts             # Raw body capture for signatures
│
├── config.ts                   # Configuration (updated)
└── index.ts                    # App entry point
```

## Next Steps

### For Implementation
✅ All core components implemented
✅ All routes created
✅ Configuration updated
✅ Documentation complete

### For Deployment
1. Set environment variables
2. Deploy API service
3. Configure webhooks in GitHub/GitLab/Jira
4. Run initial sync
5. Monitor logs

### For Usage
1. Test Jira connection
2. Sync historical data
3. Set up regular sync schedule
4. Configure webhooks for real-time updates
5. Monitor dashboard

## Summary

This architecture provides:
- ✅ Real-time event capture via webhooks
- ✅ Historical data sync via Jira integration
- ✅ Detailed metric enrichment via provider APIs
- ✅ Unified event normalization
- ✅ Comprehensive DEE algorithm processing
- ✅ Multiple data access patterns
- ✅ Flexible and extensible design

**The system is production-ready!** 🚀

