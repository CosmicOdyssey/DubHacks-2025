import api, { requestJira, storage } from '@forge/api'
import graph1 from './mock-data/graph-epoch1.json' with { type: 'json' }
import graph2 from './mock-data/graph-epoch2.json' with { type: 'json' }
import graph3 from './mock-data/graph-epoch3.json' with { type: 'json' }
import feedMock from './mock-data/feed.json' with { type: 'json' }
import equityMock from './mock-data/equity.json' with { type: 'json' }

export const handler = async (req) => {
  // Parse the request - data can come from req directly or req.body
  let path, action, nodeData, graphData, epoch, jql, projectKey, issueKey;
  
  // Try to parse from req.body if it exists (for AP.request calls)
  if (req.body) {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      path = parsed.path || req.path;
      action = parsed.action;
      nodeData = parsed.nodeData;
      graphData = parsed.graphData;
      epoch = parsed.epoch;
    } catch (e) {
      console.error('Failed to parse request body:', e);
    }
  }
  
  // Fallback to direct req properties
  path = path || req.path || '/ping';
  action = action || req.action;
  nodeData = nodeData || req.nodeData;
  graphData = graphData || req.graphData;
  epoch = epoch || req.epoch || 0;
  jql = req.jql;
  projectKey = req.projectKey;
  issueKey = req.issueKey;
  
  const now = new Date().toISOString();
  
  console.log('Resolver called with path:', path, 'action:', action, 'hasNodeData:', !!nodeData);
  
  if (path === '/ping') {
    return { body: { ok: true, time: now, message: 'DEE resolver alive' } }
  }

  if (path === '/graph') {
    const e = Number(epoch) || 0
    const mock = e <= 1 ? graph1 : e === 2 ? graph2 : graph3
    return { body: mock }
  }
  
  // Store graph data for Rovo agent access
  if (path === '/saveGraph') {
    if (!graphData) {
      console.error('No graphData provided to /saveGraph');
      return { body: { ok: false, error: 'No graphData provided' }, statusCode: 400 };
    }
    await storage.set('graphData', graphData);
    console.log('Graph data saved successfully');
    return { body: { ok: true, message: 'Graph data saved' } };
  }
  
  // New Forge Bridge endpoint for saving graph data
  if (path === '/graph/save') {
    if (!graphData) {
      console.error('No graphData provided to /graph/save');
      return { body: { ok: false, error: 'No graphData provided' }, statusCode: 400 };
    }
    
    const graph = {
      nodes: graphData.nodes || [],
      edges: graphData.edges || [],
      savedAt: Date.now()
    };
    
    await storage.set('graphData', graph);
    console.log('Graph data saved successfully via Forge Bridge:', {
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length
    });
    
    return { 
      body: { 
        ok: true, 
        nodes: graph.nodes.length,
        edges: graph.edges.length,
        savedAt: graph.savedAt
      } 
    };
  }
  
  // Get graph data for Rovo agent
  if (path === '/getGraph') {
    const graphData = await storage.get('graphData') || { nodes: [], edges: [] };
    return { body: graphData };
  }
  
  // Rovo action endpoint - manually invoke Rovo actions from UI
  if (path === '/rovo-agent') {
    console.log('Rovo agent endpoint called with action:', action, 'nodeData:', nodeData);
    
    if (!action || !nodeData) {
      console.error('Missing action or nodeData:', { action, nodeData });
      return { body: { error: 'Missing action or nodeData' }, statusCode: 400 };
    }
    
    // Import the Rovo action handlers
    const { analyzeNode, createTasks, suggestImprovements } = await import('./rovo-agent.js');
    
    // Prepare the payload for the action
    const payload = {
      nodeId: nodeData.id
    };
    
    // Mock context (in a real Forge app, this would be provided by Forge)
    const context = {
      accountId: 'mock-user-id'
    };
    
    let result;
    try {
      if (action === 'analyze-node') {
        result = await analyzeNode(payload, context);
      } else if (action === 'create-tasks') {
        result = await createTasks(payload, context);
      } else if (action === 'suggest-improvements') {
        result = await suggestImprovements(payload, context);
      } else {
        console.error('Unknown action:', action);
        return { body: { error: `Unknown action: ${action}` }, statusCode: 400 };
      }
      
      console.log('Rovo action result:', result);
      return { body: result };
    } catch (error) {
      console.error('Error invoking Rovo action:', error);
      return { body: { error: error.message, stack: error.stack }, statusCode: 500 };
    }
  }

  const feedMatch = path.match(/^\/node\/(.+)\/feed$/)
  if (feedMatch) {
    const id = decodeURIComponent(feedMatch[1])
    // Always return mock feed for MVP
    return { body: { items: feedMock } }
  }

  if (path === '/equity') {
    return { body: equityMock }
  }

  return { body: { ok: false, time: now, error: `Unknown path: ${path}` } }
}

function normalizeGraph(deeGraph, jiraData) {
  // Minimal passthrough; ensure nodes/edges arrays exist and basic shape aligns
  const nodes = Array.isArray(deeGraph?.nodes) ? deeGraph.nodes : []
  const edges = Array.isArray(deeGraph?.edges) ? deeGraph.edges : []
  return { nodes, edges, meta: deeGraph?.meta || { notes: 'normalized' } }
}

function buildMockGraph(epoch) {
  const epochFactor = 1 + epoch * 0.1
  const nodes = [
    { id: 'u:alice', type: 'person', labels: ['Alice'], impact: { I: 3 * epochFactor, B:1,Q:1,C:1,R:1,V:1 }, createdAt: new Date(Date.now()-14*24*3600*1000).toISOString() },
    { id: 'u:bob', type: 'person', labels: ['Bob'], impact: { I: 2 * epochFactor, B:1,Q:0.8,C:1,R:1,V:1 }, createdAt: new Date(Date.now()-30*24*3600*1000).toISOString() },
    { id: 'a:svc', type: 'artifact', labels: ['Service A'], impact: { I: 2.5 * epochFactor, B:1,Q:1,C:0.9,R:1,V:1 }, createdAt: new Date(Date.now()-5*24*3600*1000).toISOString() },
    { id: 'e:milestone', type: 'event', labels: ['v1.2 Milestone','milestone'], impact: { I: 4 * epochFactor, B:1,Q:1.2,C:1.1,R:1,V:1 }, createdAt: new Date(Date.now()-2*24*3600*1000).toISOString() },
  ]
  const edges = [
    { source: 'u:alice', target: 'a:svc', relation: 'authored', weight: 1.2 },
    { source: 'u:bob', target: 'a:svc', relation: 'reviews', weight: 0.6 },
    { source: 'a:svc', target: 'e:milestone', relation: 'milestone_of', weight: 1.0 },
  ]
  const meta = { epoch, params: { alpha: 0.6, beta: 0.6, tau: 7 }, kpiGate: true, notes: 'Mock data' }
  return { nodes, edges, meta }
}

function buildMockFeed(id) {
  return [
    { type: 'commit', title: `Commit touching ${id}`, time: new Date().toISOString(), impact: { I: 0.6, B:1,Q:1,C:0.6,R:1,V:1 } },
    { type: 'review', title: `Review for ${id}`, time: new Date(Date.now()-2*3600*1000).toISOString(), impact: { I: 0.3, B:1,Q:0.8,C:0.5,R:1,V:1 } },
  ]
}
