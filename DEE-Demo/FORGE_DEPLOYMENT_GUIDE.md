# CodeGraph UW – Forge Deployment Guide

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

## 3. Configure API Keys

Create the config file from the template and add your API keys:

```bash
cd DEE-Demo
cp config.example.js config.js
# Edit config.js and add your GitHub token and Gemini API key
```

The `config.js` file is used by both the frontend and backend for API authentication.

## 4. Deploy to Forge

```bash
forge lint
forge deploy
```

- `forge lint` checks the manifest for common errors (scopes, modules, etc.).
- `forge deploy` uploads the backend and the newly built UI bundle to your Forge environment.

## 5. Install the App in Jira

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

## 6. Verify in Jira

1. Open Jira at `https://YOUR-SITE.atlassian.net`.
2. Navigate to any project.
3. Look for **CodeGraph UW** in the left sidebar and open it.
4. Verify that the repository analyzer interface loads (purple header, repo URL input, sidebar file tree, and graph canvas).

## 8. Smoke Test the Analyzer

1. Enter a public GitHub repository URL (the default demo repo works too).
2. Click **🔍 Analyze Repository**.
3. Watch the live progress bar as files are fetched and analyzed.
4. Once complete, explore the interactive graph and file list.

## 9. Troubleshooting

- **`GEMINI_API_KEY not set`** – Re-run `forge variables set GEMINI_API_KEY your_api_key_here`, then `forge deploy`.
- **App missing in Jira** – Reinstall with `forge install --upgrade ...` or uninstall/reinstall to refresh permissions.
- **Graph stays empty** – Confirm the GitHub URL is public, check the browser console for rate-limit errors, and retry.
- **Backend errors** – Run `forge logs` to tail resolver output.
- **UI changes not appearing** – Rebuild the UI (`npm run build`) before the next `forge deploy`.

## 10. Useful Commands Reference

```bash
npm run dev              # Serve local-test/index-v2.html on http://localhost:8000/
npm run build            # Copy index-v2 assets into static/ui/ for Forge
forge tunnel             # Live backend testing without redeploying
forge deploy             # Push latest backend + UI bundle
forge logs               # Tail resolver logs
forge uninstall ...      # Remove installation from Jira
```

You now have CodeGraph UW deployed in Jira. Repeat steps 4–6 whenever you make UI or backend changes that need to go live.
