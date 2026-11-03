/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const runtime = resolve(__dirname);
const entries = ['core/index.ts', 'base/index.ts', 'fluent/index.ts'];

function resolveSource(from: string, specifier: string): string {
  const path = resolve(dirname(from), specifier);
  const candidates = [path, `${path}.ts`, `${path}.tsx`, join(path, 'index.ts'), join(path, 'index.tsx')];
  const match = candidates.find((candidate) => existsSync(candidate) && /\.(?:tsx?|css)$/.test(candidate));
  if (!match) throw new Error(`Unresolved source dependency ${specifier} in ${relative(runtime, from)}`);
  return match;
}

describe('source distribution boundary', () => {
  it.each(entries)('%s has a self-contained runtime import graph', (entry) => {
    const visited = new Set<string>();
    const queue = [join(runtime, entry)];
    while (queue.length) {
      const file = queue.pop()!;
      if (visited.has(file)) continue;
      visited.add(file);
      const path = relative(runtime, file);
      expect(path.startsWith(`..${sep}`), file).toBe(false);
      expect(path.includes('.test.'), file).toBe(false);
      expect(path, file).not.toBe('DesignSystemContext.tsx');
      const source = readFileSync(file, 'utf8');
      const imports = file.endsWith('.css')
        ? [...source.matchAll(/@import\s+["']([^"']+)["']/g)]
        : [...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']/g)];
      for (const [, specifier] of imports) {
        if (specifier.startsWith('.')) queue.push(resolveSource(file, specifier));
        else expect(specifier, `${path}: external dependency`).not.toMatch(/^(?:@\/|tailwindcss|@phosphor-icons)/);
      }
    }
    expect(visited.size).toBeGreaterThan(1);
  });
});
