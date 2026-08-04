import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_FACILITY = '01930000-0000-7000-8000-000000000201';
const NOW = new Date().toISOString();

type SeedItem = {
  id: string;
  module: string;
  resourceType: string;
  title: string;
  status?: string;
  payload: Record<string, unknown>;
};

function id(n: number) {
  return `01930000-0000-7000-8000-${String(n).padStart(12, '0')}`;
}

const MODULES = [
  'facilities',
  'workforce',
  'quality',
  'population-health',
  'cdss',
  'interoperability',
  'research',
  'public-health',
  'ai-intelligence',
  'executive',
  'documents',
  'workflows',
  'messaging',
  'api-platform',
  'reporting',
  'platform-admin',
] as const;

function buildCatalog(): SeedItem[] {
  const items: SeedItem[] = [];
  let n = 17001;

  const push = (
    module: string,
    resourceType: string,
    title: string,
    payload: Record<string, unknown>,
    status = 'active',
  ) => {
    const recordId = id(n++);
    const base = {
      id: recordId,
      status,
      title,
      name: title,
      createdAt: NOW,
      updatedAt: NOW,
      ...payload,
    };
    items.push({
      id: recordId,
      module,
      resourceType,
      title,
      status,
      payload: base,
    });
  };

  // ── Facilities ──────────────────────────────────────────────
  push(
    'facilities',
    'facilities',
    'Pitié-Salpêtrière Campus',
    {
      facilityId: DEMO_FACILITY,
      code: 'PAR-PSL',
      city: 'Paris',
      country: 'FR',
      beds: 420,
      status: 'operational',
    },
    'operational',
  );
  push('facilities', 'buildings', 'Main Tower', {
    buildingId: id(17110),
    facilityId: DEMO_FACILITY,
    facilityName: 'Pitié-Salpêtrière Campus',
    floors: 12,
    yearBuilt: 1975,
  });
  push('facilities', 'rooms', 'ICU A-12', {
    roomId: id(17111),
    buildingId: id(17110),
    facilityId: DEMO_FACILITY,
    bedCount: 2,
    type: 'icu',
  });
  push('facilities', 'beds', 'ICU A-12-1', {
    bedId: id(17112),
    roomId: id(17111),
    facilityId: DEMO_FACILITY,
    status: 'available',
  });
  push(
    'facilities',
    'work-orders',
    'HVAC Zone B repair',
    {
      workOrderId: id(17113),
      description: 'Temperature drift in Zone B',
      facilityId: DEMO_FACILITY,
      facilityName: 'Pitié-Salpêtrière Campus',
      type: 'corrective',
      priority: 'high',
      status: 'open',
      slaHours: 24,
      slaBreached: false,
    },
    'open',
  );
  push(
    'facilities',
    'work-orders',
    'Generator monthly test',
    {
      workOrderId: id(17114),
      description: 'Scheduled generator load test',
      facilityId: DEMO_FACILITY,
      facilityName: 'Pitié-Salpêtrière Campus',
      type: 'preventive',
      priority: 'medium',
      status: 'assigned',
      assignedTechnicianName: 'Jean Martin',
      slaHours: 48,
      slaBreached: false,
    },
    'assigned',
  );
  push('facilities', 'equipment', 'MRI Scanner Suite 2', {
    equipmentId: id(17115),
    assetTag: 'MRI-02',
    serialNumber: 'SM-MRI-88421',
    manufacturer: 'Siemens',
    facilityId: DEMO_FACILITY,
    status: 'operational',
  });
  push('facilities', 'biomedical-devices', 'Infusion Pump Fleet A', {
    equipmentId: id(17116),
    assetTag: 'IV-A',
    facilityId: DEMO_FACILITY,
    status: 'operational',
  });
  push(
    'facilities',
    'preventive-maintenance',
    'MRI PM quarterly',
    {
      scheduleId: id(17117),
      equipmentId: id(17115),
      equipmentName: 'MRI Scanner Suite 2',
      facilityId: DEMO_FACILITY,
      frequencyDays: 90,
      nextDue: '2026-09-15',
      status: 'compliant',
    },
    'compliant',
  );
  push(
    'facilities',
    'calibration',
    'Infusion pump batch Q3',
    {
      calibrationId: id(17118),
      equipmentId: id(17116),
      dueDate: '2026-09-01',
      status: 'scheduled',
    },
    'scheduled',
  );
  push('facilities', 'utilities', 'Campus HVAC Primary', {
    utilityId: id(17119),
    type: 'hvac',
    facilityId: DEMO_FACILITY,
    facilityName: 'Pitié-Salpêtrière Campus',
    status: 'normal',
    lastReading: 21.4,
    unit: '°C',
  });
  push('facilities', 'vendors', 'EuroMed Facilities SA', {
    vendorId: id(17120),
    category: 'maintenance',
    rating: 4.5,
    contactEmail: 'ops@euromed.example',
  });
  push('facilities', 'contracts', 'Annual HVAC SLA', {
    contractId: id(17121),
    vendorId: id(17120),
    vendor: 'EuroMed Facilities SA',
    value: 180000,
    currency: 'EUR',
  });
  push('facilities', 'inspections', 'Fire safety walkthrough', {
    inspectionId: id(17122),
    facilityId: DEMO_FACILITY,
    scheduledFor: '2026-08-12',
  });
  push('facilities', 'vehicles', 'Shuttle Van 3', {
    vehicleId: id(17123),
    facilityId: DEMO_FACILITY,
    status: 'active',
  });
  push('facilities', 'sensors', 'OR humidity sensor', {
    sensorId: id(17124),
    facilityId: DEMO_FACILITY,
    metric: 'humidity',
  });
  push('facilities', 'environmental', 'OR-3 climate reading', {
    readingId: id(17125),
    facilityId: DEMO_FACILITY,
    location: 'OR-3',
    metric: 'temperature',
    value: 20.5,
    unit: '°C',
    timestamp: NOW,
    status: 'normal',
  });

  // ── Workforce ───────────────────────────────────────────────
  push('workforce', 'employees', 'Marie Dubois', {
    employeeId: id(18001),
    employeeNumber: 'EMP-1001',
    firstName: 'Marie',
    lastName: 'Dubois',
    fullName: 'Marie Dubois',
    email: 'marie.dubois@medease.health',
    phone: '+33 1 40 00 10 10',
    jobTitle: 'Nurse Manager',
    roleId: 'role-nurse',
    roleName: 'Nurse Manager',
    departmentId: id(18010),
    departmentName: 'Intensive Care',
    facilityId: DEMO_FACILITY,
    facilityName: 'Pitié-Salpêtrière Campus',
    employmentType: 'full_time',
    status: 'active',
    hireDate: '2019-04-12',
    licenses: [],
    certifications: [],
    emergencyContacts: [],
  });
  push('workforce', 'shifts', 'ICU Day — Marie Dubois', {
    shiftId: id(18020),
    employeeId: id(18001),
    employeeName: 'Marie Dubois',
    departmentName: 'Intensive Care',
    facilityId: DEMO_FACILITY,
    startAt: '2026-08-04T07:00:00.000Z',
    endAt: '2026-08-04T19:00:00.000Z',
    status: 'scheduled',
  });
  push('workforce', 'certifications', 'BLS — Marie Dubois', {
    certificationId: id(18021),
    employeeId: id(18001),
    employeeName: 'Marie Dubois',
    name: 'BLS',
    expiresAt: '2026-10-01',
    status: 'expiring',
  });
  push('workforce', 'employees', 'Jean Martin', {
    employeeId: id(18002),
    employeeNumber: 'EMP-1002',
    firstName: 'Jean',
    lastName: 'Martin',
    fullName: 'Jean Martin',
    email: 'jean.martin@medease.health',
    phone: '+33 1 40 00 10 11',
    jobTitle: 'Biomedical Engineer',
    roleId: 'role-biomed',
    roleName: 'Biomedical Engineer',
    departmentId: id(18011),
    departmentName: 'Facilities',
    facilityId: DEMO_FACILITY,
    facilityName: 'Pitié-Salpêtrière Campus',
    employmentType: 'full_time',
    status: 'active',
    hireDate: '2021-09-01',
    licenses: [],
    certifications: [],
    emergencyContacts: [],
  });
  push('workforce', 'departments', 'Intensive Care', {
    departmentId: id(18010),
    headcount: 48,
    costCenter: 'CC-ICU',
    facilityId: DEMO_FACILITY,
  });
  push('workforce', 'departments', 'Facilities', {
    departmentId: id(18011),
    headcount: 22,
    costCenter: 'CC-FAC',
    facilityId: DEMO_FACILITY,
  });
  push(
    'workforce',
    'schedules',
    'ICU Night Shift Aug 4',
    {
      scheduleId: id(18020),
      departmentId: id(18010),
      department: 'ICU',
      start: '2026-08-04T20:00:00Z',
      end: '2026-08-05T08:00:00Z',
    },
    'published',
  );
  push(
    'workforce',
    'credentials',
    'RN License — Marie Dubois',
    {
      credentialId: id(18021),
      employeeId: id(18001),
      employeeName: 'Marie Dubois',
      expiresAt: '2027-03-01',
    },
    'valid',
  );
  push(
    'workforce',
    'attendance',
    'Clock-in Marie Dubois',
    {
      attendanceId: id(18022),
      employeeId: id(18001),
      at: NOW,
    },
    'present',
  );
  push(
    'workforce',
    'leave-requests',
    'Annual leave — Jean Martin',
    {
      leaveId: id(18023),
      employeeId: id(18002),
      employeeName: 'Jean Martin',
      from: '2026-08-18',
      to: '2026-08-22',
    },
    'pending',
  );
  push('workforce', 'training', 'BLS refresh 2026', {
    trainingId: id(18024),
    assignees: 48,
  });
  push('workforce', 'performance', 'Q2 review cycle', {
    cycleId: id(18025),
    openReviews: 12,
  });
  push('workforce', 'payroll', 'July 2026 payroll', {
    period: '2026-07',
    totalCost: 1280000,
    lines: [],
  });
  push('workforce', 'on-call', 'ICU on-call Aug 4', {
    entries: [{ employeeId: id(18001), name: 'Marie Dubois' }],
  });

  // ── Quality ─────────────────────────────────────────────────
  push(
    'quality',
    'incidents',
    'Near-miss medication labeling',
    {
      incidentId: id(19001),
      severity: 'medium',
      facilityId: DEMO_FACILITY,
      description: 'Look-alike labels on high-alert meds',
    },
    'open',
  );
  push(
    'quality',
    'risks',
    'OR fire risk residual',
    {
      riskId: id(19002),
      score: 8,
      likelihood: 2,
      impact: 4,
    },
    'mitigating',
  );
  push(
    'quality',
    'capa',
    'Relabel high-alert meds',
    {
      capaId: id(19003),
      owner: 'Pharmacy QA',
      incidentId: id(19001),
    },
    'in_progress',
  );
  push(
    'quality',
    'audits',
    'ISO 9001 internal audit',
    {
      auditId: id(19004),
      scheduledFor: '2026-08-20',
      score: 92,
    },
    'scheduled',
  );
  push(
    'quality',
    'policies',
    'Hand hygiene protocol',
    {
      policyId: id(19005),
      version: '3.2',
    },
    'published',
  );
  push('quality', 'accreditation', 'HAS certification track', {
    standardId: id(19006),
    body: 'HAS',
    readiness: 86,
  });
  push('quality', 'infection-control', 'Infection control pack', {
    records: {
      items: [
        {
          id: id(19007),
          title: 'CLABSI rate ICU',
          rate: 0.8,
          status: 'watch',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    },
    outbreaks: [],
  });
  push('quality', 'compliance', 'GDPR clinical access review', {
    complianceId: id(19008),
    percent: 94,
  });
  push('quality', 'documents', 'SOP medication safety', {
    documentId: id(19009),
  });
  push('quality', 'inspections', 'Ward cleanliness audit', {
    inspectionId: id(19010),
  });
  push('quality', 'findings', 'Open labeling finding', {
    findingId: id(19011),
  });
  push('quality', 'quality-indicators', 'Hand hygiene compliance', {
    indicatorId: id(19012),
    value: 91,
  });
  push('quality', 'root-cause-analyses', 'RCA medication near-miss', {
    rcaId: id(19013),
    incidentId: id(19001),
  });

  // ── Population health ───────────────────────────────────────
  push('population-health', 'registries', 'Diabetes Type 2 Registry', {
    registryId: id(20001),
    members: 1280,
  });
  push(
    'population-health',
    'care-gaps',
    'Overdue HbA1c screenings',
    {
      gapId: id(20002),
      patients: 86,
    },
    'open',
  );
  push('population-health', 'cohorts', 'High-risk CHF', {
    cohortId: id(20003),
    size: 214,
  });
  push('population-health', 'high-risk-patients', 'Priority outreach list', {
    listId: id(20004),
    count: 42,
  });
  push('population-health', 'population', 'Adults 40-75 Paris', {
    populationId: id(20005),
    size: 54000,
  });
  push('population-health', 'risk-scores', 'Readmission risk cohort', {
    scoreId: id(20006),
    average: 0.34,
  });
  push('population-health', 'chronic-programs', 'CHF pathway', {
    programId: id(20007),
  });
  push('population-health', 'preventive-care', 'Colorectal screening', {
    programId: id(20008),
  });
  push('population-health', 'outreach', 'SMS reminder campaign', {
    campaignId: id(20009),
  });
  push('population-health', 'community-health', 'Arrondissement 13 panel', {
    panelId: id(20010),
  });
  push('population-health', 'geographic-regions', 'Paris 13e', {
    regionId: id(20011),
  });

  // ── Remaining modules (compact but typed) ───────────────────
  const compact: Array<[string, string, string, Record<string, unknown>, string?]> = [
    ['cdss', 'alerts', 'Drug interaction — warfarin + NSAID', { alertId: id(21001), severity: 'high' }, 'active'],
    ['cdss', 'guidelines', 'Sepsis early recognition', { guidelineId: id(21002), version: '2026.1' }, 'published'],
    ['cdss', 'order-sets', 'Community-acquired pneumonia', { orderSetId: id(21003), orders: 12 }],
    ['cdss', 'rules', 'Fall-risk scoring rule', { ruleId: id(21004), enabled: true }],
    ['cdss', 'recommendations', 'VTE prophylaxis suggestion', { recommendationId: id(21005) }],
    ['cdss', 'pathways', 'Chest pain pathway', { pathwayId: id(21006) }],
    ['cdss', 'protocols', 'Code blue protocol', { protocolId: id(21007) }],
    ['interoperability', 'endpoints', 'CHU Lab FHIR R4', { endpointId: id(22001), url: 'https://lab.example/fhir' }, 'connected'],
    ['interoperability', 'hl7-messages', 'ADT^A01 inbound', { messageId: id(22002) }, 'acked'],
    ['interoperability', 'webhooks', 'Results available webhook', { webhookId: id(22003) }],
    ['interoperability', 'jobs', 'Nightly terminology sync', { jobId: id(22004) }, 'succeeded'],
    ['interoperability', 'fhir-servers', 'Internal FHIR gateway', { serverId: id(22005) }],
    ['interoperability', 'api-clients', 'Partner Lab client', { clientId: id(22006) }],
    ['research', 'trials', 'CARDIO-FR Phase II', { trialId: id(23001), phase: 'II', enrolled: 48 }, 'recruiting'],
    ['research', 'participants', 'Participant screen #48', { participantId: id(23002), trial: 'CARDIO-FR' }, 'enrolled'],
    ['research', 'adverse-events', 'Mild injection site reaction', { aeId: id(23003), grade: 1 }, 'reported'],
    ['research', 'grants', 'ANR Digital Care 2026', { grantId: id(23004), amount: 420000 }, 'active'],
    ['public-health', 'cases', 'Influenza cluster — 12e', { caseId: id(24001), count: 17 }, 'investigating'],
    ['public-health', 'outbreaks', 'Norovirus ward alert', { outbreakId: id(24002), facilityId: DEMO_FACILITY }, 'contained'],
    ['public-health', 'immunizations', 'Staff flu campaign 2026', { campaignId: id(24003), coverage: 0.78 }, 'active'],
    ['public-health', 'contact-tracing', 'Index case follow-ups', { tracingId: id(24004), contacts: 23 }, 'open'],
    ['ai-intelligence', 'models', 'Readmission risk v2.1', { modelId: id(25001), auc: 0.84 }, 'deployed'],
    ['ai-intelligence', 'predictions', 'High readmission risk batch', { predictionId: id(25002), patients: 19 }],
    ['ai-intelligence', 'alerts', 'Model drift warning — sepsis', { alertId: id(25003), severity: 'medium' }, 'open'],
    ['ai-intelligence', 'bias-monitoring', 'Gender parity check Q3', { checkId: id(25004), score: 0.97 }, 'pass'],
    ['executive', 'strategic-initiatives', 'Reduce ED wait < 30m', { initiativeId: id(26001), progress: 0.62 }, 'on_track'],
    ['executive', 'enterprise-kpis', 'Net promoter — inpatient', { kpiId: id(26002), value: 62, target: 70 }],
    ['executive', 'executive-alerts', 'ICU occupancy > 92%', { alertId: id(26003), severity: 'high' }, 'open'],
    ['executive', 'benchmark-reports', 'Peer ALOS comparison', { reportId: id(26004), period: '2026-Q2' }],
    ['documents', 'documents', 'Fire safety policy.pdf', { documentId: id(27001), folder: 'Compliance' }, 'published'],
    ['documents', 'folders', 'Compliance', { folderId: id(27002), documentCount: 24 }],
    ['documents', 'templates', 'Incident report template', { templateId: id(27003), format: 'docx' }],
    ['documents', 'retention-policies', 'Clinical records 20y', { policyId: id(27004), years: 20 }],
    ['workflows', 'definitions', 'PO approval workflow', { definitionId: id(28001), steps: 3 }, 'published'],
    ['workflows', 'instances', 'PO-2026-PAR-001 approval', { instanceId: id(28002) }, 'running'],
    ['workflows', 'tasks', 'Director sign-off', { taskId: id(28003), assignee: DEMO_ADMIN_ID }, 'pending'],
    ['workflows', 'jobs', 'Nightly SLA sweep', { jobId: id(28004), cron: '0 2 * * *' }, 'scheduled'],
    ['messaging', 'announcements', 'Pharmacy downtime Sunday 02:00', { announcementId: id(29001), channel: 'all-staff' }, 'scheduled'],
    ['messaging', 'templates', 'Appointment reminder SMS', { templateId: id(29002), channel: 'sms' }],
    ['messaging', 'broadcasts', 'Heatwave protocol reminder', { broadcastId: id(29003), audience: 'clinical' }, 'sent'],
    ['messaging', 'threads', 'Bed board coordination', { threadId: id(29004), participants: 4 }, 'open'],
    ['api-platform', 'api-keys', 'Partner Lab Integration', { keyId: id(30001), prefix: 'me_live_' }, 'active'],
    ['api-platform', 'oauth-apps', 'Patient Portal Mobile', { appId: id(30002), redirectUris: 1 }, 'active'],
    ['api-platform', 'webhooks', 'Claim created', { webhookId: id(30003), url: 'https://partner.example/hooks' }, 'active'],
    ['api-platform', 'partners', 'LabTech FR', { partnerId: id(30004), tier: 'gold' }, 'active'],
    ['api-platform', 'sandboxes', 'Sandbox — partner onboarding', { sandboxId: id(30005), region: 'eu-west' }, 'ready'],
    ['reporting', 'definitions', 'Monthly revenue pack', { definitionId: id(31001), owner: 'Finance' }, 'published'],
    ['reporting', 'schedules', 'Weekly occupancy digest', { scheduleId: id(31002), cron: '0 7 * * 1' }, 'active'],
    ['reporting', 'exports', 'Q2 quality pack.xlsx', { exportId: id(31003), format: 'xlsx' }, 'ready'],
    ['reporting', 'compliance-reports', 'HAS indicators 2026-H1', { reportId: id(31004) }, 'draft'],
    ['platform-admin', 'tenants', 'Med-Ease Demo Tenant', { tenantId: DEMO_TENANT_ID, slug: 'medease-demo', region: 'eu-west', userCount: 24 }, 'active'],
    ['platform-admin', 'hospitals', 'AP-HP Cluster Paris', { hospitalId: id(32001), facilities: 3, bedCapacity: 1200, accreditation: 'HAS' }, 'active'],
    ['platform-admin', 'feature-flags', 'finance.gl.live', { flagId: id(32002), key: 'finance.gl.live', label: 'Finance GL Live', enabled: true }, 'enabled'],
    ['platform-admin', 'feature-flags', 'executive.command-center', { flagId: id(32003), key: 'executive.command-center', label: 'Executive Command Center', enabled: true }, 'enabled'],
    ['platform-admin', 'jobs', 'prisma seed reconcile', { jobId: id(32004), lastStatus: 'succeeded' }, 'succeeded'],
    ['platform-admin', 'system-health', 'API cluster', { healthId: id(32005), service: 'api', status: 'healthy', latencyMs: 42, uptimePercent: 99.9, lastChecked: NOW }, 'healthy'],
    ['platform-admin', 'system-health', 'PostgreSQL', { healthId: id(32006), service: 'postgresql', status: 'healthy', latencyMs: 8, uptimePercent: 99.95, lastChecked: NOW }, 'healthy'],
    ['platform-admin', 'system-health', 'Redis', { healthId: id(32007), service: 'redis', status: 'healthy', latencyMs: 2, uptimePercent: 99.99, lastChecked: NOW }, 'healthy'],
    ['platform-admin', 'workers', 'notifications-worker', { workerId: id(32008), name: 'notifications-worker', queue: 'outbound-email', status: 'idle', processedCount: 18420, lastHeartbeat: NOW }, 'idle'],
    ['platform-admin', 'workers', 'reports-worker', { workerId: id(32013), name: 'reports-worker', queue: 'report-exports', status: 'busy', processedCount: 932, lastHeartbeat: NOW }, 'busy'],
    ['platform-admin', 'queues', 'outbound-email', { queueId: id(32009), name: 'outbound-email', pendingCount: 3, processingCount: 1, failedCount: 0, maxRetries: 5, enabled: true }, 'healthy'],
    ['platform-admin', 'queues', 'report-exports', { queueId: id(32014), name: 'report-exports', pendingCount: 0, processingCount: 1, failedCount: 0, maxRetries: 3, enabled: true }, 'healthy'],
    ['messaging', 'messages', 'Pharmacy downtime notice', { messageId: id(29005), subject: 'Pharmacy downtime', channel: 'in-app', status: 'delivered' }, 'delivered'],
    ['platform-admin', 'licenses', 'Enterprise seat pack', { licenseId: id(32010), seats: 500 }, 'active'],
    ['platform-admin', 'facilities', 'Paris demo facility', { facilityId: DEMO_FACILITY, name: 'Pitié-Salpêtrière' }, 'active'],
    ['platform-admin', 'storage', 'Primary object store', { storageId: id(32011), usedGb: 420, capacityGb: 2000 }],
    ['platform-admin', 'backups', 'Nightly full backup', { backupId: id(32012), type: 'full', sizeGb: 86 }, 'completed'],
  ];

  for (const [module, resourceType, title, payload, status] of compact) {
    push(module, resourceType, title, payload, status ?? 'active');
  }

  return items;
}

function payloads(mine: SeedItem[], type: string) {
  return mine.filter((i) => i.resourceType === type).map((i) => i.payload);
}

function trend(value: number) {
  return [
    { label: 'Jan', value: Math.max(0, value - 12) },
    { label: 'Feb', value: Math.max(0, value - 7) },
    { label: 'Mar', value },
  ];
}

function dashboardFor(module: string, items: SeedItem[]) {
  const mine = items.filter((i) => i.module === module);
  const count = (type: string) =>
    mine.filter((i) => i.resourceType === type).length;
  const open = mine.filter((i) =>
    ['open', 'pending', 'running', 'investigating', 'in_progress', 'assigned', 'active'].includes(
      i.status ?? '',
    ),
  ).length;

  const base = {
    module,
    facilityId: DEMO_FACILITY,
    generatedAt: NOW,
    totalRecords: mine.length,
    openItems: open,
  };

  switch (module) {
    case 'facilities':
      return {
        ...base,
        totalBuildings: count('buildings') || 1,
        totalRooms: count('rooms') || 12,
        totalBeds: 420,
        availableBeds: 38,
        totalEquipment: count('equipment') + count('biomedical-devices') || 24,
        operationalEquipment: 22,
        openWorkOrders: count('work-orders') || open,
        overdueMaintenance: 1,
        calibrationDue: count('calibration') || 1,
        utilityAlerts: 0,
        recentWorkOrders: payloads(mine, 'work-orders'),
        utilitySystems: payloads(mine, 'utilities'),
      };
    case 'workforce':
      return {
        ...base,
        totalStaff: count('employees') || 70,
        activeStaff: count('employees') || 68,
        onLeave: 2,
        openShifts: 3,
        pendingLeave: count('leave-requests') || 1,
        expiringCredentials: 4,
        overdueTraining: 2,
        coveragePercent: 94,
        absenteeismRate: 3.2,
        recentShifts: payloads(mine, 'shifts'),
        pendingLeaveRequests: payloads(mine, 'leave-requests'),
        expiringCertifications: payloads(mine, 'certifications'),
      };
    case 'quality':
      return {
        ...base,
        openIncidents: count('incidents') || 1,
        escalatedIncidents: 0,
        openRisks: count('risks') || 1,
        highRisks: 1,
        openCapa: count('capa') || 1,
        capaCompletionRate: 78,
        auditScore: 92,
        openFindings: 2,
        infectionRate: 0.8,
        accreditationReadiness: 86,
        compliancePercent: 94,
        policyCompliance: 91,
        recentIncidents: payloads(mine, 'incidents'),
        recentCapa: payloads(mine, 'capa'),
        riskHeatMap: [
          { label: 'Clinical', likelihood: 2, impact: 4, count: 1 },
          { label: 'Operational', likelihood: 2, impact: 3, count: 1 },
          { label: 'Regulatory', likelihood: 1, impact: 5, count: 1 },
        ],
      };
    case 'population-health':
      return {
        ...base,
        totalPopulation: 54000,
        openCareGaps: count('care-gaps') || 1,
        highRiskCount: 42,
        risingRiskCount: 18,
        registryEnrollment: 1280,
        preventiveCompliance: 81,
        readmissionRate: 9.4,
        outreachActive: count('outreach') || 1,
        recentGaps: payloads(mine, 'care-gaps'),
        riskDistribution: [
          { tier: 'low', count: 21000 },
          { tier: 'moderate', count: 18000 },
          { tier: 'high', count: 4200 },
          { tier: 'critical', count: 420 },
        ],
        topRegistries: payloads(mine, 'registries'),
      };
    case 'cdss':
      return {
        ...base,
        activeAlerts: count('alerts') || 1,
        criticalAlerts: 1,
        pendingRecommendations: count('recommendations') || 1,
        guidelineCompliance: 88,
        orderSetsApplied: 24,
        preventiveDue: 6,
        recentAlerts: payloads(mine, 'alerts'),
        recentRecommendations: payloads(mine, 'recommendations'),
        topOrderSets: payloads(mine, 'order-sets'),
      };
    case 'interoperability':
      return {
        ...base,
        activeEndpoints: count('endpoints') || 1,
        messagesToday: 1280,
        fhirTransactions: 420,
        hl7Processed: 860,
        dicomStudies: 64,
        failedJobs: 0,
        queueDepth: 12,
        recentJobs: payloads(mine, 'jobs'),
        recentMessages: payloads(mine, 'hl7-messages'),
        topEndpoints: payloads(mine, 'endpoints'),
      };
    case 'research':
      return {
        ...base,
        activeTrials: count('trials') || 1,
        totalParticipants: 48,
        enrolledThisMonth: 6,
        openDeviations: 1,
        pendingConsents: 3,
        seriousAdverseEvents: 0,
        biospecimensStored: 210,
        publicationsThisYear: 2,
        topTrials: payloads(mine, 'trials'),
        enrollmentTrend: trend(48),
      };
    case 'public-health':
      return {
        ...base,
        activeCases: 17,
        activeOutbreaks: count('outbreaks') || 1,
        immunizationsDue: 120,
        contactsMonitoring: 23,
        communityProgramsActive: 4,
        sdohHighRisk: 86,
        caseTrend: trend(17),
        topDiseases: [
          { label: 'Influenza', value: 17 },
          { label: 'Norovirus', value: 4 },
        ],
        recentOutbreaks: payloads(mine, 'outbreaks'),
      };
    case 'ai-intelligence':
      return {
        ...base,
        activePredictions: count('predictions') || 19,
        highRiskPatients: 19,
        pendingRecommendations: 7,
        activeCopilotSessions: 3,
        modelAccuracy: 0.84,
        alertsOpen: count('alerts') || 1,
        predictionTrend: trend(19),
        riskDistribution: [
          { label: 'low', value: 120 },
          { label: 'moderate', value: 48 },
          { label: 'high', value: 19 },
          { label: 'critical', value: 3 },
        ],
        recentAlerts: payloads(mine, 'alerts'),
      };
    case 'executive':
      return {
        ...base,
        totalKpis: count('enterprise-kpis') || 12,
        activeAlerts: count('executive-alerts') || 1,
        bedOccupancy: 87,
        revenueMtd: 4200000,
        qualityScore: 91,
        initiativesOnTrack: count('strategic-initiatives') || 1,
        kpiTrend: trend(86),
        alertDistribution: [
          { label: 'high', value: 1 },
          { label: 'medium', value: 2 },
        ],
        recentAlerts: payloads(mine, 'executive-alerts'),
        topKpis: payloads(mine, 'enterprise-kpis'),
      };
    case 'documents':
      return {
        ...base,
        totalDocuments: count('documents') || 24,
        totalFolders: count('folders') || 1,
        totalTemplates: count('templates') || 1,
        pendingSignatures: 2,
        activeLegalHolds: 0,
        ocrJobsToday: 14,
        sharedLinksActive: 5,
        storageUsedGb: 86,
        uploadTrend: trend(24),
        moduleBreakdown: [
          { label: 'Compliance', value: 12 },
          { label: 'Clinical', value: 8 },
        ],
        recentActivity: payloads(mine, 'documents').map((d) => ({
          ...d,
          action: 'view',
          actorId: DEMO_ADMIN_ID,
          timestamp: NOW,
        })),
      };
    case 'workflows':
      return {
        ...base,
        totalDefinitions: count('definitions') || 1,
        activeInstances: count('instances') || 1,
        pendingTasks: count('tasks') || 1,
        pendingApprovals: 1,
        slaBreaches: 0,
        backgroundJobsRunning: 1,
        eventsToday: 42,
        instanceTrend: trend(8),
        moduleBreakdown: [
          { label: 'Procurement', value: 3 },
          { label: 'HR', value: 2 },
        ],
        recentEvents: payloads(mine, 'tasks').map((t) => ({
          ...t,
          eventType: 'task_created',
          timestamp: NOW,
        })),
      };
    case 'messaging':
      return {
        ...base,
        totalMessages: count('messages') || 12,
        unreadInbox: 3,
        activeCampaigns: count('broadcasts') || 1,
        pendingDeliveries: 2,
        channelHealthScore: 97,
        broadcastsToday: 1,
        deliveryRate: 98.4,
        messageTrend: trend(120),
        channelBreakdown: [
          { label: 'in-app', value: 80 },
          { label: 'sms', value: 30 },
          { label: 'email', value: 10 },
        ],
        recentMessages: payloads(mine, 'messages'),
      };
    case 'api-platform':
      return {
        ...base,
        totalEndpoints: 48,
        activeApiKeys: count('api-keys') || 1,
        oauthApps: count('oauth-apps') || 1,
        activeWebhooks: count('webhooks') || 1,
        sdkDownloads: 210,
        sandboxEnvironments: count('sandboxes') || 1,
        partners: count('partners') || 1,
        requestsToday: 18420,
        requestTrend: trend(18420),
        moduleBreakdown: [
          { label: 'FHIR', value: 8200 },
          { label: 'Billing', value: 4100 },
        ],
        recentDeliveries: payloads(mine, 'webhooks').map((w) => ({
          ...w,
          deliveryId: w.webhookId ?? id(30099),
          status: 'delivered',
          attempts: 1,
          deliveredAt: NOW,
        })),
      };
    case 'reporting':
      return {
        ...base,
        totalDefinitions: count('definitions') || 1,
        activeInstances: count('schedules') || 1,
        pendingExports: 0,
        scheduledReports: count('schedules') || 1,
        complianceDue: count('compliance-reports') || 1,
        exportsToday: 3,
        categoryBreakdown: [
          { label: 'Finance', value: 4 },
          { label: 'Quality', value: 3 },
        ],
        generationTrend: trend(12),
        recentExports: payloads(mine, 'exports'),
      };
    case 'platform-admin':
      return {
        ...base,
        totalTenants: count('tenants') || 1,
        activeTenants: 1,
        totalFacilities: count('facilities') || 1,
        totalUsers: 24,
        systemHealthScore: 98,
        pendingJobs: 3,
        failedJobs: 0,
        storageUsedGb: 420,
        storageCapacityGb: 2000,
        tenantTrend: trend(1),
        regionBreakdown: [{ label: 'eu-west', value: 1 }],
        recentAudits: [
          {
            auditId: id(32020),
            action: 'feature_flag.toggle',
            resource: 'finance.gl.live',
            actorId: DEMO_ADMIN_ID,
            outcome: 'success',
            timestamp: NOW,
          },
        ],
      };
    default:
      return {
        ...base,
        counts: Object.fromEntries(
          [...new Set(mine.map((i) => i.resourceType))].map((t) => [
            t,
            count(t),
          ]),
        ),
        kpis: [
          { label: 'Records', value: mine.length },
          { label: 'Open', value: open },
        ],
        health: 'operational',
        recentActivity: [],
        recentAlerts: [],
        recentEvents: [],
      };
  }
}

function analyticsFor(module: string, items: SeedItem[]) {
  const dash = dashboardFor(module, items) as Record<string, unknown>;
  return {
    module,
    generatedAt: NOW,
    ...dash,
    trends: [{ label: 'Current', value: Number(dash.totalRecords ?? 0) }],
    breakdown: Array.isArray(dash.kpis) ? dash.kpis : [],
  };
}

export const enterpriseSeed: SeedModule = {
  name: 'enterprise',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const catalog = buildCatalog();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        for (const item of catalog) {
          await tx.enterpriseRecord.upsert({
            where: { id: item.id },
            create: {
              id: item.id,
              tenantId: DEMO_TENANT_ID,
              module: item.module,
              resourceType: item.resourceType,
              title: item.title,
              status: item.status,
              payload: item.payload,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              title: item.title,
              status: item.status,
              payload: item.payload,
              updatedBy: DEMO_ADMIN_ID,
            },
          });
        }

        for (const module of MODULES) {
          const dashId = id(34000 + MODULES.indexOf(module));
          const analyticsId = id(34100 + MODULES.indexOf(module));
          const dash = dashboardFor(module, catalog);
          const analytics = analyticsFor(module, catalog);

          await tx.enterpriseSnapshot.upsert({
            where: {
              tenantId_module_kind_scopeKey: {
                tenantId: DEMO_TENANT_ID,
                module,
                kind: 'dashboard',
                scopeKey: '',
              },
            },
            create: {
              id: dashId,
              tenantId: DEMO_TENANT_ID,
              module,
              kind: 'dashboard',
              scopeKey: '',
              payload: dash,
            },
            update: { payload: dash },
          });

          await tx.enterpriseSnapshot.upsert({
            where: {
              tenantId_module_kind_scopeKey: {
                tenantId: DEMO_TENANT_ID,
                module,
                kind: 'analytics',
                scopeKey: '',
              },
            },
            create: {
              id: analyticsId,
              tenantId: DEMO_TENANT_ID,
              module,
              kind: 'analytics',
              scopeKey: '',
              payload: analytics,
            },
            update: { payload: analytics },
          });
        }

        const notifications = [
          {
            id: id(33001),
            title: 'Work order assigned',
            message: 'HVAC Zone B repair assigned to Maintenance Team.',
            type: 'facilities',
            priority: 'high',
            category: 'facilities',
          },
          {
            id: id(33002),
            title: 'Feature flag enabled',
            message: 'finance.gl.live is now enabled for the demo tenant.',
            type: 'system',
            priority: 'medium',
            category: 'system',
          },
          {
            id: id(33003),
            title: 'Quality incident opened',
            message: 'Near-miss medication labeling requires CAPA owner.',
            type: 'quality',
            priority: 'critical',
            category: 'quality',
            pinned: true,
          },
        ];

        for (const n of notifications) {
          await tx.appNotification.upsert({
            where: { id: n.id },
            create: {
              id: n.id,
              tenantId: DEMO_TENANT_ID,
              userId: DEMO_ADMIN_ID,
              title: n.title,
              message: n.message,
              type: n.type,
              priority: n.priority,
              category: n.category,
              pinned: Boolean(n.pinned),
              read: false,
            },
            update: {
              title: n.title,
              message: n.message,
              pinned: Boolean(n.pinned),
            },
          });
        }

        await tx.userPreference.upsert({
          where: {
            tenantId_userId_key: {
              tenantId: DEMO_TENANT_ID,
              userId: DEMO_ADMIN_ID,
              key: 'emailAlerts',
            },
          },
          create: {
            id: id(34201),
            tenantId: DEMO_TENANT_ID,
            userId: DEMO_ADMIN_ID,
            key: 'emailAlerts',
            value: true,
          },
          update: { value: true },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
