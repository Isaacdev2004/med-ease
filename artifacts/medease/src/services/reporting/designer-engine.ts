import type {
  ReportDesigner,
  ReportField,
  ReportChart,
  ReportDataSource,
} from '@/services/reporting/types';

export function canvasComplexity(
  elements: number,
  dataSources: number,
): 'simple' | 'moderate' | 'complex' {
  const score = elements + dataSources * 3;
  if (score < 10) return 'simple';
  if (score < 25) return 'moderate';
  return 'complex';
}

export function validateDesignerLayout(
  fields: ReportField[],
  charts: ReportChart[],
): boolean {
  return fields.length > 0 || charts.length > 0;
}

export function mergeDesignerState(
  designer: ReportDesigner,
  updates: Partial<Pick<ReportDesigner, 'canvasElements' | 'dataSourceCount'>>,
): ReportDesigner {
  return {
    ...designer,
    canvasElements: updates.canvasElements ?? designer.canvasElements,
    dataSourceCount: updates.dataSourceCount ?? designer.dataSourceCount,
    lastEditedAt: new Date().toISOString(),
  };
}

export function dataSourceModules(sources: ReportDataSource[]): string[] {
  return [...new Set(sources.map((s) => s.module))];
}
