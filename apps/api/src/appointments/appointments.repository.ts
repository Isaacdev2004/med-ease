import { Injectable } from '@nestjs/common';

import type {
  Appointment,
  AppointmentFilters,
  AppointmentListResult,
  AppointmentsRepositoryContract,
  BookAppointmentInput,
  CancelAppointmentInput,
  QueueEntry,
  RescheduleAppointmentInput,
  WaitlistEntry,
} from '@medease/appointments-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { ValidationError } from '@workspace/repository-transport/errors';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertAppointmentFound,
  estimateWaitMinutes,
  mapAppointmentRepositoryError,
  toContractPaginated,
} from './appointments.helpers';
import { mapAppointment } from './mappers/appointment.mapper';
import {
  buildAppointmentListWhere,
  buildPastWhere,
  buildTelemedicineWhere,
  buildTodayWhere,
  buildUpcomingWhere,
} from './queries/appointment.queries';

@Injectable()
export class AppointmentsRepository
  extends TenantAwareRepository
  implements AppointmentsRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  search(filters: AppointmentFilters = {}): Promise<AppointmentListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildAppointmentListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.appointment.findMany({
          where,
          skip,
          take,
          orderBy: { scheduledAt: 'desc' },
        }),
        tx.appointment.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapAppointment), total, page, pageSize),
      );
    });
  }

  getAll(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const where = buildAppointmentListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
      });
      return items.map(mapAppointment);
    });
  }

  async getById(id: string): Promise<Appointment> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.appointment.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertAppointmentFound(row, id);
      return mapAppointment(row);
    });
  }

  getUpcoming(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const where = buildUpcomingWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
      });
      return items.map(mapAppointment);
    });
  }

  getPast(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const where = buildPastWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
      });
      return items.map(mapAppointment);
    });
  }

  getToday(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const where = buildTodayWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
      });
      return items.map(mapAppointment);
    });
  }

  getTelemedicine(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const where = buildTelemedicineWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
      });
      return items.map(mapAppointment);
    });
  }

  async book(input: BookAppointmentInput): Promise<Appointment> {
    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new ValidationError('Invalid scheduledAt value');
    }

    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const patient = await tx.patient.findFirst({
          where: {
            id: input.patientId,
            tenantId: this.tenantId,
            deletedAt: null,
          },
        });

        if (!patient) {
          throw new ValidationError('Patient not found for appointment booking', {
            details: { patientId: input.patientId },
          });
        }

        const appointmentId = newId();
        const row = await tx.appointment.create({
          data: {
            id: appointmentId,
            tenantId: this.tenantId,
            facilityId: input.facilityId,
            patientId: input.patientId,
            providerId: input.providerId,
            scheduledAt,
            durationMinutes: input.durationMinutes ?? 30,
            status: 'scheduled',
            visitType: input.visitType,
            notes: input.notes,
            fhirResourceId: appointmentId,
            specialty: input.specialty,
            department: input.department ?? input.serviceType,
            room: input.room,
            reason: input.reason,
            insurance: input.insurance,
            priority: input.priority ?? 'routine',
            checkInStatus: 'not_checked_in',
            patientFullName: patient.fullName,
            patientMrn: patient.mrn,
            providerFullName: input.providerFullName ?? 'Provider',
            providerSpecialty: input.specialty,
            providerDepartment: input.providerDepartment ?? input.department,
            facilityName: input.facilityName ?? 'Facility',
            facilityAddress: input.facilityAddress,
            createdBy: this.actorId(),
          },
        });

        return mapAppointment(row);
      });
    } catch (error) {
      mapAppointmentRepositoryError(error);
    }
  }

  async reschedule(
    appointmentId: string,
    input: RescheduleAppointmentInput,
  ): Promise<Appointment> {
    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new ValidationError('Invalid scheduledAt value');
    }

    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.appointment.findFirst({
          where: { id: appointmentId, tenantId: this.tenantId },
        });
        assertAppointmentFound(existing, appointmentId);

        const row = await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            scheduledAt,
            status: 'scheduled',
            notes: input.reason
              ? [existing.notes, input.reason].filter(Boolean).join('\n')
              : existing.notes,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapAppointment(row);
      });
    } catch (error) {
      mapAppointmentRepositoryError(error);
    }
  }

  async cancel(
    appointmentId: string,
    input: CancelAppointmentInput = {},
  ): Promise<Appointment> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.appointment.findFirst({
          where: { id: appointmentId, tenantId: this.tenantId },
        });
        assertAppointmentFound(existing, appointmentId);

        const row = await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            status: 'cancelled',
            notes: input.reason
              ? [existing.notes, input.reason].filter(Boolean).join('\n')
              : existing.notes,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapAppointment(row);
      });
    } catch (error) {
      mapAppointmentRepositoryError(error);
    }
  }

  async checkIn(appointmentId: string): Promise<Appointment> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.appointment.findFirst({
          where: { id: appointmentId, tenantId: this.tenantId },
        });
        assertAppointmentFound(existing, appointmentId);

        const todayWhere = buildTodayWhere(this.tenantId);
        const queueCount = await tx.appointment.count({
          where: {
            ...todayWhere,
            checkInStatus: { not: 'not_checked_in' },
          },
        });

        const row = await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            status: 'checked_in',
            checkInStatus: 'checked_in',
            queuePosition: queueCount + 1,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapAppointment(row);
      });
    } catch (error) {
      mapAppointmentRepositoryError(error);
    }
  }

  getWaitlist(): Promise<WaitlistEntry[]> {
    return Promise.resolve([]);
  }

  async getQueue(filters: AppointmentFilters = {}): Promise<QueueEntry[]> {
    const where = buildTodayWhere(this.tenantId, filters);
    where.checkInStatus = { not: 'not_checked_in' };

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.appointment.findMany({
        where,
        orderBy: [{ queuePosition: 'asc' }, { updatedAt: 'asc' }],
      });

      return items.map((row) => ({
        id: row.id,
        appointmentId: row.id,
        patientName: row.patientFullName,
        providerName: row.providerFullName,
        position: row.queuePosition ?? 0,
        estimatedWaitMinutes: estimateWaitMinutes(row.queuePosition ?? 1),
        checkInStatus: row.checkInStatus as QueueEntry['checkInStatus'],
        checkedInAt:
          row.checkInStatus !== 'not_checked_in'
            ? row.updatedAt.toISOString()
            : undefined,
      }));
    });
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
