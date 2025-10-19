# DubHacks-2025

This repository contains the **CodeGraph UW** Atlassian Forge application built for DubHacks 2025. The app analyzes uploaded source files with Google's Gemini API and renders an interactive knowledge graph directly inside Jira.

## Project Layout

- `DEE-Demo/` – Forge app source (backend resolver, React UI, docs)
- `DEE-Demo/local-test/` – Static prototype used for quick UI experiments
- `DEE-Demo/static/ui/` – Generated bundle that Forge serves (created by `npm run build`)

## Getting Started

Most day-to-day work happens inside `DEE-Demo/`. The fastest way to get up and running:

```bash
cd DEE-Demo
npm install
npm run build
forge variables set GEMINI_API_KEY your_api_key_here
forge deploy
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

After installation, open any Jira project and select **CodeGraph UW** from the left navigation to view the knowledge graph, upload code, or check status.

## Documentation

- `DEE-Demo/FORGE_DEPLOYMENT_GUIDE.md` – End-to-end instructions for deploying to Atlassian Forge
- `DEE-Demo/CODEGRAPH_SETUP.md` – Architecture, data flow, and customization reference

Use these guides for environment setup, deployment, and deeper technical context.
