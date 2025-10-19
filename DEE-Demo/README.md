# CodeGraph UW (Forge App)

CodeGraph UW is an Atlassian Forge project page that turns uploaded source files into an interactive knowledge graph. Gemini Flash analyzes each file, the backend stores the resulting structure, and a React + Cytoscape UI renders the relationships directly inside Jira.

## Tech Stack

- **Runtime:** Atlassian Forge (Node.js 20.x)
- **Frontend:** Vite + React (`ui/`)
- **Graph Rendering:** Cytoscape.js (`ui/src/components/GraphView.jsx`)
- **Backend:** Forge resolver (`backend/resolvers.js`)
- **AI Analysis:** Google Gemini Flash via `generativelanguage.googleapis.com`

## Directory Overview

- `backend/resolvers.js` – Main Forge resolver (handles `/ping`, `/graph`, `/analyze`, `/clear`)
- `ui/` – React source; run Vite locally, build with `npm run build`
- `static/ui/` – Generated UI bundle served by Forge (do not edit by hand)
- `local-test/` – Standalone HTML/JS prototype used for quick UI iterations
- `FORGE_DEPLOYMENT_GUIDE.md` – End-to-end Forge deployment instructions
- `CODEGRAPH_SETUP.md` – Architecture and customization reference

## Prerequisites

- Node.js 18+ (Forge runtime uses Node.js 20.x)
- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Jira Cloud site where you have admin access
- Gemini API key from [Google AI Studio](https://ai.google.dev/)

## Quick Start

```bash
cd DEE-Demo
npm install
npm run build                           # creates static/ui
forge variables set GEMINI_API_KEY your_api_key_here
forge deploy
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

After installation, open any Jira project and select **CodeGraph UW** in the left sidebar. Use the **Upload Code** tab to analyze files and the **Knowledge Graph** tab to explore the results.

## Useful Scripts & Commands

- `npm run dev` – Start the Vite dev server for local UI work (no Forge backend)
- `npm run build` – Compile the React UI into `static/ui/`
- `npm run preview` – Preview the production build locally
- `forge tunnel` – Live-reload backend changes without redeploying
- `forge lint` – Validate the manifest and permissions before deploying
- `forge deploy` – Push backend/UI bundle to your Forge environment
- `forge install --site https://YOUR-SITE.atlassian.net --product jira` – Install or upgrade the app
- `forge logs` – Tail backend logs for debugging

## Next Steps

- Work through `FORGE_DEPLOYMENT_GUIDE.md` if you need a detailed deployment checklist
- Use `CODEGRAPH_SETUP.md` to understand architecture and storage
- Customize Gemini prompts or graph logic inside `backend/resolvers.js`
- Explore the Cytoscape component in `ui/src/components/GraphView.jsx` to tweak layout, colors, or interactions
