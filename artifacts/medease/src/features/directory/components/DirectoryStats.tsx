import { MapPin } from 'lucide-react';

import type { DirectoryStats } from '@/services/directory/directory.types';
import { MetricCard, StatCard } from '@/shared/components';
import { Building2, Heart, Pill, Stethoscope, Truck } from 'lucide-react';

interface DirectoryStatsProps {
  stats?: DirectoryStats;
  loading?: boolean;
}

export function DirectoryStatsPanel({ stats, loading }: DirectoryStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Total Providers" value={stats.total} icon={MapPin} />
      <MetricCard
        title="Professionals"
        value={stats.professionals}
        status="neutral"
      />
      <StatCard label="Facilities" value={stats.facilities} icon={Building2} />
      <StatCard label="Pharmacies" value={stats.pharmacies} icon={Pill} />
      <StatCard label="Your Favorites" value={stats.favorites} icon={Heart} />
      <div className="hidden">
        <Stethoscope />
        <Truck />
      </div>
    </div>
  );
}
