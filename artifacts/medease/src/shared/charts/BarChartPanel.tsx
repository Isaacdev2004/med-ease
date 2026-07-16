import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartPanel } from '@/shared/charts/ChartPanel';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';
import { cn } from '@/shared/lib/utils';

interface BarChartPanelProps {
  title: string;
  description?: string;
  data: Array<{ label: string; value: number }>;
  loading?: boolean;
  className?: string;
}

const barConfig = {
  value: { label: 'Count', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

export function BarChartPanel({
  title,
  description,
  data,
  loading,
  className,
}: BarChartPanelProps) {
  return (
    <ChartPanel
      title={title}
      description={description}
      loading={loading}
      empty={data.length === 0}
      className={className}
    >
      <ChartContainer config={barConfig} className={cn('h-64 w-full')}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartPanel>
  );
}
