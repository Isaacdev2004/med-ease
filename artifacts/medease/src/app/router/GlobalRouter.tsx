import { AuthLayout, type AuthLayoutCopy } from '@/app/layouts/AuthLayout';
import { MarketingLayout } from '@/app/layouts/MarketingLayout';
import { LazyRouteFromDefinition } from '@/app/router/LazyRoute';
import { PublicGuard, PublicOnlyGuard } from '@/app/guards';
import { ROUTES } from '@/config/routes';
import { isPortalLoginPath } from '@/config/routes/portal-login';
import { frenchAuthCopy } from '@/features/marketing/content/auth-fr';
import type { GlobalRouteDefinition } from '@/config/routes/types';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useRouteFocus } from '@/shared/hooks/use-route-focus';

const AUTH_LAYOUT_COPY: Partial<Record<string, AuthLayoutCopy>> = {
  [ROUTES.register]: {
    title: 'Create your account',
    subtitle: "Join the Med'ease healthcare network.",
  },
  [ROUTES.connexion]: frenchAuthCopy.connexion.layout,
  [ROUTES.preInscription]: frenchAuthCopy.preInscription.layout,
  [ROUTES.forgotPassword]: {
    title: 'Reset your password',
    subtitle: "We'll send a secure link to your registered email.",
  },
  [ROUTES.resetPassword]: {
    title: 'Choose a new password',
    subtitle: 'Your reset link is valid for a limited time.',
  },
  [ROUTES.verifyEmail]: {
    title: 'Verify your email',
    subtitle: 'Confirm your address to activate your account.',
  },
  [ROUTES.sessionExpired]: {
    title: 'Session expired',
    subtitle: 'Please sign in again to continue.',
  },
};

const PUBLIC_AUTH_ONLY = new Set<string>([
  ROUTES.login,
  ROUTES.register,
  ROUTES.connexion,
  ROUTES.preInscription,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.verifyEmail,
]);

function GlobalRoutePage({ route }: { route: GlobalRouteDefinition }) {
  useDocumentTitle(route.title);
  useRouteFocus();

  const content = (
    <LazyRouteFromDefinition
      lazy={route.lazy}
      moduleName={route.title}
      loadingLabel={`Loading ${route.title.toLowerCase()}`}
    />
  );

  if (route.layout === 'marketing') {
    return <MarketingLayout>{content}</MarketingLayout>;
  }

  if (route.layout === 'auth') {
    const copy = AUTH_LAYOUT_COPY[route.path];
    return (
      <AuthLayout
        title={copy?.title ?? route.title}
        subtitle={copy?.subtitle ?? route.description}
        heroTitle={copy?.heroTitle}
        heroSubtitle={copy?.heroSubtitle}
        complianceBadge={copy?.complianceBadge}
        supportLabel={copy?.supportLabel}
        supportLink={copy?.supportLink}
      >
        {content}
      </AuthLayout>
    );
  }

  return content;
}

function AuthRoutePage({ route }: { route: GlobalRouteDefinition }) {
  const page = <GlobalRoutePage route={route} />;

  if (PUBLIC_AUTH_ONLY.has(route.path) || isPortalLoginPath(route.path)) {
    return <PublicOnlyGuard>{page}</PublicOnlyGuard>;
  }

  return page;
}

export function PublicRoute({ route }: { route: GlobalRouteDefinition }) {
  return (
    <PublicGuard>
      <GlobalRoutePage route={route} />
    </PublicGuard>
  );
}

export function AuthRoute({ route }: { route: GlobalRouteDefinition }) {
  return <AuthRoutePage route={route} />;
}
