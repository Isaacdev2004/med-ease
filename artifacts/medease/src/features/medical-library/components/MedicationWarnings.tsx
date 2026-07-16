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
      {medication.warnings.map((warning) => (
        <Alert key={warning} variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}
      <Card>
        <CardHeader><CardTitle>Contraindications</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {medication.contraindications.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Precautions</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {medication.precautions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Pregnancy & Breastfeeding</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><span className="font-medium">Pregnancy:</span> {medication.pregnancySafety}</p>
          <p><span className="font-medium">Breastfeeding:</span> {medication.breastfeedingSafety}</p>
        </CardContent>
      </Card>
    </div>
  );
}
