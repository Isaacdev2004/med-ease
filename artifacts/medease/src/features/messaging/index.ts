export { MessagingShell } from '@/features/messaging/components/MessagingShell';
export { MessagingTabs, getMessagingSectionFromPath } from '@/features/messaging/components/MessagingTabs';
export * from '@/features/messaging/components/MessagingComponents';
export * from '@/features/messaging/components/MessagingSections';
export * from '@/features/messaging/hooks/use-messaging';
export { useMessagingPermissions } from '@/features/messaging/hooks/use-messaging-permissions';
export { useMessagingMutations } from '@/features/messaging/mutations/messaging.mutations';
export { messagingQueries } from '@/features/messaging/queries/messaging.queries';
export { createProfessionalMessagingRoutes, createFacilityMessagingRoutes, createAdminMessagingRoutes } from '@/features/messaging/routes';
