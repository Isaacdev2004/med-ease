import type { ReactNode } from 'react';

import type { HealthcareStatus } from '@/config/design-tokens';
import { appToast } from '@/services/api/toast';
import {
  DataTable,
  KpiDashboardGrid,
  MetricCard,
  SectionHeader,
  type DataTableColumn,
} from '@/shared/components';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/lib/utils';

interface PortalActionButtonProps {
  label: string;
  successTitle: string;
  successDescription?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  onClick?: () => void;
  className?: string;
}

/** Primary/secondary action that confirms via app toast. */
export function PortalActionButton({
  label,
  successTitle,
  successDescription,
  variant = 'default',
  onClick,
  className,
}: PortalActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        onClick?.();
        appToast.success({ title: successTitle, description: successDescription });
      }}
    >
      {label}
    </Button>
  );
}

interface PortalMetric {
  title: string;
  value: ReactNode;
  description?: string;
  status?: HealthcareStatus;
}

export function PortalMetricsGrid({ metrics, columns = 4 }: { metrics: PortalMetric[]; columns?: 2 | 3 | 4 }) {
  return (
    <KpiDashboardGrid columns={columns}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          status={metric.status}
        />
      ))}
    </KpiDashboardGrid>
  );
}

interface PortalDataTableSectionProps<T> {
  title: string;
  description?: string;
  actionLabel?: string;
  actionSuccessTitle?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  rowActions?: (row: T) => ReactNode;
}

export function PortalDataTableSection<T>({
  title,
  description,
  actionLabel,
  actionSuccessTitle,
  columns,
  data,
  getRowId,
  rowActions,
}: PortalDataTableSectionProps<T>) {
  return (
    <section>
      <SectionHeader
        title={title}
        description={description}
        actions={
          actionLabel ? (
            <PortalActionButton
              label={actionLabel}
              successTitle={actionSuccessTitle ?? `${actionLabel} completed`}
            />
          ) : undefined
        }
      />
      <DataTable columns={columns} data={data} getRowId={getRowId} rowActions={rowActions} />
    </section>
  );
}

interface PortalInfoCardProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  successTitle?: string;
  className?: string;
}

export function PortalInfoCard({ title, children, actionLabel, successTitle, className }: PortalInfoCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
      {actionLabel ? (
        <CardFooter className="border-t bg-muted/20">
          <PortalActionButton
            label={actionLabel}
            variant="outline"
            successTitle={successTitle ?? `${actionLabel} saved`}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}

interface PortalFieldProps {
  label: string;
  value: ReactNode;
}

export function PortalField({ label, value }: PortalFieldProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface PortalSettingsToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function PortalSettingsToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: PortalSettingsToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(value) => {
          onCheckedChange(value);
          appToast.success({ title: `${label} updated` });
        }}
      />
    </div>
  );
}

interface PortalFormFieldProps {
  id: string;
  label: string;
  defaultValue?: string;
  type?: string;
}

export function PortalFormField({ id, label, defaultValue, type = 'text' }: PortalFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}

export function PortalStatusBadge({
  label,
  variant = 'outline',
}: {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}) {
  return (
    <Badge variant={variant} className="capitalize">
      {label.replace(/-/g, ' ')}
    </Badge>
  );
}

export function PortalListCard({
  title,
  items,
  actionLabel,
}: {
  title: string;
  items: { id: string; primary: string; secondary?: string; badge?: string }[];
  actionLabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {actionLabel ? (
          <PortalActionButton label={actionLabel} variant="outline" successTitle={`${actionLabel} completed`} />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 text-sm">
            <div className="min-w-0">
              <p className="font-medium truncate">{item.primary}</p>
              {item.secondary ? <p className="text-xs text-muted-foreground truncate">{item.secondary}</p> : null}
            </div>
            {item.badge ? <PortalStatusBadge label={item.badge} /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
