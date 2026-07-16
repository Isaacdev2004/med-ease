export function notifySyncComplete(endpointName: string) {
  return { type: 'interop_sync' as const, title: 'Sync complete', body: `${endpointName} synchronization finished` };
}

export function notifyJobFailed(jobName: string) {
  return { type: 'interop_job_failed' as const, title: 'Integration job failed', body: jobName };
}
