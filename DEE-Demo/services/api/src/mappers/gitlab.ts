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

export function mapGitLab(payload: any): EventOut[] {
  const events: EventOut[] = [];
  const repo = payload?.project?.path_with_namespace || payload?.repository?.full_name || 'unknown';
  const commonProv = { provider: 'gitlab', event: payload?.object_kind };

  // Handle merge request events
  if (payload?.object_kind === 'merge_request') {
    const mr = payload.object_attributes;
    const prId = String(mr.id || mr.iid);
    const contributorId = mr.author_id || payload.user?.username || 'unknown';
    const ts = new Date(mr.updated_at || mr.created_at || Date.now());
    const issueKeys = extractIssueKeys(mr.title + ' ' + (mr.description || ''));
    
    // Calculate features from merge request
    const additions = mr.changes_count || 0;
    const deletions = 0; // GitLab doesn't always provide this separately
    const features = { 
      tests_passed: mr.merge_status === 'can_be_merged' ? 1 : 0, 
      size: additions + deletions,
      changes_count: mr.changes_count || 0
    };
    
    const type = mr.state === 'merged' ? 'merge' : 'commit';
    events.push({
      eventId: randomUUID(),
      contributorId,
      repo,
      type,
      ts,
      tags: mr.labels?.map((l: any) => l.title || l) || [],
      issueKeys,
      prId,
      isMilestone: false,
      rawFeatures: features,
      provenance: { ...commonProv, mr: prId, action: mr.action }
    });
  }

  // Handle push events (commits)
  if (payload?.object_kind === 'push' && payload?.commits) {
    for (const commit of payload.commits) {
      const contributorId = commit.author?.email || commit.author?.name || 'unknown';
      const ts = new Date(commit.timestamp || Date.now());
      const issueKeys = extractIssueKeys(commit.message);
      
      events.push({
        eventId: randomUUID(),
        contributorId,
        repo,
        type: 'commit',
        ts,
        tags: [],
        issueKeys,
        rawFeatures: { 
          added: commit.added?.length || 0,
          modified: commit.modified?.length || 0,
          removed: commit.removed?.length || 0
        },
        provenance: { ...commonProv, commit: commit.id }
      });
    }
  }

  // Handle pipeline events (deploy)
  if (payload?.object_kind === 'pipeline') {
    const pipeline = payload.object_attributes;
    if (pipeline.status === 'success' && pipeline.ref === 'main' || pipeline.ref === 'master') {
      const contributorId = payload.user?.username || payload.commit?.author?.email || 'unknown';
      const ts = new Date(pipeline.finished_at || pipeline.created_at || Date.now());
      
      events.push({
        eventId: randomUUID(),
        contributorId,
        repo,
        type: 'deploy',
        ts,
        tags: [pipeline.ref],
        issueKeys: [],
        rawFeatures: { duration: pipeline.duration || 0, stage: 'production' },
        provenance: { ...commonProv, pipeline: pipeline.id }
      });
    }
  }

  // Handle note (comment/review) events
  if (payload?.object_kind === 'note' && payload?.merge_request) {
    const note = payload.object_attributes;
    const contributorId = note.author_id || payload.user?.username || 'unknown';
    const prId = String(payload.merge_request.id || payload.merge_request.iid);
    const ts = new Date(note.created_at || Date.now());
    
    events.push({
      eventId: randomUUID(),
      contributorId,
      repo,
      type: 'review',
      ts,
      tags: [],
      issueKeys: [],
      prId,
      rawFeatures: { value: 1, note_type: note.noteable_type },
      provenance: { ...commonProv, note: note.id }
    });
  }

  return events;
}

function extractIssueKeys(text: string): string[] {
  const matches = text.match(/[A-Z][A-Z0-9]+-\d+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

