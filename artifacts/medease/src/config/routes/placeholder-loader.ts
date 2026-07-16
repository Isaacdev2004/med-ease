import type { RouteDefinition } from '@/config/routes/types';

export function placeholderRoute(
  path: string,
  title: string,
  options: Partial<Omit<RouteDefinition, 'path' | 'title' | 'lazy'>> = {},
): RouteDefinition {
  const { description, ...rest } = options;

  return {
    path,
    title,
    description,
    lazy: () =>
      import('@/shared/pages/RoutePlaceholder').then((mod) => ({
        default: mod.createRoutePlaceholderPage(title, description),
      })),
    ...rest,
  };
}
