import type { ResolverResponse } from '@forge/resolver';
import type { CodeBlock } from '../storage/models';
import { computeDegrees } from '../storage/models';
import { getBlocks, getEdges, upsertBlocks } from '../storage/repoStore';
import { createGeminiClient } from './gemini';
import { getBlockSourceSnippet } from './sourceStore';

type AnalyzePayload = {
  repoId: string;
  languages?: CodeBlock['language'][];
  maxBatchSize?: number;
};

type AnalyzeResult = {
  repoId: string;
  updatedBlockIds: string[];
  model: string;
};

const chunk = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const analyzeHandler = async (
  request: AnalyzePayload,
): Promise<ResolverResponse<AnalyzeResult>> => {
  const { repoId, languages, maxBatchSize = 8 } = request;
  if (!repoId) {
    throw new Error('repoId is required');
  }
  const blocks = await getBlocks(repoId);
  if (blocks.length === 0) {
    throw new Error(`No blocks found for repo ${repoId}`);
  }
  const edges = await getEdges(repoId);
  const eligible = blocks.filter((block) =>
    languages ? languages.includes(block.language) : true,
  );
  const client = createGeminiClient();
  const updatedBlockIds: string[] = [];
  let modelUsed = 'mock-gemini-flash';

  for (const batch of chunk(eligible, maxBatchSize)) {
    const withSource = await Promise.all(
      batch.map(async (block) => {
        const preview =
          (await getBlockSourceSnippet(repoId, block.id))?.slice(0, 1500) ??
          `${block.title} in ${block.filePath}`;
        return {
          id: block.id,
          filePath: block.filePath,
          language: block.language,
          title: block.title,
          sourcePreview: preview,
        };
      }),
    );
    const result = await client.summarizeBlocks({
      repoId,
      blocks: withSource,
    });
    modelUsed = result.model;
    const updateMap = new Map(result.updated.map((item) => [item.id, item]));
    for (const block of batch) {
      const update = updateMap.get(block.id);
      if (!update) continue;
      block.summary = update.summary;
      block.tags = update.tags;
      block.complexity = update.complexity;
      block.risk = update.risk;
      if (update.owners) {
        block.owners = update.owners;
      }
      block.lastAnalyzedIso = new Date().toISOString();
      updatedBlockIds.push(block.id);
    }
  }

  const degreeMap = computeDegrees(blocks, edges);
  const dependentsMap = new Map<string, Set<string>>();
  for (const edge of edges) {
    const targets = dependentsMap.get(edge.to) ?? new Set<string>();
    targets.add(edge.from);
    dependentsMap.set(edge.to, targets);
  }

  for (const block of blocks) {
    block.dependencies = Array.from(new Set(block.dependencies));
    const dependents = dependentsMap.get(block.id);
    block.dependents = dependents ? Array.from(dependents) : [];
    const degree = degreeMap[block.id];
    if (degree && !block.complexity) {
      block.complexity = Math.min(10, Math.max(1, degree.total));
    }
    if (degree && !block.risk) {
      block.risk = Math.min(10, Math.max(1, degree.in + 1));
    }
  }

  await upsertBlocks(repoId, blocks);

  return { repoId, updatedBlockIds, model: modelUsed };
};
