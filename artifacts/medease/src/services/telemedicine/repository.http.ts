import { httpTransport } from '@workspace/repository-transport';
import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  SessionExport,
  SessionFavorite,
  SessionShare,
  TelemedicineFilters,
  UploadFileInput,
  VideoParticipant,
  WhiteboardSession,
} from '@/services/telemedicine/types';
import {
  mapChatMessage,
  mapChatMessageArray,
  mapClinicalNote,
  mapClinicalNoteArray,
  mapPaginatedSessions,
  mapProviderAvailabilityArray,
  mapSessionRecordingArray,
  mapSessionTimelineEntryArray,
  mapTelemedicineDashboard,
  mapTelemedicineSession,
  mapVideoParticipantArray,
  mapWaitingRoomEntry,
  mapWaitingRoomEntryArray,
  telemedicineFiltersToQuery,
} from '@/services/telemedicine/dto-mappers';

const BASE = '/api/telemedicine';

class TelemedicineHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites: SessionFavorite[] = [];
  private readonly shares: SessionShare[] = [];
  private readonly whiteboards = new Map<string, WhiteboardSession>();

  async searchSessions(filters?: TelemedicineFilters) {
    return mapPaginatedSessions(
      await this.transport.get(`${BASE}/sessions`, {
        query: telemedicineFiltersToQuery(filters),
      }),
    );
  }

  async getSession(sessionId: string) {
    try {
      return mapTelemedicineSession(
        await this.transport.get(`${BASE}/sessions/${sessionId}`),
      );
    } catch {
      return null;
    }
  }

  async joinSession(sessionId: string, participantId: string) {
    try {
      return mapTelemedicineSession(
        await this.transport.post(`${BASE}/sessions/${sessionId}/join`, {
          body: { participantId },
        }),
      );
    } catch {
      return null;
    }
  }

  async leaveSession(sessionId: string) {
    try {
      return mapTelemedicineSession(
        await this.transport.post(`${BASE}/sessions/${sessionId}/leave`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async getParticipants(sessionId: string) {
    return mapVideoParticipantArray(
      await this.transport.get(`${BASE}/sessions/${sessionId}/participants`),
    );
  }

  async getMessages(sessionId: string) {
    return mapChatMessageArray(
      await this.transport.get(`${BASE}/sessions/${sessionId}/messages`),
    );
  }

  async sendMessage(input: SendMessageInput) {
    return mapChatMessage(
      await this.transport.post(
        `${BASE}/sessions/${input.sessionId}/messages`,
        {
          body: {
            senderId: input.senderId,
            senderName: input.senderName,
            content: input.content,
            receiverId: input.receiverId,
          },
        },
      ),
    );
  }

  async getClinicalNotes(sessionId: string) {
    return mapClinicalNoteArray(
      await this.transport.get(`${BASE}/sessions/${sessionId}/notes`),
    );
  }

  async saveClinicalNote(input: SaveClinicalNoteInput) {
    return mapClinicalNote(
      await this.transport.post(`${BASE}/sessions/${input.sessionId}/notes`, {
        body: input,
      }),
    );
  }

  async getTimeline(sessionId: string) {
    return mapSessionTimelineEntryArray(
      await this.transport.get(`${BASE}/sessions/${sessionId}/timeline`),
    );
  }

  async getWaitingRoom(sessionId?: string) {
    return mapWaitingRoomEntryArray(
      await this.transport.get(`${BASE}/waiting-room`, {
        query: sessionId ? { sessionId } : undefined,
      }),
    );
  }

  async admitWaitingRoom(entryId: string) {
    try {
      return mapWaitingRoomEntry(
        await this.transport.post(`${BASE}/waiting-room/${entryId}/admit`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async rejectWaitingRoom(entryId: string) {
    try {
      return mapWaitingRoomEntry(
        await this.transport.post(`${BASE}/waiting-room/${entryId}/reject`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async getRecordings(sessionId?: string) {
    if (sessionId) {
      return mapSessionRecordingArray(
        await this.transport.get(`${BASE}/sessions/${sessionId}/recordings`),
      );
    }
    return mapSessionRecordingArray(
      await this.transport.get(`${BASE}/recordings`),
    );
  }

  async getDashboard(patientId?: string, clinicianId?: string) {
    return mapTelemedicineDashboard(
      await this.transport.get(`${BASE}/dashboard`, {
        query: {
          ...(patientId ? { patientId } : {}),
          ...(clinicianId ? { clinicianId } : {}),
        },
      }),
    );
  }

  async getProviderAvailability() {
    return mapProviderAvailabilityArray(
      await this.transport.get(`${BASE}/providers/availability`),
    );
  }

  /**
   * Extras without Nest write APIs yet: never fall back to mock Sarah fixtures.
   * Prefer live reads / empty / ephemeral session-local state.
   */
  async inviteParticipant(
    _sessionId: string,
    _name: string,
    _role: 'patient' | 'clinician' | 'interpreter',
  ): Promise<VideoParticipant | null> {
    return null;
  }

  async removeParticipant(_participantId: string) {
    return null;
  }

  async uploadFile(_input: UploadFileInput) {
    return null;
  }

  async getAttachments(_sessionId: string) {
    return [];
  }

  async recordSession(_sessionId: string, _consentGiven: boolean) {
    return null;
  }

  async stopRecording(_sessionId: string) {
    return null;
  }

  async generateTranscript(sessionId: string) {
    const recordings = await this.getRecordings(sessionId);
    const withText = recordings.find((r) => r.transcription);
    return withText?.transcription ?? null;
  }

  async toggleParticipantMedia(
    participantId: string,
    field: 'cameraOn' | 'microphoneOn',
    value: boolean,
  ) {
    // Media patch API not exposed yet — no mock mutation.
    void participantId;
    void field;
    void value;
    return null;
  }

  async toggleScreenShare(participantId: string, sharing: boolean) {
    void participantId;
    void sharing;
    return null;
  }

  async search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const { items } = await this.searchSessions({
      patientId,
      q: query,
      pageSize: 20,
    });
    return {
      sessions: items.filter(
        (s) =>
          s.patientName.toLowerCase().includes(q) ||
          s.clinicianName.toLowerCase().includes(q) ||
          s.meetingNumber.includes(q),
      ),
      messages: [] as Awaited<ReturnType<typeof this.getMessages>>,
    };
  }

  async exportVisit(
    sessionId: string,
    format: SessionExport['format'],
  ): Promise<SessionExport | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;
    return {
      id: `exp-${sessionId}`,
      sessionId,
      format,
      exportedAt: new Date().toISOString(),
    };
  }

  async shareVisit(
    sessionId: string,
    sharedWith: string,
  ): Promise<SessionShare | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;
    const share = {
      id: `share-${sessionId}-${Date.now()}`,
      sessionId,
      sharedWith,
      sharedAt: new Date().toISOString(),
    };
    this.shares.push(share);
    return share;
  }

  async toggleFavorite(sessionId: string, userId: string) {
    const existing = this.favorites.find(
      (f) => f.sessionId === sessionId && f.userId === userId,
    );
    if (existing) {
      this.favorites.splice(this.favorites.indexOf(existing), 1);
      return { favorited: false };
    }
    this.favorites.push({
      id: `fav-${sessionId}-${userId}`,
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
    });
    return { favorited: true };
  }

  async getWhiteboard(sessionId: string): Promise<WhiteboardSession> {
    const existing = this.whiteboards.get(sessionId);
    if (existing) return existing;
    const now = new Date().toISOString();
    const board: WhiteboardSession = {
      id: `wb-${sessionId}`,
      sessionId,
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
      strokeCount: 0,
    };
    this.whiteboards.set(sessionId, board);
    return board;
  }

  async getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }
}

export const telemedicineHttpRepository = new TelemedicineHttpRepository();
