import { Injectable } from '@nestjs/common';

import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  TelemedicineFilters,
} from '@medease/telemedicine-contract';

import { TelemedicineRepository } from './telemedicine.repository';

@Injectable()
export class TelemedicineService {
  constructor(private readonly repository: TelemedicineRepository) {}

  searchSessions(filters?: TelemedicineFilters) {
    return this.repository.searchSessions(filters);
  }

  getSession(sessionId: string) {
    return this.repository.getSession(sessionId);
  }

  getDashboard(patientId?: string, clinicianId?: string) {
    return this.repository.getDashboard(patientId, clinicianId);
  }

  joinSession(sessionId: string, participantId: string) {
    return this.repository.joinSession(sessionId, participantId);
  }

  leaveSession(sessionId: string) {
    return this.repository.leaveSession(sessionId);
  }

  getParticipants(sessionId: string) {
    return this.repository.getParticipants(sessionId);
  }

  getMessages(sessionId: string) {
    return this.repository.getMessages(sessionId);
  }

  sendMessage(input: SendMessageInput) {
    return this.repository.sendMessage(input);
  }

  getClinicalNotes(sessionId: string) {
    return this.repository.getClinicalNotes(sessionId);
  }

  saveClinicalNote(input: SaveClinicalNoteInput) {
    return this.repository.saveClinicalNote(input);
  }

  getTimeline(sessionId: string) {
    return this.repository.getTimeline(sessionId);
  }

  getWaitingRoom(sessionId?: string) {
    return this.repository.getWaitingRoom(sessionId);
  }

  admitWaitingRoom(entryId: string) {
    return this.repository.admitWaitingRoom(entryId);
  }

  rejectWaitingRoom(entryId: string) {
    return this.repository.rejectWaitingRoom(entryId);
  }

  getRecordings(sessionId?: string) {
    return this.repository.getRecordings(sessionId);
  }

  getProviderAvailability() {
    return this.repository.getProviderAvailability();
  }
}
