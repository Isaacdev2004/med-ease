import { AlertTriangle, Heart, Shield } from 'lucide-react';

import type {
  ClinicalAlert,
  HealthScore,
  PatientDemographics,
} from '@/services/patient-records/types';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface PatientBannerProps {
  demographics: PatientDemographics;
  healthScore?: HealthScore;
  alerts?: ClinicalAlert[];
  className?: string;
}

export function PatientBanner({
  demographics,
  healthScore,
  alerts = [],
  className,
}: PatientBannerProps) {
  const initials = demographics.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const activeAlerts = alerts.filter((a) => a.active);

  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{demographics.fullName}</h1>
            <p className="text-muted-foreground">
              {demographics.mrn} · {demographics.nationalId}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <Badge variant="outline">{demographics.gender}</Badge>
              <Badge variant="outline">DOB {demographics.dateOfBirth}</Badge>
              <Badge variant="outline">{demographics.bloodGroup}</Badge>
              <Badge variant="outline">BMI {demographics.bmi}</Badge>
            </div>
          </div>
        </div>
        {healthScore ? (
          <div
            className="flex items-center gap-4 rounded-lg border px-4 py-3"
            aria-label={`Health score ${healthScore.overall}`}
          >
            <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold">{healthScore.overall}</p>
              <p className="text-xs text-muted-foreground capitalize">
                Health score · {healthScore.trend}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      {activeAlerts.length > 0 ? (
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="list"
          aria-label="Clinical alerts"
        >
          {activeAlerts.map((alert) => (
            <Badge
              key={alert.id}
              variant={
                alert.severity === 'critical' ? 'destructive' : 'warning'
              }
              className="gap-1"
              role="listitem"
            >
              {alert.severity === 'critical' ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Shield className="h-3 w-3" />
              )}
              {alert.title}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HealthScoreWidget({ score }: { score: HealthScore }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {[
        { label: 'Overall', value: score.overall },
        { label: 'Vitals', value: score.vitals },
        { label: 'Labs', value: score.labs },
        { label: 'Medications', value: score.medications },
        { label: 'Care Plans', value: score.carePlans },
      ].map((item) => (
        <div key={item.label} className="rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function HealthStatusBanner({
  message,
  severity = 'info',
}: {
  message: string;
  severity?: 'info' | 'warning' | 'critical';
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        severity === 'critical' &&
          'border-destructive bg-destructive/10 text-destructive',
        severity === 'warning' && 'border-yellow-500/50 bg-yellow-500/10',
        severity === 'info' && 'border-primary/30 bg-primary/5',
      )}
      role="status"
    >
      {message}
    </div>
  );
}
