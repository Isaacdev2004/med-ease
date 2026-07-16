import type { MedicationLibraryStats } from '@/services/medical-library/medical-library.types';
import { MetricCard, StatCard } from '@/shared/components';
import { BookOpen, Heart, Pill, Shield } from 'lucide-react';

interface MedicationStatsProps {
  stats?: MedicationLibraryStats;
  loading?: boolean;
}

export function MedicationStats({ stats, loading }: MedicationStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Medications" value={stats.total} icon={BookOpen} />
      <MetricCard title="Prescription" value={stats.prescription} status="warning" />
      <StatCard label="Over-the-counter" value={stats.overTheCounter} icon={Pill} />
      <StatCard label="Your Favorites" value={stats.favorites} icon={Heart} />
      <div className="hidden"><Shield /></div>
    </div>
  );
}
