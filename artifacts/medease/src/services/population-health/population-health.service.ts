import { populationHealthRepository } from '@/services/population-health/repository';
import type {
  CloseCareGapInput,
  CreateCohortInput,
  LaunchCampaignInput,
  PhmFilters,
} from '@/services/population-health/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const populationHealthService = {
  async dashboard(facilityId?: string) {
    await delay();
    return populationHealthRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return populationHealthRepository.analytics(facilityId);
  },
  async getPopulation(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getPopulation(filters);
  },
  async getHighRiskPatients(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getHighRiskPatients(filters);
  },
  async getRegistries(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getRegistries(filters);
  },
  async getCareGaps(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getCareGaps(filters);
  },
  async getRiskScores(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getRiskScores(filters);
  },
  async getCohorts(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getCohorts(filters);
  },
  async getChronicPrograms(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getChronicPrograms(filters);
  },
  async getPreventiveCare(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getPreventiveCare(filters);
  },
  async getOutreach(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getOutreach(filters);
  },
  async getCommunityHealth(filters?: PhmFilters) {
    await delay();
    return populationHealthRepository.getCommunityHealth(filters);
  },
  async getGeographicRegions() {
    await delay();
    return populationHealthRepository.getGeographicRegions();
  },

  async createCohort(input: CreateCohortInput) {
    await delay();
    return populationHealthRepository.createCohort(input);
  },
  async launchCampaign(input: LaunchCampaignInput) {
    await delay();
    return populationHealthRepository.launchCampaign(input);
  },
  async closeCareGap(input: CloseCareGapInput) {
    await delay();
    return populationHealthRepository.closeCareGap(input);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return populationHealthRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return populationHealthRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'registry' | 'cohort' | 'campaign' | 'gap',
    entityId: string,
  ) {
    await delay();
    return populationHealthRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return populationHealthRepository.getFavorites(userId);
  },
};
