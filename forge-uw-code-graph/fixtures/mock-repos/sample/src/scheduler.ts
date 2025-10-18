export function scheduleCleanup(count: number) {
  if (count > 100) {
    console.warn('Large dataset detected, scheduling cleanup job');
  }
}

export function calculateNextRun(windowMinutes: number) {
  return new Date(Date.now() + windowMinutes * 60000);
}
