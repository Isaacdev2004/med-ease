import type {
  DrugInteraction,
  PatientMedication,
} from '@/services/medications/types';
import { MOCK_INTERACTIONS } from '@/services/medications/mock-data';

export function checkMedicationInteractions(
  patientId: string,
  medications: PatientMedication[],
  allergies: string[] = ['Penicillin'],
): DrugInteraction[] {
  const known = MOCK_INTERACTIONS.filter((i) => i.patientId === patientId);
  const dynamic: DrugInteraction[] = [];

  const names = medications.map((m) => m.name);
  if (names.includes('Warfarin') && names.includes('Amoxicillin')) {
    dynamic.push({
      id: `dyn-${patientId}-warfarin`,
      patientId,
      type: 'medication',
      source: 'Warfarin',
      target: 'Amoxicillin',
      severity: 'high',
      recommendation: 'Increased bleeding risk — monitor INR.',
      active: true,
    });
  }

  for (const med of medications) {
    for (const allergen of allergies) {
      if (
        med.name.toLowerCase().includes(allergen.toLowerCase()) ||
        med.genericName.toLowerCase().includes(allergen.toLowerCase())
      ) {
        dynamic.push({
          id: `dyn-allergy-${med.id}`,
          patientId,
          type: 'allergy',
          source: allergen,
          target: med.name,
          severity: 'critical',
          recommendation: 'Potential allergy cross-reactivity.',
          active: true,
        });
      }
    }
  }

  return [...known, ...dynamic];
}

export function getInteractionSeverityColor(
  severity: DrugInteraction['severity'],
): string {
  const map = {
    critical: '#ef4444',
    high: '#f97316',
    moderate: '#eab308',
    low: '#3b82f6',
  };
  return map[severity];
}
