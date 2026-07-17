import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title?: string;
  description?: string;
}

export function Placeholder({
  icon: Icon,
  title,
  description,
  children,
  className,
  ...props
}: PlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/20 p-8 text-center min-h-[16rem]',
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        {Icon && (
          <Icon
            className="mb-4 h-10 w-10 text-muted-foreground/50"
            aria-hidden="true"
          />
        )}
        {title && <h3 className="font-medium text-foreground">{title}</h3>}
        {description && (
          <p className="text-sm mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
