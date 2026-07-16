import { useEffect, useRef, useState } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { draftStorage } from '@/shared/forms/draft-storage';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  draftKey: string;
  intervalMs?: number;
  enabled?: boolean;
  onSave?: (values: T) => Promise<void> | void;
}

const AUTOSAVE_INTERVAL_MS = 30_000;

/** Autosaves form drafts every 30s, on page hide, and before unload. */
export function useAutosave<T extends FieldValues>({
  form,
  draftKey,
  intervalMs = AUTOSAVE_INTERVAL_MS,
  enabled = true,
  onSave,
}: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const values = form.watch();
  const savingRef = useRef(false);

  const saveDraft = async (nextValues: T) => {
    if (!enabled || savingRef.current) return;
    savingRef.current = true;
    setStatus('saving');
    try {
      draftStorage.save(draftKey, nextValues);
      await onSave?.(nextValues);
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      savingRef.current = false;
    }
  };

  useEffect(() => {
    if (!enabled || !form.formState.isDirty) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        if (savingRef.current) return;
        savingRef.current = true;
        setStatus('saving');
        try {
          draftStorage.save(draftKey, values as T);
          await onSave?.(values as T);
          setStatus('saved');
        } catch {
          setStatus('error');
        } finally {
          savingRef.current = false;
        }
      })();
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [values, enabled, form.formState.isDirty, intervalMs, draftKey, onSave]);

  useEffect(() => {
    if (!enabled) return;

    function handlePageHide() {
      if (form.formState.isDirty) {
        draftStorage.save(draftKey, form.getValues());
      }
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!form.formState.isDirty) return;
      draftStorage.save(draftKey, form.getValues());
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [draftKey, enabled, form]);

  return {
    status,
    saveDraft: () => saveDraft(form.getValues()),
    clearDraft: () => {
      draftStorage.remove(draftKey);
      setStatus('idle');
    },
  };
}

interface UseFormDraftOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  draftKey: string;
  enabled?: boolean;
}

/** Restores a saved draft on mount when available. */
export function useFormDraft<T extends FieldValues>({
  form,
  draftKey,
  enabled = true,
}: UseFormDraftOptions<T>) {
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!enabled || restored) return;
    const draft = draftStorage.load<T>(draftKey);
    if (draft?.data) {
      form.reset(draft.data);
      setRestored(true);
    }
  }, [draftKey, enabled, form, restored]);

  return { restored, hasDraft: draftStorage.has(draftKey) };
}
