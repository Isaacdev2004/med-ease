import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationInteractionsProps {
  medication: MedicationRecord;
}

const SEVERITY_VARIANT = {
  minor: 'secondary',
  moderate: 'warning',
  major: 'destructive',
} as const;

export function MedicationInteractions({ medication }: MedicationInteractionsProps) {
  if (!medication.interactions.length) {
    return <p className="text-sm text-muted-foreground">No known interactions listed in mock data.</p>;
  }

  return (
    <div className="space-y-3">
      {medication.interactions.map((interaction) => (
        <Card key={`${interaction.drugName}-${interaction.severity}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{interaction.drugName}</CardTitle>
              <Badge variant={SEVERITY_VARIANT[interaction.severity]}>{interaction.severity}</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{interaction.description}</CardContent>
        </Card>
      ))}
    </div>
  );
}
