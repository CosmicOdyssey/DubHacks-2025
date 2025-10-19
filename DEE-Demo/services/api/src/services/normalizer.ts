import prisma from '../db/client';

type ScopeKey = string; // e.g., repo::{repo}

function computeQuantiles(values: number[]): { p1: number; p99: number; mean: number; std: number } {
  if (values.length === 0) return { p1: 0, p99: 0, mean: 0, std: 1 };
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p: number) => sorted[Math.floor((sorted.length - 1) * p)];
  const p1 = q(0.01);
  const p99 = q(0.99);
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const variance = sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, sorted.length - 1);
  const std = Math.max(Math.sqrt(variance), 1e-9);
  return { p1, p99, mean, std };
}

export async function runNormalizer(): Promise<void> {
  // Simplified: only normalize 'size' if present in rawFeatures
  const events = await prisma.event.findMany({ select: { repo: true, lang: true, stack: true, rawFeatures: true } });
  const byScope: Record<ScopeKey, number[]> = {};
  for (const e of events) {
    const key: ScopeKey = `repo::${e.repo}`; // can extend to lang/stack later
    const size = (e.rawFeatures as any)?.size;
    if (typeof size === 'number') {
      byScope[key] ||= [];
      byScope[key].push(size);
    }
  }
  const writes = Object.entries(byScope).map(async ([scopeKey, vals]) => {
    const { p1, p99, mean, std } = computeQuantiles(vals);
    return prisma.normStats.upsert({
      where: { scopeKey },
      create: { scopeKey, pLow: { size: p1 }, pHigh: { size: p99 }, mean: { size: mean }, std: { size: std } },
      update: { pLow: { size: p1 }, pHigh: { size: p99 }, mean: { size: mean }, std: { size: std }, lastUpdatedAt: new Date() },
    });
  });
  await Promise.all(writes);
}


