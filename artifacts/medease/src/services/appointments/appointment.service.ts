import {
  getAllProviderAvailability,
  getAvailableSlots,
  getProviderAvailability,
} from '@/services/appointments/availability';
import {
  appointmentsToEvents,
  buildAgendaEvents,
  buildDayEvents,
  buildMonthGrid,
  buildWeekDays,
} from '@/services/appointments/calendar';
import { getPatientIdForUser } from '@/services/appointments/mock-data';
import { appointmentRepository } from '@/services/appointments/repository';
import { validateBookingSlot } from '@/services/appointments/scheduler';
import type {
  AppointmentAnalytics,
  AppointmentFilters,
  BookAppointmentInput,
  CalendarViewMode,
  CancelAppointmentInput,
  CheckInInput,
  RescheduleAppointmentInput,
} from '@/services/appointments/types';

const DELAY_MS = 250;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeAnalytics(
  appointments: ReturnType<typeof appointmentRepository.getAll>,
): AppointmentAnalytics {
  const today = appointmentRepository.getToday();
  const upcoming = appointmentRepository.getUpcoming();
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');
  const noShows = appointments.filter((a) => a.status === 'no_show');
  const telemedicine = appointments.filter(
    (a) => a.visitType === 'telemedicine',
  );
  const queue = appointmentRepository.getQueue();

  const dailyMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    dailyMap.set(key, 0);
  }
  for (const apt of appointments) {
    const key = new Date(apt.scheduledAt).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }

  const providerMap = new Map<string, number>();
  for (const apt of today) {
    providerMap.set(
      apt.provider.fullName,
      (providerMap.get(apt.provider.fullName) ?? 0) + 1,
    );
  }

  const facilityMap = new Map<string, number>();
  for (const apt of today) {
    facilityMap.set(
      apt.facility.name,
      (facilityMap.get(apt.facility.name) ?? 0) + 1,
    );
  }

  const total = appointments.length || 1;
  const booked = appointments.filter(
    (a) => !['cancelled', 'no_show'].includes(a.status),
  ).length;

  return {
    todayCount: today.length,
    upcomingCount: upcoming.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
    noShowCount: noShows.length,
    averageWaitMinutes: queue.length
      ? Math.round(
          queue.reduce((s, q) => s + q.estimatedWaitMinutes, 0) / queue.length,
        )
      : 0,
    utilizationPercent: Math.round((today.length / 40) * 100),
    bookingRatePercent: Math.round((booked / total) * 100),
    queueLength: queue.length,
    telemedicineCount: telemedicine.filter(
      (a) => new Date(a.scheduledAt) >= new Date(),
    ).length,
    dailyAppointments: [...dailyMap.entries()].map(([label, value]) => ({
      label,
      value,
    })),
    weeklyTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: Math.max(5, Math.floor(total / 70) + (i % 3) * 4),
      }),
    ),
    monthlyUtilization: ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(
      (label, i) => ({
        label,
        value: 65 + i * 5 + (today.length % 10),
      }),
    ),
    providerWorkload: [...providerMap.entries()]
      .slice(0, 6)
      .map(([label, value]) => ({ label, value })),
    facilityOccupancy: [...facilityMap.entries()].map(([label, value]) => ({
      label,
      value,
    })),
  };
}

export const appointmentService = {
  async resolvePatientId(
    userId: string,
    explicitId?: string,
  ): Promise<string | null> {
    await delay(50);
    if (explicitId) return explicitId;
    return getPatientIdForUser(userId);
  },

  async search(filters?: AppointmentFilters) {
    await delay();
    return appointmentRepository.search(filters);
  },

  async list(filters?: AppointmentFilters) {
    await delay();
    return appointmentRepository.getAll(filters);
  },

  async getById(id: string) {
    await delay(150);
    return appointmentRepository.getById(id);
  },

  async getUpcoming(filters?: AppointmentFilters) {
    await delay();
    return appointmentRepository.getUpcoming(filters);
  },

  async getPast(filters?: AppointmentFilters) {
    await delay();
    return appointmentRepository.getPast(filters);
  },

  async getToday(filters?: AppointmentFilters) {
    await delay(100);
    return appointmentRepository.getToday(filters);
  },

  async getCalendar(
    filters?: AppointmentFilters,
    referenceDate = new Date(),
    mode: CalendarViewMode = 'month',
  ) {
    await delay();
    const appointments = appointmentRepository.getAll(filters);
    const events = appointmentsToEvents(appointments);
    if (mode === 'month')
      return { events, grid: buildMonthGrid(referenceDate, events), mode };
    if (mode === 'week')
      return { events, grid: buildWeekDays(referenceDate, events), mode };
    if (mode === 'day')
      return { events, dayEvents: buildDayEvents(referenceDate, events), mode };
    if (mode === 'agenda')
      return { events, agenda: buildAgendaEvents(events), mode };
    return { events, mode };
  },

  async getProviderAvailability(
    providerId: string,
    facilityId: string,
    date: string,
  ) {
    await delay(150);
    return getProviderAvailability(providerId, facilityId, date);
  },

  async getFacilitySchedule(facilityId: string, date: string) {
    await delay();
    return getAllProviderAvailability(date, facilityId);
  },

  async getAvailableSlots(
    providerId: string,
    facilityId: string,
    date: string,
  ) {
    await delay(100);
    return getAvailableSlots(providerId, facilityId, date);
  },

  async book(input: BookAppointmentInput) {
    await delay(300);
    if (!validateBookingSlot(input)) {
      throw new Error('Selected time slot is no longer available');
    }
    return appointmentRepository.book(input);
  },

  async reschedule(input: RescheduleAppointmentInput) {
    await delay(250);
    return appointmentRepository.reschedule(
      input.appointmentId,
      input.scheduledAt,
    );
  },

  async cancel(input: CancelAppointmentInput) {
    await delay(250);
    return appointmentRepository.cancel(input.appointmentId);
  },

  async checkIn(input: CheckInInput) {
    await delay(200);
    return appointmentRepository.checkIn(input.appointmentId);
  },

  async getWaitlist() {
    await delay();
    return appointmentRepository.getWaitlist();
  },

  async getQueue(filters?: AppointmentFilters) {
    await delay(100);
    return appointmentRepository.getQueue(filters);
  },

  async getTelemedicine(filters?: AppointmentFilters) {
    await delay();
    return appointmentRepository.getTelemedicine(filters);
  },

  async getAnalytics(filters?: AppointmentFilters) {
    await delay();
    return computeAnalytics(appointmentRepository.getAll(filters));
  },
};
