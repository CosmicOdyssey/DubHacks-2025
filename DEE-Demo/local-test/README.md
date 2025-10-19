# CodeGraph Demo (Dev) - Local Test (No Forge Required)

## What This Is

A standalone HTML page that lets you test the CodeGraph functionality locally without any Forge deployment or tunneling. It calls the Gemini API directly from your browser.

## How to Use

### Option 1: Open Directly in Browser

```bash
cd /Users/ansonchen/Documents/GitHub/DubHacks-2025/DEE-Demo/local-test
open index.html
```

Or just double-click `index.html` in Finder.

### Option 2: Use a Local Server (Recommended for CORS)

```bash
cd /Users/ansonchen/Documents/GitHub/DubHacks-2025/DEE-Demo/local-test
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Quick Test

1. Open `index.html` in your browser
2. Click "Select Code File" and choose `example-code.js`
3. Click "🔍 Analyze Code with Gemini"
4. Wait 3-5 seconds
5. See the interactive graph appear!

## What to Expect

### Analysis Process

1. **Upload**: You can either upload a file or paste code
2. **Gemini Analysis**: The app sends your code to Gemini Flash API
3. **Graph Building**: Converts Gemini's response into nodes and edges
4. **Visualization**: Renders an interactive graph with Cytoscape.js

### Graph Features

- **Blue nodes** = Files
- **Green nodes** = Functions
- **Red nodes** = Classes
- **Purple nodes** = Other chunks
- **Arrows** = Relationships (imports, calls, contains)

**Interactions:**
- Click a node to see details (purpose, complexity, concepts)
- Drag nodes to rearrange
- Scroll to zoom
- Click and drag background to pan

### What Gemini Extracts

For each code file:
- **Title**: Semantic name (like "Advanced Todo Manager")
- **Purpose**: What the code does
- **Dependencies**: Imports (React, axios, etc.)
- **Exports**: What this file exposes
- **Chunks**: Functions, classes, hooks broken down
- **Concepts**: Domain terms (state management, HTTP requests, etc.)
- **Complexity**: Low/Medium/High rating

## Files Included

1. **index.html** - Main UI
2. **app.js** - Gemini API integration + graph logic
3. **example-code.js** - Sample React component to test with
4. **README.md** - This file

## Try Different Code Files

Upload any of these file types:
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- Java (.java)
- Go (.go)
- Rust (.rs)
- C/C++ (.c, .cpp)

## API Key

The Gemini API key is hardcoded in `app.js`:
```javascript
const GEMINI_API_KEY = 'AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0';
```

This is your key from the Forge environment. It has a free tier limit of **15 requests/minute**.

## Troubleshooting

### CORS Error

If you see a CORS error:
1. Use a local server (Option 2 above)
2. Or use a browser extension to disable CORS (not recommended for production)

### No Graph Appears

1. Check browser console (F12) for errors
2. Make sure you have internet (needs to call Gemini API)
3. Check API quota (15 req/min limit)

### Gemini API Error

If you see "Gemini API error: 429":
- You've hit the rate limit (15 requests/minute)
- Wait 1 minute and try again
- Or upgrade your Gemini API key

## Comparison with Forge Version

| Feature | Local Version | Forge Version |
|---------|---------------|---------------|
| Graph visualization | ✅ Same | ✅ Same |
| Gemini analysis | ✅ Same | ✅ Same |
| Persistent storage | ❌ No (resets on refresh) | ✅ Yes |
| Multi-file graphs | ⚠️ Limited (one at a time) | ✅ Yes |
| Jira integration | ❌ No | ✅ Yes |
| No deployment needed | ✅ Yes | ❌ No |

## Next Steps

Once you verify this works locally:
1. You know the Gemini API integration is working
2. The issue with Forge is likely environment/installation related
3. You can use this for demos without Forge

## Example Output

After analyzing `example-code.js`, you should see:
- **12-15 nodes** (TodoApp, TodoItem, useTodos, helper functions)
- **10-20 edges** (imports, function calls, contains relationships)
- **Concepts**: "state management", "HTTP requests", "React hooks", "CRUD operations"
- **Complexity**: Medium

Click on nodes to see detailed information extracted by Gemini!

---

**Ready to test?** Just open `index.html` and upload `example-code.js`! 🚀
