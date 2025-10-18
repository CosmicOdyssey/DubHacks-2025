import { secrets, storage } from '@forge/api';

const memorySecrets = new Map<string, string>();
const memoryStorage = new Map<string, string>();

const hasSecrets = (): boolean => Boolean(secrets && typeof secrets.set === 'function');

export const blockSourceKey = (repoId: string, blockId: string) =>
  `block-source:${repoId}:${blockId}`;

export const projectRepoKey = (projectKey: string) =>
  `project-repo:${projectKey}`;

export const setBlockSourceSnippet = async (
  repoId: string,
  blockId: string,
  snippet: string,
): Promise<void> => {
  const key = blockSourceKey(repoId, blockId);
  if (hasSecrets()) {
    await secrets.set(key, snippet);
  } else {
    memorySecrets.set(key, snippet);
  }
};

export const getBlockSourceSnippet = async (
  repoId: string,
  blockId: string,
): Promise<string | undefined> => {
  const key = blockSourceKey(repoId, blockId);
  if (hasSecrets()) {
    return (await secrets.get(key)) as string | undefined;
  }
  return memorySecrets.get(key);
};

export const setProjectRepo = async (
  projectKey: string,
  repoId: string,
): Promise<void> => {
  if (storage && typeof storage.set === 'function') {
    await storage.set(projectRepoKey(projectKey), repoId);
  } else {
    memoryStorage.set(projectRepoKey(projectKey), repoId);
  }
};

export const getProjectRepo = async (
  projectKey: string,
): Promise<string | undefined> => {
  if (storage && typeof storage.get === 'function') {
    return (await storage.get(projectRepoKey(projectKey))) as string | undefined;
  }
  return memoryStorage.get(projectRepoKey(projectKey));
};
