import { httpTransport } from '@workspace/repository-transport';
import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  TelemedicineFilters,
  UploadFileInput,
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
import { telemedicineMockRepository } from '@/services/telemedicine/repository.mock';

const BASE = '/api/telemedicine';

class TelemedicineHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = telemedicineMockRepository;

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

  // Hybrid mock-only surfaces
  inviteParticipant(
    sessionId: string,
    name: string,
    role: 'patient' | 'clinician' | 'interpreter',
  ) {
    return this.mock.inviteParticipant(sessionId, name, role);
  }

  removeParticipant(participantId: string) {
    return this.mock.removeParticipant(participantId);
  }

  uploadFile(input: UploadFileInput) {
    return this.mock.uploadFile(input);
  }

  getAttachments(sessionId: string) {
    return this.mock.getAttachments(sessionId);
  }

  recordSession(sessionId: string, consentGiven: boolean) {
    return this.mock.recordSession(sessionId, consentGiven);
  }

  stopRecording(sessionId: string) {
    return this.mock.stopRecording(sessionId);
  }

  generateTranscript(sessionId: string) {
    return this.mock.generateTranscript(sessionId);
  }

  toggleParticipantMedia(
    participantId: string,
    field: 'cameraOn' | 'microphoneOn',
    value: boolean,
  ) {
    return this.mock.toggleParticipantMedia(participantId, field, value);
  }

  toggleScreenShare(participantId: string, sharing: boolean) {
    return this.mock.toggleScreenShare(participantId, sharing);
  }

  search(query: string, patientId?: string) {
    return this.mock.search(query, patientId);
  }

  exportVisit(sessionId: string, format: 'pdf' | 'fhir' | 'json') {
    return this.mock.exportVisit(sessionId, format);
  }

  shareVisit(sessionId: string, sharedWith: string) {
    return this.mock.shareVisit(sessionId, sharedWith);
  }

  toggleFavorite(sessionId: string, userId: string) {
    return this.mock.toggleFavorite(sessionId, userId);
  }

  getWhiteboard(sessionId: string) {
    return this.mock.getWhiteboard(sessionId);
  }

  getFavorites(userId: string) {
    return this.mock.getFavorites(userId);
  }
}

export const telemedicineHttpRepository = new TelemedicineHttpRepository();
