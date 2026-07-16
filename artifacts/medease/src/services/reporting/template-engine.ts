import type { ReportCategory, ReportTemplate } from '@/services/reporting/types';

export function templatesByCategory(templates: ReportTemplate[], category: ReportCategory): ReportTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function templateReuseRate(templates: ReportTemplate[]): number {
  if (templates.length === 0) return 0;
  const reused = templates.filter((t) => t.usageCount > 1).length;
  return Math.round((reused / templates.length) * 100);
}

export function topTemplates(templates: ReportTemplate[], limit = 6): ReportTemplate[] {
  return [...templates].sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
}

export function suggestTemplateName(category: ReportCategory, subcategory: string): string {
  return `${category.charAt(0).toUpperCase() + category.slice(1)} ${subcategory} Report`;
}
