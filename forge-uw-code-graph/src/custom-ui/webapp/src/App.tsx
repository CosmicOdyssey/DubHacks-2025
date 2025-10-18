import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Core } from 'cytoscape';
import Controls from './Controls';
import GraphView from './GraphView';
import {
  applyDelegation,
  fetchContext,
  fetchGraph,
  requestDelegation,
  type DelegationSuggestion,
  type GraphEdge,
  type GraphNode,
} from './api';
import Papa from 'papaparse';

const useQueryParam = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? undefined;
};

const App: React.FC = () => {
  const [projectKey, setProjectKey] = useState<string>('');
  const [repoId, setRepoId] = useState<string | undefined>(useQueryParam('repoId'));
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ language: '', tag: '', maxRisk: undefined as number | undefined });
  const [heatmap, setHeatmap] = useState(true);
  const [selection, setSelection] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<DelegationSuggestion | null>(null);
  const [status, setStatus] = useState('Loading graph…');
  const cyRef = useRef<Core | null>(null);

  const loadPage = useCallback(
    async (cursorToLoad?: string) => {
      if (!projectKey && !repoId) return;
      setStatus('Loading graph data…');
      const page = await fetchGraph(projectKey, repoId, cursorToLoad);
      setNodes((prev) => (cursorToLoad ? [...prev, ...page.nodes] : page.nodes));
      setEdges((prev) => (cursorToLoad ? [...prev, ...page.edges] : page.edges));
      setCursor(page.nextCursor);
      setStatus(`Loaded ${cursorToLoad ? 'additional ' : ''}${page.nodes.length} nodes.`);
    },
    [projectKey, repoId],
  );

  useEffect(() => {
    fetchContext().then((ctx) => {
      const key = ctx?.extension?.project?.key ?? ctx?.productContext?.projectKey;
      if (key) {
        setProjectKey(key);
      }
      const repoParam = useQueryParam('repoId');
      if (!repoId && repoParam) {
        setRepoId(repoParam);
      }
    });
  }, [repoId]);

  useEffect(() => {
    if (!projectKey) return;
    loadPage();
  }, [projectKey, repoId, loadPage]);

  const handleFilterChange = (update: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  const handleSuggest = async () => {
    if (selection.length === 0 || !projectKey) return;
    setStatus('Calculating delegation heuristic…');
    const result = await requestDelegation(projectKey, selection, repoId);
    setSuggestion(result);
    setStatus(`Suggested ${result.tasks.length} tasks.`);
  };

  const handleApply = async () => {
    if (!suggestion || !projectKey) return;
    setStatus('Creating Jira issues…');
    const result = await applyDelegation(projectKey, suggestion, repoId);
    setStatus(`Created epic ${result.epicKey} with ${result.taskKeys.length} tasks.`);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(
      nodes.map((node) => ({
        id: node.id,
        label: node.label,
        filePath: node.filePath,
        tags: node.tags.join('|'),
        complexity: node.complexity ?? '',
        risk: node.risk ?? '',
      })),
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uw-code-graph.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png = cyRef.current.png({ bg: '#0f172a', full: true, scale: 2 });
    const link = document.createElement('a');
    link.href = png;
    link.download = 'uw-code-graph.png';
    link.click();
  };

  const hasMore = useMemo(() => Boolean(cursor), [cursor]);

  return (
    <div className="app">
      <Controls
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        heatmap={heatmap}
        onToggleHeatmap={() => setHeatmap((prev) => !prev)}
        onLoadMore={() => cursor && loadPage(cursor)}
        hasMore={hasMore}
        selectionCount={selection.length}
        onSuggest={handleSuggest}
        suggestion={suggestion}
        onApply={handleApply}
        onExportCSV={handleExportCSV}
        onExportPNG={handleExportPNG}
      />
      <div className="graph-stack">
        <header className="status-bar">{status}</header>
        <GraphView
          nodes={nodes}
          edges={edges}
          searchTerm={searchTerm}
          filters={filters}
          heatmap={heatmap}
          onSelectionChange={setSelection}
          onReady={(cy) => (cyRef.current = cy)}
        />
      </div>
    </div>
  );
};

export default App;
