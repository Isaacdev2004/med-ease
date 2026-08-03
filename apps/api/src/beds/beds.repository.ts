import { Injectable } from '@nestjs/common';

import type {
  AssignBedInput,
  Bed,
  BedAssignment,
  BedBoardResult,
  BedBoardSummary,
  BedFilters,
  BedListResult,
  BedsRepositoryContract,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';
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
  assertBedFound,
  mapBedRepositoryError,
  toContractPaginated,
} from './beds.helpers';
import { mapBed, mapBedAssignment } from './mappers/bed.mapper';
import { buildBedListWhere } from './queries/bed.queries';

function emptySummary(facilityId?: string): BedBoardSummary {
  return {
    facilityId,
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    cleaning: 0,
    maintenance: 0,
    blocked: 0,
    occupancyPercent: 0,
  };
}

@Injectable()
export class BedsRepository
  extends TenantAwareRepository
  implements BedsRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  search(filters: BedFilters = {}): Promise<BedListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildBedListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.bed.findMany({
          where,
          skip,
          take,
          orderBy: [{ ward: 'asc' }, { label: 'asc' }],
        }),
        tx.bed.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapBed), total, page, pageSize),
      );
    });
  }

  getAll(filters: BedFilters = {}): Promise<Bed[]> {
    const where = buildBedListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.bed.findMany({
        where,
        orderBy: [{ ward: 'asc' }, { label: 'asc' }],
      });
      return items.map(mapBed);
    });
  }

  async getById(id: string): Promise<Bed> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.bed.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertBedFound(row, id);
      return mapBed(row);
    });
  }

  async getBoard(filters: BedFilters = {}): Promise<BedBoardResult> {
    const where = buildBedListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.bed.findMany({
        where,
        orderBy: [{ ward: 'asc' }, { label: 'asc' }],
      });
      const beds = items.map(mapBed);
      const summary = emptySummary(filters.facilityId);
      summary.total = beds.length;
      for (const bed of beds) {
        switch (bed.status) {
          case 'available':
            summary.available += 1;
            break;
          case 'occupied':
            summary.occupied += 1;
            break;
          case 'reserved':
            summary.reserved += 1;
            break;
          case 'cleaning':
            summary.cleaning += 1;
            break;
          case 'maintenance':
            summary.maintenance += 1;
            break;
          case 'blocked':
            summary.blocked += 1;
            break;
        }
      }
      summary.occupancyPercent =
        summary.total === 0
          ? 0
          : Math.round((summary.occupied / summary.total) * 1000) / 10;
      return { summary, beds };
    });
  }

  async create(input: CreateBedInput): Promise<Bed> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const row = await tx.bed.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            label: input.label,
            ward: input.ward,
            roomLabel: input.roomLabel,
            bedType: input.bedType ?? 'standard',
            status: 'available',
            notes: input.notes,
            createdBy: this.actorId(),
          },
        });
        return mapBed(row);
      });
    } catch (error) {
      mapBedRepositoryError(error);
    }
  }

  async assign(bedId: string, input: AssignBedInput): Promise<Bed> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const bed = await tx.bed.findFirst({
          where: { id: bedId, tenantId: this.tenantId },
        });
        assertBedFound(bed, bedId);

        if (bed.status === 'occupied') {
          throw new ValidationError('Bed is already occupied', {
            details: { bedId },
          });
        }
        if (bed.status === 'maintenance' || bed.status === 'blocked') {
          throw new ValidationError('Bed is not assignable in current status', {
            details: { bedId, status: bed.status },
          });
        }

        const patient = await tx.patient.findFirst({
          where: {
            id: input.patientId,
            tenantId: this.tenantId,
            deletedAt: null,
          },
        });
        if (!patient) {
          throw new ValidationError('Patient not found for bed assignment', {
            details: { patientId: input.patientId },
          });
        }

        const patientName = input.patientName ?? patient.fullName;
        const actorId = this.actorId();

        await tx.bedAssignment.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            bedId,
            patientId: patient.id,
            patientName,
            status: 'assigned',
            assignedBy: actorId,
            notes: input.notes,
          },
        });

        const row = await tx.bed.update({
          where: { id: bedId },
          data: {
            status: 'occupied',
            patientId: patient.id,
            patientName,
            reservedUntil: null,
            notes: input.notes ?? bed.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapBed(row);
      });
    } catch (error) {
      mapBedRepositoryError(error);
    }
  }

  async release(bedId: string, notes?: string): Promise<Bed> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const bed = await tx.bed.findFirst({
          where: { id: bedId, tenantId: this.tenantId },
        });
        assertBedFound(bed, bedId);

        const actorId = this.actorId();
        await tx.bedAssignment.updateMany({
          where: {
            bedId,
            tenantId: this.tenantId,
            status: 'assigned',
          },
          data: {
            status: 'released',
            releasedAt: new Date(),
            releasedBy: actorId,
            notes: notes ?? undefined,
          },
        });

        const row = await tx.bed.update({
          where: { id: bedId },
          data: {
            status: 'cleaning',
            patientId: null,
            patientName: null,
            reservedUntil: null,
            notes: notes ?? bed.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapBed(row);
      });
    } catch (error) {
      mapBedRepositoryError(error);
    }
  }

  async reserve(bedId: string, input: ReserveBedInput = {}): Promise<Bed> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const bed = await tx.bed.findFirst({
          where: { id: bedId, tenantId: this.tenantId },
        });
        assertBedFound(bed, bedId);

        if (bed.status === 'occupied') {
          throw new ValidationError('Cannot reserve an occupied bed', {
            details: { bedId },
          });
        }

        const reservedUntil = input.reservedUntil
          ? new Date(input.reservedUntil)
          : undefined;
        if (reservedUntil && Number.isNaN(reservedUntil.getTime())) {
          throw new ValidationError('Invalid reservedUntil value');
        }

        const row = await tx.bed.update({
          where: { id: bedId },
          data: {
            status: 'reserved',
            reservedUntil: reservedUntil ?? null,
            notes: input.notes ?? bed.notes,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapBed(row);
      });
    } catch (error) {
      mapBedRepositoryError(error);
    }
  }

  async updateStatus(
    bedId: string,
    input: UpdateBedStatusInput,
  ): Promise<Bed> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const bed = await tx.bed.findFirst({
          where: { id: bedId, tenantId: this.tenantId },
        });
        assertBedFound(bed, bedId);

        if (input.status === 'available' && bed.patientId) {
          throw new ValidationError(
            'Release the patient before marking the bed available',
            { details: { bedId } },
          );
        }

        const row = await tx.bed.update({
          where: { id: bedId },
          data: {
            status: input.status,
            patientId:
              input.status === 'available' || input.status === 'cleaning'
                ? null
                : bed.patientId,
            patientName:
              input.status === 'available' || input.status === 'cleaning'
                ? null
                : bed.patientName,
            reservedUntil:
              input.status === 'reserved' ? bed.reservedUntil : null,
            notes: input.notes ?? bed.notes,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapBed(row);
      });
    } catch (error) {
      mapBedRepositoryError(error);
    }
  }

  getAssignments(bedId: string): Promise<BedAssignment[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const bed = await tx.bed.findFirst({
        where: { id: bedId, tenantId: this.tenantId },
        select: { id: true },
      });
      assertBedFound(bed, bedId);

      const items = await tx.bedAssignment.findMany({
        where: { bedId, tenantId: this.tenantId },
        orderBy: { assignedAt: 'desc' },
      });
      return items.map(mapBedAssignment);
    });
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
