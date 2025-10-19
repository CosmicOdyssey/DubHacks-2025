import { storage, fetch } from '@forge/api';

// ============================================================================
// GEMINI FLASH API INTEGRATION
// ============================================================================

async function analyzeCodeWithGemini(code, filename) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable not set');
  }

  const prompt = `Analyze this code and identify what FUNCTIONAL BLOCK it represents in the repository.

File: ${filename}

Code:
\`\`\`
${code.substring(0, 15000)}
\`\`\`

Think like a software architect creating a system diagram:
- "User Authentication" not "auth.js"
- "Database Layer" not "db.py"
- "Payment Processing" not "stripe_handler.js"
- "Image Upload" not "upload.php"

Return JSON:
{
  "blockName": "What this does (2-4 words)",
  "category": "One of: frontend | backend-api | database | auth | file-handling | business-logic | ui-component | data-processing | testing | config | deployment | integration | utilities",
  "whatItDoes": "Specific responsibility (1-2 sentences, be concrete)",
  "takesIn": ["Specific inputs: 'User credentials', 'Product ID', 'Image file', 'HTTP request'"],
  "produces": ["Specific outputs: 'JWT token', 'Order object', 'Thumbnail image', 'JSON response'"],
  "usesLibraries": ["Max 3 key libraries used in this file"],
  "improvementTask": "Suggested task to improve this block (e.g., 'Add input validation', 'Implement retry logic', 'Add error logging', 'Cache results', 'Add tests')",
  "dependencies": {
    "external": ["library names only, e.g., 'react', 'express'"],
    "internal": ["relative file paths imported, e.g., './utils/helper.js'"],
    "apis": ["external APIs called, e.g., 'GitHub API', 'Stripe API'"]
  },
  "relatedConcepts": ["key domain concepts, 2-5 max"]
}

Be SPECIFIC and CONCRETE. Avoid vague terms. Think: what would help someone understand the codebase in 30 seconds?`;

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

  // Check if node already exists
  const existingIndex = graph.nodes.findIndex(n => n.id === node.id);
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

  // Avoid duplicate edges
  const exists = graph.edges.some(
    e => e.source === edge.source && e.target === edge.target && e.type === edge.type
  );

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
  const blockId = `block:${analysis.blockName || filename}`;

  // Create functional block node
  const blockNode = {
    id: blockId,
    type: 'block',
    label: analysis.blockName || filename.split('/').pop(),
    blockType: analysis.category || 'utilities',
    data: {
      blockName: analysis.blockName,
      category: analysis.category || 'utilities',
      whatItDoes: analysis.whatItDoes || '',
      produces: analysis.produces || [],
      takesIn: analysis.takesIn || [],
      usesLibraries: analysis.usesLibraries || [],
      improvementTask: analysis.improvementTask || '',
      relatedConcepts: analysis.relatedConcepts || [],
      filename,
      code: code.substring(0, 5000), // Store first 5KB for preview
    }
  };

  await addNodeToGraph(projectId, blockNode);

  // Add external library dependencies
  if (analysis.dependencies?.external) {
    for (const lib of analysis.dependencies.external) {
      const libId = `lib:${lib}`;
      // Create library node if it doesn't exist
      const graph = await getCodeGraph(projectId);
      if (!graph.nodes.some(n => n.id === libId)) {
        await addNodeToGraph(projectId, {
          id: libId,
          type: 'library',
          label: lib,
          data: { type: 'external-lib' }
        });
      }

      // Create edge from block to library
      await addEdgeToGraph(projectId, {
        source: blockId,
        target: libId,
        type: 'USES',
        label: 'uses'
      });
    }
  }

  // Add internal file dependencies
  if (analysis.dependencies?.internal) {
    for (const dep of analysis.dependencies.internal) {
      const depId = `file:${dep}`;
      await addEdgeToGraph(projectId, {
        source: blockId,
        target: depId,
        type: 'IMPORTS',
        label: 'imports'
      });
    }
  }

  // Add API dependencies
  if (analysis.dependencies?.apis) {
    for (const api of analysis.dependencies.apis) {
      const apiId = `api:${api}`;
      // Create API node if it doesn't exist
      const graph = await getCodeGraph(projectId);
      if (!graph.nodes.some(n => n.id === apiId)) {
        await addNodeToGraph(projectId, {
          id: apiId,
          type: 'api',
          label: api,
          data: { type: 'external-api' }
        });
      }

      // Create edge from block to API
      await addEdgeToGraph(projectId, {
        source: blockId,
        target: apiId,
        type: 'CALLS',
        label: 'calls'
      });
    }
  }

  return await getCodeGraph(projectId);
}

// Connect blocks based on matching inputs/outputs
async function connectBlocks(projectId) {
  const graph = await getCodeGraph(projectId);
  const nodes = graph.nodes.filter(n => n.type === 'block');

  let newEdgesCount = 0;

  // Create edges where one block's output matches another's input
  for (const sourceNode of nodes) {
    const source = sourceNode.data;
    if (!source.produces || source.produces.length === 0) continue;

    for (const targetNode of nodes) {
      const target = targetNode.data;
      if (sourceNode.id === targetNode.id) continue;
      if (!target.takesIn || target.takesIn.length === 0) continue;

      // Check if any output matches any input (fuzzy matching)
      for (const output of source.produces) {
        for (const input of target.takesIn) {
          // Simple keyword matching
          const outputWords = output.toLowerCase().split(' ');
          const inputWords = input.toLowerCase().split(' ');
          const overlap = outputWords.some(word =>
            word.length > 3 && inputWords.some(iw => iw.includes(word) || word.includes(iw))
          );

          if (overlap) {
            // Check if edge already exists
            const edgeExists = graph.edges.some(
              e => e.source === sourceNode.id && e.target === targetNode.id && e.type === 'FLOWS_TO'
            );

            if (!edgeExists) {
              await addEdgeToGraph(projectId, {
                source: sourceNode.id,
                target: targetNode.id,
                type: 'FLOWS_TO',
                label: output.substring(0, 20) // Truncate long labels
              });
              newEdgesCount++;
            }
          }
        }
      }
    }
  }

  console.log(`Connected blocks: ${newEdgesCount} new data flow edges created`);
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

    // Connect blocks based on data flow
    if (path === '/connect') {
      const { projectId = 'default' } = payload || {};
      console.log('Connecting blocks for projectId:', projectId);

      const graph = await connectBlocks(projectId);

      return {
        body: {
          ok: true,
          graph,
          message: 'Blocks connected based on data flow'
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
