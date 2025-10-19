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

export function mapGitHub(payload: any): EventOut[] {
  const events: EventOut[] = [];
  const repo = payload?.repository?.full_name || 'unknown';
  const commonProv = { provider: 'github', delivery: payload?.delivery_id };

  if (payload?.pull_request) {
    const pr = payload.pull_request;
    const prId = String(pr.id);
    const contributorId = pr.user?.login || 'unknown';
    const ts = new Date(pr.merged_at || pr.updated_at || pr.created_at || Date.now());
    const issueKeys = extractIssueKeys(pr.title + ' ' + (pr.body || ''));
    const features = { tests_passed: pr.mergeable_state === 'clean' ? 1 : 0, size: pr.additions + pr.deletions };
    const type = pr.merged ? 'merge' : 'commit';
    events.push({ eventId: randomUUID(), contributorId, repo, type, ts, tags: [], issueKeys, prId, isMilestone: false, rawFeatures: features, provenance: { ...commonProv, pr: prId } });
  }

  if (payload?.review) {
    const review = payload.review;
    const contributorId = review.user?.login || 'unknown';
    const prId = String(payload.pull_request?.id || '');
    const ts = new Date(review.submitted_at || Date.now());
    const issueKeys: string[] = [];
    events.push({ eventId: randomUUID(), contributorId, repo, type: 'review', ts, tags: [], issueKeys, prId, rawFeatures: { value: 1 }, provenance: { ...commonProv, review: review.id } });
  }

  return events;
}

function extractIssueKeys(text: string): string[] {
  const matches = text.match(/[A-Z][A-Z0-9]+-\d+/g);
  return matches ? Array.from(new Set(matches)) : [];
}


