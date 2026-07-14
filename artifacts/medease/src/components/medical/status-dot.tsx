import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusDotVariant = "default" | "success" | "warning" | "destructive" | "info" | "muted"

interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusDotVariant
  animate?: boolean
}

export function StatusDot({ status, animate = false, className, ...props }: StatusDotProps) {
  const getStatusColor = (variant: StatusDotVariant) => {
    switch (variant) {
      case "success": return "bg-success"
      case "warning": return "bg-warning"
      case "destructive": return "bg-destructive"
      case "info": return "bg-blue-500 dark:bg-blue-400"
      case "muted": return "bg-muted-foreground"
      case "default":
      default: return "bg-primary"
    }
  }

  const bgClass = getStatusColor(status)

  return (
    <div className={cn("relative flex h-2 w-2", className)} aria-label={`Status: ${status}`} {...props}>
      {animate && (
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", bgClass)} />
      )}
      <span className={cn("relative inline-flex rounded-full h-2 w-2", bgClass)} />
    </div>
  )
}
