import { Router } from 'express';
import prisma from '../db/client';
import { config } from '../config';
import { verifyGitHubSignature } from '../lib/signatures';
import { mapGitHub } from '../mappers/github';
import { mapGitLab } from '../mappers/gitlab';
import { putJson } from '../lib/s3';
import { mapBitbucket } from '../mappers/bitbucket';
import { mapJira } from '../mappers/jira';
import { mapCI } from '../mappers/ci';

const router = Router();

router.post('/github', async (req, res) => {
  const sig = req.get('X-Hub-Signature-256') || req.get('x-hub-signature-256');
  const secret = config.githubWebhookSecret || '';
  const raw = (req as any).rawBody as Buffer;
  if (secret && !verifyGitHubSignature(secret, raw, sig)) {
    return res.status(401).json({ error: 'invalid signature' });
  }
  const payload = req.body;
  await putJson(`webhooks/github/${Date.now()}.json`, payload);
  if (payload?.zen || payload?.hook) return res.json({ ok: true });
  const mapped = mapGitHub(payload);
  for (const e of mapped) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      create: {
        eventId: e.eventId,
        contributorId: e.contributorId,
        repo: e.repo,
        type: e.type as any,
        ts: e.ts,
        tags: e.tags,
        issueKeys: e.issueKeys,
        prId: e.prId,
        isMilestone: Boolean(e.isMilestone),
        rawFeatures: e.rawFeatures,
        provenance: e.provenance,
      },
      update: {},
    });
  }
  res.json({ received: true, inserted: mapped.length });
});

router.post('/bitbucket', async (req, res) => {
  const payload = req.body;
  await putJson(`webhooks/bitbucket/${Date.now()}.json`, payload);
  const mapped = mapBitbucket(payload);
  for (const e of mapped) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      create: { eventId: e.eventId, contributorId: e.contributorId, repo: e.repo, type: e.type as any, ts: e.ts, tags: e.tags, issueKeys: e.issueKeys, prId: e.prId, isMilestone: Boolean(e.isMilestone), rawFeatures: e.rawFeatures, provenance: e.provenance },
      update: {},
    });
  }
  res.json({ received: true, inserted: mapped.length });
});

router.post('/ci', async (req, res) => {
  const payload = req.body;
  await putJson(`webhooks/ci/${Date.now()}.json`, payload);
  const mapped = mapCI(payload);
  for (const e of mapped) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      create: { eventId: e.eventId, contributorId: e.contributorId, repo: e.repo, type: e.type as any, ts: e.ts, tags: e.tags, issueKeys: e.issueKeys, prId: e.prId, isMilestone: false, rawFeatures: e.rawFeatures, provenance: e.provenance },
      update: {},
    });
  }
  res.json({ received: true, inserted: mapped.length });
});

router.post('/jira', async (req, res) => {
  const payload = req.body;
  await putJson(`webhooks/jira/${Date.now()}.json`, payload);
  const { events, incident } = mapJira(payload);
  for (const e of events) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      create: { eventId: e.eventId, contributorId: e.contributorId, repo: e.repo, type: e.type as any, ts: e.ts, tags: e.tags, issueKeys: e.issueKeys, prId: e.prId, isMilestone: Boolean(e.isMilestone), rawFeatures: e.rawFeatures, provenance: e.provenance },
      update: {},
    });
  }
  if (incident) {
    await prisma.incidentsLink.upsert({
      where: { incidentId_eventIdMilestone: { incidentId: incident.incidentId, eventIdMilestone: incident.linkedMilestoneEventId || 'pending' } },
      create: { incidentId: incident.incidentId, eventIdMilestone: incident.linkedMilestoneEventId || 'pending', phi: incident.phi, responders: incident.responders },
      update: { phi: incident.phi, responders: incident.responders },
    });
  }
  res.json({ received: true, inserted: events.length, incident: Boolean(incident) });
});

router.post('/gitlab', async (req, res) => {
  const payload = req.body;
  await putJson(`webhooks/gitlab/${Date.now()}.json`, payload);
  const mapped = mapGitLab(payload);
  for (const e of mapped) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      create: {
        eventId: e.eventId,
        contributorId: e.contributorId,
        repo: e.repo,
        type: e.type as any,
        ts: e.ts,
        tags: e.tags,
        issueKeys: e.issueKeys,
        prId: e.prId,
        isMilestone: Boolean(e.isMilestone),
        rawFeatures: e.rawFeatures,
        provenance: e.provenance,
      },
      update: {},
    });
  }
  res.json({ received: true, inserted: mapped.length });
});

export default router;


