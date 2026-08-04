import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_FACILITY = '01930000-0000-7000-8000-000000000201';

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
    items.push({
      id: recordId,
      module,
      resourceType,
      title,
      status,
      payload: { ...payload, id: recordId, status, title, name: title },
    });
  };

  // Facilities 17xxx
  push('facilities', 'facilities', 'Pitié-Salpêtrière Campus', {
    facilityId: DEMO_FACILITY,
    code: 'PAR-PSL',
    city: 'Paris',
    beds: 420,
    status: 'operational',
  }, 'operational');
  push('facilities', 'buildings', 'Main Tower', {
    facilityId: DEMO_FACILITY,
    floors: 12,
    yearBuilt: 1975,
  });
  push('facilities', 'work-orders', 'HVAC Zone B repair', {
    priority: 'high',
    assignee: 'Maintenance Team',
    facilityId: DEMO_FACILITY,
  }, 'open');
  push('facilities', 'equipment', 'MRI Scanner Suite 2', {
    assetTag: 'MRI-02',
    manufacturer: 'Siemens',
  });
  push('facilities', 'vendors', 'EuroMed Facilities SA', {
    category: 'maintenance',
    rating: 4.5,
  });
  push('facilities', 'contracts', 'Annual HVAC SLA', {
    vendor: 'EuroMed Facilities SA',
    value: 180000,
  });
  push('facilities', 'calibration', 'Infusion pump batch Q3', {
    dueDate: '2026-09-01',
  }, 'scheduled');

  // Workforce 18xxx
  push('workforce', 'employees', 'Marie Dubois', {
    role: 'Nurse Manager',
    department: 'ICU',
    email: 'marie.dubois@medease.health',
  });
  push('workforce', 'employees', 'Jean Martin', {
    role: 'Biomedical Engineer',
    department: 'Facilities',
    email: 'jean.martin@medease.health',
  });
  push('workforce', 'departments', 'Intensive Care', {
    headcount: 48,
    costCenter: 'CC-ICU',
  });
  push('workforce', 'schedules', 'ICU Night Shift Aug 4', {
    department: 'ICU',
    start: '2026-08-04T20:00:00Z',
  }, 'published');
  push('workforce', 'credentials', 'RN License — Marie Dubois', {
    expiresAt: '2027-03-01',
  }, 'valid');
  push('workforce', 'attendance', 'Clock-in Marie Dubois', {
    at: new Date().toISOString(),
  }, 'present');

  // Quality 19xxx
  push('quality', 'incidents', 'Near-miss medication labeling', {
    severity: 'medium',
    facilityId: DEMO_FACILITY,
  }, 'open');
  push('quality', 'risks', 'OR fire risk residual', {
    score: 8,
  }, 'mitigating');
  push('quality', 'capa', 'Relabel high-alert meds', {
    owner: 'Pharmacy QA',
  }, 'in_progress');
  push('quality', 'audits', 'ISO 9001 internal audit', {
    scheduledFor: '2026-08-20',
  }, 'scheduled');
  push('quality', 'policies', 'Hand hygiene protocol', {
    version: '3.2',
  }, 'published');

  // Population health 20xxx
  push('population-health', 'registries', 'Diabetes Type 2 Registry', {
    members: 1280,
  });
  push('population-health', 'care-gaps', 'Overdue HbA1c screenings', {
    patients: 86,
  }, 'open');
  push('population-health', 'cohorts', 'High-risk CHF', {
    size: 214,
  });
  push('population-health', 'high-risk-patients', 'Priority outreach list', {
    count: 42,
  });

  // CDSS 21xxx
  push('cdss', 'alerts', 'Drug interaction — warfarin + NSAID', {
    severity: 'high',
  }, 'active');
  push('cdss', 'guidelines', 'Sepsis early recognition', {
    version: '2026.1',
  }, 'published');
  push('cdss', 'order-sets', 'Community-acquired pneumonia', {
    orders: 12,
  });
  push('cdss', 'rules', 'Fall-risk scoring rule', {
    enabled: true,
  });

  // Interop 22xxx
  push('interoperability', 'endpoints', 'CHU Lab FHIR R4', {
    url: 'https://lab.example/fhir',
  }, 'connected');
  push('interoperability', 'hl7-messages', 'ADT^A01 inbound', {
    status: 'acked',
  }, 'acked');
  push('interoperability', 'webhooks', 'Results available webhook', {
    target: 'https://hooks.medease.health/results',
  });
  push('interoperability', 'jobs', 'Nightly terminology sync', {
    lastRun: new Date().toISOString(),
  }, 'succeeded');

  // Research 23xxx
  push('research', 'trials', 'CARDIO-FR Phase II', {
    phase: 'II',
    enrolled: 48,
  }, 'recruiting');
  push('research', 'participants', 'Participant screen #48', {
    trial: 'CARDIO-FR',
  }, 'enrolled');
  push('research', 'adverse-events', 'Mild injection site reaction', {
    grade: 1,
  }, 'reported');
  push('research', 'grants', 'ANR Digital Care 2026', {
    amount: 420000,
  }, 'active');

  // Public health 24xxx
  push('public-health', 'cases', 'Influenza cluster — 12e', {
    count: 17,
  }, 'investigating');
  push('public-health', 'outbreaks', 'Norovirus ward alert', {
    facilityId: DEMO_FACILITY,
  }, 'contained');
  push('public-health', 'immunizations', 'Staff flu campaign 2026', {
    coverage: 0.78,
  }, 'active');
  push('public-health', 'contact-tracing', 'Index case follow-ups', {
    contacts: 23,
  }, 'open');

  // AI 25xxx
  push('ai-intelligence', 'models', 'Readmission risk v2.1', {
    auc: 0.84,
  }, 'deployed');
  push('ai-intelligence', 'predictions', 'High readmission risk batch', {
    patients: 19,
  });
  push('ai-intelligence', 'alerts', 'Model drift warning — sepsis', {
    severity: 'medium',
  }, 'open');
  push('ai-intelligence', 'bias-monitoring', 'Gender parity check Q3', {
    score: 0.97,
  }, 'pass');

  // Executive 26xxx
  push('executive', 'strategic-initiatives', 'Reduce ED wait < 30m', {
    progress: 0.62,
  }, 'on_track');
  push('executive', 'enterprise-kpis', 'Net promoter — inpatient', {
    value: 62,
    target: 70,
  });
  push('executive', 'executive-alerts', 'ICU occupancy > 92%', {
    severity: 'high',
  }, 'open');
  push('executive', 'benchmark-reports', 'Peer ALOS comparison', {
    period: '2026-Q2',
  });

  // Documents 27xxx
  push('documents', 'documents', 'Fire safety policy.pdf', {
    folder: 'Compliance',
  }, 'published');
  push('documents', 'folders', 'Compliance', {
    documentCount: 24,
  });
  push('documents', 'templates', 'Incident report template', {
    format: 'docx',
  });
  push('documents', 'retention-policies', 'Clinical records 20y', {
    years: 20,
  });

  // Workflows 28xxx
  push('workflows', 'definitions', 'PO approval workflow', {
    steps: 3,
  }, 'published');
  push('workflows', 'instances', 'PO-2026-PAR-001 approval', {
    definition: 'PO approval workflow',
  }, 'running');
  push('workflows', 'tasks', 'Director sign-off', {
    assignee: DEMO_ADMIN_ID,
  }, 'pending');
  push('workflows', 'jobs', 'Nightly SLA sweep', {
    cron: '0 2 * * *',
  }, 'scheduled');

  // Messaging 29xxx
  push('messaging', 'announcements', 'Pharmacy downtime Sunday 02:00', {
    channel: 'all-staff',
  }, 'scheduled');
  push('messaging', 'templates', 'Appointment reminder SMS', {
    channel: 'sms',
  });
  push('messaging', 'broadcasts', 'Heatwave protocol reminder', {
    audience: 'clinical',
  }, 'sent');
  push('messaging', 'threads', 'Bed board coordination', {
    participants: 4,
  }, 'open');

  // API platform 30xxx
  push('api-platform', 'api-keys', 'Partner Lab Integration', {
    prefix: 'me_live_',
  }, 'active');
  push('api-platform', 'oauth-apps', 'Patient Portal Mobile', {
    redirectUris: 1,
  }, 'active');
  push('api-platform', 'webhooks', 'Encounter created', {
    url: 'https://partner.example/hooks',
  }, 'active');
  push('api-platform', 'partners', 'LabTech FR', {
    tier: 'gold',
  }, 'active');
  push('api-platform', 'sandboxes', 'Sandbox — partner onboarding', {
    region: 'eu-west',
  }, 'ready');

  // Reporting 31xxx
  push('reporting', 'definitions', 'Monthly revenue pack', {
    owner: 'Finance',
  }, 'published');
  push('reporting', 'schedules', 'Weekly occupancy digest', {
    cron: '0 7 * * 1',
  }, 'active');
  push('reporting', 'exports', 'Q2 quality pack.xlsx', {
    format: 'xlsx',
  }, 'ready');
  push('reporting', 'compliance-reports', 'HAS indicators 2026-H1', {
    status: 'draft',
  }, 'draft');

  // Platform admin 32xxx
  push('platform-admin', 'tenants', 'Med-Ease Demo Tenant', {
    tenantId: DEMO_TENANT_ID,
    slug: 'medease-demo',
  }, 'active');
  push('platform-admin', 'hospitals', 'AP-HP Cluster Paris', {
    facilities: 3,
  }, 'active');
  push('platform-admin', 'feature-flags', 'finance.gl.live', {
    enabled: true,
  }, 'enabled');
  push('platform-admin', 'feature-flags', 'executive.command-center', {
    enabled: true,
  }, 'enabled');
  push('platform-admin', 'jobs', 'prisma seed reconcile', {
    lastStatus: 'succeeded',
  }, 'succeeded');
  push('platform-admin', 'system-health', 'API cluster', {
    status: 'ok',
    region: 'eu',
  }, 'ok');
  push('platform-admin', 'licenses', 'Enterprise seat pack', {
    seats: 500,
  }, 'active');

  void MODULES;
  return items;
}

function dashboardFor(module: string, items: SeedItem[]) {
  const mine = items.filter((i) => i.module === module);
  const byType: Record<string, number> = {};
  for (const item of mine) {
    byType[item.resourceType] = (byType[item.resourceType] ?? 0) + 1;
  }
  return {
    module,
    facilityId: DEMO_FACILITY,
    generatedAt: new Date().toISOString(),
    totalRecords: mine.length,
    openItems: mine.filter((i) =>
      ['open', 'pending', 'running', 'investigating', 'in_progress'].includes(
        i.status ?? '',
      ),
    ).length,
    counts: byType,
    ...byType,
    health: 'operational',
    kpis: [
      { label: 'Records', value: mine.length },
      { label: 'Open', value: mine.filter((i) => i.status === 'open').length },
    ],
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
          const analytics = {
            module,
            generatedAt: new Date().toISOString(),
            trends: [{ label: 'Current', value: dash.totalRecords }],
            breakdown: Object.entries(dash.counts).map(([label, value]) => ({
              label,
              value,
            })),
          };

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
            message: 'Near-miss medication labeling requires CAPA review.',
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
