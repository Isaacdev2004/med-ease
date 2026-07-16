import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/finance/pages/ProfessionalFinancePage');
const facilityPage = () => import('@/features/finance/pages/FacilityFinancePage');
const adminPage = () => import('@/features/finance/pages/AdminFinancePage');

export function createProfessionalFinanceRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/finance', title: 'Finance', breadcrumb: 'Finance', analyticsName: `${analyticsPrefix}_finance`, lazy: professionalPage, nav, permission: 'finance.read', featureFlag: 'finance' },
    { path: '/finance-revenue', title: 'Revenue', breadcrumb: 'Revenue', analyticsName: `${analyticsPrefix}_finance_revenue`, lazy: professionalPage, permission: 'finance.read', featureFlag: 'finance' },
    { path: '/finance-expenses', title: 'Expenses', breadcrumb: 'Expenses', analyticsName: `${analyticsPrefix}_finance_expenses`, lazy: professionalPage, permission: 'finance.read', featureFlag: 'finance' },
  ];
}

export function createFacilityFinanceRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/finance', title: 'Finance', breadcrumb: 'Finance', analyticsName: `${analyticsPrefix}_finance`, lazy: facilityPage, nav, permission: 'finance.read', featureFlag: 'finance' },
    { path: '/accounts-payable', title: 'Accounts Payable', breadcrumb: 'Accounts Payable', analyticsName: `${analyticsPrefix}_accounts_payable`, lazy: facilityPage, permission: 'finance.ap', featureFlag: 'finance' },
    { path: '/accounts-receivable', title: 'Accounts Receivable', breadcrumb: 'Accounts Receivable', analyticsName: `${analyticsPrefix}_accounts_receivable`, lazy: facilityPage, permission: 'finance.ar', featureFlag: 'finance' },
    { path: '/budgets', title: 'Budgets', breadcrumb: 'Budgets', analyticsName: `${analyticsPrefix}_budgets`, lazy: facilityPage, permission: 'finance.budget', featureFlag: 'finance' },
    { path: '/cash', title: 'Cash', breadcrumb: 'Cash', analyticsName: `${analyticsPrefix}_cash`, lazy: facilityPage, permission: 'finance.cash', featureFlag: 'finance' },
  ];
}

export function createAdminFinanceRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/finance', title: 'Finance', breadcrumb: 'Finance', analyticsName: `${analyticsPrefix}_finance`, lazy: adminPage, nav, permission: 'finance.read', featureFlag: 'finance' },
    { path: '/general-ledger', title: 'General Ledger', breadcrumb: 'General Ledger', analyticsName: `${analyticsPrefix}_general_ledger`, lazy: adminPage, permission: 'finance.gl', featureFlag: 'finance' },
    { path: '/journals', title: 'Journals', breadcrumb: 'Journals', analyticsName: `${analyticsPrefix}_journals`, lazy: adminPage, permission: 'finance.gl', featureFlag: 'finance' },
    { path: '/trial-balance', title: 'Trial Balance', breadcrumb: 'Trial Balance', analyticsName: `${analyticsPrefix}_trial_balance`, lazy: adminPage, permission: 'finance.gl', featureFlag: 'finance' },
    { path: '/accounts-payable', title: 'Accounts Payable', breadcrumb: 'Accounts Payable', analyticsName: `${analyticsPrefix}_accounts_payable`, lazy: adminPage, permission: 'finance.ap', featureFlag: 'finance' },
    { path: '/accounts-receivable', title: 'Accounts Receivable', breadcrumb: 'Accounts Receivable', analyticsName: `${analyticsPrefix}_accounts_receivable`, lazy: adminPage, permission: 'finance.ar', featureFlag: 'finance' },
    { path: '/budgets', title: 'Budgets', breadcrumb: 'Budgets', analyticsName: `${analyticsPrefix}_budgets`, lazy: adminPage, permission: 'finance.budget', featureFlag: 'finance' },
    { path: '/finance-assets', title: 'Fixed Assets', breadcrumb: 'Fixed Assets', analyticsName: `${analyticsPrefix}_finance_assets`, lazy: adminPage, permission: 'finance.assets', featureFlag: 'finance' },
    { path: '/cash-management', title: 'Cash Management', breadcrumb: 'Cash Management', analyticsName: `${analyticsPrefix}_cash_management`, lazy: adminPage, permission: 'finance.cash', featureFlag: 'finance' },
    { path: '/financial-statements', title: 'Financial Statements', breadcrumb: 'Financial Statements', analyticsName: `${analyticsPrefix}_financial_statements`, lazy: adminPage, permission: 'finance.analytics', featureFlag: 'finance' },
    { path: '/finance-analytics', title: 'Finance Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_finance_analytics`, lazy: adminPage, permission: 'finance.analytics', featureFlag: 'finance' },
  ];
}
