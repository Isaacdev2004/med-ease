export { ApiPlatformShell } from '@/features/api-platform/components/ApiPlatformShell';
export {
  ApiPlatformTabs,
  getApiPlatformSectionFromPath,
} from '@/features/api-platform/components/ApiPlatformTabs';
export * from '@/features/api-platform/components/ApiPlatformComponents';
export * from '@/features/api-platform/components/ApiPlatformSections';
export * from '@/features/api-platform/hooks/use-api-platform';
export { useApiPlatformPermissions } from '@/features/api-platform/hooks/use-api-platform-permissions';
export { useApiPlatformMutations } from '@/features/api-platform/mutations/api-platform.mutations';
export { apiPlatformQueries } from '@/features/api-platform/queries/api-platform.queries';
export {
  createProfessionalApiPlatformRoutes,
  createFacilityApiPlatformRoutes,
  createAdminApiPlatformRoutes,
} from '@/features/api-platform/routes';
