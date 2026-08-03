import { Injectable } from '@nestjs/common';

import type {
  Admission,
  AdmissionBoardResult,
  AdmissionBoardSummary,
  AdmissionFilters,
  AdmissionListResult,
  AdmissionsRepositoryContract,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  PatientTransfer,
  TransferFilters,
  TransferListResult,
  TriageAdmissionInput,
} from '@medease/admissions-contract';
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
  assertAdmissionFound,
  assertTransferFound,
  mapAdmissionRepositoryError,
  toContractPaginated,
} from './admissions.helpers';
import { mapAdmission, mapTransfer } from './mappers/admission.mapper';
import {
  buildAdmissionListWhere,
  buildTransferListWhere,
} from './queries/admission.queries';

function emptyAdmissionSummary(facilityId?: string): AdmissionBoardSummary {
  return {
    facilityId,
    total: 0,
    pending: 0,
    admitted: 0,
    discharged: 0,
    cancelled: 0,
    urgent: 0,
  };
}

@Injectable()
export class AdmissionsRepository
  extends TenantAwareRepository
  implements AdmissionsRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  search(filters: AdmissionFilters = {}): Promise<AdmissionListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildAdmissionListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.admission.findMany({
          where,
          skip,
          take,
          orderBy: [{ requestedAt: 'desc' }],
        }),
        tx.admission.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapAdmission), total, page, pageSize),
      );
    });
  }

  getAll(filters: AdmissionFilters = {}): Promise<Admission[]> {
    const where = buildAdmissionListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.admission.findMany({
        where,
        orderBy: [{ requestedAt: 'desc' }],
      });
      return items.map(mapAdmission);
    });
  }

  async getById(id: string): Promise<Admission> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.admission.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertAdmissionFound(row, id);
      return mapAdmission(row);
    });
  }

  async getBoard(filters: AdmissionFilters = {}): Promise<AdmissionBoardResult> {
    const where = buildAdmissionListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.admission.findMany({
        where,
        orderBy: [{ requestedAt: 'desc' }],
      });
      const admissions = items.map(mapAdmission);
      const summary = emptyAdmissionSummary(filters.facilityId);
      summary.total = admissions.length;
      for (const admission of admissions) {
        if (
          admission.status === 'requested' ||
          admission.status === 'triaged' ||
          admission.status === 'bed_assigned'
        ) {
          summary.pending += 1;
        } else if (admission.status === 'admitted') {
          summary.admitted += 1;
        } else if (admission.status === 'discharged') {
          summary.discharged += 1;
        } else if (admission.status === 'cancelled') {
          summary.cancelled += 1;
        }
        if (
          admission.priority === 'urgent' ||
          admission.priority === 'emergency'
        ) {
          summary.urgent += 1;
        }
      }
      return { summary, admissions };
    });
  }

  async create(input: CreateAdmissionInput): Promise<Admission> {
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
          throw new ValidationError('Patient not found for admission', {
            details: { patientId: input.patientId },
          });
        }

        const row = await tx.admission.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            patientId: patient.id,
            patientName: patient.fullName,
            patientMrn: patient.mrn,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            ward: input.ward,
            status: 'requested',
            priority: input.priority ?? 'routine',
            reason: input.reason,
            notes: input.notes,
            createdBy: this.actorId(),
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async triage(
    id: string,
    input: TriageAdmissionInput = {},
  ): Promise<Admission> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.admission.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAdmissionFound(existing, id);

        if (
          existing.status === 'admitted' ||
          existing.status === 'cancelled' ||
          existing.status === 'discharged'
        ) {
          throw new ValidationError('Admission cannot be triaged', {
            details: { id, status: existing.status },
          });
        }

        const row = await tx.admission.update({
          where: { id },
          data: {
            status: 'triaged',
            priority: input.priority ?? existing.priority,
            ward: input.ward ?? existing.ward,
            notes: input.notes ?? existing.notes,
            triagedAt: new Date(),
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async assignBed(
    id: string,
    input: AssignAdmissionBedInput,
  ): Promise<Admission> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.admission.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAdmissionFound(existing, id);

        if (
          existing.status === 'cancelled' ||
          existing.status === 'discharged'
        ) {
          throw new ValidationError('Admission is closed', {
            details: { id, status: existing.status },
          });
        }

        const bed = await tx.bed.findFirst({
          where: { id: input.bedId, tenantId: this.tenantId },
        });
        if (!bed) {
          throw new ValidationError('Bed not found', {
            details: { bedId: input.bedId },
          });
        }
        if (bed.status === 'occupied' || bed.status === 'blocked') {
          throw new ValidationError('Bed is not available for assignment', {
            details: { bedId: input.bedId, status: bed.status },
          });
        }

        const actorId = this.actorId();

        await tx.bed.update({
          where: { id: bed.id },
          data: {
            status: 'reserved',
            patientId: existing.patientId,
            patientName: existing.patientName,
            notes: input.notes ?? bed.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        const row = await tx.admission.update({
          where: { id },
          data: {
            status: 'bed_assigned',
            bedId: bed.id,
            bedLabel: bed.label,
            ward: bed.ward,
            notes: input.notes ?? existing.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async admit(id: string, notes?: string): Promise<Admission> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.admission.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAdmissionFound(existing, id);

        if (!existing.bedId) {
          throw new ValidationError('Assign a bed before admitting', {
            details: { id },
          });
        }
        if (existing.status === 'admitted') {
          return mapAdmission(existing);
        }
        if (
          existing.status === 'cancelled' ||
          existing.status === 'discharged'
        ) {
          throw new ValidationError('Admission is closed', {
            details: { id, status: existing.status },
          });
        }

        const actorId = this.actorId();
        const now = new Date();

        await tx.bed.update({
          where: { id: existing.bedId },
          data: {
            status: 'occupied',
            patientId: existing.patientId,
            patientName: existing.patientName,
            reservedUntil: null,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        await tx.bedAssignment.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            bedId: existing.bedId,
            patientId: existing.patientId,
            patientName: existing.patientName,
            status: 'assigned',
            assignedBy: actorId,
            notes: notes ?? existing.notes,
          },
        });

        const row = await tx.admission.update({
          where: { id },
          data: {
            status: 'admitted',
            admittedAt: now,
            notes: notes ?? existing.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async cancel(id: string, notes?: string): Promise<Admission> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.admission.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAdmissionFound(existing, id);

        if (existing.status === 'admitted') {
          throw new ValidationError('Discharge instead of cancelling', {
            details: { id },
          });
        }

        const actorId = this.actorId();
        if (existing.bedId) {
          await tx.bed.updateMany({
            where: {
              id: existing.bedId,
              tenantId: this.tenantId,
              patientId: existing.patientId,
            },
            data: {
              status: 'available',
              patientId: null,
              patientName: null,
              reservedUntil: null,
              updatedBy: actorId,
            },
          });
        }

        const row = await tx.admission.update({
          where: { id },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
            bedId: null,
            bedLabel: null,
            notes: notes ?? existing.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async discharge(id: string, notes?: string): Promise<Admission> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.admission.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAdmissionFound(existing, id);

        if (existing.status !== 'admitted') {
          throw new ValidationError('Only admitted patients can be discharged', {
            details: { id, status: existing.status },
          });
        }

        const actorId = this.actorId();
        if (existing.bedId) {
          await tx.bedAssignment.updateMany({
            where: {
              bedId: existing.bedId,
              tenantId: this.tenantId,
              patientId: existing.patientId,
              status: 'assigned',
            },
            data: {
              status: 'released',
              releasedAt: new Date(),
              releasedBy: actorId,
            },
          });

          await tx.bed.update({
            where: { id: existing.bedId },
            data: {
              status: 'cleaning',
              patientId: null,
              patientName: null,
              updatedBy: actorId,
              version: { increment: 1 },
            },
          });
        }

        const row = await tx.admission.update({
          where: { id },
          data: {
            status: 'discharged',
            dischargedAt: new Date(),
            notes: notes ?? existing.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapAdmission(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  searchTransfers(
    filters: TransferFilters = {},
  ): Promise<TransferListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildTransferListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.patientTransfer.findMany({
          where,
          skip,
          take,
          orderBy: [{ requestedAt: 'desc' }],
        }),
        tx.patientTransfer.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapTransfer), total, page, pageSize),
      );
    });
  }

  getAllTransfers(filters: TransferFilters = {}): Promise<PatientTransfer[]> {
    const where = buildTransferListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.patientTransfer.findMany({
        where,
        orderBy: [{ requestedAt: 'desc' }],
      });
      return items.map(mapTransfer);
    });
  }

  async getTransfer(id: string): Promise<PatientTransfer> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.patientTransfer.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertTransferFound(row, id);
      return mapTransfer(row);
    });
  }

  async createTransfer(input: CreateTransferInput): Promise<PatientTransfer> {
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
          throw new ValidationError('Patient not found for transfer', {
            details: { patientId: input.patientId },
          });
        }

        if (input.admissionId) {
          const admission = await tx.admission.findFirst({
            where: {
              id: input.admissionId,
              tenantId: this.tenantId,
              patientId: patient.id,
            },
          });
          if (!admission) {
            throw new ValidationError('Admission not found for transfer', {
              details: { admissionId: input.admissionId },
            });
          }
        }

        let toBedLabel = undefined as string | undefined;
        if (input.toBedId) {
          const bed = await tx.bed.findFirst({
            where: { id: input.toBedId, tenantId: this.tenantId },
          });
          if (!bed) {
            throw new ValidationError('Destination bed not found', {
              details: { toBedId: input.toBedId },
            });
          }
          toBedLabel = bed.label;
        }

        const row = await tx.patientTransfer.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            admissionId: input.admissionId,
            patientId: patient.id,
            patientName: patient.fullName,
            fromFacilityId: input.fromFacilityId,
            fromFacilityName: input.fromFacilityName,
            fromWard: input.fromWard,
            fromBedId: input.fromBedId,
            toFacilityId: input.toFacilityId,
            toFacilityName: input.toFacilityName,
            toWard: input.toWard,
            toBedId: input.toBedId,
            toBedLabel,
            status: 'requested',
            reason: input.reason,
            notes: input.notes,
            createdBy: this.actorId(),
          },
        });

        return mapTransfer(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  async approveTransfer(id: string, notes?: string): Promise<PatientTransfer> {
    return this.updateTransferStatus(id, 'approved', { notes });
  }

  async startTransfer(id: string, notes?: string): Promise<PatientTransfer> {
    return this.updateTransferStatus(id, 'in_transit', { notes });
  }

  async cancelTransfer(id: string, notes?: string): Promise<PatientTransfer> {
    return this.updateTransferStatus(id, 'cancelled', { notes });
  }

  async completeTransfer(
    id: string,
    input: CompleteTransferInput = {},
  ): Promise<PatientTransfer> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patientTransfer.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertTransferFound(existing, id);

        if (
          existing.status === 'completed' ||
          existing.status === 'cancelled'
        ) {
          throw new ValidationError('Transfer is already closed', {
            details: { id, status: existing.status },
          });
        }

        const actorId = this.actorId();
        const now = new Date();
        const toBedId = input.toBedId ?? existing.toBedId;

        if (existing.fromBedId) {
          await tx.bedAssignment.updateMany({
            where: {
              bedId: existing.fromBedId,
              tenantId: this.tenantId,
              patientId: existing.patientId,
              status: 'assigned',
            },
            data: {
              status: 'transferred',
              releasedAt: now,
              releasedBy: actorId,
            },
          });

          await tx.bed.update({
            where: { id: existing.fromBedId },
            data: {
              status: 'cleaning',
              patientId: null,
              patientName: null,
              updatedBy: actorId,
              version: { increment: 1 },
            },
          });
        }

        let toBedLabel = existing.toBedLabel;
        if (toBedId) {
          const bed = await tx.bed.findFirst({
            where: { id: toBedId, tenantId: this.tenantId },
          });
          if (!bed) {
            throw new ValidationError('Destination bed not found', {
              details: { toBedId },
            });
          }
          if (bed.status === 'occupied') {
            throw new ValidationError('Destination bed is occupied', {
              details: { toBedId },
            });
          }

          toBedLabel = bed.label;
          await tx.bed.update({
            where: { id: bed.id },
            data: {
              status: 'occupied',
              patientId: existing.patientId,
              patientName: existing.patientName,
              reservedUntil: null,
              updatedBy: actorId,
              version: { increment: 1 },
            },
          });

          await tx.bedAssignment.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              bedId: bed.id,
              patientId: existing.patientId,
              patientName: existing.patientName,
              status: 'assigned',
              assignedBy: actorId,
              notes: input.notes,
            },
          });

          if (existing.admissionId) {
            await tx.admission.updateMany({
              where: {
                id: existing.admissionId,
                tenantId: this.tenantId,
              },
              data: {
                bedId: bed.id,
                bedLabel: bed.label,
                ward: existing.toWard,
                facilityId: existing.toFacilityId,
                facilityName: existing.toFacilityName,
                updatedBy: actorId,
              },
            });
          }
        }

        const row = await tx.patientTransfer.update({
          where: { id },
          data: {
            status: 'completed',
            toBedId: toBedId ?? null,
            toBedLabel: toBedLabel ?? null,
            completedAt: now,
            notes: input.notes ?? existing.notes,
            updatedBy: actorId,
            version: { increment: 1 },
          },
        });

        return mapTransfer(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  private async updateTransferStatus(
    id: string,
    status: 'approved' | 'in_transit' | 'cancelled',
    options: { notes?: string } = {},
  ): Promise<PatientTransfer> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patientTransfer.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertTransferFound(existing, id);

        if (
          existing.status === 'completed' ||
          existing.status === 'cancelled'
        ) {
          throw new ValidationError('Transfer is already closed', {
            details: { id, status: existing.status },
          });
        }

        const now = new Date();
        const row = await tx.patientTransfer.update({
          where: { id },
          data: {
            status,
            approvedAt:
              status === 'approved' ? now : existing.approvedAt,
            startedAt:
              status === 'in_transit' ? now : existing.startedAt,
            cancelledAt:
              status === 'cancelled' ? now : existing.cancelledAt,
            notes: options.notes ?? existing.notes,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapTransfer(row);
      });
    } catch (error) {
      mapAdmissionRepositoryError(error);
    }
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
