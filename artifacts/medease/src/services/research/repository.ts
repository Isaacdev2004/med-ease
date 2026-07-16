import { computeResearchAnalytics } from '@/services/research/analytics';
import { canCloseDeviation } from '@/services/research/protocol';
import { requiresDsmbReview } from '@/services/research/adverse-events';
import {
  buildResearchDashboard,
  MOCK_ADVERSE_EVENTS,
  MOCK_BIOSPECIMENS,
  MOCK_CONSENTS,
  MOCK_DEVIATIONS,
  MOCK_GRANTS,
  MOCK_INNOVATION,
  MOCK_INVESTIGATORS,
  MOCK_PARTICIPANTS,
  MOCK_PUBLICATIONS,
  MOCK_REGULATORY,
  MOCK_RESEARCH_AUDIT,
  MOCK_SITES,
  MOCK_TRIALS,
  MOCK_VISITS,
} from '@/services/research/mock-data';
import type {
  CloseDeviationInput,
  CreateInnovationInput,
  CreateTrialInput,
  EnrollParticipantInput,
  RecordAdverseEventInput,
  RecordConsentInput,
  RegisterBiospecimenInput,
  ResearchFavorite,
  ResearchFilters,
  ScheduleVisitInput,
  ShareResearchInput,
  SubmitPublicationInput,
} from '@/services/research/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function audit(action: string, resourceType: string, resourceId: string, facilityId?: string) {
  MOCK_RESEARCH_AUDIT.unshift({
    auditId: `raudit-${Date.now()}`,
    action,
    actorId: 'system',
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    facilityId,
    outcome: 'success',
  });
}

class ResearchRepository {
  private trials = [...MOCK_TRIALS];
  private participants = [...MOCK_PARTICIPANTS];
  private visits = [...MOCK_VISITS];
  private consents = [...MOCK_CONSENTS];
  private deviations = [...MOCK_DEVIATIONS];
  private adverseEvents = [...MOCK_ADVERSE_EVENTS];
  private biospecimens = [...MOCK_BIOSPECIMENS];
  private publications = [...MOCK_PUBLICATIONS];
  private innovation = [...MOCK_INNOVATION];
  private favorites: ResearchFavorite[] = [];
  private nextId = 900000;

  dashboard(facilityId?: string) { return buildResearchDashboard(facilityId); }
  analytics(facilityId?: string) { return computeResearchAnalytics(facilityId); }

  getTrials(filters?: ResearchFilters) {
    let items = this.trials;
    if (filters?.facilityId) items = items.filter((t) => t.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((t) => t.trialId === filters.trialId);
    if (filters?.phase) items = items.filter((t) => t.phase === filters.phase);
    if (filters?.status) items = items.filter((t) => t.status === filters.status);
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.title, t.nctId, t.sponsor));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTrial(trialId: string) {
    return this.trials.find((t) => t.trialId === trialId) ?? null;
  }

  getParticipants(filters?: ResearchFilters) {
    let items = this.participants;
    if (filters?.facilityId) items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((p) => p.trialId === filters.trialId);
    if (filters?.patientId) items = items.filter((p) => p.patientId === filters.patientId);
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.participantId, p.patientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getVisits(filters?: ResearchFilters) {
    let items = this.visits;
    if (filters?.facilityId) items = items.filter((v) => v.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((v) => v.trialId === filters.trialId);
    if (filters?.patientId) items = items.filter((v) => MOCK_PARTICIPANTS.find((p) => p.participantId === v.participantId)?.patientId === filters.patientId);
    if (filters?.q) items = items.filter((v) => matchQ(filters.q, v.visitName, v.visitId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInvestigators(filters?: ResearchFilters) {
    let items = MOCK_INVESTIGATORS;
    if (filters?.facilityId) items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((i) => matchQ(filters.q, i.name, i.specialty));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSites(filters?: ResearchFilters) {
    let items = MOCK_SITES;
    if (filters?.facilityId) items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.siteId) items = items.filter((s) => s.siteId === filters.siteId);
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getConsents(filters?: ResearchFilters) {
    let items = this.consents;
    if (filters?.facilityId) items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((c) => c.trialId === filters.trialId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDeviations(filters?: ResearchFilters) {
    let items = this.deviations;
    if (filters?.facilityId) items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((d) => d.trialId === filters.trialId);
    if (filters?.status) items = items.filter((d) => d.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAdverseEvents(filters?: ResearchFilters) {
    let items = this.adverseEvents;
    if (filters?.facilityId) items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((e) => e.trialId === filters.trialId);
    if (filters?.severity) items = items.filter((e) => e.severity === filters.severity);
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.description, e.eventId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSafetyBoard(filters?: ResearchFilters) {
    const items = this.adverseEvents.filter((e) => requiresDsmbReview(e));
    const filtered = filters?.facilityId ? items.filter((e) => e.facilityId === filters.facilityId) : items;
    return paginate(filtered, filters?.page, filters?.pageSize);
  }

  getBiospecimens(filters?: ResearchFilters) {
    let items = this.biospecimens;
    if (filters?.facilityId) items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((s) => s.trialId === filters.trialId);
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.type, s.specimenId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getPublications(filters?: ResearchFilters) {
    let items = this.publications;
    if (filters?.trialId) items = items.filter((p) => p.trialId === filters.trialId);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.title, p.journal));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInnovation(filters?: ResearchFilters) {
    let items = this.innovation;
    if (filters?.facilityId) items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.name, p.category));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getGrants(filters?: ResearchFilters) {
    let items = MOCK_GRANTS;
    if (filters?.facilityId) items = items.filter((g) => g.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((g) => matchQ(filters.q, g.title, g.funder));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRegulatory(filters?: ResearchFilters) {
    let items = MOCK_REGULATORY;
    if (filters?.facilityId) items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.trialId) items = items.filter((r) => r.trialId === filters.trialId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudit(filters?: ResearchFilters) {
    let items = MOCK_RESEARCH_AUDIT;
    if (filters?.facilityId) items = items.filter((a) => a.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createTrial(input: CreateTrialInput) {
    const trial = {
      trialId: `trial-${++this.nextId}`,
      title: input.title,
      phase: input.phase,
      status: 'planning' as const,
      facilityId: input.facilityId,
      principalInvestigatorId: input.principalInvestigatorId,
      sponsor: input.sponsor,
      therapeuticArea: input.therapeuticArea,
      targetEnrollment: input.targetEnrollment,
      currentEnrollment: 0,
      startDate: new Date().toISOString(),
      fhirResearchStudyId: `rs-${this.nextId}`,
    };
    this.trials.unshift(trial);
    audit('create_trial', 'trial', trial.trialId, input.facilityId);
    return trial;
  }

  enrollParticipant(input: EnrollParticipantInput) {
    const participant = {
      participantId: `part-${++this.nextId}`,
      trialId: input.trialId,
      patientId: input.patientId,
      facilityId: input.facilityId,
      status: 'enrolled' as const,
      enrolledAt: new Date().toISOString(),
      randomizationArm: ['control', 'intervention_a', 'intervention_b'][this.nextId % 3],
      consentStatus: 'pending' as const,
      providerId: input.providerId,
    };
    this.participants.unshift(participant);
    const trial = this.trials.find((t) => t.trialId === input.trialId);
    if (trial) trial.currentEnrollment += 1;
    audit('enroll_participant', 'participant', participant.participantId, input.facilityId);
    return participant;
  }

  recordConsent(input: RecordConsentInput) {
    const consent = {
      consentId: `consent-${++this.nextId}`,
      participantId: input.participantId,
      trialId: input.trialId,
      facilityId: input.facilityId,
      version: input.version,
      status: 'signed' as const,
      signedAt: new Date().toISOString(),
      method: input.method,
    };
    this.consents.unshift(consent);
    const p = this.participants.find((x) => x.participantId === input.participantId);
    if (p) p.consentStatus = 'signed';
    audit('record_consent', 'consent', consent.consentId, input.facilityId);
    return consent;
  }

  scheduleVisit(input: ScheduleVisitInput) {
    const visit = {
      visitId: `visit-${++this.nextId}`,
      trialId: input.trialId,
      participantId: input.participantId,
      facilityId: input.facilityId,
      visitNumber: this.visits.filter((v) => v.participantId === input.participantId).length + 1,
      visitName: input.visitName,
      scheduledAt: input.scheduledAt,
      status: 'scheduled' as const,
      appointmentId: input.appointmentId,
    };
    this.visits.unshift(visit);
    audit('schedule_visit', 'visit', visit.visitId, input.facilityId);
    return visit;
  }

  recordAdverseEvent(input: RecordAdverseEventInput) {
    const event = {
      eventId: `ae-${++this.nextId}`,
      trialId: input.trialId,
      participantId: input.participantId,
      facilityId: input.facilityId,
      description: input.description,
      severity: input.severity,
      serious: input.serious,
      status: 'reported' as const,
      reportedAt: new Date().toISOString(),
    };
    this.adverseEvents.unshift(event);
    audit('report_ae', 'adverse_event', event.eventId, input.facilityId);
    return event;
  }

  closeDeviation(input: CloseDeviationInput) {
    const dev = this.deviations.find((d) => d.deviationId === input.deviationId);
    if (!dev || !canCloseDeviation(dev)) throw new Error('Cannot close deviation');
    dev.status = 'closed';
    dev.closedAt = new Date().toISOString();
    audit('close_deviation', 'deviation', dev.deviationId, dev.facilityId);
    return dev;
  }

  submitPublication(input: SubmitPublicationInput) {
    const pub = {
      publicationId: `pub-${++this.nextId}`,
      trialId: input.trialId,
      title: input.title,
      journal: input.journal,
      authors: input.authors,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    };
    this.publications.unshift(pub);
    audit('submit_publication', 'publication', pub.publicationId);
    return pub;
  }

  registerBiospecimen(input: RegisterBiospecimenInput) {
    const specimen = {
      specimenId: `spec-${++this.nextId}`,
      trialId: input.trialId,
      participantId: input.participantId,
      facilityId: input.facilityId,
      type: input.type,
      status: 'collected' as const,
      collectedAt: new Date().toISOString(),
      storageLocation: input.storageLocation,
    };
    this.biospecimens.unshift(specimen);
    audit('register_specimen', 'biospecimen', specimen.specimenId, input.facilityId);
    return specimen;
  }

  createInnovation(input: CreateInnovationInput) {
    const project = {
      projectId: `innov-${++this.nextId}`,
      name: input.name,
      facilityId: input.facilityId,
      category: input.category,
      status: 'ideation' as const,
      leadInvestigatorId: input.leadInvestigatorId,
      budget: input.budget,
      startDate: new Date().toISOString(),
    };
    this.innovation.unshift(project);
    audit('create_innovation', 'innovation', project.projectId, input.facilityId);
    return project;
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const trials = this.trials.filter((t) => (!facilityId || t.facilityId === facilityId) && matchQ(q, t.title, t.nctId));
    const participants = this.participants.filter((p) => (!facilityId || p.facilityId === facilityId) && matchQ(q, p.participantId, p.patientId));
    return { trials: trials.slice(0, 10), participants: participants.slice(0, 10) };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.trials.length + this.participants.length };
  }

  favorite(userId: string, entityType: ResearchFavorite['entityType'], entityId: string) {
    const fav = { userId, entityType, entityId, createdAt: new Date().toISOString() };
    this.favorites.push(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  share(input: ShareResearchInput) {
    audit('share', input.entityType, input.entityId);
    return { shared: true, recipients: input.recipientIds.length };
  }
}

export const researchRepository = new ResearchRepository();
