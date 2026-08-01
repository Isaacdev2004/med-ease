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
    title: "Med'ease — Hub de coordination territoriale de santé",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/Landing'),
  },
  {
    path: ROUTES.patients,
    title: "Med'ease Patients | Carnet de santé numérique",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/PatientAudiencePage'),
  },
  {
    path: ROUTES.professionnels,
    title: "Med'ease Professionnels | Coordination médicale",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/ProfessionalAudiencePage'),
  },
  {
    path: ROUTES.etablissements,
    title: "Med'ease Établissements | Gestion des flux hospitaliers",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/EstablishmentAudiencePage'),
  },
  {
    path: ROUTES.notreVision,
    title: "Med'ease | Notre vision",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/VisionPage'),
  },
  {
    path: ROUTES.conciergerie,
    title: "Med'ease Conciergerie | Coordination santé",
    layout: 'marketing',
    public: true,
    lazy: () => import('@/features/marketing/pages/ConciergePage'),
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
