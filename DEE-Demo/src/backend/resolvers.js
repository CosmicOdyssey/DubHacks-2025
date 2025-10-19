import api, { requestJira, storage } from '@forge/api'
import graph1 from './mock-data/graph-epoch1.json' assert { type: 'json' }
import graph2 from './mock-data/graph-epoch2.json' assert { type: 'json' }
import graph3 from './mock-data/graph-epoch3.json' assert { type: 'json' }
import feedMock from './mock-data/feed.json' assert { type: 'json' }
import equityMock from './mock-data/equity.json' assert { type: 'json' }

export const handler = async (req) => {
  const { path = '/ping', epoch = 0, jql, projectKey, issueKey } = req
  const now = new Date().toISOString()
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
    const { graphData } = req;
    await storage.set('graphData', graphData);
    return { body: { ok: true, message: 'Graph data saved' } };
  }
  
  // Get graph data for Rovo agent
  if (path === '/getGraph') {
    const graphData = await storage.get('graphData') || { nodes: [], edges: [] };
    return { body: graphData };
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
