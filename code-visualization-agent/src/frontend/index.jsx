import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { invoke } from '@forge/bridge';
import SimpleGraphVisualization from './components/SimpleGraphVisualization.jsx';
import TaskDelegationDashboard from './components/TaskDelegationDashboard.jsx';

const App = () => {
  const [codeInput, setCodeInput] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedCodeBlock, setSelectedCodeBlock] = useState(null);
  const [createdIssues, setCreatedIssues] = useState([]);

  const handleCodeAnalysis = async () => {
    if (!codeInput.trim()) return;
    
    setLoading(true);
    try {
      const result = await invoke('analyzeCode', {
        codeContent: codeInput,
        fileName: 'uploaded-code.js',
        fileType: 'javascript'
      });
      
      if (result.success) {
        setAnalysis(result.analysis);
        
        const vizResult = await invoke('getVisualizationData', {
          fileName: 'uploaded-code.js'
        });
        
        if (vizResult.success) {
          setGraphData(vizResult.graphData);
        }
      } else {
        console.error('Analysis failed:', result.error);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    if (analysis && analysis.codeBlocks) {
      const block = analysis.codeBlocks.find(b => b.id === node.id);
      setSelectedCodeBlock(block);
    }
  };

  const handleIssueCreated = (issues) => {
    setCreatedIssues(prev => [...prev, ...issues]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Code Visualization Agent</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'upload' ? '#0052CC' : '#f4f5f7',
              color: activeTab === 'upload' ? 'white' : '#172B4D',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Upload Code
          </button>
          <button 
            onClick={() => setActiveTab('repository')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'repository' ? '#0052CC' : '#f4f5f7',
              color: activeTab === 'repository' ? 'white' : '#172B4D',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Repository URL
          </button>
          <button 
            onClick={() => setActiveTab('visualization')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'visualization' ? '#0052CC' : '#f4f5f7',
              color: activeTab === 'visualization' ? 'white' : '#172B4D',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Visualization
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'tasks' ? '#0052CC' : '#f4f5f7',
              color: activeTab === 'tasks' ? 'white' : '#172B4D',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Task Delegation
          </button>
        </div>

        {activeTab === 'upload' && (
          <div>
            <h3>Upload Code for Analysis</h3>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste your code here..."
              style={{
                width: '100%',
                height: '200px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={handleCodeAnalysis}
              disabled={loading || !codeInput.trim()}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>
        )}

        {activeTab === 'repository' && (
          <div>
            <h3>Repository Analysis</h3>
            <input
              type="text"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                marginBottom: '10px'
              }}
            />
            <button
              onClick={() => {}}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Analyze Repository
            </button>
          </div>
        )}

        {activeTab === 'visualization' && (
          <div>
            <h3>Code Visualization</h3>
            {analysis ? (
              <div>
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  border: '1px solid #ddd', 
                  borderRadius: '3px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Analysis Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                    <div>
                      <p><strong>File:</strong> {analysis.fileName}</p>
                      <p><strong>Code Blocks:</strong> {analysis.codeBlocks?.length || 0}</p>
                      <p><strong>Dependencies:</strong> {analysis.dependencies?.length || 0}</p>
                    </div>
                    <div>
                      <p><strong>AI Analysis:</strong> {analysis.analyzedWithAI ? 'Yes' : 'No'}</p>
                      <p><strong>Imports:</strong> {analysis.imports?.length || 0}</p>
                      <p><strong>Exports:</strong> {analysis.exports?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <SimpleGraphVisualization 
                  graphData={graphData} 
                  onNodeClick={handleNodeClick}
                />

                {selectedCodeBlock && (
                  <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    border: '1px solid #ddd', 
                    borderRadius: '3px',
                    backgroundColor: '#fff'
                  }}>
                    <h4>Selected: {selectedCodeBlock.name}</h4>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      <p><strong>Type:</strong> {selectedCodeBlock.type}</p>
                      <p><strong>File:</strong> {selectedCodeBlock.file}</p>
                      <p><strong>Lines:</strong> {selectedCodeBlock.startLine}-{selectedCodeBlock.endLine}</p>
                      
                      {selectedCodeBlock.analysis && (
                        <div style={{ marginTop: '15px' }}>
                          <h5>AI Analysis:</h5>
                          <p><strong>Purpose:</strong> {selectedCodeBlock.analysis.purpose}</p>
                          <p><strong>Complexity:</strong> {selectedCodeBlock.analysis.complexity}/5</p>
                          
                          {selectedCodeBlock.analysis.tasks?.length > 0 && (
                            <div>
                              <strong>Suggested Tasks:</strong>
                              <ul>
                                {selectedCodeBlock.analysis.tasks.map((task, index) => (
                                  <li key={index}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {selectedCodeBlock.analysis.tags?.length > 0 && (
                            <p><strong>Tags:</strong> {selectedCodeBlock.analysis.tags.join(', ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No analysis data available. Please analyze some code first.</p>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <TaskDelegationDashboard 
              analysis={analysis}
              onIssueCreated={handleIssueCreated}
            />
            
            {createdIssues.length > 0 && (
              <div style={{ 
                marginTop: '20px',
                padding: '15px',
                border: '1px solid #4caf50',
                borderRadius: '4px',
                backgroundColor: '#e8f5e8'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
                  Recently Created Issues ({createdIssues.length})
                </h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {createdIssues.map((issue, index) => (
                    <div key={index} style={{ 
                      padding: '10px',
                      margin: '5px 0',
                      backgroundColor: '#fff',
                      borderRadius: '3px',
                      border: '1px solid #c8e6c9'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {issue.key}: {issue.summary}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                        {issue.type} • {issue.priority} Priority • {issue.storyPoints} Story Points
                      </div>
                      {issue.codeReference && (
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                          Code: {issue.codeReference.file} → {issue.codeReference.name} ({issue.codeReference.type})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
