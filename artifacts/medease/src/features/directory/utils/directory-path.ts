import type { ProviderType } from '@/services/directory/directory.types';

const CATEGORY_PATHS: Record<string, ProviderType> = {
  professionals: 'professional',
  facilities: 'facility',
  pharmacies: 'pharmacy',
  transport: 'transport',
};

export function getCategoryFromPath(pathname: string): ProviderType | 'all' {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  return CATEGORY_PATHS[segment] ?? 'all';
}

export function getProviderIdFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const directoryIndex = segments.indexOf('directory');
  if (directoryIndex === -1) return null;

  const maybeId = segments[directoryIndex + 1];
  if (!maybeId || maybeId in CATEGORY_PATHS) return null;
  return maybeId;
}

export function getDirectoryBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const directoryIndex = segments.indexOf('directory');
  if (directoryIndex <= 0) return '/directory';
  return `/${segments.slice(0, directoryIndex + 1).join('/')}`;
}
