import type { ResolverResponse } from '@forge/resolver';
import type { DelegationSuggestion } from '../storage/models';
import { getBlocks, getEdges } from '../storage/repoStore';
import { getProjectRepo } from './sourceStore';
import {
  createWorkBreakdown,
  applyWorkBreakdown,
  getIssueBlockLinks,
} from '../jira/issueOps';

const PAGE_SIZE = 100;

type SuggestPayload = {
  projectKey: string;
  repoId?: string;
  blockIds: string[];
};

type SuggestResult = {
  suggestion: DelegationSuggestion;
};

type ApplyPayload = {
  projectKey: string;
  repoId?: string;
  suggestion: DelegationSuggestion;
};

type ApplyResult = {
  epicKey: string;
  taskKeys: string[];
};

type GraphRequest = {
  repoId?: string;
  projectKey?: string;
  cursor?: string;
};

type GraphResponse = {
  nodes: Array<{
    id: string;
    label: string;
    filePath: string;
    summary: string;
    tags: string[];
    complexity?: number;
    risk?: number;
    language?: string;
  }>;
  edges: Array<{ from: string; to: string; kind: string }>;
  nextCursor?: string;
};

type IssueBlocksRequest = {
  issueKey: string;
};

type IssueBlocksResponse = {
  repoId?: string;
  blockIds: string[];
  blocks: Array<{
    id: string;
    title: string;
    filePath: string;
    summary: string;
    tags: string[];
  }>;
};

const resolveRepo = async (repoId: string | undefined, projectKey?: string) => {
  if (repoId) return repoId;
  if (!projectKey) {
    throw new Error('repoId or projectKey required');
  }
  const resolved = await getProjectRepo(projectKey);
  if (!resolved) {
    throw new Error(`No repository associated with project ${projectKey}`);
  }
  return resolved;
};

export const delegateSuggestHandler = async (
  request: SuggestPayload,
): Promise<ResolverResponse<SuggestResult>> => {
  const repoId = await resolveRepo(request.repoId, request.projectKey);
  const suggestion = await createWorkBreakdown(
    request.projectKey,
    request.blockIds,
    repoId,
  );
  return { suggestion };
};

export const delegateApplyHandler = async (
  request: ApplyPayload,
): Promise<ResolverResponse<ApplyResult>> => {
  const repoId = await resolveRepo(request.repoId, request.projectKey);
  const result = await applyWorkBreakdown(
    request.projectKey,
    request.suggestion,
    repoId,
  );
  return result;
};

export const getGraphHandler = async (
  request: GraphRequest,
): Promise<ResolverResponse<GraphResponse>> => {
  const repoId = await resolveRepo(request.repoId, request.projectKey);
  const cursor = request.cursor ? parseInt(request.cursor, 10) : 0;
  const blocks = await getBlocks(repoId);
  const edges = await getEdges(repoId);
  const nodes = blocks.slice(cursor, cursor + PAGE_SIZE).map((block) => ({
    id: block.id,
    label: block.title,
    filePath: block.filePath,
    summary: block.summary,
    tags: block.tags,
    complexity: block.complexity,
    risk: block.risk,
    language: block.language,
  }));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const filteredEdges = edges.filter(
    (edge) => nodeIds.has(edge.from) || nodeIds.has(edge.to),
  );
  const nextCursor = cursor + PAGE_SIZE < blocks.length ? String(cursor + PAGE_SIZE) : undefined;
  return {
    nodes,
    edges: filteredEdges.map((edge) => ({ from: edge.from, to: edge.to, kind: edge.kind })),
    nextCursor,
  };
};

export const getIssueBlocksHandler = async (
  request: IssueBlocksRequest,
): Promise<ResolverResponse<IssueBlocksResponse>> => {
  if (!request.issueKey) {
    throw new Error('issueKey is required');
  }
  const data = await getIssueBlockLinks(request.issueKey);
  if (!data) {
    return { repoId: undefined, blockIds: [], blocks: [] };
  }
  const blocks = await getBlocks(data.repoId);
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const details = data.blockIds
    .map((id) => blockMap.get(id))
    .filter((block): block is NonNullable<typeof block> => Boolean(block))
    .map((block) => ({
      id: block.id,
      title: block.title,
      filePath: block.filePath,
      summary: block.summary,
      tags: block.tags,
    }));
  return { repoId: data.repoId, blockIds: data.blockIds, blocks: details };
};
