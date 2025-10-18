## 🎉 CodeGraph UW V2 - Repository Analyzer

### What's New

This enhanced version can analyze **entire GitHub repositories** and creates an **Obsidian-style interactive knowledge graph**!

### Features

✨ **GitHub Repository Import**
- Paste any GitHub repository URL
- Automatically fetches all code files
- Supports multiple languages (JS, TS, Python, Java, Go, Rust, C/C++)

🎨 **Obsidian-Style Graph**
- Dark theme matching Obsidian
- Physics-based layout with smooth animations
- Draggable nodes that affect nearby nodes
- Color-coded by file type
- Border colors show complexity

🌳 **File Tree Browser**
- Left sidebar shows all analyzed files
- Click to highlight and zoom to specific files
- See repository structure at a glance

📊 **Live Analysis Progress**
- Real-time progress bar
- See which file is being analyzed
- Stats showing files/nodes/edges

### How to Use

1. **Start the server:**
   ```bash
   cd /Users/ansonchen/Documents/GitHub/DubHacks-2025/DEE-Demo/local-test
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/index-v2.html
   ```

3. **Analyze a repository:**
   - Default: `https://github.com/facebook/react` (already filled in)
   - Or enter any GitHub repo URL
   - Click "🔍 Analyze Repository"
   - Wait for analysis (20 files = ~30 seconds with rate limiting)

### Obsidian-Style Physics

The graph uses a **force-directed layout** just like Obsidian:

- **Drag nodes**: Click and drag any node - nearby nodes will move with it
- **Zoom**: Scroll to zoom in/out
- **Pan**: Click and drag the background
- **Click nodes**: See details in bottom-right panel
- **Auto-layout**: Nodes organize themselves based on connections

### Node Colors

- 🟣 **Purple**: Components (React, Vue, etc.)
- 🔵 **Cyan**: Utilities
- 🟢 **Green**: Services/APIs
- ⚪ **Gray**: Dependencies (imported libraries)
- 🔵 **Blue**: Other files

### Border Colors (Complexity)

- 🔴 **Red border**: High complexity
- 🟠 **Orange border**: Medium complexity
- 🟢 **Green border**: Low complexity

### Example Repositories to Try

```
https://github.com/facebook/react
https://github.com/vercel/next.js
https://github.com/vuejs/vue
https://github.com/nodejs/node
https://github.com/microsoft/vscode
```

### Rate Limiting

- Currently analyzes first **20 files** (configurable in code)
- 1 second delay between Gemini API calls
- Gemini free tier: 15 requests/minute

To analyze more files, edit `app-v2.js` line 303:
```javascript
const filesToAnalyze = files.slice(0, 20); // Change 20 to desired number
```

### Technical Details

**GitHub API:**
- Uses GitHub REST API to fetch repository tree
- Fetches file contents via Contents API
- No authentication required for public repos

**Gemini Analysis:**
- Sends each file to Gemini 2.5 Flash
- Extracts: title, purpose, dependencies, complexity, type
- Returns structured JSON

**Graph Rendering:**
- Cytoscape.js with COSE layout
- Physics-based force-directed positioning
- Smooth animations and interactions
- Fully draggable and interactive

### Differences from V1

| Feature | V1 | V2 |
|---------|----|----|
| Input | Single file upload | Entire GitHub repo |
| UI | Light theme | Dark Obsidian theme |
| Graph | Static positions | Physics-based, draggable |
| File browser | None | Sidebar file tree |
| Progress | Simple loading | Detailed progress bar |
| Node styling | Basic colors | Obsidian-style with complexity borders |

### Known Limitations

1. **Rate limiting**: Gemini free tier limits requests
2. **File limit**: Default 20 files for demo
3. **Large repos**: Can take several minutes
4. **Public repos only**: GitHub API requires auth for private repos

### Next Steps

Want to deploy to Forge? The backend resolver already has the same Gemini integration. Just need to:
1. Add file upload endpoint
2. Store repository metadata
3. Deploy with the new UI

### Troubleshooting

**"GitHub API error: 403"**
- You've hit GitHub's rate limit (60 requests/hour for unauthenticated)
- Wait an hour or add GitHub token

**"Too many Gemini requests"**
- Gemini free tier: 15 requests/minute
- Reduce file count or add delays

**Graph looks messy**
- Try the "🔄 Reset Graph" button
- Drag nodes to organize manually
- Refresh page to restart layout

---

**Ready to try it?** Open `http://localhost:8000/index-v2.html`! 🚀
