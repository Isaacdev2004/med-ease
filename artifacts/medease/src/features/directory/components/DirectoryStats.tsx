import { Building2, Heart, MapPin, Pill, Stethoscope } from 'lucide-react';

import type { DirectoryStats } from '@/services/directory/directory.types';
import { StatCard } from '@/shared/components';

interface DirectoryStatsProps {
  stats?: DirectoryStats;
  loading?: boolean;
}

export function DirectoryStatsPanel({ stats, loading }: DirectoryStatsProps) {
  if (loading || !stats) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </>
    );
  }

  return (
    <>
      <StatCard label="Total" value={stats.total} icon={MapPin} />
      <StatCard
        label="Professionnels"
        value={stats.professionals}
        icon={Stethoscope}
      />
      <StatCard label="Établissements" value={stats.facilities} icon={Building2} />
      <StatCard label="Pharmacies" value={stats.pharmacies} icon={Pill} />
      <StatCard label="Favoris" value={stats.favorites} icon={Heart} />
    </>
  );
}
