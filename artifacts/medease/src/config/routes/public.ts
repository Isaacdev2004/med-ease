import { ROUTES } from '@/config/routes';
import { registerGlobalRoute } from '@/config/routes/metadata';
import { placeholderRoute } from '@/config/routes/placeholder-loader';
import type { GlobalRouteDefinition } from '@/config/routes/types';

function marketingPage(title: string, path: string): GlobalRouteDefinition {
  const route = {
    ...placeholderRoute(path, title, {
      description: `${title} — Med-ease public website.`,
    }),
    path,
    layout: 'marketing' as const,
    public: true,
  };
  registerGlobalRoute(route);
  return route;
}

export const publicRoutes: GlobalRouteDefinition[] = [
  {
    path: ROUTES.home,
    title: 'Home',
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/Landing'),
  },
  marketingPage('About', ROUTES.about),
  marketingPage('Features', ROUTES.features),
  marketingPage('Contact', ROUTES.contact),
  marketingPage('Privacy Policy', ROUTES.privacy),
  marketingPage('Terms of Service', ROUTES.terms),
  marketingPage('Help Center', ROUTES.help),
  marketingPage('System Status', ROUTES.status),
];

registerGlobalRoute(publicRoutes[0]!);

export const marketingRoutePaths = publicRoutes.map((route) => route.path);
