export type SessionStatus =
  | 'scheduled'
  | 'waiting'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'failed';

export type SessionType = 'consultation' | 'follow_up' | 'urgent' | 'specialist' | 'group' | 'interpreter';
export type VideoPlatform = 'webrtc' | 'twilio' | 'agora' | 'daily' | 'zoom' | 'teams';
export type RecordingStatus = 'none' | 'pending_consent' | 'recording' | 'stopped' | 'processing' | 'available';
export type ParticipantRole = 'patient' | 'clinician' | 'nurse' | 'interpreter' | 'caregiver' | 'observer';
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type AttachmentType = 'image' | 'pdf' | 'lab' | 'radiology' | 'prescription' | 'consent' | 'document';
export type WaitingRoomStatus = 'waiting' | 'admitted' | 'rejected' | 'left';
export type DeviceCheckStatus = 'pass' | 'warning' | 'fail';

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

export interface WhiteboardSession {
  id: string;
  sessionId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  strokeCount: number;
  exportedUrl?: string;
}

export interface DeviceCheckResult {
  sessionId?: string;
  camera: DeviceCheckStatus;
  microphone: DeviceCheckStatus;
  speaker: DeviceCheckStatus;
  bandwidthMbps: number;
  latencyMs: number;
  packetLossPercent: number;
  checkedAt: string;
}

export interface TelemedicineDashboard {
  upcomingSessions: number;
  activeSessions: number;
  completedToday: number;
  waitingRoomCount: number;
  averageQuality: number;
  recentSessions: TelemedicineSession[];
}

export interface TelemedicineAnalytics {
  totalSessions: number;
  activeSessions: number;
  completedVisits: number;
  averageDurationMinutes: number;
  noShowRate: number;
  connectionFailureRate: number;
  recordingRate: number;
  patientSatisfaction: number;
  providerUtilization: number;
  bandwidthUsageMbps: number;
  dailySessions: { label: string; value: number }[];
  weeklyTrends: { label: string; value: number }[];
  monthlyUtilization: { label: string; value: number }[];
  sessionQuality: { label: string; value: number }[];
  providerWorkload: { label: string; value: number }[];
  platformHealth: { label: string; value: number }[];
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

export interface SessionExport {
  id: string;
  sessionId: string;
  format: 'pdf' | 'fhir' | 'json';
  exportedAt: string;
}

export interface SessionShare {
  id: string;
  sessionId: string;
  sharedWith: string;
  sharedAt: string;
}

export interface SessionFavorite {
  id: string;
  sessionId: string;
  userId: string;
  createdAt: string;
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

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};

export const TELEMEDICINE_PATIENT_IDS = Array.from({ length: 40 }, (_, i) =>
  `phr-${String(i + 1).padStart(3, '0')}`,
);

export interface TelemedicinePermissions {
  canView: boolean;
  canWrite: boolean;
  canJoin: boolean;
  canHost: boolean;
  canRecord: boolean;
  canChat: boolean;
  canUploadFiles: boolean;
  canExport: boolean;
  canViewAnalytics: boolean;
  canAdmin: boolean;
}
