import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

function camelToKebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

/** Methods that must return T[] (not a page object) for UI consumers. */
const ARRAY_METHODS = new Set([
  'getSystemHealth',
  'getWorkers',
  'getQueues',
  'getAccreditation',
  'getEmailServers',
  'getSmsServers',
  'getLocalizations',
  'getBrandingList',
  'getOpenApiSpecs',
]);

/** Methods that return a single composite object (not a page). */
const COMPOSITE_DEFAULTS: Record<string, unknown> = {
  getInfectionControl: {
    records: { items: [], total: 0, page: 1, pageSize: 25 },
    outbreaks: [],
  },
  getCapacityAnalytics: { snapshots: [], trends: [], occupancy: 0 },
  getConfigurations: {},
  getHospitalOperations: { metrics: [], departments: [] },
  getPatientFlow: { stages: [], waitTimes: [] },
  getRevenueDashboard: {
    totalRevenue: 0,
    collections: 0,
    outstanding: 0,
    trends: [],
  },
  getQualityDashboard: { score: 0, indicators: [], trends: [] },
  getWorkforceDashboard: { totalStaff: 0, coverage: 0, trends: [] },
  getPopulationDashboard: { covered: 0, gaps: 0, cohorts: [] },
  getOrganization: { nodes: [], levels: [] },
  getRoster: { shifts: [], coverage: 0 },
  getLocalization: { locale: 'fr-FR', timezone: 'Europe/Paris' },
  getBranding: { primaryColor: '#0f766e', logoUrl: '', productName: 'Med-Ease' },
  getRiskRegister: { items: [], total: 0, page: 1, pageSize: 25 },
  getInbox: { items: [], total: 0, page: 1, pageSize: 25 },
  getPayroll: { period: 'current', totalCost: 0, lines: [] },
  getOnCall: { entries: [] },
  getCoverage: { percent: 0, gaps: [] },
  getOpenApiPreview: { openapi: '3.0.0', paths: {} },
  getBrandingList: [],
};

/** Safe empty shapes so partial API/seed payloads never crash `.map` in UI. */
const DASHBOARD_DEFAULTS: Record<string, Record<string, unknown>> = {
  facilities: {
    totalBuildings: 0,
    totalRooms: 0,
    totalBeds: 0,
    availableBeds: 0,
    totalEquipment: 0,
    operationalEquipment: 0,
    openWorkOrders: 0,
    overdueMaintenance: 0,
    calibrationDue: 0,
    utilityAlerts: 0,
    recentWorkOrders: [],
    utilitySystems: [],
  },
  workforce: {
    totalStaff: 0,
    activeStaff: 0,
    onLeave: 0,
    openShifts: 0,
    pendingLeave: 0,
    expiringCredentials: 0,
    overdueTraining: 0,
    coveragePercent: 0,
    absenteeismRate: 0,
    recentShifts: [],
    pendingLeaveRequests: [],
    expiringCertifications: [],
  },
  quality: {
    openIncidents: 0,
    escalatedIncidents: 0,
    openRisks: 0,
    highRisks: 0,
    openCapa: 0,
    capaCompletionRate: 0,
    auditScore: 0,
    openFindings: 0,
    infectionRate: 0,
    accreditationReadiness: 0,
    compliancePercent: 0,
    policyCompliance: 0,
    recentIncidents: [],
    recentCapa: [],
    riskHeatMap: [],
  },
  'population-health': {
    totalPopulation: 0,
    openCareGaps: 0,
    highRiskCount: 0,
    risingRiskCount: 0,
    registryEnrollment: 0,
    preventiveCompliance: 0,
    readmissionRate: 0,
    outreachActive: 0,
    recentGaps: [],
    riskDistribution: [],
    topRegistries: [],
  },
  cdss: {
    activeAlerts: 0,
    criticalAlerts: 0,
    pendingRecommendations: 0,
    guidelineCompliance: 0,
    orderSetsApplied: 0,
    preventiveDue: 0,
    recentAlerts: [],
    recentRecommendations: [],
    topOrderSets: [],
  },
  interoperability: {
    activeEndpoints: 0,
    messagesToday: 0,
    fhirTransactions: 0,
    hl7Processed: 0,
    dicomStudies: 0,
    failedJobs: 0,
    queueDepth: 0,
    recentJobs: [],
    recentMessages: [],
    topEndpoints: [],
  },
  research: {
    activeTrials: 0,
    totalParticipants: 0,
    enrolledThisMonth: 0,
    openDeviations: 0,
    pendingConsents: 0,
    seriousAdverseEvents: 0,
    biospecimensStored: 0,
    publicationsThisYear: 0,
    topTrials: [],
    enrollmentTrend: [],
  },
  'public-health': {
    activeCases: 0,
    activeOutbreaks: 0,
    immunizationsDue: 0,
    contactsMonitoring: 0,
    communityProgramsActive: 0,
    sdohHighRisk: 0,
    caseTrend: [],
    topDiseases: [],
    recentOutbreaks: [],
  },
  'ai-intelligence': {
    activePredictions: 0,
    highRiskPatients: 0,
    pendingRecommendations: 0,
    activeCopilotSessions: 0,
    modelAccuracy: 0,
    alertsOpen: 0,
    predictionTrend: [],
    riskDistribution: [],
    recentAlerts: [],
  },
  executive: {
    totalKpis: 0,
    activeAlerts: 0,
    bedOccupancy: 0,
    revenueMtd: 0,
    qualityScore: 0,
    initiativesOnTrack: 0,
    kpiTrend: [],
    alertDistribution: [],
    recentAlerts: [],
    topKpis: [],
  },
  documents: {
    totalDocuments: 0,
    totalFolders: 0,
    totalTemplates: 0,
    pendingSignatures: 0,
    activeLegalHolds: 0,
    ocrJobsToday: 0,
    sharedLinksActive: 0,
    storageUsedGb: 0,
    uploadTrend: [],
    moduleBreakdown: [],
    recentActivity: [],
  },
  workflows: {
    totalDefinitions: 0,
    activeInstances: 0,
    pendingTasks: 0,
    pendingApprovals: 0,
    slaBreaches: 0,
    backgroundJobsRunning: 0,
    eventsToday: 0,
    instanceTrend: [],
    moduleBreakdown: [],
    recentEvents: [],
  },
  messaging: {
    totalMessages: 0,
    unreadInbox: 0,
    activeCampaigns: 0,
    pendingDeliveries: 0,
    channelHealthScore: 0,
    broadcastsToday: 0,
    deliveryRate: 0,
    messageTrend: [],
    channelBreakdown: [],
    recentMessages: [],
  },
  'api-platform': {
    totalEndpoints: 0,
    activeApiKeys: 0,
    oauthApps: 0,
    activeWebhooks: 0,
    sdkDownloads: 0,
    sandboxEnvironments: 0,
    partners: 0,
    requestsToday: 0,
    requestTrend: [],
    moduleBreakdown: [],
    recentDeliveries: [],
  },
  reporting: {
    totalDefinitions: 0,
    activeInstances: 0,
    pendingExports: 0,
    scheduledReports: 0,
    complianceDue: 0,
    exportsToday: 0,
    categoryBreakdown: [],
    generationTrend: [],
    recentExports: [],
  },
  'platform-admin': {
    totalTenants: 0,
    activeTenants: 0,
    totalFacilities: 0,
    totalUsers: 0,
    systemHealthScore: 0,
    pendingJobs: 0,
    failedJobs: 0,
    storageUsedGb: 0,
    storageCapacityGb: 0,
    tenantTrend: [],
    regionBreakdown: [],
    recentAudits: [],
    // analytics fields
    tenantGrowthRate: 0,
    avgFacilitiesPerTenant: 0,
    licenseUtilizationRate: 0,
    storageUtilizationRate: 0,
    jobSuccessRate: 0,
    systemUptimePercent: 0,
    healthTrend: [],
  },
};

function normalizeDashboard(
  module: string,
  raw: unknown,
): Record<string, unknown> {
  const defaults = DASHBOARD_DEFAULTS[module] ?? {
    kpis: [],
    recentActivity: [],
    recentAlerts: [],
    recentEvents: [],
  };
  const row =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const merged: Record<string, unknown> = { ...defaults, ...row };
  for (const [key, value] of Object.entries(defaults)) {
    if (Array.isArray(value) && !Array.isArray(merged[key])) {
      merged[key] = value;
    }
  }
  return merged;
}

const RESOURCE_ALIASES: Record<string, string> = {
  Facility: 'facilities',
  Facilities: 'facilities',
  Employee: 'employees',
  Employees: 'employees',
  Incident: 'incidents',
  Incidents: 'incidents',
  Trial: 'trials',
  Case: 'cases',
  Prediction: 'predictions',
  Model: 'models',
  ModelRegistry: 'models',
  Document: 'documents',
  Definition: 'definitions',
  Instance: 'instances',
  Message: 'messages',
  Template: 'templates',
  Campaign: 'campaigns',
  ApiKey: 'api-keys',
  ApiKeys: 'api-keys',
  OAuthApp: 'oauth-apps',
  OAuthApps: 'oauth-apps',
  Webhook: 'webhooks',
  Partner: 'partners',
  Tenant: 'tenants',
  Hospital: 'hospitals',
  Designer: 'designers',
  PreventiveMaintenance: 'preventive-maintenance',
  BiomedicalDevices: 'biomedical-devices',
  HighRiskPatients: 'high-risk-patients',
  FeatureFlags: 'feature-flags',
  SystemHealth: 'system-health',
  CareGaps: 'care-gaps',
  OrderSets: 'order-sets',
  Hl7Messages: 'hl7-messages',
  AdverseEvents: 'adverse-events',
  ContactTracing: 'contact-tracing',
  BiasMonitoring: 'bias-monitoring',
  StrategicInitiatives: 'strategic-initiatives',
  EnterpriseKpis: 'enterprise-kpis',
  ExecutiveAlerts: 'executive-alerts',
  BenchmarkReports: 'benchmark-reports',
  RetentionPolicies: 'retention-policies',
  ComplianceReports: 'compliance-reports',
  LeaveRequests: 'leave-requests',
};

function methodToResource(method: string): string | null {
  const match = /^(?:list|get|search)([A-Z].*)$/.exec(method);
  if (!match?.[1]) return null;
  const name = match[1];
  if (RESOURCE_ALIASES[name]) return RESOURCE_ALIASES[name];
  return camelToKebab(name);
}

function isSingularGetter(method: string): boolean {
  if (!/^get[A-Z]/.test(method)) return false;
  if (ARRAY_METHODS.has(method)) return false;
  if (method in COMPOSITE_DEFAULTS) return false;
  if (method.endsWith('s') && !method.endsWith('ss') && !method.endsWith('Status')) {
    // getWorkOrders, getFacilities — collections
    return false;
  }
  // getFacility, getEmployee, getTenant, getHospital, getDocument, …
  const base = method.slice(3);
  return Boolean(
    RESOURCE_ALIASES[base] ||
      ['Facility', 'Employee', 'Incident', 'Trial', 'Case', 'Prediction', 'Model', 'Document', 'Definition', 'Instance', 'Message', 'Template', 'Campaign', 'ApiKey', 'OAuthApp', 'Webhook', 'Partner', 'Tenant', 'Hospital', 'Designer'].includes(base),
  );
}

function filtersToQuery(filters: unknown): QueryParams | undefined {
  if (!filters || typeof filters !== 'object') return undefined;
  const row = filters as Record<string, unknown>;
  const query: QueryParams = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === undefined || value === null || value === '') continue;
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      query[key] = value;
    }
  }
  return Object.keys(query).length ? query : undefined;
}

function emptyPage(page = 1, pageSize = 25) {
  return { items: [] as unknown[], total: 0, page, pageSize };
}

function asPage(raw: unknown, page = 1, pageSize = 25) {
  if (Array.isArray(raw)) {
    return { items: raw, total: raw.length, page, pageSize };
  }
  if (raw && typeof raw === 'object') {
    const row = raw as Record<string, unknown>;
    if (Array.isArray(row.items)) {
      return {
        items: row.items,
        total: typeof row.total === 'number' ? row.total : row.items.length,
        page: typeof row.page === 'number' ? row.page : page,
        pageSize: typeof row.pageSize === 'number' ? row.pageSize : pageSize,
      };
    }
  }
  return emptyPage(page, pageSize);
}

/**
 * Live HTTP repository adapter for enterprise admin modules.
 * Mirrors mock repository method names but never reads MOCK_* data.
 */
export function createEnterpriseLiveRepository<T extends object>(
  module: string,
  mockRepo: T,
): T {
  const transport = httpTransport;
  const base = `/api/enterprise/${module}`;
  const favorites: unknown[] = [];

  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (prop === 'then') return undefined;

      const sample = (mockRepo as Record<string, unknown>)[prop];
      if (typeof sample !== 'function') {
        return sample;
      }

      if (prop === 'dashboard') {
        return async (scopeKey?: string) => {
          try {
            const raw = await transport.get(`${base}/dashboard`, {
              query: scopeKey ? { scopeKey: String(scopeKey) } : undefined,
            });
            return normalizeDashboard(module, raw);
          } catch {
            return normalizeDashboard(module, null);
          }
        };
      }

      if (prop === 'analytics') {
        return async (scopeKey?: string) => {
          try {
            const raw = await transport.get(`${base}/analytics`, {
              query: scopeKey ? { scopeKey: String(scopeKey) } : undefined,
            });
            return normalizeDashboard(module, raw);
          } catch {
            return normalizeDashboard(module, null);
          }
        };
      }

      if (prop === 'exportData') {
        return async (format: 'csv' | 'pdf' | 'xlsx' = 'csv') => ({
          format,
          exportedAt: new Date().toISOString(),
          generatedAt: new Date().toISOString(),
          recordCount: 0,
        });
      }

      if (prop === 'favorite') {
        return async (...args: unknown[]) => {
          const fav = {
            favoriteId: `fav-${Date.now()}`,
            args,
            createdAt: new Date().toISOString(),
          };
          favorites.unshift(fav);
          return fav;
        };
      }

      if (prop === 'getFavorites') {
        return async () => favorites;
      }

      if (prop === 'search') {
        return async (query: string) => {
          const page = asPage(
            await transport.get(`${base}/resources/search-index`, {
              query: { q: query, page: 1, pageSize: 20 },
            }),
          );
          return { results: page.items, items: page.items, query };
        };
      }

      if (prop === 'share') {
        return async () => ({ shared: true, at: new Date().toISOString() });
      }

      // Composite object getters
      if (prop in COMPOSITE_DEFAULTS) {
        return async () => {
          const resource = methodToResource(prop) ?? camelToKebab(prop.slice(3));
          try {
            const page = asPage(
              await transport.get(`${base}/resources/${resource}`, {
                query: { page: 1, pageSize: 1 },
              }),
            );
            const first = page.items[0];
            if (first && typeof first === 'object') return first;
          } catch {
            /* use default */
          }
          return COMPOSITE_DEFAULTS[prop];
        };
      }

      // Array getters (system health, workers, …)
      if (ARRAY_METHODS.has(prop)) {
        const resource = methodToResource(prop) ?? camelToKebab(prop.slice(3));
        return async (filters?: unknown) => {
          const page = asPage(
            await transport.get(`${base}/resources/${resource}`, {
              query: filtersToQuery(filters),
            }),
          );
          return page.items;
        };
      }

      // Singular getById
      if (isSingularGetter(prop)) {
        const baseName = prop.slice(3);
        const resourceType =
          RESOURCE_ALIASES[baseName] ?? `${camelToKebab(baseName)}s`;
        return async (id: string) => {
          try {
            return await transport.get(
              `${base}/resources/${resourceType}/${id}`,
            );
          } catch {
            const page = asPage(
              await transport.get(`${base}/resources/${resourceType}`, {
                query: { id, page: 1, pageSize: 1 },
              }),
            );
            return page.items[0] ?? null;
          }
        };
      }

      const resource = methodToResource(prop);
      if (resource) {
        return async (filters?: unknown) => {
          const raw = await transport.get(`${base}/resources/${resource}`, {
            query: filtersToQuery(filters),
          });
          return asPage(raw);
        };
      }

      return async (...args: unknown[]) => {
        try {
          return await transport.post(`${base}/actions/${prop}`, {
            body: { args },
          });
        } catch {
          return null;
        }
      };
    },
  };

  return new Proxy({}, handler) as T;
}
