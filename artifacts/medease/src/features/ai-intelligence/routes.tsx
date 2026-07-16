import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/ai-intelligence/pages/ProfessionalAiIntelligencePage');
const facilityPage = () => import('@/features/ai-intelligence/pages/FacilityAiIntelligencePage');
const adminPage = () => import('@/features/ai-intelligence/pages/AdminAiIntelligencePage');

export function createProfessionalAiRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/ai', title: 'AI Clinical Intelligence', breadcrumb: 'AI', analyticsName: `${analyticsPrefix}_ai`, lazy: professionalPage, nav, permission: 'ai.read', featureFlag: 'ai' },
    { path: '/clinical-copilot', title: 'Clinical Copilot', breadcrumb: 'Copilot', analyticsName: `${analyticsPrefix}_clinical_copilot`, lazy: professionalPage, permission: 'ai.copilot', featureFlag: 'ai' },
    { path: '/predictions', title: 'Predictions', breadcrumb: 'Predictions', analyticsName: `${analyticsPrefix}_predictions`, lazy: professionalPage, permission: 'ai.predictions', featureFlag: 'ai' },
    { path: '/risk-scores', title: 'Risk Scores', breadcrumb: 'Risk Scores', analyticsName: `${analyticsPrefix}_risk_scores`, lazy: professionalPage, permission: 'ai.predictions', featureFlag: 'ai' },
    { path: '/clinical-summaries', title: 'Clinical Summaries', breadcrumb: 'Summaries', analyticsName: `${analyticsPrefix}_clinical_summaries`, lazy: professionalPage, permission: 'ai.copilot', featureFlag: 'ai' },
  ];
}

export function createFacilityAiRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/ai', title: 'AI Clinical Intelligence', breadcrumb: 'AI', analyticsName: `${analyticsPrefix}_ai`, lazy: facilityPage, nav, permission: 'ai.read', featureFlag: 'ai' },
    { path: '/operational-forecasting', title: 'Operational Forecasting', breadcrumb: 'Forecasting', analyticsName: `${analyticsPrefix}_operational_forecasting`, lazy: facilityPage, permission: 'ai.analytics', featureFlag: 'ai' },
    { path: '/resource-predictions', title: 'Resource Predictions', breadcrumb: 'Resources', analyticsName: `${analyticsPrefix}_resource_predictions`, lazy: facilityPage, permission: 'ai.predictions', featureFlag: 'ai' },
    { path: '/capacity-planning', title: 'Capacity Planning', breadcrumb: 'Capacity', analyticsName: `${analyticsPrefix}_capacity_planning`, lazy: facilityPage, permission: 'ai.analytics', featureFlag: 'ai' },
  ];
}

export function createAdminAiRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/ai', title: 'AI Hub', breadcrumb: 'AI', analyticsName: `${analyticsPrefix}_ai`, lazy: adminPage, nav, permission: 'ai.read', featureFlag: 'ai' },
    { path: '/model-registry', title: 'Model Registry', breadcrumb: 'Registry', analyticsName: `${analyticsPrefix}_model_registry`, lazy: adminPage, permission: 'ai.models', featureFlag: 'ai' },
    { path: '/model-monitoring', title: 'Model Monitoring', breadcrumb: 'Monitoring', analyticsName: `${analyticsPrefix}_model_monitoring`, lazy: adminPage, permission: 'ai.models', featureFlag: 'ai' },
    { path: '/model-governance', title: 'Model Governance', breadcrumb: 'Governance', analyticsName: `${analyticsPrefix}_model_governance`, lazy: adminPage, permission: 'ai.governance', featureFlag: 'ai' },
    { path: '/bias-monitoring', title: 'Bias Monitoring', breadcrumb: 'Bias', analyticsName: `${analyticsPrefix}_bias_monitoring`, lazy: adminPage, permission: 'ai.governance', featureFlag: 'ai' },
    { path: '/ai-analytics', title: 'AI Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_ai_analytics`, lazy: adminPage, permission: 'ai.analytics', featureFlag: 'ai' },
    { path: '/ai-audit', title: 'AI Audit', breadcrumb: 'Audit', analyticsName: `${analyticsPrefix}_ai_audit`, lazy: adminPage, permission: 'ai.admin', featureFlag: 'ai' },
  ];
}
