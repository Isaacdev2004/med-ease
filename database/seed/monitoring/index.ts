import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_ID = '01930000-0000-7000-8000-000000000301';

const DEVICE_BP = '01930000-0000-7000-8000-000000001101';
const DEVICE_SPO2 = '01930000-0000-7000-8000-000000001102';
const ASSIGN_BP = '01930000-0000-7000-8000-000000001161';
const VITAL_HR = '01930000-0000-7000-8000-000000001111';
const VITAL_BP = '01930000-0000-7000-8000-000000001112';
const VITAL_SPO2 = '01930000-0000-7000-8000-000000001113';
const OBS_HR = '01930000-0000-7000-8000-000000001121';
const OBS_BP = '01930000-0000-7000-8000-000000001122';
const ALERT_ACTIVE = '01930000-0000-7000-8000-000000001131';
const ALERT_RESOLVED = '01930000-0000-7000-8000-000000001132';
const PROGRAM_HTN = '01930000-0000-7000-8000-000000001141';
const EWS_NEWS2 = '01930000-0000-7000-8000-000000001151';
const EWS_MEWS = '01930000-0000-7000-8000-000000001152';

export const monitoringSeed: SeedModule = {
  name: 'monitoring',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.monitoringDevice.upsert({
          where: { id: DEVICE_BP },
          create: {
            id: DEVICE_BP,
            tenantId: DEMO_TENANT_ID,
            name: 'Omron HEM-9210T',
            manufacturer: 'Omron',
            model: 'HEM-9210T',
            type: 'home',
            serialNumber: 'OMR-BP-0001',
            status: 'online',
            battery: 'good',
            batteryPercent: 78,
            lastSyncAt: now,
            firmwareVersion: '2.1.0',
            supportedMetrics: ['blood_pressure', 'heart_rate'],
          },
          update: {
            status: 'online',
            lastSyncAt: now,
            batteryPercent: 78,
          },
        });

        await tx.monitoringDevice.upsert({
          where: { id: DEVICE_SPO2 },
          create: {
            id: DEVICE_SPO2,
            tenantId: DEMO_TENANT_ID,
            name: 'Nonin 3150 Pulse Ox',
            manufacturer: 'Nonin',
            model: '3150',
            type: 'wearable',
            serialNumber: 'NON-SPO2-0001',
            status: 'online',
            battery: 'full',
            batteryPercent: 92,
            lastSyncAt: now,
            firmwareVersion: '1.4.2',
            supportedMetrics: ['spo2', 'heart_rate'],
          },
          update: {
            status: 'online',
            lastSyncAt: now,
          },
        });

        await tx.monitoringProgram.upsert({
          where: { id: PROGRAM_HTN },
          create: {
            id: PROGRAM_HTN,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            name: 'Hypertension RPM',
            status: 'active',
            enrolledAt: now,
            enrolledBy: 'Dr. Emily Chen',
            deviceIds: [DEVICE_BP],
            metrics: ['blood_pressure', 'heart_rate'],
            frequency: 'Twice daily',
            clinicianId: DEMO_PHYSICIAN_ID,
            clinicianName: 'Dr. Emily Chen',
          },
          update: {
            status: 'active',
            metrics: ['blood_pressure', 'heart_rate'],
          },
        });

        await tx.deviceAssignment.upsert({
          where: { id: ASSIGN_BP },
          create: {
            id: ASSIGN_BP,
            tenantId: DEMO_TENANT_ID,
            deviceId: DEVICE_BP,
            patientId: DEMO_PATIENT_ID,
            assignedAt: now,
            assignedBy: 'Dr. Emily Chen',
            programId: PROGRAM_HTN,
            active: true,
          },
          update: {
            active: true,
            assignedAt: now,
          },
        });

        await tx.monitoringVital.upsert({
          where: { id: VITAL_HR },
          create: {
            id: VITAL_HR,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            type: 'heart_rate',
            valueText: '88',
            valueNumeric: 88,
            unit: 'bpm',
            recordedAt: now,
            context: 'home',
            deviceId: DEVICE_BP,
            recordedBy: 'Omron HEM-9210T',
            status: 'normal',
          },
          update: {
            valueText: '88',
            valueNumeric: 88,
            recordedAt: now,
          },
        });

        await tx.monitoringVital.upsert({
          where: { id: VITAL_BP },
          create: {
            id: VITAL_BP,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            type: 'blood_pressure',
            valueText: '148/92',
            unit: 'mmHg',
            recordedAt: now,
            context: 'rpm',
            deviceId: DEVICE_BP,
            recordedBy: 'Omron HEM-9210T',
            status: 'warning',
            systolic: 148,
            diastolic: 92,
          },
          update: {
            valueText: '148/92',
            status: 'warning',
            systolic: 148,
            diastolic: 92,
            recordedAt: now,
          },
        });

        await tx.monitoringVital.upsert({
          where: { id: VITAL_SPO2 },
          create: {
            id: VITAL_SPO2,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            type: 'spo2',
            valueText: '97',
            valueNumeric: 97,
            unit: '%',
            recordedAt: now,
            context: 'home',
            deviceId: DEVICE_SPO2,
            recordedBy: 'Nonin 3150',
            status: 'normal',
          },
          update: {
            valueText: '97',
            valueNumeric: 97,
            recordedAt: now,
          },
        });

        await tx.monitoringObservation.upsert({
          where: { id: OBS_HR },
          create: {
            id: OBS_HR,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            category: 'vital-signs',
            code: '8867-4',
            display: 'Heart rate',
            valueText: '88',
            valueNumeric: 88,
            unit: 'bpm',
            recordedAt: now,
            context: 'home',
            deviceId: DEVICE_BP,
            status: 'final',
            interpretation: 'normal',
            recordedBy: 'Omron HEM-9210T',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            valueText: '88',
            valueNumeric: 88,
            recordedAt: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.monitoringObservation.upsert({
          where: { id: OBS_BP },
          create: {
            id: OBS_BP,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            category: 'vital-signs',
            code: '85354-9',
            display: 'Blood pressure panel',
            valueText: '148/92',
            unit: 'mmHg',
            recordedAt: now,
            context: 'rpm',
            deviceId: DEVICE_BP,
            status: 'final',
            interpretation: 'abnormal',
            referenceRange: '<140/90',
            recordedBy: 'Omron HEM-9210T',
            notes: 'Elevated — continue HTN RPM protocol',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            valueText: '148/92',
            interpretation: 'abnormal',
            recordedAt: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.monitoringAlert.upsert({
          where: { id: ALERT_ACTIVE },
          create: {
            id: ALERT_ACTIVE,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            type: 'threshold',
            severity: 'warning',
            status: 'active',
            title: 'Elevated blood pressure',
            message: 'Systolic 148 mmHg exceeds RPM threshold of 140',
            metric: 'blood_pressure',
            valueText: '148/92',
            threshold: '140/90',
            observationId: OBS_BP,
            deviceId: DEVICE_BP,
          },
          update: {
            status: 'active',
            valueText: '148/92',
          },
        });

        await tx.monitoringAlert.upsert({
          where: { id: ALERT_RESOLVED },
          create: {
            id: ALERT_RESOLVED,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            type: 'missed_reading',
            severity: 'info',
            status: 'resolved',
            title: 'Missed morning reading',
            message: 'No BP reading received before 10:00',
            metric: 'blood_pressure',
            resolvedAt: now,
            acknowledgedBy: 'Dr. Emily Chen',
          },
          update: {
            status: 'resolved',
            resolvedAt: now,
          },
        });

        await tx.earlyWarningScore.upsert({
          where: { id: EWS_NEWS2 },
          create: {
            id: EWS_NEWS2,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            type: 'NEWS2',
            score: 2,
            riskLevel: 'low',
            components: {
              respiration: 0,
              spo2: 0,
              temperature: 0,
              systolic: 1,
              heartRate: 1,
              consciousness: 0,
            },
            calculatedAt: now,
            context: 'home',
          },
          update: {
            score: 2,
            riskLevel: 'low',
            calculatedAt: now,
          },
        });

        await tx.earlyWarningScore.upsert({
          where: { id: EWS_MEWS },
          create: {
            id: EWS_MEWS,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            type: 'MEWS',
            score: 1,
            riskLevel: 'low',
            components: {
              systolic: 1,
              heartRate: 0,
              respiration: 0,
              temperature: 0,
              avpu: 0,
            },
            calculatedAt: now,
            context: 'ward',
          },
          update: {
            score: 1,
            riskLevel: 'low',
            calculatedAt: now,
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
