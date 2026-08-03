import { Injectable } from '@nestjs/common';

import type {
  ApproveReportInput,
  CancelRadiologyOrderInput,
  CompleteAcquisitionInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  DiagnosticReport,
  ImagingDevice,
  Radiologist,
  RadiologyOrder,
  RadiologyRepositoryContract,
  RadiologyStudy,
  ReportFilters,
  ReportListResult,
  StudyFilters,
  StudyListResult,
} from '@medease/radiology-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import type { Prisma } from '@medease/prisma';
import { ValidationError } from '@workspace/repository-transport/errors';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertOrderFound,
  assertReportFound,
  assertStudyFound,
  mapRadiologyRepositoryError,
  toContractPaginated,
} from './radiology.helpers';
import {
  getRadiologistsCatalog,
  mapDevice,
  mapOrder,
  mapReport,
  mapStudy,
} from './mappers/radiology.mapper';
import { buildReportWhere, buildStudyWhere } from './queries/radiology.queries';

@Injectable()
export class RadiologyRepository
  extends TenantAwareRepository
  implements RadiologyRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  searchStudies(filters: StudyFilters = {}): Promise<StudyListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildStudyWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.radiologyStudy.findMany({
          where,
          skip,
          take,
          orderBy: [{ studyDate: 'desc' }],
          include: { report: { select: { id: true } } },
        }),
        tx.radiologyStudy.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapStudy), total, page, pageSize),
      );
    });
  }

  getAllStudies(filters: StudyFilters = {}): Promise<RadiologyStudy[]> {
    const where = buildStudyWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.radiologyStudy.findMany({
        where,
        orderBy: [{ studyDate: 'desc' }],
        include: { report: { select: { id: true } } },
      });
      return items.map(mapStudy);
    });
  }

  async getStudy(id: string): Promise<RadiologyStudy> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.radiologyStudy.findFirst({
        where: { id, tenantId: this.tenantId },
        include: { report: { select: { id: true } } },
      });
      assertStudyFound(row, id);
      return mapStudy(row);
    });
  }

  async createOrder(input: CreateRadiologyOrderInput): Promise<RadiologyOrder> {
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
          throw new ValidationError('Patient not found for radiology order', {
            details: { patientId: input.patientId },
          });
        }

        const studyCount = await tx.radiologyStudy.count({
          where: { tenantId: this.tenantId },
        });
        const orderCount = await tx.radiologyOrder.count({
          where: { tenantId: this.tenantId },
        });
        const accessionNumber = `ACC-${String(studyCount + 1).padStart(6, '0')}`;
        const orderNumber = `RAD-${String(orderCount + 1).padStart(6, '0')}`;
        const studyId = newId();
        const orderId = newId();
        const studyDate = input.scheduledAt
          ? new Date(input.scheduledAt)
          : new Date();
        const actor = this.actorId();

        await tx.radiologyStudy.create({
          data: {
            id: studyId,
            tenantId: this.tenantId,
            accessionNumber,
            patientId: patient.id,
            patientName: input.patientName ?? patient.fullName,
            orderingPhysician: input.orderingPhysician,
            orderingPhysicianId: input.orderingPhysicianId,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            modality: input.modality,
            bodyPart: input.bodyPart,
            category: input.priority === 'stat' ? 'emergency' : 'diagnostic',
            status: 'scheduled',
            priority: input.priority ?? 'routine',
            studyDate,
            reason: input.reason,
            clinicalIndication: input.clinicalIndication,
            protocol: `${input.modality} ${input.bodyPart}`,
            isEmergency: input.priority === 'stat',
            carePlanId: input.carePlanId,
            appointmentId: input.appointmentId,
            createdBy: actor,
          },
        });

        const order = await tx.radiologyOrder.create({
          data: {
            id: orderId,
            tenantId: this.tenantId,
            orderNumber,
            studyId,
            patientId: patient.id,
            patientName: input.patientName ?? patient.fullName,
            orderingPhysician: input.orderingPhysician,
            orderingPhysicianId: input.orderingPhysicianId,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            modality: input.modality,
            bodyPart: input.bodyPart,
            priority: input.priority ?? 'routine',
            status: 'scheduled',
            clinicalIndication: input.clinicalIndication,
            reason: input.reason,
            carePlanId: input.carePlanId,
            appointmentId: input.appointmentId,
            scheduledAt: studyDate,
            notes: input.notes,
            createdBy: actor,
          },
        });

        return mapOrder(order);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  async cancelOrder(
    input: CancelRadiologyOrderInput,
  ): Promise<RadiologyOrder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.radiologyOrder.findFirst({
          where: { id: input.orderId, tenantId: this.tenantId },
        });
        assertOrderFound(existing, input.orderId);
        if (
          existing.status === 'final' ||
          existing.status === 'cancelled'
        ) {
          throw new ValidationError('Radiology order cannot be cancelled', {
            details: { status: existing.status },
          });
        }

        const order = await tx.radiologyOrder.update({
          where: { id: input.orderId },
          data: {
            status: 'cancelled',
            notes: input.reason ?? existing.notes,
            updatedBy: this.actorId(),
          },
        });

        if (existing.studyId) {
          await tx.radiologyStudy.update({
            where: { id: existing.studyId },
            data: {
              status: 'cancelled',
              updatedBy: this.actorId(),
            },
          });
        }

        return mapOrder(order);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  async completeAcquisition(
    input: CompleteAcquisitionInput,
  ): Promise<RadiologyStudy> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const study = await tx.radiologyStudy.findFirst({
          where: { id: input.studyId, tenantId: this.tenantId },
          include: { report: { select: { id: true } } },
        });
        assertStudyFound(study, input.studyId);
        if (study.status === 'cancelled' || study.status === 'final') {
          throw new ValidationError('Cannot complete acquisition', {
            details: { status: study.status },
          });
        }

        const actor = this.actorId();
        const updated = await tx.radiologyStudy.update({
          where: { id: study.id },
          data: {
            status: 'pending_interpretation',
            imageCount: input.imageCount ?? Math.max(study.imageCount, 12),
            seriesCount: input.seriesCount ?? Math.max(study.seriesCount, 1),
            radiationDoseMsv:
              input.radiationDoseMsv ?? study.radiationDoseMsv,
            deviceId: input.deviceId ?? study.deviceId,
            deviceName: input.deviceName ?? study.deviceName,
            updatedBy: actor,
          },
          include: { report: { select: { id: true } } },
        });

        await tx.radiologyOrder.updateMany({
          where: { studyId: study.id, tenantId: this.tenantId },
          data: {
            status: 'pending_interpretation',
            updatedBy: actor,
          },
        });

        if (!study.report) {
          await tx.radiologyReport.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              studyId: study.id,
              patientId: study.patientId,
              patientName: study.patientName,
              accessionNumber: study.accessionNumber,
              status: 'draft',
              modality: study.modality,
              bodyPart: study.bodyPart,
              title: `${study.modality} ${study.bodyPart} report`,
              createdBy: actor,
            },
          });
        }

        const withReport = await tx.radiologyStudy.findFirst({
          where: { id: study.id, tenantId: this.tenantId },
          include: { report: { select: { id: true } } },
        });
        assertStudyFound(withReport, study.id);
        return mapStudy(withReport);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  searchReports(filters: ReportFilters = {}): Promise<ReportListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildReportWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.radiologyReport.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.radiologyReport.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapReport), total, page, pageSize),
      );
    });
  }

  getAllReports(filters: ReportFilters = {}): Promise<DiagnosticReport[]> {
    const where = buildReportWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.radiologyReport.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
      });
      return items.map(mapReport);
    });
  }

  async getReport(id: string): Promise<DiagnosticReport> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.radiologyReport.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertReportFound(row, id);
      return mapReport(row);
    });
  }

  async getReportByStudy(studyId: string): Promise<DiagnosticReport> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.radiologyReport.findFirst({
        where: { studyId, tenantId: this.tenantId },
      });
      assertReportFound(row, studyId);
      return mapReport(row);
    });
  }

  getPendingReports(patientId?: string): Promise<DiagnosticReport[]> {
    return this.getAllReports({
      patientId,
      status: 'draft',
    }).then(async (drafts) => {
      const prelim = await this.getAllReports({
        patientId,
        status: 'preliminary',
      });
      return [...drafts, ...prelim];
    });
  }

  getCriticalReports(patientId?: string): Promise<DiagnosticReport[]> {
    return this.getAllReports({
      patientId,
      isCritical: true,
    });
  }

  async completeInterpretation(
    input: CompleteInterpretationInput,
  ): Promise<DiagnosticReport> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.radiologyReport.findFirst({
          where: { id: input.reportId, tenantId: this.tenantId },
        });
        assertReportFound(existing, input.reportId);

        const isCritical =
          input.impression.critical ||
          input.findings.some((f) => f.severity === 'critical');

        const report = await tx.radiologyReport.update({
          where: { id: input.reportId },
          data: {
            findings: input.findings as unknown as Prisma.InputJsonValue,
            impression: input.impression as unknown as Prisma.InputJsonValue,
            recommendations: (input.recommendations ??
              existing.recommendations) as unknown as Prisma.InputJsonValue,
            status: 'preliminary',
            isCritical,
            updatedBy: this.actorId(),
          },
        });

        await tx.radiologyStudy.update({
          where: { id: report.studyId },
          data: {
            status: 'preliminary',
            isCritical,
            updatedBy: this.actorId(),
          },
        });

        return mapReport(report);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  async approveReport(input: ApproveReportInput): Promise<DiagnosticReport> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.radiologyReport.findFirst({
          where: { id: input.reportId, tenantId: this.tenantId },
        });
        assertReportFound(existing, input.reportId);

        const now = new Date();
        const report = await tx.radiologyReport.update({
          where: { id: input.reportId },
          data: {
            status: 'final',
            radiologistId: input.radiologistId,
            radiologistName: input.radiologistName,
            signedAt: now,
            isUnread: false,
            updatedBy: this.actorId(),
          },
        });

        await tx.radiologyStudy.update({
          where: { id: report.studyId },
          data: {
            status: 'final',
            radiologistId: input.radiologistId,
            radiologistName: input.radiologistName,
            updatedBy: this.actorId(),
          },
        });

        await tx.radiologyOrder.updateMany({
          where: { studyId: report.studyId, tenantId: this.tenantId },
          data: {
            status: 'final',
            updatedBy: this.actorId(),
          },
        });

        return mapReport(report);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  async archiveStudy(id: string): Promise<RadiologyStudy> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.radiologyStudy.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertStudyFound(existing, id);

        const study = await tx.radiologyStudy.update({
          where: { id },
          data: {
            status: 'cancelled',
            updatedBy: this.actorId(),
          },
          include: { report: { select: { id: true } } },
        });

        await tx.radiologyOrder.updateMany({
          where: { studyId: id, tenantId: this.tenantId },
          data: {
            status: 'cancelled',
            updatedBy: this.actorId(),
          },
        });

        return mapStudy(study);
      });
    } catch (error) {
      mapRadiologyRepositoryError(error);
    }
  }

  getDevices(facilityId?: string): Promise<ImagingDevice[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.imagingDevice.findMany({
        where: {
          tenantId: this.tenantId,
          ...(facilityId ? { facilityId } : {}),
        },
        orderBy: [{ name: 'asc' }],
      });
      return items.map(mapDevice);
    });
  }

  getRadiologists(): Promise<Radiologist[]> {
    return Promise.resolve(getRadiologistsCatalog());
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
