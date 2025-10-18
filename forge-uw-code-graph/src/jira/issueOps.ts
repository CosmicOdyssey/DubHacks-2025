import path from 'path';
import { storage } from '@forge/api';
import type {
  BlockEdge,
  CodeBlock,
  DelegationSuggestion,
} from '../storage/models';
import { computeDegrees, findConnectedComponents } from '../storage/models';
import { getBlocks, getEdges, getRepoIndex } from '../storage/repoStore';
import { createJiraIssue, addIssueLinkProperty, isMockJira } from './client';
import { getProjectRepo } from '../api/sourceStore';

const issueBlocksKey = (issueKey: string) => `issue-blocks:${issueKey}`;

const fallbackCommitters = new Map<string, string>([
  ['src/index.ts', 'uw-dev@uw.edu'],
  ['backend/processor.py', 'uw-data@uw.edu'],
  ['mobile/App.java', 'uw-mobile@uw.edu'],
]);

const describeBlocks = (blocks: CodeBlock[]): string => {
  return blocks
    .slice(0, 3)
    .map((block) => `• ${block.title} (${block.filePath})`)
    .join('\n');
};

const directoryKey = (filePath: string): string => {
  const normalized = filePath.split(path.sep).join(path.posix.sep);
  const dir = path.posix.dirname(normalized);
  return dir === '.' ? '' : dir;
};

const suggestOwner = (blocks: CodeBlock[]): string | undefined => {
  for (const block of blocks) {
    if (block.owners && block.owners.length > 0) {
      return block.owners[0];
    }
  }
  const componentLead = process.env.JIRA_COMPONENT_LEAD || process.env.DEFAULT_OWNER;
  if (componentLead) {
    return componentLead;
  }
  for (const block of blocks) {
    const fallback = fallbackCommitters.get(block.filePath);
    if (fallback) {
      return fallback;
    }
  }
  return undefined;
};

const average = (values: number[]): number => {
  if (values.length === 0) return 1;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const buildTasksFromComponent = (
  component: string[],
  blockById: Map<string, CodeBlock>,
  edges: BlockEdge[],
): DelegationSuggestion['tasks'] => {
  const blocks = component
    .map((id) => blockById.get(id))
    .filter((block): block is CodeBlock => Boolean(block));
  if (blocks.length === 0) {
    return [];
  }
  const groups: CodeBlock[][] = [];
  if (blocks.length > 20) {
    const grouped = new Map<string, CodeBlock[]>();
    for (const block of blocks) {
      const key = `${block.language}:${directoryKey(block.filePath)}`;
      const list = grouped.get(key) ?? [];
      list.push(block);
      grouped.set(key, list);
    }
    groups.push(...grouped.values());
  } else {
    groups.push(blocks);
  }
  if (groups.length === 1 && blocks.length > 3) {
    const half = Math.ceil(blocks.length / 2);
    groups[0] = blocks.slice(0, half);
    groups.push(blocks.slice(half));
  }
  const tasks = groups
    .filter((group) => group.length > 0)
    .map((group, index) => {
      const complexities = group
        .map((block) => block.complexity ?? Math.min(10, block.dependencies.length + 1))
        .filter(Boolean) as number[];
      const avgComplexity = average(complexities);
      const estimate = Math.max(1, Math.round(avgComplexity / 2));
      const suggestedOwner = suggestOwner(group);
      return {
        title: `${group[0].title} scope ${index + 1}`,
        description: `Focus on ${describeBlocks(group)}\n\nCohesion heuristics: language=${group[0].language}, directory=${directoryKey(
          group[0].filePath,
        )}.`,
        blockIds: group.map((block) => block.id),
        suggestedOwner,
        estimate,
        dependsOn: [],
      };
    });

  const taskIndexByBlock = new Map<string, number>();
  tasks.forEach((task, idx) => {
    for (const blockId of task.blockIds) {
      taskIndexByBlock.set(blockId, idx);
    }
  });
  for (const edge of edges) {
    const fromTask = taskIndexByBlock.get(edge.from);
    const toTask = taskIndexByBlock.get(edge.to);
    if (fromTask === undefined || toTask === undefined || fromTask === toTask) continue;
    const target = tasks[fromTask];
    const dependencyTask = tasks[toTask];
    const dependencyTitle = dependencyTask.title;
    if (!target.dependsOn) target.dependsOn = [];
    if (!target.dependsOn.includes(dependencyTitle)) {
      target.dependsOn.push(dependencyTitle);
    }
  }

  return tasks;
};

export const createWorkBreakdown = async (
  projectKey: string,
  selection: string[],
  repoIdOverride?: string,
): Promise<DelegationSuggestion> => {
  const repoId = repoIdOverride ?? (await getProjectRepo(projectKey));
  if (!repoId) {
    throw new Error(`No repository associated with project ${projectKey}`);
  }
  const blocks = await getBlocks(repoId);
  const edges = await getEdges(repoId);
  const repoIndex = await getRepoIndex(repoId);
  const blockById = new Map(blocks.map((block) => [block.id, block] as const));
  const selectedSet = new Set(selection.length ? selection : repoIndex?.blockIds ?? []);
  const selectedBlocks = blocks.filter((block) => selectedSet.has(block.id));
  const relevantEdges = edges.filter(
    (edge) => selectedSet.has(edge.from) && selectedSet.has(edge.to),
  );
  const degrees = computeDegrees(selectedBlocks, relevantEdges);
  for (const block of selectedBlocks) {
    if (!block.complexity) {
      const degree = degrees[block.id];
      block.complexity = degree ? Math.max(1, Math.min(10, degree.total)) : 1;
    }
  }
  const components = findConnectedComponents(selectedBlocks, relevantEdges);
  const tasks = components.flatMap((component) =>
    buildTasksFromComponent(component, blockById, relevantEdges),
  );
  if (tasks.length < 2 && selectedBlocks.length >= 2) {
    const [first, second] = [selectedBlocks.slice(0, 1), selectedBlocks.slice(1)];
    tasks.push(
      ...buildTasksFromComponent(
        first.map((block) => block.id),
        blockById,
        relevantEdges,
      ),
    );
    tasks.push(
      ...buildTasksFromComponent(
        second.map((block) => block.id),
        blockById,
        relevantEdges,
      ),
    );
  }
  const uniqueTasks = tasks.filter((task, index, arr) => {
    return (
      arr.findIndex((other) => other.title === task.title && other.blockIds.join(',') === task.blockIds.join(',')) ===
      index
    );
  });
  if (uniqueTasks.length === 0 && selectedBlocks.length > 0) {
    uniqueTasks.push({
      title: `${selectedBlocks[0].title} quick start`,
      description: describeBlocks(selectedBlocks),
      blockIds: selectedBlocks.map((block) => block.id),
      suggestedOwner: suggestOwner(selectedBlocks),
      estimate: Math.max(1, Math.round(average(selectedBlocks.map((b) => b.complexity ?? 1)) / 2)),
      dependsOn: [],
    });
  }
  const suggestion: DelegationSuggestion = {
    epicTitle: `${repoIndex?.repoLabel ?? 'UW Code Graph'} modernization epic`,
    rationale:
      'Derived from connected components within the UW code knowledge graph to maximise ownership clarity and throughput.',
    tasks: uniqueTasks,
  };
  return suggestion;
};

export const applyWorkBreakdown = async (
  projectKey: string,
  suggestion: DelegationSuggestion,
  repoId?: string,
): Promise<{ epicKey: string; taskKeys: string[] }> => {
  const epicFields = {
    project: { key: projectKey },
    issuetype: { name: 'Epic' },
    summary: suggestion.epicTitle,
    description: suggestion.rationale,
  };
  let epicKey: string;
  try {
    epicKey = await createJiraIssue(epicFields);
  } catch (error) {
    if (!isMockJira()) {
      throw error;
    }
    throw error;
  }
  if (repoId) {
    const epicBlocks = Array.from(
      new Set(suggestion.tasks.flatMap((task) => task.blockIds)),
    );
    await storage.set(issueBlocksKey(epicKey), { repoId, blockIds: epicBlocks });
    await addIssueLinkProperty(epicKey, 'uw-code-blocks', {
      repoId,
      blockIds: epicBlocks,
    });
  }

  const taskKeys: string[] = [];
  for (const task of suggestion.tasks) {
    const fields = {
      project: { key: projectKey },
      issuetype: { name: 'Story' },
      summary: task.title,
      description: `${task.description}\n\nBlocks: ${task.blockIds.join(', ')}`,
      customfield_10014: epicKey,
      assignee: task.suggestedOwner ? { accountId: task.suggestedOwner } : undefined,
    };
    const key = await createJiraIssue(fields);
    taskKeys.push(key);
    if (repoId) {
      await storage.set(issueBlocksKey(key), { repoId, blockIds: task.blockIds });
      await addIssueLinkProperty(key, 'uw-code-blocks', {
        repoId,
        blockIds: task.blockIds,
      });
    }
  }
  return { epicKey, taskKeys };
};

export const getIssueBlockLinks = async (
  issueKey: string,
): Promise<{ repoId: string; blockIds: string[] } | undefined> => {
  const stored = (await storage.get(issueBlocksKey(issueKey))) as
    | { repoId: string; blockIds: string[] }
    | undefined;
  return stored;
};
