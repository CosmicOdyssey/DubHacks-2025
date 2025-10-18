import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

// Register layout
cytoscape.use(coseBilkent);

export default function GraphView({ graph, onNodeClick }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !graph || !graph.nodes) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: graph.nodes.map(node => ({
          data: {
            id: node.id,
            label: node.label,
            type: node.type,
            ...node.data
          }
        })),
        edges: graph.edges.map(edge => ({
          data: {
            source: edge.source,
            target: edge.target,
            label: edge.label || edge.type,
            type: edge.type
          }
        }))
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele) => {
              const type = ele.data('type');
              if (type === 'file') return '#0052CC';
              if (type === 'function') return '#36B37E';
              if (type === 'class') return '#FF5630';
              return '#6554C0';
            },
            'label': 'data(label)',
            'width': 40,
            'height': 40,
            'font-size': 12,
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#172B4D',
            'text-outline-color': '#fff',
            'text-outline-width': 2
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#97A0AF',
            'target-arrow-color': '#97A0AF',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': 10,
            'color': '#5E6C84',
            'text-rotation': 'autorotate',
            'text-background-color': '#fff',
            'text-background-opacity': 0.8,
            'text-background-padding': 2
          }
        },
        {
          selector: ':selected',
          style: {
            'background-color': '#FFAB00',
            'line-color': '#FFAB00',
            'target-arrow-color': '#FFAB00',
            'border-width': 3,
            'border-color': '#FFAB00'
          }
        }
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 500,
        idealEdgeLength: 100,
        nodeRepulsion: 4500,
        gravity: 0.25,
        gravityRange: 3.8
      }
    });

    // Handle node clicks
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = {
        id: node.id(),
        label: node.data('label'),
        type: node.data('type'),
        data: {
          filename: node.data('filename'),
          purpose: node.data('purpose'),
          summary: node.data('summary'),
          complexity: node.data('complexity'),
          concepts: node.data('concepts'),
          code: node.data('code')
        }
      };
      setSelectedNode(nodeData);
      onNodeClick?.(nodeData);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graph, onNodeClick]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16, background: '#F4F5F7', borderBottom: '2px solid #DFE1E6' }}>
        <h3 style={{ margin: 0 }}>Codebase Knowledge Graph</h3>
        {graph && (
          <p style={{ margin: '8px 0 0', color: '#5E6C84', fontSize: 14 }}>
            {graph.nodes?.length || 0} nodes, {graph.edges?.length || 0} edges
          </p>
        )}
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: '#fff',
          border: '1px solid #DFE1E6'
        }}
      />

      {selectedNode && (
        <div style={{
          padding: 16,
          background: '#FFFAE6',
          borderTop: '2px solid #FFC400',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 8px' }}>{selectedNode.label}</h4>
          <p style={{ margin: 0, fontSize: 12, color: '#5E6C84' }}>
            <strong>Type:</strong> {selectedNode.type}
          </p>
          {selectedNode.data.filename && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#5E6C84' }}>
              <strong>File:</strong> {selectedNode.data.filename}
            </p>
          )}
          {selectedNode.data.purpose && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#172B4D' }}>
              <strong>Purpose:</strong> {selectedNode.data.purpose}
            </p>
          )}
          {selectedNode.data.summary && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#172B4D' }}>
              <strong>Summary:</strong> {selectedNode.data.summary}
            </p>
          )}
          {selectedNode.data.complexity && (
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>
              <strong>Complexity:</strong>{' '}
              <span style={{
                padding: '2px 6px',
                borderRadius: 3,
                background: selectedNode.data.complexity === 'high' ? '#FFEBE6' :
                           selectedNode.data.complexity === 'medium' ? '#FFFAE6' : '#E3FCEF',
                color: selectedNode.data.complexity === 'high' ? '#DE350B' :
                       selectedNode.data.complexity === 'medium' ? '#FF8B00' : '#006644',
                fontSize: 11,
                fontWeight: 500
              }}>
                {selectedNode.data.complexity}
              </span>
            </p>
          )}
          {selectedNode.data.concepts && selectedNode.data.concepts.length > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>
              <strong>Concepts:</strong> {selectedNode.data.concepts.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
