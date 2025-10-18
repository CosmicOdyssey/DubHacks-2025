import React, { useEffect, useState } from 'react'
import { fetchNodeFeed } from './api'

export default function SidePanel({ node, onClose }) {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!node?.id) return
    setLoading(true)
    fetchNodeFeed(node.id)
      .then((r) => setFeed(r?.items || []))
      .finally(() => setLoading(false))
  }, [node?.id])

  if (!node) return null
  const impact = node.impact || node.data?.impact

  return (
    <aside className="panel">
      <div className="panel-header">
        <h3 style={{ margin: 0 }}>{(node.labels && node.labels[0]) || node.id}</h3>
        <button onClick={onClose} aria-label="Close details">✕</button>
      </div>
      <p className="muted">Type: {node.type || node.data?.type}</p>
      <div className="card">
        <strong>I(e) breakdown</strong>
        <pre style={{ margin: 0 }}>{JSON.stringify(impact, null, 2)}</pre>
      </div>
      <div className="metric-row">
        <Metric label="MB" value={node.MB ?? node.data?.MB ?? 0} />
        <Metric label="MF" value={node.MF ?? node.data?.MF ?? 0} />
      </div>
      <h4 style={{ marginTop: 16 }}>Recent activity</h4>
      {loading ? <p>Loading…</p> : (
        <ul>
          {feed.length === 0 && <li className="muted">No activity</li>}
          {feed.map((it, i) => (
            <li key={i}>
              <div style={{ fontWeight: 600 }}>{it.title || it.type}</div>
              <div className="muted" style={{ fontSize: 12 }}>{it.time || it.timestamp}</div>
              {it.impact && <pre style={{ background: '#fafafa' }}>{JSON.stringify(it.impact, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <div className="label">{label}</div>
      <div className="value">{Number(value).toFixed(2)}</div>
    </div>
  )
}
