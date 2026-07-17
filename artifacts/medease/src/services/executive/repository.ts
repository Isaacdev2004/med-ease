import { computeExecutiveAnalytics } from '@/services/executive/analytics';
import { aggregateOccupancy } from '@/services/executive/capacity';
import { buildHospitalOperations } from '@/services/executive/operational-intelligence';
import {
  MOCK_BENCHMARK_REPORTS,
  MOCK_CAPACITY_SNAPSHOTS,
  MOCK_DEPARTMENT_SCORECARDS,
  MOCK_ENTERPRISE_ALERTS,
  MOCK_ENTERPRISE_KPIS,
  MOCK_EXECUTIVE_DASHBOARDS,
  MOCK_EXECUTIVE_FORECASTS,
  MOCK_EXEC_AUDIT,
  MOCK_OPERATIONAL_METRICS,
  MOCK_STRATEGIC_INITIATIVES,
  buildExecutiveCommandCenter,
} from '@/services/executive/mock-data';
import type {
  AcknowledgeAlertInput,
  ArchiveDashboardInput,
  CreateStrategicInitiativeInput,
  ExecutiveFavorite,
  ExecutiveFilters,
  ShareExecutiveInput,
  UpdateKpiTargetInput,
} from '@/services/executive/types';

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
  MOCK_EXEC_AUDIT.unshift({
    auditId: `exaudit-${Date.now()}`,
    action,
    actorId: 'system',
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    facilityId: facilityId ?? 'fac-001',
    outcome: 'success',
  });
}

class ExecutiveRepository {
  private kpis = [...MOCK_ENTERPRISE_KPIS];
  private dashboards = [...MOCK_EXECUTIVE_DASHBOARDS];
  private alerts = [...MOCK_ENTERPRISE_ALERTS];
  private initiatives = [...MOCK_STRATEGIC_INITIATIVES];
  private favorites: ExecutiveFavorite[] = [];
  private nextId = 950000;

  dashboard(facilityId?: string) {
    return buildExecutiveCommandCenter(facilityId);
  }
  analytics(facilityId?: string) {
    return computeExecutiveAnalytics(facilityId);
  }

  getEnterpriseKpis(filters?: ExecutiveFilters) {
    let items = this.kpis;
    if (filters?.facilityId)
      items = items.filter((k) => k.facilityId === filters.facilityId);
    if (filters?.departmentId)
      items = items.filter((k) => k.departmentId === filters.departmentId);
    if (filters?.category)
      items = items.filter((k) => k.category === filters.category);
    if (filters?.q)
      items = items.filter((k) => matchQ(filters.q, k.name, k.kpiId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOperationalMetrics(filters?: ExecutiveFilters) {
    let items = MOCK_OPERATIONAL_METRICS;
    if (filters?.facilityId)
      items = items.filter((m) => m.facilityId === filters.facilityId);
    if (filters?.departmentId)
      items = items.filter((m) => m.departmentId === filters.departmentId);
    if (filters?.q)
      items = items.filter((m) => matchQ(filters.q, m.name, m.metricId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDepartmentScorecards(filters?: ExecutiveFilters) {
    let items = MOCK_DEPARTMENT_SCORECARDS;
    if (filters?.facilityId)
      items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.departmentId)
      items = items.filter((s) => s.departmentId === filters.departmentId);
    if (filters?.q)
      items = items.filter((s) =>
        matchQ(filters.q, s.departmentName, s.scorecardId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getHospitalOperations(facilityId = 'fac-001') {
    const metrics = MOCK_OPERATIONAL_METRICS.filter(
      (m) => m.facilityId === facilityId,
    );
    return buildHospitalOperations(facilityId, metrics);
  }

  getCapacityAnalytics(filters?: ExecutiveFilters) {
    let items = MOCK_CAPACITY_SNAPSHOTS;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    return {
      snapshots: paginate(items, filters?.page, filters?.pageSize),
      aggregateOccupancy: aggregateOccupancy(items),
    };
  }

  getPatientFlow(facilityId = 'fac-001') {
    const metrics = MOCK_OPERATIONAL_METRICS.filter(
      (m) => m.facilityId === facilityId,
    );
    return {
      facilityId,
      arrivalsToday: 120 + metrics.length,
      dischargesToday: 95 + (metrics.length % 20),
      transfersToday: 12 + (metrics.length % 8),
      avgLengthOfStay: 4.2 + (metrics.length % 10) * 0.1,
      readmissionRate: 8.5 + (metrics.length % 5) * 0.2,
      flowTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
        (label, i) => ({
          label,
          value: 80 + i * 5 + (metrics.length % 15),
        }),
      ),
    };
  }

  getRevenueDashboard(facilityId = 'fac-001') {
    const financial = this.kpis.filter(
      (k) => k.category === 'financial' && k.facilityId === facilityId,
    );
    return {
      facilityId,
      revenueMtd: (financial[0]?.value ?? 12.5) * 1000000,
      revenueYtd: (financial[0]?.value ?? 12.5) * 12000000,
      collectionRate: financial[1]?.value ?? 94,
      denialRate: 100 - (financial[2]?.value ?? 92),
      netMargin: financial[3]?.value ?? 8.5,
      revenueTrend: ['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => ({
        label,
        value: 10 + i * 2 + (financial.length % 5),
      })),
    };
  }

  getQualityDashboard(facilityId = 'fac-001') {
    const quality = this.kpis.filter(
      (k) => k.category === 'quality' && k.facilityId === facilityId,
    );
    return {
      facilityId,
      overallScore: quality[0]?.value ?? 82,
      patientSatisfaction: quality[1]?.value ?? 88,
      infectionRate: 100 - (quality[2]?.value ?? 95),
      mortalityIndex: quality[3]?.value ?? 0.92,
      complianceRate: quality[2]?.value ?? 96,
      qualityTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
        (label, i) => ({ label, value: 78 + i + (quality.length % 5) }),
      ),
    };
  }

  getWorkforceDashboard(facilityId = 'fac-001') {
    const workforce = this.kpis.filter(
      (k) => k.category === 'workforce' && k.facilityId === facilityId,
    );
    return {
      facilityId,
      totalStaff: 1200 + workforce.length * 2,
      vacancyRate: workforce[0]?.value ?? 6.5,
      overtimeHours: workforce[1]?.value ?? 420,
      turnoverRate: workforce[2]?.value ?? 12,
      satisfactionScore: 100 - (workforce[3]?.value ?? 15),
      staffingTrend: ['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => ({
        label,
        value: 90 + i * 2,
      })),
    };
  }

  getPopulationDashboard(facilityId = 'fac-001') {
    const population = this.kpis.filter(
      (k) => k.category === 'population' && k.facilityId === facilityId,
    );
    return {
      facilityId,
      attributedLives: 45000 + population.length * 100,
      riskScore: population[0]?.value ?? 62,
      gapClosureRate: population[1]?.value ?? 74,
      preventiveCareRate: population[2]?.value ?? 68,
      chronicDiseaseRate: population[3]?.value ?? 28,
      populationTrend: ['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => ({
        label,
        value: 60 + i * 3,
      })),
    };
  }

  getExecutiveForecasts(filters?: ExecutiveFilters) {
    let items = MOCK_EXECUTIVE_FORECASTS;
    if (filters?.facilityId)
      items = items.filter((f) => f.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((f) => matchQ(filters.q, f.metric, f.forecastId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getStrategicInitiatives(filters?: ExecutiveFilters) {
    let items = this.initiatives;
    if (filters?.facilityId)
      items = items.filter(
        (i) => !i.facilityId || i.facilityId === filters.facilityId,
      );
    if (filters?.status)
      items = items.filter((i) => i.status === filters.status);
    if (filters?.q)
      items = items.filter((i) => matchQ(filters.q, i.name, i.initiativeId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getExecutiveAlerts(filters?: ExecutiveFilters) {
    let items = this.alerts;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((a) => matchQ(filters.q, a.title, a.alertId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBenchmarkReports(filters?: ExecutiveFilters) {
    let items = MOCK_BENCHMARK_REPORTS;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((b) => matchQ(filters.q, b.metric, b.reportId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDashboards(filters?: ExecutiveFilters) {
    let items = this.dashboards;
    if (filters?.facilityId)
      items = items.filter(
        (d) => !d.facilityId || d.facilityId === filters.facilityId,
      );
    if (filters?.status)
      items = items.filter((d) => d.status === filters.status);
    if (filters?.q)
      items = items.filter((d) => matchQ(filters.q, d.name, d.dashboardId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudit(filters?: ExecutiveFilters) {
    let items = MOCK_EXEC_AUDIT;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createStrategicInitiative(input: CreateStrategicInitiativeInput) {
    const initiative = {
      initiativeId: `init-${++this.nextId}`,
      name: input.name,
      facilityId: input.facilityId,
      ownerId: input.ownerId,
      status: 'planning' as const,
      progress: 0,
      targetDate: input.targetDate,
      budget: input.budget,
      spent: 0,
      description: input.description,
    };
    this.initiatives.unshift(initiative);
    audit(
      'create_initiative',
      'initiative',
      initiative.initiativeId,
      input.facilityId,
    );
    return initiative;
  }

  updateKpiTarget(input: UpdateKpiTargetInput) {
    const kpi = this.kpis.find((k) => k.kpiId === input.kpiId);
    if (!kpi) throw new Error('KPI not found');
    kpi.target = input.target;
    audit('update_kpi', 'kpi', kpi.kpiId, kpi.facilityId);
    return kpi;
  }

  acknowledgeAlert(input: AcknowledgeAlertInput) {
    const alert = this.alerts.find((a) => a.alertId === input.alertId);
    if (!alert) throw new Error('Alert not found');
    alert.acknowledged = true;
    audit('acknowledge_alert', 'alert', alert.alertId, alert.facilityId);
    return alert;
  }

  archiveDashboard(input: ArchiveDashboardInput) {
    const dashboard = this.dashboards.find(
      (d) => d.dashboardId === input.dashboardId,
    );
    if (!dashboard) throw new Error('Dashboard not found');
    dashboard.status = 'archived';
    audit(
      'archive_dashboard',
      'dashboard',
      dashboard.dashboardId,
      dashboard.facilityId,
    );
    return dashboard;
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const kpis = this.kpis.filter(
      (k) => (!facilityId || k.facilityId === facilityId) && matchQ(q, k.name),
    );
    const initiatives = this.initiatives.filter((i) => matchQ(q, i.name));
    return { kpis: kpis.slice(0, 10), initiatives: initiatives.slice(0, 10) };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.kpis.length + this.initiatives.length,
    };
  }

  favorite(
    userId: string,
    entityType: ExecutiveFavorite['entityType'],
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

  share(input: ShareExecutiveInput) {
    audit('share', input.entityType, input.entityId);
    return { shared: true, recipients: input.recipientIds.length };
  }
}

export const executiveRepository = new ExecutiveRepository();
