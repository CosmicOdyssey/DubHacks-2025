import { storage, fetch } from '@forge/api';

// ============================================================================
// GITHUB API INTEGRATION
// ============================================================================

async function fetchGitHubRepoTree(owner, repo, branch = 'main') {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN environment variable not set');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  // Filter code files only
  return data.tree.filter(item =>
    item.type === 'blob' &&
    /\.(js|jsx|ts|tsx|py|java|go|rs|cpp|c|h|hpp|cs|rb|php|swift|kt|scala|clj|ex|exs|erl|hs|ml|r|dart|lua|pl|sh|bash|sql|vue|svelte)$/i.test(item.path) &&
    !item.path.includes('node_modules') &&
    !item.path.includes('.min.') &&
    !item.path.includes('dist/') &&
    !item.path.includes('build/')
  );
}

async function fetchGitHubFileContent(owner, repo, path, branch = 'main') {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN environment variable not set');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ${path}: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  // Decode base64 content
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

// ============================================================================
// GEMINI FLASH API INTEGRATION
// ============================================================================

async function analyzeCodeWithGemini(code, filename) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable not set');
  }

  const prompt = `Analyze this code file and extract structured metadata for knowledge graph visualization.

Filename: ${filename}

Code:
\`\`\`
${code.substring(0, 8000)}
\`\`\`

Return JSON with this structure:
{
  "title": "Short descriptive name (2-4 words)",
  "purpose": "One sentence describing what this file does",
  "blockType": "frontend|backend|database|auth|utils|config|test|other",
  "complexity": "low|medium|high",
  "dependencies": {
    "external": ["library names only, e.g., 'react', 'express'"],
    "internal": ["relative file paths imported, e.g., './utils/helper.js'"],
    "apis": ["external APIs called, e.g., 'GitHub API', 'Stripe API'"]
  },
  "relatedConcepts": ["key domain concepts, 2-5 max"]
}

Keep it MINIMAL. Focus on helping visualize the repository structure.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response from Gemini API');
  }

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Gemini response');
  }

  return JSON.parse(jsonMatch[0]);
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

async function saveCodeGraph(projectId, graphData) {
  const key = `codegraph:${projectId}`;
  await storage.set(key, graphData);
  return graphData;
}

async function getCodeGraph(projectId) {
  const key = `codegraph:${projectId}`;
  const data = await storage.get(key);
  return data || { nodes: [], edges: [], metadata: {} };
}

async function addNodeToGraph(projectId, node) {
  const graph = await getCodeGraph(projectId);

  // Check if node already exists (node now has data wrapper)
  const nodeId = node.data?.id || node.id;
  const existingIndex = graph.nodes.findIndex(n => (n.data?.id || n.id) === nodeId);
  if (existingIndex >= 0) {
    graph.nodes[existingIndex] = node;
  } else {
    graph.nodes.push(node);
  }

  await saveCodeGraph(projectId, graph);
  return graph;
}

async function addEdgeToGraph(projectId, edge) {
  const graph = await getCodeGraph(projectId);

  // Avoid duplicate edges (edge now has data wrapper)
  const edgeData = edge.data || edge;
  const exists = graph.edges.some(e => {
    const eData = e.data || e;
    return eData.source === edgeData.source &&
           eData.target === edgeData.target &&
           eData.type === edgeData.type;
  });

  if (!exists) {
    graph.edges.push(edge);
    await saveCodeGraph(projectId, graph);
  }

  return graph;
}

// ============================================================================
// GRAPH BUILDING LOGIC
// ============================================================================

async function buildGraphFromAnalysis(projectId, filename, code, analysis) {
  const fileNodeId = `file:${filename}`;

  // Create file-level node (wrapped in Cytoscape format)
  const fileNode = {
    data: {
      id: fileNodeId,
      type: 'file',
      blockType: analysis.blockType || 'other',
      label: analysis.title || filename.split('/').pop(),
      filename,
      purpose: analysis.purpose,
      complexity: analysis.complexity,
      relatedConcepts: analysis.concepts || [],
      code: code.substring(0, 5000), // Store first 5KB for preview
    }
  };

  await addNodeToGraph(projectId, fileNode);

  // Create chunk nodes
  if (analysis.chunks && Array.isArray(analysis.chunks)) {
    for (const chunk of analysis.chunks) {
      const chunkId = `chunk:${filename}:${chunk.name}`;
      const chunkNode = {
        data: {
          id: chunkId,
          type: chunk.type || 'chunk',
          label: chunk.name,
          filename,
          summary: chunk.summary,
          lineStart: chunk.lineStart,
          lineEnd: chunk.lineEnd,
        }
      };

      await addNodeToGraph(projectId, chunkNode);

      // Link chunk to file
      await addEdgeToGraph(projectId, {
        data: {
          source: fileNodeId,
          target: chunkId,
          type: 'CONTAINS',
          label: 'contains'
        }
      });
    }
  }

  // Add external library dependencies
  if (analysis.dependencies?.external) {
    for (const lib of analysis.dependencies.external) {
      const libId = `lib:${lib}`;

      // Create library node if it doesn't exist
      const graph = await getCodeGraph(projectId);
      if (!graph.nodes.some(n => n.data?.id === libId)) {
        await addNodeToGraph(projectId, {
          data: { id: libId, label: lib, type: 'library' }
        });
      }

      // Create edge
      await addEdgeToGraph(projectId, {
        data: { source: fileNodeId, target: libId, label: 'uses' }
      });
    }
  }

  // Add internal file dependencies
  if (analysis.dependencies?.internal) {
    for (const path of analysis.dependencies.internal) {
      const targetId = `file:${path}`;

      // Create placeholder node if target doesn't exist
      const graph = await getCodeGraph(projectId);
      if (!graph.nodes.some(n => n.data?.id === targetId)) {
        await addNodeToGraph(projectId, {
          data: {
            id: targetId,
            label: path.split('/').pop(),
            filename: path,
            type: 'placeholder'
          }
        });
      }

      // Create edge
      await addEdgeToGraph(projectId, {
        data: { source: fileNodeId, target: targetId, label: 'imports' }
      });
    }
  }

  // Add API dependencies
  if (analysis.dependencies?.apis) {
    for (const api of analysis.dependencies.apis) {
      const apiId = `api:${api}`;

      // Create API node if it doesn't exist
      const graph = await getCodeGraph(projectId);
      if (!graph.nodes.some(n => n.data?.id === apiId)) {
        await addNodeToGraph(projectId, {
          data: { id: apiId, label: api, type: 'api' }
        });
      }

      // Create edge
      await addEdgeToGraph(projectId, {
        data: { source: fileNodeId, target: apiId, label: 'calls' }
      });
    }
  }

  return await getCodeGraph(projectId);
}

// ============================================================================
// REQUEST HANDLER
// ============================================================================

export const handler = async (req) => {
  const { path = '/ping', payload } = req;
  const now = new Date().toISOString();

  try {
    // Health check
    if (path === '/ping') {
      return {
        body: {
          ok: true,
          time: now,
          message: 'DEE CodeGraph resolver alive',
        },
      };
    }

    // Analyze code with Gemini
    if (path === '/analyze') {
      const { code, filename, projectId = 'default' } = payload || {};

      console.log('Analyze request received:', { filename, codeLength: code?.length, projectId });

      if (!code || !filename) {
        return {
          body: {
            ok: false,
            error: 'Missing required fields: code, filename'
          }
        };
      }

      console.log('Calling Gemini API...');
      const analysis = await analyzeCodeWithGemini(code, filename);
      console.log('Gemini analysis complete:', analysis);

      console.log('Building graph...');
      const graph = await buildGraphFromAnalysis(projectId, filename, code, analysis);
      console.log('Graph built:', { nodeCount: graph.nodes.length, edgeCount: graph.edges.length });

      return {
        body: {
          ok: true,
          analysis,
          graph,
          message: 'Code analyzed successfully'
        }
      };
    }

    // Get existing graph
    if (path === '/graph') {
      const { projectId = 'default' } = payload || {};
      const graph = await getCodeGraph(projectId);

      return {
        body: {
          ok: true,
          graph,
          nodeCount: graph.nodes.length,
          edgeCount: graph.edges.length,
        }
      };
    }

    // Clear graph (for testing)
    if (path === '/clear') {
      const { projectId = 'default' } = payload || {};
      await saveCodeGraph(projectId, { nodes: [], edges: [], metadata: {} });

      return {
        body: {
          ok: true,
          message: 'Graph cleared'
        }
      };
    }

    // Fetch GitHub repository tree
    if (path === '/github/tree') {
      const { owner, repo, branch = 'main' } = payload || {};

      if (!owner || !repo) {
        return {
          body: {
            ok: false,
            error: 'Missing required fields: owner, repo'
          }
        };
      }

      console.log('Fetching GitHub repo tree:', { owner, repo, branch });
      const files = await fetchGitHubRepoTree(owner, repo, branch);

      return {
        body: {
          ok: true,
          files,
          count: files.length
        }
      };
    }

    // Fetch GitHub file content
    if (path === '/github/file') {
      const { owner, repo, path: filePath, branch = 'main' } = payload || {};

      if (!owner || !repo || !filePath) {
        return {
          body: {
            ok: false,
            error: 'Missing required fields: owner, repo, path'
          }
        };
      }

      console.log('Fetching GitHub file:', { owner, repo, path: filePath, branch });
      const content = await fetchGitHubFileContent(owner, repo, filePath, branch);

      return {
        body: {
          ok: true,
          content,
          path: filePath
        }
      };
    }

    // Unknown path
    return {
      body: {
        ok: false,
        time: now,
        error: `Unknown path: ${path}`,
      },
    };

  } catch (error) {
    console.error('Resolver error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));

    return {
      body: {
        ok: false,
        error: error.message || 'Unknown error occurred',
        details: error.toString(),
        path: path || 'unknown',
      }
    };
  }
};
