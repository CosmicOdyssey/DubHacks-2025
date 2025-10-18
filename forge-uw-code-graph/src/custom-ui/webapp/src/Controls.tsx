import React from 'react';
import type { DelegationSuggestion } from './api';

type Filters = {
  language: string;
  tag: string;
  maxRisk?: number;
};

type ControlsProps = {
  searchTerm: string;
  onSearch(term: string): void;
  filters: Filters;
  onFilterChange(update: Partial<Filters>): void;
  heatmap: boolean;
  onToggleHeatmap(): void;
  onLoadMore(): void;
  hasMore: boolean;
  selectionCount: number;
  onSuggest(): void;
  suggestion?: DelegationSuggestion | null;
  onApply(): void;
  onExportCSV(): void;
  onExportPNG(): void;
};

const Controls: React.FC<ControlsProps> = ({
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  heatmap,
  onToggleHeatmap,
  onLoadMore,
  hasMore,
  selectionCount,
  onSuggest,
  suggestion,
  onApply,
  onExportCSV,
  onExportPNG,
}) => {
  return (
    <aside className="controls">
      <h2>Controls</h2>
      <label>
        Search
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Function, file, tag…"
        />
      </label>
      <label>
        Language
        <input
          type="text"
          value={filters.language}
          onChange={(event) => onFilterChange({ language: event.target.value })}
          placeholder="ts, py, java…"
        />
      </label>
      <label>
        Tag
        <input
          type="text"
          value={filters.tag}
          onChange={(event) => onFilterChange({ tag: event.target.value })}
          placeholder="API, UI, DB…"
        />
      </label>
      <label>
        Max risk
        <input
          type="number"
          min={1}
          max={10}
          value={filters.maxRisk ?? ''}
          onChange={(event) =>
            onFilterChange({
              maxRisk: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={heatmap}
          onChange={() => onToggleHeatmap()}
        />
        Heatmap by complexity
      </label>
      <div className="row">
        <button onClick={onLoadMore} disabled={!hasMore}>
          {hasMore ? 'Load more nodes' : 'No more nodes'}
        </button>
        <button onClick={onExportPNG}>Export PNG</button>
        <button onClick={onExportCSV}>Export CSV</button>
      </div>
      <div className="row">
        <button onClick={onSuggest} disabled={selectionCount === 0}>
          Suggest work ({selectionCount})
        </button>
      </div>
      {suggestion && (
        <div className="suggestion">
          <h3>{suggestion.epicTitle}</h3>
          <p>{suggestion.rationale}</p>
          <ul>
            {suggestion.tasks.map((task) => (
              <li key={task.title}>
                <strong>{task.title}</strong> · {task.blockIds.length} blocks · est.{' '}
                {task.estimate ?? '?'}
              </li>
            ))}
          </ul>
          <button onClick={onApply}>Create Jira issues</button>
        </div>
      )}
    </aside>
  );
};

export default Controls;
