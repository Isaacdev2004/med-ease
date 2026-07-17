import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from 'date-fns';

import type { ScheduledDose } from '@/services/medications/types';

export interface CalendarDoseCell {
  date: Date;
  doses: ScheduledDose[];
}

export function buildMedicationCalendar(
  schedule: ScheduledDose[],
  referenceDate: Date,
): CalendarDoseCell[] {
  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);
  const days = eachDayOfInterval({ start, end });
  return days.map((date) => ({
    date,
    doses: schedule.filter((d) => isSameDay(new Date(d.scheduledAt), date)),
  }));
}

export function getTodayDoses(
  schedule: ScheduledDose[],
  patientId?: string,
): ScheduledDose[] {
  const today = new Date();
  return schedule
    .filter(
      (d) =>
        (!patientId || d.patientId === patientId) &&
        isSameDay(new Date(d.scheduledAt), today),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
}

export function getUpcomingDoses(
  schedule: ScheduledDose[],
  patientId?: string,
  days = 7,
): ScheduledDose[] {
  const now = new Date();
  const end = addDays(now, days);
  return schedule
    .filter((d) => {
      const t = new Date(d.scheduledAt);
      return (!patientId || d.patientId === patientId) && t >= now && t <= end;
    })
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
}

export function formatScheduleSlot(slot: ScheduledDose['slot']): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function calendarLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}
