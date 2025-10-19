import prisma from '../db/client';
import { epochDilutionFraction, piecewiseDeadband } from '../lib/math';

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

export async function runIssuer(params: {
  epochId: string;
  alpha: number;
  dilutionPerYear: number;
  gate: { deadband: [number, number]; slope_pos: number; slope_neg: number; ema_window?: number };
  weeksPerEpoch: number;
  policyHash: string;
}): Promise<void> {
  const { epochId, alpha, dilutionPerYear, gate, weeksPerEpoch, policyHash } = params;
  const prev = await prisma.epochState.findMany({ orderBy: { tEnd: 'desc' }, take: 1 });
  const S_prev = prev[0]?.sCirculating ?? 0;
  // Placeholder KPI
  const KPI_prev = { value: 1 } as any;
  const KPI_curr = { value: 1 } as any;
  const deltaK = { value: 0 } as any; // TODO: compute from KPI inputs
  const g = Math.max(0, 1 + piecewiseDeadband(deltaK.value || 0, gate.deadband, gate.slope_pos, gate.slope_neg));
  const dep = epochDilutionFraction(dilutionPerYear, weeksPerEpoch);
  const E_t = dep * S_prev * g;
  const E_MB = alpha * E_t;
  const E_MF = (1 - alpha) * E_t;

  const states = await prisma.contributorsState.findMany();
  const sumMB = states.reduce((a, s) => a + Math.max(0, s.mbTotal), 0);
  const sumMF = states.reduce((a, s) => a + Math.max(0, s.mfValue), 0);
  const payoutsRaw = states.map(s => {
    const wMB = sumMB > 0 ? s.mbTotal / sumMB : 0;
    const wMF = sumMF > 0 ? s.mfValue / sumMF : 0;
    const P_MB = E_MB * wMB;
    const P_MF = E_MF * wMF;
    const P_total = P_MB + P_MF;
    return { contributorId: s.contributorId, wMB, wMF, P_MB, P_MF, P_total };
  });
  const med = median(payoutsRaw.map(p => p.P_total));
  const capMultiple = 5;

  for (const p of payoutsRaw) {
    const cap = capMultiple * med;
    const capped = Math.min(p.P_total, cap);
    const carry = p.P_total > cap ? p.P_total - cap : 0;
    await prisma.payout.upsert({
      where: { epochId_contributorId: { epochId, contributorId: p.contributorId } },
      create: { epochId, contributorId: p.contributorId, wMB: p.wMB, wMF: p.wMF, pMB: p.P_MB, pMF: p.P_MF, pTotal: capped, capsApplied: carry > 0, carryover: carry },
      update: { wMB: p.wMB, wMF: p.wMF, pMB: p.P_MB, pMF: p.P_MF, pTotal: capped, capsApplied: carry > 0, carryover: carry },
    });
  }

  await prisma.epochState.upsert({
    where: { epochId },
    create: {
      epochId,
      tStart: new Date(),
      tEnd: new Date(),
      policyHash,
      sCirculating: S_prev + E_t,
      kpiPrev: KPI_prev,
      kpiCurr: KPI_curr,
      deltaK,
      gateValue: g,
      eT: E_t,
      alpha,
      beta: 0.6,
      tauWeeks: 7,
      rho: 0.5,
      extras: {},
    },
    update: {
      tEnd: new Date(),
      sCirculating: S_prev + E_t,
      kpiPrev: KPI_prev,
      kpiCurr: KPI_curr,
      deltaK,
      gateValue: g,
      eT: E_t,
    },
  });
}

export async function simulateIssuer(params: {
  alpha: number;
  dilutionPerYear: number;
  gate: { deadband: [number, number]; slope_pos: number; slope_neg: number };
  weeksPerEpoch: number;
}): Promise<{ E_t: number; E_MB: number; E_MF: number; payouts: Array<{ contributorId: string; P_total: number }> }> {
  const { alpha, dilutionPerYear, gate, weeksPerEpoch } = params;
  const prev = await prisma.epochState.findMany({ orderBy: { tEnd: 'desc' }, take: 1 });
  const S_prev = prev[0]?.sCirculating ?? 0;
  const delta = 0;
  const g = Math.max(0, 1 + piecewiseDeadband(delta, gate.deadband, gate.slope_pos, gate.slope_neg));
  const dep = epochDilutionFraction(dilutionPerYear, weeksPerEpoch);
  const E_t = dep * S_prev * g;
  const E_MB = alpha * E_t;
  const E_MF = (1 - alpha) * E_t;
  const states = await prisma.contributorsState.findMany();
  const sumMB = states.reduce((a, s) => a + Math.max(0, s.mbTotal), 0);
  const sumMF = states.reduce((a, s) => a + Math.max(0, s.mfValue), 0);
  const payouts = states.map(s => {
    const wMB = sumMB > 0 ? s.mbTotal / sumMB : 0;
    const wMF = sumMF > 0 ? s.mfValue / sumMF : 0;
    const P_total = E_MB * wMB + E_MF * wMF;
    return { contributorId: s.contributorId, P_total };
  });
  return { E_t, E_MB, E_MF, payouts };
}


