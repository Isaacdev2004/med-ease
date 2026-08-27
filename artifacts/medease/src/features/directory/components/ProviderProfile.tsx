import { Link } from 'wouter';
import { Star } from 'lucide-react';

import { DirectoryMapPlaceholder } from '@/features/directory/components/DirectoryMapPlaceholder';
import { ProviderCard } from '@/features/directory/components/ProviderCard';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface ProviderProfileProps {
  provider: DirectoryProvider;
  related: DirectoryProvider[];
  associatedFacilities: DirectoryProvider[];
  portalBase: string;
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
  mon: 'Lundi',
  tue: 'Mardi',
  wed: 'Mercredi',
  thu: 'Jeudi',
  fri: 'Vendredi',
  sat: 'Samedi',
  sun: 'Dimanche',
};

/** Avis patients de démonstration (contenu Figma — Portail établissement). */
function demoReviews(provider: DirectoryProvider) {
  const seed = provider.name.length % 3;
  const base = [
    {
      author: 'Camille R.',
      rating: 5,
      text: 'Accueil soigné et délais corrects. Équipe à l’écoute.',
    },
    {
      author: 'Jean-Marc T.',
      rating: 4,
      text: 'Bonne prise en charge. Parking un peu limité aux heures de pointe.',
    },
    {
      author: 'Sophie L.',
      rating: 5,
      text: 'Orientation claire, informations utiles avant le rendez-vous.',
    },
  ];
  return base.slice(seed).concat(base.slice(0, seed)).slice(0, 3);
}

function demoCertifications(provider: DirectoryProvider): string[] {
  const fromQual = provider.qualifications ?? [];
  if (fromQual.length) return fromQual;
  return [
    'Certification HAS / Qualité',
    provider.emergencyServices ? 'Urgences 24/7' : 'Parcours ambulatoire',
    provider.teleconsultation ? 'Téléconsultation' : 'Consultations sur site',
  ];
}

export function ProviderProfile({
  provider,
  related,
  associatedFacilities,
  portalBase,
}: ProviderProfileProps) {
  const reviews = demoReviews(provider);
  const certifications = demoCertifications(provider);
  const hours = provider.openingHours;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {provider.title ??
                provider.facilityType ??
                (provider.type === 'professional'
                  ? 'Professionnel de santé'
                  : 'Établissement de santé')}
              {provider.specialty || provider.medicalSpecialty
                ? ` · ${provider.specialty ?? provider.medicalSpecialty}`
                : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{provider.status}</Badge>
              {provider.availability ? (
                <Badge variant="secondary">{provider.availability}</Badge>
              ) : null}
              {provider.finessNumber ? (
                <Badge variant="outline">FINESS {provider.finessNumber}</Badge>
              ) : null}
            </div>
            <p>
              {[
                provider.address.street,
                `${provider.address.postalCode} ${provider.address.city}`,
                provider.address.department,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {provider.phone ? (
              <p>
                Tél. :{' '}
                <a className="text-primary underline" href={`tel:${provider.phone}`}>
                  {provider.phone}
                </a>
              </p>
            ) : null}
            {provider.email ? (
              <p>
                E-mail :{' '}
                <a
                  className="text-primary underline"
                  href={`mailto:${provider.email}`}
                >
                  {provider.email}
                </a>
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {provider.services?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {provider.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Services détaillés à compléter via le Studio Portail.
              </p>
            )}
            {provider.insuranceAccepted?.length ? (
              <div>
                <p className="mb-1 font-medium">Assurances / mutuelles</p>
                <p className="text-muted-foreground">
                  {provider.insuranceAccepted.join(', ')}
                </p>
              </div>
            ) : null}
            {provider.accessibility?.length ? (
              <div>
                <p className="mb-1 font-medium">Accessibilité</p>
                <p className="text-muted-foreground">
                  {provider.accessibility.join(', ')}
                </p>
              </div>
            ) : null}
            {provider.languages.length ? (
              <div>
                <p className="mb-1 font-medium">Langues</p>
                <p className="text-muted-foreground">
                  {provider.languages.join(', ')}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avis patients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.author + r.text.slice(0, 12)}
                className="rounded-lg border border-border/60 p-3 text-sm"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-medium">{r.author}</span>
                  <span className="flex items-center gap-0.5 text-amber-600">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                </div>
                <p className="text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {associatedFacilities.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Établissements associés</CardTitle>
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
              <CardTitle>Professionnels liés</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Horaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {hours && Object.keys(hours).length ? (
              Object.entries(hours).map(([day, h]) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {DAY_LABELS[day.toLowerCase()] ?? day}
                  </span>
                  <span>{h}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Horaires non renseignés — à paramétrer dans le Studio.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
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
                Visiter le site web
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
