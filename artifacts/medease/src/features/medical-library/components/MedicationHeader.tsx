import type { ReactNode } from 'react';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import { Link } from 'wouter';

import { MedicationBadges } from '@/features/medical-library/components/MedicationBadges';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { appToast } from '@/services/api/toast';
import { Button } from '@/shared/ui/button';

interface MedicationHeaderProps {
  medication: MedicationRecord;
  backHref: string;
  actions?: ReactNode;
}

export function MedicationHeader({ medication, backHref, actions }: MedicationHeaderProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Link>
      </Button>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{medication.name}</h1>
          {medication.brandName ? (
            <p className="text-muted-foreground">Brand: {medication.brandName}</p>
          ) : null}
          <p className="text-sm">{medication.genericName} · {medication.strength} · {medication.dosageForm}</p>
          <MedicationBadges medication={medication} />
          <p className="text-sm text-muted-foreground max-w-2xl">{medication.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href);
              appToast.success({ title: 'Link copied' });
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
