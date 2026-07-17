import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { ErrorView } from '@/shared/components/ErrorView';
import { LoadingView } from '@/shared/components/LoadingView';
import { ListEmptyState } from '@/shared/data/ListEmptyState';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  /** Hide column when false — permission checks belong at call site */
  visible?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  className?: string;
  caption?: string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  rowActions?: (row: T) => ReactNode;
  renderMobileCard?: (row: T) => ReactNode;
  footer?: ReactNode;
  stickyHeader?: boolean;
}

/** Enterprise table with selection, row actions, sticky header, and responsive card collapse. */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading,
  error,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting filters or add a new record.',
  emptyAction,
  className,
  caption,
  selectable,
  selectedIds,
  onToggleRow,
  onToggleAll,
  isAllSelected,
  isIndeterminate,
  rowActions,
  renderMobileCard,
  footer,
  stickyHeader = true,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((column) => column.visible !== false);
  const hasActions = Boolean(rowActions);

  if (loading) {
    return <LoadingView variant="skeleton-table" label="Loading table" />;
  }

  if (error) {
    return <ErrorView onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return (
      <ListEmptyState
        title={emptyTitle}
        description={emptyDescription}
        primaryAction={emptyAction}
      />
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {renderMobileCard ? (
        <div className="grid gap-3 md:hidden">
          {data.map((row) => (
            <div key={getRowId(row)}>{renderMobileCard(row)}</div>
          ))}
        </div>
      ) : null}

      <ScrollArea
        className={cn(
          'w-full rounded-md border',
          renderMobileCard && 'hidden md:block',
        )}
      >
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader
            className={
              stickyHeader ? 'sticky top-0 z-10 bg-background' : undefined
            }
          >
            <TableRow>
              {selectable ? (
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => onToggleAll?.()}
                    aria-label="Select all rows"
                    {...(isIndeterminate
                      ? { 'data-state': 'indeterminate' }
                      : {})}
                  />
                </TableHead>
              ) : null}
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {hasActions ? (
                <TableHead className="w-12 text-right">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const rowId = getRowId(row);
              const selected = selectedIds?.has(rowId);

              return (
                <TableRow
                  key={rowId}
                  data-state={selected ? 'selected' : undefined}
                >
                  {selectable ? (
                    <TableCell>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => onToggleRow?.(rowId)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </TableCell>
                  ) : null}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  {hasActions ? (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Row actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {rowActions?.(row)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {footer}
    </div>
  );
}
