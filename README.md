# UW Code Graph Forge App

A Forge-powered Jira agent that ingests UW repositories, chunks code into blocks, enriches them with Gemini Flash summaries, and renders an interactive knowledge graph for delegation into Jira issues.

## Features

- Upload a ZIP archive or reference a Git URL (mock repos supported) from the Jira project page.
- Parse TypeScript/JavaScript, Python, and Java files to build a block graph with dependencies.
- Batch summarise blocks via Gemini Flash (mock client included for offline dev).
- Explore a Cytoscape-powered graph with search, filters, lasso/box selection, heatmaps, and exports.
- Generate heuristic task breakdowns and create Jira epics/tasks linked back to code blocks.
- Unit tests (Vitest) covering parsers and delegation logic.

## Prerequisites

- Node.js 18+
- Forge CLI (`npm install -g @forge/cli`)
- Atlassian site with Jira Cloud admin access

## Setup

```bash
cd forge-uw-code-graph
npm install
# Install custom-ui deps
cd src/custom-ui/webapp
npm install
cd ../../..
```

### Configure Secrets

Set environment variables before running Forge commands:

```bash
export GEMINI_API_KEY="your-gemini-key"   # optional; mock client used when absent
export GIT_TOKEN="your-token"             # optional; enables real Git fetch flows
export DEFAULT_OWNER="uw-englead@uw.edu"  # optional; fallback owner for tasks
export MOCK_JIRA="true"                   # optional; local dev without real issue creation
```

### Register & Deploy

```bash
forge login
forge register
forge deploy
deployment: forge deploy --environment development
forge install --product jira
```

During development you can stream resolver logs and custom UI with:

```bash
forge tunnel
npm run ui:dev
```

The custom UI runs on Vite; Forge tunnel proxies requests so graph pages render live.

## Usage

1. In Jira, open the **UW Code Graph** project page module.
2. Provide a repo label and Git URL (or paste a base64 ZIP) and click **Ingest Repository**.
3. Once parsing finishes, run **Run Gemini Analysis** to enrich blocks with summaries/tags.
4. Launch the custom UI explorer (left nav link) to visualise the graph, filter, and select nodes.
5. Click **Suggest work** to generate an epic + tasks; confirm with **Create Jira issues**.
6. Open any linked issue to see the **UW Code Blocks** glance with block context and a deep link back to the graph.

## Mock Data

A sample repository is bundled under `fixtures/mock-repos/sample`. Use `https://github.com/uw/mock-sample.git` (any value ending in `sample.git`) to exercise ingest without external Git access.

## Testing & Linting

```bash
npm run test
npm run lint
```

The test suite stubs Forge storage/secrets and validates parser extraction plus delegation grouping heuristics.

## Privacy & Security Notes

- Source snippets are stored via Forge secrets and capped at 8k chars for analysis.
- Gemini requests fall back to a deterministic mock client when no API key is configured, ensuring no code exits the tenant by default.
- Block metadata persists encrypted within Forge storage; optional remote storage can be enabled via the placeholder `remotes` entry in `manifest.yml`.

## Accessibility & A11y

- The graph supports keyboard selection (box select with Shift+drag) and high-contrast palette.
- Controls include text inputs and toggles with proper labels for screen readers.

## Troubleshooting

- Ensure `forge tunnel` is running when developing the custom UI locally.
- If custom UI routes 404, confirm the module key `uw-code-graph-explorer` is installed and use the URL `/jira/forge/apps/uw-code-graph-explorer/graph`.
- Use `export MOCK_JIRA="true"` to prevent accidental issue creation while testing.
