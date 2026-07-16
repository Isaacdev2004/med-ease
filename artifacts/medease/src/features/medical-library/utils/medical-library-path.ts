import type { MedicationCategory } from '@/services/medical-library/medical-library.types';

const CATEGORY_PATHS: Record<string, MedicationCategory> = {
  categories: 'pain_relief', // categories view, not a filter
};

export function getCategoryFromPath(pathname: string): MedicationCategory | 'all' | 'categories' {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (segment === 'categories') return 'categories';
  if (segment === 'search') return 'all';
  return 'all';
}

export function getMedicationIdFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const index = segments.indexOf('medical-library');
  if (index === -1) return null;
  const maybeId = segments[index + 1];
  if (!maybeId || ['search', 'categories'].includes(maybeId)) return null;
  return maybeId;
}

export function getMedicalLibraryBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const index = segments.indexOf('medical-library');
  if (index <= 0) return '/medical-library';
  return `/${segments.slice(0, index + 1).join('/')}`;
}

export { CATEGORY_PATHS };
