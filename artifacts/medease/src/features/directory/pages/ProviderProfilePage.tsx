import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { FavoriteButton } from '@/features/directory/components/FavoriteButton';
import { ProviderActions, ProviderHeader } from '@/features/directory/components/ProviderHeader';
import { ProviderProfile } from '@/features/directory/components/ProviderProfile';
import {
  useFavorites,
  useProvider,
  useRelatedProviders,
} from '@/features/directory/hooks/use-directory';
import {
  getDirectoryBasePath,
  getProviderIdFromPath,
} from '@/features/directory/utils/directory-path';
import { MOCK_DIRECTORY_PROVIDERS } from '@/services/directory';
import { useAuth } from '@/services/auth/auth-context';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { FileQuestion } from 'lucide-react';

export default function ProviderProfilePage() {
  const [location] = useLocation();
  const { user } = useAuth();
  const providerId = getProviderIdFromPath(location) ?? '';
  const portalBase = getDirectoryBasePath(location).replace(/\/directory.*$/, '');
  const backHref = `${portalBase}/directory`;

  const providerQuery = useProvider(providerId);
  const relatedQuery = useRelatedProviders(providerId);
  const favoritesQuery = useFavorites();

  const isFavorite = useMemo(
    () => (favoritesQuery.data ?? []).some((item) => item.id === providerId),
    [favoritesQuery.data, providerId],
  );

  const associatedFacilities = useMemo(() => {
    const provider = providerQuery.data;
    if (!provider?.associatedFacilityIds?.length) return [];
    return MOCK_DIRECTORY_PROVIDERS.filter((item) =>
      provider.associatedFacilityIds?.includes(item.id),
    );
  }, [providerQuery.data]);

  const canTransfer =
    user?.role === 'physician' ||
    user?.role === 'facility_admin' ||
    user?.role === 'platform_admin';

  if (providerQuery.isLoading) {
    return (
      <PageShell title="Provider Profile">
        <LoadingView label="Loading provider profile…" />
      </PageShell>
    );
  }

  if (!providerQuery.data) {
    return (
      <PageShell title="Provider Profile">
        <EmptyState
          icon={FileQuestion}
          title="Provider not found"
          description="This provider may have been removed or you may not have permission to view it."
        />
      </PageShell>
    );
  }

  return (
    <PageShell title={providerQuery.data.name} subtitle="Healthcare provider profile">
      <ProviderHeader
        provider={providerQuery.data}
        backHref={backHref}
        actions={
          <ProviderActions
            providerId={providerId}
            isFavorite={isFavorite}
            canTransfer={canTransfer}
            favoriteButton={
              <FavoriteButton providerId={providerId} isFavorite={isFavorite} size="sm" />
            }
          />
        }
      />
      <div className="mt-8">
        <ProviderProfile
          provider={providerQuery.data}
          related={relatedQuery.data ?? []}
          associatedFacilities={associatedFacilities}
          portalBase={portalBase}
        />
      </div>
    </PageShell>
  );
}
