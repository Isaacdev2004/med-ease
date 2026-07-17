import { computeTelemedicineAnalytics } from '@/services/telemedicine/analytics';
import { runDeviceCheck } from '@/services/telemedicine/bandwidth';
import { getPatientIdForUser } from '@/services/telemedicine/mock-data';
import { telemedicineRepository } from '@/services/telemedicine/repository';
import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  TelemedicineFilters,
  UploadFileInput,
} from '@/services/telemedicine/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const telemedicineService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return explicitId ?? getPatientIdForUser(userId);
  },

  async searchSessions(filters?: TelemedicineFilters) {
    await delay();
    return telemedicineRepository.searchSessions(filters);
  },

  async getSession(sessionId: string) {
    await delay();
    return telemedicineRepository.getSession(sessionId);
  },

  async joinSession(sessionId: string, participantId: string) {
    await delay();
    return telemedicineRepository.joinSession(sessionId, participantId);
  },

  async leaveSession(sessionId: string) {
    await delay();
    return telemedicineRepository.leaveSession(sessionId);
  },

  async getParticipants(sessionId: string) {
    await delay();
    return telemedicineRepository.getParticipants(sessionId);
  },

  async inviteParticipant(
    sessionId: string,
    name: string,
    role: 'patient' | 'clinician' | 'interpreter',
  ) {
    await delay();
    return telemedicineRepository.inviteParticipant(sessionId, name, role);
  },

  async removeParticipant(participantId: string) {
    await delay();
    return telemedicineRepository.removeParticipant(participantId);
  },

  async getMessages(sessionId: string) {
    await delay();
    return telemedicineRepository.getMessages(sessionId);
  },

  async sendMessage(input: SendMessageInput) {
    await delay();
    return telemedicineRepository.sendMessage(input);
  },

  async uploadFile(input: UploadFileInput) {
    await delay();
    return telemedicineRepository.uploadFile(input);
  },

  async getAttachments(sessionId: string) {
    await delay();
    return telemedicineRepository.getAttachments(sessionId);
  },

  async recordSession(sessionId: string, consentGiven: boolean) {
    await delay();
    return telemedicineRepository.recordSession(sessionId, consentGiven);
  },

  async stopRecording(sessionId: string) {
    await delay();
    return telemedicineRepository.stopRecording(sessionId);
  },

  async saveClinicalNote(input: SaveClinicalNoteInput) {
    await delay();
    return telemedicineRepository.saveClinicalNote(input);
  },

  async getClinicalNotes(sessionId: string) {
    await delay();
    return telemedicineRepository.getClinicalNotes(sessionId);
  },

  async getWaitingRoom(sessionId?: string) {
    await delay();
    return telemedicineRepository.getWaitingRoom(sessionId);
  },

  async admitWaitingRoom(entryId: string) {
    await delay();
    return telemedicineRepository.admitWaitingRoom(entryId);
  },

  async rejectWaitingRoom(entryId: string) {
    await delay();
    return telemedicineRepository.rejectWaitingRoom(entryId);
  },

  async getRecordings(sessionId?: string) {
    await delay();
    return telemedicineRepository.getRecordings(sessionId);
  },

  async generateTranscript(sessionId: string) {
    await delay();
    return telemedicineRepository.generateTranscript(sessionId);
  },

  async getDashboard(patientId?: string, clinicianId?: string) {
    await delay();
    return telemedicineRepository.getDashboard(patientId, clinicianId);
  },

  async getTimeline(sessionId: string) {
    await delay();
    return telemedicineRepository.getTimeline(sessionId);
  },

  async getAnalytics() {
    await delay();
    return computeTelemedicineAnalytics();
  },

  async getProviderAvailability() {
    await delay();
    return telemedicineRepository.getProviderAvailability();
  },

  async runDeviceCheck(sessionId?: string) {
    await delay();
    return runDeviceCheck(sessionId);
  },

  async muteParticipant(participantId: string, muted: boolean) {
    await delay();
    return telemedicineRepository.toggleParticipantMedia(
      participantId,
      'microphoneOn',
      !muted,
    );
  },

  async toggleVideo(participantId: string, enabled: boolean) {
    await delay();
    return telemedicineRepository.toggleParticipantMedia(
      participantId,
      'cameraOn',
      enabled,
    );
  },

  async startScreenShare(participantId: string) {
    await delay();
    return telemedicineRepository.toggleScreenShare(participantId, true);
  },

  async stopScreenShare(participantId: string) {
    await delay();
    return telemedicineRepository.toggleScreenShare(participantId, false);
  },

  async search(query: string, patientId?: string) {
    await delay();
    return telemedicineRepository.search(query, patientId);
  },

  async exportVisit(sessionId: string, format: 'pdf' | 'fhir' | 'json') {
    await delay();
    return telemedicineRepository.exportVisit(sessionId, format);
  },

  async shareVisit(sessionId: string, sharedWith: string) {
    await delay();
    return telemedicineRepository.shareVisit(sessionId, sharedWith);
  },

  async toggleFavorite(sessionId: string, userId: string) {
    await delay();
    return telemedicineRepository.toggleFavorite(sessionId, userId);
  },

  async getWhiteboard(sessionId: string) {
    await delay();
    return telemedicineRepository.getWhiteboard(sessionId);
  },
};
