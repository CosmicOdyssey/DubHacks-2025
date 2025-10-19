import { Router } from 'express';
import { runEpoch } from '../services/orchestrator';
import prisma from '../db/client';
import { parsePolicy } from '../lib/policy';

const router = Router();

router.post('/run-epoch', async (req, res) => {
  const { epochId } = req.body as { epochId: string };
  if (!epochId) return res.status(400).json({ error: 'epochId required' });
  const pv = await prisma.policyVersion.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
  if (pv.length === 0) return res.status(400).json({ error: 'no policy' });
  const policy = parsePolicy(pv[0].yaml);
  await runEpoch(epochId, policy as any);
  res.json({ ok: true, epochId });
});

export default router;


