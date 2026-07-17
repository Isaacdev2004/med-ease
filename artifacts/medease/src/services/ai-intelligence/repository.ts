import { computeAiAnalytics } from '@/services/ai-intelligence/analytics';
import {
  generateCopilotResponse,
  createAssistantMessage,
  sessionTitleFromPrompt,
} from '@/services/ai-intelligence/clinical-copilot';
import {
  MOCK_AI_ALERTS,
  MOCK_AI_AUDIT,
  MOCK_BIAS_METRICS,
  MOCK_CLINICAL_SUMMARIES,
  MOCK_COPILOT_SESSIONS,
  MOCK_EXPLAINABILITY,
  MOCK_FORECASTS,
  MOCK_MODEL_EVALUATIONS,
  MOCK_MODEL_VERSIONS,
  MOCK_PREDICTIONS,
  MOCK_RECOMMENDATIONS,
  MOCK_RISK_ASSESSMENTS,
  buildAiDashboard,
} from '@/services/ai-intelligence/mock-data';
import {
  computePredictionScore,
  scoreToRiskLevel,
} from '@/services/ai-intelligence/predictive-models';
import { generateSummary } from '@/services/ai-intelligence/summarization';
import { applyRating } from '@/services/ai-intelligence/recommendation-engine';
import type {
  AiFavorite,
  AiIntelligenceFilters,
  ApproveModelDeploymentInput,
  ArchiveModelInput,
  CreateClinicalSummaryInput,
  GeneratePredictionInput,
  RateRecommendationInput,
  ShareAiInput,
  StartCopilotSessionInput,
} from '@/services/ai-intelligence/types';

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
  MOCK_AI_AUDIT.unshift({
    auditId: `aiaudit-${Date.now()}`,
    action,
    actorId: 'system',
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    facilityId: facilityId ?? 'fac-001',
    outcome: 'success',
  });
}

class AiIntelligenceRepository {
  private predictions = [...MOCK_PREDICTIONS];
  private riskAssessments = [...MOCK_RISK_ASSESSMENTS];
  private recommendations = [...MOCK_RECOMMENDATIONS];
  private copilotSessions = [...MOCK_COPILOT_SESSIONS];
  private summaries = [...MOCK_CLINICAL_SUMMARIES];
  private forecasts = [...MOCK_FORECASTS];
  private models = [...MOCK_MODEL_VERSIONS];
  private favorites: AiFavorite[] = [];
  private nextId = 900000;

  dashboard(facilityId?: string) {
    return buildAiDashboard(facilityId);
  }
  analytics(facilityId?: string) {
    return computeAiAnalytics(facilityId);
  }

  getPredictions(filters?: AiIntelligenceFilters) {
    let items = this.predictions;
    if (filters?.facilityId)
      items = items.filter((p) => p.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((p) => p.patientId === filters.patientId);
    if (filters?.predictionType)
      items = items.filter((p) => p.type === filters.predictionType);
    if (filters?.status)
      items = items.filter((p) => p.riskLevel === filters.status);
    if (filters?.q)
      items = items.filter((p) =>
        matchQ(filters.q, p.predictionId, p.patientId, p.type),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getPrediction(predictionId: string) {
    return (
      this.predictions.find((p) => p.predictionId === predictionId) ?? null
    );
  }

  getRiskScores(filters?: AiIntelligenceFilters) {
    let items = this.riskAssessments;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((r) => r.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((r) =>
        matchQ(filters.q, r.assessmentId, r.category, r.patientId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRecommendations(filters?: AiIntelligenceFilters) {
    let items = this.recommendations;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((r) => r.patientId === filters.patientId);
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    if (filters?.q)
      items = items.filter((r) =>
        matchQ(filters.q, r.title, r.category, r.recommendationId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCopilotSessions(filters?: AiIntelligenceFilters) {
    let items = this.copilotSessions;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.providerId)
      items = items.filter((s) => s.providerId === filters.providerId);
    if (filters?.patientId)
      items = items.filter((s) => s.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((s) => matchQ(filters.q, s.title, s.sessionId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCopilotSession(sessionId: string) {
    return this.copilotSessions.find((s) => s.sessionId === sessionId) ?? null;
  }

  getClinicalSummaries(filters?: AiIntelligenceFilters) {
    let items = this.summaries;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((s) => s.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((s) => matchQ(filters.q, s.summaryId, s.sourceId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getForecasts(filters?: AiIntelligenceFilters) {
    let items = this.forecasts;
    if (filters?.facilityId)
      items = items.filter((f) => f.facilityId === filters.facilityId);
    if (filters?.forecastType)
      items = items.filter((f) => f.type === filters.forecastType);
    if (filters?.q)
      items = items.filter((f) => matchQ(filters.q, f.metric, f.forecastId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getModelRegistry(filters?: AiIntelligenceFilters) {
    let items = this.models;
    if (filters?.facilityId)
      items = items.filter(
        (m) => !m.facilityId || m.facilityId === filters.facilityId,
      );
    if (filters?.status)
      items = items.filter((m) => m.status === filters.status);
    if (filters?.modelId)
      items = items.filter((m) => m.modelId === filters.modelId);
    if (filters?.q)
      items = items.filter((m) =>
        matchQ(filters.q, m.name, m.modelId, m.version),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getModel(modelId: string) {
    return this.models.find((m) => m.modelId === modelId) ?? null;
  }

  getModelPerformance(modelId?: string) {
    const evaluations = modelId
      ? MOCK_MODEL_EVALUATIONS.filter((e) => e.modelId === modelId)
      : MOCK_MODEL_EVALUATIONS;
    return paginate(evaluations, 1, 25);
  }

  getBiasMonitoring(filters?: AiIntelligenceFilters) {
    let items = MOCK_BIAS_METRICS;
    if (filters?.modelId)
      items = items.filter((b) => b.modelId === filters.modelId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getExplainability(filters?: AiIntelligenceFilters) {
    let items = MOCK_EXPLAINABILITY;
    if (filters?.facilityId)
      items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.patientId)
      items = items.filter((e) => e.patientId === filters.patientId);
    if (filters?.q)
      items = items.filter((e) =>
        matchQ(filters.q, e.reportId, e.predictionId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getExplainabilityReport(reportId: string) {
    return MOCK_EXPLAINABILITY.find((e) => e.reportId === reportId) ?? null;
  }

  getAlerts(filters?: AiIntelligenceFilters) {
    let items = MOCK_AI_ALERTS;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudit(filters?: AiIntelligenceFilters) {
    let items = MOCK_AI_AUDIT;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  generatePrediction(input: GeneratePredictionInput) {
    const score = computePredictionScore(input.type, this.nextId);
    const prediction = {
      predictionId: `pred-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      type: input.type,
      score,
      confidence: 0.85,
      riskLevel: scoreToRiskLevel(score),
      generatedAt: new Date().toISOString(),
      modelVersion: 'v2.0',
      providerId: input.providerId,
    };
    this.predictions.unshift(prediction);
    audit(
      'generate_prediction',
      'prediction',
      prediction.predictionId,
      input.facilityId,
    );
    return prediction;
  }

  createClinicalSummary(input: CreateClinicalSummaryInput) {
    const generated = generateSummary(input.sourceType, input.patientId);
    const summary = {
      summaryId: `sum-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      ...generated,
      generatedAt: new Date().toISOString(),
      modelVersion: 'v2.1',
    };
    this.summaries.unshift(summary);
    audit('create_summary', 'summary', summary.summaryId, input.facilityId);
    return summary;
  }

  startCopilotSession(input: StartCopilotSessionInput) {
    const messages = [];
    if (input.initialPrompt) {
      messages.push({
        messageId: `msg-${++this.nextId}`,
        role: 'user' as const,
        content: input.initialPrompt,
        timestamp: new Date().toISOString(),
      });
      messages.push(
        createAssistantMessage(generateCopilotResponse(input.initialPrompt)),
      );
    }
    const session = {
      sessionId: `cop-${++this.nextId}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      providerId: input.providerId,
      title: sessionTitleFromPrompt(input.initialPrompt),
      startedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messages,
    };
    this.copilotSessions.unshift(session);
    audit('start_copilot', 'copilot', session.sessionId, input.facilityId);
    return session;
  }

  rateRecommendation(input: RateRecommendationInput) {
    const rec = this.recommendations.find(
      (r) => r.recommendationId === input.recommendationId,
    );
    if (!rec) throw new Error('Recommendation not found');
    rec.rating = input.rating;
    rec.status = applyRating(rec.status, input.rating);
    audit(
      'rate_recommendation',
      'recommendation',
      rec.recommendationId,
      rec.facilityId,
    );
    return rec;
  }

  approveModelDeployment(input: ApproveModelDeploymentInput) {
    const model = this.models.find((m) => m.modelId === input.modelId);
    if (!model) throw new Error('Model not found');
    model.status = 'production';
    model.deployedAt = new Date().toISOString();
    audit('approve_model', 'model', model.modelId, model.facilityId);
    return model;
  }

  archiveModel(input: ArchiveModelInput) {
    const model = this.models.find((m) => m.modelId === input.modelId);
    if (!model) throw new Error('Model not found');
    model.status = 'archived';
    audit('archive_model', 'model', model.modelId, model.facilityId);
    return model;
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const predictions = this.predictions.filter(
      (p) =>
        (!facilityId || p.facilityId === facilityId) &&
        matchQ(q, p.predictionId, p.type),
    );
    const models = this.models.filter((m) => matchQ(q, m.name, m.modelId));
    return {
      predictions: predictions.slice(0, 10),
      models: models.slice(0, 10),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount:
        this.predictions.length +
        this.recommendations.length +
        this.summaries.length,
    };
  }

  favorite(
    userId: string,
    entityType: AiFavorite['entityType'],
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

  share(input: ShareAiInput) {
    audit('share', input.entityType, input.entityId);
    return { shared: true, recipients: input.recipientIds.length };
  }
}

export const aiIntelligenceRepository = new AiIntelligenceRepository();
