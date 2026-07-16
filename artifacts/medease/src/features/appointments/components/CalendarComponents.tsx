import {
  addDays,
  addMonths,
  format,
  subDays,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { CalendarEvent, CalendarViewMode } from '@/services/appointments/types';
import type { CalendarDayCell } from '@/services/appointments/calendar';
import { AppointmentStatusBadge } from '@/features/appointments/components/AppointmentComponents';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const STATUS_LEGEND = [
  { label: 'Scheduled', color: '#3b82f6' },
  { label: 'In Progress', color: '#f59e0b' },
  { label: 'Completed', color: '#22c55e' },
  { label: 'Cancelled', color: '#94a3b8' },
];

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs" aria-label="Calendar legend">
      {STATUS_LEGEND.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function CalendarToolbar({
  label,
  mode,
  onModeChange,
  onPrev,
  onNext,
  onToday,
}: {
  label: string;
  mode: CalendarViewMode;
  onModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const modes: CalendarViewMode[] = ['month', 'week', 'day', 'agenda', 'timeline'];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" onClick={onPrev} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onToday}>Today</Button>
        <Button type="button" variant="outline" size="icon" onClick={onNext} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold ml-2">{label}</h2>
      </div>
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Calendar view">
        {modes.map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={mode === m ? 'default' : 'outline'}
            onClick={() => onModeChange(m)}
            aria-selected={mode === m}
            className="capitalize"
          >
            {m}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function MiniCalendar({
  referenceDate,
  onSelectDate,
}: {
  referenceDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const days = useMemo(() => {
    const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
    const cells: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      cells.push(new Date(d));
    }
    return cells;
  }, [referenceDate]);

  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{format(referenceDate, 'MMMM yyyy')}</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            type="button"
            className="rounded p-1 hover:bg-muted"
            onClick={() => onSelectDate(day)}
            aria-label={format(day, 'PPP')}
          >
            {format(day, 'd')}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div
      className="truncate rounded px-1 py-0.5 text-[10px] text-white"
      style={{ backgroundColor: event.color }}
      title={event.title}
    >
      {format(new Date(event.start), 'HH:mm')} {event.title}
    </div>
  );
}

export function MonthView({ grid }: { grid: CalendarDayCell[] }) {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="rounded-lg border" role="grid" aria-label="Month calendar">
      <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium">
        {weekdays.map((d) => <div key={d} className="p-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {grid.map((cell) => (
          <div
            key={cell.date.toISOString()}
            className={cn(
              'min-h-24 border-b border-r p-1 text-xs',
              !cell.isCurrentMonth && 'bg-muted/20 text-muted-foreground',
              cell.isToday && 'bg-primary/5',
            )}
            role="gridcell"
          >
            <span className={cn('font-medium', cell.isToday && 'text-primary')}>{format(cell.date, 'd')}</span>
            <div className="mt-1 space-y-0.5">
              {cell.events.slice(0, 3).map((e) => <EventPill key={e.id} event={e} />)}
              {cell.events.length > 3 ? <p className="text-muted-foreground">+{cell.events.length - 3} more</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeekView({ grid }: { grid: CalendarDayCell[] }) {
  return (
    <div className="grid gap-2 lg:grid-cols-7" role="list" aria-label="Week calendar">
      {grid.map((cell) => (
        <Card key={cell.date.toISOString()} role="listitem">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{format(cell.date, 'EEE d')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {cell.events.length ? cell.events.map((e) => <EventPill key={e.id} event={e} />) : (
              <p className="text-xs text-muted-foreground">No appointments</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DayView({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="space-y-2" role="list" aria-label="Day schedule">
      {events.length ? events.map((event) => (
        <Card key={event.id} role="listitem" draggable className="cursor-grab">
          <CardContent className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(event.start), 'HH:mm')} – {format(new Date(event.end), 'HH:mm')}</p>
            </div>
            <AppointmentStatusBadge status={event.status} />
          </CardContent>
        </Card>
      )) : <p className="text-muted-foreground text-sm">No appointments scheduled.</p>}
    </div>
  );
}

export function AgendaView({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="space-y-2" role="list" aria-label="Agenda">
      {events.map((event) => (
        <Card key={event.id} role="listitem">
          <CardContent className="py-3 flex justify-between gap-4">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(event.start), 'PPp')}</p>
            </div>
            <AppointmentStatusBadge status={event.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TimelineCalendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-border" role="list" aria-label="Timeline calendar">
      {events.map((event) => (
        <div key={event.id} className="relative" role="listitem">
          <span className="absolute -left-[1.35rem] top-1 h-3 w-3 rounded-full border-2 bg-background" style={{ borderColor: event.color }} aria-hidden="true" />
          <Card>
            <CardContent className="py-3">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(event.start), 'PPp')}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function CalendarView({
  mode,
  grid,
  dayEvents,
  agendaEvents,
  allEvents,
  referenceDate,
  onReferenceDateChange,
  onModeChange,
}: {
  mode: CalendarViewMode;
  grid?: CalendarDayCell[];
  dayEvents?: CalendarEvent[];
  agendaEvents?: CalendarEvent[];
  allEvents: CalendarEvent[];
  referenceDate: Date;
  onReferenceDateChange: (date: Date) => void;
  onModeChange?: (mode: CalendarViewMode) => void;
}) {
  const label = mode === 'month'
    ? format(referenceDate, 'MMMM yyyy')
    : format(referenceDate, 'PPP');

  function navigate(delta: number) {
    if (mode === 'month') onReferenceDateChange(delta > 0 ? addMonths(referenceDate, 1) : subMonths(referenceDate, 1));
    else onReferenceDateChange(delta > 0 ? addDays(referenceDate, 1) : subDays(referenceDate, 1));
  }

  return (
    <div className="space-y-4">
      <CalendarToolbar
        label={label}
        mode={mode}
        onModeChange={onModeChange ?? (() => undefined)}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        onToday={() => onReferenceDateChange(new Date())}
      />
      <CalendarLegend />
      {mode === 'month' && grid ? <MonthView grid={grid} /> : null}
      {mode === 'week' && grid ? <WeekView grid={grid} /> : null}
      {mode === 'day' ? <DayView events={dayEvents ?? []} /> : null}
      {mode === 'agenda' ? <AgendaView events={agendaEvents ?? []} /> : null}
      {mode === 'timeline' ? <TimelineCalendar events={allEvents.slice(0, 20)} /> : null}
    </div>
  );
}

export function useCalendarNavigation(initial = new Date()) {
  const [referenceDate, setReferenceDate] = useState(initial);
  const [mode, setMode] = useState<CalendarViewMode>('month');
  return { referenceDate, setReferenceDate, mode, setMode };
}
