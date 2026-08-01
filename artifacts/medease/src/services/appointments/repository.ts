import {
  getAppointmentsControllerBookUrl,
  getAppointmentsControllerCancelUrl,
  getAppointmentsControllerCheckInUrl,
  getAppointmentsControllerGetAllUrl,
  getAppointmentsControllerGetByIdUrl,
  getAppointmentsControllerGetPastUrl,
  getAppointmentsControllerGetQueueUrl,
  getAppointmentsControllerGetTelemedicineUrl,
  getAppointmentsControllerGetTodayUrl,
  getAppointmentsControllerGetUpcomingUrl,
  getAppointmentsControllerGetWaitlistUrl,
  getAppointmentsControllerRescheduleUrl,
  getAppointmentsControllerSearchUrl,
} from '@workspace/api-client-react';
import { httpTransport } from '@workspace/repository-transport';
import type {
  AppointmentFilters,
  BookAppointmentInput,
  CancelAppointmentInput,
  RescheduleAppointmentInput,
} from '@medease/appointments-contract';

import {
  filtersToQuery,
  mapAppointmentArrayDto,
  mapAppointmentDto,
  mapPaginatedAppointmentsDto,
  mapQueueArrayDto,
  mapWaitlistArrayDto,
} from '@/services/appointments/dto-mappers';

class AppointmentsRepository {
  private readonly transport = httpTransport;

  async search(filters?: AppointmentFilters) {
    const dto = await this.transport.get(getAppointmentsControllerSearchUrl(), {
      query: filtersToQuery(filters),
    });
    return mapPaginatedAppointmentsDto(dto);
  }

  async getAll(filters?: AppointmentFilters) {
    const dto = await this.transport.get(getAppointmentsControllerGetAllUrl(), {
      query: filtersToQuery(filters),
    });
    return mapAppointmentArrayDto(dto);
  }

  async getById(id: string) {
    const dto = await this.transport.get(getAppointmentsControllerGetByIdUrl(id));
    return mapAppointmentDto(dto);
  }

  async getUpcoming(filters?: AppointmentFilters) {
    const dto = await this.transport.get(
      getAppointmentsControllerGetUpcomingUrl(),
      { query: filtersToQuery(filters) },
    );
    return mapAppointmentArrayDto(dto);
  }

  async getPast(filters?: AppointmentFilters) {
    const dto = await this.transport.get(getAppointmentsControllerGetPastUrl(), {
      query: filtersToQuery(filters),
    });
    return mapAppointmentArrayDto(dto);
  }

  async getToday(filters?: AppointmentFilters) {
    const dto = await this.transport.get(getAppointmentsControllerGetTodayUrl(), {
      query: filtersToQuery(filters),
    });
    return mapAppointmentArrayDto(dto);
  }

  async getTelemedicine(filters?: AppointmentFilters) {
    const dto = await this.transport.get(
      getAppointmentsControllerGetTelemedicineUrl(),
      { query: filtersToQuery(filters) },
    );
    return mapAppointmentArrayDto(dto);
  }

  async book(input: BookAppointmentInput) {
    const dto = await this.transport.post(getAppointmentsControllerBookUrl(), {
      body: input,
    });
    return mapAppointmentDto(dto);
  }

  async reschedule(appointmentId: string, input: RescheduleAppointmentInput) {
    const dto = await this.transport.post(
      getAppointmentsControllerRescheduleUrl(appointmentId),
      { body: input },
    );
    return mapAppointmentDto(dto);
  }

  async cancel(appointmentId: string, input?: CancelAppointmentInput) {
    const dto = await this.transport.post(
      getAppointmentsControllerCancelUrl(appointmentId),
      { body: input ?? {} },
    );
    return mapAppointmentDto(dto);
  }

  async checkIn(appointmentId: string) {
    const dto = await this.transport.post(
      getAppointmentsControllerCheckInUrl(appointmentId),
    );
    return mapAppointmentDto(dto);
  }

  async getWaitlist() {
    const dto = await this.transport.get(
      getAppointmentsControllerGetWaitlistUrl(),
    );
    return mapWaitlistArrayDto(dto);
  }

  async getQueue(filters?: AppointmentFilters) {
    const dto = await this.transport.get(getAppointmentsControllerGetQueueUrl(), {
      query: filtersToQuery(filters),
    });
    return mapQueueArrayDto(dto);
  }
}

export const appointmentRepository = new AppointmentsRepository();
