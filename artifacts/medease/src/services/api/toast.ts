import { toast as baseToast } from '@/shared/hooks/use-toast';

export type AppToastVariant = 'success' | 'warning' | 'info' | 'error';

interface ToastInput {
  title: string;
  description?: string;
  variant?: AppToastVariant;
}

function mapVariant(variant: AppToastVariant): 'default' | 'destructive' {
  return variant === 'error' ? 'destructive' : 'default';
}

/** Centralized toast strategy for mutations, sync, permissions, and offline events. */
export const appToast = {
  success(input: ToastInput) {
    baseToast({ ...input, variant: mapVariant('success') });
  },
  warning(input: ToastInput) {
    baseToast({ ...input, variant: mapVariant('warning') });
  },
  info(input: ToastInput) {
    baseToast({ ...input, variant: mapVariant('info') });
  },
  error(input: ToastInput) {
    baseToast({ ...input, variant: mapVariant('error') });
  },
  permissionDenied(description = 'You do not have permission to perform this action.') {
    this.error({ title: 'Permission denied', description });
  },
  offline(description = 'Changes will sync when you are back online.') {
    this.warning({ title: 'Offline', description });
  },
  backgroundSync(description = 'Your changes are syncing in the background.') {
    this.info({ title: 'Syncing', description });
  },
  mutationSuccess(entity: string) {
    this.success({ title: `${entity} saved` });
  },
  mutationError(entity: string, description?: string) {
    this.error({
      title: `Unable to save ${entity.toLowerCase()}`,
      description,
    });
  },
};
