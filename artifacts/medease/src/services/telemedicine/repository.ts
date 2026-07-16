import { buildMessage } from '@/services/telemedicine/chat';
import {
  buildDashboard,
  buildTimeline,
  MOCK_ATTACHMENTS,
  MOCK_CLINICAL_NOTES,
  MOCK_MESSAGES,
  MOCK_PARTICIPANTS,
  MOCK_PROVIDER_AVAILABILITY,
  MOCK_RECORDINGS,
  MOCK_SESSIONS,
  MOCK_WAITING_ROOM,
  MOCK_WHITEBOARDS,
} from '@/services/telemedicine/mock-data';
import { inviteParticipant, removeParticipant } from '@/services/telemedicine/participants';
import { startRecording, stopRecording, generateTranscript } from '@/services/telemedicine/recordings';
import { admitPatient, rejectPatient, sortWaitingQueue } from '@/services/telemedicine/waiting-room';
import { startVideo, stopVideo } from '@/services/telemedicine/video';
import { createWhiteboard } from '@/services/telemedicine/whiteboard';
import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  SessionExport,
  SessionFavorite,
  SessionShare,
  TelemedicineFilters,
  TelemedicineSession,
  UploadFileInput,
} from '@/services/telemedicine/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

function matchSession(s: TelemedicineSession, filters: TelemedicineFilters) {
  if (filters.patientId && s.patientId !== filters.patientId) return false;
  if (filters.clinicianId && s.clinicianId !== filters.clinicianId) return false;
  if (filters.facilityId && s.facilityId !== filters.facilityId) return false;
  if (filters.status && s.status !== filters.status) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!s.patientName.toLowerCase().includes(q) && !s.clinicianName.toLowerCase().includes(q) && !s.specialty.toLowerCase().includes(q)) return false;
  }
  return true;
}

class TelemedicineRepository {
  private sessions = [...MOCK_SESSIONS];
  private messages = [...MOCK_MESSAGES];
  private attachments = [...MOCK_ATTACHMENTS];
  private recordings = [...MOCK_RECORDINGS];
  private waitingRoom = [...MOCK_WAITING_ROOM];
  private participants = [...MOCK_PARTICIPANTS];
  private notes = [...MOCK_CLINICAL_NOTES];
  private whiteboards = [...MOCK_WHITEBOARDS];
  private favorites: SessionFavorite[] = [];

  searchSessions(filters?: TelemedicineFilters) {
    const filtered = this.sessions.filter((s) => matchSession(s, filters ?? {}));
    return paginate(filtered.sort((a, b) => b.scheduledStart.localeCompare(a.scheduledStart)), filters?.page, filters?.pageSize);
  }

  getSession(sessionId: string) {
    return this.sessions.find((s) => s.sessionId === sessionId) ?? null;
  }

  async joinSession(sessionId: string, participantId: string) {
    const session = this.getSession(sessionId);
    if (!session) return null;
    session.status = session.status === 'scheduled' ? 'waiting' : session.status === 'waiting' ? 'in_progress' : session.status;
    session.actualStart = session.actualStart ?? new Date().toISOString();
    await startVideo(sessionId, session.platform, session.roomId);
    const existing = this.participants.find((p) => p.sessionId === sessionId && p.id === participantId);
    if (existing) existing.joinedAt = new Date().toISOString();
    return session;
  }

  async leaveSession(sessionId: string) {
    const session = this.getSession(sessionId);
    if (!session) return null;
    if (session.status === 'in_progress') {
      session.status = 'completed';
      session.actualEnd = new Date().toISOString();
      session.duration = session.actualStart
        ? Math.round((Date.now() - new Date(session.actualStart).getTime()) / 60000)
        : session.duration;
    }
    await stopVideo(session.platform, session.roomId);
    return session;
  }

  getParticipants(sessionId: string) {
    return this.participants.filter((p) => p.sessionId === sessionId);
  }

  inviteParticipant(sessionId: string, name: string, role: 'patient' | 'clinician' | 'interpreter') {
    const p = inviteParticipant(sessionId, name, role);
    this.participants.push(p);
    return p;
  }

  removeParticipant(participantId: string) {
    const p = this.participants.find((x) => x.id === participantId);
    if (!p) return null;
    Object.assign(p, removeParticipant(p));
    return p;
  }

  getMessages(sessionId: string) {
    return this.messages.filter((m) => m.sessionId === sessionId).sort((a, b) => a.sentAt.localeCompare(b.sentAt));
  }

  sendMessage(input: SendMessageInput) {
    const msg = buildMessage(input);
    msg.deliveryStatus = 'delivered';
    this.messages.push(msg);
    return msg;
  }

  uploadFile(input: UploadFileInput) {
    const att = {
      id: `att-${Date.now()}`,
      sessionId: input.sessionId,
      name: input.name,
      type: input.type,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      uploadedBy: input.uploadedBy,
      uploadedAt: new Date().toISOString(),
      url: `/mock/telemedicine/${input.sessionId}/${input.name}`,
    };
    this.attachments.push(att);
    return att;
  }

  getAttachments(sessionId: string) {
    return this.attachments.filter((a) => a.sessionId === sessionId);
  }

  recordSession(sessionId: string, consentGiven: boolean) {
    const rec = startRecording(sessionId, consentGiven);
    this.recordings.push(rec);
    const session = this.getSession(sessionId);
    if (session) session.recordingStatus = consentGiven ? 'recording' : 'pending_consent';
    return rec;
  }

  stopRecording(sessionId: string) {
    const rec = this.recordings.find((r) => r.sessionId === sessionId && r.status === 'recording');
    if (!rec) return null;
    Object.assign(rec, stopRecording(rec));
    const session = this.getSession(sessionId);
    if (session) session.recordingStatus = 'processing';
    return rec;
  }

  saveClinicalNote(input: SaveClinicalNoteInput) {
    const existing = this.notes.find((n) => n.sessionId === input.sessionId);
    if (existing) {
      Object.assign(existing, { ...input, updatedAt: new Date().toISOString() });
      return existing;
    }
    const note = {
      id: `note-${Date.now()}`,
      ...input,
      subjective: input.subjective ?? '',
      objective: input.objective ?? '',
      assessment: input.assessment ?? '',
      plan: input.plan ?? '',
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.push(note);
    return note;
  }

  getClinicalNotes(sessionId: string) {
    return this.notes.filter((n) => n.sessionId === sessionId);
  }

  getWaitingRoom(sessionId?: string) {
    const entries = sessionId ? this.waitingRoom.filter((w) => w.sessionId === sessionId) : this.waitingRoom;
    return sortWaitingQueue(entries.filter((w) => w.status === 'waiting'));
  }

  admitWaitingRoom(entryId: string) {
    const entry = this.waitingRoom.find((w) => w.id === entryId);
    if (!entry) return null;
    Object.assign(entry, admitPatient(entry));
    const session = this.getSession(entry.sessionId);
    if (session) session.status = 'in_progress';
    return entry;
  }

  rejectWaitingRoom(entryId: string) {
    const entry = this.waitingRoom.find((w) => w.id === entryId);
    if (!entry) return null;
    Object.assign(entry, rejectPatient(entry));
    return entry;
  }

  getRecordings(sessionId?: string) {
    return sessionId ? this.recordings.filter((r) => r.sessionId === sessionId) : this.recordings;
  }

  generateTranscript(sessionId: string) {
    return generateTranscript(sessionId);
  }

  getDashboard(patientId?: string, clinicianId?: string) {
    return buildDashboard(patientId, clinicianId);
  }

  getTimeline(sessionId: string) {
    return buildTimeline(sessionId);
  }

  getProviderAvailability() {
    return MOCK_PROVIDER_AVAILABILITY;
  }

  getWhiteboard(sessionId: string) {
    return this.whiteboards.find((w) => w.sessionId === sessionId) ?? createWhiteboard(sessionId, 'system');
  }

  toggleParticipantMedia(participantId: string, field: 'cameraOn' | 'microphoneOn', value: boolean) {
    const p = this.participants.find((x) => x.id === participantId);
    if (!p) return null;
    p[field] = value;
    return p;
  }

  toggleScreenShare(participantId: string, sharing: boolean) {
    const p = this.participants.find((x) => x.id === participantId);
    if (!p) return null;
    p.screenSharing = sharing;
    return p;
  }

  search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    return {
      sessions: this.sessions.filter((s) =>
        (!patientId || s.patientId === patientId) &&
        (s.patientName.toLowerCase().includes(q) || s.clinicianName.toLowerCase().includes(q) || s.meetingNumber.includes(q)),
      ).slice(0, 20),
      messages: this.messages.filter((m) => m.content.toLowerCase().includes(q)).slice(0, 20),
    };
  }

  exportVisit(sessionId: string, format: SessionExport['format']): SessionExport {
    return { id: `exp-${Date.now()}`, sessionId, format, exportedAt: new Date().toISOString() };
  }

  shareVisit(sessionId: string, sharedWith: string): SessionShare {
    return { id: `share-${Date.now()}`, sessionId, sharedWith, sharedAt: new Date().toISOString() };
  }

  toggleFavorite(sessionId: string, userId: string) {
    const existing = this.favorites.find((f) => f.sessionId === sessionId && f.userId === userId);
    if (existing) {
      this.favorites = this.favorites.filter((f) => f.id !== existing.id);
      return { favorited: false };
    }
    this.favorites.push({ id: `fav-${Date.now()}`, sessionId, userId, createdAt: new Date().toISOString() });
    return { favorited: true };
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }
}

export const telemedicineRepository = new TelemedicineRepository();
