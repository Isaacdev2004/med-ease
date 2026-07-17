import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { MedicationDosage } from '@/features/medical-library/components/MedicationDosage';
import { MedicationInteractions } from '@/features/medical-library/components/MedicationInteractions';
import { MedicationWarnings } from '@/features/medical-library/components/MedicationWarnings';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationTabsProps {
  medication: MedicationRecord;
}

export function MedicationTabs({ medication }: MedicationTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="dosage">Dosage</TabsTrigger>
        <TabsTrigger value="warnings">Warnings</TabsTrigger>
        <TabsTrigger value="interactions">Interactions</TabsTrigger>
        <TabsTrigger value="patient">Patient Guide</TabsTrigger>
        <TabsTrigger value="professional">Professional Guide</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {medication.activeIngredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {medication.indications.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Side Effects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {medication.sideEffects.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
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
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {medication.patientInformation}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="professional" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {medication.professionalInformation}
          </CardContent>
        </Card>
        {medication.references.length ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>References</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {medication.references.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
