# CodeGraph UW - Quick Start

Get up and running in 5 minutes!

## Step 1: Get Gemini API Key (2 min)

1. Visit https://ai.google.dev
2. Click "Get API Key"
3. Copy your key

## Step 2: Install & Build (1 min)

```bash
cd DEE-Demo
npm install
npm run build
```

## Step 3: Configure & Deploy (2 min)

```bash
# Set your Gemini API key (creates development environment if needed)
forge variables set GEMINI_API_KEY AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0

# Verify it was set
forge variables list

# Deploy
forge deploy

# Install to your Jira site
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

Replace `YOUR-SITE` with your Atlassian workspace name.

## Step 4: Use It!

1. Open any Jira project
2. Click **"DEE Demo"** in the left sidebar
3. Go to **"Upload Code"** tab
4. Upload a code file or paste code
5. Click **"Analyze Code"**
6. View your knowledge graph!

## What You Just Built

**CodeGraph UW** is a Forge app that:
- Analyzes code using Google's Gemini Flash AI
- Creates an interactive knowledge graph (like Logseq/Obsidian for code)
- Shows dependencies, function calls, and code structure
- Helps teams understand codebases and delegate tasks

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│  Jira Project Page (React UI)          │
│  - Upload code files                    │
│  - View interactive graph (Cytoscape)   │
│  - Click nodes to see details           │
└─────────────┬───────────────────────────┘
              │ @forge/bridge
              │ invoke('main-resolver')
              ▼
┌─────────────────────────────────────────┐
│  Forge Resolver (Node.js 20.x)          │
│  - /analyze: Send code to Gemini        │
│  - /graph: Get stored graph             │
│  - /clear: Reset graph                  │
└─────────────┬───────────────────────────┘
              │
        ┌─────┴──────┐
        ▼            ▼
   ┌────────┐   ┌──────────────┐
   │ Gemini │   │ Forge Storage│
   │  Flash │   │ (key-value)  │
   │   API  │   │              │
   └────────┘   └──────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `manifest.yml` | Forge app config (permissions, modules) |
| `backend/resolvers.js` | Backend logic + Gemini integration |
| `ui/src/App.jsx` | Main UI with tabs |
| `ui/src/components/CodeUpload.jsx` | Upload interface |
| `ui/src/components/GraphView.jsx` | Cytoscape graph renderer |

## Next Steps

### Analyze Your Codebase

Upload multiple files to build a complete graph:
1. Start with entry points (main.js, index.js, App.jsx)
2. Add core modules
3. Add utilities and helpers
4. Watch the graph grow!

### Customize the Analysis

Edit `backend/resolvers.js:13-37` to change the Gemini prompt:
- Extract different metadata
- Add language-specific analysis
- Focus on security/performance

### Extend the UI

Add features to `ui/src/App.jsx`:
- **Search**: Find nodes by name/type
- **Filters**: Show only files/functions/classes
- **Layouts**: Add circular, grid, hierarchical views
- **Export**: Download graph as JSON/PNG

### Integrate with Jira

Add to `backend/resolvers.js`:
- Create Jira issues from code blocks
- Link issues to graph nodes
- Assign based on code ownership

## Development Tips

### Live Development

```bash
forge tunnel
```

Make changes to resolvers.js and test immediately (no redeployment needed).

### UI Changes

```bash
npm run build
forge deploy
```

Required after changing React components.

### Debug Logs

In `backend/resolvers.js`:
```javascript
console.log('Debug info:', data);
```

View logs:
```bash
forge logs
```

## Common Issues

**Q: "GEMINI_API_KEY not set"**
```bash
forge variables:set GEMINI_API_KEY your_key
forge deploy
```

**Q: Graph is empty**
- Go to **Upload Code** tab
- Analyze at least one file
- Check **Status** tab → Ping Resolver

**Q: Build fails**
```bash
rm -rf node_modules
npm install
npm run build
```

## Learn More

- Full docs: See `CODEGRAPH_SETUP.md`
- Forge docs: https://developer.atlassian.com/platform/forge/
- Gemini API: https://ai.google.dev/docs
- Cytoscape: https://js.cytoscape.org/

## Support

Need help? Check:
1. **Status tab** in the app (Ping Resolver)
2. **Browser console** (F12)
3. **Forge logs** (`forge logs`)
4. **Gemini API quota** (15 req/min free tier)

---

**Built for DubHacks 2025**
Transform collaboration at the University of Washington with AI-powered codebase visualization!
