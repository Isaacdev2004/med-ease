export { DocumentShell } from '@/features/documents/components/DocumentShell';
export { DocumentTabs, getDocumentSectionFromPath } from '@/features/documents/components/DocumentTabs';
export * from '@/features/documents/components/DocumentComponents';
export * from '@/features/documents/components/DocumentSections';
export * from '@/features/documents/hooks/use-documents';
export { useDocumentPermissions } from '@/features/documents/hooks/use-document-permissions';
export { useDocumentMutations } from '@/features/documents/mutations/document.mutations';
export { documentQueries } from '@/features/documents/queries/document.queries';
export { createProfessionalDocumentRoutes, createFacilityDocumentRoutes, createAdminDocumentRoutes } from '@/features/documents/routes';
