import type { BlockEdge, CodeBlock } from '../../storage/models';
import { hashContent } from '../../storage/models';
import type { ParserResult } from './tsParser';

const methodRegex = /(?:public|protected|private)?\s*(?:static\s+)?(?:[\w<>\[\]]+)\s+([A-Za-z0-9_]+)\s*\(/g;
const classRegex = /(?:public\s+)?class\s+([A-Za-z0-9_]+)/g;

const lineNumberAt = (source: string, index: number): number => {
  return source.slice(0, index).split(/\r?\n/).length;
};

const buildId = (
  repoId: string,
  filePath: string,
  name: string,
  start: number,
  end: number,
): string => `block-${hashContent(`${repoId}:${filePath}:${name}:${start}:${end}`).slice(0, 16)}`;

export const parseJavaFile = (
  repoId: string,
  filePath: string,
  source: string,
): ParserResult => {
  const matches: Array<{ name: string; index: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = classRegex.exec(source))) {
    matches.push({ name: match[1], index: match.index });
  }
  while ((match = methodRegex.exec(source))) {
    matches.push({ name: match[1], index: match.index });
  }
  matches.sort((a, b) => a.index - b.index);

  if (matches.length === 0) {
    const id = buildId(repoId, filePath, 'Class', 1, source.split(/\r?\n/).length);
    const block: CodeBlock = {
      id,
      repoId,
      filePath,
      language: 'java',
      span: { startLine: 1, endLine: source.split(/\r?\n/).length },
      title: 'Class',
      summary: 'Pending analysis',
      tags: [],
      dependencies: [],
      dependents: [],
      lastAnalyzedIso: '',
      sourceHash: hashContent(source),
    };
    return { blocks: [block], edges: [], sources: { [id]: source.slice(0, 8000) } };
  }

  const blocks: CodeBlock[] = [];
  const edges: BlockEdge[] = [];
  const sources: Record<string, string> = {};

  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index;
    const end = next ? next.index : source.length;
    const snippet = source.slice(start, end);
    const startLine = lineNumberAt(source, start);
    const endLine = Math.max(lineNumberAt(source, end), startLine);
    const id = buildId(repoId, filePath, current.name, startLine, endLine);
    const block: CodeBlock = {
      id,
      repoId,
      filePath,
      language: 'java',
      span: { startLine, endLine },
      title: current.name,
      summary: 'Pending analysis',
      tags: [],
      dependencies: [],
      dependents: [],
      lastAnalyzedIso: '',
      sourceHash: hashContent(snippet),
    };
    blocks.push(block);
    sources[id] = snippet.slice(0, 8000);
  }

  for (const block of blocks) {
    const snippet = sources[block.id];
    for (const target of blocks) {
      if (target.id === block.id) continue;
      const regex = new RegExp(`\\b${target.title}\\s*\\(`, 'g');
      if (regex.test(snippet)) {
        edges.push({ from: block.id, to: target.id, kind: 'calls' });
        block.dependencies.push(target.id);
      }
    }
  }

  return { blocks, edges, sources };
};
