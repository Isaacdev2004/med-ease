import {
  THERAPEUTIC_AREAS,
  TRIAL_PHASES,
  TRIAL_STATUSES,
} from '@/services/research/clinical-trials';
import { SPECIMEN_TYPES } from '@/services/research/biospecimens';
import { INNOVATION_CATEGORIES } from '@/services/research/innovation';
import type {
  AdverseEvent,
  Biospecimen,
  ClinicalTrial,
  ConsentRecord,
  Coordinator,
  GrantApplication,
  InnovationProject,
  Investigator,
  ProtocolDeviation,
  Publication,
  RegulatorySubmission,
  ResearchAuditLog,
  ResearchDashboard,
  ResearchParticipant,
  StudySite,
  StudyVisit,
} from '@/services/research/types';

const FACILITIES = Array.from(
  { length: 25 },
  (_, i) => `fac-${String(i + 1).padStart(3, '0')}`,
);
const SCALE = {
  trials: 5,
  participants: 50,
  visits: 20,
  ae: 5,
  specimens: 5,
  audit: 5,
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_TRIALS: ClinicalTrial[] = Array.from(
  { length: 120 },
  (_, i) => {
    const phase = TRIAL_PHASES[i % TRIAL_PHASES.length]!;
    const status = TRIAL_STATUSES[i % TRIAL_STATUSES.length]!;
    const target = 50 + (i % 20) * 25;
    const current = Math.min(
      target,
      Math.round(target * (0.3 + (i % 7) * 0.1)),
    );
    return {
      trialId: `trial-${String(i + 1).padStart(4, '0')}`,
      nctId: i % 3 === 0 ? `NCT${String(10000000 + i)}` : undefined,
      title: `${THERAPEUTIC_AREAS[i % THERAPEUTIC_AREAS.length]} Study ${(i % 30) + 1} — Phase ${phase}`,
      phase,
      status,
      facilityId: FACILITIES[i % 25]!,
      principalInvestigatorId: `inv-${String((i % 80) + 1).padStart(3, '0')}`,
      sponsor: [
        'NIH',
        'PharmaCorp',
        'BioMed Inc',
        'University Consortium',
        'WHO',
      ][i % 5]!,
      therapeuticArea: THERAPEUTIC_AREAS[i % THERAPEUTIC_AREAS.length]!,
      targetEnrollment: target,
      currentEnrollment: current,
      startDate: daysAgo(180 - (i % 120)),
      endDate: status === 'completed' ? daysAgo(i % 30) : undefined,
      carePlanId:
        i % 4 === 0
          ? `cp-${String((i % 200) + 1).padStart(4, '0')}`
          : undefined,
      fhirResearchStudyId: `rs-${String(i + 1).padStart(4, '0')}`,
    };
  },
);

export const MOCK_INVESTIGATORS: Investigator[] = Array.from(
  { length: 80 },
  (_, i) => ({
    investigatorId: `inv-${String(i + 1).padStart(3, '0')}`,
    name: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8]}, ${['A', 'B', 'C', 'D', 'E', 'F'][i % 6]}.`,
    specialty: THERAPEUTIC_AREAS[i % THERAPEUTIC_AREAS.length]!,
    facilityId: FACILITIES[i % 25]!,
    providerId: `prov-${String((i % 500) + 1).padStart(4, '0')}`,
    activeTrials: 1 + (i % 6),
    email: `investigator${i + 1}@medease.local`,
  }),
);

export const MOCK_COORDINATORS: Coordinator[] = Array.from(
  { length: 30 },
  (_, i) => ({
    coordinatorId: `coord-${String(i + 1).padStart(3, '0')}`,
    name: `Coordinator ${i + 1}`,
    facilityId: FACILITIES[i % 25]!,
    activeTrials: 2 + (i % 4),
    email: `coordinator${i + 1}@medease.local`,
  }),
);

export const MOCK_SITES: StudySite[] = Array.from({ length: 40 }, (_, i) => ({
  siteId: `site-${String(i + 1).padStart(3, '0')}`,
  name: `Research Site ${(i % 15) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  trialIds: [
    MOCK_TRIALS[i % 120]!.trialId,
    MOCK_TRIALS[(i + 5) % 120]!.trialId,
  ],
  coordinatorId: MOCK_COORDINATORS[i % 30]!.coordinatorId,
  enrollmentTarget: 30 + (i % 10) * 10,
  currentEnrollment: 10 + (i % 20),
  status: (['active', 'active', 'inactive', 'pending'] as const)[i % 4]!,
}));

export const MOCK_PARTICIPANTS: ResearchParticipant[] = Array.from(
  { length: 500 },
  (_, i) => {
    const trial = MOCK_TRIALS[i % 120]!;
    const statuses = [
      'screening',
      'enrolled',
      'active',
      'completed',
      'withdrawn',
      'screen_failed',
    ] as const;
    const status = statuses[i % 6]!;
    return {
      participantId: `part-${String(i + 1).padStart(5, '0')}`,
      trialId: trial.trialId,
      patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
      facilityId: trial.facilityId,
      status,
      enrolledAt:
        status !== 'screening' && status !== 'screen_failed'
          ? daysAgo(i % 90)
          : undefined,
      randomizationArm:
        status === 'enrolled' || status === 'active'
          ? ['control', 'intervention_a', 'intervention_b'][i % 3]
          : undefined,
      consentStatus: (
        ['pending', 'signed', 'signed', 'withdrawn', 'expired'] as const
      )[i % 5]!,
      providerId: `prov-${String((i % 500) + 1).padStart(4, '0')}`,
      appointmentId:
        i % 3 === 0
          ? `appt-${String((i % 5000) + 1).padStart(5, '0')}`
          : undefined,
    };
  },
);

export const MOCK_VISITS: StudyVisit[] = Array.from(
  { length: 2000 },
  (_, i) => {
    const participant = MOCK_PARTICIPANTS[i % 500]!;
    const visitNum = (i % 12) + 1;
    const statuses = [
      'scheduled',
      'completed',
      'missed',
      'cancelled',
      'in_progress',
    ] as const;
    const status = statuses[i % 5]!;
    return {
      visitId: `visit-${String(i + 1).padStart(5, '0')}`,
      trialId: participant.trialId,
      participantId: participant.participantId,
      facilityId: participant.facilityId,
      visitNumber: visitNum,
      visitName: `Visit ${visitNum}${visitNum === 1 ? ' (Screening)' : visitNum === 12 ? ' (Close-out)' : ''}`,
      scheduledAt: daysAgo(60 - (i % 60)),
      completedAt: status === 'completed' ? daysAgo(59 - (i % 60)) : undefined,
      status,
      appointmentId: `appt-${String((i % 5000) + 1).padStart(5, '0')}`,
      providerId: participant.providerId,
    };
  },
);

export const MOCK_CONSENTS: ConsentRecord[] = MOCK_PARTICIPANTS.filter(
  (p) => p.consentStatus !== 'pending',
).map((p, i) => ({
  consentId: `consent-${String(i + 1).padStart(5, '0')}`,
  participantId: p.participantId,
  trialId: p.trialId,
  facilityId: p.facilityId,
  version: `v${1 + (i % 3)}.0`,
  status: p.consentStatus,
  signedAt: p.consentStatus === 'signed' ? daysAgo(i % 60) : undefined,
  method: (['econsent', 'paper', 'econsent', 'verbal'] as const)[i % 4]!,
}));

export const MOCK_DEVIATIONS: ProtocolDeviation[] = Array.from(
  { length: 200 },
  (_, i) => ({
    deviationId: `dev-${String(i + 1).padStart(4, '0')}`,
    trialId: MOCK_TRIALS[i % 120]!.trialId,
    participantId:
      i % 3 === 0 ? MOCK_PARTICIPANTS[i % 500]!.participantId : undefined,
    facilityId: FACILITIES[i % 25]!,
    description: `Protocol deviation ${(i % 20) + 1}: ${['Visit window exceeded', 'Dose modification', 'Missing assessment', 'Inclusion criteria waiver'][i % 4]}`,
    severity: (['minor', 'major', 'critical'] as const)[i % 3]!,
    status: (['open', 'under_review', 'closed'] as const)[i % 3]!,
    reportedAt: daysAgo(i % 90),
    closedAt: i % 3 === 2 ? daysAgo(i % 30) : undefined,
  }),
);

export const MOCK_ADVERSE_EVENTS: AdverseEvent[] = Array.from(
  { length: 300 },
  (_, i) => {
    const participant = MOCK_PARTICIPANTS[i % 500]!;
    const severities = [
      'mild',
      'moderate',
      'severe',
      'life_threatening',
      'fatal',
    ] as const;
    const severity = severities[i % 5]!;
    const serious =
      severity === 'life_threatening' || severity === 'fatal' || i % 10 === 0;
    return {
      eventId: `ae-${String(i + 1).padStart(4, '0')}`,
      trialId: participant.trialId,
      participantId: participant.participantId,
      facilityId: participant.facilityId,
      description: `Adverse event ${(i % 15) + 1}: ${['Headache', 'Nausea', 'Rash', 'Fatigue', 'Hypertension', 'Anaphylaxis'][i % 6]}`,
      severity,
      serious,
      status: (['reported', 'under_review', 'submitted', 'closed'] as const)[
        i % 4
      ]!,
      reportedAt: daysAgo(i % 60),
      medicationId:
        i % 4 === 0
          ? `med-${String((i % 800) + 1).padStart(4, '0')}`
          : undefined,
      labResultId:
        i % 5 === 0
          ? `lab-${String((i % 2000) + 1).padStart(5, '0')}`
          : undefined,
    };
  },
);

export const MOCK_BIOSPECIMENS: Biospecimen[] = Array.from(
  { length: 600 },
  (_, i) => {
    const participant = MOCK_PARTICIPANTS[i % 500]!;
    const statuses = [
      'collected',
      'processed',
      'stored',
      'shipped',
      'analyzed',
      'disposed',
    ] as const;
    return {
      specimenId: `spec-${String(i + 1).padStart(5, '0')}`,
      trialId: participant.trialId,
      participantId: participant.participantId,
      facilityId: participant.facilityId,
      type: SPECIMEN_TYPES[i % SPECIMEN_TYPES.length]!,
      status: statuses[i % 6]!,
      collectedAt: daysAgo(i % 120),
      storageLocation: `Freezer ${(i % 10) + 1}-Rack ${(i % 5) + 1}`,
      labResultId:
        i % 3 === 0
          ? `lab-${String((i % 2000) + 1).padStart(5, '0')}`
          : undefined,
    };
  },
);

export const MOCK_PUBLICATIONS: Publication[] = Array.from(
  { length: 100 },
  (_, i) => ({
    publicationId: `pub-${String(i + 1).padStart(4, '0')}`,
    trialId: i % 3 === 0 ? MOCK_TRIALS[i % 120]!.trialId : undefined,
    title: `Research findings on ${THERAPEUTIC_AREAS[i % THERAPEUTIC_AREAS.length]} — Study ${(i % 20) + 1}`,
    journal: ['NEJM', 'Lancet', 'JAMA', 'Nature Medicine', 'BMJ'][i % 5],
    authors: [`Dr. Author ${i + 1}`, `Dr. Co-Author ${(i % 10) + 1}`],
    status: (
      ['draft', 'submitted', 'under_review', 'accepted', 'published'] as const
    )[i % 5]!,
    submittedAt: i % 5 !== 0 ? daysAgo(i % 180) : undefined,
    publishedAt: i % 5 === 4 ? daysAgo(i % 365) : undefined,
    doi: i % 5 === 4 ? `10.1000/pub.${i + 1}` : undefined,
  }),
);

export const MOCK_INNOVATION: InnovationProject[] = Array.from(
  { length: 60 },
  (_, i) => ({
    projectId: `innov-${String(i + 1).padStart(3, '0')}`,
    name: `${INNOVATION_CATEGORIES[i % INNOVATION_CATEGORIES.length]} Initiative ${(i % 12) + 1}`,
    facilityId: FACILITIES[i % 25]!,
    category: INNOVATION_CATEGORIES[i % INNOVATION_CATEGORIES.length]!,
    status: (['ideation', 'pilot', 'scaling', 'deployed', 'archived'] as const)[
      i % 5
    ]!,
    leadInvestigatorId: MOCK_INVESTIGATORS[i % 80]!.investigatorId,
    budget: 50000 + (i % 20) * 25000,
    startDate: daysAgo(365 - (i % 300)),
  }),
);

export const MOCK_GRANTS: GrantApplication[] = Array.from(
  { length: 80 },
  (_, i) => ({
    grantId: `grant-${String(i + 1).padStart(4, '0')}`,
    title: `Grant Application: ${THERAPEUTIC_AREAS[i % THERAPEUTIC_AREAS.length]} Research ${(i % 15) + 1}`,
    facilityId: FACILITIES[i % 25]!,
    trialId: i % 2 === 0 ? MOCK_TRIALS[i % 120]!.trialId : undefined,
    funder: ['NIH', 'NSF', 'CDC', 'Private Foundation', 'EU Horizon'][i % 5]!,
    amount: 100000 + (i % 50) * 50000,
    status: (
      ['draft', 'submitted', 'under_review', 'awarded', 'rejected'] as const
    )[i % 5]!,
    submittedAt: i % 5 !== 0 ? daysAgo(i % 200) : undefined,
  }),
);

export const MOCK_REGULATORY: RegulatorySubmission[] = Array.from(
  { length: 150 },
  (_, i) => ({
    submissionId: `reg-${String(i + 1).padStart(4, '0')}`,
    trialId: MOCK_TRIALS[i % 120]!.trialId,
    facilityId: FACILITIES[i % 25]!,
    type: (['IRB', 'FDA', 'EMA', 'DSMB', 'IND', 'IDE'] as const)[i % 6]!,
    status: (
      ['draft', 'submitted', 'approved', 'rejected', 'amended'] as const
    )[i % 5]!,
    submittedAt: daysAgo(i % 180),
    approvedAt: i % 5 === 2 ? daysAgo(i % 90) : undefined,
  }),
);

export const MOCK_RESEARCH_AUDIT: ResearchAuditLog[] = Array.from(
  { length: 200 },
  (_, i) => ({
    auditId: `raudit-${String(i + 1).padStart(4, '0')}`,
    action: [
      'enroll_participant',
      'record_consent',
      'report_ae',
      'close_deviation',
      'submit_publication',
      'register_specimen',
    ][i % 6]!,
    actorId: `user-${String((i % 100) + 1).padStart(3, '0')}`,
    resourceType: [
      'trial',
      'participant',
      'consent',
      'adverse_event',
      'deviation',
      'publication',
    ][i % 6]!,
    resourceId: `res-${String(i + 1).padStart(4, '0')}`,
    timestamp: daysAgo(i % 60),
    facilityId: FACILITIES[i % 25],
    outcome: i % 10 === 0 ? 'failure' : 'success',
  }),
);

export function buildResearchDashboard(facilityId?: string): ResearchDashboard {
  const trials = facilityId
    ? MOCK_TRIALS.filter((t) => t.facilityId === facilityId)
    : MOCK_TRIALS;
  const participants = facilityId
    ? MOCK_PARTICIPANTS.filter((p) => p.facilityId === facilityId)
    : MOCK_PARTICIPANTS;
  const deviations = facilityId
    ? MOCK_DEVIATIONS.filter((d) => d.facilityId === facilityId)
    : MOCK_DEVIATIONS;
  const consents = facilityId
    ? MOCK_CONSENTS.filter((c) => c.facilityId === facilityId)
    : MOCK_CONSENTS;
  const aes = facilityId
    ? MOCK_ADVERSE_EVENTS.filter((e) => e.facilityId === facilityId)
    : MOCK_ADVERSE_EVENTS;
  const specimens = facilityId
    ? MOCK_BIOSPECIMENS.filter((s) => s.facilityId === facilityId)
    : MOCK_BIOSPECIMENS;
  const pubs = MOCK_PUBLICATIONS;

  const activeTrials = trials.filter(
    (t) => t.status === 'active' || t.status === 'recruiting',
  );
  const enrolledThisMonth = participants.filter(
    (p) => p.enrolledAt && new Date(p.enrolledAt) > new Date(daysAgo(30)),
  ).length;

  return {
    activeTrials: activeTrials.length * SCALE.trials,
    totalParticipants: participants.length * SCALE.participants,
    enrolledThisMonth: enrolledThisMonth * SCALE.participants,
    openDeviations: deviations.filter((d) => d.status === 'open').length * 3,
    pendingConsents:
      consents.filter((c) => c.status === 'pending').length +
      participants.filter((p) => p.consentStatus === 'pending').length,
    seriousAdverseEvents: aes.filter((e) => e.serious).length * SCALE.ae,
    biospecimensStored:
      specimens.filter((s) => s.status === 'stored' || s.status === 'processed')
        .length * SCALE.specimens,
    publicationsThisYear:
      pubs.filter((p) => p.status === 'published').length * 8,
    topTrials: [...trials]
      .sort((a, b) => b.currentEnrollment - a.currentEnrollment)
      .slice(0, 5),
    enrollmentTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({
        label,
        value: Math.round(
          participants.length / 6 + i * (participants.length / 20),
        ),
      }),
    ),
  };
}
