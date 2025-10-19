const Resolver = require('@forge/resolver');
const api = require('@forge/api');

const resolver = new Resolver();

// Get the API base URL from environment or use default
const getApiUrl = () => {
  return process.env.API_URL || 'http://localhost:4000';
};

/**
 * Get configuration for the frontend
 * Returns API URL and Jira context information
 */
resolver.define('getConfig', async ({ context }) => {
  console.log('getConfig called', { 
    accountId: context.accountId,
    cloudId: context.cloudId 
  });

  return {
    apiUrl: getApiUrl(),
    context: {
      cloudId: context.cloudId,
      accountId: context.accountId,
      localId: context.localId,
      installContext: context.installContext,
    },
    permissions: {
      canReadWork: true,
      canReadUsers: true,
    }
  };
});

/**
 * Proxy API requests with authentication and error handling
 * Provides a secure way to call the DEE API from the frontend
 */
resolver.define('apiRequest', async ({ payload, context }) => {
  const { endpoint, method = 'GET', body, headers = {} } = payload;
  const apiUrl = getApiUrl();
  const fullUrl = `${apiUrl}${endpoint}`;

  console.log(`API Request: ${method} ${fullUrl}`);

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Jira-Account-Id': context.accountId,
        'X-Jira-Cloud-Id': context.cloudId,
        ...headers,
      },
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, options);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        data
      });

      return {
        success: false,
        error: `API request failed: ${response.statusText}`,
        status: response.status,
        data
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request exception:', error);
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
});

/**
 * Get summary data for the dashboard
 * Fetches and returns aggregated metrics
 */
resolver.define('getSummary', async () => {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/summary`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log('Summary data fetched:', data);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get contributors list with optional limit
 */
resolver.define('getContributors', async ({ payload }) => {
  const { limit = 50 } = payload || {};
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/contributors?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Contributors fetched: ${data.length} items`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch contributors:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get contributor activity feed
 */
resolver.define('getContributorFeed', async ({ payload }) => {
  const { contributorId } = payload;
  if (!contributorId) {
    return {
      success: false,
      error: 'contributorId is required'
    };
  }

  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/contributors/${contributorId}/feed`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Contributor feed fetched for ${contributorId}: ${data.length} events`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch contributor feed:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get payouts with optional epoch filter
 */
resolver.define('getPayouts', async ({ payload }) => {
  const { epoch } = payload || {};
  const apiUrl = getApiUrl();
  const url = epoch 
    ? `${apiUrl}/ui/payouts?epoch=${epoch}`
    : `${apiUrl}/ui/payouts`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Payouts fetched: ${data.length} items`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch payouts:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get epochs list with optional limit
 */
resolver.define('getEpochs', async ({ payload }) => {
  const { limit = 50 } = payload || {};
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/epochs?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Epochs fetched: ${data.length} items`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch epochs:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get events feed with optional limit and type filter
 */
resolver.define('getEvents', async ({ payload }) => {
  const { limit = 100 } = payload || {};
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/events?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Events fetched: ${data.length} items`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get issue-specific events
 */
resolver.define('getIssueFeed', async ({ payload }) => {
  const { issueKey } = payload;
  if (!issueKey) {
    return {
      success: false,
      error: 'issueKey is required'
    };
  }

  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/issues/${issueKey}/feed`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log(`Issue feed fetched for ${issueKey}: ${data.length} events`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch issue feed:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get project context from Jira
 */
resolver.define('getProjectContext', async ({ context }) => {
  console.log('getProjectContext called', context);

  const projectData = {
    projectId: context.extension?.project?.id,
    projectKey: context.extension?.project?.key,
    projectName: context.extension?.project?.name,
  };

  // If we have project context, try to enrich it with Jira API data
  if (projectData.projectKey) {
    try {
      const response = await api.asUser().requestJira(`/rest/api/3/project/${projectData.projectKey}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        const project = await response.json();
        projectData.projectName = project.name;
        projectData.projectType = project.projectTypeKey;
        projectData.lead = project.lead;
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
      // Continue with basic project data
    }
  }

  return projectData;
});

/**
 * Get current Jira user information
 */
resolver.define('getCurrentUser', async ({ context }) => {
  try {
    const response = await api.asUser().requestJira('/rest/api/3/myself', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 200) {
      const user = await response.json();
      
      return {
        success: true,
        data: {
          accountId: user.accountId,
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          avatarUrls: user.avatarUrls,
          timeZone: user.timeZone,
        }
      };
    }

    return {
      success: false,
      error: 'Failed to fetch user data'
    };
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Health check endpoint
 */
resolver.define('healthCheck', async () => {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/ui/summary`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return {
      success: response.ok,
      status: response.status,
      apiUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      apiUrl,
      timestamp: new Date().toISOString()
    };
  }
});

/**
 * Batch data fetch for dashboard initialization
 * Fetches multiple endpoints in parallel for faster loading
 */
resolver.define('getDashboardData', async () => {
  const apiUrl = getApiUrl();
  
  try {
    const [summaryRes, contributorsRes, epochsRes] = await Promise.all([
      fetch(`${apiUrl}/ui/summary`).then(r => r.json()).catch(() => null),
      fetch(`${apiUrl}/ui/contributors?limit=10`).then(r => r.json()).catch(() => []),
      fetch(`${apiUrl}/ui/epochs?limit=5`).then(r => r.json()).catch(() => []),
    ]);

    console.log('Dashboard data batch fetched successfully');

    return {
      success: true,
      data: {
        summary: summaryRes,
        topContributors: contributorsRes,
        recentEpochs: epochsRes,
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Log client-side errors for debugging
 */
resolver.define('logError', async ({ payload, context }) => {
  const { error, component, metadata } = payload;
  
  console.error('Client-side error:', {
    error,
    component,
    metadata,
    accountId: context.accountId,
    timestamp: new Date().toISOString()
  });

  return { success: true };
});

// Export the handler
exports.handler = resolver.getDefinitions();

