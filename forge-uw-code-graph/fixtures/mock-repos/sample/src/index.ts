import { scheduleCleanup } from './scheduler';
import { ApiClient } from './lib/api-client';

export async function bootstrapApp() {
  const client = new ApiClient();
  const data = await client.fetchStudentRecords();
  scheduleCleanup(data.length);
  return data;
}

export function computeScore(records: Array<{ score: number }>) {
  return records.reduce((sum, record) => sum + record.score, 0);
}
