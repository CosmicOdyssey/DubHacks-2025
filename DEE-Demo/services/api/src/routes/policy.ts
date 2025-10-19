import { Router } from 'express';
import prisma from '../db/client';
import { canonicalizeYaml, policyHash, parsePolicy } from '../lib/policy';

const router = Router();

router.get('/', async (_req, res) => {
  const pv = await prisma.policyVersion.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
  if (pv.length === 0) return res.status(404).json({ error: 'no policy' });
  res.json(pv[0]);
});

router.post('/', async (req, res) => {
  const { yaml, notes } = req.body as { yaml: string; notes?: string };
  if (!yaml) return res.status(400).json({ error: 'yaml required' });
  const canonical = canonicalizeYaml(yaml);
  const hash = policyHash(canonical);
  // Validate parse
  parsePolicy(canonical);
  const created = await prisma.policyVersion.upsert({
    where: { hash },
    create: { hash, yaml: canonical, notes },
    update: { yaml: canonical, notes },
  });
  res.json(created);
});

router.get('/history', async (_req, res) => {
  const pv = await prisma.policyVersion.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  res.json(pv);
});

router.post('/dry-run', async (req, res) => {
  const { alpha, dilution_per_year, deadband, slope_pos, slope_neg } = req.body as any;
  const a = typeof alpha === 'number' ? alpha : 0.6;
  const dpy = typeof dilution_per_year === 'number' ? dilution_per_year : 0.12;
  const gate = { deadband: (deadband || [-0.01, 0.01]) as [number, number], slope_pos: slope_pos ?? 1.0, slope_neg: slope_neg ?? 0.5 };
  const { simulateIssuer } = await import('../services/issuer');
  const sim = await simulateIssuer({ alpha: a, dilutionPerYear: dpy, gate, weeksPerEpoch: 1 });
  res.json(sim);
});

export default router;


