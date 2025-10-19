// CodeGraph Demo (Dev) - Full GitHub Repository Analyzer
// Gemini API Configuration
const GEMINI_API_KEY = 'GEMINI API KEY';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

// GitHub configuration
const GITHUB_TOKEN = 'GITHUB API KEY';

// Graph data
let graphData = { nodes: [], edges: [] };
let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let fileContents = new Map();
let selectedNode = null;
let hoveredNode = null;

// Node type filters for legend
let nodeTypeFilters = {
  file: true,
  class: true,
  function: true,
  variable: true,
  import: true
};

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

// Resolve relative paths to absolute repository paths
function resolvePath(currentFilePath, relativePath) {
  const pathParts = currentFilePath.split('/').slice(0, -1); // Get the directory of the current file
  const relativeParts = relativePath.split('/');

  for (const part of relativeParts) {
    if (part === '..') {
      pathParts.pop();
    } else if (part !== '.') {
      pathParts.push(part);
    }
  }
  return pathParts.join('/');
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
  const fileNode = {
    id: nodeId,
    label: analysis.title || filename.split('/').pop(),
    name: analysis.title || filename.split('/').pop(),
    filename: filename,
    type: 'file',
    blockType: analysis.blockType || 'other',
    metadata: {
      purpose: analysis.purpose || '',
      complexity: analysis.complexity || 'medium',
      relatedConcepts: analysis.relatedConcepts || []
    }
  };

  graphData.nodes.push(fileNode);

  // Add external library dependencies
  if (analysis.dependencies?.external) {
    analysis.dependencies.external.forEach(lib => {
      const libId = `lib:${lib}`;
      if (!graphData.nodes.find(n => n.id === libId)) {
        graphData.nodes.push({
          id: libId,
          label: lib,
          name: lib,
          type: 'import'
        });
      }
      graphData.edges.push({
        source: nodeId,
        target: libId,
        label: 'uses'
      });
    });
  }

  // Add internal file dependencies
  if (analysis.dependencies?.internal) {
    analysis.dependencies.internal.forEach(path => {
      // Resolve the relative path to a full repository path
      const targetPath = resolvePath(filename, path);
      const targetId = `file:${targetPath}`;

      if (!graphData.nodes.find(n => n.id === targetId)) {
        graphData.nodes.push({
          id: targetId,
          label: targetPath.split('/').pop(),
          name: targetPath.split('/').pop(),
          filename: targetPath,
          type: 'file'
        });
      }

      graphData.edges.push({
        source: nodeId,
        target: targetId,
        label: 'imports'
      });
    });
  }

  // Add API dependencies
  if (analysis.dependencies?.apis) {
    analysis.dependencies.apis.forEach(api => {
      const apiId = `api:${api}`;
      if (!graphData.nodes.find(n => n.id === apiId)) {
        graphData.nodes.push({
          id: apiId,
          label: api,
          name: api,
          type: 'class'
        });
      }
      graphData.edges.push({
        source: nodeId,
        target: apiId,
        label: 'calls'
      });
    });
  }
}

// Initialize D3 graph
function initGraph() {
  const container = document.getElementById('cy');
  if (!container) {
    console.error('Graph container not found');
    return;
  }

  const { clientWidth: width, clientHeight: height } = container;

  if (width === 0 || height === 0) {
    console.warn('Container has no dimensions yet');
    return;
  }

  // Clear previous graph
  if (svg) {
    d3.select(container).selectAll('*').remove();
  }

  // Create SVG
  svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('background-color', '#0a0a14');

  // Add dark background rect to SVG
  svg.insert('rect', ':first-child')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', '#0a0a14');

  // Create main group with zoom
  g = svg.append('g');

  // Add zoom behavior
  zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Initial transform to center
  svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));

  // Create arrow markers for directed edges
  const defs = svg.append('defs');
  
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('path')
    .attr('d', 'M 0,-5 L 10,0 L 0,5')
    .attr('fill', 'rgba(255, 255, 255, 0.3)');

  // Add glow filter
  const filter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');

  filter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'coloredBlur');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  console.log('D3 graph initialized');
}

// Render graph with D3
function renderGraph() {
  if (!svg || !g) {
    initGraph();
  }

  if (!graphData.nodes || graphData.nodes.length === 0) {
    console.log('No nodes to render');
    updateStats();
    return;
  }

  // Filter nodes based on nodeTypeFilters
  const filteredNodes = graphData.nodes.filter(n => nodeTypeFilters[n.type]);
  const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(e =>
    visibleNodeIds.has(e.source.id || e.source) && visibleNodeIds.has(e.target.id || e.target)
  );

  if (filteredNodes.length === 0) {
    console.log('No visible nodes after filtering');
    g.selectAll('*').remove();
    updateStats();
    return;
  }

  // Clear previous content
  g.selectAll('*').remove();

  // Node type colors
  const nodeColors = {
    file: '#8400FF',
    class: '#00D4FF',
    function: '#00FF88',
    variable: '#FFB800',
    import: '#FF006E'
  };

  // Create a copy of filtered nodes and edges for D3
  const nodes = filteredNodes.map(n => ({ ...n }));
  const edges = filteredEdges.map(e => ({ ...e }));

  // Create simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(150))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(0, 0))
    .force('collision', d3.forceCollide().radius(40));

  // Create edges
  const link = g.append('g')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('stroke', 'rgba(132, 0, 255, 0.3)')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')
    .style('opacity', 0);

  // Animate edges in
  link.transition()
    .duration(800)
    .delay((d, i) => i * 20)
    .style('opacity', 1);

  // Create node groups
  const node = g.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('cursor', 'pointer')
    .style('opacity', 0)
    .call(drag(simulation));

  // Add circles to nodes
  node.append('circle')
    .attr('r', d => {
      if (d.type === 'file') return 16;
      if (d.type === 'class') return 14;
      return 12;
    })
    .attr('fill', d => nodeColors[d.type] || '#8400FF')
    .attr('stroke', 'rgba(255, 255, 255, 0.3)')
    .attr('stroke-width', 2)
    .style('filter', 'url(#glow)');

  // Add inner glow circle
  node.append('circle')
    .attr('r', d => {
      if (d.type === 'file') return 10;
      if (d.type === 'class') return 8;
      return 6;
    })
    .attr('fill', 'rgba(255, 255, 255, 0.2)')
    .style('pointer-events', 'none');

  // Add labels
  node.append('text')
    .text(d => d.label || d.name || d.id)
    .attr('x', 0)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '12px')
    .attr('font-weight', '500')
    .style('pointer-events', 'none')
    .style('text-shadow', '0 2px 8px rgba(0, 0, 0, 0.8)');

  // Animate nodes in
  node.transition()
    .duration(600)
    .delay((d, i) => i * 30)
    .style('opacity', 1);

  // Add hover effects
  node.on('mouseenter', function(event, d) {
    hoveredNode = d;
    updateNodeInfo();
    
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', d => {
        if (d.type === 'file') return 20;
        if (d.type === 'class') return 18;
        return 16;
      })
      .attr('stroke-width', 3);

    // Highlight connected edges
    link.attr('stroke', l => 
      (l.source.id === d.id || l.target.id === d.id) 
        ? 'rgba(132, 0, 255, 0.8)' 
        : 'rgba(132, 0, 255, 0.3)'
    )
    .attr('stroke-width', l =>
      (l.source.id === d.id || l.target.id === d.id) ? 3 : 2
    );
  })
  .on('mouseleave', function(event, d) {
    hoveredNode = null;
    updateNodeInfo();
    
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', d => {
        if (d.type === 'file') return 16;
        if (d.type === 'class') return 14;
        return 12;
      })
      .attr('stroke-width', 2);

    link.attr('stroke', 'rgba(132, 0, 255, 0.3)')
      .attr('stroke-width', 2);
  })
  .on('click', function(event, d) {
    event.stopPropagation();
    selectedNode = d;
    updateNodeInfo();
  });

  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // Drag behavior
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // Click on background to deselect
  svg.on('click', function(event) {
    if (event.target === this || event.target.tagName === 'rect') {
      selectedNode = null;
      hoveredNode = null;
      updateNodeInfo();
    }
  });

  updateStats();
}

// Update node info panel
function updateNodeInfo() {
  const nodeDetailsDiv = document.getElementById('nodeDetails');
  const node = hoveredNode || selectedNode;

  if (!node) {
    nodeDetailsDiv.style.display = 'none';
    return;
  }

  const nodeColors = {
    file: '#8400FF',
    class: '#00D4FF',
    function: '#00FF88',
    variable: '#FFB800',
    import: '#FF006E'
  };

  const color = nodeColors[node.type] || '#8400FF';

  let metadataHTML = '';
  if (node.metadata) {
    metadataHTML = '<div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">';
    for (const [key, value] of Object.entries(node.metadata)) {
      if (Array.isArray(value) && value.length > 0) {
        metadataHTML += `<div style="margin-bottom: 4px;"><span style="color: rgba(255, 255, 255, 0.4);">${key}:</span> ${value.join(', ')}</div>`;
      } else if (!Array.isArray(value) && value) {
        metadataHTML += `<div style="margin-bottom: 4px;"><span style="color: rgba(255, 255, 255, 0.4);">${key}:</span> ${String(value)}</div>`;
      }
    }
    metadataHTML += '</div>';
  }

  nodeDetailsDiv.innerHTML = `
    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${color}; margin-bottom: 8px; font-weight: 600;">
      ${node.type}
    </div>
    <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 8px; word-break: break-word;">
      ${node.label || node.name || node.id}
    </div>
    ${metadataHTML}
  `;

  nodeDetailsDiv.style.display = 'block';
  nodeDetailsDiv.style.border = `1px solid ${color}`;
  nodeDetailsDiv.style.boxShadow = `0 8px 32px ${color}40`;
}

// Show node details (legacy compatibility)
function showNodeDetails(nodeData) {
  selectedNode = nodeData;
  updateNodeInfo();
}

function hideNodeDetails() {
  selectedNode = null;
  hoveredNode = null;
  updateNodeInfo();
}

// Show message
function showMessage(html, type = 'info') {
  messageArea.innerHTML = `<div class="message ${type}">${html}</div>`;
}

// Update stats
function updateStats() {
  const fileNodes = graphData.nodes ? graphData.nodes.filter(n => n.filename) : [];
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
    let errorMsg = error.message;
    
    // Provide more helpful error messages
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      errorMsg = 'Network error: Unable to connect to GitHub API. Please check your internet connection or try again later.';
    } else if (errorMsg.includes('403')) {
      errorMsg = 'GitHub API rate limit exceeded. Please try again in a few minutes.';
    } else if (errorMsg.includes('404')) {
      errorMsg = 'Repository not found. Please check the URL and branch name.';
    } else if (errorMsg.includes('401')) {
      errorMsg = 'Authentication failed. The GitHub token may be invalid.';
    }
    
    showMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    analyzeBtn.disabled = false;
  }
}

// Clear graph
function clearGraph() {
  graphData = { nodes: [], edges: [] };
  fileContents.clear();
  selectedNode = null;
  hoveredNode = null;
  if (simulation) {
    simulation.stop();
  }
  renderGraph();
  fileListEl.innerHTML = '';
  showMessage('Graph cleared', 'success');
}

// Toggle node type visibility
function toggleNodeType(type) {
  nodeTypeFilters[type] = !nodeTypeFilters[type];
  updateLegendUI();
  renderGraph();
}

// Update legend UI to reflect filter state
function updateLegendUI() {
  const legendItems = document.querySelectorAll('.legend-item');
  const nodeTypes = ['file', 'class', 'function', 'variable', 'import'];
  
  legendItems.forEach((item, index) => {
    const type = nodeTypes[index];
    if (nodeTypeFilters[type]) {
      item.style.opacity = '1';
      item.style.cursor = 'pointer';
    } else {
      item.style.opacity = '0.3';
      item.style.cursor = 'pointer';
    }
  });
}

// Initialize legend interactivity
function initLegend() {
  const legendItems = document.querySelectorAll('.legend-item');
  const nodeTypes = ['file', 'class', 'function', 'variable', 'import'];
  
  legendItems.forEach((item, index) => {
    const type = nodeTypes[index];
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.2s ease';
    
    item.addEventListener('click', () => {
      toggleNodeType(type);
    });
    
    item.addEventListener('mouseenter', () => {
      if (nodeTypeFilters[type]) {
        item.style.transform = 'translateX(4px)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });
  
  updateLegendUI();
}

// Event listeners
analyzeBtn.addEventListener('click', analyzeRepository);
clearBtn.addEventListener('click', clearGraph);
loadBtn.addEventListener('click', () => {
  showMessage('Load functionality available in Forge deployment only', 'info');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing CodeGraph Demo (Dev)...');

  if (typeof d3 === 'undefined') {
    console.error('D3 library not loaded!');
    showMessage('Error: D3 library not loaded', 'error');
    return;
  }

  console.log('D3 library loaded successfully');
  initGraph();
  initLegend();
  showMessage('Ready to analyze GitHub repositories (up to 50 files)', 'info');
});
