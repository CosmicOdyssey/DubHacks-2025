// API Configuration for Forge Backend
// IMPORTANT: Never commit this file with real API keys to version control
export const CONFIG = {
  // GitHub Personal Access Token
  // Get yours at: https://github.com/settings/tokens
  // Required scopes: repo (for private repos) or public_repo (for public repos only)
  GITHUB_TOKEN: 'X',

  // Google Gemini API Key
  // Get yours at: https://ai.google.dev/
  GEMINI_API_KEY: 'X'
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
