import { Injectable } from '@nestjs/common';

import type {
  AppointmentFilters,
  BookAppointmentInput,
  CancelAppointmentInput,
  RescheduleAppointmentInput,
} from '@medease/appointments-contract';

import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class AppointmentsService {
  constructor(private readonly repository: AppointmentsRepository) {}

  search(filters?: AppointmentFilters) {
    return this.repository.search(filters);
  }

  getAll(filters?: AppointmentFilters) {
    return this.repository.getAll(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getUpcoming(filters?: AppointmentFilters) {
    return this.repository.getUpcoming(filters);
  }

  getPast(filters?: AppointmentFilters) {
    return this.repository.getPast(filters);
  }

  getToday(filters?: AppointmentFilters) {
    return this.repository.getToday(filters);
  }

  getTelemedicine(filters?: AppointmentFilters) {
    return this.repository.getTelemedicine(filters);
  }

  book(input: BookAppointmentInput) {
    return this.repository.book(input);
  }

  reschedule(appointmentId: string, input: RescheduleAppointmentInput) {
    return this.repository.reschedule(appointmentId, input);
  }

  cancel(appointmentId: string, input?: CancelAppointmentInput) {
    return this.repository.cancel(appointmentId, input);
  }

  checkIn(appointmentId: string) {
    return this.repository.checkIn(appointmentId);
  }

  getWaitlist() {
    return this.repository.getWaitlist();
  }

  getQueue(filters?: AppointmentFilters) {
    return this.repository.getQueue(filters);
  }
}
