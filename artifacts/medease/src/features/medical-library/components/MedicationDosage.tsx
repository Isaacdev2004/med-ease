import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationDosageProps {
  medication: MedicationRecord;
}

export function MedicationDosage({ medication }: MedicationDosageProps) {
  return (
    <div className="space-y-4">
      {medication.dosages.map((dosage) => (
        <Card key={`${dosage.population}-${dosage.indication}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base capitalize">{dosage.population} — {dosage.indication}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><span className="font-medium">Dose:</span> {dosage.dose}</p>
            <p><span className="font-medium">Frequency:</span> {dosage.frequency}</p>
            {dosage.maxDose ? <p><span className="font-medium">Max:</span> {dosage.maxDose}</p> : null}
            {dosage.notes ? <p className="text-muted-foreground">{dosage.notes}</p> : null}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader><CardTitle>Administration</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {medication.administration.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Storage</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">{medication.storage}</CardContent>
      </Card>
    </div>
  );
}
