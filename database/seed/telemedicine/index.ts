import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_ID = '01930000-0000-7000-8000-000000000301';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const SESSION_SCHEDULED = '01930000-0000-7000-8000-000000001201';
const SESSION_ACTIVE = '01930000-0000-7000-8000-000000001202';
const SESSION_DONE = '01930000-0000-7000-8000-000000001203';
const PART_PATIENT_ACTIVE = '01930000-0000-7000-8000-000000001211';
const PART_CLINICIAN_ACTIVE = '01930000-0000-7000-8000-000000001212';
const PART_PATIENT_DONE = '01930000-0000-7000-8000-000000001213';
const PART_CLINICIAN_DONE = '01930000-0000-7000-8000-000000001214';
const MSG_1 = '01930000-0000-7000-8000-000000001221';
const MSG_2 = '01930000-0000-7000-8000-000000001222';
const WAIT_1 = '01930000-0000-7000-8000-000000001231';
const REC_1 = '01930000-0000-7000-8000-000000001241';
const NOTE_1 = '01930000-0000-7000-8000-000000001251';

export const telemedicineSeed: SeedModule = {
  name: 'telemedicine',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(yesterday.getTime() + 30 * 60 * 1000);

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.telemedicineSession.upsert({
          where: { id: SESSION_SCHEDULED },
          create: {
            id: SESSION_SCHEDULED,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            clinicianId: DEMO_PHYSICIAN_ID,
            clinicianName: 'Dr. Emily Chen',
            facilityId: DEMO_FACILITY_PARIS,
            meetingNumber: 'TM-000001',
            meetingPassword: 'demo123',
            platform: 'webrtc',
            roomId: 'room-scheduled-001',
            sessionType: 'consultation',
            specialty: 'Internal Medicine',
            scheduledStart: inOneHour,
            scheduledEnd: inTwoHours,
            timezone: 'Europe/Paris',
            language: 'en',
            status: 'scheduled',
            waitingRoomEnabled: true,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'scheduled',
            scheduledStart: inOneHour,
            scheduledEnd: inTwoHours,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.waitingRoomEntry.upsert({
          where: { id: WAIT_1 },
          create: {
            id: WAIT_1,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_SCHEDULED,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            status: 'waiting',
            joinedAt: now,
            estimatedWaitMinutes: 8,
            priority: 'normal',
          },
          update: {
            status: 'waiting',
            joinedAt: now,
          },
        });

        await tx.telemedicineSession.upsert({
          where: { id: SESSION_ACTIVE },
          create: {
            id: SESSION_ACTIVE,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            clinicianId: DEMO_PHYSICIAN_ID,
            clinicianName: 'Dr. Emily Chen',
            facilityId: DEMO_FACILITY_PARIS,
            meetingNumber: 'TM-000002',
            platform: 'webrtc',
            roomId: 'room-active-002',
            sessionType: 'follow_up',
            specialty: 'Internal Medicine',
            scheduledStart: now,
            scheduledEnd: inOneHour,
            actualStart: now,
            timezone: 'Europe/Paris',
            language: 'en',
            status: 'in_progress',
            recordingStatus: 'none',
            qualityScore: 4.5,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'in_progress',
            actualStart: now,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.sessionParticipant.upsert({
          where: { id: PART_PATIENT_ACTIVE },
          create: {
            id: PART_PATIENT_ACTIVE,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_ACTIVE,
            userId: DEMO_PATIENT_ID,
            name: 'Sarah Jenkins',
            role: 'patient',
            joinedAt: now,
            cameraOn: true,
            microphoneOn: true,
            connectionQuality: 'good',
            deviceType: 'desktop',
            browser: 'Chrome',
            networkType: 'wifi',
            permissions: ['chat', 'files'],
          },
          update: {
            joinedAt: now,
            cameraOn: true,
            microphoneOn: true,
          },
        });

        await tx.sessionParticipant.upsert({
          where: { id: PART_CLINICIAN_ACTIVE },
          create: {
            id: PART_CLINICIAN_ACTIVE,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_ACTIVE,
            userId: DEMO_PHYSICIAN_ID,
            name: 'Dr. Emily Chen',
            role: 'clinician',
            joinedAt: now,
            cameraOn: true,
            microphoneOn: true,
            connectionQuality: 'excellent',
            deviceType: 'desktop',
            browser: 'Chrome',
            networkType: 'ethernet',
            permissions: ['host', 'record', 'chat', 'files'],
          },
          update: {
            joinedAt: now,
          },
        });

        await tx.sessionMessage.upsert({
          where: { id: MSG_1 },
          create: {
            id: MSG_1,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_ACTIVE,
            senderId: DEMO_PHYSICIAN_ID,
            senderName: 'Dr. Emily Chen',
            content: 'Good morning Sarah — how are your glucose readings?',
            sentAt: now,
            deliveryStatus: 'delivered',
          },
          update: {
            content: 'Good morning Sarah — how are your glucose readings?',
          },
        });

        await tx.sessionMessage.upsert({
          where: { id: MSG_2 },
          create: {
            id: MSG_2,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_ACTIVE,
            senderId: DEMO_PATIENT_ID,
            senderName: 'Sarah Jenkins',
            content: 'Morning readings around 118–125 mg/dL.',
            sentAt: now,
            deliveryStatus: 'read',
            readAt: now,
          },
          update: {
            content: 'Morning readings around 118–125 mg/dL.',
          },
        });

        await tx.telemedicineSession.upsert({
          where: { id: SESSION_DONE },
          create: {
            id: SESSION_DONE,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            clinicianId: DEMO_PHYSICIAN_ID,
            clinicianName: 'Dr. Emily Chen',
            facilityId: DEMO_FACILITY_PARIS,
            meetingNumber: 'TM-000003',
            platform: 'webrtc',
            roomId: 'room-done-003',
            sessionType: 'consultation',
            specialty: 'Internal Medicine',
            scheduledStart: yesterday,
            scheduledEnd: yesterdayEnd,
            actualStart: yesterday,
            actualEnd: yesterdayEnd,
            durationMinutes: 28,
            timezone: 'Europe/Paris',
            language: 'en',
            status: 'completed',
            recordingStatus: 'available',
            qualityScore: 4.8,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'completed',
            durationMinutes: 28,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.sessionParticipant.upsert({
          where: { id: PART_PATIENT_DONE },
          create: {
            id: PART_PATIENT_DONE,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_DONE,
            userId: DEMO_PATIENT_ID,
            name: 'Sarah Jenkins',
            role: 'patient',
            joinedAt: yesterday,
            leftAt: yesterdayEnd,
            cameraOn: false,
            microphoneOn: false,
            connectionQuality: 'good',
            permissions: ['chat'],
          },
          update: {
            leftAt: yesterdayEnd,
          },
        });

        await tx.sessionParticipant.upsert({
          where: { id: PART_CLINICIAN_DONE },
          create: {
            id: PART_CLINICIAN_DONE,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_DONE,
            userId: DEMO_PHYSICIAN_ID,
            name: 'Dr. Emily Chen',
            role: 'clinician',
            joinedAt: yesterday,
            leftAt: yesterdayEnd,
            cameraOn: false,
            microphoneOn: false,
            connectionQuality: 'excellent',
            permissions: ['host', 'record'],
          },
          update: {
            leftAt: yesterdayEnd,
          },
        });

        await tx.sessionClinicalNote.upsert({
          where: { id: NOTE_1 },
          create: {
            id: NOTE_1,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_DONE,
            patientId: DEMO_PATIENT_ID,
            clinicianId: DEMO_PHYSICIAN_ID,
            subjective: 'Follow-up for type 2 diabetes. Reports good adherence.',
            objective: 'Vitals stable. HbA1c previously 6.8%.',
            assessment: 'Type 2 DM — controlled on current regimen.',
            plan: 'Continue metformin; lifestyle counseling reinforced.',
            diagnosis: 'E11.9 Type 2 diabetes mellitus',
            followUp: 'Telemedicine follow-up in 3 months',
            status: 'signed',
          },
          update: {
            status: 'signed',
            assessment: 'Type 2 DM — controlled on current regimen.',
          },
        });

        await tx.sessionRecording.upsert({
          where: { id: REC_1 },
          create: {
            id: REC_1,
            tenantId: DEMO_TENANT_ID,
            sessionId: SESSION_DONE,
            consentGiven: true,
            status: 'available',
            durationSeconds: 1680,
            storageUrl: '/api/telemedicine/recordings/demo-001.mp4',
            retentionDays: 90,
            startedAt: yesterday,
            stoppedAt: yesterdayEnd,
          },
          update: {
            status: 'available',
            consentGiven: true,
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
