import { describe, expect, it } from 'vitest';
import { parseTypeScriptFile } from '../api/parsers/tsParser';
import { parsePythonFile } from '../api/parsers/pyParser';
import { parseJavaFile } from '../api/parsers/javaParser';

const repoId = 'test-repo';

describe('language parsers', () => {
  it('parses TypeScript functions and dependencies', () => {
    const source = `
      import { helper } from './helper';
      export async function main() {
        helper();
      }
      export function helper() { return 1; }
    `;
    const { blocks, edges } = parseTypeScriptFile(repoId, 'src/app.ts', source);
    expect(blocks).toHaveLength(2);
    expect(edges).toHaveLength(1);
    expect(edges[0].kind).toBe('calls');
  });

  it('parses Python defs and classes', () => {
    const source = `
      class Loader:
          def load(self):
              return parse()
      def parse():
          return 42
    `;
    const { blocks, edges } = parsePythonFile(repoId, 'backend/loader.py', source);
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    expect(edges.some((edge) => edge.kind === 'calls')).toBe(true);
  });

  it('parses Java classes and methods', () => {
    const source = `
      public class Sample {
        public void run() { compute(); }
        private int compute() { return 7; }
      }
    `;
    const { blocks, edges } = parseJavaFile(repoId, 'mobile/Sample.java', source);
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    expect(edges.some((edge) => edge.kind === 'calls')).toBe(true);
  });
});
