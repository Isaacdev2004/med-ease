import { Injectable } from '@nestjs/common';

import type {
  CreatePrescriptionInput,
  DoseLog,
  LogDoseInput,
  MedicationFilters,
  MedicationListResult,
  MedicationReminder,
  MedicationSearchResult,
  MedicationsRepositoryContract,
  PatientMedication,
  Prescription,
  RefillRequest,
  RefillRequestInput,
  ScheduledDose,
} from '@medease/medications-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import {
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport/errors';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertMedicationFound,
  assertPrescriptionFound,
  assertRefillFound,
  mapMedicationRepositoryError,
  toContractPaginated,
} from './medications.helpers';
import {
  mapDoseLog,
  mapPatientMedication,
  mapPrescription,
  mapRefillRequest,
  mapReminder,
  mapScheduledDose,
} from './mappers/medication.mapper';
import {
  buildMedicationListWhere,
  buildPrescriptionListWhere,
} from './queries/medication.queries';

const DEFAULT_SCHEDULE_HOURS = [8, 12, 18, 22] as const;

function slotForHour(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour < 11) return 'morning';
  if (hour < 15) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

function parseScheduleHours(frequency: string, explicit?: string[]): number[] {
  if (explicit?.length) {
    return explicit
      .map((value) => {
        const match = value.match(/(\d{1,2})/);
        return match ? Number(match[1]) : NaN;
      })
      .filter((hour) => Number.isFinite(hour) && hour >= 0 && hour <= 23);
  }

  const lower = frequency.toLowerCase();
  if (lower.includes('once') || lower.includes('daily') || lower.includes('qd')) {
    return [8];
  }
  if (lower.includes('twice') || lower.includes('bid')) {
    return [8, 20];
  }
  if (lower.includes('three') || lower.includes('tid')) {
    return [8, 14, 20];
  }
  if (lower.includes('four') || lower.includes('qid')) {
    return [...DEFAULT_SCHEDULE_HOURS];
  }
  return [8, 20];
}

@Injectable()
export class MedicationsRepository
  extends TenantAwareRepository
  implements MedicationsRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  listMedications(filters: MedicationFilters = {}): Promise<MedicationListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildMedicationListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.patientMedication.findMany({
          where,
          skip,
          take,
          orderBy: { updatedAt: 'desc' },
        }),
        tx.patientMedication.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapPatientMedication), total, page, pageSize),
      );
    });
  }

  getAllMedications(filters: MedicationFilters = {}): Promise<PatientMedication[]> {
    const where = buildMedicationListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.patientMedication.findMany({
        where,
        orderBy: { name: 'asc' },
      });
      return items.map(mapPatientMedication);
    });
  }

  async getMedication(id: string): Promise<PatientMedication> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.patientMedication.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertMedicationFound(row, id);
      return mapPatientMedication(row);
    });
  }

  listPrescriptions(filters: MedicationFilters = {}): Promise<Prescription[]> {
    const where = buildPrescriptionListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.prescription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      return items.map(mapPrescription);
    });
  }

  async getPrescription(id: string): Promise<Prescription> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.prescription.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertPrescriptionFound(row, id);
      return mapPrescription(row);
    });
  }

  getSchedule(patientId?: string): Promise<ScheduledDose[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.medicationDose.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: { scheduledAt: 'asc' },
      });
      return items.map(mapScheduledDose);
    });
  }

  getLogs(patientId?: string): Promise<DoseLog[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.doseLog.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: { loggedAt: 'desc' },
      });
      return items.map(mapDoseLog);
    });
  }

  getReminders(patientId?: string): Promise<MedicationReminder[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.medicationReminder.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: { dueAt: 'asc' },
      });
      return items.map(mapReminder);
    });
  }

  getRefills(patientId?: string): Promise<RefillRequest[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.refillRequest.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: { requestedAt: 'desc' },
      });
      return items.map(mapRefillRequest);
    });
  }

  async createPrescription(input: CreatePrescriptionInput): Promise<Prescription> {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + input.durationDays);
    const expiresAt = new Date(startDate);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 90);
    const refillCount = input.refillCount ?? 3;

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
          throw new ValidationError('Patient not found for prescription', {
            details: { patientId: input.patientId },
          });
        }

        const prescriptionId = newId();
        const medicationId = newId();
        const actorId = this.actorId();
        const physicianId =
          input.prescribingPhysicianId ??
          patient.primaryProviderId ??
          actorId;
        const physicianName =
          input.prescribingPhysician ?? 'Prescribing physician';

        const prescription = await tx.prescription.create({
          data: {
            id: prescriptionId,
            tenantId: this.tenantId,
            patientId: patient.id,
            prescriptionNumber: `RX-${prescriptionId.slice(0, 8).toUpperCase()}`,
            patientName: patient.fullName,
            medicationName: input.medicationName,
            genericName: input.genericName,
            brandName: input.brandName,
            strength: input.strength,
            medicationClass: input.medicationClass ?? '',
            medicationType: input.medicationType ?? '',
            controlledSubstance: input.controlledSubstance ?? false,
            dose: input.dose,
            frequency: input.frequency,
            route: input.route,
            durationDays: input.durationDays,
            startDate,
            endDate,
            expiresAt,
            status: 'active',
            refillCount,
            refillsRemaining: refillCount,
            prescribingPhysician: physicianName,
            prescribingPhysicianId: physicianId,
            dispensingPharmacy: input.dispensingPharmacy,
            dispensingPharmacyId: input.dispensingPharmacyId,
            instructions: input.instructions,
            warnings: input.warnings ?? [],
            contraindications: input.contraindications ?? [],
            diagnosisCode: input.diagnosisCode,
            fhirResourceId: prescriptionId,
            createdBy: actorId,
          },
        });

        await tx.patientMedication.create({
          data: {
            id: medicationId,
            tenantId: this.tenantId,
            prescriptionId,
            patientId: patient.id,
            name: input.medicationName,
            genericName: input.genericName,
            brandName: input.brandName,
            strength: input.strength,
            medicationClass: input.medicationClass ?? '',
            medicationType: input.medicationType ?? '',
            controlledSubstance: input.controlledSubstance ?? false,
            status: 'active',
            dose: input.dose,
            frequency: input.frequency,
            route: input.route,
            startDate,
            endDate,
            remainingDays: input.durationDays,
            instructions: input.instructions,
            warnings: input.warnings ?? [],
            contraindications: input.contraindications ?? [],
            sideEffects: input.sideEffects ?? [],
            storage: input.storage,
            prescribingPhysician: physicianName,
            dispensingPharmacy: input.dispensingPharmacy,
            refillCount,
            refillsRemaining: refillCount,
            condition: input.condition,
            createdBy: actorId,
          },
        });

        const hours = parseScheduleHours(input.frequency, input.scheduleTimes);
        const doseRows = [];
        for (let dayOffset = 0; dayOffset < Math.min(input.durationDays, 14); dayOffset++) {
          for (const hour of hours) {
            const scheduledAt = new Date(startDate);
            scheduledAt.setUTCDate(scheduledAt.getUTCDate() + dayOffset);
            scheduledAt.setUTCHours(hour, 0, 0, 0);
            doseRows.push({
              id: newId(),
              tenantId: this.tenantId,
              medicationId,
              patientId: patient.id,
              medicationName: input.medicationName,
              scheduledAt,
              slot: slotForHour(hour),
              dose: input.dose,
              status: 'pending' as const,
              instructions: input.instructions,
            });
          }
        }
        if (doseRows.length) {
          await tx.medicationDose.createMany({ data: doseRows });
        }

        const firstDoseAt = doseRows[0]?.scheduledAt ?? new Date();
        await tx.medicationReminder.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            medicationId,
            patientId: patient.id,
            type: 'dose',
            channel: 'in_app',
            title: `Take ${input.medicationName}`,
            message: `${input.dose} — ${input.instructions}`,
            dueAt: firstDoseAt,
            active: true,
          },
        });

        return mapPrescription(prescription);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async cancelPrescription(id: string): Promise<Prescription> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.prescription.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertPrescriptionFound(existing, id);

        const row = await tx.prescription.update({
          where: { id },
          data: {
            status: 'cancelled',
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        await tx.patientMedication.updateMany({
          where: { prescriptionId: id, tenantId: this.tenantId },
          data: {
            status: 'cancelled',
            updatedBy: this.actorId(),
          },
        });

        return mapPrescription(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async renewPrescription(id: string): Promise<Prescription> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.prescription.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertPrescriptionFound(existing, id);

        const expiresAt = new Date();
        expiresAt.setUTCDate(expiresAt.getUTCDate() + 90);

        const row = await tx.prescription.update({
          where: { id },
          data: {
            status: 'renewed',
            refillsRemaining: existing.refillCount,
            expiresAt,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        await tx.patientMedication.updateMany({
          where: { prescriptionId: id, tenantId: this.tenantId },
          data: {
            status: 'active',
            refillsRemaining: existing.refillCount,
            updatedBy: this.actorId(),
          },
        });

        return mapPrescription(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async logDose(input: LogDoseInput): Promise<DoseLog> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const medication = await tx.patientMedication.findFirst({
          where: {
            id: input.medicationId,
            tenantId: this.tenantId,
            patientId: input.patientId,
          },
        });
        assertMedicationFound(medication, input.medicationId);

        const log = await tx.doseLog.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            medicationId: input.medicationId,
            patientId: input.patientId,
            scheduledDoseId: input.scheduledDoseId,
            status: input.status,
            loggedAt: new Date(),
            notes: input.notes,
          },
        });

        if (input.scheduledDoseId) {
          const doseStatus =
            input.status === 'taken'
              ? 'taken'
              : input.status === 'late'
                ? 'late'
                : 'skipped';
          await tx.medicationDose.updateMany({
            where: {
              id: input.scheduledDoseId,
              tenantId: this.tenantId,
            },
            data: { status: doseStatus },
          });
        }

        return mapDoseLog(log);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async requestRefill(input: RefillRequestInput): Promise<RefillRequest> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const prescription = await tx.prescription.findFirst({
          where: {
            id: input.prescriptionId,
            tenantId: this.tenantId,
            patientId: input.patientId,
          },
        });
        assertPrescriptionFound(prescription, input.prescriptionId);

        const medication = await tx.patientMedication.findFirst({
          where: {
            prescriptionId: input.prescriptionId,
            tenantId: this.tenantId,
          },
        });
        assertMedicationFound(medication);

        const expectedDate = new Date();
        expectedDate.setUTCDate(expectedDate.getUTCDate() + 3);

        const row = await tx.refillRequest.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            prescriptionId: prescription.id,
            medicationId: medication.id,
            patientId: input.patientId,
            patientName: prescription.patientName,
            medicationName: prescription.medicationName,
            pharmacyId: input.pharmacyId,
            pharmacyName:
              input.pharmacyName ??
              prescription.dispensingPharmacy ??
              'Pharmacy',
            status: 'pending',
            remainingTablets: undefined,
            daysLeft: medication.remainingDays ?? undefined,
            expectedDate,
            autoRefill: input.autoRefill ?? false,
            createdBy: this.actorId(),
          },
        });

        return mapRefillRequest(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async approveRefill(id: string): Promise<RefillRequest> {
    return this.updateRefillStatus(id, 'approved');
  }

  async rejectRefill(id: string): Promise<RefillRequest> {
    return this.updateRefillStatus(id, 'rejected');
  }

  async pauseMedication(medicationId: string): Promise<PatientMedication> {
    return this.updateMedicationStatus(medicationId, 'paused');
  }

  async resumeMedication(medicationId: string): Promise<PatientMedication> {
    return this.updateMedicationStatus(medicationId, 'active');
  }

  async completeCourse(medicationId: string): Promise<PatientMedication> {
    return this.updateMedicationStatus(medicationId, 'completed');
  }

  async markReminderDone(reminderId: string): Promise<MedicationReminder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.medicationReminder.findFirst({
          where: { id: reminderId, tenantId: this.tenantId },
        });
        if (!existing) {
          throw new NotFoundError('Reminder not found', {
            details: { reminderId },
          });
        }

        const row = await tx.medicationReminder.update({
          where: { id: reminderId },
          data: { active: false },
        });
        return mapReminder(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  async search(
    query: string,
    patientId?: string,
  ): Promise<MedicationSearchResult> {
    const filters: MedicationFilters = { q: query, patientId };
    const [medications, prescriptions] = await Promise.all([
      this.getAllMedications(filters),
      this.listPrescriptions(filters),
    ]);

    return {
      medications: medications.slice(0, 20),
      prescriptions: prescriptions.slice(0, 20),
    };
  }

  private async updateRefillStatus(
    id: string,
    status: 'approved' | 'rejected',
  ): Promise<RefillRequest> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.refillRequest.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertRefillFound(existing, id);

        const row = await tx.refillRequest.update({
          where: { id },
          data: {
            status,
            updatedBy: this.actorId(),
          },
        });

        if (status === 'approved') {
          await tx.prescription.updateMany({
            where: {
              id: existing.prescriptionId,
              tenantId: this.tenantId,
              refillsRemaining: { gt: 0 },
            },
            data: {
              refillsRemaining: { decrement: 1 },
              updatedBy: this.actorId(),
            },
          });
        }

        return mapRefillRequest(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  private async updateMedicationStatus(
    medicationId: string,
    status: 'active' | 'paused' | 'completed',
  ): Promise<PatientMedication> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patientMedication.findFirst({
          where: { id: medicationId, tenantId: this.tenantId },
        });
        assertMedicationFound(existing, medicationId);

        const row = await tx.patientMedication.update({
          where: { id: medicationId },
          data: {
            status,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        return mapPatientMedication(row);
      });
    } catch (error) {
      mapMedicationRepositoryError(error);
    }
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
