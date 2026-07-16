import { ROUTES } from '@/config/routes';
import { registerGlobalRoute } from '@/config/routes/metadata';
import { placeholderRoute } from '@/config/routes/placeholder-loader';
import type { GlobalRouteDefinition } from '@/config/routes/types';

function authPlaceholder(title: string, path: string): GlobalRouteDefinition {
  const route = {
    ...placeholderRoute(path, title),
    path,
    layout: 'auth' as const,
    public: true,
  };
  registerGlobalRoute(route);
  return route;
}

export const authRoutes: GlobalRouteDefinition[] = [
  {
    path: ROUTES.login,
    title: 'Sign In',
    layout: 'auth',
    public: true,
    lazy: () =>
      import('@/features/auth/pages/Login').then((mod) => ({
        default: mod.default,
      })),
  },
  {
    path: ROUTES.register,
    title: 'Create Account',
    layout: 'auth',
    public: true,
    lazy: () =>
      import('@/features/auth/pages/Register').then((mod) => ({
        default: mod.default,
      })),
  },
  {
    path: ROUTES.forgotPassword,
    title: 'Forgot Password',
    layout: 'auth',
    public: true,
    lazy: () =>
      import('@/features/auth/pages/ForgotPassword').then((mod) => ({
        default: mod.default,
      })),
  },
  authPlaceholder('Reset Password', ROUTES.resetPassword),
  authPlaceholder('Verify Email', ROUTES.verifyEmail),
  {
    path: ROUTES.logout,
    title: 'Sign Out',
    layout: 'none',
    public: true,
    lazy: () => import('@/features/auth/pages/Logout'),
  },
  {
    path: ROUTES.sessionExpired,
    title: 'Session Expired',
    layout: 'auth',
    public: true,
    lazy: () => import('@/features/auth/pages/SessionExpired'),
  },
];

for (const route of authRoutes) {
  registerGlobalRoute(route);
}
