export { MedicationsShell } from '@/features/medications/components/MedicationsShell';
export {
  createPatientMedicationsRoutes,
  createProfessionalMedicationRoutes,
  createPharmacyMedicationRoutes,
  createFacilityMedicationRoutes,
  createAdminMedicationRoutes,
} from '@/features/medications/routes';
export * from '@/features/medications/hooks/use-medications';
export { useMedicationPermissions } from '@/features/medications/hooks/use-medication-permissions';
export { useMedicationMutations } from '@/features/medications/mutations/medications.mutations';
