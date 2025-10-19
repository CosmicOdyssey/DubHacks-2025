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

export function mapJira(payload: any): { events: EventOut[]; incident?: { incidentId: string; responders: string[]; linkedMilestoneEventId?: string; phi: number } } {
  const events: EventOut[] = [];
  const issue = payload?.issue;
  const change = payload?.changelog;
  const repo = 'jira';
  const issueKey = issue?.key || '';
  const issueType = (issue?.fields?.issuetype?.name || '').toLowerCase();
  const user = payload?.user?.accountId || payload?.user?.name || 'unknown';
  const ts = new Date(payload?.timestamp || Date.now());
  const prov = { provider: 'jira', webhookEvent: payload?.webhookEvent, issueKey };

  if (payload?.webhookEvent === 'jira:issue_updated' && change) {
    const statusTo = change.items?.find((i: any) => i.field === 'status')?.toString?.toLowerCase?.();
    if (statusTo && (statusTo.includes('done') || statusTo.includes('resolved'))) {
      if (issueType.includes('bug') || issueType.includes('incident')) {
        // Incident fix event
        events.push({ eventId: randomUUID(), contributorId: user, repo, type: 'incident_fix', ts, tags: [], issueKeys: [issueKey], rawFeatures: { value: 1 }, provenance: prov });
        return { events, incident: { incidentId: issueKey, responders: [user], phi: 0.3 } };
      }
    }
  }
  return { events };
}


