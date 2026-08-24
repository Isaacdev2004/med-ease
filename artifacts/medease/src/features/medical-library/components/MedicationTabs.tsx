import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { MedicationDosage } from '@/features/medical-library/components/MedicationDosage';
import { MedicationInteractions } from '@/features/medical-library/components/MedicationInteractions';
import { MedicationWarnings } from '@/features/medical-library/components/MedicationWarnings';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationTabsProps {
  medication: MedicationRecord;
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="list-disc pl-5 text-sm text-muted-foreground">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export function MedicationTabs({ medication }: MedicationTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="flex h-auto flex-wrap">
        <TabsTrigger value="overview">Aperçu</TabsTrigger>
        <TabsTrigger value="dosage">Posologie</TabsTrigger>
        <TabsTrigger value="warnings">Contre-indications</TabsTrigger>
        <TabsTrigger value="interactions">Interactions</TabsTrigger>
        <TabsTrigger value="patient">Guide patient</TabsTrigger>
        <TabsTrigger value="professional">Guide pro</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Principes actifs (DCI)</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList
              items={medication.activeIngredients}
              empty="Aucun principe actif renseigné."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indications</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList
              items={medication.indications}
              empty="Aucune indication renseignée."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Effets indésirables</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList
              items={medication.sideEffects}
              empty="Aucun effet indésirable renseigné."
            />
          </CardContent>
        </Card>
        {medication.description ? (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {medication.description}
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>

      <TabsContent value="dosage" className="mt-6">
        <MedicationDosage medication={medication} />
      </TabsContent>

      <TabsContent value="warnings" className="mt-6">
        <MedicationWarnings medication={medication} />
      </TabsContent>

      <TabsContent value="interactions" className="mt-6">
        <MedicationInteractions medication={medication} />
      </TabsContent>

      <TabsContent value="patient" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Information patient</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {medication.patientInformation || 'Non renseigné.'}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="professional" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Information professionnelle</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {medication.professionalInformation || 'Non renseigné.'}
          </CardContent>
        </Card>
        {medication.references.length ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Références</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={medication.references} empty="" />
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
