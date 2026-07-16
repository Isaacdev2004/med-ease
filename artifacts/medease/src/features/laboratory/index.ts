export { LaboratoryShell } from '@/features/laboratory/components/LaboratoryShell';
export {
  createPatientLaboratoryRoutes,
  createProfessionalLaboratoryRoutes,
  createFacilityLaboratoryRoutes,
  createAdminLaboratoryRoutes,
} from '@/features/laboratory/routes';
export * from '@/features/laboratory/hooks/use-laboratory';
export { useLaboratoryPermissions } from '@/features/laboratory/hooks/use-laboratory-permissions';
export { useLaboratoryMutations, useCreateLabOrder, useCancelLabOrder } from '@/features/laboratory/mutations/laboratory.mutations';
