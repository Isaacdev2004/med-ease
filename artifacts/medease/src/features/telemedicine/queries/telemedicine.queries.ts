import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { telemedicineService } from '@/services/telemedicine/telemedicine.service';
import type { TelemedicineFilters } from '@/services/telemedicine/types';

export const telemedicineQueries = {
  dashboard: (patientId?: string, clinicianId?: string) => ({
    queryKey: queryKeys.telemedicine.dashboard(patientId, clinicianId),
    queryFn: () => telemedicineService.getDashboard(patientId, clinicianId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  sessions: (filters?: TelemedicineFilters) => ({
    queryKey: queryKeys.telemedicine.sessions(filters as Record<string, unknown> | undefined),
    queryFn: () => telemedicineService.searchSessions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  session: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.session(sessionId),
    queryFn: () => telemedicineService.getSession(sessionId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(sessionId),
  }),
  participants: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.participants(sessionId),
    queryFn: () => telemedicineService.getParticipants(sessionId),
    staleTime: CACHE_TIMES.patientTimeline,
    enabled: Boolean(sessionId),
  }),
  messages: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.messages(sessionId),
    queryFn: () => telemedicineService.getMessages(sessionId),
    staleTime: CACHE_TIMES.patientTimeline,
    enabled: Boolean(sessionId),
  }),
  waitingRoom: (sessionId?: string) => ({
    queryKey: queryKeys.telemedicine.waitingRoom(sessionId),
    queryFn: () => telemedicineService.getWaitingRoom(sessionId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  recordings: (sessionId?: string) => ({
    queryKey: queryKeys.telemedicine.recordings(sessionId),
    queryFn: () => telemedicineService.getRecordings(sessionId),
    staleTime: CACHE_TIMES.patientList,
  }),
  clinicalNotes: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.clinicalNotes(sessionId),
    queryFn: () => telemedicineService.getClinicalNotes(sessionId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(sessionId),
  }),
  transcript: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.transcript(sessionId),
    queryFn: () => telemedicineService.generateTranscript(sessionId),
    staleTime: CACHE_TIMES.reference,
    enabled: Boolean(sessionId),
  }),
  analytics: () => ({
    queryKey: queryKeys.telemedicine.analytics(),
    queryFn: () => telemedicineService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  providerAvailability: () => ({
    queryKey: queryKeys.telemedicine.providerAvailability(),
    queryFn: () => telemedicineService.getProviderAvailability(),
    staleTime: CACHE_TIMES.patientList,
  }),
  deviceCheck: (sessionId?: string) => ({
    queryKey: queryKeys.telemedicine.deviceCheck(sessionId),
    queryFn: () => telemedicineService.runDeviceCheck(sessionId),
    staleTime: CACHE_TIMES.default,
  }),
  bandwidth: () => ({
    queryKey: queryKeys.telemedicine.bandwidth(),
    queryFn: () => telemedicineService.runDeviceCheck(),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  timeline: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.timeline(sessionId),
    queryFn: () => telemedicineService.getTimeline(sessionId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(sessionId),
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.telemedicine.search(query, patientId),
    queryFn: () => telemedicineService.search(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  attachments: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.attachments(sessionId),
    queryFn: () => telemedicineService.getAttachments(sessionId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(sessionId),
  }),
  whiteboard: (sessionId: string) => ({
    queryKey: queryKeys.telemedicine.whiteboard(sessionId),
    queryFn: () => telemedicineService.getWhiteboard(sessionId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(sessionId),
  }),
};
