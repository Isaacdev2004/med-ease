import { useCallback, useEffect, useState } from 'react';

interface UseUnsavedChangesOptions {
  isDirty: boolean;
  enabled?: boolean;
  onSaveDraft?: () => void | Promise<void>;
}

/** Warns users before leaving with unsaved form data. */
export function useUnsavedChanges({
  isDirty,
  enabled = true,
  onSaveDraft,
}: UseUnsavedChangesOptions) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled || !isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, isDirty]);

  const confirmNavigation = useCallback(
    (action: () => void) => {
      if (!enabled || !isDirty) {
        action();
        return;
      }
      setPendingAction(() => action);
      setDialogOpen(true);
    },
    [enabled, isDirty],
  );

  const stay = useCallback(() => {
    setDialogOpen(false);
    setPendingAction(null);
  }, []);

  const leave = useCallback(() => {
    setDialogOpen(false);
    pendingAction?.();
    setPendingAction(null);
  }, [pendingAction]);

  const saveDraftAndLeave = useCallback(async () => {
    await onSaveDraft?.();
    leave();
  }, [leave, onSaveDraft]);

  return {
    dialogOpen,
    setDialogOpen,
    confirmNavigation,
    stay,
    leave,
    saveDraftAndLeave,
    canSaveDraft: Boolean(onSaveDraft),
  };
}
