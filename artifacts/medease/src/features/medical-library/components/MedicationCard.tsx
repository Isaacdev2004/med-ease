import { Link } from 'wouter';
import { Eye, GitCompare, Pill } from 'lucide-react';

import { FavoriteButton } from '@/features/medical-library/components/FavoriteButton';
import { MedicationBadges } from '@/features/medical-library/components/MedicationBadges';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { getMedicationProfilePath } from '@/services/medical-library/medical-library.service';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

interface MedicationCardProps {
  medication: MedicationRecord;
  portalBase: string;
  isFavorite?: boolean;
  compact?: boolean;
  onCompare?: (medication: MedicationRecord) => void;
}

export function MedicationCard({
  medication,
  portalBase,
  isFavorite,
  compact,
  onCompare,
}: MedicationCardProps) {
  const profilePath = getMedicationProfilePath(portalBase, medication.id);

  if (compact) {
    return (
      <Link
        href={profilePath}
        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
      >
        <div>
          <p className="font-medium">{medication.name}</p>
          <p className="text-sm text-muted-foreground">
            {medication.strength} · {medication.dosageForm}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {medication.therapeuticClass}
        </span>
      </Link>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Pill className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight">{medication.name}</h3>
            {medication.brandName ? (
              <p className="text-sm text-muted-foreground">
                {medication.brandName}
              </p>
            ) : null}
            <p className="text-sm mt-1">
              {medication.strength} · {medication.dosageForm}
            </p>
          </div>
        </div>
        <MedicationBadges medication={medication} />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground line-clamp-2">
        {medication.description}
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">
        <FavoriteButton
          medicationId={medication.id}
          isFavorite={isFavorite}
          size="sm"
        />
        <Button size="sm" variant="outline" asChild>
          <Link href={profilePath}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onCompare?.(medication)}
        >
          <GitCompare className="mr-2 h-4 w-4" />
          Compare
        </Button>
      </CardFooter>
    </Card>
  );
}
