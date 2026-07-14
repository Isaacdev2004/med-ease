import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-80 lg:min-h-96 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center motion-preset-fade",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
