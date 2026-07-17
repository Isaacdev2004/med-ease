import { format } from 'date-fns';

import type {
  Appointment,
  AppointmentFilters,
  ProviderAvailability,
} from '@/services/appointments/types';
import { SearchBar } from '@/shared/components';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SPECIALTIES } from '@/services/appointments';

const STATUSES = [
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'waiting',
  'delayed',
] as const;

interface AppointmentFiltersProps {
  filters: AppointmentFilters;
  onChange: (patch: Partial<AppointmentFilters>) => void;
  onSearch?: (q: string) => void;
  showPatientFilter?: boolean;
}

export function AppointmentSearch({
  onSearch,
  loading,
}: {
  onSearch: (q: string) => void;
  loading?: boolean;
}) {
  return (
    <SearchBar
      placeholder="Search by patient, provider, ID, specialty…"
      onSearch={onSearch}
      loading={loading}
      aria-label="Search appointments"
    />
  );
}

export function AppointmentFiltersBar({
  filters,
  onChange,
  onSearch,
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      {onSearch ? (
        <div className="flex-1">
          <AppointmentSearch onSearch={onSearch} />
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) =>
              onChange({
                status:
                  v === 'all' ? undefined : (v as AppointmentFilters['status']),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Specialty</Label>
          <Select
            value={filters.specialty ?? 'all'}
            onValueChange={(v) =>
              onChange({ specialty: v === 'all' ? undefined : v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialties</SelectItem>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Visit type</Label>
          <Select
            value={
              filters.telemedicine === true
                ? 'tele'
                : filters.telemedicine === false
                  ? 'in_person'
                  : 'all'
            }
            onValueChange={(v) =>
              onChange({
                telemedicine:
                  v === 'tele' ? true : v === 'in_person' ? false : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="tele">Telemedicine only</SelectItem>
              <SelectItem value="in_person">In-person only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Follow-up</Label>
          <Select
            value={
              filters.followUp === true
                ? 'yes'
                : filters.followUp === false
                  ? 'no'
                  : 'all'
            }
            onValueChange={(v) =>
              onChange({
                followUp: v === 'yes' ? true : v === 'no' ? false : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Follow-up required</SelectItem>
              <SelectItem value="no">No follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function ScheduleGrid({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  return (
    <div
      className="overflow-x-auto rounded-lg border"
      role="table"
      aria-label="Daily schedule grid"
    >
      <div
        className="grid min-w-[640px]"
        style={{ gridTemplateColumns: '80px 1fr' }}
      >
        {hours.map((hour) => {
          const hourAppts = appointments.filter(
            (a) => new Date(a.scheduledAt).getHours() === hour,
          );
          return (
            <div key={hour} className="contents">
              <div className="border-b border-r p-2 text-xs text-muted-foreground">
                {hour}:00
              </div>
              <div className="border-b p-1 space-y-1">
                {hourAppts.map((a) => (
                  <div
                    key={a.id}
                    className="rounded bg-primary/10 px-2 py-1 text-xs truncate"
                  >
                    {format(new Date(a.scheduledAt), 'HH:mm')}{' '}
                    {a.patient.fullName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProviderSchedule({
  availability,
}: {
  availability: ProviderAvailability;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{availability.providerName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {availability.specialty} · {format(new Date(availability.date), 'PP')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {availability.slots.map((slot) => (
            <span
              key={slot.id}
              className={`rounded px-2 py-1 text-xs ${slot.available && !availability.blockedSlots.includes(slot.id) ? 'bg-primary/10' : 'bg-muted text-muted-foreground line-through'}`}
            >
              {format(new Date(slot.start), 'HH:mm')}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AvailabilityGrid({
  availabilities,
}: {
  availabilities: ProviderAvailability[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {availabilities.map((a) => (
        <ProviderSchedule
          key={`${a.providerId}-${a.facilityId}`}
          availability={a}
        />
      ))}
    </div>
  );
}

export function ResourceCalendar({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const rooms = [...new Set(appointments.map((a) => a.room))];
  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <Card key={room}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{room}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {appointments
              .filter((a) => a.room === room)
              .map((a) => (
                <p key={a.id}>
                  {format(new Date(a.scheduledAt), 'HH:mm')} —{' '}
                  {a.patient.fullName} ({a.specialty})
                </p>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
