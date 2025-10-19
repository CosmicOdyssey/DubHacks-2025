import prisma from '../db/client';
import { halfLifeDecayFactor } from '../lib/math';

export async function updateContributorState(epochId: string, halfLifeWeeks: number): Promise<void> {
  // Group scored events by contributor
  const scored = await prisma.scoresEvent.findMany({ include: { event: true } });
  const byContributor: Record<string, { toMB: number; toMF: number }> = {};
  for (const s of scored) {
    const cid = s.event.contributorId;
    byContributor[cid] ||= { toMB: 0, toMF: 0 };
    byContributor[cid].toMB += s.toMB;
    byContributor[cid].toMF += s.toMF;
  }
  for (const [contributorId, deltas] of Object.entries(byContributor)) {
    const cur = await prisma.contributorsState.findUnique({ where: { contributorId } });
    const lastEpoch = cur?.mfLastDecayEpoch ? Number(cur.mfLastDecayEpoch) : undefined;
    const deltaEpochs = lastEpoch !== undefined ? Math.max(0, Number(epochId) - lastEpoch) : 0;
    const lambda = halfLifeDecayFactor(deltaEpochs, halfLifeWeeks);
    const mfDecayed = (cur?.mfValue ?? 0) * lambda;
    await prisma.contributorsState.upsert({
      where: { contributorId },
      create: {
        contributorId,
        mbTotal: Math.max(0, deltas.toMB),
        mfValue: Math.max(0, mfDecayed + deltas.toMF),
        mfLastDecayEpoch: epochId,
        flags: {},
        reviewerPrecision: { alpha: 3, beta: 1 },
      },
      update: {
        mbTotal: Math.max(0, (cur?.mbTotal ?? 0) + deltas.toMB),
        mfValue: Math.max(0, mfDecayed + deltas.toMF),
        mfLastDecayEpoch: epochId,
      },
    });
  }
}

export async function applyIncidentClawbacks(): Promise<void> {
  const links = await prisma.incidentsLink.findMany();
  for (const link of links) {
    const se = await prisma.scoresEvent.findUnique({ where: { eventId: link.eventIdMilestone } , include: { event: true } });
    if (!se || !se.event) continue;
    const claw = link.phi * se.betaSplit * se.iRaw;
    const cid = se.event.contributorId;
    const cur = await prisma.contributorsState.findUnique({ where: { contributorId: cid } });
    if (!cur) continue;
    await prisma.contributorsState.update({ where: { contributorId: cid }, data: { mbTotal: Math.max(0, cur.mbTotal - claw) } });
    const responders = link.responders || [];
    for (const r of responders) {
      const st = await prisma.contributorsState.findUnique({ where: { contributorId: r } });
      const newMF = (st?.mfValue ?? 0) + claw / Math.max(1, responders.length);
      await prisma.contributorsState.upsert({
        where: { contributorId: r },
        create: { contributorId: r, mbTotal: 0, mfValue: newMF, mfLastDecayEpoch: cur.mfLastDecayEpoch || null, flags: {}, reviewerPrecision: { alpha: 3, beta: 1 } },
        update: { mfValue: newMF },
      });
    }
  }
}


