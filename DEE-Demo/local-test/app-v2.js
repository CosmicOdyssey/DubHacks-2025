// CodeGraph UW - Full GitHub Repository Analyzer
// API Keys - Will be fetched from Forge or use defaults for local testing
let GEMINI_API_KEY = 'XXX'; // Default for local testing
let GITHUB_TOKEN = 'ghp_XXX'; // Default for local testing

// Graph data
let graphData = { nodes: [], edges: [] };
let cy = null;
let fileContents = new Map();

// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const loadBtn = document.getElementById('loadBtn');
const repoUrlInput = document.getElementById('repoUrl');
const branchInput = document.getElementById('branch');
const messageArea = document.getElementById('messageArea');
const fileCountEl = document.getElementById('fileCount');
const nodeCountEl = document.getElementById('nodeCount');
const edgeCountEl = document.getElementById('edgeCount');
const fileListEl = document.getElementById('fileList');
const nodeDetailsDiv = document.getElementById('nodeDetails');

// Fetch API keys from Forge backend if available
async function fetchAPIKeys() {
  try {
    if (typeof AP !== 'undefined' && AP.context) {
      // Running in Forge - fetch keys from backend
      const response = await AP.request('/keys');
      if (response && response.body) {
        const data = JSON.parse(response.body);
        if (data.geminiKey) GEMINI_API_KEY = data.geminiKey;
        if (data.githubToken) GITHUB_TOKEN = data.githubToken;
        console.log('✓ API keys loaded from Forge environment variables');
      }
    } else {
      console.log('⚠ Running locally - using hardcoded API keys');
    }
  } catch (e) {
    console.warn('Could not fetch API keys from Forge, using defaults:', e);
  }
}

// Parse GitHub URL
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

// Fetch repository file tree from GitHub
async function fetchRepoTree(owner, repo, branch = 'main') {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const headers = {};
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.tree.filter(item =>
    item.type === 'blob' &&
    /\.(js|jsx|ts|tsx|py|java|go|rs|cpp|c|h|hpp|cs|rb|php|swift|kt|scala|clj|ex|exs|erl|hs|ml|r|dart|lua|pl|sh|bash|sql|vue|svelte)$/i.test(item.path) &&
    !item.path.includes('node_modules') &&
    !item.path.includes('.min.') &&
    !item.path.includes('dist/') &&
    !item.path.includes('build/')
  );
}

// Fetch file content from GitHub
async function fetchFileContent(owner, repo, path, branch = 'main') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const headers = {};
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  return atob(data.content);
}

// Analyze code with Gemini AI
async function analyzeWithGemini(code, filename) {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

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

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    console.error('Gemini API error:', response.status);
    return null;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return null;

  try {
    return JSON.parse(text.replace(/```json|```/g, ''));
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

// Build graph from BLOCK analysis
function addToGraph(filename, analysis) {
  if (!analysis) return;

  const blockId = `block:${analysis.blockName || filename}`;

  // Check if this block already exists (merge duplicate blocks)
  const existingNode = graphData.nodes.find(n =>
    n.data.blockName === analysis.blockName || n.data.id === blockId
  );

  if (existingNode) {
    // Block already exists, just add this file to it
    if (!existingNode.data.files) existingNode.data.files = [];
    existingNode.data.files.push(filename);
    return;
  }

  // Add FUNCTIONAL BLOCK node
  graphData.nodes.push({
    data: {
      id: blockId,
      label: analysis.blockName || filename.split('/').pop(),
      blockName: analysis.blockName,
      category: analysis.category || 'utilities',
      whatItDoes: analysis.whatItDoes || '',
      produces: analysis.produces || [],
      takesIn: analysis.takesIn || [],
      usesLibraries: analysis.usesLibraries || [],
      improvementTask: analysis.improvementTask || '',
      relatedConcepts: analysis.relatedConcepts || [],
      filename: filename,
      files: [filename]
    }
  });

  // Add external library dependencies
  if (analysis.dependencies?.external) {
    analysis.dependencies.external.forEach(lib => {
      const libId = `lib:${lib}`;
      if (!graphData.nodes.some(n => n.data.id === libId)) {
        graphData.nodes.push({
          data: { id: libId, label: lib, type: 'library', semanticType: 'external-lib' }
        });
      }
      graphData.edges.push({
        data: { source: blockId, target: libId, label: 'uses' }
      });
    });
  }

  // Add internal file dependencies
  if (analysis.dependencies?.internal) {
    analysis.dependencies.internal.forEach(path => {
      const targetId = `file:${path}`;

      if (!graphData.nodes.some(n => n.data.id === targetId)) {
        graphData.nodes.push({
          data: {
            id: targetId,
            label: path.split('/').pop(),
            filename: path,
            type: 'placeholder',
            semanticType: 'placeholder'
          }
        });
      }

      graphData.edges.push({
        data: { source: blockId, target: targetId, label: 'imports' }
      });
    });
  }

  // Add API dependencies
  if (analysis.dependencies?.apis) {
    analysis.dependencies.apis.forEach(api => {
      const apiId = `api:${api}`;
      if (!graphData.nodes.some(n => n.data.id === apiId)) {
        graphData.nodes.push({
          data: { id: apiId, label: api, type: 'api', semanticType: 'external-api' }
        });
      }
      graphData.edges.push({
        data: { source: blockId, target: apiId, label: 'calls' }
      });
    });
  }
}

// Connect blocks based on matching inputs/outputs
function connectBlocks() {
  const nodes = graphData.nodes.filter(n => n.data.category); // Only block nodes have category

  nodes.forEach(sourceNode => {
    const source = sourceNode.data;
    if (!source.produces || source.produces.length === 0) return;

    nodes.forEach(targetNode => {
      const target = targetNode.data;
      if (source.id === target.id) return;
      if (!target.takesIn || target.takesIn.length === 0) return;

      // Check if any output matches any input (fuzzy matching)
      source.produces.forEach(output => {
        target.takesIn.forEach(input => {
          // Simple keyword matching
          const outputWords = output.toLowerCase().split(' ');
          const inputWords = input.toLowerCase().split(' ');
          const overlap = outputWords.some(word =>
            word.length > 3 && inputWords.some(iw => iw.includes(word) || word.includes(iw))
          );

          if (overlap) {
            // Create edge from source to target
            const edgeId = `${source.id}-${target.id}`;
            const exists = graphData.edges.some(e => e.data.id === edgeId);

            if (!exists) {
              graphData.edges.push({
                data: {
                  id: edgeId,
                  source: source.id,
                  target: target.id,
                  label: output.substring(0, 20),
                  type: 'data-flow'
                }
              });
            }
          }
        });
      });
    });
  });

  console.log(`Connected blocks: ${graphData.edges.length} edges total`);
}

// Initialize Cytoscape graph
function initGraph() {
  if (cy) {
    cy.destroy();
  }

  const container = document.getElementById('cy');
  if (!container) {
    console.error('Graph container not found');
    return;
  }

  cy = cytoscape({
    container: container,
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          // Category colors for any repository
          'background-color': ele => {
            const cat = ele.data('category');
            if (cat === 'frontend' || cat === 'ui-component') return '#fbbf24'; // Yellow
            if (cat === 'backend-api') return '#60a5fa'; // Blue
            if (cat === 'database') return '#22c55e'; // Green
            if (cat === 'auth') return '#f472b6'; // Pink
            if (cat === 'file-handling') return '#34d399'; // Emerald
            if (cat === 'business-logic') return '#a78bfa'; // Purple
            if (cat === 'data-processing') return '#38bdf8'; // Cyan
            if (cat === 'testing') return '#fb923c'; // Orange
            if (cat === 'config') return '#94a3b8'; // Gray
            if (cat === 'deployment') return '#c084fc'; // Light purple
            if (cat === 'integration') return '#e879f9'; // Fuchsia
            if (cat === 'utilities') return '#6b7280'; // Dark gray
            return '#8b5cf6'; // Default purple
          },
          'label': 'data(label)',

          // Obsidian-style: all main nodes are circles
          'shape': 'ellipse',

          // Size based on importance
          'width': ele => {
            const type = ele.data('semanticType');
            if (type === 'external-lib' || type === 'placeholder') return 45;
            if (type === 'external-api') return 50;
            return 65; // Main block nodes
          },
          'height': ele => {
            const type = ele.data('semanticType');
            if (type === 'external-lib' || type === 'placeholder') return 45;
            if (type === 'external-api') return 50;
            return 65;
          },

          // Clean text styling
          'font-size': 11,
          'font-weight': 500,
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#ffffff',
          'text-outline-width': 2,
          'text-outline-color': '#000000',
          'text-wrap': 'wrap',
          'text-max-width': 90,

          // Subtle styling like Obsidian
          'background-opacity': 0.9,
          'border-width': 3,
          'border-color': '#ffffff',
          'border-opacity': 0.3
        }
      },
      {
        selector: 'node[type="library"]',
        style: {
          'background-color': '#36B37E',
          'shape': 'roundrectangle'
        }
      },
      {
        selector: 'node[type="api"]',
        style: {
          'background-color': '#FF5630',
          'shape': 'diamond'
        }
      },
      {
        selector: 'edge',
        style: {
          // Obsidian-style straight lines
          'curve-style': 'straight',
          'width': 1.5,
          'line-color': '#475569',
          'target-arrow-color': '#475569',
          'target-arrow-shape': 'triangle',
          'opacity': 0.5,
          'arrow-scale': 0.8
        }
      },
      {
        selector: 'edge[type="data-flow"]',
        style: {
          'width': 2.5,
          'line-color': '#fbbf24',
          'target-arrow-color': '#fbbf24',
          'opacity': 0.7
        }
      },
      {
        selector: ':selected',
        style: {
          'border-width': 5,
          'border-color': '#fbbf24',
          'border-opacity': 1,
          'z-index': 9999,
          'background-opacity': 1
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'width': 4,
          'opacity': 1,
          'line-color': '#fbbf24',
          'target-arrow-color': '#fbbf24'
        }
      }
    ],
    layout: {
      name: 'cose',
      animate: false
    }
  });

  cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    showNodeDetails(node.data());
  });

  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      hideNodeDetails();
    }
  });

  console.log('Cytoscape initialized');
}

// Render graph
function renderGraph() {
  if (!cy) {
    initGraph();
  }

  cy.elements().remove();

  if (graphData.nodes && graphData.nodes.length > 0) {
    try {
      cy.add(graphData.nodes);
      console.log(`Added ${graphData.nodes.length} nodes`);
    } catch (err) {
      console.error('Error adding nodes:', err);
    }
  }

  if (graphData.edges && graphData.edges.length > 0) {
    try {
      cy.add(graphData.edges);
      console.log(`Added ${graphData.edges.length} edges`);
    } catch (err) {
      console.error('Error adding edges:', err);
    }
  }

  if (cy.nodes().length > 0) {
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 1500,
      animationEasing: 'ease-out',
      // Physics parameters for natural-looking graph
      idealEdgeLength: 100,
      nodeRepulsion: 8000000,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 50,
      randomize: false,
      componentSpacing: 150,
      gravity: 0.5,
      numIter: 2000,
      initialTemp: 1000,
      coolingFactor: 0.99,
      minTemp: 1.0
    }).run();
  }

  updateStats();
}

// Show node details - enhanced for blocks
function showNodeDetails(nodeData) {
  let html = `<h3>${nodeData.label || nodeData.id}</h3>`;

  if (nodeData.category) {
    html += `<p style="color: #a78bfa;"><strong>Category:</strong> ${nodeData.category.replace(/-/g, ' ').toUpperCase()}</p>`;
  }

  if (nodeData.whatItDoes) {
    html += `<p><strong>What it does:</strong> ${nodeData.whatItDoes}</p>`;
  }

  if (nodeData.takesIn && nodeData.takesIn.length > 0) {
    html += `<p><strong>📥 Takes In:</strong> ${nodeData.takesIn.join(', ')}</p>`;
  }

  if (nodeData.produces && nodeData.produces.length > 0) {
    html += `<p><strong>📤 Produces:</strong> ${nodeData.produces.join(', ')}</p>`;
  }

  if (nodeData.usesLibraries && nodeData.usesLibraries.length > 0) {
    html += `<p><strong>🛠️ Uses:</strong> ${nodeData.usesLibraries.join(', ')}</p>`;
  }

  if (nodeData.improvementTask) {
    html += `<div style="margin-top: 12px; padding: 8px; background: rgba(99, 102, 241, 0.1); border-left: 3px solid #6366f1; border-radius: 4px;">`;
    html += `<p style="font-weight: 600; color: #6366f1; margin-bottom: 4px;">💡 Suggested Task:</p>`;
    html += `<p style="font-size: 12px; color: #e0e0e0;">${nodeData.improvementTask}</p>`;
    html += `</div>`;
  }

  if (nodeData.files && nodeData.files.length > 0) {
    html += `<p style="font-size: 10px; color: #666; margin-top: 12px;">Files: ${nodeData.files.join(', ')}</p>`;
  }

  if (nodeData.filename && !nodeData.category) {
    html += `<p><strong>File:</strong> ${nodeData.filename}</p>`;
  }

  if (nodeData.type) {
    html += `<p><strong>Type:</strong> ${nodeData.type}</p>`;
  }

  nodeDetailsDiv.innerHTML = html;
  nodeDetailsDiv.className = 'node-details visible';
}

function hideNodeDetails() {
  nodeDetailsDiv.className = 'node-details';
}

// Show message
function showMessage(html, type = 'info') {
  messageArea.innerHTML = `<div class="message ${type}">${html}</div>`;
}

// Update stats
function updateStats() {
  const fileNodes = graphData.nodes ? graphData.nodes.filter(n => n.data && n.data.filename) : [];
  fileCountEl.textContent = fileNodes.length;
  nodeCountEl.textContent = graphData.nodes ? graphData.nodes.length : 0;
  edgeCountEl.textContent = graphData.edges ? graphData.edges.length : 0;
}

// Analyze repository
async function analyzeRepository() {
  const repoUrl = repoUrlInput.value.trim();
  const branch = branchInput.value.trim() || 'main';

  if (!repoUrl) {
    showMessage('Please enter a GitHub repository URL', 'error');
    return;
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    showMessage('Invalid GitHub URL', 'error');
    return;
  }

  analyzeBtn.disabled = true;
  graphData = { nodes: [], edges: [] };
  fileContents.clear();

  try {
    // Fetch API keys from Forge if available
    await fetchAPIKeys();

    if (!GEMINI_API_KEY) {
      showMessage('Error: Gemini API key not configured. Please set GEMINI_API_KEY via forge variables.', 'error');
      analyzeBtn.disabled = false;
      return;
    }

    showMessage('Fetching repository structure...', 'info');

    const files = await fetchRepoTree(parsed.owner, parsed.repo, branch);

    if (files.length === 0) {
      showMessage('No code files found in repository', 'error');
      analyzeBtn.disabled = false;
      return;
    }

    // Limit to 50 files
    const filesToAnalyze = files.slice(0, 50);

    showMessage(`Found ${files.length} code files. Analyzing ${filesToAnalyze.length} files...`, 'info');

    fileListEl.innerHTML = '<h3>Analyzing Files:</h3>' + filesToAnalyze.map(f =>
      `<div class="file-item">${f.path}</div>`
    ).join('');

    let analyzed = 0;
    for (const file of filesToAnalyze) {
      showMessage(`Analyzing ${analyzed + 1}/${filesToAnalyze.length}: ${file.path}`, 'info');

      try {
        const content = await fetchFileContent(parsed.owner, parsed.repo, file.path, branch);
        fileContents.set(file.path, content);

        console.log(`Analyzing ${file.path}...`);
        const analysis = await analyzeWithGemini(content, file.path);

        if (analysis) {
          addToGraph(file.path, analysis);
          console.log(`Added to graph. Total nodes: ${graphData.nodes.length}`);
        }
      } catch (e) {
        console.error(`Failed to analyze ${file.path}:`, e);
      }

      analyzed++;

      // Rate limiting: 1 second between Gemini requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Connect blocks based on data flow
    showMessage('Connecting blocks based on data flow...', 'info');
    connectBlocks();

    renderGraph();
    showMessage(`Successfully analyzed ${analyzed} files! Found ${graphData.nodes.length} nodes and ${graphData.edges.length} connections.`, 'success');

  } catch (error) {
    console.error('Analysis error:', error);
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    analyzeBtn.disabled = false;
  }
}

// Clear graph
function clearGraph() {
  graphData = { nodes: [], edges: [] };
  fileContents.clear();
  renderGraph();
  fileListEl.innerHTML = '';
  showMessage('Graph cleared', 'success');
}

// Event listeners
analyzeBtn.addEventListener('click', analyzeRepository);
clearBtn.addEventListener('click', clearGraph);
loadBtn.addEventListener('click', () => {
  showMessage('Load functionality available in Forge deployment only', 'info');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing CodeGraph UW...');

  if (typeof cytoscape === 'undefined') {
    console.error('Cytoscape library not loaded!');
    showMessage('Error: Cytoscape library not loaded', 'error');
    return;
  }

  console.log('Cytoscape library loaded successfully');
  initGraph();
  showMessage('Ready to analyze GitHub repositories (up to 50 files)', 'info');
});
