import { useCallback, useMemo, useState } from 'react';

/** Manages bulk row selection for enterprise tables. */
export function useRowSelection(allIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.size === allIds.length ? new Set() : new Set(allIds),
    );
  }, [allIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useMemo(
    () => allIds.length > 0 && selectedIds.size === allIds.length,
    [allIds.length, selectedIds.size],
  );

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < allIds.length,
    [allIds.length, selectedIds.size],
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleRow,
    toggleAll,
    clearSelection,
    isAllSelected,
    isIndeterminate,
    hasSelection: selectedIds.size > 0,
  };
}
