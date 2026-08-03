import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_ID = '01930000-0000-7000-8000-000000000301';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const STUDY_SCHEDULED = '01930000-0000-7000-8000-000000001001';
const STUDY_PENDING = '01930000-0000-7000-8000-000000001002';
const STUDY_FINAL = '01930000-0000-7000-8000-000000001003';
const ORDER_SCHEDULED = '01930000-0000-7000-8000-000000001011';
const ORDER_PENDING = '01930000-0000-7000-8000-000000001012';
const ORDER_FINAL = '01930000-0000-7000-8000-000000001013';
const REPORT_DRAFT = '01930000-0000-7000-8000-000000001021';
const REPORT_FINAL = '01930000-0000-7000-8000-000000001022';
const DEVICE_CT = '01930000-0000-7000-8000-000000001031';
const DEVICE_MRI = '01930000-0000-7000-8000-000000001032';

export const radiologySeed: SeedModule = {
  name: 'radiology',
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
        await tx.imagingDevice.upsert({
          where: { id: DEVICE_CT },
          create: {
            id: DEVICE_CT,
            tenantId: DEMO_TENANT_ID,
            name: 'Siemens SOMATOM Force',
            modality: 'CT',
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            status: 'online',
            utilizationPercent: 68,
          },
          update: {
            status: 'online',
            utilizationPercent: 68,
          },
        });

        await tx.imagingDevice.upsert({
          where: { id: DEVICE_MRI },
          create: {
            id: DEVICE_MRI,
            tenantId: DEMO_TENANT_ID,
            name: 'GE SIGNA Premier 3T',
            modality: 'MRI',
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            status: 'online',
            utilizationPercent: 54,
          },
          update: {
            status: 'online',
            utilizationPercent: 54,
          },
        });

        await tx.radiologyStudy.upsert({
          where: { id: STUDY_SCHEDULED },
          create: {
            id: STUDY_SCHEDULED,
            tenantId: DEMO_TENANT_ID,
            accessionNumber: 'ACC-000001',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            modality: 'X-Ray',
            bodyPart: 'chest',
            category: 'diagnostic',
            status: 'scheduled',
            priority: 'routine',
            studyDate: now,
            reason: 'Cough and fever',
            clinicalIndication: 'Rule out pneumonia',
            protocol: 'X-Ray chest PA/Lat',
            deviceId: DEVICE_CT,
            deviceName: 'Siemens SOMATOM Force',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'scheduled',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyOrder.upsert({
          where: { id: ORDER_SCHEDULED },
          create: {
            id: ORDER_SCHEDULED,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'RAD-000001',
            studyId: STUDY_SCHEDULED,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            modality: 'X-Ray',
            bodyPart: 'chest',
            priority: 'routine',
            status: 'scheduled',
            clinicalIndication: 'Rule out pneumonia',
            reason: 'Cough and fever',
            scheduledAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'scheduled',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyStudy.upsert({
          where: { id: STUDY_PENDING },
          create: {
            id: STUDY_PENDING,
            tenantId: DEMO_TENANT_ID,
            accessionNumber: 'ACC-000002',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            modality: 'CT',
            bodyPart: 'abdomen',
            category: 'diagnostic',
            status: 'pending_interpretation',
            priority: 'urgent',
            studyDate: now,
            reason: 'Abdominal pain',
            clinicalIndication: 'Suspected appendicitis',
            protocol: 'CT abdomen with contrast',
            contrast: { used: true, agent: 'Iohexol', volumeMl: 100 },
            imageCount: 240,
            seriesCount: 3,
            deviceId: DEVICE_CT,
            deviceName: 'Siemens SOMATOM Force',
            radiationDoseMsv: 8.2,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'pending_interpretation',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyOrder.upsert({
          where: { id: ORDER_PENDING },
          create: {
            id: ORDER_PENDING,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'RAD-000002',
            studyId: STUDY_PENDING,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            modality: 'CT',
            bodyPart: 'abdomen',
            priority: 'urgent',
            status: 'pending_interpretation',
            clinicalIndication: 'Suspected appendicitis',
            reason: 'Abdominal pain',
            scheduledAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'pending_interpretation',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyReport.upsert({
          where: { id: REPORT_DRAFT },
          create: {
            id: REPORT_DRAFT,
            tenantId: DEMO_TENANT_ID,
            studyId: STUDY_PENDING,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            accessionNumber: 'ACC-000002',
            status: 'draft',
            modality: 'CT',
            bodyPart: 'abdomen',
            title: 'CT abdomen report',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'draft',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyStudy.upsert({
          where: { id: STUDY_FINAL },
          create: {
            id: STUDY_FINAL,
            tenantId: DEMO_TENANT_ID,
            accessionNumber: 'ACC-000003',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            radiologistId: DEMO_PHYSICIAN_ID,
            radiologistName: 'Dr. Emily Chen',
            modality: 'MRI',
            bodyPart: 'head',
            category: 'diagnostic',
            status: 'final',
            priority: 'routine',
            studyDate: now,
            reason: 'Headache',
            clinicalIndication: 'Chronic migraine workup',
            protocol: 'MRI brain without contrast',
            imageCount: 180,
            seriesCount: 4,
            deviceId: DEVICE_MRI,
            deviceName: 'GE SIGNA Premier 3T',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'final',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyOrder.upsert({
          where: { id: ORDER_FINAL },
          create: {
            id: ORDER_FINAL,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'RAD-000003',
            studyId: STUDY_FINAL,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            modality: 'MRI',
            bodyPart: 'head',
            priority: 'routine',
            status: 'final',
            clinicalIndication: 'Chronic migraine workup',
            reason: 'Headache',
            scheduledAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'final',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.radiologyReport.upsert({
          where: { id: REPORT_FINAL },
          create: {
            id: REPORT_FINAL,
            tenantId: DEMO_TENANT_ID,
            studyId: STUDY_FINAL,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            accessionNumber: 'ACC-000003',
            status: 'final',
            modality: 'MRI',
            bodyPart: 'head',
            title: 'MRI brain',
            findings: [
              {
                id: 'f-1',
                title: 'No acute infarct',
                description: 'No restricted diffusion.',
                severity: 'normal',
                bodyRegion: 'brain',
              },
            ],
            impression: {
              summary: 'Normal brain MRI. No acute intracranial abnormality.',
              critical: false,
            },
            recommendations: [
              {
                id: 'r-1',
                text: 'Clinical correlation; neurology follow-up as needed.',
                priority: 'routine',
              },
            ],
            radiologistId: DEMO_PHYSICIAN_ID,
            radiologistName: 'Dr. Emily Chen',
            signedAt: now,
            isCritical: false,
            isUnread: false,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'final',
            signedAt: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
