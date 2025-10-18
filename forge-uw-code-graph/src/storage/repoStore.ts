import { storage } from '@forge/api';
import type { BlockEdge, CodeBlock, RepoIndex } from './models';

const repoIndexKey = (repoId: string) => `repo-index:${repoId}`;
const blocksKey = (repoId: string) => `repo-blocks:${repoId}`;
const edgesKey = (repoId: string) => `repo-edges:${repoId}`;

export const saveRepoIndex = async (index: RepoIndex): Promise<void> => {
  await storage.set(repoIndexKey(index.repoId), index);
};

export const getRepoIndex = async (repoId: string): Promise<RepoIndex | undefined> => {
  return (await storage.get(repoIndexKey(repoId))) as RepoIndex | undefined;
};

export const saveBlocks = async (
  repoId: string,
  blocks: CodeBlock[],
): Promise<void> => {
  await storage.set(blocksKey(repoId), blocks);
};

export const getBlocks = async (repoId: string): Promise<CodeBlock[]> => {
  return ((await storage.get(blocksKey(repoId))) as CodeBlock[]) || [];
};

export const saveEdges = async (
  repoId: string,
  edges: BlockEdge[],
): Promise<void> => {
  await storage.set(edgesKey(repoId), edges);
};

export const getEdges = async (repoId: string): Promise<BlockEdge[]> => {
  return ((await storage.get(edgesKey(repoId))) as BlockEdge[]) || [];
};

export const upsertBlocks = async (
  repoId: string,
  updates: CodeBlock[],
): Promise<CodeBlock[]> => {
  const existing = await getBlocks(repoId);
  const byId = new Map(existing.map((b) => [b.id, b] as const));
  for (const block of updates) {
    byId.set(block.id, block);
  }
  const next = Array.from(byId.values());
  await saveBlocks(repoId, next);
  return next;
};

export const upsertEdges = async (
  repoId: string,
  updates: BlockEdge[],
): Promise<BlockEdge[]> => {
  const unique = new Map<string, BlockEdge>();
  const keyOf = (edge: BlockEdge) => `${edge.from}->${edge.to}:${edge.kind}`;
  for (const edge of await getEdges(repoId)) {
    unique.set(keyOf(edge), edge);
  }
  for (const edge of updates) {
    unique.set(keyOf(edge), edge);
  }
  const merged = Array.from(unique.values());
  await saveEdges(repoId, merged);
  return merged;
};
