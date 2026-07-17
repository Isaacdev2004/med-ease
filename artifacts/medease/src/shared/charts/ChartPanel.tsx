import type { ReactNode } from 'react';
import { Line, LineChart } from 'recharts';

import { LoadingView } from '@/shared/components/LoadingView';
import { ListEmptyState } from '@/shared/data/ListEmptyState';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';
import { cn } from '@/shared/lib/utils';

interface ChartPanelProps {
  title?: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  children: ReactNode;
  className?: string;
}

/** Chart wrapper with loading, empty, and responsive container. */
export function ChartPanel({
  title,
  description,
  loading,
  empty,
  emptyTitle = 'No chart data',
  children,
  className,
}: ChartPanelProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-4', className)}>
      {title ? <h3 className="font-semibold mb-1">{title}</h3> : null}
      {description ? (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      ) : null}
      {loading ? (
        <LoadingView variant="skeleton" label="Loading chart" />
      ) : empty ? (
        <ListEmptyState title={emptyTitle} />
      ) : (
        children
      )}
    </div>
  );
}

const sparklineConfig = {
  value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

interface SparklineChartProps {
  data: Array<{ label: string; value: number }>;
  className?: string;
}

export function SparklineChart({ data, className }: SparklineChartProps) {
  if (data.length === 0) {
    return <ListEmptyState title="No trend data" className="min-h-32" />;
  }

  return (
    <ChartContainer
      config={sparklineConfig}
      className={cn('h-32 w-full', className)}
    >
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
