import type { ReactNode } from 'react';
import { ArrowLeft, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { Link } from 'wouter';

import { ProviderBadges } from '@/features/directory/components/ProviderBadges';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { StatusBadge } from '@/shared/components';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

interface ProviderHeaderProps {
  provider: DirectoryProvider;
  backHref: string;
  actions?: ReactNode;
}

export function ProviderHeader({
  provider,
  backHref,
  actions,
}: ProviderHeaderProps) {
  const initials = provider.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to directory
        </Link>
      </Button>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{provider.name}</h1>
              <StatusBadge status={provider.status} />
            </div>
            {provider.title ? (
              <p className="text-muted-foreground">{provider.title}</p>
            ) : null}
            <ProviderBadges provider={provider} />
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {provider.address.street}, {provider.address.postalCode}{' '}
                {provider.address.city}
              </span>
              {provider.phone ? (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {provider.phone}
                </span>
              ) : null}
              {provider.email ? (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {provider.email}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>
    </div>
  );
}

interface ProviderActionsProps {
  providerId: string;
  isFavorite?: boolean;
  canTransfer?: boolean;
  favoriteButton: ReactNode;
}

export function ProviderActions({
  canTransfer,
  favoriteButton,
}: ProviderActionsProps) {
  return (
    <>
      {favoriteButton}
      <Button variant="outline" size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button size="sm">Start Care Pathway</Button>
      <Button variant="outline" size="sm">
        Contact
      </Button>
      {canTransfer ? (
        <Button variant="secondary" size="sm">
          Transfer Patient
        </Button>
      ) : null}
    </>
  );
}
