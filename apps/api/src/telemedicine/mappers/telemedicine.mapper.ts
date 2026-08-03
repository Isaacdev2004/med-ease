import type {
  AttachmentType,
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
  SessionType,
  TelemedicineSession,
  VideoParticipant,
  VideoPlatform,
  WaitingRoomEntry,
  WaitingRoomStatus,
} from '@medease/telemedicine-contract';
import type { Prisma } from '@medease/prisma';

const PROVIDER_AVAILABILITY: ProviderAvailability[] = [
  {
    providerId: '01930000-0000-7000-8000-000000000103',
    providerName: 'Dr. Emily Chen',
    specialty: 'General Practice',
    telemedicineEnabled: true,
    availableSlots: (() => {
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(9, 0, 0, 0);
      const slot2 = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
      slot2.setUTCHours(14, 0, 0, 0);
      return [
        {
          start: tomorrow.toISOString(),
          end: new Date(tomorrow.getTime() + 30 * 60 * 1000).toISOString(),
        },
        {
          start: slot2.toISOString(),
          end: new Date(slot2.getTime() + 30 * 60 * 1000).toISOString(),
        },
      ];
    })(),
  },
];

export function getProviderAvailabilityCatalog(): ProviderAvailability[] {
  return PROVIDER_AVAILABILITY;
}

export function mapSessionStatus(status: string): SessionStatus {
  switch (status) {
    case 'scheduled':
    case 'waiting':
    case 'in_progress':
    case 'completed':
    case 'cancelled':
    case 'no_show':
    case 'failed':
      return status;
    default:
      return 'scheduled';
  }
}

export function mapSessionType(value: string): SessionType {
  switch (value) {
    case 'consultation':
    case 'follow_up':
    case 'urgent':
    case 'specialist':
    case 'group':
    case 'interpreter':
      return value;
    default:
      return 'consultation';
  }
}

export function mapVideoPlatform(value: string): VideoPlatform {
  switch (value) {
    case 'webrtc':
    case 'twilio':
    case 'agora':
    case 'daily':
    case 'zoom':
    case 'teams':
      return value;
    default:
      return 'webrtc';
  }
}

export function mapRecordingStatus(status: string): RecordingStatus {
  switch (status) {
    case 'none':
    case 'pending_consent':
    case 'recording':
    case 'stopped':
    case 'processing':
    case 'available':
      return status;
    default:
      return 'none';
  }
}

export function mapParticipantRole(role: string): ParticipantRole {
  switch (role) {
    case 'patient':
    case 'clinician':
    case 'nurse':
    case 'interpreter':
    case 'caregiver':
    case 'observer':
      return role;
    default:
      return 'observer';
  }
}

export function mapConnectionQuality(value: string): ConnectionQuality {
  switch (value) {
    case 'excellent':
    case 'good':
    case 'fair':
    case 'poor':
    case 'disconnected':
      return value;
    default:
      return 'good';
  }
}

export function mapMessageDeliveryStatus(
  status: string,
): MessageDeliveryStatus {
  switch (status) {
    case 'sent':
    case 'delivered':
    case 'read':
    case 'failed':
      return status;
    default:
      return 'sent';
  }
}

export function mapAttachmentType(type: string): AttachmentType {
  switch (type) {
    case 'image':
    case 'pdf':
    case 'lab':
    case 'radiology':
    case 'prescription':
    case 'consent':
    case 'document':
      return type;
    default:
      return 'document';
  }
}

export function mapWaitingRoomStatus(status: string): WaitingRoomStatus {
  switch (status) {
    case 'waiting':
    case 'admitted':
    case 'rejected':
    case 'left':
      return status;
    default:
      return 'waiting';
  }
}

export function mapNoteStatus(
  status: string,
): ClinicalNote['status'] {
  switch (status) {
    case 'draft':
    case 'final':
    case 'signed':
      return status;
    default:
      return 'draft';
  }
}

export function mapSession(
  row: Prisma.TelemedicineSessionGetPayload<object>,
): TelemedicineSession {
  return {
    sessionId: row.id,
    appointmentId: row.appointmentId ?? undefined,
    encounterId: row.encounterId ?? undefined,
    patientId: row.patientId,
    patientName: row.patientName,
    clinicianId: row.clinicianId,
    clinicianName: row.clinicianName,
    facilityId: row.facilityId ?? undefined,
    meetingNumber: row.meetingNumber,
    meetingPassword: row.meetingPassword ?? undefined,
    platform: mapVideoPlatform(row.platform),
    roomId: row.roomId,
    sessionType: mapSessionType(row.sessionType),
    specialty: row.specialty,
    scheduledStart: row.scheduledStart.toISOString(),
    scheduledEnd: row.scheduledEnd.toISOString(),
    actualStart: row.actualStart?.toISOString(),
    actualEnd: row.actualEnd?.toISOString(),
    duration: row.durationMinutes ?? undefined,
    timezone: row.timezone,
    language: row.language,
    interpreterRequired: row.interpreterRequired,
    status: mapSessionStatus(row.status),
    recordingStatus: mapRecordingStatus(row.recordingStatus),
    waitingRoomEnabled: row.waitingRoomEnabled,
    encryption: row.encryption,
    qualityScore: row.qualityScore ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapParticipant(
  row: Prisma.SessionParticipantGetPayload<object>,
): VideoParticipant {
  return {
    id: row.id,
    sessionId: row.sessionId,
    name: row.name,
    role: mapParticipantRole(row.role),
    joinedAt: row.joinedAt?.toISOString(),
    leftAt: row.leftAt?.toISOString(),
    cameraOn: row.cameraOn,
    microphoneOn: row.microphoneOn,
    screenSharing: row.screenSharing,
    connectionQuality: mapConnectionQuality(row.connectionQuality),
    deviceType: row.deviceType,
    browser: row.browser,
    networkType: row.networkType,
    permissions: row.permissions,
  };
}

export function mapMessage(
  row: Prisma.SessionMessageGetPayload<object>,
): ChatMessage {
  return {
    id: row.id,
    sessionId: row.sessionId,
    senderId: row.senderId,
    senderName: row.senderName,
    receiverId: row.receiverId ?? undefined,
    content: row.content,
    sentAt: row.sentAt.toISOString(),
    deliveryStatus: mapMessageDeliveryStatus(row.deliveryStatus),
    readAt: row.readAt?.toISOString(),
    pinned: row.pinned,
  };
}

export function mapAttachment(
  row: Prisma.SessionAttachmentGetPayload<object>,
): SessionAttachment {
  return {
    id: row.id,
    sessionId: row.sessionId,
    name: row.name,
    type: mapAttachmentType(row.type),
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    uploadedBy: row.uploadedBy,
    uploadedAt: row.uploadedAt.toISOString(),
    url: row.url,
  };
}

export function mapRecording(
  row: Prisma.SessionRecordingGetPayload<object>,
): SessionRecording {
  return {
    id: row.id,
    sessionId: row.sessionId,
    consentGiven: row.consentGiven,
    status: mapRecordingStatus(row.status),
    durationSeconds: row.durationSeconds ?? undefined,
    storageUrl: row.storageUrl ?? undefined,
    retentionDays: row.retentionDays,
    transcription: row.transcription ?? undefined,
    startedAt: row.startedAt?.toISOString(),
    stoppedAt: row.stoppedAt?.toISOString(),
  };
}

export function mapWaitingEntry(
  row: Prisma.WaitingRoomEntryGetPayload<object>,
): WaitingRoomEntry {
  return {
    id: row.id,
    sessionId: row.sessionId,
    patientId: row.patientId,
    patientName: row.patientName,
    status: mapWaitingRoomStatus(row.status),
    joinedAt: row.joinedAt.toISOString(),
    admittedAt: row.admittedAt?.toISOString(),
    estimatedWaitMinutes: row.estimatedWaitMinutes,
    priority:
      row.priority === 'urgent' || row.priority === 'high'
        ? row.priority
        : 'normal',
  };
}

export function mapClinicalNote(
  row: Prisma.SessionClinicalNoteGetPayload<object>,
): ClinicalNote {
  return {
    id: row.id,
    sessionId: row.sessionId,
    patientId: row.patientId,
    clinicianId: row.clinicianId,
    subjective: row.subjective,
    objective: row.objective,
    assessment: row.assessment,
    plan: row.plan,
    diagnosis: row.diagnosis ?? undefined,
    treatment: row.treatment ?? undefined,
    recommendations: row.recommendations ?? undefined,
    followUp: row.followUp ?? undefined,
    status: mapNoteStatus(row.status),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
