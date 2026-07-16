import type { WaitingRoomEntry } from '@/services/telemedicine/types';

export function admitPatient(entry: WaitingRoomEntry): WaitingRoomEntry {
  return { ...entry, status: 'admitted', admittedAt: new Date().toISOString(), estimatedWaitMinutes: 0 };
}

export function rejectPatient(entry: WaitingRoomEntry): WaitingRoomEntry {
  return { ...entry, status: 'rejected' };
}

export function sortWaitingQueue(entries: WaitingRoomEntry[]) {
  const priority = { urgent: 0, high: 1, normal: 2 };
  return [...entries].sort((a, b) => {
    const p = priority[a.priority] - priority[b.priority];
    if (p !== 0) return p;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });
}

export function estimateWait(position: number) {
  return Math.max(1, position * 5);
}
