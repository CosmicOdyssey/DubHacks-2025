# DEPLOY NOW - Final Steps

## ✅ What's Already Done

- ✅ Dependencies installed
- ✅ React UI built successfully (`static/ui/` created)
- ✅ Manifest linted and fixed (no errors)
- ✅ All code files created and ready

## 🚀 What You Need to Do

You just need to run **3 commands** in your terminal to deploy:

### Command 1: Set Environment Variable

```bash
forge variables set GEMINI_API_KEY AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0
```

**What happens:** Forge will ask you to create a development environment name. Just type `development` or `dev` and press Enter.

**Expected output:**
```
? Enter an environment name: development
✔ Environment variable GEMINI_API_KEY set successfully
```

### Command 2: Deploy to Forge

```bash
forge deploy
```

**Expected output:**
```
✔ Deploying your app to development
✔ Deployed
```

### Command 3: Install to Jira

```bash
forge install --site https://michaelzhou2025.atlassian.net --product jira
```

**When prompted:**
- **Select environment**: Choose the environment you created in Command 1 (e.g., `dee-demo` or `development`)
- **Confirm permissions**: Press `y` to accept

**Expected output:**
```
✔ Installing your app to michaelzhou2025.atlassian.net
✔ Installed
```

**Note:** If you have old installations, you may need to uninstall them first:
```bash
forge uninstall --site https://michaelzhou2025.atlassian.net --product jira --environment OLD_ENV_NAME
```

---

## 🎉 You're Done!

Now go to your Jira site:

1. Open any Jira project
2. Look for **"DEE Demo"** in the left sidebar
3. Click it

You should see **CodeGraph UW** with three tabs:
- **Knowledge Graph** - Interactive visualization
- **Upload Code** - Analyze new files
- **Status** - System health check

## 🧪 Test It

1. Click **"Upload Code"** tab
2. Create a test file (test.js) with this code:

```javascript
import React from 'react';

export function HelloWorld() {
  return <h1>Hello World</h1>;
}

export default HelloWorld;
```

3. Paste it, set filename to `test.js`
4. Click **"Analyze Code"**
5. Wait 3-5 seconds
6. See your code visualized as a graph!

## 📊 What Happens During Analysis

1. Your code is sent to the backend resolver
2. Resolver calls Gemini Flash API
3. Gemini extracts:
   - Purpose & summary
   - Dependencies (imports)
   - Exports (functions/classes)
   - Code chunks
   - Domain concepts
   - Complexity level
4. Graph is built with nodes & edges
5. Stored in Forge storage
6. Rendered with Cytoscape.js

## 🔧 Troubleshooting

### If deployment fails:

```bash
forge lint
```

Should show "No issues found".

### If you see "GEMINI_API_KEY not set" error:

```bash
forge variables list
```

Should show `GEMINI_API_KEY` in the list. If not, run Command 1 again.

### If the app doesn't appear in Jira:

```bash
forge uninstall
forge install --upgrade --site https://YOUR-SITE.atlassian.net --product jira
```

### To view logs:

```bash
forge logs
```

## 📚 Documentation

- **QUICKSTART.md** - Quick reference guide
- **CODEGRAPH_SETUP.md** - Full technical documentation
- **SETUP_INSTRUCTIONS.md** - Detailed setup walkthrough

## 🛠️ Development Workflow

### Make Changes to UI

```bash
# Edit files in ui/src/
npm run build
forge deploy
```

### Make Changes to Backend

```bash
# Edit backend/resolvers.js
forge deploy
```

Or use live development:

```bash
forge tunnel
```

This lets you test backend changes without redeploying.

## 🚀 Next Steps After Deploy

1. **Analyze multiple files** - Build a complete codebase graph
2. **Customize the Gemini prompt** - Edit `backend/resolvers.js:13-37`
3. **Add new features**:
   - Jira issue creation from code blocks
   - GitHub integration
   - Export to Confluence
   - Task delegation based on ownership

## 📞 Need Help?

Check these in order:
1. **Status tab** in the app → Ping Resolver
2. **Browser console** (F12 → Console tab)
3. **Forge logs** (`forge logs`)
4. **Documentation** files in this directory

---

**Your API Key:** AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0 (already in commands above)

**Ready to deploy? Just run the 3 commands!** 🚀
