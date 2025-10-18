import { createHash } from 'crypto';

export type CodeBlock = {
  id: string;
  repoId: string;
  filePath: string;
  language: 'ts' | 'js' | 'py' | 'java' | 'other';
  span: { startLine: number; endLine: number };
  title: string;
  summary: string;
  tags: string[];
  owners?: string[];
  complexity?: number;
  risk?: number;
  dependencies: string[];
  dependents: string[];
  jiraLinks?: {
    issueKey: string;
    relation: 'implements' | 'blocked-by' | 'relates-to';
  }[];
  lastAnalyzedIso: string;
  sourceHash: string;
};

export type BlockEdge = {
  from: string;
  to: string;
  kind:
    | 'imports'
    | 'calls'
    | 'uses'
    | 'queries'
    | 'writes'
    | 'tests'
    | 'docs';
  weight?: number;
};

export type RepoIndex = {
  repoId: string;
  repoLabel: string;
  defaultBranch?: string;
  commit?: string;
  files: { path: string; language: string; sha: string }[];
  blockIds: string[];
  createdIso: string;
};

export type DelegationSuggestion = {
  epicTitle: string;
  rationale: string;
  tasks: Array<{
    title: string;
    description: string;
    blockIds: string[];
    suggestedOwner?: string;
    estimate?: number;
    dependsOn?: string[];
  }>;
};

export type DegreeMap = Record<
  string,
  {
    in: number;
    out: number;
    total: number;
  }
>;

export const computeDegrees = (
  blocks: Pick<CodeBlock, 'id'>[],
  edges: BlockEdge[],
): DegreeMap => {
  const degree: DegreeMap = Object.fromEntries(
    blocks.map((block) => [block.id, { in: 0, out: 0, total: 0 }]),
  );
  for (const edge of edges) {
    if (!degree[edge.from]) {
      degree[edge.from] = { in: 0, out: 0, total: 0 };
    }
    if (!degree[edge.to]) {
      degree[edge.to] = { in: 0, out: 0, total: 0 };
    }
    degree[edge.from].out += 1;
    degree[edge.from].total += 1;
    degree[edge.to].in += 1;
    degree[edge.to].total += 1;
  }
  return degree;
};

export const findConnectedComponents = (
  blocks: Pick<CodeBlock, 'id'>[],
  edges: BlockEdge[],
): string[][] => {
  const adjacency = new Map<string, Set<string>>();
  for (const block of blocks) {
    adjacency.set(block.id, new Set());
  }
  for (const edge of edges) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, new Set());
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, new Set());
    adjacency.get(edge.from)!.add(edge.to);
    adjacency.get(edge.to)!.add(edge.from);
  }
  const visited = new Set<string>();
  const components: string[][] = [];
  for (const node of adjacency.keys()) {
    if (visited.has(node)) continue;
    const queue: string[] = [node];
    const component: string[] = [];
    visited.add(node);
    while (queue.length) {
      const current = queue.shift()!;
      component.push(current);
      for (const neighbor of adjacency.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    components.push(component);
  }
  return components;
};

export const hashContent = (input: string): string => {
  return createHash('sha256').update(input).digest('hex');
};
