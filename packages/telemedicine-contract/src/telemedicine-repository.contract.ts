import type {
  ChatMessage,
  ClinicalNote,
  ProviderAvailability,
  SaveClinicalNoteInput,
  SendMessageInput,
  SessionListResult,
  SessionRecording,
  SessionTimelineEntry,
  TelemedicineDashboard,
  TelemedicineFilters,
  TelemedicineSession,
  VideoParticipant,
  WaitingRoomEntry,
} from './telemedicine.types';

export interface TelemedicineRepositoryContract {
  searchSessions(filters?: TelemedicineFilters): Promise<SessionListResult>;
  getSession(sessionId: string): Promise<TelemedicineSession>;
  getDashboard(
    patientId?: string,
    clinicianId?: string,
  ): Promise<TelemedicineDashboard>;

  joinSession(
    sessionId: string,
    participantId: string,
  ): Promise<TelemedicineSession>;
  leaveSession(sessionId: string): Promise<TelemedicineSession>;

  getParticipants(sessionId: string): Promise<VideoParticipant[]>;
  getMessages(sessionId: string): Promise<ChatMessage[]>;
  sendMessage(input: SendMessageInput): Promise<ChatMessage>;

  getClinicalNotes(sessionId: string): Promise<ClinicalNote[]>;
  saveClinicalNote(input: SaveClinicalNoteInput): Promise<ClinicalNote>;

  getTimeline(sessionId: string): Promise<SessionTimelineEntry[]>;

  getWaitingRoom(sessionId?: string): Promise<WaitingRoomEntry[]>;
  admitWaitingRoom(entryId: string): Promise<WaitingRoomEntry>;
  rejectWaitingRoom(entryId: string): Promise<WaitingRoomEntry>;

  getRecordings(sessionId?: string): Promise<SessionRecording[]>;
  getProviderAvailability(): Promise<ProviderAvailability[]>;
}
