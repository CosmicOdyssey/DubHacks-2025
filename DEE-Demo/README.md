# CodeGraph Demo (Dev)

CodeGraph Demo (Dev) is an Atlassian Forge project page that turns GitHub repositories into an interactive knowledge graph. Install it in Jira to fetch a GitHub repository, analyze up to 50 files with Gemini, and explore the resulting nodes, edges, and metadata inside a single project page.

The bundle served to Forge lives directly in `static/ui/`. Update those files (HTML, CSS, JS, config) when you need to tweak the UI, then redeploy with the Forge CLI.

## Quick Start

```bash
git clone https://github.com/ansonchen/DubHacks-2025.git
cd DubHacks-2025/DEE-Demo
npm install
```

1. Edit `static/ui/config.js` and provide your GitHub token and Gemini API key (never commit real secrets).
2. Deploy the backend + UI:

   ```bash
   forge lint
   forge deploy
   forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
   ```

3. Open any Jira project and select **CodeGraph Demo (Dev)** in the left sidebar to launch the analyzer.

## Useful Commands

```bash
forge tunnel   # Live backend testing without redeploying
forge logs     # Tail resolver logs
forge deploy   # Push latest backend + UI bundle
forge uninstall --site <SITE> --product jira --environment <ENV>
```

## Project Layout

- `static/ui/` – Forge-served HTML/CSS/JS bundle (edit here for UI changes)
- `backend/` & `src/backend/` – resolver implementation
- `manifest.yml` – Forge app definition

## Notes

- The frontend uses plain HTML + D3 and reads secrets from `static/ui/config.js` at runtime.
- The resolver (`src/backend/resolvers.js`) currently offers a `/ping` endpoint; add additional paths as needed.
- Keep secrets out of version control. Rotate tokens by updating `static/ui/config.js` before redeploying.
