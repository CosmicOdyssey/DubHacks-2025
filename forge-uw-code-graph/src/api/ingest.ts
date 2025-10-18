import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { ResolverResponse } from '@forge/resolver';
import type { BlockEdge, CodeBlock, RepoIndex } from '../storage/models';
import { hashContent } from '../storage/models';
import { saveRepoIndex, saveBlocks, saveEdges } from '../storage/repoStore';
import { parseTypeScriptFile } from './parsers/tsParser';
import { parsePythonFile } from './parsers/pyParser';
import { parseJavaFile } from './parsers/javaParser';
import {
  setBlockSourceSnippet,
  setProjectRepo,
} from './sourceStore';

const languageByExt: Record<string, CodeBlock['language']> = {
  '.ts': 'ts',
  '.tsx': 'ts',
  '.js': 'js',
  '.py': 'py',
  '.java': 'java',
};

type LoadedFile = { filePath: string; content: string; language: CodeBlock['language'] };

type IngestPayload = {
  repoLabel: string;
  projectKey: string;
  gitUrl?: string;
  zipBase64?: string;
};

type IngestResult = {
  repoId: string;
  blockCount: number;
  fileCount: number;
  createdIso: string;
};

const collectFromZip = async (zipBase64: string): Promise<LoadedFile[]> => {
  const buffer = Buffer.from(zipBase64, 'base64');
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  const files: LoadedFile[] = [];
  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const ext = path.extname(entry.entryName);
    const language = languageByExt[ext];
    if (!language) continue;
    const content = entry.getData().toString('utf-8');
    const normalizedPath = entry.entryName.replace(/^.*?\//, '');
    files.push({ filePath: normalizedPath, content, language });
  }
  return files;
};

const collectFromMockGit = async (gitUrl: string): Promise<LoadedFile[]> => {
  const repoName = path.basename(gitUrl).replace(/\.git$/, '') || 'sample';
  const baseDir = path.resolve(process.cwd(), 'fixtures/mock-repos', repoName);
  const files: LoadedFile[] = [];
  try {
    await fs.access(baseDir);
  } catch {
    throw new Error(
      `Mock Git repository not found for ${gitUrl}. Expected directory ${baseDir}`,
    );
  }
  const walk = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else {
        const ext = path.extname(entry.name);
        const language = languageByExt[ext];
        if (!language) continue;
        const content = await fs.readFile(entryPath, 'utf-8');
        const relative = path.relative(baseDir, entryPath);
        files.push({ filePath: relative, content, language });
      }
    }
  };
  await walk(baseDir);
  return files;
};

const parseFile = (
  repoId: string,
  file: LoadedFile,
): { blocks: CodeBlock[]; edges: BlockEdge[]; sources: Record<string, string> } => {
  switch (file.language) {
    case 'ts':
    case 'js':
      return parseTypeScriptFile(repoId, file.filePath, file.content);
    case 'py':
      return parsePythonFile(repoId, file.filePath, file.content);
    case 'java':
      return parseJavaFile(repoId, file.filePath, file.content);
    default:
      return { blocks: [], edges: [], sources: {} };
  }
};

export const ingestHandler = async (
  request: IngestPayload,
): Promise<ResolverResponse<IngestResult>> => {
  if (!request?.repoLabel || !request.projectKey) {
    throw new Error('repoLabel and projectKey are required');
  }
  const repoId = randomUUID();
  let files: LoadedFile[] = [];
  if (request.zipBase64) {
    files = await collectFromZip(request.zipBase64);
  } else if (request.gitUrl) {
    files = await collectFromMockGit(request.gitUrl);
  } else {
    throw new Error('zipBase64 or gitUrl required');
  }
  if (files.length === 0) {
    throw new Error('No supported source files found');
  }

  const allBlocks: CodeBlock[] = [];
  const allEdges: BlockEdge[] = [];
  for (const file of files) {
    const { blocks, edges, sources } = parseFile(repoId, file);
    for (const block of blocks) {
      allBlocks.push(block);
      const snippet = sources[block.id];
      if (snippet) {
        await setBlockSourceSnippet(repoId, block.id, snippet);
      }
    }
    allEdges.push(...edges);
  }

  const repoIndex: RepoIndex = {
    repoId,
    repoLabel: request.repoLabel,
    files: files.map((file) => ({
      path: file.filePath,
      language: file.language,
      sha: hashContent(file.content),
    })),
    blockIds: allBlocks.map((block) => block.id),
    createdIso: new Date().toISOString(),
  };

  await saveRepoIndex(repoIndex);
  await saveBlocks(repoId, allBlocks);
  await saveEdges(repoId, allEdges);
  await setProjectRepo(request.projectKey, repoId);

  return {
    repoId,
    blockCount: allBlocks.length,
    fileCount: files.length,
    createdIso: repoIndex.createdIso,
  };
};
