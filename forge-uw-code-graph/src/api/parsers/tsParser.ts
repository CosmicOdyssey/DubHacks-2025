import type { BlockEdge, CodeBlock } from '../../storage/models';
import { hashContent } from '../../storage/models';

export type ParserResult = {
  blocks: CodeBlock[];
  edges: BlockEdge[];
  sources: Record<string, string>;
};

const findLineNumber = (source: string, index: number): number => {
  return source.slice(0, index).split(/\r?\n/).length;
};

const buildId = (
  repoId: string,
  filePath: string,
  title: string,
  start: number,
  end: number,
): string => {
  return `block-${hashContent(`${repoId}:${filePath}:${title}:${start}:${end}`).slice(0, 16)}`;
};

const definitionPatterns: Array<{
  regex: RegExp;
  type: 'function' | 'class';
}> = [
  { regex: /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/g, type: 'function' },
  {
    regex: /(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g,
    type: 'function',
  },
  { regex: /(?:export\s+)?class\s+([A-Za-z0-9_]+)/g, type: 'class' },
];

export const parseTypeScriptFile = (
  repoId: string,
  filePath: string,
  source: string,
): ParserResult => {
  const matches: Array<{
    name: string;
    index: number;
    type: 'function' | 'class';
  }> = [];
  for (const pattern of definitionPatterns) {
    const regex = new RegExp(pattern.regex);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source))) {
      const name = match[1];
      matches.push({ name, index: match.index, type: pattern.type });
    }
  }
  matches.sort((a, b) => a.index - b.index);

  if (matches.length === 0) {
    const id = buildId(repoId, filePath, 'default', 1, source.split(/\r?\n/).length);
    const block: CodeBlock = {
      id,
      repoId,
      filePath,
      language: 'ts',
      span: { startLine: 1, endLine: source.split(/\r?\n/).length },
      title: 'Module',
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
    const startLine = findLineNumber(source, start);
    const endLine = Math.max(findLineNumber(source, end), startLine);
    const id = buildId(repoId, filePath, current.name, startLine, endLine);
    const block: CodeBlock = {
      id,
      repoId,
      filePath,
      language: 'ts',
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
