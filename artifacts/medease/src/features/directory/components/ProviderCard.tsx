import { Link } from 'wouter';
import { Eye, Route } from 'lucide-react';

import { FavoriteButton } from '@/features/directory/components/FavoriteButton';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { DirectoryCard } from '@/shared/medical';
import { Button } from '@/shared/ui/button';
import { getProviderProfilePath } from '@/services/directory/directory.service';

interface ProviderCardProps {
  provider: DirectoryProvider;
  portalBase: string;
  isFavorite?: boolean;
  compact?: boolean;
}

function mapCardType(type: DirectoryProvider['type']): 'professional' | 'facility' | 'pharmacy' | 'transport' {
  if (type === 'pharmacy') return 'pharmacy';
  if (type === 'transport') return 'transport';
  if (type === 'professional') return 'professional';
  return 'facility';
}

function formatLocation(provider: DirectoryProvider) {
  const { street, city, postalCode } = provider.address;
  const distance = provider.distanceKm ? ` · ${provider.distanceKm.toFixed(1)} km` : '';
  return `${street}, ${postalCode} ${city}${distance}`;
}

export function ProviderCard({
  provider,
  portalBase,
  isFavorite,
  compact,
}: ProviderCardProps) {
  const profilePath = getProviderProfilePath(portalBase, provider.id);

  if (compact) {
    return (
      <Link
        href={profilePath}
        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
      >
        <div>
          <p className="font-medium">{provider.name}</p>
          <p className="text-sm text-muted-foreground">
            {provider.specialty ?? provider.facilityType ?? provider.type}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{provider.address.city}</span>
      </Link>
    );
  }

  return (
    <DirectoryCard
      name={provider.name}
      subtitle={provider.title ?? provider.facilityType}
      type={mapCardType(provider.type)}
      status={provider.status}
      location={formatLocation(provider)}
      specialization={provider.specialty ?? provider.medicalSpecialty}
      availability={provider.availability}
      phone={provider.phone}
      actions={
        <>
          <FavoriteButton providerId={provider.id} isFavorite={isFavorite} size="sm" />
          <Button size="sm" variant="outline" asChild>
            <Link href={profilePath}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button size="sm" variant="ghost">
            <Route className="mr-2 h-4 w-4" />
            Care Pathway
          </Button>
        </>
      }
    />
  );
}
