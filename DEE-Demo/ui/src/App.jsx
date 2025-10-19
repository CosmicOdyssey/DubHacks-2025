import React, { useEffect, useMemo, useState } from 'react'
import GraphView from './GraphViewSVG'
import SidePanel from './SidePanel'
import { fetchGraph } from './api'
import './styles.css'

export default function App() {
  const [epoch, setEpoch] = useState(0)
  const [graph, setGraph] = useState({ nodes: [], edges: [], meta: {} })
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState({ type: 'all', relation: 'all', milestoneOnly: false })
  const [params, setParams] = useState({ alpha: 0.6, beta: 0.6, tauWeeks: 7 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchGraph(epoch)
      .then((g) => setGraph(g || { nodes: [], edges: [], meta: {} }))
      .finally(() => setLoading(false))
  }, [epoch])

<<<<<<< Updated upstream
  const filteredGraph = useMemo(() => {
    let g = graph
    if (filters.type !== 'all') {
      g = { ...g, nodes: g.nodes.filter((n) => (n.type || n.data?.type) === filters.type) }
    }
    if (filters.relation !== 'all') {
      g = { ...g, edges: g.edges.filter((e) => e.relation === filters.relation) }
    }
    if (filters.milestoneOnly) {
      g = { ...g, nodes: g.nodes.filter((n) => (n.labels || []).includes('milestone') || n.type === 'event') }
=======
  async function loadGraph() {
    setLoading(true);
    setError(null);
    try {
  const res = await invoke('codegraph-demo-resolver', {
        path: '/graph',
        payload: { projectId: 'default' }
      });
      if (res && res.ok) {
        setGraph(res.graph);
      } else {
        console.warn('Graph load returned:', res);
      }
    } catch (e) {
      console.error('Failed to load graph:', e);
      setError('Failed to load graph: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function ping() {
    setError(null);
    try {
  const res = await invoke('codegraph-demo-resolver', { path: '/ping' });
      setResult(res);
    } catch (e) {
      setError(String(e));
    }
  }

  async function clearGraph() {
    if (!window.confirm('Are you sure you want to clear the entire graph?')) return;

    setError(null);
    try {
  await invoke('codegraph-demo-resolver', {
        path: '/clear',
        payload: { projectId: 'default' }
      });
      await loadGraph();
    } catch (e) {
      setError(String(e));
>>>>>>> Stashed changes
    }
    return g
  }, [graph, filters])

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0052CC 0%, #2684FF 100%)',
        color: 'white',
        padding: '20px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
  <h1 style={{ margin: 0, fontSize: 24 }}>CodeGraph Demo (Dev)</h1>
        <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: 14 }}>
          AI-Powered Codebase Knowledge Graph for Team Collaboration
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        background: '#F4F5F7',
        borderBottom: '1px solid #DFE1E6'
      }}>
        <button
          onClick={() => setActiveTab('graph')}
          style={tabStyle(activeTab === 'graph')}
        >
          Knowledge Graph
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          style={tabStyle(activeTab === 'upload')}
        >
          Upload Code
        </button>
        <button
          onClick={() => setActiveTab('status')}
          style={tabStyle(activeTab === 'status')}
        >
          Status
        </button>

        {/* Actions on the right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
          <button
            onClick={loadGraph}
            disabled={loading}
            style={{
              padding: '6px 12px',
              background: '#fff',
              border: '1px solid #DFE1E6',
              borderRadius: 3,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={clearGraph}
            style={{
              padding: '6px 12px',
              background: '#fff',
              border: '1px solid #DE350B',
              borderRadius: 3,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              color: '#DE350B'
            }}
          >
            Clear Graph
          </button>
        </div>
        <div className="spacer">
          <Filter label="Type" value={filters.type} onChange={(v) => setFilters((f) => ({ ...f, type: v }))} options={[[
            'all', 'All'], ['person', 'People'], ['artifact', 'Artifacts'], ['event', 'Events']
          ]} />
          <Filter label="Relation" value={filters.relation} onChange={(v) => setFilters((f) => ({ ...f, relation: v }))} options={[[
            'all', 'All'], ['depends_on', 'Depends on'], ['reviews', 'Reviews'], ['authored', 'Authored'], ['milestone_of', 'Milestone of']
          ]} />
          <label className="filter">
            <input type="checkbox" checked={filters.milestoneOnly} onChange={(e) => setFilters((f) => ({ ...f, milestoneOnly: e.target.checked }))} />
            Milestone only
          </label>
        </div>
      </header>

      <div className="main">
        <main className="main-content">
          <div className="row">
            <ParamKnob label="α (alpha)" value={params.alpha} min={0} max={1} step={0.05} onChange={(v) => setParams((p) => ({ ...p, alpha: v }))} />
            <ParamKnob label="β (beta)" value={params.beta} min={0} max={1} step={0.05} onChange={(v) => setParams((p) => ({ ...p, beta: v }))} />
            <ParamKnob label="τ (weeks)" value={params.tauWeeks} min={1} max={12} step={1} onChange={(v) => setParams((p) => ({ ...p, tauWeeks: v }))} />
            {loading && <span className="muted">Loading epoch…</span>}
          </div>
          <GraphView graph={filteredGraph} onSelectNode={setSelected} params={params} />
        </main>
        <SidePanel node={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="filter">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  )
}

function ParamKnob({ label, value, min, max, step, onChange }) {
  return (
    <label className="knob">
      {label}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span style={{ width: 40, textAlign: 'right' }}>{typeof value === 'number' ? value.toFixed(2) : value}</span>
    </label>
  )
}

