import { randomUUID } from 'crypto';

type EventOut = {
  eventId: string;
  contributorId: string;
  repo: string;
  type: 'commit'|'merge'|'review'|'doc'|'deploy'|'incident_fix';
  ts: Date;
  tags: string[];
  issueKeys: string[];
  prId?: string;
  isMilestone?: boolean;
  rawFeatures: Record<string, unknown>;
  provenance: Record<string, unknown>;
};

export function mapBitbucket(payload: any): EventOut[] {
  const events: EventOut[] = [];
  const repo = payload?.repository?.full_name || payload?.repository?.name || 'unknown';
  const commonProv = { provider: 'bitbucket', event: payload?.event_key };

  if (payload?.pullrequest) {
    const pr = payload.pullrequest;
    const prId = String(pr.id);
    const contributorId = pr.author?.nickname || pr.author?.display_name || 'unknown';
    const ts = new Date(pr.updated_on || pr.created_on || Date.now());
    const issueKeys = extractIssueKeys(pr.title + ' ' + (pr.description || ''));
    const features = { tests_passed: 1, size: (pr?.source?.commit?.summary?.raw?.length || 0) };
    const type = pr.state === 'MERGED' ? 'merge' : 'commit';
    events.push({ eventId: randomUUID(), contributorId, repo, type, ts, tags: [], issueKeys, prId, isMilestone: false, rawFeatures: features, provenance: { ...commonProv, pr: prId } });
  }

  if (payload?.approval) {
    const review = payload.approval;
    const contributorId = review.user?.nickname || 'unknown';
    const prId = String(payload.pullrequest?.id || '');
    const ts = new Date(review.date || Date.now());
    const issueKeys: string[] = [];
    events.push({ eventId: randomUUID(), contributorId, repo, type: 'review', ts, tags: [], issueKeys, prId, rawFeatures: { value: 1 }, provenance: { ...commonProv, review: review.date } });
  }

  return events;
}

function extractIssueKeys(text: string): string[] {
  const matches = text.match(/[A-Z][A-Z0-9]+-\d+/g);
  return matches ? Array.from(new Set(matches)) : [];
}


