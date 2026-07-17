import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type {
  Appointment,
  CalendarEvent,
  CalendarViewMode,
} from '@/services/appointments/types';
import { mapAppointmentsToCalendarEvents } from '@/services/appointments/mapper';

export interface CalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function groupEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = format(new Date(event.start), 'yyyy-MM-dd');
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }
  return map;
}

export function buildMonthGrid(
  referenceDate: Date,
  events: CalendarEvent[],
): CalendarDayCell[] {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const byDate = groupEventsByDate(events);
  const today = new Date();

  return days.map((date) => {
    const key = format(date, 'yyyy-MM-dd');
    return {
      date,
      isCurrentMonth: isSameMonth(date, referenceDate),
      isToday: isSameDay(date, today),
      events: byDate.get(key) ?? [],
    };
  });
}

export function buildWeekDays(
  referenceDate: Date,
  events: CalendarEvent[],
): CalendarDayCell[] {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const byDate = groupEventsByDate(events);
  const today = new Date();

  return days.map((date) => ({
    date,
    isCurrentMonth: true,
    isToday: isSameDay(date, today),
    events: byDate.get(format(date, 'yyyy-MM-dd')) ?? [],
  }));
}

export function buildDayEvents(
  referenceDate: Date,
  events: CalendarEvent[],
): CalendarEvent[] {
  return events.filter((e) => isSameDay(new Date(e.start), referenceDate));
}

export function buildAgendaEvents(
  events: CalendarEvent[],
  days = 14,
): CalendarEvent[] {
  const now = new Date();
  const end = addDays(now, days);
  return events
    .filter((e) => {
      const d = new Date(e.start);
      return d >= now && d <= end;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function appointmentsToEvents(
  appointments: Appointment[],
): CalendarEvent[] {
  return mapAppointmentsToCalendarEvents(appointments);
}

export function getCalendarLabel(
  mode: CalendarViewMode,
  referenceDate: Date,
): string {
  if (mode === 'month') return format(referenceDate, 'MMMM yyyy');
  if (mode === 'week') {
    const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
    const end = endOfWeek(referenceDate, { weekStartsOn: 1 });
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }
  return format(referenceDate, 'EEEE, MMMM d, yyyy');
}

/** Holiday / blocked schedule placeholders for future Google/Outlook sync. */
export const BLOCKED_HOLIDAYS = [
  { date: '2026-12-25', label: 'Christmas Day' },
  { date: '2026-01-01', label: "New Year's Day" },
  { date: '2026-07-14', label: 'Bastille Day' },
];
