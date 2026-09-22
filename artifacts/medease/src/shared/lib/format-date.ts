import { format, isValid, parseISO } from 'date-fns';

export function parseAppointmentDate(
  value: string | undefined | null,
): Date | null {
  if (!value || typeof value !== 'string') return null;

  const parsed = parseISO(value);
  if (isValid(parsed)) return parsed;

  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
}

export function safeFormatDate(
  value: string | undefined | null,
  pattern: string,
  fallback = '—',
): string {
  const date = parseAppointmentDate(value);
  if (!date) return fallback;

  try {
    return format(date, pattern);
  } catch {
    return fallback;
  }
}
