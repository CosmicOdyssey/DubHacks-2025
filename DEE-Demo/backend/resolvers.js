import { storage, fetch } from '@forge/api';
import { CONFIG } from '../config.js';

// ============================================================================
// GEMINI FLASH API INTEGRATION
// ============================================================================

async function analyzeCodeWithGemini(code, filename) {
  const apiKey = CONFIG.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured in config.js');
  }

  const prompt = `Analyze this code file and extract structured information:

Filename: ${filename}

Code:
\`\`\`
${code}
\`\`\`

Extract and return JSON with:
- "title": A concise name for this code block (like a Logseq page name)
- "purpose": Main responsibility/purpose (1-2 sentences)
- "dependencies": Array of imported modules/files
- "exports": Array of exported functions/classes/variables
- "calls": Array of function/method names called within this code
- "concepts": Array of domain concepts/terms (e.g., "authentication", "database")
- "complexity": Estimated complexity (low/medium/high)
- "chunks": Array of logical code chunks, each with:
  - "type": function/class/module/import
  - "name": identifier name
  - "summary": brief description
  - "lineStart": approximate starting line
  - "lineEnd": approximate ending line

Return ONLY valid JSON, no markdown formatting.`;

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
  const fileNodeId = `file:${filename}`;

  // Create file-level node
  const fileNode = {
    id: fileNodeId,
    type: 'file',
    label: analysis.title || filename,
    data: {
      filename,
      purpose: analysis.purpose,
      complexity: analysis.complexity,
      concepts: analysis.concepts || [],
      code: code.substring(0, 5000), // Store first 5KB for preview
    }
  };

  await addNodeToGraph(projectId, fileNode);

  // Create chunk nodes
  if (analysis.chunks && Array.isArray(analysis.chunks)) {
    for (const chunk of analysis.chunks) {
      const chunkId = `chunk:${filename}:${chunk.name}`;
      const chunkNode = {
        id: chunkId,
        type: chunk.type || 'chunk',
        label: chunk.name,
        data: {
          filename,
          summary: chunk.summary,
          lineStart: chunk.lineStart,
          lineEnd: chunk.lineEnd,
        }
      };

      await addNodeToGraph(projectId, chunkNode);

      // Link chunk to file
      await addEdgeToGraph(projectId, {
        source: fileNodeId,
        target: chunkId,
        type: 'CONTAINS',
        label: 'contains'
      });
    }
  }

  // Create dependency edges
  if (analysis.dependencies && Array.isArray(analysis.dependencies)) {
    for (const dep of analysis.dependencies) {
      const depNodeId = `file:${dep}`;
      await addEdgeToGraph(projectId, {
        source: fileNodeId,
        target: depNodeId,
        type: 'IMPORTS',
        label: 'imports'
      });
    }
  }

  // Create call edges (simplified - would need more context for full implementation)
  if (analysis.calls && Array.isArray(analysis.calls)) {
    for (const call of analysis.calls) {
      const callNodeId = `function:${call}`;
      await addEdgeToGraph(projectId, {
        source: fileNodeId,
        target: callNodeId,
        type: 'CALLS',
        label: 'calls'
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
