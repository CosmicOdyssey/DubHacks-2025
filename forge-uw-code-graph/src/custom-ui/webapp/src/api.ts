import { invoke, view } from '@forge/bridge';

export type GraphNode = {
  id: string;
  label: string;
  filePath: string;
  summary: string;
  tags: string[];
  complexity?: number;
  risk?: number;
  language?: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  kind: string;
};

export type GraphPage = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nextCursor?: string;
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

export const fetchContext = async () => {
  const ctx = await view.getContext();
  return ctx;
};

export const fetchGraph = async (
  projectKey: string,
  repoId?: string,
  cursor?: string,
): Promise<GraphPage> => {
  return invoke('graphPage', {
    projectKey,
    repoId,
    cursor,
  });
};

export const requestDelegation = async (
  projectKey: string,
  blockIds: string[],
  repoId?: string,
): Promise<DelegationSuggestion> => {
  const response = await invoke('delegateSuggest', {
    projectKey,
    blockIds,
    repoId,
  });
  return response.suggestion as DelegationSuggestion;
};

export const applyDelegation = async (
  projectKey: string,
  suggestion: DelegationSuggestion,
  repoId?: string,
): Promise<{ epicKey: string; taskKeys: string[] }> => {
  return invoke('delegateApply', {
    projectKey,
    suggestion,
    repoId,
  });
};
