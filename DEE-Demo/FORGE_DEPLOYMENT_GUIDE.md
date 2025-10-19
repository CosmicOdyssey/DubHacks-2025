# CodeGraph Demo (Dev) – Forge Deployment Guide

This guide walks you from a clean checkout to a fully installed Atlassian Forge app in Jira.

## 1. Prerequisites

- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Access to a Jira Cloud site with admin permissions
- Google Gemini API key from [Google AI Studio](https://ai.google.dev/)
- Node.js 18+ installed locally (Forge runtime uses Node.js 20.x)

## 2. Clone & Install Dependencies

```bash
git clone https://github.com/ansonchen/DubHacks-2025.git
cd DubHacks-2025/DEE-Demo
npm install
```

`npm install` pulls dependencies for the backend resolver and utility scripts.

## 3. Configure Secrets

All secrets live in a single config file. Edit `local-test/config.js` (never commit real keys):

```js
export const CONFIG = {
  GITHUB_TOKEN: 'your_github_pat',
  GEMINI_API_KEY: 'your_gemini_key'
};
```

This file is copied into `static/ui/config.js` during the build so the Forge iframe can authenticate GitHub and Gemini requests. Rotate tokens by updating this file and rebuilding.

## 4. Build the Forge UI

Forge serves static files from `static/ui/`. Run the helper script to copy the latest prototype bundle (HTML, JS, CSS, config, D3) from `local-test/` into that folder:

```bash
node scripts/build-index-v2.mjs
```

You should see log output confirming that `index-v2.html`, `app-v2.js`, `styles.css`, `d3.min.js`, and `config.js` were copied into `static/ui/`.

## 5. Lint & Deploy to Forge

```bash
forge lint
forge deploy
```

- `forge lint` checks the manifest for common errors (scopes, modules, etc.).
- `forge deploy` uploads the backend and the newly built UI bundle to your Forge environment.

## 6. Install the App in Jira

```bash
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

Replace `YOUR-SITE` with your Atlassian site name. During installation:

- Choose the environment you created (e.g., `development`).
- Accept the permission prompt.

If you need to remove a previous install first:

```bash
forge uninstall --site https://YOUR-SITE.atlassian.net --product jira --environment ENV_NAME
```

## 7. Verify in Jira

1. Open Jira at `https://YOUR-SITE.atlassian.net`.
2. Navigate to any project.
3. Look for **CodeGraph Demo (Dev)** in the left sidebar and open it.
4. Verify that the repository analyzer interface loads (purple header, repo URL input, sidebar file tree, and graph canvas).

## 8. Smoke Test the Analyzer

1. Enter a public GitHub repository URL (the default demo repo works too).
2. Click **🔍 Analyze Repository**.
3. Watch the live progress bar as files are fetched and analyzed.
4. Once complete, explore the interactive graph and file list.

## 9. Troubleshooting

- **`CONFIG not found`** – Check that `static/ui/config.js` exists. Re-run `node scripts/build-index-v2.mjs` to copy `local-test/config.js` before deploying.
- **App missing in Jira** – Reinstall with `forge install --upgrade ...` or uninstall/reinstall to refresh permissions.
- **Graph stays empty** – Confirm the GitHub URL is public, check the browser console for rate-limit errors, and retry.
- **Backend errors** – Run `forge logs` to tail resolver output.
- **UI changes not appearing** – Re-run `node scripts/build-index-v2.mjs` before the next `forge deploy`.

## 10. Useful Commands Reference

```bash
npm run dev                  # Serve local-test/index-v2.html on http://localhost:8000/
node scripts/build-index-v2.mjs  # Copy local-test assets into static/ui/ for Forge
forge tunnel                 # Live backend testing without redeploying
forge deploy                 # Push latest backend + UI bundle
forge logs                   # Tail resolver logs
forge uninstall ...          # Remove installation from Jira
```

You now have CodeGraph Demo (Dev) deployed in Jira. Repeat steps 4–6 whenever you make UI or backend changes that need to go live.
