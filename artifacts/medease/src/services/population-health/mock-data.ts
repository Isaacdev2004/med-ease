import type {
  CareGap,
  ChronicProgram,
  CommunityProgram,
  DiseaseRegistry,
  GeographicRegion,
  OutreachCampaign,
  PatientCohort,
  PhmDashboard,
  PopulationMember,
  PreventiveCareItem,
  RiskScore,
} from '@/services/population-health/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => `fac-${String(i + 1).padStart(3, '0')}`);
const REGIONS = Array.from({ length: 50 }, (_, i) => ({
  id: `reg-${String(i + 1).padStart(3, '0')}`,
  zip: `${75000 + i}`,
  name: `Region ${i + 1}`,
}));

const REGISTRY_TYPES = ['diabetes', 'hypertension', 'chf', 'copd', 'oncology', 'pregnancy', 'pediatrics', 'mental_health', 'high_risk'] as const;
const GAP_TYPES = ['annual_checkup', 'vaccination', 'colonoscopy', 'mammogram', 'pap_smear', 'eye_exam', 'hba1c', 'lipid_profile', 'medication_review', 'follow_up'] as const;
const RISK_TIERS = ['high', 'rising', 'moderate', 'low'] as const;

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0]!;
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0]!;
}

export const MOCK_REGISTRIES: DiseaseRegistry[] = Array.from({ length: 100 }, (_, i) => {
  const type = REGISTRY_TYPES[i % REGISTRY_TYPES.length]!;
  return {
    registryId: `reg-${String(i + 1).padStart(4, '0')}`,
    name: `${type.replace('_', ' ')} Registry ${(i % 10) + 1}`,
    type,
    facilityId: FACILITIES[i % 25],
    memberCount: 500 + (i % 200) * 50,
    openGaps: 20 + (i % 80),
    avgRiskScore: 2 + (i % 8),
    complianceRate: 60 + (i % 35),
  };
});

export const MOCK_POPULATION: PopulationMember[] = Array.from({ length: 8000 }, (_, i) => {
  const tier = RISK_TIERS[i % RISK_TIERS.length]!;
  return {
    memberId: `pm-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 5000) + 1).padStart(4, '0')}`,
    patientName: `Patient ${(i % 5000) + 1}`,
    age: 18 + (i % 82),
    gender: i % 2 === 0 ? 'F' : 'M',
    facilityId: FACILITIES[i % 25]!,
    primaryCondition: ['Diabetes', 'Hypertension', 'CHF', 'COPD', 'Asthma'][i % 5],
    riskTier: tier,
    openGaps: i % 5,
    lastVisit: i % 4 === 0 ? undefined : daysAgo(i % 365),
    registryIds: [`reg-${String((i % 100) + 1).padStart(4, '0')}`],
    regionId: REGIONS[i % 50]!.id,
  };
});

export const MOCK_CARE_GAPS: CareGap[] = Array.from({ length: 12000 }, (_, i) => {
  const type = GAP_TYPES[i % GAP_TYPES.length]!;
  const overdue = i % 4 === 0 ? 30 + (i % 60) : 0;
  return {
    gapId: `gap-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 5000) + 1).padStart(4, '0')}`,
    patientName: `Patient ${(i % 5000) + 1}`,
    facilityId: FACILITIES[i % 25]!,
    type,
    title: `${type.replace(/_/g, ' ')} due`,
    status: overdue > 0 ? 'overdue' as const : (['open', 'in_progress', 'closed'] as const)[i % 3]!,
    dueDate: daysFromNow(30 - overdue),
    daysOverdue: overdue,
    priority: overdue > 30 ? 'high' as const : overdue > 0 ? 'medium' as const : 'low' as const,
    registryType: REGISTRY_TYPES[i % REGISTRY_TYPES.length],
  };
});

export const MOCK_RISK_SCORES: RiskScore[] = Array.from({ length: 6000 }, (_, i) => {
  const types = ['charlson', 'hcc', 'lace', 'readmission', 'mortality'] as const;
  const scoreType = types[i % types.length]!;
  const score = 1 + (i % 10);
  const tier = score >= 8 ? 'high' as const : score >= 6 ? 'rising' as const : score >= 4 ? 'moderate' as const : 'low' as const;
  return {
    scoreId: `rs-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 5000) + 1).padStart(4, '0')}`,
    patientName: `Patient ${(i % 5000) + 1}`,
    facilityId: FACILITIES[i % 25]!,
    scoreType,
    score,
    tier,
    calculatedAt: daysAgo(i % 30),
    factors: ['Age', 'Comorbidities', 'Utilization'].slice(0, 1 + (i % 3)),
  };
});

export const MOCK_COHORTS: PatientCohort[] = Array.from({ length: 200 }, (_, i) => ({
  cohortId: `coh-${String(i + 1).padStart(4, '0')}`,
  name: `Cohort ${i + 1}`,
  description: 'Dynamic population cohort',
  facilityId: FACILITIES[i % 25],
  memberCount: 100 + (i % 50) * 20,
  criteria: 'Age > 60 AND Diabetes AND HbA1c > 8 AND No appointment in 6 months',
  createdAt: daysAgo(i % 180),
  dynamic: i % 3 !== 0,
}));

export const MOCK_CHRONIC_PROGRAMS: ChronicProgram[] = Array.from({ length: 60 }, (_, i) => {
  const types = ['diabetes', 'hypertension', 'heart_failure', 'ckd', 'asthma', 'copd'] as const;
  return {
    programId: `cp-${String(i + 1).padStart(3, '0')}`,
    name: `${types[i % types.length]!.replace('_', ' ')} Management Program`,
    type: types[i % types.length]!,
    facilityId: FACILITIES[i % 25]!,
    enrolledCount: 200 + (i % 100) * 10,
    activeCount: 150 + (i % 80) * 5,
    completionRate: 65 + (i % 30),
    avgOutcomeScore: 70 + (i % 25),
  };
});

export const MOCK_PREVENTIVE: PreventiveCareItem[] = Array.from({ length: 80 }, (_, i) => {
  const cats = ['vaccination', 'screening', 'wellness', 'lifestyle'] as const;
  const eligible = 1000 + (i % 50) * 100;
  const completed = Math.round(eligible * (0.5 + (i % 40) / 100));
  return {
    preventiveId: `prev-${String(i + 1).padStart(4, '0')}`,
    title: ['Flu Vaccine', 'Colonoscopy', 'Wellness Visit', 'Smoking Cessation'][i % 4]!,
    category: cats[i % cats.length]!,
    facilityId: FACILITIES[i % 25]!,
    eligibleCount: eligible,
    completedCount: completed,
    complianceRate: Math.round((completed / eligible) * 100),
  };
});

export const MOCK_CAMPAIGNS: OutreachCampaign[] = Array.from({ length: 300 }, (_, i) => {
  const channels = ['sms', 'email', 'push', 'whatsapp', 'phone'] as const;
  const statuses = ['draft', 'scheduled', 'active', 'completed', 'cancelled'] as const;
  const target = 500 + (i % 100) * 50;
  const sent = Math.round(target * (0.3 + (i % 70) / 100));
  return {
    campaignId: `camp-${String(i + 1).padStart(4, '0')}`,
    name: `Outreach Campaign ${i + 1}`,
    channel: channels[i % channels.length]!,
    status: statuses[i % statuses.length]!,
    facilityId: FACILITIES[i % 25],
    targetCount: target,
    sentCount: sent,
    responseRate: 15 + (i % 40),
    scheduledDate: daysFromNow(i % 30),
    cohortId: `coh-${String((i % 200) + 1).padStart(4, '0')}`,
  };
});

export const MOCK_COMMUNITY: CommunityProgram[] = Array.from({ length: 100 }, (_, i) => ({
  programId: `comm-${String(i + 1).padStart(4, '0')}`,
  name: `Community Health Event ${i + 1}`,
  facilityId: FACILITIES[i % 25]!,
  regionId: REGIONS[i % 50]!.id,
  eventDate: daysFromNow(i % 60),
  attendees: 50 + (i % 200),
  sdohFocus: ['Food insecurity', 'Transportation', 'Housing', 'Education'][i % 4],
  healthEquityScore: 60 + (i % 35),
}));

export const MOCK_REGIONS: GeographicRegion[] = REGIONS.map((r, i) => ({
  regionId: r.id,
  name: r.name,
  zipCode: r.zip,
  patientCount: 500 + (i % 100) * 50,
  prevalenceRate: 5 + (i % 15),
  gapRate: 10 + (i % 20),
  readmissionRate: 8 + (i % 12),
}));

export function buildPhmDashboard(facilityId?: string): PhmDashboard {
  const population = facilityId ? MOCK_POPULATION.filter((p) => p.facilityId === facilityId) : MOCK_POPULATION;
  const gaps = facilityId ? MOCK_CARE_GAPS.filter((g) => g.facilityId === facilityId) : MOCK_CARE_GAPS;
  const registries = facilityId ? MOCK_REGISTRIES.filter((r) => r.facilityId === facilityId) : MOCK_REGISTRIES;
  const preventive = facilityId ? MOCK_PREVENTIVE.filter((p) => p.facilityId === facilityId) : MOCK_PREVENTIVE;
  const campaigns = facilityId ? MOCK_CAMPAIGNS.filter((c) => c.facilityId === facilityId) : MOCK_CAMPAIGNS;

  const scale = facilityId ? 1 : 1 / 25;
  return {
    facilityId,
    totalPopulation: Math.round(population.length * scale) || Math.round(MOCK_POPULATION.length / 25),
    openCareGaps: gaps.filter((g) => g.status !== 'closed').length * scale,
    highRiskCount: population.filter((p) => p.riskTier === 'high').length * scale,
    risingRiskCount: population.filter((p) => p.riskTier === 'rising').length * scale,
    registryEnrollment: registries.reduce((s, r) => s + r.memberCount, 0) * scale,
    preventiveCompliance: preventive.length
      ? Math.round(preventive.reduce((s, p) => s + p.complianceRate, 0) / preventive.length)
      : 78,
    readmissionRate: 12.4,
    outreachActive: campaigns.filter((c) => c.status === 'active').length,
    recentGaps: gaps.filter((g) => g.priority === 'high').slice(0, 8),
    riskDistribution: RISK_TIERS.map((tier) => ({
      tier,
      count: Math.round(population.filter((p) => p.riskTier === tier).length * scale),
    })),
    topRegistries: registries.slice(0, 6),
  };
}
