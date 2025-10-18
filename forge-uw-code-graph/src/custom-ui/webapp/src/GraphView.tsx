import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core } from 'cytoscape';
import type { GraphEdge, GraphNode } from './api';

type Filters = {
  language: string;
  tag: string;
  maxRisk?: number;
};

type GraphViewProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchTerm: string;
  filters: Filters;
  heatmap: boolean;
  onSelectionChange(ids: string[]): void;
  onReady(cy: Core): void;
};

const layoutOptions = {
  name: 'cose',
  animate: false,
  fit: true,
  nodeRepulsion: 80000,
  gravity: 80,
  idealEdgeLength: 160,
};

const baseNodeColor = '#38bdf8';
const heatmapColor = (value: number) => {
  if (value >= 8) return '#f97316';
  if (value >= 5) return '#facc15';
  return '#22c55e';
};

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  searchTerm,
  filters,
  heatmap,
  onSelectionChange,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const nodeMapRef = useRef<Map<string, GraphNode>>(new Map());

  useEffect(() => {
    nodeMapRef.current = new Map(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current || cyRef.current) {
      return;
    }
    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: true,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': baseNodeColor,
            color: '#f8fafc',
            'font-size': 12,
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'mapData(weight, 0, 10, 24, 64)',
            height: 'mapData(weight, 0, 10, 24, 64)',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#6366f1',
            'background-color': '#22d3ee',
            'font-weight': 'bold',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#64748b',
            'target-arrow-color': '#64748b',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
    });
    cyRef.current = cy;
    cy.on('select unselect', 'node', () => {
      if (!cyRef.current) return;
      const selectedIds = cyRef.current.nodes(':selected').map((node) => node.id());
      onSelectionChange(selectedIds);
      const first = selectedIds[0];
      setFocusedNode(first ? nodeMapRef.current.get(first) ?? null : null);
    });
    onReady(cy);
  }, [onReady, onSelectionChange]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    const degreeMap = new Map<string, number>();
    edges.forEach((edge) => {
      degreeMap.set(edge.from, (degreeMap.get(edge.from) ?? 0) + 1);
      degreeMap.set(edge.to, (degreeMap.get(edge.to) ?? 0) + 1);
    });
    cy.add([
      ...nodes.map((node) => ({
        group: 'nodes',
        data: {
          id: node.id,
          label: node.label,
          filePath: node.filePath,
          tags: node.tags,
          language: node.language,
          risk: node.risk ?? 1,
          complexity: node.complexity ?? 1,
          weight: degreeMap.get(node.id) ?? 1,
        },
      })),
      ...edges.map((edge) => ({
        group: 'edges',
        data: {
          id: `${edge.from}-${edge.to}-${edge.kind}`,
          source: edge.from,
          target: edge.to,
          kind: edge.kind,
        },
      })),
    ]);
    cy.layout(layoutOptions).run();
  }, [nodes, edges]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const term = searchTerm.trim().toLowerCase();
    cy.nodes().forEach((node) => {
      const data = node.data();
      const tags: string[] = Array.isArray(data.tags)
        ? data.tags
        : String(data.tags ?? '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
      const matchesSearch = term
        ? data.label.toLowerCase().includes(term) || data.filePath.toLowerCase().includes(term)
        : true;
      const matchesLanguage = filters.language
        ? (data.language ?? '').toLowerCase().includes(filters.language.toLowerCase())
        : true;
      const matchesTag = filters.tag
        ? tags.some((tag) => tag.toLowerCase().includes(filters.tag.toLowerCase()))
        : true;
      const matchesRisk =
        filters.maxRisk !== undefined ? (data.risk as number) <= filters.maxRisk : true;
      const visible = matchesSearch && matchesLanguage && matchesTag && matchesRisk;
      node.style('display', visible ? 'element' : 'none');
      const baseColor = heatmap ? heatmapColor(data.complexity as number) : baseNodeColor;
      node.style('background-color', baseColor);
    });
  }, [searchTerm, filters, heatmap, nodes]);

  return (
    <div className="graph-panel">
      <div id="graph" ref={containerRef} />
      {focusedNode && (
        <section className="details">
          <h2>{focusedNode.label}</h2>
          <p>{focusedNode.summary}</p>
          <p>
            <strong>File</strong>: {focusedNode.filePath}
          </p>
          <p>
            <strong>Tags</strong>: {focusedNode.tags.join(', ') || '–'}
          </p>
          <p>
            <strong>Complexity</strong>: {focusedNode.complexity ?? 'n/a'} · <strong>Risk</strong>:{' '}
            {focusedNode.risk ?? 'n/a'}
          </p>
        </section>
      )}
    </div>
  );
};

export default GraphView;
