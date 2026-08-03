import { Injectable } from '@nestjs/common';

import type {
  ApproveResultInput,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabDiagnosticReport,
  LabOrder,
  LabOrderFilters,
  LabOrderListResult,
  LabResultDetail,
  LabResultFilters,
  LabResultListResult,
  LabTestDefinition,
  LaboratoryRepositoryContract,
  ReleaseResultInput,
  SpecimenRecord,
  UploadResultInput,
  VerifyResultInput,
} from '@medease/laboratory-contract';
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
  assertLabOrderFound,
  assertLabReportFound,
  mapLaboratoryRepositoryError,
  toContractPaginated,
} from './laboratory.helpers';
import {
  getCatalogTest,
  getLabCatalog,
  mapLabOrder,
  mapObservation,
  mapReport,
  mapSpecimen,
  resolveTestNames,
} from './mappers/laboratory.mapper';
import {
  buildLabOrderWhere,
  buildLabResultWhere,
} from './queries/laboratory.queries';

@Injectable()
export class LaboratoryRepository
  extends TenantAwareRepository
  implements LaboratoryRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  searchOrders(filters: LabOrderFilters = {}): Promise<LabOrderListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildLabOrderWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.labOrder.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.labOrder.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapLabOrder), total, page, pageSize),
      );
    });
  }

  getAllOrders(filters: LabOrderFilters = {}): Promise<LabOrder[]> {
    const where = buildLabOrderWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.labOrder.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
      });
      return items.map(mapLabOrder);
    });
  }

  async getOrder(id: string): Promise<LabOrder> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.labOrder.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertLabOrderFound(row, id);
      return mapLabOrder(row);
    });
  }

  async createOrder(input: CreateLabOrderInput): Promise<LabOrder> {
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
          throw new ValidationError('Patient not found for lab order', {
            details: { patientId: input.patientId },
          });
        }
        if (!input.testIds?.length) {
          throw new ValidationError('At least one test is required');
        }

        const count = await tx.labOrder.count({
          where: { tenantId: this.tenantId },
        });
        const orderNumber = `LAB-${String(count + 1).padStart(6, '0')}`;

        const row = await tx.labOrder.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            orderNumber,
            patientId: patient.id,
            patientName: input.patientName ?? patient.fullName,
            orderingPhysician: input.orderingPhysician,
            orderingPhysicianId: input.orderingPhysicianId,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            department: input.department,
            laboratoryId: input.laboratoryId,
            laboratoryName: input.laboratoryName,
            priority: input.priority ?? 'routine',
            status: 'pending',
            collectionMethod: input.collectionMethod ?? 'in_clinic',
            clinicalIndication: input.clinicalIndication,
            diagnosis: input.diagnosis,
            carePlanId: input.carePlanId,
            appointmentId: input.appointmentId,
            testIds: input.testIds,
            testNames: resolveTestNames(input.testIds),
            notes: input.notes,
            isRecurring: input.isRecurring ?? false,
            isStanding: input.isStanding ?? false,
            scheduledAt: input.scheduledAt
              ? new Date(input.scheduledAt)
              : undefined,
            createdBy: this.actorId(),
          },
        });
        return mapLabOrder(row);
      });
    } catch (error) {
      mapLaboratoryRepositoryError(error);
    }
  }

  async cancelOrder(input: CancelLabOrderInput): Promise<LabOrder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.labOrder.findFirst({
          where: { id: input.orderId, tenantId: this.tenantId },
        });
        assertLabOrderFound(existing, input.orderId);
        if (
          existing.status === 'completed' ||
          existing.status === 'cancelled'
        ) {
          throw new ValidationError('Lab order cannot be cancelled', {
            details: { status: existing.status },
          });
        }
        const row = await tx.labOrder.update({
          where: { id: input.orderId },
          data: {
            status: 'cancelled',
            notes: input.reason ?? existing.notes,
            updatedBy: this.actorId(),
          },
        });
        return mapLabOrder(row);
      });
    } catch (error) {
      mapLaboratoryRepositoryError(error);
    }
  }

  async collectSpecimen(
    input: CollectSpecimenInput,
  ): Promise<SpecimenRecord> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const order = await tx.labOrder.findFirst({
          where: { id: input.orderId, tenantId: this.tenantId },
        });
        assertLabOrderFound(order, input.orderId);
        if (order.status === 'cancelled' || order.status === 'completed') {
          throw new ValidationError('Cannot collect specimen for this order', {
            details: { status: order.status },
          });
        }

        const now = new Date();
        const specimenId = newId();
        const event = {
          id: newId(),
          timestamp: now.toISOString(),
          status: 'collected',
          actor: input.collectedBy,
          notes: input.temperature
            ? `Temperature ${input.temperature}`
            : undefined,
        };

        const specimen = await tx.labSpecimen.create({
          data: {
            id: specimenId,
            tenantId: this.tenantId,
            orderId: order.id,
            patientId: order.patientId,
            barcode: `BC-${order.orderNumber}`,
            qrCode: `QR-${order.orderNumber}`,
            specimenType: 'Blood',
            status: 'collected',
            collectedBy: input.collectedBy,
            collectedAt: now,
            temperature: input.temperature,
            chainOfCustody: [event],
          },
        });

        await tx.labOrder.update({
          where: { id: order.id },
          data: {
            status: 'collected',
            collectedAt: now,
            updatedBy: this.actorId(),
          },
        });

        return mapSpecimen(specimen);
      });
    } catch (error) {
      mapLaboratoryRepositoryError(error);
    }
  }

  searchResults(filters: LabResultFilters = {}): Promise<LabResultListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildLabResultWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.labDiagnosticReport.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
          include: { observations: { select: { id: true } } },
        }),
        tx.labDiagnosticReport.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(
          items.map((row) =>
            mapReport(
              row,
              row.observations.map((o) => o.id),
            ),
          ),
          total,
          page,
          pageSize,
        ),
      );
    });
  }

  getAllResults(
    filters: LabResultFilters = {},
  ): Promise<LabDiagnosticReport[]> {
    const where = buildLabResultWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.labDiagnosticReport.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        include: { observations: { select: { id: true } } },
      });
      return items.map((row) =>
        mapReport(
          row,
          row.observations.map((o) => o.id),
        ),
      );
    });
  }

  async getResult(id: string): Promise<LabResultDetail> {
    return this.prisma.runInTransaction(async (tx) => {
      const report = await tx.labDiagnosticReport.findFirst({
        where: { id, tenantId: this.tenantId },
        include: { observations: true },
      });
      assertLabReportFound(report, id);
      return {
        report: mapReport(
          report,
          report.observations.map((o) => o.id),
        ),
        observations: report.observations.map(mapObservation),
      };
    });
  }

  getPendingResults(patientId?: string): Promise<LabDiagnosticReport[]> {
    return this.getAllResults({
      patientId,
      status: 'processing',
    });
  }

  async uploadResult(input: UploadResultInput): Promise<LabResultDetail> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const order = await tx.labOrder.findFirst({
          where: { id: input.orderId, tenantId: this.tenantId },
        });
        assertLabOrderFound(order, input.orderId);

        const count = await tx.labDiagnosticReport.count({
          where: { tenantId: this.tenantId },
        });
        const reportNumber = `RPT-${String(count + 1).padStart(6, '0')}`;
        const reportId = newId();
        const now = new Date();

        const report = await tx.labDiagnosticReport.create({
          data: {
            id: reportId,
            tenantId: this.tenantId,
            orderId: order.id,
            patientId: order.patientId,
            patientName: order.patientName,
            reportNumber,
            status: 'processing',
            category: input.category,
            title: input.title,
            summary: input.summary,
            technologistId: input.technologistId,
            technologistName: input.technologistName,
            comments: input.comments,
            createdBy: this.actorId(),
          },
        });

        const observations = [];
        for (const obs of input.observations) {
          const catalog = getCatalogTest(obs.testId);
          const created = await tx.labObservation.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              reportId,
              orderId: order.id,
              patientId: order.patientId,
              testId: obs.testId,
              testName: catalog?.name ?? obs.testId,
              loincCode: catalog?.loincCode ?? '',
              category: catalog?.category ?? input.category,
              value: obs.value,
              numericValue: obs.numericValue,
              unit: catalog?.units ?? '',
              referenceRange: catalog?.referenceRange ?? '',
              flag: 'normal',
              interpretation: obs.interpretation,
              collectedAt: order.collectedAt ?? now,
              resultedAt: now,
            },
          });
          observations.push(created);
        }

        await tx.labOrder.update({
          where: { id: order.id },
          data: {
            status: 'in_progress',
            updatedBy: this.actorId(),
          },
        });

        return {
          report: mapReport(
            report,
            observations.map((o) => o.id),
          ),
          observations: observations.map(mapObservation),
        };
      });
    } catch (error) {
      mapLaboratoryRepositoryError(error);
    }
  }

  async verifyResult(input: VerifyResultInput): Promise<LabDiagnosticReport> {
    return this.updateReportStatus(input.reportId, {
      status: 'verified',
      verifiedBy: input.verifiedBy,
      comments: input.comments,
    });
  }

  async approveResult(input: ApproveResultInput): Promise<LabDiagnosticReport> {
    return this.updateReportStatus(input.reportId, {
      status: 'released',
      approvedBy: input.approvedBy,
      digitalSignature: input.digitalSignature,
      comments: input.comments,
      releasedAt: new Date(),
    });
  }

  async releaseResult(input: ReleaseResultInput): Promise<LabDiagnosticReport> {
    return this.updateReportStatus(input.reportId, {
      status: 'released',
      comments: input.comments,
      releasedAt: new Date(),
    });
  }

  getSpecimens(
    orderId?: string,
    patientId?: string,
  ): Promise<SpecimenRecord[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.labSpecimen.findMany({
        where: {
          tenantId: this.tenantId,
          ...(orderId ? { orderId } : {}),
          ...(patientId ? { patientId } : {}),
        },
        orderBy: [{ createdAt: 'desc' }],
      });
      return items.map(mapSpecimen);
    });
  }

  getCatalog(): Promise<LabTestDefinition[]> {
    return Promise.resolve(getLabCatalog());
  }

  private async updateReportStatus(
    reportId: string,
    data: {
      status: 'verified' | 'released';
      verifiedBy?: string;
      approvedBy?: string;
      digitalSignature?: string;
      comments?: string;
      releasedAt?: Date;
    },
  ): Promise<LabDiagnosticReport> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.labDiagnosticReport.findFirst({
          where: { id: reportId, tenantId: this.tenantId },
          include: { observations: { select: { id: true } } },
        });
        assertLabReportFound(existing, reportId);

        const row = await tx.labDiagnosticReport.update({
          where: { id: reportId },
          data: {
            status: data.status,
            verifiedBy: data.verifiedBy ?? existing.verifiedBy,
            approvedBy: data.approvedBy ?? existing.approvedBy,
            digitalSignature:
              data.digitalSignature ?? existing.digitalSignature,
            comments: data.comments ?? existing.comments,
            releasedAt: data.releasedAt ?? existing.releasedAt,
            updatedBy: this.actorId(),
          },
          include: { observations: { select: { id: true } } },
        });

        if (data.status === 'released') {
          await tx.labOrder.update({
            where: { id: row.orderId },
            data: {
              status: 'completed',
              updatedBy: this.actorId(),
            },
          });
        }

        return mapReport(
          row,
          row.observations.map((o) => o.id),
        );
      });
    } catch (error) {
      mapLaboratoryRepositoryError(error);
    }
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
