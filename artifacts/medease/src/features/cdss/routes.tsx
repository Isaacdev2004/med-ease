import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/cdss/pages/ProfessionalCdssPage');
const facilityPage = () => import('@/features/cdss/pages/FacilityCdssPage');
const adminPage = () => import('@/features/cdss/pages/AdminCdssPage');

export function createProfessionalCdssRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/cdss', title: 'Clinical Decision Support', breadcrumb: 'CDSS', analyticsName: `${analyticsPrefix}_cdss`, lazy: professionalPage, nav, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/clinical-alerts', title: 'Clinical Alerts', breadcrumb: 'Alerts', analyticsName: `${analyticsPrefix}_clinical_alerts`, lazy: professionalPage, permission: 'cdss.alerts', featureFlag: 'cdss' },
    { path: '/recommendations', title: 'Recommendations', breadcrumb: 'Recommendations', analyticsName: `${analyticsPrefix}_recommendations`, lazy: professionalPage, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/guidelines', title: 'Guidelines', breadcrumb: 'Guidelines', analyticsName: `${analyticsPrefix}_guidelines`, lazy: professionalPage, permission: 'cdss.guidelines', featureFlag: 'cdss' },
    { path: '/cdss-diagnostics', title: 'Diagnostic Support', breadcrumb: 'Diagnostics', analyticsName: `${analyticsPrefix}_cdss_diagnostics`, lazy: professionalPage, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/cdss-drug-safety', title: 'Drug Safety', breadcrumb: 'Drug Safety', analyticsName: `${analyticsPrefix}_cdss_drug_safety`, lazy: professionalPage, permission: 'cdss.alerts', featureFlag: 'cdss' },
    { path: '/cdss-preventive', title: 'Preventive Care', breadcrumb: 'Preventive', analyticsName: `${analyticsPrefix}_cdss_preventive`, lazy: professionalPage, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/order-sets', title: 'Order Sets', breadcrumb: 'Order Sets', analyticsName: `${analyticsPrefix}_order_sets`, lazy: professionalPage, permission: 'cdss.orderSets', featureFlag: 'cdss' },
    { path: '/risk-calculators', title: 'Risk Calculators', breadcrumb: 'Calculators', analyticsName: `${analyticsPrefix}_risk_calculators`, lazy: professionalPage, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/cdss-analytics', title: 'CDSS Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_cdss_analytics`, lazy: professionalPage, permission: 'cdss.analytics', featureFlag: 'cdss' },
  ];
}

export function createFacilityCdssRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/cdss', title: 'Clinical Governance', breadcrumb: 'CDSS', analyticsName: `${analyticsPrefix}_cdss`, lazy: facilityPage, nav, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/clinical-governance', title: 'Clinical Governance', breadcrumb: 'Governance', analyticsName: `${analyticsPrefix}_clinical_governance`, lazy: facilityPage, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/guideline-compliance', title: 'Guideline Compliance', breadcrumb: 'Compliance', analyticsName: `${analyticsPrefix}_guideline_compliance`, lazy: facilityPage, permission: 'cdss.analytics', featureFlag: 'cdss' },
    { path: '/cdss-protocols', title: 'Protocol Management', breadcrumb: 'Protocols', analyticsName: `${analyticsPrefix}_cdss_protocols`, lazy: facilityPage, permission: 'cdss.protocols', featureFlag: 'cdss' },
    { path: '/cdss-analytics', title: 'CDS Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_cdss_analytics`, lazy: facilityPage, permission: 'cdss.analytics', featureFlag: 'cdss' },
  ];
}

export function createAdminCdssRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/cdss', title: 'Clinical Decision Support', breadcrumb: 'CDSS', analyticsName: `${analyticsPrefix}_cdss`, lazy: adminPage, nav, permission: 'cdss.read', featureFlag: 'cdss' },
    { path: '/knowledge-base', title: 'Knowledge Base', breadcrumb: 'Knowledge Base', analyticsName: `${analyticsPrefix}_knowledge_base`, lazy: adminPage, permission: 'cdss.admin', featureFlag: 'cdss' },
    { path: '/rules-engine', title: 'Rules Engine', breadcrumb: 'Rules', analyticsName: `${analyticsPrefix}_rules_engine`, lazy: adminPage, permission: 'cdss.admin', featureFlag: 'cdss' },
    { path: '/cdss-order-sets', title: 'Order Sets', breadcrumb: 'Order Sets', analyticsName: `${analyticsPrefix}_cdss_order_sets`, lazy: adminPage, permission: 'cdss.orderSets', featureFlag: 'cdss' },
    { path: '/cdss-guidelines', title: 'Guidelines', breadcrumb: 'Guidelines', analyticsName: `${analyticsPrefix}_cdss_guidelines`, lazy: adminPage, permission: 'cdss.guidelines', featureFlag: 'cdss' },
    { path: '/cdss-analytics', title: 'CDSS Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_cdss_analytics`, lazy: adminPage, permission: 'cdss.analytics', featureFlag: 'cdss' },
    { path: '/cdss-audit', title: 'CDSS Audit', breadcrumb: 'Audit', analyticsName: `${analyticsPrefix}_cdss_audit`, lazy: adminPage, permission: 'cdss.admin', featureFlag: 'cdss' },
  ];
}
