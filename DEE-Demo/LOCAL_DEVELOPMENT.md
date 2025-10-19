# Local Development Setup

## Important: External Fetch Restrictions

Forge **does not allow HTTP connections** or direct localhost access in external fetch permissions. For local development, you have two options:

## Option 1: Use ngrok (Recommended for Development)

### Setup ngrok

1. Install ngrok:
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

2. Start your DEE API backend:
```bash
cd services/api
npm start  # Runs on localhost:4000
```

3. Create ngrok tunnel in another terminal:
```bash
ngrok http 4000
```

4. Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

5. Set it as environment variable:
```bash
forge variables set API_URL https://abc123.ngrok-free.app
```

6. Deploy and tunnel:
```bash
forge deploy
forge tunnel
```

Now your Forge app can access your local API through the ngrok tunnel!

### ngrok URL Changes

**Note**: Free ngrok URLs change each time you restart. You'll need to update the API_URL variable each time:

```bash
# Restart ngrok, get new URL
ngrok http 4000

# Update Forge variable with new URL
forge variables set API_URL https://new-url.ngrok-free.app

# Redeploy
forge deploy
```

## Option 2: Deploy API to Cloud (Recommended for Testing)

Deploy your DEE API to a cloud provider:

### Heroku
```bash
cd services/api
heroku create your-dee-api
git push heroku main
```

Set the URL:
```bash
forge variables set API_URL https://your-dee-api.herokuapp.com
```

### Railway.app
```bash
cd services/api
railway up
```

Set the URL:
```bash
forge variables set API_URL https://your-app.railway.app
```

### Vercel
```bash
cd services/api
vercel deploy
```

Set the URL:
```bash
forge variables set API_URL https://your-api.vercel.app
```

## Forge Environment Variables

### View current variables
```bash
forge variables list
```

### Set API URL
```bash
forge variables set API_URL https://your-api-url.com
```

### Set for specific environment
```bash
forge variables set --environment development API_URL https://dev-api.com
forge variables set --environment production API_URL https://prod-api.com
```

## Development Workflow

### Complete Setup

1. **Start Backend API**
```bash
cd services/api
npm start  # localhost:4000
```

2. **Start ngrok tunnel**
```bash
ngrok http 4000
# Copy the HTTPS URL shown
```

3. **Set Forge variable**
```bash
forge variables set API_URL https://your-ngrok-url.ngrok-free.app
```

4. **Deploy Forge app**
```bash
forge deploy
```

5. **Run Forge tunnel**
```bash
forge tunnel
```

6. **Access in Jira**
- Navigate to your Jira project
- Find "DEE PM Dashboard" in project sidebar
- Dashboard should now connect to your local API via ngrok

### Quick Restart (ngrok URL changed)

```bash
# Terminal 1: Restart ngrok
ngrok http 4000

# Terminal 2: Update and deploy
forge variables set API_URL https://new-url.ngrok-free.app
forge deploy
forge tunnel
```

## Alternative: Mock Data for UI Development

If you just want to develop the UI without backend:

1. Modify `backend/resolvers.js` to return mock data:

```javascript
resolver.define('getSummary', async () => {
  return {
    success: true,
    data: {
      sumMB: 1234.56,
      sumMF: 789.01,
      contributors: 42,
      medianPayout: 23.45,
      lastEpoch: { epochId: '2024-Q1', alpha: 0.5 }
    }
  };
});
```

2. Deploy:
```bash
forge deploy
forge tunnel
```

This allows UI development without needing the API running.

## Debugging

### View Forge Logs
```bash
forge logs
```

### View Logs with Tunnel
```bash
# Terminal 1
forge tunnel

# Terminal 2
forge logs --follow
```

### Check Variable Values
```bash
forge variables list
```

### Test ngrok Connection
```bash
# After starting ngrok
curl https://your-url.ngrok-free.app/ui/summary
```

## Production Deployment

For production, deploy your API to a stable hosting provider and update manifest:

1. Deploy API to production hosting

2. Update `.env` or hosting config:
```
DATABASE_URL=your-production-db
```

3. Set Forge production variable:
```bash
forge variables set --environment production API_URL https://prod-api.com
```

4. Deploy to production:
```bash
forge deploy --environment production
```

## Troubleshooting

### "Failed to fetch" errors
- ✅ Verify ngrok is running and tunnel is active
- ✅ Check API_URL variable: `forge variables list`
- ✅ Test API URL directly: `curl <API_URL>/ui/summary`
- ✅ Check forge logs: `forge logs`
- ✅ Verify manifest has correct domain pattern

### ngrok connection issues
- ✅ Verify local API is running on port 4000
- ✅ Try accessing ngrok URL in browser
- ✅ Check for ngrok account limits (free plan limits)
- ✅ Restart ngrok if tunnel seems stale

### Forge tunnel not working
- ✅ Make sure you've deployed: `forge deploy`
- ✅ Check installation: `forge install`
- ✅ Verify manifest.yml syntax: `forge lint`
- ✅ Try reinstalling: `forge install --upgrade`

## Best Practices

1. **Use ngrok with stable URLs**: Sign up for ngrok account to get static domains
2. **Use environment-specific variables**: Separate dev/staging/prod API URLs
3. **Monitor logs**: Keep `forge logs` running during development
4. **Version control**: Don't commit ngrok URLs or temporary API URLs
5. **Document URLs**: Keep a note of your current ngrok/API URLs

## Summary

- ❌ **Cannot** use `http://localhost` in Forge external fetch
- ✅ **Can** use ngrok HTTPS tunnels for local development
- ✅ **Can** deploy API to cloud and use HTTPS URL
- ✅ **Can** use mock data in resolver for UI-only development

---

**Recommendation**: For active development, use ngrok. For testing/staging, deploy to Railway or Heroku.

