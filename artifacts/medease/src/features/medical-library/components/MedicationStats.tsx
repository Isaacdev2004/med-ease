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
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </>
    );
  }

  return (
    <>
      <StatCard label="Total" value={stats.total} icon={BookOpen} />
      <StatCard
        label="Sur ordonnance"
        value={stats.prescription}
        icon={ShieldAlert}
      />
      <StatCard
        label="Sans ordonnance"
        value={stats.overTheCounter}
        icon={Pill}
      />
      <StatCard label="Favoris" value={stats.favorites} icon={Heart} />
    </>
  );
}
