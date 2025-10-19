import { randomUUID } from 'crypto';

type EventOut = {
  eventId: string;
  contributorId: string;
  repo: string;
  type: 'deploy';
  ts: Date;
  tags: string[];
  issueKeys: string[];
  prId?: string;
  rawFeatures: Record<string, unknown>;
  provenance: Record<string, unknown>;
};

export function mapCI(payload: any): EventOut[] {
  const events: EventOut[] = [];
  const repo = payload?.repository || payload?.repo || 'unknown';
  const actor = payload?.actor || 'ci';
  const ts = new Date(payload?.timestamp || Date.now());
  const env = payload?.environment || 'prod';
  const ok = payload?.status === 'success' || payload?.conclusion === 'success';
  if (ok) {
    events.push({ eventId: randomUUID(), contributorId: actor, repo, type: 'deploy', ts, tags: [env], issueKeys: [], rawFeatures: { env }, provenance: { provider: 'ci', runId: payload?.run_id || payload?.build_number } });
  }
  return events;
}


