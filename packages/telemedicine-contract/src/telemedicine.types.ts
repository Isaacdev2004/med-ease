export type SessionStatus =
  | 'scheduled'
  | 'waiting'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'failed';

export type SessionType =
  | 'consultation'
  | 'follow_up'
  | 'urgent'
  | 'specialist'
  | 'group'
  | 'interpreter';

export type VideoPlatform =
  | 'webrtc'
  | 'twilio'
  | 'agora'
  | 'daily'
  | 'zoom'
  | 'teams';

export type RecordingStatus =
  | 'none'
  | 'pending_consent'
  | 'recording'
  | 'stopped'
  | 'processing'
  | 'available';

export type ParticipantRole =
  | 'patient'
  | 'clinician'
  | 'nurse'
  | 'interpreter'
  | 'caregiver'
  | 'observer';

export type ConnectionQuality =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'disconnected';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed';

export type AttachmentType =
  | 'image'
  | 'pdf'
  | 'lab'
  | 'radiology'
  | 'prescription'
  | 'consent'
  | 'document';

export type WaitingRoomStatus = 'waiting' | 'admitted' | 'rejected' | 'left';

export interface TelemedicineSession {
  sessionId: string;
  appointmentId?: string;
  encounterId?: string;
  patientId: string;
  patientName: string;
  clinicianId: string;
  clinicianName: string;
  facilityId?: string;
  meetingNumber: string;
  meetingPassword?: string;
  platform: VideoPlatform;
  roomId: string;
  sessionType: SessionType;
  specialty: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  duration?: number;
  timezone: string;
  language: string;
  interpreterRequired: boolean;
  status: SessionStatus;
  recordingStatus: RecordingStatus;
  waitingRoomEnabled: boolean;
  encryption: boolean;
  qualityScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoParticipant {
  id: string;
  sessionId: string;
  name: string;
  role: ParticipantRole;
  joinedAt?: string;
  leftAt?: string;
  cameraOn: boolean;
  microphoneOn: boolean;
  screenSharing: boolean;
  connectionQuality: ConnectionQuality;
  deviceType: string;
  browser: string;
  networkType: string;
  permissions: string[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  content: string;
  sentAt: string;
  deliveryStatus: MessageDeliveryStatus;
  readAt?: string;
  attachments?: SessionAttachment[];
  reactions?: { emoji: string; userId: string }[];
  pinned?: boolean;
}

export interface SessionAttachment {
  id: string;
  sessionId: string;
  name: string;
  type: AttachmentType;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface ClinicalNote {
  id: string;
  sessionId: string;
  patientId: string;
  clinicianId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis?: string;
  treatment?: string;
  recommendations?: string;
  followUp?: string;
  status: 'draft' | 'final' | 'signed';
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecording {
  id: string;
  sessionId: string;
  consentGiven: boolean;
  status: RecordingStatus;
  durationSeconds?: number;
  storageUrl?: string;
  retentionDays: number;
  transcription?: string;
  startedAt?: string;
  stoppedAt?: string;
}

export interface WaitingRoomEntry {
  id: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  status: WaitingRoomStatus;
  joinedAt: string;
  admittedAt?: string;
  estimatedWaitMinutes: number;
  priority: 'normal' | 'urgent' | 'high';
}

export interface TelemedicineDashboard {
  upcomingSessions: number;
  activeSessions: number;
  completedToday: number;
  waitingRoomCount: number;
  averageQuality: number;
  recentSessions: TelemedicineSession[];
}

export interface SessionTimelineEntry {
  id: string;
  sessionId: string;
  date: string;
  type: 'join' | 'leave' | 'message' | 'recording' | 'note' | 'file' | 'waiting';
  title: string;
  description: string;
  actor?: string;
}

export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  specialty: string;
  availableSlots: { start: string; end: string }[];
  telemedicineEnabled: boolean;
}

export interface TelemedicineFilters {
  patientId?: string;
  clinicianId?: string;
  facilityId?: string;
  status?: SessionStatus;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface SendMessageInput {
  sessionId: string;
  senderId: string;
  senderName: string;
  content: string;
  receiverId?: string;
}

export interface SaveClinicalNoteInput {
  sessionId: string;
  patientId: string;
  clinicianId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnosis?: string;
  treatment?: string;
  recommendations?: string;
  followUp?: string;
}

export interface UploadFileInput {
  sessionId: string;
  name: string;
  type: AttachmentType;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
}

export interface SessionListResult {
  items: TelemedicineSession[];
  total: number;
  page: number;
  pageSize: number;
}
