import { useQuery } from '@tanstack/react-query';

import { telemedicineQueries } from '@/features/telemedicine/queries/telemedicine.queries';
import { useAuth } from '@/services/auth/auth-context';
import { telemedicineService } from '@/services/telemedicine/telemedicine.service';
import type { TelemedicineFilters } from '@/services/telemedicine/types';

export function useTelemedicineContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['telemedicine', 'context', user?.id],
    queryFn: () => telemedicineService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function useTelemedicineDashboard(
  patientId?: string,
  clinicianId?: string,
) {
  return useQuery(telemedicineQueries.dashboard(patientId, clinicianId));
}

export function useSessions(filters?: TelemedicineFilters) {
  return useQuery(telemedicineQueries.sessions(filters));
}

export function useSession(sessionId: string) {
  return useQuery(telemedicineQueries.session(sessionId));
}

export function useCurrentSession(sessionId?: string) {
  return useQuery(telemedicineQueries.session(sessionId ?? ''));
}

export function useParticipants(sessionId?: string) {
  return useQuery(telemedicineQueries.participants(sessionId ?? ''));
}

export function useChat(sessionId?: string) {
  return useQuery(telemedicineQueries.messages(sessionId ?? ''));
}

export function useMessages(sessionId?: string) {
  return useChat(sessionId);
}

export function useWaitingRoom(sessionId?: string) {
  return useQuery(telemedicineQueries.waitingRoom(sessionId));
}

export function useRecordings(sessionId?: string) {
  return useQuery(telemedicineQueries.recordings(sessionId));
}

export function useClinicalNotes(sessionId?: string) {
  return useQuery(telemedicineQueries.clinicalNotes(sessionId ?? ''));
}

export function useSessionTranscript(sessionId?: string) {
  return useQuery(telemedicineQueries.transcript(sessionId ?? ''));
}

export function useTelemedicineAnalytics() {
  return useQuery(telemedicineQueries.analytics());
}

export function useProviderAvailability() {
  return useQuery(telemedicineQueries.providerAvailability());
}

export function useDeviceCheck(sessionId?: string) {
  return useQuery(telemedicineQueries.deviceCheck(sessionId));
}

export function useBandwidth() {
  return useQuery(telemedicineQueries.bandwidth());
}

export function useTelemedicineSearch(query: string, patientId?: string) {
  return useQuery(telemedicineQueries.search(query, patientId));
}

export function useSessionTimeline(sessionId?: string) {
  return useQuery(telemedicineQueries.timeline(sessionId ?? ''));
}

export function useSessionAttachments(sessionId?: string) {
  return useQuery(telemedicineQueries.attachments(sessionId ?? ''));
}

export function useWhiteboard(sessionId?: string) {
  return useQuery(telemedicineQueries.whiteboard(sessionId ?? ''));
}
