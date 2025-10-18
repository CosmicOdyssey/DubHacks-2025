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
    }
    return g
  }, [graph, filters])

  return (
    <div className="app-root">
      <header className="app-header">
        <h2 style={{ margin: 0, marginRight: 12 }}>Dynamic Equity Engine — Graph</h2>
        <div className="row">
          <label>Epoch</label>
          <input type="range" min={0} max={12} value={epoch} onChange={(e) => setEpoch(Number(e.target.value))} />
          <span>{epoch}</span>
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

