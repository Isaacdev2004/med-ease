import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_ID = '01930000-0000-7000-8000-000000000301';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const ORDER_PENDING = '01930000-0000-7000-8000-000000000f01';
const ORDER_COLLECTED = '01930000-0000-7000-8000-000000000f02';
const ORDER_DONE = '01930000-0000-7000-8000-000000000f03';
const SPECIMEN_ID = '01930000-0000-7000-8000-000000000f11';
const REPORT_PROCESSING = '01930000-0000-7000-8000-000000000f21';
const REPORT_RELEASED = '01930000-0000-7000-8000-000000000f22';
const OBS_HBA1C = '01930000-0000-7000-8000-000000000f31';
const OBS_GLU = '01930000-0000-7000-8000-000000000f32';

export const laboratorySeed: SeedModule = {
  name: 'laboratory',
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
        await tx.labOrder.upsert({
          where: { id: ORDER_PENDING },
          create: {
            id: ORDER_PENDING,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'LAB-000001',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            department: 'Internal Medicine',
            laboratoryId: DEMO_FACILITY_PARIS,
            laboratoryName: 'Central Clinical Laboratory',
            priority: 'routine',
            status: 'pending',
            collectionMethod: 'in_clinic',
            clinicalIndication: 'Diabetes follow-up',
            diagnosis: 'E11.9 Type 2 diabetes',
            testIds: ['t-hba1c', 't-glucose'],
            testNames: ['HbA1c', 'Glucose'],
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'pending',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.labOrder.upsert({
          where: { id: ORDER_COLLECTED },
          create: {
            id: ORDER_COLLECTED,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'LAB-000002',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            department: 'Internal Medicine',
            laboratoryId: DEMO_FACILITY_PARIS,
            laboratoryName: 'Central Clinical Laboratory',
            priority: 'urgent',
            status: 'in_progress',
            collectionMethod: 'in_clinic',
            clinicalIndication: 'CBC panel',
            testIds: ['t-hgb', 't-wbc'],
            testNames: ['Hemoglobin', 'White blood cell count'],
            collectedAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'in_progress',
            collectedAt: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.labSpecimen.upsert({
          where: { id: SPECIMEN_ID },
          create: {
            id: SPECIMEN_ID,
            tenantId: DEMO_TENANT_ID,
            orderId: ORDER_COLLECTED,
            patientId: DEMO_PATIENT_ID,
            barcode: 'BC-LAB-000002',
            qrCode: 'QR-LAB-000002',
            specimenType: 'Blood',
            status: 'collected',
            collectedBy: 'Marie Dupont, RN',
            collectedAt: now,
            chainOfCustody: [
              {
                id: '01930000-0000-7000-8000-000000000f12',
                timestamp: now.toISOString(),
                status: 'collected',
                actor: 'Marie Dupont, RN',
              },
            ],
          },
          update: {
            status: 'collected',
            collectedAt: now,
          },
        });

        await tx.labDiagnosticReport.upsert({
          where: { id: REPORT_PROCESSING },
          create: {
            id: REPORT_PROCESSING,
            tenantId: DEMO_TENANT_ID,
            orderId: ORDER_COLLECTED,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            reportNumber: 'RPT-000001',
            status: 'processing',
            category: 'hematology',
            title: 'CBC results',
            technologistId: DEMO_ADMIN_ID,
            technologistName: 'Lab Tech',
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'processing',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.labOrder.upsert({
          where: { id: ORDER_DONE },
          create: {
            id: ORDER_DONE,
            tenantId: DEMO_TENANT_ID,
            orderNumber: 'LAB-000003',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            orderingPhysician: 'Dr. Emily Chen',
            orderingPhysicianId: DEMO_PHYSICIAN_ID,
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            department: 'Internal Medicine',
            laboratoryId: DEMO_FACILITY_PARIS,
            laboratoryName: 'Central Clinical Laboratory',
            priority: 'routine',
            status: 'completed',
            collectionMethod: 'in_clinic',
            clinicalIndication: 'Metabolic panel',
            testIds: ['t-hba1c', 't-glucose'],
            testNames: ['HbA1c', 'Glucose'],
            collectedAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'completed',
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.labDiagnosticReport.upsert({
          where: { id: REPORT_RELEASED },
          create: {
            id: REPORT_RELEASED,
            tenantId: DEMO_TENANT_ID,
            orderId: ORDER_DONE,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            reportNumber: 'RPT-000002',
            status: 'released',
            category: 'biochemistry',
            title: 'Diabetes labs',
            verifiedBy: 'Dr. Emily Chen',
            approvedBy: 'Dr. Emily Chen',
            technologistId: DEMO_ADMIN_ID,
            technologistName: 'Lab Tech',
            releasedAt: now,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'released',
            releasedAt: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.labObservation.upsert({
          where: { id: OBS_HBA1C },
          create: {
            id: OBS_HBA1C,
            tenantId: DEMO_TENANT_ID,
            reportId: REPORT_RELEASED,
            orderId: ORDER_DONE,
            patientId: DEMO_PATIENT_ID,
            testId: 't-hba1c',
            testName: 'HbA1c',
            loincCode: '4548-4',
            category: 'biochemistry',
            value: '6.8',
            numericValue: 6.8,
            unit: '%',
            referenceRange: '<5.7%',
            flag: 'high',
            interpretation: 'Above target',
            collectedAt: now,
            resultedAt: now,
          },
          update: {
            value: '6.8',
            numericValue: 6.8,
            flag: 'high',
          },
        });

        await tx.labObservation.upsert({
          where: { id: OBS_GLU },
          create: {
            id: OBS_GLU,
            tenantId: DEMO_TENANT_ID,
            reportId: REPORT_RELEASED,
            orderId: ORDER_DONE,
            patientId: DEMO_PATIENT_ID,
            testId: 't-glucose',
            testName: 'Glucose',
            loincCode: '2345-7',
            category: 'biochemistry',
            value: '118',
            numericValue: 118,
            unit: 'mg/dL',
            referenceRange: '70–100 mg/dL',
            flag: 'high',
            collectedAt: now,
            resultedAt: now,
          },
          update: {
            value: '118',
            numericValue: 118,
            flag: 'high',
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
