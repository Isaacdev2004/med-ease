import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationDosageProps {
  medication: MedicationRecord;
}

const POPULATION_FR: Record<string, string> = {
  adult: 'Adulte',
  pediatric: 'Pédiatrie',
  geriatric: 'Gériatrie',
};

export function MedicationDosage({ medication }: MedicationDosageProps) {
  return (
    <div className="space-y-4">
      {medication.dosages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune posologie renseignée.
        </p>
      ) : (
        medication.dosages.map((dosage) => (
          <Card key={`${dosage.population}-${dosage.indication}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {POPULATION_FR[dosage.population] ?? dosage.population} —{' '}
                {dosage.indication}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Dose :</span> {dosage.dose}
              </p>
              <p>
                <span className="font-medium">Fréquence :</span>{' '}
                {dosage.frequency}
              </p>
              {dosage.maxDose ? (
                <p>
                  <span className="font-medium">Maximum :</span>{' '}
                  {dosage.maxDose}
                </p>
              ) : null}
              {dosage.notes ? (
                <p className="text-muted-foreground">{dosage.notes}</p>
              ) : null}
            </CardContent>
          </Card>
        ))
      )}
      <Card>
        <CardHeader>
          <CardTitle>Administration</CardTitle>
        </CardHeader>
        <CardContent>
          {(medication.administration?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">
              Voir la posologie et le guide patient.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {medication.administration.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conservation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {medication.storage || 'Non renseigné.'}
        </CardContent>
      </Card>
    </div>
  );
}
