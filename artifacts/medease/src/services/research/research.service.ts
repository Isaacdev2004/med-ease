import { researchRepository } from '@/services/research/repository';
import type {
  CloseDeviationInput,
  CreateInnovationInput,
  CreateTrialInput,
  EnrollParticipantInput,
  RecordAdverseEventInput,
  RecordConsentInput,
  RegisterBiospecimenInput,
  ResearchFilters,
  ScheduleVisitInput,
  ShareResearchInput,
  SubmitPublicationInput,
} from '@/services/research/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const researchService = {
  async dashboard(facilityId?: string) {
    await delay();
    return researchRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return researchRepository.analytics(facilityId);
  },
  async getTrials(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getTrials(filters);
  },
  async getTrial(trialId: string) {
    await delay();
    return researchRepository.getTrial(trialId);
  },
  async getParticipants(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getParticipants(filters);
  },
  async getVisits(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getVisits(filters);
  },
  async getInvestigators(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getInvestigators(filters);
  },
  async getSites(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getSites(filters);
  },
  async getConsents(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getConsents(filters);
  },
  async getDeviations(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getDeviations(filters);
  },
  async getAdverseEvents(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getAdverseEvents(filters);
  },
  async getSafetyBoard(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getSafetyBoard(filters);
  },
  async getBiospecimens(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getBiospecimens(filters);
  },
  async getPublications(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getPublications(filters);
  },
  async getInnovation(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getInnovation(filters);
  },
  async getGrants(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getGrants(filters);
  },
  async getRegulatory(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getRegulatory(filters);
  },
  async getAudit(filters?: ResearchFilters) {
    await delay();
    return researchRepository.getAudit(filters);
  },

  async createTrial(input: CreateTrialInput) {
    await delay();
    return researchRepository.createTrial(input);
  },
  async enrollParticipant(input: EnrollParticipantInput) {
    await delay();
    return researchRepository.enrollParticipant(input);
  },
  async recordConsent(input: RecordConsentInput) {
    await delay();
    return researchRepository.recordConsent(input);
  },
  async scheduleVisit(input: ScheduleVisitInput) {
    await delay();
    return researchRepository.scheduleVisit(input);
  },
  async recordAdverseEvent(input: RecordAdverseEventInput) {
    await delay();
    return researchRepository.recordAdverseEvent(input);
  },
  async closeDeviation(input: CloseDeviationInput) {
    await delay();
    return researchRepository.closeDeviation(input);
  },
  async submitPublication(input: SubmitPublicationInput) {
    await delay();
    return researchRepository.submitPublication(input);
  },
  async registerBiospecimen(input: RegisterBiospecimenInput) {
    await delay();
    return researchRepository.registerBiospecimen(input);
  },
  async createInnovation(input: CreateInnovationInput) {
    await delay();
    return researchRepository.createInnovation(input);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return researchRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return researchRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType:
      'trial' | 'participant' | 'publication' | 'innovation' | 'grant',
    entityId: string,
  ) {
    await delay();
    return researchRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return researchRepository.getFavorites(userId);
  },
  async share(input: ShareResearchInput) {
    await delay();
    return researchRepository.share(input);
  },
};
