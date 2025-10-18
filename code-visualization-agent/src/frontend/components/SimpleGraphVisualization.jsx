import React, { useState, useMemo } from 'react';

const SimpleGraphVisualization = ({ graphData, onNodeClick }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    if (!graphData || !graphData.nodes) return { nodes: [], edges: [] };
    
    let nodes = graphData.nodes;
    if (filter !== 'all') {
      nodes = nodes.filter(node => node.type === filter);
    }
    
    const nodeIds = new Set(nodes.map(n => n.id));
    const edges = graphData.edges.filter(edge => 
      nodeIds.has(edge.from) && nodeIds.has(edge.to)
    );
    
    return { nodes, edges };
  }, [graphData, filter]);

  const nodeTypes = useMemo(() => {
    if (!graphData || !graphData.nodes) return [];
    const types = [...new Set(graphData.nodes.map(node => node.type))];
    return types;
  }, [graphData]);

  const getNodeColor = (type, complexity) => {
    const baseColors = {
      'function': '#4CAF50',
      'class': '#2196F3', 
      'variable_function': '#FF9800',
      'dependency': '#9C27B0',
      'external': '#607D8B',
      'error': '#F44336'
    };
    
    const baseColor = baseColors[type] || '#795548';
    const opacity = Math.max(0.3, (complexity || 1) / 5);
    
    return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        <p style={{ color: '#666' }}>No graph data available. Analyze some code first.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Filter by type:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            padding: '5px 10px', 
            border: '1px solid #ddd', 
            borderRadius: '3px' 
          }}
        >
          <option value="all">All Types</option>
          {nodeTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span style={{ fontSize: '12px', color: '#666' }}>
          Showing {filteredData.nodes.length} nodes, {filteredData.edges.length} connections
        </span>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ 
          flex: 1, 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          padding: '20px',
          backgroundColor: '#fff',
          minHeight: '500px',
          position: 'relative',
          overflow: 'auto'
        }}>
          <svg 
            width="100%" 
            height="480"
            style={{ border: '1px solid #eee' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#999"
                />
              </marker>
            </defs>
            
            {filteredData.edges.map((edge, index) => {
              const sourceNode = filteredData.nodes.find(n => n.id === edge.from);
              const targetNode = filteredData.nodes.find(n => n.id === edge.to);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourceIndex = filteredData.nodes.indexOf(sourceNode);
              const targetIndex = filteredData.nodes.indexOf(targetNode);
              
              const x1 = 50 + (sourceIndex % 8) * 90;
              const y1 = 50 + Math.floor(sourceIndex / 8) * 80;
              const x2 = 50 + (targetIndex % 8) * 90;
              const y2 = 50 + Math.floor(targetIndex / 8) * 80;
              
              return (
                <g key={index}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#999"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 5}
                    fontSize="10"
                    fill="#666"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
            
            {filteredData.nodes.map((node, index) => {
              const x = 50 + (index % 8) * 90;
              const y = 50 + Math.floor(index / 8) * 80;
              const radius = Math.max(8, (node.complexity || 1) * 4);
              
              return (
                <g key={node.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={getNodeColor(node.type, node.complexity)}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(node)}
                  />
                  <text
                    x={x}
                    y={y + radius + 15}
                    fontSize="11"
                    fill="#333"
                    textAnchor="middle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(node)}
                  >
                    {node.label.length > 12 ? 
                      node.label.substring(0, 12) + '...' : 
                      node.label
                    }
                  </text>
                </g>
              );
            })}
          </svg>
          
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {nodeTypes.map(type => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: getNodeColor(type, 3),
                      borderRadius: '50%' 
                    }}
                  />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {selectedNode && (
          <div style={{ 
            width: '300px', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
              {selectedNode.label}
            </h3>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Type:</strong> {selectedNode.type}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>File:</strong> {selectedNode.file}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Complexity:</strong> {selectedNode.complexity}/5
              </div>
              {selectedNode.group && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Group:</strong> {selectedNode.group}
                </div>
              )}
              
              {filteredData.edges.filter(e => e.from === selectedNode.id).length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Dependencies:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {filteredData.edges
                      .filter(e => e.from === selectedNode.id)
                      .map((edge, i) => {
                        const target = filteredData.nodes.find(n => n.id === edge.to);
                        return (
                          <li key={i} style={{ fontSize: '12px' }}>
                            {target?.label || edge.to} ({edge.label})
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              )}
              
              {filteredData.edges.filter(e => e.to === selectedNode.id).length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Used by:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {filteredData.edges
                      .filter(e => e.to === selectedNode.id)
                      .map((edge, i) => {
                        const source = filteredData.nodes.find(n => n.id === edge.from);
                        return (
                          <li key={i} style={{ fontSize: '12px' }}>
                            {source?.label || edge.from} ({edge.label})
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleGraphVisualization;