// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyDqUF1H5zH-NhBxYiZjrqQlN3Nnyo9mkZ0';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// Graph data
let graphData = { nodes: [], edges: [] };
let cy = null;
let fileContents = new Map(); // Store file contents

// DOM Elements
const repoUrlInput = document.getElementById('repoUrl');
const branchInput = document.getElementById('branch');
const analyzeRepoBtn = document.getElementById('analyzeRepoBtn');
const fileTreeDiv = document.getElementById('fileTree');
const messageArea = document.getElementById('messageArea');
const nodeDetailsDiv = document.getElementById('nodeDetails');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
analyzeRepoBtn.addEventListener('click', analyzeRepository);
resetBtn.addEventListener('click', resetGraph);

// Parse GitHub URL
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

// GitHub configuration
const GITHUB_TOKEN = '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';

// Fetch repository file tree from GitHub
async function fetchRepoTree(owner, repo, branch = 'main') {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      // Check if it's rate limit
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');

      if (remaining === '0') {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        const minutes = Math.ceil((resetDate - new Date()) / 60000);

        console.log(`
╔════════════════════════════════════════════════════════════════════╗
║  GitHub API Rate Limit Exceeded                                    ║
╚════════════════════════════════════════════════════════════════════╝

To increase your rate limit from 60 to 5,000 requests/hour:

1. Create a GitHub Personal Access Token:
   https://github.com/settings/tokens/new

2. No scopes needed for public repos (just leave all boxes unchecked)

3. Copy the token and add it to the fetch calls in app-v2.js:

   headers: {
     'Authorization': 'Bearer YOUR_TOKEN_HERE'
   }

Current limit: 60 requests/hour (unauthenticated)
With token: 5,000 requests/hour
        `);

        throw new Error(`GitHub API rate limit exceeded. Resets in ${minutes} minutes.

💡 Solutions:
1. Wait ${minutes} minutes for rate limit reset
2. Try a smaller repository (fewer files)
3. Add GitHub Personal Access Token (see console for instructions)`);
      }
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  // Support ALL major programming languages
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
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining === '0') {
        throw new Error('GitHub API rate limit exceeded during file fetch');
      }
    }
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  return atob(data.content); // Decode base64
}

// Show message
function showMessage(html, type = 'info') {
  const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'progress';
  messageArea.innerHTML = `<div class="${className}">${html}</div>`;
}

// Clear message
function clearMessage() {
  messageArea.innerHTML = '';
}

// Render file tree
function renderFileTree(files) {
  fileTreeDiv.innerHTML = '';
  files.forEach(file => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
      <span class="file-icon">📄</span>
      <span>${file.path}</span>
    `;
    div.onclick = () => {
      document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      highlightFileInGraph(file.path);
    };
    fileTreeDiv.appendChild(div);
  });
}

// Highlight file in graph
function highlightFileInGraph(filePath) {
  if (!cy) return;

  cy.nodes().forEach(node => {
    if (node.data('filename') === filePath) {
      cy.animate({
        fit: {
          eles: node,
          padding: 100
        },
        duration: 500
      });
      node.select();
    }
  });
}

// Call Gemini API - Focus on HIGH-LEVEL BLOCKS for instant repository understanding
async function analyzeWithGemini(code, filename) {
  const ext = filename.split('.').pop();
  const lang = getLanguageName(ext);

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
  "usesLibraries": ["Max 2 key libraries"],
  "improvementTask": "Suggested task to improve this block (e.g., 'Add input validation', 'Implement retry logic', 'Add error logging', 'Cache results', 'Add tests')"
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
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
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

function getLanguageName(ext) {
  const langs = {
    js: 'JavaScript', jsx: 'React JSX', ts: 'TypeScript', tsx: 'React TSX',
    py: 'Python', java: 'Java', go: 'Go', rs: 'Rust',
    cpp: 'C++', c: 'C', h: 'C/C++ Header', hpp: 'C++ Header',
    cs: 'C#', rb: 'Ruby', php: 'PHP', swift: 'Swift',
    kt: 'Kotlin', scala: 'Scala', clj: 'Clojure',
    ex: 'Elixir', erl: 'Erlang', hs: 'Haskell',
    r: 'R', dart: 'Dart', lua: 'Lua', pl: 'Perl',
    sh: 'Shell', sql: 'SQL', vue: 'Vue', svelte: 'Svelte'
  };
  return langs[ext] || ext.toUpperCase();
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
      files: [filename]
    }
  });

  // Create edges based on data flow (inputs/outputs)
  // This will be done after all nodes are added - see connectBlocks() function
}

// Connect blocks based on matching inputs/outputs
function connectBlocks() {
  const nodes = graphData.nodes;

  // Create edges where one block's output matches another's input
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
                  label: output
                }
              });
            }
          }
        });
      });
    });
  });

  console.log(`Connected blocks: ${graphData.edges.length} edges created`);
}

// Render improved graph with better appearance and no crashes
function renderGraph() {
  try {
    console.log('🎨 renderGraph called');
    console.log('Graph data:', {
      nodes: graphData.nodes.length,
      edges: graphData.edges.length,
      sampleNode: graphData.nodes[0]
    });

    if (cy) {
      cy.destroy();
      cy = null;
    }

    if (!graphData.nodes || graphData.nodes.length === 0) {
      console.error('❌ No nodes to render!');
      showMessage('No graph data available', 'error');
      return;
    }

    console.log('Creating Cytoscape instance...');
    const container = document.getElementById('cy');
    console.log('Container:', container, 'Width:', container.offsetWidth, 'Height:', container.offsetHeight);

    cy = cytoscape({
      container: container,
      elements: {
        nodes: graphData.nodes,
        edges: graphData.edges
      },

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

            // Obsidian-style: all nodes are circles
            'shape': 'ellipse',

            // Size based on importance (file nodes larger than dependencies)
            'width': ele => {
              const type = ele.data('semanticType');
              if (type === 'external-lib' || type === 'placeholder') return 45;
              if (type === 'external-api') return 50;
              return 60; // Main file nodes
            },
            'height': ele => {
              const type = ele.data('semanticType');
              if (type === 'external-lib' || type === 'placeholder') return 45;
              if (type === 'external-api') return 50;
              return 60;
            },

            // Clean text styling
            'font-size': 10,
            'font-weight': 500,
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'text-outline-width': 2,
            'text-outline-color': '#000000',
            'text-wrap': 'wrap',
            'text-max-width': 80,

            // Subtle styling like Obsidian
            'background-opacity': 0.9,
            'border-width': 3,
            'border-color': '#ffffff',
            'border-opacity': 0.3
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
            'opacity': 0.4,
            'arrow-scale': 0.8
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 5,
            'border-color': '#fbbf24',
            'border-opacity': 1,
            'z-index': 9999,
            'background-opacity': 1,
            'shadow-blur': 20,
            'shadow-opacity': 0.6
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
        // Enable smooth animations like Obsidian
        animate: true,
        animationDuration: 1000,
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
      },

      wheelSensitivity: 0.2,
      autoungrabify: false,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true
    });

  // BLOCK details - show specific info
  cy.on('tap', 'node', evt => {
    const node = evt.target;
    const d = node.data();

    let html = `<h3>${d.label}</h3>`;

    if (d.category) {
      html += `<p style="color: #a78bfa;"><strong>Category:</strong> ${d.category.replace(/-/g, ' ').toUpperCase()}</p>`;
    }

    if (d.whatItDoes) {
      html += `<p><strong>What it does:</strong> ${d.whatItDoes}</p>`;
    }

    if (d.takesIn && d.takesIn.length > 0) {
      html += `<p><strong>📥 Takes in:</strong> ${d.takesIn.join(', ')}</p>`;
    }

    if (d.produces && d.produces.length > 0) {
      html += `<p><strong>📤 Produces:</strong> ${d.produces.join(', ')}</p>`;
    }

    if (d.usesLibraries && d.usesLibraries.length > 0) {
      html += `<p><strong>🛠️ Uses:</strong> ${d.usesLibraries.join(', ')}</p>`;
    }

    if (d.improvementTask) {
      html += `<div style="margin-top: 12px; padding: 8px; background: rgba(99, 102, 241, 0.1); border-left: 3px solid #6366f1; border-radius: 4px;">`;
      html += `<p style="font-weight: 600; color: #6366f1; margin-bottom: 4px;">💡 Suggested Task:</p>`;
      html += `<p style="font-size: 12px; color: #e0e0e0;">${d.improvementTask}</p>`;
      html += `</div>`;
    }

    if (d.files && d.files.length > 0) {
      html += `<p style="font-size: 10px; color: #666; margin-top: 12px;">Files: ${d.files.join(', ')}</p>`;
    }

    nodeDetailsDiv.innerHTML = html;
    nodeDetailsDiv.classList.add('visible');
  });

  // Click outside to hide details
  cy.on('tap', evt => {
    if (evt.target === cy) {
      nodeDetailsDiv.classList.remove('visible');
    }
  });

  // Enable Obsidian-style dragging with physics
  cy.on('grab', 'node', evt => {
    const node = evt.target;

    // When dragging, allow the layout to adjust
    cy.autounselectify(true);

    // Mark node as locked position during drag
    node.lock();
  });

  cy.on('drag', 'node', evt => {
    const node = evt.target;

    // Get nearby nodes and slightly adjust their positions (Obsidian-like physics)
    const position = node.position();
    const neighborhood = cy.nodes().filter(n => {
      if (n.id() === node.id()) return false;
      const dist = Math.sqrt(
        Math.pow(n.position().x - position.x, 2) +
        Math.pow(n.position().y - position.y, 2)
      );
      return dist < 150; // Affect nodes within 150px
    });

    // Subtle repulsion effect
    neighborhood.forEach(n => {
      const dx = n.position().x - position.x;
      const dy = n.position().y - position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const force = 0.3; // Gentle push
        n.shift({
          x: (dx / dist) * force,
          y: (dy / dist) * force
        });
      }
    });
  });

  cy.on('free', 'node', evt => {
    const node = evt.target;
    node.unlock();
    cy.autounselectify(false);
  });

    updateStats();
    console.log('✅ Graph rendered successfully!', {
      cytoscape: cy,
      totalNodes: cy.nodes().length,
      totalEdges: cy.edges().length
    });

  } catch (error) {
    console.error('❌ Graph rendering error:', error);
    console.error('Stack trace:', error.stack);
    showMessage(`Graph rendering failed: ${error.message}`, 'error');
  }
}

// Update stats
function updateStats() {
  document.getElementById('fileCount').textContent =
    graphData.nodes.filter(n => n.data.type !== 'dependency').length;
  document.getElementById('nodeCount').textContent = graphData.nodes.length;
  document.getElementById('edgeCount').textContent = graphData.edges.length;
}

// Reset graph
function resetGraph() {
  graphData = { nodes: [], edges: [] };
  if (cy) cy.destroy();
  cy = null;
  fileTreeDiv.innerHTML = '<p style="color: #666; font-size: 13px; text-align: center; padding: 20px;">Enter a GitHub repo URL and click Analyze</p>';
  clearMessage();
  updateStats();
}

// Main analysis function
async function analyzeRepository() {
  const repoUrl = repoUrlInput.value.trim();
  const branch = branchInput.value.trim() || 'main';

  if (!repoUrl) {
    showMessage('Please enter a GitHub repository URL', 'error');
    return;
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    showMessage('Invalid GitHub URL format', 'error');
    return;
  }

  analyzeRepoBtn.disabled = true;
  resetGraph();

  try {
    showMessage(`
      <div class="loading">
        <div class="spinner"></div>
        <p>Fetching repository structure...</p>
      </div>
    `);

    // Fetch file tree
    const files = await fetchRepoTree(parsed.owner, parsed.repo, branch);

    if (files.length === 0) {
      showMessage('No code files found in repository', 'error');
      return;
    }

    // Analyze more files for better repository understanding
    const filesToAnalyze = files.slice(0, 50);

    renderFileTree(filesToAnalyze);

    // Analyze files
    let analyzed = 0;
    for (const file of filesToAnalyze) {
      showMessage(`
        <div class="progress">
          <p>Analyzing: ${file.path}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(analyzed / filesToAnalyze.length) * 100}%"></div>
          </div>
          <p style="margin-top: 8px; font-size: 12px; color: #999;">${analyzed} / ${filesToAnalyze.length} files</p>
        </div>
      `);

      try {
        const content = await fetchFileContent(parsed.owner, parsed.repo, file.path, branch);
        fileContents.set(file.path, content);

        console.log(`📊 Analyzing ${file.path}...`);
        const analysis = await analyzeWithGemini(content, file.path);
        console.log(`📊 Analysis result for ${file.path}:`, analysis);

        if (analysis) {
          addToGraph(file.path, analysis);
          console.log(`✅ Added to graph. Total nodes: ${graphData.nodes.length}`);
        } else {
          console.warn(`⚠️ No analysis returned for ${file.path}`);
        }
      } catch (e) {
        console.error(`Failed to analyze ${file.path}:`, e);
      }

      analyzed++;

      // Minimal rate limiting for faster analysis
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    showMessage(`✅ Successfully analyzed ${analyzed} files! Connecting blocks...`, 'success');

    // Connect blocks based on inputs/outputs
    connectBlocks();

    renderGraph();

  } catch (error) {
    showMessage(`❌ Error: ${error.message}`, 'error');
    console.error(error);
  } finally {
    analyzeRepoBtn.disabled = false;
  }
}

// Initialize
updateStats();
