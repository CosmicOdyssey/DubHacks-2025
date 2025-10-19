# Setup Instructions for CodeGraph UW

## You need to run these commands manually in your terminal

The Forge CLI requires interactive input for some commands, so you'll need to run them yourself.

### Step-by-Step Commands

Open your terminal and run these commands **one at a time**:

```bash
# 1. Navigate to the DEE-Demo directory
cd /Users/ansonchen/Documents/GitHub/DubHacks-2025/DEE-Demo

# 2. Install dependencies
npm install

# 3. Set your Gemini API key as an environment variable
forge variables set GEMINI_API_KEY AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0
```

**Note:** When you run the `forge variables set` command for the first time, Forge will ask you to create a development environment name. You can use something simple like `development` or `dev`.

```bash
# 4. Verify the environment variable was set
forge variables list

# 5. Build the React UI
npm run build

# 6. Lint and deploy to Forge
forge lint
forge deploy

# 7. Install to your Jira site
forge install --upgrade --site https://michaelzhou2025.atlassian.net --product jira
```

Replace `YOUR-SITE` with your actual Atlassian site name.

### What to Expect

**After `forge variables set`:**
```
? Enter an environment name: development
✔ Environment variable GEMINI_API_KEY set successfully
```

**After `npm run build`:**
```
✓ built in XXXms
```
This creates the `static/ui/` directory with your compiled React app.

**After `forge deploy`:**
```
✔ Deploying your app to development
✔ Deployed
```

**After `forge install`:**
```
✔ Installing your app to YOUR-SITE.atlassian.net
✔ Installed
```

### Verify Installation

1. Go to your Jira site: `https://YOUR-SITE.atlassian.net`
2. Open any project
3. Look for **"DEE Demo"** or **"CodeGraph UW"** in the left sidebar
4. Click it to open the app

You should see:
- A blue gradient header with "CodeGraph UW"
- Three tabs: Knowledge Graph, Upload Code, Status
- An empty state saying "No graph data yet"

### Test It

1. Click the **"Upload Code"** tab
2. Create a test file or use an existing one
3. Paste some code (JavaScript, Python, etc.)
4. Enter a filename like `test.js`
5. Click **"Analyze Code"**
6. Wait a few seconds while Gemini processes
7. You should automatically switch to the **"Knowledge Graph"** tab
8. See your code visualized as an interactive graph!

### Troubleshooting

**If you see an error about GEMINI_API_KEY:**
```bash
forge variables list
```
Make sure `GEMINI_API_KEY` appears in the list.

**If the graph doesn't appear:**
1. Click the **"Status"** tab
2. Click **"Ping Resolver"**
3. You should see a green success message with `"ok": true`

**If you need to redeploy after changes:**
```bash
npm run build
forge deploy
```

### Next Steps

Once installed, check out:
- `QUICKSTART.md` - Quick usage guide
- `CODEGRAPH_SETUP.md` - Full documentation
- Upload multiple files to build a complete codebase graph!

---

**You're all set!** The CodeGraph UW app is now running in your Jira workspace.
