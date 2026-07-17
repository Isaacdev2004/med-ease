import { Link } from 'wouter';

import { DirectoryMapPlaceholder } from '@/features/directory/components/DirectoryMapPlaceholder';
import { ProviderCard } from '@/features/directory/components/ProviderCard';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface ProviderProfileProps {
  provider: DirectoryProvider;
  related: DirectoryProvider[];
  associatedFacilities: DirectoryProvider[];
  portalBase: string;
}

export function ProviderProfile({
  provider,
  related,
  associatedFacilities,
  portalBase,
}: ProviderProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Services & Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {provider.services?.length ? (
              <div>
                <p className="font-medium mb-2">Services</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {provider.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {provider.qualifications?.length ? (
              <div>
                <p className="font-medium mb-2">Qualifications</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {provider.qualifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {provider.insuranceAccepted?.length ? (
              <div>
                <p className="font-medium mb-2">Insurance accepted</p>
                <p className="text-muted-foreground">
                  {provider.insuranceAccepted.join(', ')}
                </p>
              </div>
            ) : null}
            {provider.accessibility?.length ? (
              <div>
                <p className="font-medium mb-2">Accessibility</p>
                <p className="text-muted-foreground">
                  {provider.accessibility.join(', ')}
                </p>
              </div>
            ) : null}
            {provider.languages.length ? (
              <div>
                <p className="font-medium mb-2">Languages</p>
                <p className="text-muted-foreground">
                  {provider.languages.join(', ')}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {associatedFacilities.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Associated Facilities</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {associatedFacilities.map((facility) => (
                <ProviderCard
                  key={facility.id}
                  provider={facility}
                  portalBase={portalBase}
                />
              ))}
            </CardContent>
          </Card>
        ) : null}

        {related.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Related Providers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <ProviderCard
                  key={item.id}
                  provider={item}
                  portalBase={portalBase}
                />
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="space-y-6">
        {provider.openingHours ? (
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(provider.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectoryMapPlaceholder focusProvider={provider} />
          </CardContent>
        </Card>

        {provider.website ? (
          <Card>
            <CardContent className="pt-6">
              <Link
                href={provider.website}
                className="text-sm text-primary hover:underline"
              >
                Visit website
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
