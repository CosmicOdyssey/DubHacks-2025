// CodeGraph UW - Full GitHub Repository Analyzer
// API Configuration - loaded from config.js
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// GitHub configuration
const GITHUB_TOKEN = CONFIG.GITHUB_TOKEN;

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
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
  });

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
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  return atob(data.content);
}

// Analyze code with Gemini AI
async function analyzeWithGemini(code, filename) {
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

// Build graph from analysis
function addToGraph(filename, analysis) {
  if (!analysis) return;

  const nodeId = `file:${filename}`;

  // Add main file node
  graphData.nodes.push({
    data: {
      id: nodeId,
      label: analysis.title || filename.split('/').pop(),
      filename: filename,
      blockType: analysis.blockType || 'other',
      purpose: analysis.purpose || '',
      complexity: analysis.complexity || 'medium',
      relatedConcepts: analysis.relatedConcepts || []
    }
  });

  // Add external library dependencies
  if (analysis.dependencies?.external) {
    analysis.dependencies.external.forEach(lib => {
      const libId = `lib:${lib}`;
      if (!graphData.nodes.some(n => n.data.id === libId)) {
        graphData.nodes.push({
          data: { id: libId, label: lib, type: 'library' }
        });
      }
      graphData.edges.push({
        data: { source: nodeId, target: libId, label: 'uses' }
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
            type: 'placeholder'
          }
        });
      }

      graphData.edges.push({
        data: { source: nodeId, target: targetId, label: 'imports' }
      });
    });
  }

  // Add API dependencies
  if (analysis.dependencies?.apis) {
    analysis.dependencies.apis.forEach(api => {
      const apiId = `api:${api}`;
      if (!graphData.nodes.some(n => n.data.id === apiId)) {
        graphData.nodes.push({
          data: { id: apiId, label: api, type: 'api' }
        });
      }
      graphData.edges.push({
        data: { source: nodeId, target: apiId, label: 'calls' }
      });
    });
  }
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
          'background-color': '#0052CC',
          'label': 'data(label)',
          'width': 50,
          'height': 50,
          'font-size': 11,
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 5,
          'color': '#172B4D',
          'text-wrap': 'wrap',
          'text-max-width': 100
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
          'width': 2,
          'line-color': '#DFE1E6',
          'target-arrow-color': '#0052CC',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 9,
          'text-rotation': 'autorotate',
          'color': '#5E6C84'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'background-color': '#FF5630',
          'border-width': 3,
          'border-color': '#DE350B'
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
      nodeRepulsion: 8000,
      idealEdgeLength: 120,
      padding: 50
    }).run();
  }

  updateStats();
}

// Show node details
function showNodeDetails(nodeData) {
  const html = `
    <h3>${nodeData.label || nodeData.id}</h3>
    <p><strong>Type:</strong> ${nodeData.type || nodeData.blockType || 'file'}</p>
    ${nodeData.filename ? `<p><strong>File:</strong> ${nodeData.filename}</p>` : ''}
    ${nodeData.purpose ? `<p><strong>Purpose:</strong> ${nodeData.purpose}</p>` : ''}
    ${nodeData.complexity ? `<p><strong>Complexity:</strong> ${nodeData.complexity}</p>` : ''}
  `;
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
