import React, { useEffect, useState } from 'react'
import { invoke } from '@forge/bridge'

export default function IssuePanel({ issueKey, projectKey }) {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!issueKey) return
    setLoading(true)
    invoke('main-resolver', { path: `/node/i:${issueKey}/feed`, issueKey })
      .then((r) => setFeed(r?.items || []))
      .finally(() => setLoading(false))
  }, [issueKey])

  return (
    <div>
      <h4>DEE Impact — {issueKey}</h4>
      {loading ? <p>Loading…</p> : (
        <ul>
          {feed.length === 0 && <li className="muted">No activity</li>}
          {feed.slice(0,5).map((it, i) => (
            <li key={i}>
              <strong>{it.title || it.type}</strong>
              <div className="muted" style={{ fontSize: 12 }}>{it.time || it.timestamp}</div>
            </li>
          ))}
        </ul>
      )}
      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>Open full DEE dashboard</a>
      </p>
    </div>
  )
}
