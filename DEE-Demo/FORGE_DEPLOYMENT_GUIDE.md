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

`npm install` pulls dependencies for both the Forge backend and the React UI.

## 3. Configure Secrets

Store your Gemini key in the Forge environment (only needed once per environment):

```bash
forge variables set GEMINI_API_KEY your_api_key_here
```

- The first time you run this command Forge asks for an environment name. Use something like `development`.
- Verify the variable is present:

```bash
forge variables list
```

You should see `GEMINI_API_KEY` listed for your chosen environment.

## 4. Build the React UI

Forge serves the compiled UI from `static/ui/`, so build it before deploying:

```bash
npm run build
```

Expect Vite to report a successful build and generate assets under `static/ui/`.

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
3. Look for **CodeGraph UW** in the left sidebar and open it.
4. Ensure the **Knowledge Graph**, **Upload Code**, and **Status** tabs render correctly.

## 8. Smoke Test the Analyzer

1. Switch to the **Upload Code** tab.
2. Paste a small snippet (e.g., a simple React component).
3. Enter a filename like `hello-world.jsx`.
4. Click **Analyze Code**.
5. After a few seconds the view should switch to **Knowledge Graph** and display the new nodes/edges.

## 9. Troubleshooting

- **`GEMINI_API_KEY not set`** – Re-run `forge variables set GEMINI_API_KEY your_api_key_here`, then `forge deploy`.
- **App missing in Jira** – Reinstall with `forge install --upgrade ...` or uninstall/reinstall to refresh permissions.
- **Graph stays empty** – Use the **Status** tab and click **Ping Resolver**. A healthy response is `{ "ok": true }`.
- **Backend errors** – Run `forge logs` to tail resolver output.
- **UI changes not appearing** – Rebuild the UI (`npm run build`) before the next `forge deploy`.

## 10. Useful Commands Reference

```bash
npm run dev              # Vite dev server (frontend only)
npm run build            # Build UI into static/ui/
forge tunnel             # Live backend testing without redeploying
forge deploy             # Push latest backend + UI bundle
forge logs               # Tail resolver logs
forge uninstall ...      # Remove installation from Jira
```

You now have CodeGraph UW deployed in Jira. Repeat steps 4–6 whenever you make UI or backend changes that need to go live.
