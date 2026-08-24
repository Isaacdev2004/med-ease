import { BookOpen, Heart, Pill, ShieldAlert } from 'lucide-react';

import type { MedicationLibraryStats } from '@/services/medical-library/medical-library.types';
import { StatCard } from '@/shared/components';

interface MedicationStatsProps {
  stats?: MedicationLibraryStats;
  loading?: boolean;
}

export function MedicationStats({ stats, loading }: MedicationStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 min-w-0">
      <StatCard label="Total" value={stats.total} icon={BookOpen} />
      <StatCard
        label="Sur ordonnance"
        value={stats.prescription}
        icon={ShieldAlert}
      />
      <StatCard label="Sans ordonnance" value={stats.overTheCounter} icon={Pill} />
      <StatCard label="Favoris" value={stats.favorites} icon={Heart} />
    </div>
  );
}
