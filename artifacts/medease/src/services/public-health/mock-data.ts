import { PROGRAM_CATEGORIES } from '@/services/public-health/community-programs';
import { VACCINES } from '@/services/public-health/immunization';
import { REPORTABLE_DISEASES } from '@/services/public-health/surveillance';
import { SDOH_DOMAINS } from '@/services/public-health/sdoh';
import type {
  ChildHealthRecord,
  CommunityMember,
  CommunityProgram,
  ContactTracingRecord,
  DiseaseCase,
  EnvironmentalInspection,
  ImmunizationRecord,
  ImmunizationRegistry,
  MaternalRecord,
  OccupationalAssessment,
  OutbreakInvestigation,
  PublicHealthDashboard,
  SchoolHealthScreening,
  SdohAssessment,
} from '@/services/public-health/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => `fac-${String(i + 1).padStart(3, '0')}`);
const SCALE = { cases: 100, members: 300, immunizations: 300, contacts: 200 };

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_COMMUNITY_MEMBERS: CommunityMember[] = Array.from({ length: 500 }, (_, i) => ({
  memberId: `cm-${String(i + 1).padStart(5, '0')}`,
  patientId: `phr-${String((i % 5000) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  name: `Community Member ${(i % 200) + 1}`,
  age: 5 + (i % 75),
  zipCode: `${10000 + (i % 900)}`,
  riskLevel: (['low', 'moderate', 'high'] as const)[i % 3]!,
  enrolledPrograms: i % 3 === 0 ? [`prog-${String((i % 50) + 1).padStart(3, '0')}`] : [],
}));

export const MOCK_OUTBREAKS: OutbreakInvestigation[] = Array.from({ length: 40 }, (_, i) => {
  const status = (['monitoring', 'investigation', 'containment', 'resolved'] as const)[i % 4]!;
  return {
    outbreakId: `ob-${String(i + 1).padStart(4, '0')}`,
    name: `${REPORTABLE_DISEASES[i % REPORTABLE_DISEASES.length]} Outbreak ${(i % 10) + 1}`,
    disease: REPORTABLE_DISEASES[i % REPORTABLE_DISEASES.length]!,
    facilityId: FACILITIES[i % 25]!,
    status,
    caseCount: 3 + (i % 30),
    startedAt: daysAgo(60 - (i % 45)),
    resolvedAt: status === 'resolved' ? daysAgo(i % 10) : undefined,
    leadInvestigatorId: `prov-${String((i % 100) + 1).padStart(4, '0')}`,
  };
});

export const MOCK_DISEASE_CASES: DiseaseCase[] = Array.from({ length: 300 }, (_, i) => {
  const disease = REPORTABLE_DISEASES[i % REPORTABLE_DISEASES.length]!;
  const status = (['suspected', 'confirmed', 'probable', 'ruled_out', 'closed'] as const)[i % 5]!;
  return {
    caseId: `case-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    disease,
    icd10Code: `A${String(i % 99).padStart(2, '0')}`,
    status,
    reportedAt: daysAgo(i % 90),
    investigatedAt: status !== 'suspected' ? daysAgo(i % 85) : undefined,
    outbreakId: i % 4 === 0 ? MOCK_OUTBREAKS[i % 40]!.outbreakId : undefined,
    labResultId: i % 3 === 0 ? `lab-${String((i % 2000) + 1).padStart(5, '0')}` : undefined,
    providerId: `prov-${String((i % 200) + 1).padStart(4, '0')}`,
  };
});

export const MOCK_CONTACT_TRACING: ContactTracingRecord[] = Array.from({ length: 200 }, (_, i) => {
  const caseRecord = MOCK_DISEASE_CASES[i % 300]!;
  const status = (['identified', 'notified', 'monitoring', 'quarantined', 'cleared'] as const)[i % 5]!;
  return {
    contactId: `ct-${String(i + 1).padStart(5, '0')}`,
    caseId: caseRecord.caseId,
    patientId: caseRecord.patientId,
    facilityId: caseRecord.facilityId,
    contactName: `Contact ${(i % 50) + 1}`,
    exposureDate: daysAgo(i % 30 + 5),
    status,
    lastContactAt: daysAgo(i % 20),
    providerId: caseRecord.providerId,
  };
});

export const MOCK_IMMUNIZATIONS: ImmunizationRecord[] = Array.from({ length: 400 }, (_, i) => {
  const vaccine = VACCINES[i % VACCINES.length]!;
  const status = (['scheduled', 'administered', 'overdue', 'declined'] as const)[i % 4]!;
  return {
    immunizationId: `imm-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 4000) + 1).padStart(4, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    vaccine,
    cvxCode: `${10 + (i % 90)}`,
    doseNumber: (i % 3) + 1,
    status,
    administeredAt: status === 'administered' ? daysAgo(i % 365) : undefined,
    dueDate: status !== 'administered' ? daysAgo(-(i % 30)) : undefined,
    medicationId: i % 2 === 0 ? `med-${String((i % 500) + 1).padStart(4, '0')}` : undefined,
    appointmentId: i % 3 === 0 ? `appt-${String((i % 3000) + 1).padStart(5, '0')}` : undefined,
  };
});

export const MOCK_REGISTRIES: ImmunizationRegistry[] = Array.from({ length: 10 }, (_, i) => ({
  registryId: `reg-${String(i + 1).padStart(3, '0')}`,
  name: `Regional Immunization Registry ${i + 1}`,
  facilityId: FACILITIES[i % 25]!,
  jurisdiction: ['State', 'County', 'Regional', 'National'][i % 4]!,
  memberCount: 5000 + (i % 20) * 1000,
  coverageRate: 75 + (i % 20),
}));

export const MOCK_COMMUNITY_PROGRAMS: CommunityProgram[] = Array.from({ length: 50 }, (_, i) => ({
  programId: `prog-${String(i + 1).padStart(3, '0')}`,
  name: `${PROGRAM_CATEGORIES[i % PROGRAM_CATEGORIES.length]} Program ${(i % 12) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  category: PROGRAM_CATEGORIES[i % PROGRAM_CATEGORIES.length]!,
  status: (['planning', 'active', 'completed', 'paused'] as const)[i % 4]!,
  enrolledCount: 50 + (i % 40) * 10,
  targetPopulation: 200 + (i % 30) * 50,
  startDate: daysAgo(180 - (i % 120)),
  carePlanId: i % 4 === 0 ? `cp-${String((i % 100) + 1).padStart(4, '0')}` : undefined,
}));

export const MOCK_MATERNAL: MaternalRecord[] = Array.from({ length: 80 }, (_, i) => ({
  recordId: `mat-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 800) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  gestationalWeeks: 8 + (i % 32),
  riskLevel: (['low', 'moderate', 'high'] as const)[i % 3]!,
  lastVisitAt: daysAgo(i % 30),
  nextVisitAt: daysAgo(-(i % 14)),
  providerId: `prov-${String((i % 100) + 1).padStart(4, '0')}`,
}));

export const MOCK_CHILD_HEALTH: ChildHealthRecord[] = Array.from({ length: 150 }, (_, i) => ({
  recordId: `ch-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 1500) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  ageMonths: 1 + (i % 216),
  wellnessStatus: (['on_track', 'at_risk', 'referral_needed'] as const)[i % 3]!,
  lastVisitAt: daysAgo(i % 90),
  immunizationUpToDate: i % 5 !== 0,
}));

export const MOCK_SCHOOL_SCREENINGS: SchoolHealthScreening[] = Array.from({ length: 100 }, (_, i) => ({
  screeningId: `sch-${String(i + 1).padStart(4, '0')}`,
  schoolName: `School ${(i % 25) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  studentCount: 200 + (i % 10) * 50,
  screenedCount: 150 + (i % 10) * 40,
  referralCount: i % 8,
  screeningDate: daysAgo(i % 180),
}));

export const MOCK_OCCUPATIONAL: OccupationalAssessment[] = Array.from({ length: 50 }, (_, i) => ({
  assessmentId: `occ-${String(i + 1).padStart(4, '0')}`,
  employeeId: `emp-${String(i + 1).padStart(4, '0')}`,
  patientId: `phr-${String((i % 500) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  employer: `Employer ${(i % 15) + 1}`,
  assessmentType: ['Pre-employment', 'Annual', 'Return-to-work', 'Fit-for-duty'][i % 4]!,
  result: (['cleared', 'restricted', 'referral'] as const)[i % 3]!,
  assessedAt: daysAgo(i % 120),
}));

export const MOCK_ENVIRONMENTAL: EnvironmentalInspection[] = Array.from({ length: 60 }, (_, i) => ({
  inspectionId: `env-${String(i + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  siteName: `Site ${(i % 20) + 1}`,
  inspectionType: ['Food Service', 'Water Quality', 'Air Quality', 'Waste Management', 'Housing'][i % 5]!,
  status: (['scheduled', 'passed', 'failed', 'follow_up_required'] as const)[i % 4]!,
  inspectedAt: daysAgo(i % 90),
  score: 60 + (i % 40),
}));

export const MOCK_SDOH: SdohAssessment[] = Array.from({ length: 200 }, (_, i) => {
  const score = 10 + (i % 90);
  return {
    assessmentId: `sdoh-${String(i + 1).padStart(5, '0')}`,
    patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    domain: SDOH_DOMAINS[i % SDOH_DOMAINS.length]!,
    score,
    riskLevel: score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low',
    assessedAt: daysAgo(i % 180),
    interventionNeeded: score >= 50,
  };
});

export const MOCK_PH_AUDIT = Array.from({ length: 100 }, (_, i) => ({
  auditId: `phaudit-${String(i + 1).padStart(4, '0')}`,
  action: ['register_case', 'create_outbreak', 'record_immunization', 'assign_contact', 'record_sdoh'][i % 5]!,
  actorId: `user-${String((i % 50) + 1).padStart(3, '0')}`,
  resourceType: ['case', 'outbreak', 'immunization', 'contact', 'sdoh'][i % 5]!,
  resourceId: `res-${String(i + 1).padStart(4, '0')}`,
  timestamp: daysAgo(i % 60),
  facilityId: FACILITIES[i % 25],
  outcome: i % 12 === 0 ? 'failure' as const : 'success' as const,
}));

export function buildPublicHealthDashboard(facilityId?: string): PublicHealthDashboard {
  const cases = facilityId ? MOCK_DISEASE_CASES.filter((c) => c.facilityId === facilityId) : MOCK_DISEASE_CASES;
  const outbreaks = facilityId ? MOCK_OUTBREAKS.filter((o) => o.facilityId === facilityId) : MOCK_OUTBREAKS;
  const immunizations = facilityId ? MOCK_IMMUNIZATIONS.filter((i) => i.facilityId === facilityId) : MOCK_IMMUNIZATIONS;
  const contacts = facilityId ? MOCK_CONTACT_TRACING.filter((c) => c.facilityId === facilityId) : MOCK_CONTACT_TRACING;
  const programs = facilityId ? MOCK_COMMUNITY_PROGRAMS.filter((p) => p.facilityId === facilityId) : MOCK_COMMUNITY_PROGRAMS;
  const sdoh = facilityId ? MOCK_SDOH.filter((s) => s.facilityId === facilityId) : MOCK_SDOH;

  const diseaseCounts = REPORTABLE_DISEASES.map((d) => ({
    label: d,
    value: cases.filter((c) => c.disease === d && c.status !== 'closed').length * SCALE.cases,
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return {
    activeCases: cases.filter((c) => c.status === 'confirmed' || c.status === 'probable' || c.status === 'suspected').length * SCALE.cases,
    activeOutbreaks: outbreaks.filter((o) => o.status !== 'resolved').length * 20,
    immunizationsDue: immunizations.filter((i) => i.status === 'overdue' || i.status === 'scheduled').length * SCALE.immunizations,
    contactsMonitoring: contacts.filter((c) => c.status === 'monitoring' || c.status === 'quarantined').length * SCALE.contacts,
    communityProgramsActive: programs.filter((p) => p.status === 'active').length * 10,
    sdohHighRisk: sdoh.filter((s) => s.riskLevel === 'high').length * 300,
    caseTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: Math.round(cases.length / 6 + i * (cases.length / 15)),
    })),
    topDiseases: diseaseCounts,
    recentOutbreaks: [...outbreaks].filter((o) => o.status !== 'resolved').slice(0, 5),
  };
}
