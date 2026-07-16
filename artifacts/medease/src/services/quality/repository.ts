import { computeQualityAnalytics } from '@/services/quality/analytics';
import { gapAnalysis, frameworkScore } from '@/services/quality/accreditation';
import { openFindingsCount } from '@/services/quality/audit-engine';
import { canCloseCapa, nextCapaStatus } from '@/services/quality/capa-engine';
import { canEscalateIncident, prioritizeIncident } from '@/services/quality/incident-engine';
import { outbreakClusters } from '@/services/quality/infection-control';
import { assessRisk } from '@/services/quality/risk-engine';
import {
  buildQualityDashboard,
  MOCK_ACCREDITATION,
  MOCK_AUDIT_FINDINGS,
  MOCK_AUDITS,
  MOCK_CAPA,
  MOCK_COMPLIANCE,
  MOCK_INCIDENTS,
  MOCK_INFECTIONS,
  MOCK_POLICIES,
  MOCK_QUALITY_INDICATORS,
  MOCK_RCA,
  MOCK_RISKS,
} from '@/services/quality/mock-data';
import type {
  CreateCapaInput,
  CreateIncidentInput,
  CreateRiskInput,
  PublishPolicyInput,
  QualityFavorite,
  QualityFilters,
  ScheduleAuditInput,
} from '@/services/quality/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class QualityRepository {
  private incidents = [...MOCK_INCIDENTS];
  private risks = [...MOCK_RISKS];
  private capa = [...MOCK_CAPA];
  private audits = [...MOCK_AUDITS];
  private findings = [...MOCK_AUDIT_FINDINGS];
  private policies = [...MOCK_POLICIES];
  private favorites: QualityFavorite[] = [];
  private nextId = 400000;

  getIncidents(filters?: QualityFilters) {
    let items = this.incidents;
    if (filters?.facilityId) items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((i) => i.status === filters.status);
    if (filters?.severity) items = items.filter((i) => i.severity === filters.severity);
    if (filters?.type) items = items.filter((i) => i.type === filters.type);
    if (filters?.q) items = items.filter((i) => matchQ(filters.q, i.title, i.description));
    return paginate([...items].sort((a, b) => prioritizeIncident(b) - prioritizeIncident(a)), filters?.page, filters?.pageSize);
  }

  getIncident(incidentId: string) {
    return this.incidents.find((i) => i.incidentId === incidentId) ?? null;
  }

  getRisks(filters?: QualityFilters) {
    let items = this.risks;
    if (filters?.facilityId) items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.category) items = items.filter((r) => r.category === filters.category);
    if (filters?.status) items = items.filter((r) => r.status === filters.status);
    if (filters?.q) items = items.filter((r) => matchQ(filters.q, r.title, r.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRiskRegister(filters?: QualityFilters) {
    return this.getRisks(filters);
  }

  getCapa(filters?: QualityFilters) {
    let items = this.capa;
    if (filters?.facilityId) items = items.filter((c) => c.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.type) items = items.filter((c) => c.type === filters.type);
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.title, c.actionPlan));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudits(filters?: QualityFilters) {
    let items = this.audits;
    if (filters?.facilityId) items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((a) => a.status === filters.status);
    if (filters?.type) items = items.filter((a) => a.type === filters.type);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.title));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInspections(filters?: QualityFilters) {
    const f = { ...filters, type: filters?.type ?? 'inspection' };
    return this.getAudits(f);
  }

  getPolicies(filters?: QualityFilters) {
    let items = this.policies;
    if (filters?.facilityId) items = items.filter((p) => !p.facilityId || p.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    if (filters?.type) items = items.filter((p) => p.type === filters.type);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.title, p.contentSummary));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDocuments(filters?: QualityFilters) {
    return this.getPolicies(filters);
  }

  getAccreditation(framework?: string) {
    let items = MOCK_ACCREDITATION;
    if (framework) items = items.filter((s) => s.framework === framework);
    return items;
  }

  getCompliance(filters?: QualityFilters) {
    let items = MOCK_COMPLIANCE;
    if (filters?.facilityId) items = items.filter((c) => c.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInfectionControl(filters?: QualityFilters) {
    let items = MOCK_INFECTIONS;
    if (filters?.facilityId) items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.type) items = items.filter((i) => i.type === filters.type);
    return { records: paginate(items, filters?.page, filters?.pageSize), outbreaks: outbreakClusters(items) };
  }

  getQualityIndicators(filters?: QualityFilters) {
    let items = MOCK_QUALITY_INDICATORS;
    if (filters?.facilityId) items = items.filter((i) => i.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createIncident(input: CreateIncidentInput) {
    const incident = {
      incidentId: `inc-${String(++this.nextId)}`,
      title: input.title,
      description: input.description,
      type: input.type,
      severity: input.severity,
      status: 'reported' as const,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      patientId: input.patientId,
      reportedBy: input.anonymous ? 'anonymous' : input.reportedBy,
      reportedAt: new Date().toISOString(),
      anonymous: input.anonymous ?? false,
      escalated: false,
      equipmentId: input.equipmentId,
    };
    this.incidents.unshift(incident);
    return incident;
  }

  escalateIncident(incidentId: string) {
    const idx = this.incidents.findIndex((i) => i.incidentId === incidentId);
    if (idx < 0) return null;
    const incident = this.incidents[idx]!;
    if (!canEscalateIncident(incident)) return null;
    incident.escalated = true;
    incident.status = 'escalated';
    this.incidents[idx] = incident;
    return incident;
  }

  createRisk(input: CreateRiskInput) {
    const assessed = assessRisk(input.likelihood, input.impact);
    const risk = {
      riskId: `risk-${String(++this.nextId)}`,
      title: input.title,
      description: input.description,
      category: input.category,
      likelihood: input.likelihood,
      impact: input.impact,
      riskScore: assessed.riskScore,
      level: assessed.level,
      status: 'identified' as const,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      ownerId: input.ownerId,
      mitigationPlan: input.mitigationPlan,
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    };
    this.risks.unshift(risk);
    return risk;
  }

  updateRisk(riskId: string, updates: Partial<{ status: string; mitigationPlan: string; likelihood: number; impact: number }>) {
    const idx = this.risks.findIndex((r) => r.riskId === riskId);
    if (idx < 0) return null;
    const risk = { ...this.risks[idx]! };
    if (updates.status) risk.status = updates.status as typeof risk.status;
    if (updates.mitigationPlan) risk.mitigationPlan = updates.mitigationPlan;
    if (updates.likelihood != null && updates.impact != null) {
      const assessed = assessRisk(updates.likelihood, updates.impact);
      risk.likelihood = updates.likelihood;
      risk.impact = updates.impact;
      risk.riskScore = assessed.riskScore;
      risk.level = assessed.level;
    }
    this.risks[idx] = risk;
    return risk;
  }

  createCapa(input: CreateCapaInput) {
    const record = {
      capaId: `capa-${String(++this.nextId)}`,
      title: input.title,
      type: input.type,
      status: 'open' as const,
      incidentId: input.incidentId,
      riskId: input.riskId,
      facilityId: input.facilityId,
      assignedTo: input.assignedTo,
      dueDate: input.dueDate,
      rootCause: input.rootCause,
      actionPlan: input.actionPlan,
    };
    this.capa.unshift(record);
    return record;
  }

  closeCapa(capaId: string, effectivenessScore = 90) {
    const idx = this.capa.findIndex((c) => c.capaId === capaId);
    if (idx < 0) return null;
    const capa = this.capa[idx]!;
    capa.status = 'effectiveness_review';
    capa.effectivenessScore = effectivenessScore;
    if (canCloseCapa(capa)) {
      capa.status = 'closed';
      capa.verificationNotes = 'Effectiveness verified';
    } else {
      capa.status = nextCapaStatus(capa.status);
    }
    this.capa[idx] = capa;
    return capa;
  }

  scheduleAudit(input: ScheduleAuditInput) {
    const audit = {
      auditId: `aud-${String(++this.nextId)}`,
      title: input.title,
      type: input.type,
      status: 'scheduled' as const,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      scheduledDate: input.scheduledDate,
      auditorId: input.auditorId,
      findingsCount: 0,
    };
    this.audits.unshift(audit);
    return audit;
  }

  uploadEvidence(auditId: string, findingId: string) {
    const idx = this.findings.findIndex((f) => f.findingId === findingId && f.auditId === auditId);
    if (idx < 0) return null;
    this.findings[idx]!.evidenceAttached = true;
    return this.findings[idx];
  }

  publishPolicy(input: PublishPolicyInput) {
    const policy = {
      policyId: `pol-${String(++this.nextId)}`,
      title: input.title,
      type: input.type,
      version: 'v1.0',
      status: 'published' as const,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      ownerId: input.ownerId,
      effectiveDate: input.effectiveDate,
      reviewDate: input.reviewDate,
      approvedBy: input.ownerId,
      contentSummary: input.contentSummary,
    };
    this.policies.unshift(policy);
    return policy;
  }

  archivePolicy(policyId: string) {
    const idx = this.policies.findIndex((p) => p.policyId === policyId);
    if (idx < 0) return null;
    this.policies[idx]!.status = 'archived';
    return this.policies[idx];
  }

  getRootCauseAnalyses(capaId?: string) {
    let items = MOCK_RCA;
    if (capaId) items = items.filter((r) => r.capaId === capaId);
    return items.slice(0, 20);
  }

  dashboard(facilityId?: string) {
    return buildQualityDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computeQualityAnalytics(facilityId);
  }

  accreditationGaps() {
    return gapAnalysis(MOCK_ACCREDITATION);
  }

  accreditationFrameworkScores() {
    return ['jci', 'nabh', 'iso_9001', 'iso_15189', 'iso_27001', 'cap', 'moh'].map((f) => ({
      framework: f,
      score: frameworkScore(MOCK_ACCREDITATION, f as typeof MOCK_ACCREDITATION[0]['framework']),
    }));
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const filter = <T extends { facilityId?: string }>(items: T[], ...fields: (string | undefined)[]) =>
      items.filter((item) => (!facilityId || item.facilityId === facilityId) && fields.some((f) => f?.toLowerCase().includes(q))).slice(0, 12);

    return {
      incidents: filter(this.incidents, ...this.incidents.slice(0, 100).map((i) => i.title)),
      risks: filter(this.risks, ...this.risks.slice(0, 100).map((r) => r.title)),
      capa: filter(this.capa, ...this.capa.slice(0, 100).map((c) => c.title)),
      policies: filter(this.policies, ...this.policies.slice(0, 100).map((p) => p.title)),
      audits: filter(this.audits, ...this.audits.slice(0, 100).map((a) => a.title)),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.incidents.length + this.risks.length };
  }

  favorite(userId: string, entityType: QualityFavorite['entityType'], entityId: string) {
    const fav: QualityFavorite = {
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

  openFindingsTotal() {
    return openFindingsCount(this.findings);
  }
}

export const qualityRepository = new QualityRepository();
