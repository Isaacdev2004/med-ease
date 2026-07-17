import { Cell, Pie, PieChart } from 'recharts';

import { ChartPanel } from '@/shared/charts/ChartPanel';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';
import { cn } from '@/shared/lib/utils';

interface DonutChartPanelProps {
  title: string;
  description?: string;
  data: Array<{ label: string; value: number; fill?: string }>;
  loading?: boolean;
  className?: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function DonutChartPanel({
  title,
  description,
  data,
  loading,
  className,
}: DonutChartPanelProps) {
  const config = Object.fromEntries(
    data.map((item, index) => [
      item.label,
      { label: item.label, color: item.fill ?? COLORS[index % COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <ChartPanel
      title={title}
      description={description}
      loading={loading}
      empty={data.length === 0}
      className={className}
    >
      <ChartContainer config={config} className={cn('mx-auto h-64 w-full')}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={entry.fill ?? COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        </PieChart>
      </ChartContainer>
    </ChartPanel>
  );
}
