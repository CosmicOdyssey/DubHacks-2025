import React, { useState } from 'react';
import { invoke } from '@forge/bridge';

export default function CodeUpload({ onAnalyzed }) {
  const [filename, setFilename] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!filename || !code) {
      setError('Please provide both filename and code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await invoke('main-resolver', {
        path: '/analyze',
        payload: { code, filename, projectId: 'default' }
      });

      if (result.ok) {
        onAnalyzed?.(result);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCode(evt.target.result);
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Upload Code for Analysis</h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Upload File:
        </label>
        <input
          type="file"
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs"
          onChange={handleFileUpload}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Filename:
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., App.jsx"
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Code:
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          rows={15}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ccc',
            borderRadius: 4,
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: 12
          }}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !filename || !code}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#0052CC',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 500
        }}
      >
        {loading ? 'Analyzing with Gemini...' : 'Analyze Code'}
      </button>

      {error && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#FFEBE6',
          border: '1px solid #DE350B',
          borderRadius: 4,
          color: '#DE350B'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
