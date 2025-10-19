// Register Cytoscape layout extension
if (typeof cytoscape !== 'undefined' && typeof coseBilkent !== 'undefined') {
  cytoscape.use(coseBilkent);
  console.log('Cytoscape cose-bilkent layout registered');
}

// API Configuration - loaded from config.js
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Graph data storage
let graphData = {
  nodes: [],
  edges: []
};

let cy = null; // Cytoscape instance

// DOM elements
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filename');
const codeTextarea = document.getElementById('code');
const analyzeBtn = document.getElementById('analyzeBtn');
const messageDiv = document.getElementById('message');
const graphCard = document.getElementById('graphCard');
const statsDiv = document.getElementById('stats');
const nodeDetailsDiv = document.getElementById('nodeDetails');

// Event listeners
fileInput.addEventListener('change', handleFileUpload);
analyzeBtn.addEventListener('click', analyzeCode);

// Handle file upload
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  filenameInput.value = file.name;

  const reader = new FileReader();
  reader.onload = (evt) => {
    codeTextarea.value = evt.target.result;
  };
  reader.readAsText(file);
}

// Show message
function showMessage(text, type = 'info') {
  const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
  messageDiv.innerHTML = `<div class="${className}">${text}</div>`;
}

// Show loading
function showLoading() {
  messageDiv.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Analyzing code with Gemini Flash AI...</p>
    </div>
  `;
}

// Call Gemini API
async function callGeminiAPI(code, filename) {
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

IMPORTANT: Return ONLY a valid JSON object. Do NOT wrap it in markdown code blocks. Do NOT add any explanation. Just the raw JSON object starting with { and ending with }.`;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  };

  console.log('Sending request to:', GEMINI_API_URL);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Full Gemini response:', JSON.stringify(data, null, 2));

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error('Gemini response structure:', data);
    console.error('Candidates:', data.candidates);
    throw new Error('No response from Gemini API - check console for details');
  }

  console.log('Gemini raw response:', text);

  // Extract JSON from response - handle markdown code blocks
  let jsonText = text;

  // Remove markdown code blocks if present
  jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Try to extract JSON object
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Could not find JSON in response:', text);
    throw new Error('Could not extract JSON from Gemini response');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('JSON parse error:', e);
    console.error('Attempted to parse:', jsonMatch[0]);
    throw new Error('Failed to parse Gemini response: ' + e.message);
  }
}

// Build graph from analysis
function buildGraph(filename, code, analysis) {
  const fileNodeId = `file:${filename}`;

  // Create file-level node
  const fileNode = {
    data: {
      id: fileNodeId,
      label: analysis.title || filename,
      type: 'file',
      filename: filename,
      purpose: analysis.purpose,
      complexity: analysis.complexity,
      concepts: analysis.concepts || [],
      code: code.substring(0, 5000)
    }
  };

  graphData.nodes.push(fileNode);

  // Create chunk nodes
  if (analysis.chunks && Array.isArray(analysis.chunks)) {
    analysis.chunks.forEach(chunk => {
      const chunkId = `chunk:${filename}:${chunk.name}`;
      const chunkNode = {
        data: {
          id: chunkId,
          label: chunk.name,
          type: chunk.type || 'chunk',
          filename: filename,
          summary: chunk.summary,
          lineStart: chunk.lineStart,
          lineEnd: chunk.lineEnd
        }
      };

      graphData.nodes.push(chunkNode);

      // Link chunk to file
      graphData.edges.push({
        data: {
          source: fileNodeId,
          target: chunkId,
          label: 'contains',
          type: 'CONTAINS'
        }
      });
    });
  }

  // Create dependency edges - also create placeholder nodes for dependencies
  if (analysis.dependencies && Array.isArray(analysis.dependencies)) {
    analysis.dependencies.forEach(dep => {
      const depNodeId = `file:${dep}`;

      // Check if dependency node already exists
      const nodeExists = graphData.nodes.some(n => n.data.id === depNodeId);

      if (!nodeExists) {
        // Create placeholder node for the dependency
        graphData.nodes.push({
          data: {
            id: depNodeId,
            label: dep,
            type: 'dependency',
            filename: dep
          }
        });
      }

      graphData.edges.push({
        data: {
          source: fileNodeId,
          target: depNodeId,
          label: 'imports',
          type: 'IMPORTS'
        }
      });
    });
  }

  // Create call edges - create placeholder nodes for called functions
  if (analysis.calls && Array.isArray(analysis.calls)) {
    // Limit to prevent too many nodes
    const limitedCalls = analysis.calls.slice(0, 10);

    limitedCalls.forEach(call => {
      const callNodeId = `function:${call}`;

      // Check if function node already exists
      const nodeExists = graphData.nodes.some(n => n.data.id === callNodeId);

      if (!nodeExists) {
        // Create placeholder node for the function
        graphData.nodes.push({
          data: {
            id: callNodeId,
            label: call,
            type: 'function'
          }
        });
      }

      graphData.edges.push({
        data: {
          source: fileNodeId,
          target: callNodeId,
          label: 'calls',
          type: 'CALLS'
        }
      });
    });
  }
}

// Render graph with Cytoscape
function renderGraph() {
  const container = document.getElementById('cy');

  if (cy) {
    cy.destroy();
  }

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
          'background-color': function(ele) {
            const type = ele.data('type');
            if (type === 'file') return '#0052CC';
            if (type === 'function') return '#36B37E';
            if (type === 'class') return '#FF5630';
            if (type === 'dependency') return '#97A0AF';
            return '#6554C0';
          },
          'label': 'data(label)',
          'width': 50,
          'height': 50,
          'font-size': 14,
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#172B4D',
          'text-outline-color': '#fff',
          'text-outline-width': 3
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#97A0AF',
          'target-arrow-color': '#97A0AF',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 11,
          'color': '#5E6C84',
          'text-rotation': 'autorotate',
          'text-background-color': '#fff',
          'text-background-opacity': 0.9,
          'text-background-padding': 3
        }
      },
      {
        selector: ':selected',
        style: {
          'background-color': '#FFAB00',
          'line-color': '#FFAB00',
          'target-arrow-color': '#FFAB00',
          'border-width': 4,
          'border-color': '#FFAB00'
        }
      }
    ],
    layout: {
      name: 'cose',
      animate: true,
      animationDuration: 1000,
      idealEdgeLength: 100,
      nodeRepulsion: 400000,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    }
  });

  // Handle node clicks
  cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    const data = node.data();

    let html = `
      <div class="node-details">
        <h3>${data.label}</h3>
        <p><strong>Type:</strong> ${data.type}</p>
    `;

    if (data.filename) {
      html += `<p><strong>File:</strong> ${data.filename}</p>`;
    }
    if (data.purpose) {
      html += `<p><strong>Purpose:</strong> ${data.purpose}</p>`;
    }
    if (data.summary) {
      html += `<p><strong>Summary:</strong> ${data.summary}</p>`;
    }
    if (data.complexity) {
      const color = data.complexity === 'high' ? '#DE350B' :
                    data.complexity === 'medium' ? '#FF8B00' : '#006644';
      html += `<p><strong>Complexity:</strong> <span style="color: ${color}; font-weight: bold;">${data.complexity}</span></p>`;
    }
    if (data.concepts && data.concepts.length > 0) {
      html += `<p><strong>Concepts:</strong> ${data.concepts.join(', ')}</p>`;
    }
    if (data.lineStart && data.lineEnd) {
      html += `<p><strong>Lines:</strong> ${data.lineStart}-${data.lineEnd}</p>`;
    }

    html += '</div>';

    nodeDetailsDiv.innerHTML = html;
  });

  // Update stats
  const fileCount = graphData.nodes.filter(n => n.data.type === 'file').length;
  document.getElementById('nodeCount').textContent = graphData.nodes.length;
  document.getElementById('edgeCount').textContent = graphData.edges.length;
  document.getElementById('fileCount').textContent = fileCount;

  statsDiv.style.display = 'grid';
  graphCard.style.display = 'block';
}

// Main analyze function
async function analyzeCode() {
  const filename = filenameInput.value.trim();
  const code = codeTextarea.value.trim();

  if (!filename || !code) {
    showMessage('Please provide both filename and code!', 'error');
    return;
  }

  analyzeBtn.disabled = true;
  showLoading();

  try {
    console.log('Calling Gemini API...');
    const analysis = await callGeminiAPI(code, filename);
    console.log('Analysis result:', analysis);

    console.log('Building graph...');
    buildGraph(filename, code, analysis);
    console.log('Graph data:', graphData);

    console.log('Rendering graph...');
    renderGraph();

    showMessage('✅ Code analyzed successfully! Click nodes to see details.', 'success');
  } catch (error) {
    console.error('Error:', error);
    showMessage(`❌ Error: ${error.message}`, 'error');
  } finally {
    analyzeBtn.disabled = false;
  }
}
