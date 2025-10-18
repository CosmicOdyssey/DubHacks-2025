import React, { useState, useMemo } from 'react';
import { invoke } from '@forge/bridge';

const TaskDelegationDashboard = ({ analysis, onIssueCreated }) => {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [projectKey, setProjectKey] = useState('CV');
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('complexity');

  const filteredAndSortedBlocks = useMemo(() => {
    if (!analysis || !analysis.codeBlocks) return [];
    
    let blocks = analysis.codeBlocks.filter(block => {
      if (filter === 'all') return true;
      if (filter === 'analyzed') return block.analysis && !block.analysis.fallback;
      if (filter === 'high-complexity') return (block.analysis?.complexity || block.complexity || 1) >= 4;
      if (filter === 'has-tasks') return block.analysis?.tasks?.length > 0;
      return true;
    });

    blocks.sort((a, b) => {
      const aComplexity = a.analysis?.complexity || a.complexity || 1;
      const bComplexity = b.analysis?.complexity || b.complexity || 1;
      
      switch (sortBy) {
        case 'complexity':
          return bComplexity - aComplexity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'tasks':
          const aTasks = a.analysis?.tasks?.length || 0;
          const bTasks = b.analysis?.tasks?.length || 0;
          return bTasks - aTasks;
        default:
          return 0;
      }
    });

    return blocks;
  }, [analysis, filter, sortBy]);

  const handleBlockSelect = (blockId) => {
    const newSelected = new Set(selectedBlocks);
    if (newSelected.has(blockId)) {
      newSelected.delete(blockId);
    } else {
      newSelected.add(blockId);
    }
    setSelectedBlocks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBlocks.size === filteredAndSortedBlocks.length) {
      setSelectedBlocks(new Set());
    } else {
      setSelectedBlocks(new Set(filteredAndSortedBlocks.map(b => b.id)));
    }
  };

  const handleCreateIssues = async () => {
    if (selectedBlocks.size === 0) return;
    
    setCreating(true);
    try {
      const selectedBlockData = filteredAndSortedBlocks.filter(b => selectedBlocks.has(b.id));
      
      const result = await invoke('createJiraIssues', {
        codeBlocks: selectedBlockData,
        projectKey: projectKey
      });
      
      if (result.success) {
        if (onIssueCreated) onIssueCreated(result.createdIssues);
        setSelectedBlocks(new Set());
      } else {
        console.error('Failed to create issues:', result.error);
      }
    } catch (error) {
      console.error('Error creating issues:', error);
    } finally {
      setCreating(false);
    }
  };

  const getComplexityColor = (complexity) => {
    if (complexity >= 4) return '#f44336';
    if (complexity >= 3) return '#ff9800';
    if (complexity >= 2) return '#ffeb3b';
    return '#4caf50';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'function': '🔧',
      'class': '📦',
      'variable_function': '⚡',
      'dependency': '📎',
      'error': '❌'
    };
    return icons[type] || '📄';
  };

  if (!analysis || !analysis.codeBlocks || analysis.codeBlocks.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>No Code Blocks Available</h3>
        <p>Analyze some code first to see task delegation options.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>Task Delegation Dashboard</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Select code blocks to generate Jira issues for team delegation
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value)}
            placeholder="Project Key"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              width: '100px'
            }}
          />
          <button
            onClick={handleCreateIssues}
            disabled={selectedBlocks.size === 0 || creating}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedBlocks.size > 0 ? '#0052CC' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: selectedBlocks.size > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            {creating ? 'Creating...' : `Create ${selectedBlocks.size} Issues`}
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '8px' }}>
            Filter:
          </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              padding: '5px 10px', 
              border: '1px solid #ddd', 
              borderRadius: '3px' 
            }}
          >
            <option value="all">All Blocks</option>
            <option value="analyzed">AI Analyzed</option>
            <option value="high-complexity">High Complexity (4-5)</option>
            <option value="has-tasks">Has Suggested Tasks</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '8px' }}>
            Sort by:
          </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: '5px 10px', 
              border: '1px solid #ddd', 
              borderRadius: '3px' 
            }}
          >
            <option value="complexity">Complexity</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="tasks">Task Count</option>
          </select>
        </div>

        <button
          onClick={handleSelectAll}
          style={{
            padding: '5px 10px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          {selectedBlocks.size === filteredAndSortedBlocks.length ? 'Deselect All' : 'Select All'}
        </button>

        <span style={{ fontSize: '12px', color: '#666' }}>
          {filteredAndSortedBlocks.length} blocks shown, {selectedBlocks.size} selected
        </span>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '4px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {filteredAndSortedBlocks.map((block) => {
          const isSelected = selectedBlocks.has(block.id);
          const complexity = block.analysis?.complexity || block.complexity || 1;
          
          return (
            <div
              key={block.id}
              style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => handleBlockSelect(block.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleBlockSelect(block.id)}
                  style={{ marginTop: '2px' }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{getTypeIcon(block.type)}</span>
                    <h4 style={{ margin: 0, color: '#333' }}>{block.name}</h4>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '12px',
                      color: '#666'
                    }}>
                      {block.type}
                    </span>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: getComplexityColor(complexity),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {complexity}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <span>{block.file}:{block.startLine}-{block.endLine}</span>
                  </div>

                  {block.analysis && (
                    <div style={{ fontSize: '14px' }}>
                      <p style={{ margin: '5px 0', color: '#555' }}>
                        <strong>Purpose:</strong> {block.analysis.purpose}
                      </p>
                      
                      {block.analysis.tasks && block.analysis.tasks.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>Suggested Tasks:</strong>
                          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                            {block.analysis.tasks.slice(0, 3).map((task, index) => (
                              <li key={index} style={{ fontSize: '13px', color: '#666' }}>
                                {task}
                              </li>
                            ))}
                            {block.analysis.tasks.length > 3 && (
                              <li style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                                +{block.analysis.tasks.length - 3} more tasks...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {block.analysis.suggestedJiraIssues && block.analysis.suggestedJiraIssues.length > 0 && (
                        <div style={{ 
                          marginTop: '10px',
                          padding: '8px',
                          backgroundColor: '#e8f5e8',
                          borderRadius: '3px',
                          fontSize: '13px'
                        }}>
                          <strong>Suggested Jira Issues:</strong> {block.analysis.suggestedJiraIssues.length}
                          {block.analysis.suggestedJiraIssues.slice(0, 1).map((issue, index) => (
                            <div key={index} style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                              • {issue.summary} ({issue.type}, {issue.storyPoints} pts)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskDelegationDashboard;