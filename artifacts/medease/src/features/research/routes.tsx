import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/research/pages/ProfessionalResearchPage');
const facilityPage = () =>
  import('@/features/research/pages/FacilityResearchPage');
const adminPage = () => import('@/features/research/pages/AdminResearchPage');

export function createProfessionalResearchRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/research',
      title: 'Clinical Research',
      breadcrumb: 'Research',
      analyticsName: `${analyticsPrefix}_research`,
      lazy: professionalPage,
      nav,
      permission: 'research.read',
      featureFlag: 'research',
    },
    {
      path: '/clinical-trials',
      title: 'Clinical Trials',
      breadcrumb: 'Trials',
      analyticsName: `${analyticsPrefix}_clinical_trials`,
      lazy: professionalPage,
      permission: 'research.trials',
      featureFlag: 'research',
    },
    {
      path: '/participants',
      title: 'Participants',
      breadcrumb: 'Participants',
      analyticsName: `${analyticsPrefix}_participants`,
      lazy: professionalPage,
      permission: 'research.participants',
      featureFlag: 'research',
    },
    {
      path: '/study-visits',
      title: 'Study Visits',
      breadcrumb: 'Visits',
      analyticsName: `${analyticsPrefix}_study_visits`,
      lazy: professionalPage,
      permission: 'research.read',
      featureFlag: 'research',
    },
    {
      path: '/adverse-events',
      title: 'Adverse Events',
      breadcrumb: 'Adverse Events',
      analyticsName: `${analyticsPrefix}_adverse_events`,
      lazy: professionalPage,
      permission: 'research.safety',
      featureFlag: 'research',
    },
    {
      path: '/biospecimens',
      title: 'Biospecimens',
      breadcrumb: 'Biospecimens',
      analyticsName: `${analyticsPrefix}_biospecimens`,
      lazy: professionalPage,
      permission: 'research.read',
      featureFlag: 'research',
    },
  ];
}

export function createFacilityResearchRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/research',
      title: 'Clinical Research',
      breadcrumb: 'Research',
      analyticsName: `${analyticsPrefix}_research`,
      lazy: facilityPage,
      nav,
      permission: 'research.read',
      featureFlag: 'research',
    },
    {
      path: '/study-sites',
      title: 'Study Sites',
      breadcrumb: 'Sites',
      analyticsName: `${analyticsPrefix}_study_sites`,
      lazy: facilityPage,
      permission: 'research.trials',
      featureFlag: 'research',
    },
    {
      path: '/recruitment',
      title: 'Recruitment',
      breadcrumb: 'Recruitment',
      analyticsName: `${analyticsPrefix}_recruitment`,
      lazy: facilityPage,
      permission: 'research.participants',
      featureFlag: 'research',
    },
    {
      path: '/research-dashboard',
      title: 'Research Dashboard',
      breadcrumb: 'Dashboard',
      analyticsName: `${analyticsPrefix}_research_dashboard`,
      lazy: facilityPage,
      permission: 'research.analytics',
      featureFlag: 'research',
    },
    {
      path: '/innovation',
      title: 'Innovation',
      breadcrumb: 'Innovation',
      analyticsName: `${analyticsPrefix}_innovation`,
      lazy: facilityPage,
      permission: 'research.read',
      featureFlag: 'research',
    },
  ];
}

export function createAdminResearchRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/research',
      title: 'Research Hub',
      breadcrumb: 'Research',
      analyticsName: `${analyticsPrefix}_research`,
      lazy: adminPage,
      nav,
      permission: 'research.read',
      featureFlag: 'research',
    },
    {
      path: '/trials',
      title: 'Clinical Trials',
      breadcrumb: 'Trials',
      analyticsName: `${analyticsPrefix}_trials`,
      lazy: adminPage,
      permission: 'research.trials',
      featureFlag: 'research',
    },
    {
      path: '/regulatory',
      title: 'Regulatory',
      breadcrumb: 'Regulatory',
      analyticsName: `${analyticsPrefix}_regulatory`,
      lazy: adminPage,
      permission: 'research.protocol',
      featureFlag: 'research',
    },
    {
      path: '/publications',
      title: 'Publications',
      breadcrumb: 'Publications',
      analyticsName: `${analyticsPrefix}_publications`,
      lazy: adminPage,
      permission: 'research.publications',
      featureFlag: 'research',
    },
    {
      path: '/grants',
      title: 'Grants',
      breadcrumb: 'Grants',
      analyticsName: `${analyticsPrefix}_grants`,
      lazy: adminPage,
      permission: 'research.admin',
      featureFlag: 'research',
    },
    {
      path: '/research-analytics',
      title: 'Research Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_research_analytics`,
      lazy: adminPage,
      permission: 'research.analytics',
      featureFlag: 'research',
    },
    {
      path: '/protocols',
      title: 'Protocols',
      breadcrumb: 'Protocols',
      analyticsName: `${analyticsPrefix}_protocols`,
      lazy: adminPage,
      permission: 'research.protocol',
      featureFlag: 'research',
    },
    {
      path: '/research-audit',
      title: 'Research Audit',
      breadcrumb: 'Audit',
      analyticsName: `${analyticsPrefix}_research_audit`,
      lazy: adminPage,
      permission: 'research.admin',
      featureFlag: 'research',
    },
  ];
}
