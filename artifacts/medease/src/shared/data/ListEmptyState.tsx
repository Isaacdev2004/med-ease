import type { ReactNode } from 'react';

import { EmptyState } from '@/shared/ui/empty-state';

interface ListEmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

/** Standard empty list pattern — icon, title, description, primary + secondary actions. */
export function ListEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ListEmptyStateProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      className={className}
      action={
        primaryAction || secondaryAction ? (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : undefined
      }
    />
  );
}
