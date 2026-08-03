import type { QueryParams } from '@workspace/repository-transport';
import type {
  ChatMessage,
  ClinicalNote,
  ConnectionQuality,
  MessageDeliveryStatus,
  ParticipantRole,
  ProviderAvailability,
  RecordingStatus,
  SessionAttachment,
  SessionRecording,
  SessionStatus,
  SessionTimelineEntry,
  SessionType,
  TelemedicineDashboard,
  TelemedicineFilters,
  TelemedicineSession,
  VideoParticipant,
  VideoPlatform,
  WaitingRoomEntry,
  WaitingRoomStatus,
} from '@/services/telemedicine/types';

export type SessionListResult = {
  items: TelemedicineSession[];
  total: number;
  page: number;
  pageSize: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function telemedicineFiltersToQuery(
  filters?: TelemedicineFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    clinicianId: filters.clinicianId,
    facilityId: filters.facilityId,
    status: filters.status,
    from: filters.from,
    to: filters.to,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function mapTelemedicineSession(dto: unknown): TelemedicineSession {
  const row = asRecord(dto);
  return {
    sessionId: asString(row.sessionId || row.id),
    appointmentId: asOptionalString(row.appointmentId),
    encounterId: asOptionalString(row.encounterId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    clinicianId: asString(row.clinicianId),
    clinicianName: asString(row.clinicianName),
    facilityId: asOptionalString(row.facilityId),
    meetingNumber: asString(row.meetingNumber),
    meetingPassword: asOptionalString(row.meetingPassword),
    platform: asString(row.platform, 'webrtc') as VideoPlatform,
    roomId: asString(row.roomId),
    sessionType: asString(row.sessionType, 'consultation') as SessionType,
    specialty: asString(row.specialty),
    scheduledStart: asString(row.scheduledStart),
    scheduledEnd: asString(row.scheduledEnd),
    actualStart: asOptionalString(row.actualStart),
    actualEnd: asOptionalString(row.actualEnd),
    duration: asOptionalNumber(row.duration ?? row.durationMinutes),
    timezone: asString(row.timezone, 'UTC'),
    language: asString(row.language, 'en'),
    interpreterRequired: asBoolean(row.interpreterRequired),
    status: asString(row.status, 'scheduled') as SessionStatus,
    recordingStatus: asString(
      row.recordingStatus,
      'none',
    ) as RecordingStatus,
    waitingRoomEnabled: asBoolean(row.waitingRoomEnabled, true),
    encryption: asBoolean(row.encryption, true),
    qualityScore: asOptionalNumber(row.qualityScore),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapTelemedicineSessionArray(
  dto: unknown,
): TelemedicineSession[] {
  return Array.isArray(dto) ? dto.map(mapTelemedicineSession) : [];
}

export function mapPaginatedSessions(dto: unknown): SessionListResult {
  const row = asRecord(dto);
  return {
    items: mapTelemedicineSessionArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapVideoParticipant(dto: unknown): VideoParticipant {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    name: asString(row.name),
    role: asString(row.role, 'patient') as ParticipantRole,
    joinedAt: asOptionalString(row.joinedAt),
    leftAt: asOptionalString(row.leftAt),
    cameraOn: asBoolean(row.cameraOn),
    microphoneOn: asBoolean(row.microphoneOn),
    screenSharing: asBoolean(row.screenSharing),
    connectionQuality: asString(
      row.connectionQuality,
      'good',
    ) as ConnectionQuality,
    deviceType: asString(row.deviceType),
    browser: asString(row.browser),
    networkType: asString(row.networkType),
    permissions: asStringArray(row.permissions),
  };
}

export function mapVideoParticipantArray(dto: unknown): VideoParticipant[] {
  return Array.isArray(dto) ? dto.map(mapVideoParticipant) : [];
}

export function mapChatMessage(dto: unknown): ChatMessage {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    senderId: asString(row.senderId),
    senderName: asString(row.senderName),
    receiverId: asOptionalString(row.receiverId),
    content: asString(row.content),
    sentAt: asString(row.sentAt),
    deliveryStatus: asString(
      row.deliveryStatus,
      'sent',
    ) as MessageDeliveryStatus,
    readAt: asOptionalString(row.readAt),
    pinned: asBoolean(row.pinned),
  };
}

export function mapChatMessageArray(dto: unknown): ChatMessage[] {
  return Array.isArray(dto) ? dto.map(mapChatMessage) : [];
}

export function mapClinicalNote(dto: unknown): ClinicalNote {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    patientId: asString(row.patientId),
    clinicianId: asString(row.clinicianId),
    subjective: asString(row.subjective),
    objective: asString(row.objective),
    assessment: asString(row.assessment),
    plan: asString(row.plan),
    diagnosis: asOptionalString(row.diagnosis),
    treatment: asOptionalString(row.treatment),
    recommendations: asOptionalString(row.recommendations),
    followUp: asOptionalString(row.followUp),
    status: asString(row.status, 'draft') as ClinicalNote['status'],
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapClinicalNoteArray(dto: unknown): ClinicalNote[] {
  return Array.isArray(dto) ? dto.map(mapClinicalNote) : [];
}

export function mapWaitingRoomEntry(dto: unknown): WaitingRoomEntry {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    status: asString(row.status, 'waiting') as WaitingRoomStatus,
    joinedAt: asString(row.joinedAt),
    admittedAt: asOptionalString(row.admittedAt),
    estimatedWaitMinutes: asNumber(row.estimatedWaitMinutes, 5),
    priority: asString(row.priority, 'normal') as WaitingRoomEntry['priority'],
  };
}

export function mapWaitingRoomEntryArray(dto: unknown): WaitingRoomEntry[] {
  return Array.isArray(dto) ? dto.map(mapWaitingRoomEntry) : [];
}

export function mapSessionRecording(dto: unknown): SessionRecording {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    consentGiven: asBoolean(row.consentGiven),
    status: asString(row.status, 'none') as RecordingStatus,
    durationSeconds: asOptionalNumber(row.durationSeconds),
    storageUrl: asOptionalString(row.storageUrl),
    retentionDays: asNumber(row.retentionDays, 30),
    transcription: asOptionalString(row.transcription),
    startedAt: asOptionalString(row.startedAt),
    stoppedAt: asOptionalString(row.stoppedAt),
  };
}

export function mapSessionRecordingArray(dto: unknown): SessionRecording[] {
  return Array.isArray(dto) ? dto.map(mapSessionRecording) : [];
}

export function mapSessionTimelineEntry(dto: unknown): SessionTimelineEntry {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    date: asString(row.date),
    type: asString(row.type, 'join') as SessionTimelineEntry['type'],
    title: asString(row.title),
    description: asString(row.description),
    actor: asOptionalString(row.actor),
  };
}

export function mapSessionTimelineEntryArray(
  dto: unknown,
): SessionTimelineEntry[] {
  return Array.isArray(dto) ? dto.map(mapSessionTimelineEntry) : [];
}

export function mapProviderAvailability(dto: unknown): ProviderAvailability {
  const row = asRecord(dto);
  const slots = Array.isArray(row.availableSlots) ? row.availableSlots : [];
  return {
    providerId: asString(row.providerId),
    providerName: asString(row.providerName),
    specialty: asString(row.specialty),
    availableSlots: slots.map((s) => {
      const slot = asRecord(s);
      return {
        start: asString(slot.start),
        end: asString(slot.end),
      };
    }),
    telemedicineEnabled: asBoolean(row.telemedicineEnabled, true),
  };
}

export function mapProviderAvailabilityArray(
  dto: unknown,
): ProviderAvailability[] {
  return Array.isArray(dto) ? dto.map(mapProviderAvailability) : [];
}

export function mapTelemedicineDashboard(dto: unknown): TelemedicineDashboard {
  const row = asRecord(dto);
  return {
    upcomingSessions: asNumber(row.upcomingSessions),
    activeSessions: asNumber(row.activeSessions),
    completedToday: asNumber(row.completedToday),
    waitingRoomCount: asNumber(row.waitingRoomCount),
    averageQuality: asNumber(row.averageQuality),
    recentSessions: mapTelemedicineSessionArray(row.recentSessions),
  };
}

export function mapSessionAttachment(dto: unknown): SessionAttachment {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    sessionId: asString(row.sessionId),
    name: asString(row.name),
    type: asString(row.type, 'document') as SessionAttachment['type'],
    mimeType: asString(row.mimeType),
    sizeBytes: asNumber(row.sizeBytes),
    uploadedBy: asString(row.uploadedBy),
    uploadedAt: asString(row.uploadedAt),
    url: asString(row.url),
  };
}
