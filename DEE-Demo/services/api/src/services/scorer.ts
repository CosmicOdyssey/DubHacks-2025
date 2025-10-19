import prisma from '../db/client';
import { clamp, sigmoid } from '../lib/math';

const BASE_WEIGHTS: Record<string, number> = {
  incident_fix: 1.2,
  merge: 0.3,
  review: 0.4,
  commit: 1.0,
  doc: 0.3,
  deploy: 0.2,
};

function computeB(type: string, zSize: number): number {
  const base = BASE_WEIGHTS[type] ?? 0.5;
  return base * clamp(1 + 0.2 * zSize, 0.5, 2.0);
}

function computeQ(features: any, reviewerPrecisions: number[]): number {
  const qTests = typeof features?.tests_passed === 'number' ? clamp(features.tests_passed, 0, 1) : 1;
  const sumWeighted = reviewerPrecisions.reduce((a, b) => a + b, 0);
  const qReviews = sigmoid(sumWeighted);
  const penaltyIncident = typeof features?.incident_penalty === 'number' ? clamp(features.incident_penalty, 0, 0.9) : 0;
  return qTests * qReviews * (1 - penaltyIncident);
}

function computeC(zCtxDelta: number): number {
  return clamp(1 + 0.2 * zCtxDelta, 0.5, 2.0);
}

function computeR(sigma: number, rhoMax: number): number {
  const rho = Math.min(rhoMax, 0.5);
  return 1 + rho * clamp(sigma, 0, 1);
}

function computeV(zUsageDelta?: number): number {
  if (typeof zUsageDelta !== 'number') return 1;
  return clamp(1 + 0.2 * zUsageDelta, 1, 1.5);
}

export async function scoreNewEvents(params: { beta: number; rhoMax: number }): Promise<void> {
  const { beta, rhoMax } = params;
  const events = await prisma.event.findMany({ where: { score: null } });
  for (const e of events) {
    const features = e.rawFeatures as any;
    const size = typeof features?.size === 'number' ? features.size : undefined;
    const norm = await prisma.normStats.findUnique({ where: { scopeKey: `repo::${e.repo}` } });
    const mean = (norm?.mean as any)?.size ?? 0;
    const std = (norm?.std as any)?.size ?? 1;
    const pLow = (norm?.pLow as any)?.size ?? 0;
    const pHigh = (norm?.pHigh as any)?.size ?? 0;
    const sizeWins = typeof size === 'number' ? clamp(size, pLow, pHigh) : 0;
    const zSize = std > 0 ? (sizeWins - mean) / std : 0;

    const B = computeB(e.type, zSize);
    const reviewerPrecisions: number[] = []; // TODO: look up reviewers
    const Q = computeQ(features, reviewerPrecisions);
    const zCtxDelta = typeof features?.z_ctx_delta === 'number' ? features.z_ctx_delta : 0;
    const C = computeC(zCtxDelta);
    const sigma = typeof features?.sigma === 'number' ? features.sigma : 0; // early risk proxy
    const R = computeR(sigma, rhoMax);
    const zUsage = typeof features?.z_usage_delta === 'number' ? features.z_usage_delta : undefined;
    const V = computeV(zUsage);
    const I = B * Q * C * R * V;
    const isMilestone = Boolean(e.isMilestone);
    const toMB = isMilestone ? beta * I : 0;
    const toMF = isMilestone ? (1 - beta) * I : I;
    await prisma.scoresEvent.create({
      data: {
        eventId: e.eventId,
        b: B,
        q: Q,
        c: C,
        r: R,
        v: V,
        iRaw: I,
        iNorm: I,
        betaSplit: beta,
        toMB,
        toMF,
        reasons: { B, Q, C, R, V, note: 'initial scoring' },
      },
    });
  }
}


