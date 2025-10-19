<<<<<<< Updated upstream
# DEE Demo (Forge Jira Project Page)# DEE Demo

=======
# CodeGraph Demo (Dev)

CodeGraph Demo (Dev) is an Atlassian Forge project page that turns GitHub repositories into an interactive knowledge graph. The UI mirrors the Obsidian-style prototype found in `local-test/index-v2.html`: paste a repo URL, watch live analysis progress, then explore the resulting nodes, edges, and file tree directly inside Jira.
>>>>>>> Stashed changes


This app is an Atlassian Forge app for Jira Cloud. It uses a Custom UI built with Vite + React and a backend resolver.Steps to build and deploy the app (exact):



## Quick start1. Install dependencies:



- Install dependencies```bash

- Build static UI to `static/ui`npm install

- Lint and deploy via Forge```



## Scripts2. Build UI (creates `static/ui`):



- `npm run dev` – run Vite dev server (local only)```bash

- `npm run build` – build UI into `static/ui`npm run build

- `npm run preview` – preview the built UI locally```



## Atlassian Forge3. Ensure `manifest.yml` has `runtime.name: nodejs20` and the correct `app.id` (replace placeholder when ready).



- Manifest: `manifest.yml`4. Lint, deploy and install to your Jira site:

- Backend function: `src/backend/resolvers.js` exports `handler`

- Jira module: `jira:projectPage` using resource `ui` and resolver `main-resolver````bash

forge lint && forge deploy && forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira

```

<<<<<<< Updated upstream
5. For local development with tunnelling:
=======
After installation, open any Jira project and select **CodeGraph Demo (Dev)** in the left sidebar. You should see the repository analyzer UI with the GitHub URL input, progress bar, file list, and interactive graph.
>>>>>>> Stashed changes

```bash
forge tunnel
```

Notes:

- The frontend uses `@forge/bridge` to invoke the resolver function named `main-resolver`.
- The resolver is implemented at `src/backend/resolvers.js` and responds with a simple JSON at ping.
- Do NOT commit any secret values. Keep `app.id` as the placeholder until you have your app registered.

