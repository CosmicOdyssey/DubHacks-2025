import axios from 'axios';
import type { CodeBlock } from '../storage/models';

type SummarizeBlockInput = {
  id: string;
  filePath: string;
  language: CodeBlock['language'];
  title: string;
  sourcePreview: string;
};

export type SummarizeInput = {
  repoId: string;
  blocks: SummarizeBlockInput[];
};

export type SummarizedBlock = {
  id: string;
  summary: string;
  tags: string[];
  complexity: number;
  risk: number;
  owners?: string[];
};

export type SummarizeResult = {
  updated: SummarizedBlock[];
  model: string;
  latencyMs?: number;
};

export interface GeminiClient {
  summarizeBlocks(input: SummarizeInput): Promise<SummarizeResult>;
}

const baseTags = (
  filePath: string,
  snippet: string,
  language: CodeBlock['language'],
): string[] => {
  const tags = new Set<string>();
  if (filePath.includes('api')) tags.add('API');
  if (filePath.includes('ui') || filePath.includes('App')) tags.add('UI');
  if (filePath.includes('db') || /SELECT|INSERT|UPDATE|DELETE/i.test(snippet)) tags.add('DB');
  if (/test|spec/i.test(filePath)) tags.add('Test');
  if (language === 'py') tags.add('Python');
  if (language === 'java') tags.add('Java');
  if (language === 'ts' || language === 'js') tags.add('TypeScript');
  return Array.from(tags);
};

const computeComplexity = (snippet: string, dependencyCount: number): number => {
  const lines = snippet.split(/?
/).length;
  const normalized = Math.min(10, Math.max(1, Math.round(lines / 10 + dependencyCount)));
  return normalized;
};

const computeRisk = (snippet: string, complexity: number): number => {
  const ioRisk = /fetch\(|axios|http|database|fs\./i.test(snippet) ? 2 : 0;
  const testMitigation = /test|assert/i.test(snippet) ? -1 : 0;
  const raw = Math.min(10, Math.max(1, complexity + ioRisk + testMitigation));
  return raw;
};

const extractOwners = (snippet: string): string[] | undefined => {
  const ownerMatch = snippet.match(/@owner[:=]\s*([\w@.]+)/i);
  if (ownerMatch) {
    return [ownerMatch[1]];
  }
  return undefined;
};

export class MockGeminiClient implements GeminiClient {
  async summarizeBlocks(input: SummarizeInput): Promise<SummarizeResult> {
    const updated = input.blocks.map((block) => {
      const tags = baseTags(block.filePath, block.sourcePreview, block.language);
      const complexity = computeComplexity(block.sourcePreview, 0);
      const risk = computeRisk(block.sourcePreview, complexity);
      return {
        id: block.id,
        summary: `Mock summary for ${block.title} in ${block.filePath}.`,
        tags,
        complexity,
        risk,
        owners: extractOwners(block.sourcePreview),
      };
    });
    return { updated, model: 'mock-gemini-flash' };
  }
}

export class EnvGeminiClient implements GeminiClient {
  private readonly apiKey: string;
  private readonly mockFallback: MockGeminiClient;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.mockFallback = new MockGeminiClient();
  }

  async summarizeBlocks(input: SummarizeInput): Promise<SummarizeResult> {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    const payload = {
      contents: [
        {
          parts: [
            {
              text: JSON.stringify({
                instruction: 'Summarize code blocks into concise explanations with tags.',
                repoId: input.repoId,
                blocks: input.blocks,
              }),
            },
          ],
        },
      ],
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_HIGH' },
      ],
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-goog-api-key': this.apiKey,
    };
    try {
      const start = Date.now();
      const response = await axios.post(url, payload, { headers, timeout: 8000 });
      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        response.data?.candidates?.[0]?.output ??
        '';
      const parsed = JSON.parse(text || '{}');
      if (!parsed.updated) {
        throw new Error('Gemini response missing updated blocks');
      }
      return {
        updated: parsed.updated as SummarizedBlock[],
        model: response.data?.model ?? 'gemini-1.5-flash',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      console.warn('Gemini API failed, falling back to mock', error);
      return this.mockFallback.summarizeBlocks(input);
    }
  }
}

export const createGeminiClient = (): GeminiClient => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new MockGeminiClient();
  }
  return new EnvGeminiClient(apiKey);
};
