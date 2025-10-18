import { describe, expect, it, vi, beforeEach } from 'vitest';

const memory = new Map<string, any>();

vi.mock('@forge/api', () => ({
  storage: {
    async set(key: string, value: any) {
      memory.set(key, value);
    },
    async get(key: string) {
      return memory.get(key);
    },
  },
  secrets: {
    async set(key: string, value: any) {
      memory.set(`secret:${key}`, value);
    },
    async get(key: string) {
      return memory.get(`secret:${key}`);
    },
  },
}));

import { saveBlocks, saveEdges, saveRepoIndex } from '../storage/repoStore';
import type { BlockEdge, CodeBlock, RepoIndex } from '../storage/models';
import { createWorkBreakdown } from '../jira/issueOps';

const repoId = 'repo-123';
const projectKey = 'UW';

const makeBlock = (partial: Partial<CodeBlock>): CodeBlock => ({
  id: partial.id ?? '',
  repoId,
  filePath: partial.filePath ?? 'src/file.ts',
  language: partial.language ?? 'ts',
  span: partial.span ?? { startLine: 1, endLine: 5 },
  title: partial.title ?? 'fn',
  summary: partial.summary ?? 'summary',
  tags: partial.tags ?? [],
  dependencies: partial.dependencies ?? [],
  dependents: partial.dependents ?? [],
  lastAnalyzedIso: partial.lastAnalyzedIso ?? new Date().toISOString(),
  sourceHash: partial.sourceHash ?? 'hash',
  owners: partial.owners,
  complexity: partial.complexity,
  risk: partial.risk,
  jiraLinks: partial.jiraLinks,
});

beforeEach(async () => {
  memory.clear();
  const blocks: CodeBlock[] = [
    makeBlock({ id: 'a', title: 'Loader', filePath: 'backend/loader.py', language: 'py', tags: ['API'], owners: ['uw-data@uw.edu'], complexity: 6 }),
    makeBlock({ id: 'b', title: 'Analyzer', filePath: 'backend/analyze.py', language: 'py', tags: ['API'], dependencies: ['a'], complexity: 7 }),
    makeBlock({ id: 'c', title: 'UiWidget', filePath: 'ui/widget.tsx', language: 'ts', tags: ['UI'], complexity: 4 }),
    makeBlock({ id: 'd', title: 'Scheduler', filePath: 'infra/scheduler.ts', language: 'ts', dependencies: ['c'], complexity: 5 }),
  ];
  const edges: BlockEdge[] = [
    { from: 'b', to: 'a', kind: 'calls' },
    { from: 'd', to: 'c', kind: 'calls' },
  ];
  const repoIndex: RepoIndex = {
    repoId,
    repoLabel: 'UW Student Systems',
    files: [],
    blockIds: blocks.map((block) => block.id),
    createdIso: new Date().toISOString(),
  };
  await saveRepoIndex(repoIndex);
  await saveBlocks(repoId, blocks);
  await saveEdges(repoId, edges);
});

describe('createWorkBreakdown', () => {
  it('groups blocks and produces multiple tasks with owners', async () => {
    const suggestion = await createWorkBreakdown(projectKey, ['a', 'b', 'c', 'd'], repoId);
    expect(suggestion.tasks.length).toBeGreaterThanOrEqual(2);
    const epicTitle = suggestion.epicTitle.toLowerCase();
    expect(epicTitle).toContain('uw student systems');
    const apiTask = suggestion.tasks.find((task) => task.blockIds.includes('a'));
    expect(apiTask?.suggestedOwner).toBe('uw-data@uw.edu');
  });
});
