import { computeCdssAnalytics } from '@/services/cdss/analytics';
import { sortAlertsByPriority } from '@/services/cdss/clinical-rules-engine';
import {
  filterGuidelinesBySource,
  sortGuidelinesByCompliance,
} from '@/services/cdss/guidelines-engine';
import {
  filterOrderSetsByCategory,
  sortOrderSetsByUsage,
} from '@/services/cdss/order-set-engine';
import { sortPreventiveByUrgency } from '@/services/cdss/preventive-care-engine';
import { buildCalculatorResult } from '@/services/cdss/risk-calculator';
import {
  buildCdssDashboard,
  MOCK_ALERTS,
  MOCK_ALLERGY_ALERTS,
  MOCK_AUDIT,
  MOCK_CALCULATORS,
  MOCK_CLINICAL_RULES,
  MOCK_CONTRAINDICATIONS,
  MOCK_DECISION_TREES,
  MOCK_DIAGNOSTIC_SUGGESTIONS,
  MOCK_DRUG_INTERACTIONS,
  MOCK_DUPLICATE_THERAPY,
  MOCK_EVIDENCE,
  MOCK_GUIDELINES,
  MOCK_ORDER_SETS,
  MOCK_PATHWAYS,
  MOCK_PREVENTIVE,
  MOCK_PROTOCOLS,
  MOCK_RECOMMENDATIONS,
} from '@/services/cdss/mock-data';
import type {
  AcknowledgeAlertInput,
  ApplyRecommendationInput,
  CalculateRiskInput,
  CdssFilters,
  CdssFavorite,
  CdssTimelineEvent,
  CreateGuidelineInput,
  OverrideAlertInput,
  PublishProtocolInput,
  UpdateRuleInput,
} from '@/services/cdss/types';

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

class CdssRepository {
  private alerts = [...MOCK_ALERTS];
  private recommendations = [...MOCK_RECOMMENDATIONS];
  private guidelines = [...MOCK_GUIDELINES];
  private rules = [...MOCK_CLINICAL_RULES];
  private protocols = [...MOCK_PROTOCOLS];
  private audit = [...MOCK_AUDIT];
  private favorites: CdssFavorite[] = [];
  private nextId = 600000;

  getAlerts(filters?: CdssFilters) {
    let items = this.alerts;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((a) => a.patientId === filters.patientId);
    if (filters?.severity)
      items = items.filter((a) => a.severity === filters.severity);
    if (filters?.status)
      items = items.filter((a) => a.status === filters.status);
    if (filters?.alertType)
      items = items.filter((a) => a.type === filters.alertType);
    if (filters?.q)
      items = items.filter((a) =>
        matchQ(filters.q, a.title, a.patientName, a.message),
      );
    return paginate(
      sortAlertsByPriority(items),
      filters?.page,
      filters?.pageSize,
    );
  }

  getRecommendations(filters?: CdssFilters) {
    let items = this.recommendations;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((r) => r.patientId === filters.patientId);
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    if (filters?.q)
      items = items.filter((r) => matchQ(filters.q, r.title, r.patientName));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getGuidelines(filters?: CdssFilters) {
    let items = this.guidelines;
    if (filters?.facilityId)
      items = items.filter(
        (g) => !g.facilityId || g.facilityId === filters.facilityId,
      );
    if (filters?.guidelineSource)
      items = filterGuidelinesBySource(items, filters.guidelineSource);
    if (filters?.q)
      items = items.filter((g) => matchQ(filters.q, g.title, g.condition));
    return paginate(
      sortGuidelinesByCompliance(items),
      filters?.page,
      filters?.pageSize,
    );
  }

  getOrderSets(filters?: CdssFilters) {
    let items = MOCK_ORDER_SETS;
    if (filters?.facilityId)
      items = items.filter(
        (o) => !o.facilityId || o.facilityId === filters.facilityId,
      );
    if (filters?.orderSetCategory)
      items = filterOrderSetsByCategory(items, filters.orderSetCategory);
    if (filters?.q) items = items.filter((o) => matchQ(filters.q, o.name));
    return paginate(
      sortOrderSetsByUsage(items),
      filters?.page,
      filters?.pageSize,
    );
  }

  getPathways(filters?: CdssFilters) {
    let items = MOCK_PATHWAYS;
    if (filters?.facilityId)
      items = items.filter(
        (p) => !p.facilityId || p.facilityId === filters.facilityId,
      );
    if (filters?.q)
      items = items.filter((p) => matchQ(filters.q, p.name, p.condition));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCalculators() {
    return MOCK_CALCULATORS;
  }

  getDiagnostics(filters?: CdssFilters) {
    let items = MOCK_DIAGNOSTIC_SUGGESTIONS;
    if (filters?.facilityId)
      items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((d) => d.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDrugSafety(filters?: CdssFilters) {
    const patientId = filters?.patientId;
    const filterPatient = <T extends { patientId: string }>(items: T[]) =>
      patientId ? items.filter((i) => i.patientId === patientId) : items;
    return {
      interactions: paginate(
        filterPatient(MOCK_DRUG_INTERACTIONS).slice(0, 200),
        filters?.page,
        filters?.pageSize,
      ),
      allergies: paginate(
        filterPatient(MOCK_ALLERGY_ALERTS).slice(0, 200),
        filters?.page,
        filters?.pageSize,
      ),
      contraindications: paginate(
        filterPatient(MOCK_CONTRAINDICATIONS).slice(0, 200),
        filters?.page,
        filters?.pageSize,
      ),
      duplicateTherapy: paginate(
        filterPatient(MOCK_DUPLICATE_THERAPY).slice(0, 200),
        filters?.page,
        filters?.pageSize,
      ),
    };
  }

  getPreventiveCare(filters?: CdssFilters) {
    let items = MOCK_PREVENTIVE;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((p) => p.patientId === filters.patientId);
    return paginate(
      sortPreventiveByUrgency(items),
      filters?.page,
      filters?.pageSize,
    );
  }

  getRules(filters?: CdssFilters) {
    let items = this.rules;
    if (filters?.facilityId)
      items = items.filter(
        (r) => !r.facilityId || r.facilityId === filters.facilityId,
      );
    if (filters?.alertType)
      items = items.filter((r) => r.category === filters.alertType);
    if (filters?.q)
      items = items.filter((r) => matchQ(filters.q, r.name, r.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getProtocols(filters?: CdssFilters) {
    let items = this.protocols;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((p) => matchQ(filters.q, p.name, p.condition));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEvidence(filters?: CdssFilters) {
    let items = MOCK_EVIDENCE;
    if (filters?.q)
      items = items.filter((e) => matchQ(filters.q, e.title, e.summary));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDecisionTrees() {
    return MOCK_DECISION_TREES;
  }

  getAudit(filters?: CdssFilters) {
    let items = this.audit;
    if (filters?.providerId)
      items = items.filter((a) => a.providerId === filters.providerId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTimeline(facilityId?: string): CdssTimelineEvent[] {
    const alerts = facilityId
      ? this.alerts.filter((a) => a.facilityId === facilityId)
      : this.alerts;
    return alerts.slice(0, 20).map((a) => ({
      eventId: `evt-${a.alertId}`,
      timestamp: a.triggeredAt,
      type: 'alert' as const,
      title: a.title,
      patientId: a.patientId,
      providerId: a.providerId,
    }));
  }

  acknowledgeAlert(input: AcknowledgeAlertInput) {
    const idx = this.alerts.findIndex((a) => a.alertId === input.alertId);
    if (idx < 0) return null;
    this.alerts[idx]!.status = 'acknowledged';
    this.audit.unshift({
      auditId: `aud-${String(++this.nextId)}`,
      alertId: input.alertId,
      action: 'acknowledged',
      providerId: input.providerId,
      timestamp: new Date().toISOString(),
      notes: input.notes,
    });
    return this.alerts[idx];
  }

  overrideAlert(input: OverrideAlertInput) {
    const idx = this.alerts.findIndex((a) => a.alertId === input.alertId);
    if (idx < 0) return null;
    this.alerts[idx]!.status = 'overridden';
    this.audit.unshift({
      auditId: `aud-${String(++this.nextId)}`,
      alertId: input.alertId,
      action: 'overridden',
      providerId: input.providerId,
      timestamp: new Date().toISOString(),
      notes: input.reason,
    });
    return this.alerts[idx];
  }

  applyRecommendation(input: ApplyRecommendationInput) {
    const idx = this.recommendations.findIndex(
      (r) => r.recommendationId === input.recommendationId,
    );
    if (idx < 0) return null;
    this.recommendations[idx]!.status = 'accepted';
    return this.recommendations[idx];
  }

  createGuideline(input: CreateGuidelineInput) {
    const guideline = {
      guidelineId: `gl-${String(++this.nextId)}`,
      title: input.title,
      source: input.source,
      condition: input.condition,
      status: 'draft' as const,
      facilityId: input.facilityId,
      currentVersion: 'v1.0',
      versions: [
        {
          versionId: `gv-${this.nextId}`,
          version: 'v1.0',
          publishedAt: new Date().toISOString(),
          summary: input.summary,
        },
      ],
      complianceRate: 0,
      lastReviewed: new Date().toISOString().split('T')[0]!,
    };
    this.guidelines.unshift(guideline);
    return guideline;
  }

  updateRule(input: UpdateRuleInput) {
    const idx = this.rules.findIndex((r) => r.ruleId === input.ruleId);
    if (idx < 0) return null;
    if (input.enabled !== undefined) this.rules[idx]!.enabled = input.enabled;
    if (input.priority) this.rules[idx]!.priority = input.priority;
    if (input.description) this.rules[idx]!.description = input.description;
    return this.rules[idx];
  }

  publishProtocol(input: PublishProtocolInput) {
    const idx = this.protocols.findIndex(
      (p) => p.protocolId === input.protocolId,
    );
    if (idx < 0) return null;
    this.protocols[idx]!.status = 'active';
    return this.protocols[idx];
  }

  calculateRisk(input: CalculateRiskInput) {
    const calc = MOCK_CALCULATORS.find((c) => c.type === input.calculatorType);
    return buildCalculatorResult(
      calc?.calculatorId ?? 'calc-001',
      input.calculatorType,
      input.inputs,
      input.patientId,
    );
  }

  dashboard(facilityId?: string) {
    return buildCdssDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computeCdssAnalytics(facilityId);
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const matches = (...fields: (string | undefined)[]) =>
      fields.some((f) => f?.toLowerCase().includes(q));
    const scopedAlerts = this.alerts.filter(
      (a) => !facilityId || a.facilityId === facilityId,
    );
    return {
      alerts: scopedAlerts
        .filter((a) => matches(a.title, a.patientName))
        .slice(0, 12),
      guidelines: this.guidelines
        .filter((g) => matches(g.title, g.condition))
        .slice(0, 12),
      orderSets: MOCK_ORDER_SETS.filter((o) => matches(o.name)).slice(0, 12),
      recommendations: this.recommendations
        .filter((r) => matches(r.title, r.patientName))
        .slice(0, 12),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.alerts.length + this.guidelines.length,
    };
  }

  favorite(
    userId: string,
    entityType: CdssFavorite['entityType'],
    entityId: string,
  ) {
    const fav: CdssFavorite = {
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

export const cdssRepository = new CdssRepository();
