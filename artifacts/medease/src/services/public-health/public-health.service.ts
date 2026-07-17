import { publicHealthRepository } from '@/services/public-health/repository';
import type {
  AssignContactTracingInput,
  CompleteInvestigationInput,
  CreateOutbreakInput,
  LaunchCampaignInput,
  PublicHealthFilters,
  RecordImmunizationInput,
  RecordSdohInput,
  RegisterCaseInput,
  ScheduleOutreachInput,
  SharePublicHealthInput,
} from '@/services/public-health/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const publicHealthService = {
  async dashboard(facilityId?: string) {
    await delay();
    return publicHealthRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return publicHealthRepository.analytics(facilityId);
  },
  async getCases(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getCases(filters);
  },
  async getCase(caseId: string) {
    await delay();
    return publicHealthRepository.getCase(caseId);
  },
  async getOutbreaks(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getOutbreaks(filters);
  },
  async getContactTracing(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getContactTracing(filters);
  },
  async getImmunizations(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getImmunizations(filters);
  },
  async getRegistries(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getRegistries(filters);
  },
  async getCommunityPrograms(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getCommunityPrograms(filters);
  },
  async getMaternalHealth(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getMaternalHealth(filters);
  },
  async getChildHealth(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getChildHealth(filters);
  },
  async getSchoolHealth(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getSchoolHealth(filters);
  },
  async getOccupationalHealth(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getOccupationalHealth(filters);
  },
  async getEnvironmentalHealth(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getEnvironmentalHealth(filters);
  },
  async getSdohAssessments(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getSdohAssessments(filters);
  },
  async getCommunityMembers(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getCommunityMembers(filters);
  },
  async getAudit(filters?: PublicHealthFilters) {
    await delay();
    return publicHealthRepository.getAudit(filters);
  },

  async registerCase(input: RegisterCaseInput) {
    await delay();
    return publicHealthRepository.registerCase(input);
  },
  async createOutbreak(input: CreateOutbreakInput) {
    await delay();
    return publicHealthRepository.createOutbreak(input);
  },
  async recordImmunization(input: RecordImmunizationInput) {
    await delay();
    return publicHealthRepository.recordImmunization(input);
  },
  async launchCampaign(input: LaunchCampaignInput) {
    await delay();
    return publicHealthRepository.launchCampaign(input);
  },
  async assignContactTracing(input: AssignContactTracingInput) {
    await delay();
    return publicHealthRepository.assignContactTracing(input);
  },
  async completeInvestigation(input: CompleteInvestigationInput) {
    await delay();
    return publicHealthRepository.completeInvestigation(input);
  },
  async recordSdoh(input: RecordSdohInput) {
    await delay();
    return publicHealthRepository.recordSdoh(input);
  },
  async scheduleOutreach(input: ScheduleOutreachInput) {
    await delay();
    return publicHealthRepository.scheduleOutreach(input);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return publicHealthRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return publicHealthRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'case' | 'outbreak' | 'program' | 'immunization',
    entityId: string,
  ) {
    await delay();
    return publicHealthRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return publicHealthRepository.getFavorites(userId);
  },
  async share(input: SharePublicHealthInput) {
    await delay();
    return publicHealthRepository.share(input);
  },
};
