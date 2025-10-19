# Setup Instructions for CodeGraph UW

Some Forge commands still require manual confirmation, so keep this checklist handy while preparing a fresh environment.

## Step-by-Step Commands

Run each command from your terminal:

```bash
# 1. Navigate to the Forge app
cd /path/to/DubHacks-2025/DEE-Demo

# 2. Install dependencies
npm install

# 3. Store your Gemini API key in the Forge environment
forge variables set GEMINI_API_KEY your_api_key_here

# 4. Confirm the variable exists
forge variables list

# 5. Build the React UI bundle
npm run build

# 6. Lint and deploy
forge lint
forge deploy

# 7. Install the app in Jira
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

Replace `your_api_key_here` with the key from Google AI Studio and `YOUR-SITE` with your Atlassian domain.

## What to Expect

- **`forge variables set`** prompts for an environment name the first time (e.g., `development`).
- **`npm run build`** creates `static/ui/`—you should see Vite's build summary.
- **`forge deploy`** confirms the environment before uploading the bundle.
- **`forge install`** asks you to pick the environment and accept permissions.

## Verify the Installation

1. Open Jira at `https://YOUR-SITE.atlassian.net`.
2. Go to any project and select **CodeGraph UW** in the left sidebar.
3. You should see the header, tabs for **Knowledge Graph**, **Upload Code**, and **Status**, and an empty state if no files were analyzed yet.

## First Test

1. Open the **Upload Code** tab.
2. Upload or paste a small code sample.
3. Provide a filename (for example, `hello-world.js`).
4. Click **Analyze Code**.
5. After a few seconds the app switches to **Knowledge Graph** with the analyzed nodes/edges.

## Troubleshooting

- **Missing API key error:** re-run `forge variables set GEMINI_API_KEY your_api_key_here` and deploy again.
- **No graph shows up:** use the **Status** tab and click **Ping Resolver**; expect `{ "ok": true }`.
- **Deployment errors:** run `forge lint` to surface manifest issues, then redeploy.

## Need More Detail?

- `QUICKSTART.md` – condensed guide for experienced Forge users
- `CODEGRAPH_SETUP.md` – architecture, storage schema, and data flow
- `DEPLOY_NOW.md` – last-minute deployment checklist
