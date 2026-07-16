import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Badge } from '@/shared/ui/badge';

interface MedicationBadgesProps {
  medication: MedicationRecord;
}

export function MedicationBadges({ medication }: MedicationBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">{medication.atcCode}</Badge>
      <Badge variant="secondary">{medication.therapeuticClass}</Badge>
      {medication.prescriptionRequired ? (
        <Badge variant="destructive">Prescription</Badge>
      ) : (
        <Badge variant="success">OTC</Badge>
      )}
      {medication.controlledSubstance ? <Badge variant="destructive">Controlled</Badge> : null}
      {medication.pediatricApproved ? <Badge variant="outline">Pediatric</Badge> : null}
      {medication.bdpmId ? <Badge variant="outline">BDPM {medication.bdpmId}</Badge> : null}
    </div>
  );
}
