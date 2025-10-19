// CodeGraph Demo (Dev) - Full GitHub Repository Analyzer
// Gemini API Configuration
const GEMINI_API_KEY = 'gemini api key';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// GitHub configuration
const GITHUB_TOKEN = 'github token';

// Graph data
let graphData = { nodes: [], edges: [] };
let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let fileContents = new Map();
let selectedNode = null;
let hoveredNode = null;
let lastRenderedNodeCount = 0; // Track how many nodes were in the last render

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
  const prompt = `Analyze this code file to extract a detailed knowledge graph node.

Filename: ${filename}

Code:
\`\`\`
${code.substring(0, 8000)}
\`\`\`

Return a detailed JSON object with the following structure:
{
  "title": "A concise, descriptive name (4-6 words)",
  "purpose": "A 2-3 sentence summary explaining the file's role, its main responsibilities, and how it fits into the broader application.",
  "blockType": "frontend|backend|database|auth|utils|config|test|other",
  "complexity": "low|medium|high|very-high",
  "keyExports": {
    "functions": ["list key exported functions, e.g., 'getUser()'"],
    "classes": ["list key exported classes or components, e.g., 'UserProfile'"],
    "variables": ["list key exported constants or configurations"]
  },
  "coreLogic": "A brief paragraph (3-5 sentences) describing the most important logic or functionality within the code. Mention specific functions or methods if applicable.",
  "dependencies": {
    "external": ["library names only, e.g., 'react', 'express'"],
    "internal": ["relative file paths imported, e.g., './utils/helper.js'"],
    "apis": ["external APIs called, e.g., 'GitHub API', 'Stripe API'"]
  },
  "relatedConcepts": ["key technical or domain concepts, up to 5"]
}

Provide detailed and specific information based directly on the code provided.`;

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
      relatedConcepts: analysis.relatedConcepts || [],
      coreLogic: analysis.coreLogic || '',
      keyExports: analysis.keyExports || {}
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
// Initialize animated starfield background
function initDotGrid() {
  const container = document.getElementById('cy');
  if (!container) return;

  // Configuration
  const config = {
    dotSize: 3,
    gap: 30,
    baseColor: { r: 82, g: 39, b: 255 }, // #5227FF
    activeColor: { r: 132, g: 0, b: 255 }, // #8400FF
    proximity: 120,
    speedTrigger: 100,
    shockRadius: 200,
    shockStrength: 2,
    returnDuration: 800, // ms
    returnEase: 0.15,
    baseOpacity: 0.3,
    activeOpacity: 0.7
  };

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  container.insertBefore(canvas, container.firstChild);

  const ctx = canvas.getContext('2d');
  const dots = [];
  let pointer = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, vx: 0, vy: 0, speed: 0, lastTime: 0 };
  let animationId;

  // Build grid
  function buildGrid() {
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const cell = config.dotSize + config.gap;
    const cols = Math.floor((width + config.gap) / cell);
    const rows = Math.floor((height + config.gap) / cell);

    const gridW = cell * cols - config.gap;
    const gridH = cell * rows - config.gap;
    const startX = (width - gridW) / 2 + config.dotSize / 2;
    const startY = (height - gridH) / 2 + config.dotSize / 2;

    dots.length = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          targetX: 0,
          targetY: 0,
          returning: false
        });
      }
    }
  }

  buildGrid();

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const proxSq = config.proximity * config.proximity;
    const { x: px, y: py } = pointer;

    for (const dot of dots) {
      // Update physics
      if (dot.returning) {
        dot.vx += (dot.targetX - dot.x) * config.returnEase;
        dot.vy += (dot.targetY - dot.y) * config.returnEase;
        dot.vx *= 0.85;
        dot.vy *= 0.85;
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (Math.abs(dot.x - dot.targetX) < 0.1 && Math.abs(dot.y - dot.targetY) < 0.1) {
          dot.x = dot.targetX;
          dot.y = dot.targetY;
          dot.vx = 0;
          dot.vy = 0;
          dot.returning = false;
        }
      } else {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.vx *= 0.95;
        dot.vy *= 0.95;
      }

      // Calculate color based on proximity
      const ox = dot.cx + dot.x;
      const oy = dot.cy + dot.y;
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;

      let color = `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${config.baseOpacity})`;
      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / config.proximity;
        const r = Math.round(config.baseColor.r + (config.activeColor.r - config.baseColor.r) * t);
        const g = Math.round(config.baseColor.g + (config.activeColor.g - config.baseColor.g) * t);
        const b = Math.round(config.baseColor.b + (config.activeColor.b - config.baseColor.b) * t);
        const opacity = config.baseOpacity + (config.activeOpacity - config.baseOpacity) * t;
        color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // Draw dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ox, oy, config.dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Mouse movement handler
  let lastMoveTime = 0;
  function handleMouseMove(e) {
    const now = performance.now();
    if (now - lastMoveTime < 16) return; // Throttle to ~60fps
    lastMoveTime = now;

    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    const dt = pointer.lastTime ? now - pointer.lastTime : 16;
    const dx = pointer.x - pointer.lastX;
    const dy = pointer.y - pointer.lastY;
    pointer.vx = (dx / dt) * 1000;
    pointer.vy = (dy / dt) * 1000;
    pointer.speed = Math.sqrt(pointer.vx * pointer.vx + pointer.vy * pointer.vy);

    pointer.lastX = pointer.x;
    pointer.lastY = pointer.y;
    pointer.lastTime = now;

    // Push dots on fast movement
    if (pointer.speed > config.speedTrigger) {
      for (const dot of dots) {
        if (dot.returning) continue;
        const dist = Math.sqrt((dot.cx - pointer.x) ** 2 + (dot.cy - pointer.y) ** 2);
        if (dist < config.proximity) {
          const pushX = (dot.cx - pointer.x) + pointer.vx * 0.002;
          const pushY = (dot.cy - pointer.y) + pointer.vy * 0.002;
          dot.vx = pushX * 0.04;
          dot.vy = pushY * 0.04;
          dot.targetX = 0;
          dot.targetY = 0;
          dot.returning = true;
        }
      }
    }
  }

  // Click handler - shockwave effect
  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (const dot of dots) {
      const dist = Math.sqrt((dot.cx - cx) ** 2 + (dot.cy - cy) ** 2);
      if (dist < config.shockRadius) {
        const falloff = Math.max(0, 1 - dist / config.shockRadius);
        const pushX = (dot.cx - cx) * config.shockStrength * falloff;
        const pushY = (dot.cy - cy) * config.shockStrength * falloff;
        dot.vx = pushX * 0.07;
        dot.vy = pushY * 0.07;
        dot.targetX = 0;
        dot.targetY = 0;
        dot.returning = true;
      }
    }
  }

  // Event listeners
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleClick);
  window.addEventListener('resize', buildGrid);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('click', handleClick);
    window.removeEventListener('resize', buildGrid);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
}

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
    d3.select(container).selectAll('svg').remove();
  }

  // Initialize starfield background
  initDotGrid();

  // Create SVG with transparent background
  svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('background-color', 'transparent')
    .style('position', 'relative')
    .style('z-index', '1');

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
    .attr('refX', 22)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('path')
    .attr('d', 'M 0,-5 L 10,0 L 0,5')
    .attr('fill', 'rgba(255, 255, 255, 0.4)');

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

// Calculate PageRank for nodes
function calculatePageRank(nodes, edges, iterations = 20, dampingFactor = 0.85) {
  const nodeMap = new Map();
  const pageRank = new Map();
  const outLinks = new Map();
  
  // Initialize
  nodes.forEach(n => {
    nodeMap.set(n.id, n);
    pageRank.set(n.id, 1.0 / nodes.length);
    outLinks.set(n.id, []);
  });
  
  // Build outgoing links (source -> target)
  edges.forEach(e => {
    const sourceId = e.source.id || e.source;
    const targetId = e.target.id || e.target;
    if (outLinks.has(sourceId)) {
      outLinks.get(sourceId).push(targetId);
    }
  });
  
  // Iterate PageRank algorithm
  for (let iter = 0; iter < iterations; iter++) {
    const newRank = new Map();
    
    // Initialize with random walk probability
    nodes.forEach(n => newRank.set(n.id, (1 - dampingFactor) / nodes.length));
    
    // Add contributions from linking nodes
    nodes.forEach(n => {
      const links = outLinks.get(n.id) || [];
      if (links.length > 0) {
        const contribution = pageRank.get(n.id) / links.length;
        links.forEach(targetId => {
          newRank.set(targetId, newRank.get(targetId) + dampingFactor * contribution);
        });
      }
    });
    
    // Update pageRank
    pageRank.clear();
    newRank.forEach((value, key) => pageRank.set(key, value));
  }
  
  return pageRank;
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

  // --- START: New Non-Linear Scaling Logic ---

  // Calculate PageRank for each node
  const pageRankMap = calculatePageRank(nodes, edges);
  let minRank = Infinity, maxRank = -Infinity;

  nodes.forEach(n => {
    const rank = pageRankMap.get(n.id) || 0;
    n.pageRank = rank;
    if (rank < minRank) minRank = rank;
    if (rank > maxRank) maxRank = rank;
  });

  // Function to scale the size non-linearly
  const calculateRadius = (d) => {
    const baseSize = d.type === 'file' ? 20 : d.type === 'class' ? 16 : 14;
    
    if (maxRank === minRank) return baseSize; // Avoid division by zero

    // Normalize PageRank from 0 to 1
    const normalizedRank = (d.pageRank - minRank) / (maxRank - minRank);
    
    // Apply a power scale to exaggerate higher values. Exponent > 1.
    const powerScaledRank = Math.pow(normalizedRank, 2); 
    
    // Define max bonus size and apply it
    const maxBonus = 40; // Max additional radius for the most important node
    const pageRankBonus = powerScaledRank * maxBonus;
    
    return baseSize + pageRankBonus;
  };
  // --- END: New Non-Linear Scaling Logic ---

  // Create simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(300))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(0, 0))
    .force('collision', d3.forceCollide().radius(d => calculateRadius(d) + 10)); // +10 for spacing

  // Create edges
  const link = g.append('g')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('stroke', 'rgba(132, 0, 255, 0.4)')
    .attr('stroke-width', 3)
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
    .style('opacity', (d, i) => i < lastRenderedNodeCount ? 1 : 0) // Only fade in new nodes
    .call(drag(simulation));

  // Add circles to nodes
  node.append('circle')
    .attr('r', d => calculateRadius(d))
    .attr('fill', d => nodeColors[d.type] || '#8400FF')
    .attr('stroke', 'rgba(255, 255, 255, 0.3)')
    .attr('stroke-width', 2)
    .style('filter', 'url(#glow)');

  // Add inner glow circle
  node.append('circle')
    .attr('r', d => calculateRadius(d) * 0.6)
    .attr('fill', 'rgba(255, 255, 255, 0.2)')
    .style('pointer-events', 'none');

  // Add labels
  node.append('text')
    .text(d => d.label || d.name || d.id)
    .attr('x', 0)
    .attr('y', 38)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '13px')
    .attr('font-weight', '500')
    .style('pointer-events', 'none')
    .style('text-shadow', '0 2px 8px rgba(0, 0, 0, 0.8)');

  // Animate only new nodes in
  node.filter((d, i) => i >= lastRenderedNodeCount)
    .transition()
    .duration(600)
    .delay((d, i) => i * 30)
    .style('opacity', 1);
  
  // Update the count for next render
  lastRenderedNodeCount = nodes.length;

  // Add hover effects
  node.on('mouseenter', function(event, d) {
    hoveredNode = d;
    updateNodeInfo();
    
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', d => calculateRadius(d) + 6) // Add a fixed amount for hover
      .attr('stroke-width', 4);

    // Highlight connected edges
    link.attr('stroke', l => 
      (l.source.id === d.id || l.target.id === d.id) 
        ? 'rgba(132, 0, 255, 1)' 
        : 'rgba(132, 0, 255, 0.4)'
    )
    .attr('stroke-width', l =>
      (l.source.id === d.id || l.target.id === d.id) ? 5 : 3
    );
  })
  .on('mouseleave', function(event, d) {
    hoveredNode = null;
    updateNodeInfo();
    
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', d => calculateRadius(d)) // Return to original calculated radius
      .attr('stroke-width', 2);

    link.attr('stroke', 'rgba(132, 0, 255, 0.4)')
      .attr('stroke-width', 3);
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
    metadataHTML = '<div class="metadata-section">';
    for (const [key, value] of Object.entries(node.metadata)) {
      let displayValue = '';
      if (Array.isArray(value) && value.length > 0) {
        displayValue = value.join(', ');
      } else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        // Handle nested objects like keyExports
        displayValue = Object.entries(value)
          .filter(([k, v]) => Array.isArray(v) && v.length > 0)
          .map(([k, v]) => `<strong>${k}:</strong> ${v.join(', ')}`)
          .join('<br>');
      } else if (!Array.isArray(value) && value) {
        displayValue = String(value);
      }

      if (displayValue) {
        metadataHTML += `<div class="metadata-item">
          <span class="metadata-key">${key}:</span>
          <span class="metadata-value">${displayValue}</span>
        </div>`;
      }
    }
    metadataHTML += '</div>';
  }

  // Code preview logic
  let codePreviewHTML = '';
  if (node.type === 'file' && fileContents.has(node.filename)) {
    const fileContent = fileContents.get(node.filename);
    const codeSnippet = fileContent.split('\n').slice(0, 15).join('\n'); // Get first 15 lines
    
    // Basic escaping for HTML
    const escapedCode = codeSnippet.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    codePreviewHTML = `
      <div class="code-preview-container">
        <div class="code-preview-title">Code Preview</div>
        <pre class="code-preview"><code>${escapedCode}</code></pre>
      </div>
    `;
  }

  nodeDetailsDiv.innerHTML = `
    <div class="node-type" style="color: ${color};">
      ${node.type}
    </div>
    <div class="node-label">
      ${node.label || node.name || node.id}
    </div>
    ${metadataHTML}
    ${codePreviewHTML}
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
          
          // Render graph after each file to show progressive updates
          renderGraph();
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
  lastRenderedNodeCount = 0; // Reset animation counter
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
