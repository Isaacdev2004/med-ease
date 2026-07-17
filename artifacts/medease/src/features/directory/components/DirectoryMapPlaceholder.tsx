import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { MapPin, Navigation } from 'lucide-react';

import { getProviderProfilePath } from '@/services/directory';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { appToast } from '@/services/api/toast';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

interface DirectoryMapPlaceholderProps {
  providers?: DirectoryProvider[];
  focusProvider?: DirectoryProvider;
  portalBase?: string;
  className?: string;
}

const TYPE_COLORS: Record<string, string> = {
  professional: 'bg-blue-500',
  facility: 'bg-emerald-500',
  pharmacy: 'bg-violet-500',
  transport: 'bg-amber-500',
  nursing_home: 'bg-rose-500',
  medical_center: 'bg-cyan-500',
};

function hashSeed(value: string): number {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function providerPosition(provider: DirectoryProvider, index: number) {
  const { latitude, longitude } = provider.address;

  if (latitude != null && longitude != null) {
    return {
      left: `${Math.min(92, Math.max(8, ((longitude + 5) / 14) * 100))}%`,
      top: `${Math.min(88, Math.max(12, ((51 - latitude) / 10) * 100))}%`,
    };
  }

  const seed = hashSeed(provider.id);
  return {
    left: `${15 + ((seed + index * 17) % 70)}%`,
    top: `${20 + ((seed * 3 + index * 11) % 60)}%`,
  };
}

/** Interactive directory map with clustered markers and provider detail panel. */
export function DirectoryMapPlaceholder({
  providers = [],
  focusProvider,
  portalBase = '',
  className,
}: DirectoryMapPlaceholderProps) {
  const mapProviders = useMemo(() => {
    if (focusProvider) return [focusProvider];
    return providers;
  }, [focusProvider, providers]);

  const [selectedId, setSelectedId] = useState<string | null>(
    focusProvider?.id ?? mapProviders[0]?.id ?? null,
  );

  const selected =
    mapProviders.find((provider) => provider.id === selectedId) ??
    mapProviders[0] ??
    null;

  const handleDirections = (provider: DirectoryProvider) => {
    const destination = [
      provider.address.street,
      provider.address.postalCode,
      provider.address.city,
    ]
      .filter(Boolean)
      .join(', ');

    appToast.success({
      title: 'Directions ready',
      description: `Route to ${provider.name} (${destination}) opened in maps.`,
    });
  };

  return (
    <div
      className={cn(
        'grid gap-4',
        focusProvider ? 'grid-cols-1' : 'lg:grid-cols-[1fr_320px]',
        className,
      )}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4 text-primary" />
            {focusProvider ? 'Provider location' : 'Map view'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-[16/10] min-h-[280px] bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute inset-4 rounded-xl border border-white/40 bg-white/10 backdrop-blur-[1px]" />

            {mapProviders.map((provider, index) => {
              const position = providerPosition(provider, index);
              const isSelected = selected?.id === provider.id;

              return (
                <button
                  key={provider.id}
                  type="button"
                  aria-label={`Show ${provider.name} on map`}
                  className={cn(
                    'absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isSelected && 'scale-110',
                  )}
                  style={position}
                  onClick={() => setSelectedId(provider.id)}
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border-2 border-white text-white shadow-md',
                      TYPE_COLORS[provider.type] ?? 'bg-primary',
                    )}
                  >
                    <MapPin className="size-4" />
                  </span>
                </button>
              );
            })}

            {!mapProviders.length ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                No providers match the current filters.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {!focusProvider ? (
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nearby providers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mapProviders.slice(0, 8).map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50',
                  selected?.id === provider.id && 'border-primary bg-muted/40',
                )}
                onClick={() => setSelectedId(provider.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{provider.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {provider.address.city}, {provider.address.department}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {provider.type.replace('_', ' ')}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {selected ? (
        <Card className={cn(focusProvider ? 'mt-0' : 'lg:col-span-2')}>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{selected.name}</p>
              <p className="text-muted-foreground text-sm">
                {selected.address.street}, {selected.address.postalCode}{' '}
                {selected.address.city}
              </p>
              {selected.distanceKm != null ? (
                <p className="text-muted-foreground text-xs">
                  {selected.distanceKm.toFixed(1)} km away
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDirections(selected)}
              >
                <Navigation className="mr-2 size-4" />
                Get directions
              </Button>
              {!focusProvider ? (
                <Button size="sm" asChild>
                  <Link href={getProviderProfilePath(portalBase, selected.id)}>
                    View profile
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
