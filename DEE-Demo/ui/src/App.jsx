import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import CodeUpload from './components/CodeUpload';
import GraphView from './components/GraphView';

export default function App() {
  const [activeTab, setActiveTab] = useState('graph');
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load existing graph on mount
  useEffect(() => {
    loadGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadGraph() {
    setLoading(true);
    setError(null);
    try {
      const res = await invoke('main-resolver', {
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
      const res = await invoke('main-resolver', { path: '/ping' });
      setResult(res);
    } catch (e) {
      setError(String(e));
    }
  }

  async function clearGraph() {
    if (!window.confirm('Are you sure you want to clear the entire graph?')) return;

    setError(null);
    try {
      await invoke('main-resolver', {
        path: '/clear',
        payload: { projectId: 'default' }
      });
      await loadGraph();
    } catch (e) {
      setError(String(e));
    }
  }

  function handleAnalyzed(analysisResult) {
    setGraph(analysisResult.graph);
    setActiveTab('graph'); // Switch to graph view
  }

  function handleNodeClick(node) {
    console.log('Node clicked:', node);
  }

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    background: isActive ? '#fff' : '#F4F5F7',
    border: 'none',
    borderBottom: isActive ? '3px solid #0052CC' : '3px solid transparent',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    color: isActive ? '#0052CC' : '#5E6C84',
    transition: 'all 0.2s'
  });

  // Show error if initial load failed
  if (error && !graph) {
    return (
      <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h2>Error Loading App</h2>
        <pre style={{ background: '#ffecec', padding: 12, borderRadius: 4, color: '#900' }}>
          {error}
        </pre>
        <button onClick={loadGraph} style={{ marginTop: 16, padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    );
  }

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
        <h1 style={{ margin: 0, fontSize: 24 }}>CodeGraph UW</h1>
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
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'graph' && (
          <div style={{ height: '100%' }}>
            {graph && graph.nodes && graph.nodes.length > 0 ? (
              <GraphView graph={graph} onNodeClick={handleNodeClick} />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#5E6C84'
              }}>
                <h3>No graph data yet</h3>
                <p>Upload and analyze code files to build your knowledge graph</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  style={{
                    marginTop: 16,
                    padding: '10px 20px',
                    background: '#0052CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Upload Code
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <CodeUpload onAnalyzed={handleAnalyzed} />
        )}

        {activeTab === 'status' && (
          <div style={{ padding: 24 }}>
            <h3>System Status</h3>
            <p>Test the connection to the backend resolver.</p>
            <button
              onClick={ping}
              style={{
                padding: '10px 20px',
                background: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Ping Resolver
            </button>

            {result && (
              <pre style={{
                marginTop: 16,
                background: '#E3FCEF',
                border: '1px solid #36B37E',
                padding: 12,
                borderRadius: 4,
                fontSize: 12,
                overflow: 'auto'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}

            {error && (
              <pre style={{
                marginTop: 16,
                background: '#FFEBE6',
                border: '1px solid #DE350B',
                padding: 12,
                borderRadius: 4,
                color: '#DE350B',
                fontSize: 12,
                overflow: 'auto'
              }}>
                {error}
              </pre>
            )}

            {graph && (
              <div style={{ marginTop: 24 }}>
                <h4>Current Graph Stats</h4>
                <ul style={{ color: '#5E6C84' }}>
                  <li>Nodes: {graph.nodes?.length || 0}</li>
                  <li>Edges: {graph.edges?.length || 0}</li>
                  <li>Files analyzed: {graph.nodes?.filter(n => n.type === 'file').length || 0}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
