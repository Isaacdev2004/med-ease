import { computePublicHealthAnalytics } from '@/services/public-health/analytics';
import { canResolveOutbreak } from '@/services/public-health/outbreak';
import {
  buildPublicHealthDashboard,
  MOCK_CHILD_HEALTH,
  MOCK_COMMUNITY_MEMBERS,
  MOCK_COMMUNITY_PROGRAMS,
  MOCK_CONTACT_TRACING,
  MOCK_DISEASE_CASES,
  MOCK_ENVIRONMENTAL,
  MOCK_IMMUNIZATIONS,
  MOCK_MATERNAL,
  MOCK_OCCUPATIONAL,
  MOCK_OUTBREAKS,
  MOCK_PH_AUDIT,
  MOCK_REGISTRIES,
  MOCK_SCHOOL_SCREENINGS,
  MOCK_SDOH,
} from '@/services/public-health/mock-data';
import type {
  AssignContactTracingInput,
  CompleteInvestigationInput,
  CreateOutbreakInput,
  LaunchCampaignInput,
  PublicHealthFavorite,
  PublicHealthFilters,
  RecordImmunizationInput,
  RecordSdohInput,
  RegisterCaseInput,
  ScheduleOutreachInput,
  SharePublicHealthInput,
} from '@/services/public-health/types';

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

function audit(
  action: string,
  resourceType: string,
  resourceId: string,
  facilityId?: string,
) {
  MOCK_PH_AUDIT.unshift({
    auditId: `phaudit-${Date.now()}`,
    action,
    actorId: 'system',
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    facilityId: facilityId ?? 'fac-001',
    outcome: 'success',
  });
}

class PublicHealthRepository {
  private cases = [...MOCK_DISEASE_CASES];
  private outbreaks = [...MOCK_OUTBREAKS];
  private contacts = [...MOCK_CONTACT_TRACING];
  private immunizations = [...MOCK_IMMUNIZATIONS];
  private programs = [...MOCK_COMMUNITY_PROGRAMS];
  private favorites: PublicHealthFavorite[] = [];
  private nextId = 800000;

  dashboard(facilityId?: string) {
    return buildPublicHealthDashboard(facilityId);
  }
  analytics(facilityId?: string) {
    return computePublicHealthAnalytics(facilityId);
  }

  getCases(filters?: PublicHealthFilters) {
    let items = this.cases;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.disease)
      items = items.filter((c) => c.disease === filters.disease);
    if (filters?.status)
      items = items.filter((c) => c.status === filters.status);
    if (filters?.outbreakId)
      items = items.filter((c) => c.outbreakId === filters.outbreakId);
    if (filters?.patientId)
      items = items.filter((c) => c.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((c) =>
        matchQ(filters.q, c.disease, c.caseId, c.patientId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCase(caseId: string) {
    return this.cases.find((c) => c.caseId === caseId) ?? null;
  }

  getOutbreaks(filters?: PublicHealthFilters) {
    let items = this.outbreaks;
    if (filters?.facilityId)
      items = items.filter((o) => o.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((o) => o.status === filters.status);
    if (filters?.q)
      items = items.filter((o) => matchQ(filters.q, o.name, o.disease));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getContactTracing(filters?: PublicHealthFilters) {
    let items = this.contacts;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((c) => c.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((c) =>
        matchQ(filters.q, c.contactName, c.contactId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getImmunizations(filters?: PublicHealthFilters) {
    let items = this.immunizations;
    if (filters?.facilityId)
      items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((i) => i.patientId === filters.patientId);
    if (filters?.status)
      items = items.filter((i) => i.status === filters.status);
    if (filters?.q)
      items = items.filter((i) =>
        matchQ(filters.q, i.vaccine, i.immunizationId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRegistries(filters?: PublicHealthFilters) {
    let items = MOCK_REGISTRIES;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCommunityPrograms(filters?: PublicHealthFilters) {
    let items = this.programs;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.programId)
      items = items.filter((p) => p.programId === filters.programId);
    if (filters?.q)
      items = items.filter((p) => matchQ(filters.q, p.name, p.category));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getMaternalHealth(filters?: PublicHealthFilters) {
    let items = MOCK_MATERNAL;
    if (filters?.facilityId)
      items = items.filter((m) => m.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((m) => m.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getChildHealth(filters?: PublicHealthFilters) {
    let items = MOCK_CHILD_HEALTH;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((c) => c.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSchoolHealth(filters?: PublicHealthFilters) {
    let items = MOCK_SCHOOL_SCREENINGS;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOccupationalHealth(filters?: PublicHealthFilters) {
    let items = MOCK_OCCUPATIONAL;
    if (filters?.facilityId)
      items = items.filter((o) => o.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((o) => o.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEnvironmentalHealth(filters?: PublicHealthFilters) {
    let items = MOCK_ENVIRONMENTAL;
    if (filters?.facilityId)
      items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((e) =>
        matchQ(filters.q, e.siteName, e.inspectionType),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSdohAssessments(filters?: PublicHealthFilters) {
    let items = MOCK_SDOH;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((s) => s.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((s) => matchQ(filters.q, s.domain, s.assessmentId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCommunityMembers(filters?: PublicHealthFilters) {
    let items = MOCK_COMMUNITY_MEMBERS;
    if (filters?.facilityId)
      items = items.filter((m) => m.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((m) => matchQ(filters.q, m.name, m.patientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudit(filters?: PublicHealthFilters) {
    let items = MOCK_PH_AUDIT;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  registerCase(input: RegisterCaseInput) {
    const caseRecord = {
      caseId: `case-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      disease: input.disease,
      icd10Code: input.icd10Code,
      status: 'suspected' as const,
      reportedAt: new Date().toISOString(),
      outbreakId: input.outbreakId,
    };
    this.cases.unshift(caseRecord);
    audit('register_case', 'case', caseRecord.caseId, input.facilityId);
    return caseRecord;
  }

  createOutbreak(input: CreateOutbreakInput) {
    const outbreak = {
      outbreakId: `ob-${++this.nextId}`,
      name: input.name,
      disease: input.disease,
      facilityId: input.facilityId,
      status: 'investigation' as const,
      caseCount: 1,
      startedAt: new Date().toISOString(),
      leadInvestigatorId: input.leadInvestigatorId,
    };
    this.outbreaks.unshift(outbreak);
    audit('create_outbreak', 'outbreak', outbreak.outbreakId, input.facilityId);
    return outbreak;
  }

  recordImmunization(input: RecordImmunizationInput) {
    const record = {
      immunizationId: `imm-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      vaccine: input.vaccine,
      cvxCode: input.cvxCode,
      doseNumber: input.doseNumber,
      status: 'administered' as const,
      administeredAt: new Date().toISOString(),
      appointmentId: input.appointmentId,
    };
    this.immunizations.unshift(record);
    audit(
      'record_immunization',
      'immunization',
      record.immunizationId,
      input.facilityId,
    );
    return record;
  }

  launchCampaign(input: LaunchCampaignInput) {
    const program = this.programs.find((p) => p.programId === input.programId);
    if (program) program.status = 'active';
    audit('launch_campaign', 'program', input.programId, input.facilityId);
    return { launched: true, programId: input.programId, name: input.name };
  }

  assignContactTracing(input: AssignContactTracingInput) {
    const contact = {
      contactId: `ct-${++this.nextId}`,
      caseId: input.caseId,
      patientId: input.patientId,
      facilityId: input.facilityId,
      contactName: input.contactName,
      exposureDate: input.exposureDate,
      status: 'identified' as const,
    };
    this.contacts.unshift(contact);
    audit('assign_contact', 'contact', contact.contactId, input.facilityId);
    return contact;
  }

  completeInvestigation(input: CompleteInvestigationInput) {
    const outbreak = this.outbreaks.find(
      (o) => o.outbreakId === input.outbreakId,
    );
    if (!outbreak || !canResolveOutbreak(outbreak))
      throw new Error('Cannot complete investigation');
    outbreak.status = 'resolved';
    outbreak.resolvedAt = new Date().toISOString();
    audit(
      'complete_investigation',
      'outbreak',
      outbreak.outbreakId,
      outbreak.facilityId,
    );
    return outbreak;
  }

  recordSdoh(input: RecordSdohInput) {
    const assessment = {
      assessmentId: `sdoh-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      domain: input.domain,
      score: input.score,
      riskLevel:
        input.score >= 70
          ? ('high' as const)
          : input.score >= 40
            ? ('moderate' as const)
            : ('low' as const),
      assessedAt: new Date().toISOString(),
      interventionNeeded: input.score >= 50,
    };
    audit('record_sdoh', 'sdoh', assessment.assessmentId, input.facilityId);
    return assessment;
  }

  scheduleOutreach(input: ScheduleOutreachInput) {
    audit('schedule_outreach', 'program', input.programId, input.facilityId);
    return {
      scheduled: true,
      programId: input.programId,
      scheduledAt: input.scheduledAt,
    };
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const cases = this.cases.filter(
      (c) =>
        (!facilityId || c.facilityId === facilityId) &&
        matchQ(q, c.disease, c.caseId),
    );
    const outbreaks = this.outbreaks.filter(
      (o) => (!facilityId || o.facilityId === facilityId) && matchQ(q, o.name),
    );
    return { cases: cases.slice(0, 10), outbreaks: outbreaks.slice(0, 10) };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.cases.length + this.immunizations.length,
    };
  }

  favorite(
    userId: string,
    entityType: PublicHealthFavorite['entityType'],
    entityId: string,
  ) {
    const fav = {
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.push(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  share(input: SharePublicHealthInput) {
    audit('share', input.entityType, input.entityId);
    return { shared: true, recipients: input.recipientIds.length };
  }
}

export const publicHealthRepository = new PublicHealthRepository();
