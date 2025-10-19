# CodeGraph UW - Setup Guide

## Overview

CodeGraph UW is an AI-powered knowledge graph visualization tool built on Atlassian Forge. It uses Google's Gemini Flash API to analyze code files, extract semantic relationships, and build an interactive graph showing how different parts of your codebase connect.

## Features

- **AI-Powered Analysis**: Uses Gemini Flash to understand code structure, dependencies, and concepts
- **Interactive Graph Visualization**: Built with Cytoscape.js for exploring code relationships
- **Block-Based Architecture**: Similar to Logseq/Obsidian, breaks code into semantic chunks
- **Team Collaboration**: Helps understand codebases and delegate tasks effectively
- **Jira Integration**: Built directly into Jira project pages

## Prerequisites

1. **Atlassian Forge CLI** installed
2. **Google Gemini API Key** (free tier available at https://ai.google.dev)
3. **Jira Cloud** workspace with admin access

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key (you'll need it in step 3)

### 2. Install Dependencies

```bash
cd DEE-Demo
npm install
```

### 3. Configure API Keys

```bash
cd DEE-Demo
cp config.example.js config.js
# Edit config.js and add your GitHub token and Gemini API key
```

**Important:** `config.js` is gitignored for security. Never commit API keys to version control.

### 4. Deploy to Forge

```bash
forge lint && forge deploy
```

### 5. Install to Your Jira Site

```bash
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

Replace `YOUR-SITE` with your Atlassian site name.

### 6. Access the App

1. Go to any Jira project
2. In the left sidebar, click **"DEE Demo"** (or **"CodeGraph UW"**)
3. You should see the CodeGraph interface with three tabs:
   - **Knowledge Graph**: View the interactive graph
   - **Upload Code**: Analyze new code files
   - **Status**: Check system health

## How to Use

### Analyzing Code

1. Click the **"Upload Code"** tab
2. Either:
   - Click "Upload File" to select a code file from your computer
   - Or paste code directly into the textarea
3. Enter a filename (e.g., `App.jsx`, `main.py`)
4. Click **"Analyze Code"**
5. Wait for Gemini to process (typically 2-10 seconds)
6. The app will automatically switch to the **"Knowledge Graph"** tab

### Viewing the Graph

- **Nodes** represent:
  - Blue: Files
  - Green: Functions
  - Red: Classes
  - Purple: Other code chunks
- **Edges** represent relationships:
  - IMPORTS: File dependencies
  - CONTAINS: File contains function/class
  - CALLS: Function calls
- **Interactions**:
  - Click a node to see details in the bottom panel
  - Drag nodes to rearrange the layout
  - Scroll to zoom in/out

### Building a Complete Graph

Analyze multiple files from your codebase. The graph will automatically:
- Merge duplicate nodes
- Connect related files
- Show the complete dependency structure

### Managing the Graph

- **Refresh**: Reload the graph from storage
- **Clear Graph**: Delete all nodes and edges (requires confirmation)

## Development Workflow

### Local Development with Hot Reload

```bash
forge tunnel
```

This allows you to:
- Make changes to `backend/resolvers.js` without redeploying
- Test API changes immediately
- Debug with console logs visible in the tunnel output

For UI changes, you still need to:
```bash
npm run build
```

### Testing the UI Locally (Without Forge)

```bash
npm run dev
```

Access at http://localhost:5173. Note: Backend resolvers won't work in this mode.

### Deploy After Changes

```bash
npm run build
forge deploy
```

## Architecture

### Data Flow

```
User uploads code
    ↓
React UI (CodeUpload.jsx)
    ↓
invoke('main-resolver', { path: '/analyze' })
    ↓
Backend (resolvers.js)
    ↓
Gemini Flash API (analyzeCodeWithGemini)
    ↓
Extract: title, purpose, dependencies, chunks, concepts
    ↓
Build graph structure (nodes + edges)
    ↓
Store in Forge storage (storage.set)
    ↓
Return graph to UI
    ↓
Render with Cytoscape.js (GraphView.jsx)
```

### Storage Schema

Graphs are stored in Forge storage with the key:
```
codegraph:{projectId}
```

Format:
```json
{
  "nodes": [
    {
      "id": "file:App.jsx",
      "type": "file",
      "label": "React Application Root",
      "data": { "filename": "App.jsx", "purpose": "...", "complexity": "medium" }
    }
  ],
  "edges": [
    {
      "source": "file:App.jsx",
      "target": "file:components/Header.jsx",
      "type": "IMPORTS",
      "label": "imports"
    }
  ],
  "metadata": {}
}
```

### Resolver Endpoints

| Path | Payload | Returns |
|------|---------|---------|
| `/ping` | - | Health check |
| `/analyze` | `{ code, filename, projectId }` | Analysis + updated graph |
| `/graph` | `{ projectId }` | Current graph data |
| `/clear` | `{ projectId }` | Clears graph |

## Gemini Prompt Engineering

The Gemini Flash model receives this prompt template (see `backend/resolvers.js:13-37`):

```
Analyze this code file and extract structured information:

Filename: {filename}
Code: {code}

Extract and return JSON with:
- "title": A concise name for this code block
- "purpose": Main responsibility (1-2 sentences)
- "dependencies": Array of imported modules/files
- "exports": Array of exported symbols
- "calls": Array of function calls
- "concepts": Domain concepts (e.g., "authentication", "database")
- "complexity": low/medium/high
- "chunks": Array of logical code chunks with type, name, summary, line ranges
```

You can customize this prompt to:
- Extract different metadata
- Focus on specific languages
- Add custom analysis (e.g., security issues, performance bottlenecks)

## Future Enhancements

### Planned Features

1. **Jira Issue Integration**
   - Click node → "Create Issue" button
   - Auto-assign based on code ownership
   - Link issues to code blocks

2. **Multi-Repository Support**
   - Connect GitHub/Bitbucket repos
   - Auto-analyze on commits
   - Track changes over time

3. **Advanced Visualizations**
   - Heat maps (complexity, churn)
   - Cluster analysis (related modules)
   - Impact analysis (blast radius)

4. **Team Collaboration**
   - Show who owns which code
   - Suggest code reviewers
   - Delegation recommendations

5. **Export Options**
   - Generate Confluence documentation
   - Export as GraphML/JSON
   - Create architecture diagrams

### How to Extend

**Add a new resolver endpoint:**

Edit `backend/resolvers.js`:
```javascript
if (path === '/your-endpoint') {
  const { param } = payload || {};
  // Your logic here
  return { body: { ok: true, data: ... } };
}
```

**Add a new UI tab:**

Edit `ui/src/App.jsx`:
```jsx
<button onClick={() => setActiveTab('newtab')} style={tabStyle(activeTab === 'newtab')}>
  New Tab
</button>

// In content area:
{activeTab === 'newtab' && (
  <YourComponent />
)}
```

**Customize Gemini analysis:**

Edit the prompt in `backend/resolvers.js:13-37`.

## Troubleshooting

### "GEMINI_API_KEY environment variable not set"

Run:
```bash
forge variables:set GEMINI_API_KEY your_key_here
forge deploy
```

### Graph doesn't load

1. Check the **Status** tab → click "Ping Resolver"
2. If OK, try **Refresh** button
3. Check browser console for errors

### API quota exceeded

Gemini Flash has a free tier limit (15 requests/minute). Wait a minute or upgrade your API key.

### Build fails

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Forge deployment fails

```bash
forge lint
# Fix any errors, then:
forge deploy
```

## Support

For issues specific to:
- **Forge**: https://developer.atlassian.com/platform/forge/
- **Gemini API**: https://ai.google.dev/docs
- **Cytoscape.js**: https://js.cytoscape.org/

## License

MIT
