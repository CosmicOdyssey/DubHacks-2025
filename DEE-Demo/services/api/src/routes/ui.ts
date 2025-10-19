import { Router } from 'express';
import prisma from '../db/client';

const router = Router();

router.get('/contributors/:id/equity', async (req, res) => {
  const { id } = req.params;
  const state = await prisma.contributorsState.findUnique({ where: { contributorId: id } });
  if (!state) return res.status(404).json({ error: 'not found' });
  res.json({ contributorId: id, MB_total: state.mbTotal, MF_value: state.mfValue });
});

router.get('/payouts', async (req, res) => {
  const { epoch } = req.query as { epoch?: string };
  const where = epoch ? { epochId: String(epoch) } : {};
  const payouts = await prisma.payout.findMany({ where, take: 200, orderBy: { epochId: 'desc' } });
  res.json(payouts);
});

router.get('/issues/:key/feed', async (req, res) => {
  const { key } = req.params;
  const events = await prisma.event.findMany({ where: { issueKeys: { has: key } }, orderBy: { ts: 'desc' }, take: 100, include: { score: true } });
  res.json(events);
});

router.get('/artifacts/graph', async (_req, res) => {
  // Placeholder: return an empty graph structure compatible with front-end
  res.json({ nodes: [], edges: [] });
});

router.get('/contributors', async (req, res) => {
  const limit = Math.max(1, Math.min(200, Number((req.query as any).limit) || 50));
  const rows = await prisma.contributorsState.findMany({ take: 1000 });
  const enriched = rows.map(r => ({ contributorId: r.contributorId, MB_total: r.mbTotal, MF_value: r.mfValue, equity: r.mbTotal + r.mfValue }))
    .sort((a, b) => b.equity - a.equity)
    .slice(0, limit);
  res.json(enriched);
});

router.get('/events', async (req, res) => {
  const limit = Math.max(1, Math.min(500, Number((req.query as any).limit) || 200));
  const events = await prisma.event.findMany({ orderBy: { ts: 'desc' }, take: limit, include: { score: true } });
  res.json(events);
});

router.get('/epochs', async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number((req.query as any).limit) || 20));
  const epochs = await prisma.epochState.findMany({ orderBy: { tEnd: 'desc' }, take: limit });
  res.json(epochs);
});

router.get('/summary', async (_req, res) => {
  const states = await prisma.contributorsState.findMany();
  const sumMB = states.reduce((a, s) => a + Math.max(0, s.mbTotal), 0);
  const sumMF = states.reduce((a, s) => a + Math.max(0, s.mfValue), 0);
  const contributors = states.length;
  const lastEpoch = (await prisma.epochState.findMany({ orderBy: { tEnd: 'desc' }, take: 1 }))[0];
  const lastPayouts = lastEpoch ? await prisma.payout.findMany({ where: { epochId: lastEpoch.epochId } }) : [];
  const median = lastPayouts.length ? [...lastPayouts.map(p => p.pTotal)].sort((a, b) => a - b)[Math.floor(lastPayouts.length / 2)] : 0;
  res.json({ sumMB, sumMF, contributors, lastEpoch, medianPayout: median });
});

router.get('/contributors/:id/feed', async (req, res) => {
  const { id } = req.params;
  const events = await prisma.event.findMany({ where: { contributorId: id }, orderBy: { ts: 'desc' }, take: 100, include: { score: true } });
  res.json(events);
});

export default router;


