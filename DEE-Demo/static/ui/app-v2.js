// CodeGraph UW - Full GitHub Repository Analyzer
// Forge backend resolver handles API access; frontend uses the Forge bridge.

// Forge bridge helpers ------------------------------------------------------
function detectForgeContext() {
  return typeof window !== 'undefined' &&
    typeof window.__bridge !== 'undefined' &&
    typeof window.__bridge.callBridge === 'function';
}

let forgeBridgePromise = null;

function ensureForgeBridge(timeoutMs = 8000) {
  if (forgeBridgePromise) {
    return forgeBridgePromise;
  }

  forgeBridgePromise = new Promise((resolve, reject) => {
    if (detectForgeContext()) {
      resolve(window.__bridge);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (detectForgeContext()) {
        clearInterval(interval);
        resolve(window.__bridge);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Forge bridge unavailable'));
      }
    }, 50);
  });

  return forgeBridgePromise;
}

async function isForgeReady() {
  try {
    await ensureForgeBridge();
    return true;
  } catch (error) {
    console.warn('Forge bridge not detected:', error.message);
    return false;
  }
}

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

// Helper function to invoke Forge resolver
async function invokeResolver(path, payload) {
  const bridge = await ensureForgeBridge();

  const raw = await bridge.callBridge('invoke', {
    functionKey: 'main-resolver',
    payload: { path, payload }
  });

  const data = raw?.body ?? raw;

  if (!data) {
    throw new Error('Resolver returned empty response');
  }

  if (data.ok) {
    return data;
  }

  throw new Error(data.error || 'Resolver request failed');
}

// Fetch repository file tree from GitHub using Forge resolver
async function fetchRepoTree(owner, repo, branch = 'main') {
  const result = await invokeResolver('/github/tree', { owner, repo, branch });
  return result.files;
}

// Fetch file content from GitHub using Forge resolver
async function fetchFileContent(owner, repo, path, branch = 'main') {
  const result = await invokeResolver('/github/file', { owner, repo, path, branch });
  return result.content;
}

// Analyze code with Gemini AI using Forge resolver
async function analyzeWithGemini(code, filename, projectId = 'default') {
  try {
    const result = await invokeResolver('/analyze', { code, filename, projectId });
    return result.analysis;
  } catch (e) {
    console.error('Analysis error:', e);
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
  const projectId = `${parsed.owner}/${parsed.repo}`;

  try {
    // Clear existing graph first
    showMessage('Clearing previous analysis...', 'info');
    await invokeResolver('/clear', { projectId });

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
        // The backend resolver handles both Gemini analysis AND graph building
        await analyzeWithGemini(content, file.path, projectId);
        analyzed++;
        console.log(`Analyzed ${analyzed} files so far`);
      } catch (e) {
        console.error(`Failed to analyze ${file.path}:`, e);
      }

      // Rate limiting: 1 second between Gemini requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Load the complete graph from storage
    showMessage('Loading final graph...', 'info');
    const result = await invokeResolver('/graph', { projectId });
    graphData = result.graph;

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
async function clearGraph() {
  if (!isForgeContext) {
    graphData = { nodes: [], edges: [] };
    fileContents.clear();
    renderGraph();
    fileListEl.innerHTML = '';
    showMessage('Graph cleared', 'success');
    return;
  }

  try {
    const repoUrl = repoUrlInput.value.trim();
    if (!repoUrl) {
      // Clear local graph if no repo URL
      graphData = { nodes: [], edges: [] };
      fileContents.clear();
      renderGraph();
      fileListEl.innerHTML = '';
      showMessage('Graph cleared', 'success');
      return;
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (parsed) {
      const projectId = `${parsed.owner}/${parsed.repo}`;
      await invokeResolver('/clear', { projectId });
      showMessage('Graph cleared from storage', 'success');
    }

    graphData = { nodes: [], edges: [] };
    fileContents.clear();
    renderGraph();
    fileListEl.innerHTML = '';
  } catch (error) {
    console.error('Clear error:', error);
    showMessage(`Error clearing graph: ${error.message}`, 'error');
  }
}

// Load saved graph
async function loadGraph() {
  if (!isForgeContext) {
    showMessage('Load functionality requires Forge deployment', 'info');
    return;
  }

  try {
    const repoUrl = repoUrlInput.value.trim();
    if (!repoUrl) {
      showMessage('Please enter a GitHub repository URL', 'error');
      return;
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      showMessage('Invalid GitHub URL', 'error');
      return;
    }

    const projectId = `${parsed.owner}/${parsed.repo}`;
    showMessage('Loading graph from storage...', 'info');

    const result = await invokeResolver('/graph', { projectId });
    graphData = result.graph;

    renderGraph();
    showMessage(`Loaded graph with ${graphData.nodes.length} nodes and ${graphData.edges.length} edges`, 'success');
  } catch (error) {
    console.error('Load error:', error);
    showMessage(`Error loading graph: ${error.message}`, 'error');
  }
}

// Event listeners
analyzeBtn.addEventListener('click', analyzeRepository);
clearBtn.addEventListener('click', clearGraph);
loadBtn.addEventListener('click', loadGraph);

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Initializing CodeGraph UW...');

  if (typeof cytoscape === 'undefined') {
    console.error('Cytoscape library not loaded!');
    showMessage('Error: Cytoscape library not loaded', 'error');
    return;
  }

  console.log('Cytoscape library loaded successfully');

  initGraph();

  analyzeBtn.disabled = true;
  loadBtn.disabled = true;

  if (await isForgeReady()) {
    analyzeBtn.disabled = false;
    loadBtn.disabled = false;
    showMessage('Ready to analyze GitHub repositories (up to 50 files). API keys managed via Forge environment variables.', 'info');
  } else {
    showMessage('Warning: Not running in Forge context. Please deploy to Jira to use this app.', 'error');
    analyzeBtn.disabled = true;
    loadBtn.disabled = true;
  }
});
