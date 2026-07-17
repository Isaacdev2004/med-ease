export { telemedicineService } from '@/services/telemedicine/telemedicine.service';
export { telemedicineRepository } from '@/services/telemedicine/repository';
export { telemedicineOfflineQueue } from '@/services/telemedicine/offline-sync';
export { computeTelemedicineAnalytics } from '@/services/telemedicine/analytics';
export {
  getVideoAdapter,
  startVideo,
  stopVideo,
} from '@/services/telemedicine/video';
export {
  runDeviceCheck,
  measureBandwidth,
} from '@/services/telemedicine/bandwidth';
export {
  toFhirEncounter,
  toFhirCommunication,
  toFhirCommunicationRequest,
  toFhirMedia,
  toFhirDocumentReference,
  toFhirAppointment,
  toFhirClinicalNote,
} from '@/services/telemedicine/mapper';
export {
  buildDashboard,
  buildTimeline,
  getPatientIdForUser,
  MOCK_SESSIONS,
  MOCK_MESSAGES,
  MOCK_ATTACHMENTS,
  MOCK_RECORDINGS,
  MOCK_WAITING_ROOM,
  MOCK_PARTICIPANTS,
  MOCK_CLINICAL_NOTES,
  MOCK_PROVIDER_AVAILABILITY,
} from '@/services/telemedicine/mock-data';
export type {
  TelemedicineSession,
  VideoParticipant,
  ChatMessage,
  ClinicalNote,
  SessionRecording,
  WaitingRoomEntry,
  TelemedicineDashboard,
  TelemedicineAnalytics,
  TelemedicineFilters,
  DeviceCheckResult,
  ProviderAvailability,
  SessionTimelineEntry,
  SendMessageInput,
  SaveClinicalNoteInput,
  UploadFileInput,
} from '@/services/telemedicine/types';
export {
  AUTH_USER_PATIENT_MAP,
  TELEMEDICINE_PATIENT_IDS,
} from '@/services/telemedicine/types';
