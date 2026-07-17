import { computePopulationAnalytics } from '@/services/population-health/analytics';
import { gapPriority } from '@/services/population-health/care-gap-engine';
import {
  parseCriteriaString,
  buildCohortFromCriteria,
} from '@/services/population-health/cohort-builder';
import {
  filterByRegistryType,
  sortRegistriesByGap,
} from '@/services/population-health/registry-engine';
import {
  buildPhmDashboard,
  MOCK_CAMPAIGNS,
  MOCK_CARE_GAPS,
  MOCK_CHRONIC_PROGRAMS,
  MOCK_COHORTS,
  MOCK_COMMUNITY,
  MOCK_POPULATION,
  MOCK_PREVENTIVE,
  MOCK_REGISTRIES,
  MOCK_REGIONS,
  MOCK_RISK_SCORES,
} from '@/services/population-health/mock-data';
import type {
  CloseCareGapInput,
  CreateCohortInput,
  LaunchCampaignInput,
  PhmFavorite,
  PhmFilters,
} from '@/services/population-health/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class PopulationHealthRepository {
  private careGaps = [...MOCK_CARE_GAPS];
  private cohorts = [...MOCK_COHORTS];
  private campaigns = [...MOCK_CAMPAIGNS];
  private favorites: PhmFavorite[] = [];
  private nextId = 500000;

  getPopulation(filters?: PhmFilters) {
    let items = MOCK_POPULATION;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.riskTier)
      items = items.filter((p) => p.riskTier === filters.riskTier);
    if (filters?.q)
      items = items.filter((p) =>
        matchQ(filters.q, p.patientName, p.primaryCondition),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getHighRiskPatients(filters?: PhmFilters) {
    let items = MOCK_POPULATION.filter(
      (p) => p.riskTier === 'high' || p.riskTier === 'rising',
    );
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRegistries(filters?: PhmFilters) {
    let items = MOCK_REGISTRIES;
    if (filters?.facilityId)
      items = items.filter(
        (r) => !r.facilityId || r.facilityId === filters.facilityId,
      );
    if (filters?.registryType)
      items = filterByRegistryType(items, filters.registryType);
    if (filters?.q) items = items.filter((r) => matchQ(filters.q, r.name));
    return paginate(
      sortRegistriesByGap(items),
      filters?.page,
      filters?.pageSize,
    );
  }

  getCareGaps(filters?: PhmFilters) {
    let items = this.careGaps;
    if (filters?.facilityId)
      items = items.filter((g) => g.facilityId === filters.facilityId);
    if (filters?.gapType)
      items = items.filter((g) => g.type === filters.gapType);
    if (filters?.status)
      items = items.filter((g) => g.status === filters.status);
    if (filters?.q)
      items = items.filter((g) => matchQ(filters.q, g.patientName, g.title));
    return paginate(
      [...items].sort((a, b) => gapPriority(b) - gapPriority(a)),
      filters?.page,
      filters?.pageSize,
    );
  }

  getRiskScores(filters?: PhmFilters) {
    let items = MOCK_RISK_SCORES;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.riskTier)
      items = items.filter((s) => s.tier === filters.riskTier);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCohorts(filters?: PhmFilters) {
    let items = this.cohorts;
    if (filters?.facilityId)
      items = items.filter(
        (c) => !c.facilityId || c.facilityId === filters.facilityId,
      );
    if (filters?.q)
      items = items.filter((c) => matchQ(filters.q, c.name, c.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getChronicPrograms(filters?: PhmFilters) {
    let items = MOCK_CHRONIC_PROGRAMS;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getPreventiveCare(filters?: PhmFilters) {
    let items = MOCK_PREVENTIVE;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOutreach(filters?: PhmFilters) {
    let items = this.campaigns;
    if (filters?.facilityId)
      items = items.filter(
        (c) => !c.facilityId || c.facilityId === filters.facilityId,
      );
    if (filters?.status)
      items = items.filter((c) => c.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCommunityHealth(filters?: PhmFilters) {
    let items = MOCK_COMMUNITY;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.regionId)
      items = items.filter((c) => c.regionId === filters.regionId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getGeographicRegions() {
    return MOCK_REGIONS;
  }

  createCohort(input: CreateCohortInput) {
    const criteria = parseCriteriaString(input.criteria);
    const members = buildCohortFromCriteria(
      MOCK_POPULATION.filter(
        (p) => !input.facilityId || p.facilityId === input.facilityId,
      ),
      criteria,
    );
    const cohort = {
      cohortId: `coh-${String(++this.nextId)}`,
      name: input.name,
      description: input.description,
      facilityId: input.facilityId,
      memberCount: members.length,
      criteria: input.criteria,
      createdAt: new Date().toISOString(),
      dynamic: input.dynamic ?? true,
    };
    this.cohorts.unshift(cohort);
    return cohort;
  }

  launchCampaign(input: LaunchCampaignInput) {
    const campaign = {
      campaignId: `camp-${String(++this.nextId)}`,
      name: input.name,
      channel: input.channel,
      status: 'scheduled' as const,
      facilityId: input.facilityId,
      targetCount: input.targetCount,
      sentCount: 0,
      responseRate: 0,
      scheduledDate: input.scheduledDate,
      cohortId: input.cohortId,
    };
    this.campaigns.unshift(campaign);
    return campaign;
  }

  closeCareGap(input: CloseCareGapInput) {
    const idx = this.careGaps.findIndex((g) => g.gapId === input.gapId);
    if (idx < 0) return null;
    this.careGaps[idx]!.status = 'closed';
    return this.careGaps[idx];
  }

  dashboard(facilityId?: string) {
    return buildPhmDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computePopulationAnalytics(facilityId);
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const matches = (...fields: (string | undefined)[]) =>
      fields.some((f) => f?.toLowerCase().includes(q));
    const scoped = <T extends { facilityId?: string }>(items: T[]) =>
      items.filter((item) => !facilityId || item.facilityId === facilityId);

    return {
      population: scoped(MOCK_POPULATION)
        .filter((p) => matches(p.patientName, p.primaryCondition))
        .slice(0, 12),
      gaps: scoped(this.careGaps)
        .filter((g) => matches(g.title, g.patientName))
        .slice(0, 12),
      registries: scoped(MOCK_REGISTRIES)
        .filter((r) => matches(r.name))
        .slice(0, 12),
      cohorts: scoped(this.cohorts)
        .filter((c) => matches(c.name, c.description))
        .slice(0, 12),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.careGaps.length + MOCK_POPULATION.length,
    };
  }

  favorite(
    userId: string,
    entityType: PhmFavorite['entityType'],
    entityId: string,
  ) {
    const fav: PhmFavorite = {
      favoriteId: `fav-${String(++this.nextId)}`,
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.unshift(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }
}

export const populationHealthRepository = new PopulationHealthRepository();
