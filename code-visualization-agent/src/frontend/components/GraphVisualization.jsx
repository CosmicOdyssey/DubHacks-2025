import React, { useRef, useEffect, useState } from 'react';

const GraphVisualization = ({ graphData, onNodeClick }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    if (!graphData || !graphData.nodes || !graphData.edges) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);

    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.edges)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const linkLabels = svg.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(graphData.edges)
      .enter().append("text")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text(d => d.label);

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("r", d => Math.max(8, d.size || 10))
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        setSelectedNode(d);
        if (onNodeClick) onNodeClick(d);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const nodeLabels = svg.append("g")
      .attr("class", "node-labels")
      .selectAll("text")
      .data(graphData.nodes)
      .enter().append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      nodeLabels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    setSimulation(simulation);

    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeClick]);

  const getNodeColor = (type) => {
    const colors = {
      'function': '#4CAF50',
      'class': '#2196F3',
      'variable_function': '#FF9800',
      'dependency': '#9C27B0',
      'external': '#607D8B',
      'error': '#F44336'
    };
    return colors[type] || '#795548';
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <svg ref={svgRef} style={{ border: '1px solid #ddd', borderRadius: '4px' }}></svg>
      </div>
      
      {selectedNode && (
        <div style={{ 
          width: '300px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {selectedNode.label}
          </h3>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <p><strong>File:</strong> {selectedNode.file}</p>
            <p><strong>Complexity:</strong> {selectedNode.complexity}/5</p>
            {selectedNode.size && (
              <p><strong>Size Score:</strong> {selectedNode.size}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;