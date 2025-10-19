# CodeGraph UW (Forge App)

CodeGraph UW is an Atlassian Forge project page that turns GitHub repositories into an interactive knowledge graph. The UI mirrors the Obsidian-style prototype found in `local-test/index-v2.html`: paste a repo URL, watch live analysis progress, then explore the resulting nodes, edges, and file tree directly inside Jira.

## Tech Stack

- **Runtime:** Atlassian Forge (Node.js 20.x)
- **Frontend:** Static HTML/Vanilla JS copied from `local-test/index-v2.html`
- **Graph Rendering:** Cytoscape.js (via CDN in the frontend)
- **Backend:** Forge resolver (`backend/resolvers.js`) for legacy graph storage & Gemini usage
- **AI Analysis:** Google Gemini Flash via `generativelanguage.googleapis.com`

## Directory Overview

- `backend/resolvers.js` – Forge resolver handling `/ping`, `/graph`, `/analyze`, `/clear`
- `local-test/index-v2.html` & `app-v2.js` – Source of the deployable UI
- `scripts/` – Utility scripts for building and serving the UI (`build-index-v2.mjs`, `serve-index-v2.mjs`)
- `static/ui/` – Generated Forge bundle (created by `npm run build`, ignored in git)
- `FORGE_DEPLOYMENT_GUIDE.md` – End-to-end Forge deployment instructions
- `CODEGRAPH_SETUP.md` – Architecture and customization reference

## Prerequisites

- Node.js 18+ (Forge runtime uses Node.js 20.x)
- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Jira Cloud site where you have admin access
- Gemini API key from [Google AI Studio](https://ai.google.dev/)
- (Optional) GitHub personal access token if you need higher rate limits

## Quick Start

```bash
cd DEE-Demo
npm install
npm run dev   # optional: serves http://localhost:8000/index-v2.html for local testing
npm run build # copies local-test assets into static/ui/
forge variables set GEMINI_API_KEY your_api_key_here
forge deploy
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

After installation, open any Jira project and select **CodeGraph UW** in the left sidebar. You should see the repository analyzer UI with the GitHub URL input, progress bar, file list, and interactive graph.

## Useful Scripts & Commands

- `npm run dev` – Serve `local-test/index-v2.html` on <http://localhost:8000/>
- `npm run build` – Copy `index-v2.html` + `app-v2.js` into `static/ui/` for Forge deployment
- `npm run preview` – Serve the built `static/ui` bundle on <http://localhost:4173/>
- `forge tunnel` – Live backend testing without redeploying
- `forge deploy` – Push backend + UI bundle to your Forge environment
- `forge logs` – Tail resolver logs for debugging

## Next Steps

- Follow `FORGE_DEPLOYMENT_GUIDE.md` for a full deployment walkthrough
- Review `CODEGRAPH_SETUP.md` to understand storage patterns and potential customizations
- Harden secrets: move API keys out of the frontend and into Forge variables/resolvers before production use
- Extend `app-v2.js` to call the Forge resolver instead of hitting Gemini/GitHub directly from the browser if you need stronger security
