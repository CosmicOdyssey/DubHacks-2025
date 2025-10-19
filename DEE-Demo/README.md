# CodeGraph UW (Forge App)

CodeGraph UW is an Atlassian Forge project page that turns GitHub repositories into an interactive knowledge graph. Paste a repo URL, watch live analysis progress, then explore the resulting nodes, edges, and file tree directly inside Jira.

## Tech Stack

- **Runtime:** Atlassian Forge (Node.js 20.x)
- **Frontend:** Static HTML/Vanilla JS in `static/ui/`
- **Graph Rendering:** Cytoscape.js
- **Backend:** Forge resolver (`backend/resolvers.js`) for Gemini AI analysis
- **AI Analysis:** Google Gemini Flash via `generativelanguage.googleapis.com`

## Directory Overview

- `backend/resolvers.js` – Forge resolver handling `/ping`, `/graph`, `/analyze`, `/clear`
- `static/ui/` – UI bundle deployed to Forge
- `config.js` – API keys configuration (gitignored)
- `config.example.js` – Template for API keys
- `FORGE_DEPLOYMENT_GUIDE.md` – End-to-end Forge deployment instructions
- `CODEGRAPH_SETUP.md` – Architecture and customization reference

## Prerequisites

- Node.js 18+ (Forge runtime uses Node.js 20.x)
- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Jira Cloud site where you have admin access
- Gemini API key from [Google AI Studio](https://ai.google.dev/)
- GitHub personal access token from [GitHub Settings](https://github.com/settings/tokens)

## Quick Start

```bash
cd DEE-Demo
npm install

# Configure API keys
cp config.example.js config.js
# Edit config.js and add your GitHub token and Gemini API key

# Deploy to Forge
forge deploy
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

After installation, open any Jira project and select **CodeGraph UW** in the left sidebar. You should see the repository analyzer UI with the GitHub URL input, progress bar, file list, and interactive graph.

## Useful Commands

- `forge tunnel` – Live backend testing without redeploying
- `forge deploy` – Push backend + UI bundle to your Forge environment
- `forge logs` – Tail resolver logs for debugging
- `forge install --upgrade` – Update installed app in Jira

## Next Steps

- Follow `FORGE_DEPLOYMENT_GUIDE.md` for a full deployment walkthrough
- Review `CODEGRAPH_SETUP.md` to understand storage patterns and potential customizations
- Extend functionality by modifying `backend/resolvers.js` and `static/ui/app-v2.js`
