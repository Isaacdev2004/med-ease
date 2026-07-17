import type { WhiteboardSession } from '@/services/telemedicine/types';

export function createWhiteboard(
  sessionId: string,
  createdBy: string,
): WhiteboardSession {
  return {
    id: `wb-${Date.now()}`,
    sessionId,
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strokeCount: 0,
  };
}

export function exportWhiteboard(
  session: WhiteboardSession,
  format: 'png' | 'pdf',
) {
  return {
    ...session,
    exportedUrl: `/mock/whiteboard/${session.id}.${format}`,
  };
}
