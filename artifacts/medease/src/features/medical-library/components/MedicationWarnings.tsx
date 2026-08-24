import { AlertTriangle } from 'lucide-react';

import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationWarningsProps {
  medication: MedicationRecord;
}

export function MedicationWarnings({ medication }: MedicationWarningsProps) {
  return (
    <div className="space-y-4">
      {medication.warnings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune alerte renseignée pour ce médicament.
        </p>
      ) : (
        medication.warnings.map((warning) => (
          <Alert key={warning} variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alerte</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        ))
      )}
      <Card>
        <CardHeader>
          <CardTitle>Contre-indications</CardTitle>
        </CardHeader>
        <CardContent>
          {medication.contraindications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Non renseigné.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {medication.contraindications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Précautions</CardTitle>
        </CardHeader>
        <CardContent>
          {(medication.precautions?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Non renseigné.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {medication.precautions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Grossesse & allaitement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Grossesse :</span>{' '}
            {medication.pregnancySafety}
          </p>
          <p>
            <span className="font-medium">Allaitement :</span>{' '}
            {medication.breastfeedingSafety}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
