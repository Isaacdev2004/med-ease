import { Injectable } from '@nestjs/common';

import type {
  AlertListResult,
  AssignDeviceInput,
  CreateObservationInput,
  DeviceAssignment,
  EarlyWarningScore,
  EnrollRPMInput,
  MonitoringAlert,
  MonitoringDashboard,
  MonitoringDevice,
  MonitoringFilters,
  MonitoringRepositoryContract,
  Observation,
  ObservationListResult,
  ObservationTimelineEntry,
  RemoteMonitoringProgram,
  UpdateObservationInput,
  VitalListResult,
} from '@medease/monitoring-contract';
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
  assertAlertFound,
  assertDeviceFound,
  assertObservationFound,
  assertProgramFound,
  mapMonitoringRepositoryError,
  toContractPaginated,
} from './monitoring.helpers';
import {
  mapAlert,
  mapAssignment,
  mapDevice,
  mapEarlyWarningScore,
  mapObservation,
  mapObservationCategory,
  mapProgram,
  mapVital,
  mapVitalType,
  splitValue,
} from './mappers/monitoring.mapper';
import {
  buildAlertWhere,
  buildObservationWhere,
  buildVitalWhere,
} from './queries/monitoring.queries';

@Injectable()
export class MonitoringRepository
  extends TenantAwareRepository
  implements MonitoringRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  getDashboard(patientId?: string): Promise<MonitoringDashboard> {
    return this.prisma.runInTransaction(async (tx) => {
      const tenantId = this.tenantId;
      const patientFilter = patientId ? { patientId } : {};

      const [
        activeAlerts,
        criticalAlerts,
        rpmEnrollments,
        devices,
        onlineDevices,
        news2Scores,
        mewsScores,
        recentObs,
        recentAlertRows,
        distinctPatients,
        vitalCount,
      ] = await Promise.all([
        tx.monitoringAlert.count({
          where: {
            tenantId,
            ...patientFilter,
            status: 'active',
          },
        }),
        tx.monitoringAlert.count({
          where: {
            tenantId,
            ...patientFilter,
            status: 'active',
            severity: { in: ['critical', 'urgent'] },
          },
        }),
        tx.monitoringProgram.count({
          where: {
            tenantId,
            ...patientFilter,
            status: 'active',
          },
        }),
        tx.monitoringDevice.count({ where: { tenantId } }),
        tx.monitoringDevice.count({
          where: { tenantId, status: 'online' },
        }),
        tx.earlyWarningScore.findMany({
          where: {
            tenantId,
            ...patientFilter,
            type: 'NEWS2',
          },
          select: { score: true },
          take: 500,
          orderBy: { calculatedAt: 'desc' },
        }),
        tx.earlyWarningScore.findMany({
          where: {
            tenantId,
            ...patientFilter,
            type: 'MEWS',
          },
          select: { score: true },
          take: 500,
          orderBy: { calculatedAt: 'desc' },
        }),
        tx.monitoringObservation.findMany({
          where: { tenantId, ...patientFilter },
          orderBy: { recordedAt: 'desc' },
          take: 8,
        }),
        tx.monitoringAlert.findMany({
          where: {
            tenantId,
            ...patientFilter,
            status: 'active',
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
        }),
        patientId
          ? Promise.resolve([{ patientId }])
          : tx.monitoringObservation.findMany({
              where: { tenantId },
              distinct: ['patientId'],
              select: { patientId: true },
              take: 5000,
            }),
        tx.monitoringVital.count({
          where: { tenantId, ...patientFilter },
        }),
      ]);

      const averageNews2 = news2Scores.length
        ? Math.round(
            (news2Scores.reduce((s, e) => s + e.score, 0) /
              news2Scores.length) *
              10,
          ) / 10
        : 0;
      const averageMews = mewsScores.length
        ? Math.round(
            (mewsScores.reduce((s, e) => s + e.score, 0) / mewsScores.length) *
              10,
          ) / 10
        : 0;

      return {
        patientId,
        activePatients: patientId ? 1 : distinctPatients.length,
        rpmEnrollments,
        activeAlerts,
        criticalAlerts,
        averageNews2,
        averageMews,
        deviceUtilization:
          devices > 0 ? Math.round((onlineDevices / devices) * 100) : 0,
        monitoringCompliance: 87 + (vitalCount % 10),
        missedReadings: Math.round(vitalCount * 0.03),
        batteryHealth: 82,
        alertResponseMinutes: 18,
        recentObservations: recentObs.map(mapObservation),
        recentAlerts: recentAlertRows.map(mapAlert),
        activeSessions: 0,
      };
    });
  }

  listVitals(filters: MonitoringFilters = {}): Promise<VitalListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildVitalWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.monitoringVital.findMany({
          where,
          skip,
          take,
          orderBy: [{ recordedAt: 'desc' }],
        }),
        tx.monitoringVital.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapVital), total, page, pageSize),
      );
    });
  }

  listObservations(
    filters: MonitoringFilters = {},
  ): Promise<ObservationListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildObservationWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.monitoringObservation.findMany({
          where,
          skip,
          take,
          orderBy: [{ recordedAt: 'desc' }],
        }),
        tx.monitoringObservation.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapObservation), total, page, pageSize),
      );
    });
  }

  getAllObservations(
    filters: MonitoringFilters = {},
  ): Promise<Observation[]> {
    const where = buildObservationWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.monitoringObservation.findMany({
        where,
        orderBy: [{ recordedAt: 'desc' }],
      });
      return items.map(mapObservation);
    });
  }

  async getObservation(id: string): Promise<Observation> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.monitoringObservation.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertObservationFound(row, id);
      return mapObservation(row);
    });
  }

  async createObservation(
    input: CreateObservationInput,
  ): Promise<Observation> {
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
          throw new ValidationError(
            'Patient not found for monitoring observation',
            { details: { patientId: input.patientId } },
          );
        }

        const actor = this.actorId();
        const now = new Date();
        const { valueText, valueNumeric } = splitValue(input.value);
        const category = mapObservationCategory(input.category);
        const vitalType = mapVitalType(input.code);
        const observationId = newId();

        const observation = await tx.monitoringObservation.create({
          data: {
            id: observationId,
            tenantId: this.tenantId,
            patientId: patient.id,
            category,
            code: input.code,
            display: input.display,
            valueText,
            valueNumeric,
            unit: input.unit,
            recordedAt: now,
            context: input.context ?? 'home',
            deviceId: input.deviceId,
            status: 'final',
            interpretation: 'normal',
            recordedBy: actor,
            notes: input.notes,
            createdBy: actor,
          },
        });

        if (category === 'vital-signs' && vitalType) {
          await tx.monitoringVital.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              patientId: patient.id,
              type: vitalType,
              valueText,
              valueNumeric,
              unit: input.unit,
              recordedAt: now,
              context: input.context ?? 'home',
              deviceId: input.deviceId,
              recordedBy: actor,
              status: 'normal',
            },
          });
        }

        if (observation.interpretation === 'critical') {
          await tx.monitoringAlert.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              patientId: patient.id,
              patientName: patient.fullName,
              type: 'clinical',
              severity: 'critical',
              status: 'active',
              title: `Abnormal ${input.display}`,
              message: `${valueText} ${input.unit}`,
              metric: vitalType,
              valueText,
              observationId: observation.id,
              deviceId: input.deviceId,
            },
          });
        }

        return mapObservation(observation);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  async updateObservation(
    input: UpdateObservationInput,
  ): Promise<Observation> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringObservation.findFirst({
          where: { id: input.id, tenantId: this.tenantId },
        });
        assertObservationFound(existing, input.id);

        const valueUpdate =
          input.value !== undefined ? splitValue(input.value) : null;

        const observation = await tx.monitoringObservation.update({
          where: { id: input.id },
          data: {
            ...(valueUpdate
              ? {
                  valueText: valueUpdate.valueText,
                  valueNumeric: valueUpdate.valueNumeric,
                }
              : {}),
            ...(input.notes !== undefined ? { notes: input.notes } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            updatedBy: this.actorId(),
          },
        });

        return mapObservation(observation);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  listAlerts(filters: MonitoringFilters = {}): Promise<AlertListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildAlertWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.monitoringAlert.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.monitoringAlert.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapAlert), total, page, pageSize),
      );
    });
  }

  async resolveAlert(
    id: string,
    resolvedBy?: string,
  ): Promise<MonitoringAlert> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringAlert.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAlertFound(existing, id);

        const alert = await tx.monitoringAlert.update({
          where: { id },
          data: {
            status: 'resolved',
            resolvedAt: new Date(),
            acknowledgedBy: resolvedBy ?? existing.acknowledgedBy,
          },
        });
        return mapAlert(alert);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  async dismissAlert(id: string): Promise<MonitoringAlert> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringAlert.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAlertFound(existing, id);

        const alert = await tx.monitoringAlert.update({
          where: { id },
          data: { status: 'dismissed' },
        });
        return mapAlert(alert);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  async acknowledgeAlert(id: string, by: string): Promise<MonitoringAlert> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringAlert.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertAlertFound(existing, id);

        const alert = await tx.monitoringAlert.update({
          where: { id },
          data: {
            status: 'acknowledged',
            acknowledgedAt: new Date(),
            acknowledgedBy: by,
          },
        });
        return mapAlert(alert);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  getTimeline(patientId: string): Promise<ObservationTimelineEntry[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const tenantId = this.tenantId;
      const [observations, alerts, scores] = await Promise.all([
        tx.monitoringObservation.findMany({
          where: { tenantId, patientId },
          orderBy: { recordedAt: 'desc' },
          take: 30,
        }),
        tx.monitoringAlert.findMany({
          where: { tenantId, patientId },
          orderBy: { createdAt: 'desc' },
          take: 15,
        }),
        tx.earlyWarningScore.findMany({
          where: { tenantId, patientId },
          orderBy: { calculatedAt: 'desc' },
          take: 10,
        }),
      ]);

      const entries: ObservationTimelineEntry[] = [
        ...observations.map((o) => {
          const mapped = mapObservation(o);
          return {
            id: mapped.id,
            patientId,
            date: mapped.recordedAt,
            type: 'observation' as const,
            title: mapped.display,
            description: `${mapped.value} ${mapped.unit}`,
            actor: mapped.recordedBy,
          };
        }),
        ...alerts.map((a) => {
          const mapped = mapAlert(a);
          return {
            id: mapped.id,
            patientId,
            date: mapped.createdAt,
            type: 'alert' as const,
            title: mapped.title,
            description: mapped.message,
            severity: mapped.severity,
          };
        }),
        ...scores.map((e) => {
          const mapped = mapEarlyWarningScore(e);
          return {
            id: mapped.id,
            patientId,
            date: mapped.calculatedAt,
            type: 'score' as const,
            title: `${mapped.type} score: ${mapped.score}`,
            description: `Risk level: ${mapped.riskLevel}`,
          };
        }),
      ];

      return entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });
  }

  listDevices(patientId?: string): Promise<MonitoringDevice[]> {
    return this.prisma.runInTransaction(async (tx) => {
      if (!patientId) {
        const items = await tx.monitoringDevice.findMany({
          where: { tenantId: this.tenantId },
          orderBy: [{ name: 'asc' }],
        });
        return items.map(mapDevice);
      }

      const assignments = await tx.deviceAssignment.findMany({
        where: {
          tenantId: this.tenantId,
          patientId,
          active: true,
        },
        select: { deviceId: true },
      });
      const deviceIds = assignments.map((a) => a.deviceId);
      if (deviceIds.length === 0) return [];

      const items = await tx.monitoringDevice.findMany({
        where: {
          tenantId: this.tenantId,
          id: { in: deviceIds },
        },
        orderBy: [{ name: 'asc' }],
      });
      return items.map(mapDevice);
    });
  }

  async getDevice(id: string): Promise<MonitoringDevice> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.monitoringDevice.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertDeviceFound(row, id);
      return mapDevice(row);
    });
  }

  async assignDevice(input: AssignDeviceInput): Promise<DeviceAssignment> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const device = await tx.monitoringDevice.findFirst({
          where: { id: input.deviceId, tenantId: this.tenantId },
        });
        assertDeviceFound(device, input.deviceId);

        const patient = await tx.patient.findFirst({
          where: {
            id: input.patientId,
            tenantId: this.tenantId,
            deletedAt: null,
          },
        });
        if (!patient) {
          throw new ValidationError('Patient not found for device assignment', {
            details: { patientId: input.patientId },
          });
        }

        const now = new Date();
        await tx.deviceAssignment.updateMany({
          where: {
            tenantId: this.tenantId,
            deviceId: input.deviceId,
            active: true,
          },
          data: {
            active: false,
            unassignedAt: now,
          },
        });

        const assignment = await tx.deviceAssignment.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            deviceId: input.deviceId,
            patientId: input.patientId,
            assignedAt: now,
            assignedBy: input.assignedBy,
            programId: input.programId,
            active: true,
          },
        });

        return mapAssignment(assignment);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  async syncDevice(deviceId: string): Promise<MonitoringDevice> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringDevice.findFirst({
          where: { id: deviceId, tenantId: this.tenantId },
        });
        assertDeviceFound(existing, deviceId);

        const device = await tx.monitoringDevice.update({
          where: { id: deviceId },
          data: {
            lastSyncAt: new Date(),
            status: 'online',
          },
        });
        return mapDevice(device);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  listRPMPrograms(patientId?: string): Promise<RemoteMonitoringProgram[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.monitoringProgram.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: [{ enrolledAt: 'desc' }],
      });
      return items.map(mapProgram);
    });
  }

  async enrollRPM(input: EnrollRPMInput): Promise<RemoteMonitoringProgram> {
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
          throw new ValidationError('Patient not found for RPM enrollment', {
            details: { patientId: input.patientId },
          });
        }

        const program = await tx.monitoringProgram.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            patientId: input.patientId,
            name: input.name,
            status: 'active',
            enrolledAt: new Date(),
            enrolledBy: input.clinicianName,
            deviceIds: input.deviceIds ?? [],
            metrics: input.metrics,
            frequency: input.frequency,
            clinicianId: input.clinicianId,
            clinicianName: input.clinicianName,
            carePlanId: input.carePlanId,
          },
        });
        return mapProgram(program);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  async removeRPM(programId: string): Promise<RemoteMonitoringProgram> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.monitoringProgram.findFirst({
          where: { id: programId, tenantId: this.tenantId },
        });
        assertProgramFound(existing, programId);

        const program = await tx.monitoringProgram.update({
          where: { id: programId },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        });
        return mapProgram(program);
      });
    } catch (error) {
      mapMonitoringRepositoryError(error);
    }
  }

  getEarlyWarningScores(
    patientId?: string,
  ): Promise<EarlyWarningScore[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.earlyWarningScore.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: [{ calculatedAt: 'desc' }],
      });
      return items.map(mapEarlyWarningScore);
    });
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
