export async function startScreenShare(sessionId: string) {
  return { sessionId, sharing: true, startedAt: new Date().toISOString() };
}

export async function stopScreenShare(sessionId: string) {
  return { sessionId, sharing: false, stoppedAt: new Date().toISOString() };
}
