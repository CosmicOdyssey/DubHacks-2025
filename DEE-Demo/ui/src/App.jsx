import React, { useState } from 'react'
import { invoke } from '@forge/bridge'

export default function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function ping() {
    setError(null)
    try {
      const res = await invoke('main-resolver', { path: '/ping' })
      setResult(res)
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 24 }}>
      <h1>DEE Demo</h1>
      <p>Vite + React custom UI served as static assets.</p>
      <button onClick={ping}>Ping Resolver</button>
      {result && (
        <pre style={{ marginTop: 16, background: '#f5f5f5', padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {error && (
        <pre style={{ marginTop: 16, background: '#ffecec', padding: 12, color: '#900' }}>
          {error}
        </pre>
      )}
    </div>
  )
}
