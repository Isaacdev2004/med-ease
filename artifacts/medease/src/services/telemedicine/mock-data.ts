import type {
  ChatMessage,
  ClinicalNote,
  ProviderAvailability,
  SessionAttachment,
  SessionRecording,
  SessionStatus,
  SessionTimelineEntry,
  SessionType,
  TelemedicineSession,
  VideoParticipant,
  VideoPlatform,
  WaitingRoomEntry,
  WhiteboardSession,
} from '@/services/telemedicine/types';
import {
  AUTH_USER_PATIENT_MAP,
  TELEMEDICINE_PATIENT_IDS,
} from '@/services/telemedicine/types';

const CLINICIANS = [
  { id: 'prov-001', name: 'Dr. Emily Chen', specialty: 'General Practice' },
  { id: 'prov-002', name: 'Dr. Pierre Martin', specialty: 'Cardiology' },
  { id: 'prov-003', name: 'Dr. Sophie Bernard', specialty: 'Dermatology' },
  { id: 'prov-004', name: 'Dr. Jean Dupont', specialty: 'Psychiatry' },
];

const PATIENT_NAMES = [
  'Sarah Jenkins',
  'Jean Dupont',
  'Marie Laurent',
  'Pierre Martin',
  'Sophie Bernard',
];

const PLATFORMS: VideoPlatform[] = [
  'webrtc',
  'twilio',
  'agora',
  'daily',
  'zoom',
  'teams',
];
const SESSION_TYPES: SessionType[] = [
  'consultation',
  'follow_up',
  'urgent',
  'specialist',
  'group',
];
const STATUSES: SessionStatus[] = [
  'scheduled',
  'waiting',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
];

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9 + (n % 8), (n * 11) % 60, 0, 0);
  return d.toISOString();
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + (n % 6), (n * 13) % 60, 0, 0);
  return d.toISOString();
}

function patientName(id: string) {
  const idx = parseInt(id.replace('phr-', ''), 10) - 1;
  return PATIENT_NAMES[idx % PATIENT_NAMES.length] ?? `Patient ${id}`;
}

export const MOCK_SESSIONS: TelemedicineSession[] = Array.from(
  { length: 500 },
  (_, i) => {
    const patientId = TELEMEDICINE_PATIENT_IDS[i % 40]!;
    const clinician = CLINICIANS[i % CLINICIANS.length]!;
    const isFuture = i % 5 === 0;
    const status = isFuture ? 'scheduled' : STATUSES[i % STATUSES.length]!;
    const start = isFuture ? daysFromNow(i % 14) : daysAgo(i % 90);
    const end = new Date(
      new Date(start).getTime() + 30 * 60 * 1000,
    ).toISOString();
    return {
      sessionId: `tel-${String(i + 1).padStart(5, '0')}`,
      appointmentId: `apt-${1000 + i}`,
      encounterId: status === 'completed' ? `enc-${i + 1}` : undefined,
      patientId,
      patientName: patientName(patientId),
      clinicianId: clinician.id,
      clinicianName: clinician.name,
      facilityId: `fac-${(i % 25) + 1}`,
      meetingNumber: `${100000 + i}`,
      meetingPassword: i % 3 === 0 ? String(1000 + (i % 9000)) : undefined,
      platform: PLATFORMS[i % PLATFORMS.length]!,
      roomId: `room-${i + 1}`,
      sessionType: SESSION_TYPES[i % SESSION_TYPES.length]!,
      specialty: clinician.specialty,
      scheduledStart: start,
      scheduledEnd: end,
      actualStart:
        status === 'completed' || status === 'in_progress' ? start : undefined,
      actualEnd: status === 'completed' ? end : undefined,
      duration: status === 'completed' ? 20 + (i % 40) : undefined,
      timezone: 'Europe/Paris',
      language: i % 10 === 0 ? 'fr' : 'en',
      interpreterRequired: i % 15 === 0,
      status,
      recordingStatus:
        i % 4 === 0 ? 'available' : i % 7 === 0 ? 'recording' : 'none',
      waitingRoomEnabled: true,
      encryption: true,
      qualityScore: 70 + (i % 30),
      notes: i % 8 === 0 ? 'Follow-up in 2 weeks' : undefined,
      createdAt: daysAgo(i % 120),
      updatedAt: daysAgo(i % 30),
    };
  },
);

export const MOCK_MESSAGES: ChatMessage[] = Array.from(
  { length: 3000 },
  (_, i) => {
    const session = MOCK_SESSIONS[i % MOCK_SESSIONS.length]!;
    const isPatient = i % 2 === 0;
    return {
      id: `msg-${String(i + 1).padStart(5, '0')}`,
      sessionId: session.sessionId,
      senderId: isPatient ? session.patientId : session.clinicianId,
      senderName: isPatient ? session.patientName : session.clinicianName,
      content: [
        'Good morning, how are you feeling today?',
        'I have been experiencing headaches for the past week.',
        'Can you describe the pain intensity on a scale of 1-10?',
        'It is about a 6, mostly in the afternoon.',
        'I will review your recent lab results.',
        'Thank you doctor.',
      ][i % 6]!,
      sentAt: daysAgo(Math.floor(i / 50)),
      deliveryStatus: (['sent', 'delivered', 'read'] as const)[i % 3]!,
      readAt: i % 3 === 2 ? daysAgo(Math.floor(i / 50)) : undefined,
      reactions:
        i % 20 === 0
          ? [{ emoji: '👍', userId: session.clinicianId }]
          : undefined,
      pinned: i % 100 === 0,
    };
  },
);

export const MOCK_ATTACHMENTS: SessionAttachment[] = Array.from(
  { length: 600 },
  (_, i) => {
    const session = MOCK_SESSIONS[i % MOCK_SESSIONS.length]!;
    const types = [
      'image',
      'pdf',
      'lab',
      'radiology',
      'prescription',
      'consent',
      'document',
    ] as const;
    const type = types[i % types.length]!;
    return {
      id: `att-${String(i + 1).padStart(5, '0')}`,
      sessionId: session.sessionId,
      name: `${type}-file-${i + 1}.${type === 'image' ? 'png' : 'pdf'}`,
      type,
      mimeType: type === 'image' ? 'image/png' : 'application/pdf',
      sizeBytes: 50000 + (i % 500000),
      uploadedBy: i % 2 === 0 ? session.patientId : session.clinicianId,
      uploadedAt: daysAgo(i % 60),
      url: `/mock/telemedicine/${session.sessionId}/${i + 1}`,
    };
  },
);

export const MOCK_RECORDINGS: SessionRecording[] = Array.from(
  { length: 200 },
  (_, i) => {
    const session =
      MOCK_SESSIONS.filter((s) => s.recordingStatus !== 'none')[i % 100] ??
      MOCK_SESSIONS[i]!;
    return {
      id: `rec-${String(i + 1).padStart(4, '0')}`,
      sessionId: session.sessionId,
      consentGiven: true,
      status:
        session.recordingStatus === 'recording' ? 'recording' : 'available',
      durationSeconds: 900 + (i % 1800),
      storageUrl: `/mock/recordings/${session.sessionId}.mp4`,
      retentionDays: 90,
      transcription:
        i % 3 === 0
          ? 'Patient discussed symptoms and treatment plan...'
          : undefined,
      startedAt: session.actualStart,
      stoppedAt: session.actualEnd,
    };
  },
);

export const MOCK_WAITING_ROOM: WaitingRoomEntry[] = Array.from(
  { length: 150 },
  (_, i) => {
    const session =
      MOCK_SESSIONS.filter(
        (s) => s.status === 'waiting' || s.status === 'scheduled',
      )[i % 50] ?? MOCK_SESSIONS[i]!;
    return {
      id: `wr-${String(i + 1).padStart(4, '0')}`,
      sessionId: session.sessionId,
      patientId: session.patientId,
      patientName: session.patientName,
      status: (['waiting', 'admitted', 'rejected', 'left'] as const)[
        i % 8 === 0 ? 2 : i % 6 === 0 ? 1 : 0
      ]!,
      joinedAt: daysAgo(i % 2),
      admittedAt: i % 6 === 0 ? daysAgo(i % 2) : undefined,
      estimatedWaitMinutes: 5 + (i % 25),
      priority: (['normal', 'urgent', 'high'] as const)[i % 10 === 0 ? 1 : 0]!,
    };
  },
);

export const MOCK_WHITEBOARDS: WhiteboardSession[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: `wb-${String(i + 1).padStart(4, '0')}`,
    sessionId: MOCK_SESSIONS[i % MOCK_SESSIONS.length]!.sessionId,
    createdBy: CLINICIANS[i % CLINICIANS.length]!.id,
    createdAt: daysAgo(i % 30),
    updatedAt: daysAgo(i % 5),
    strokeCount: 10 + (i % 100),
    exportedUrl: i % 5 === 0 ? `/mock/whiteboard/wb-${i + 1}.png` : undefined,
  }),
);

export const MOCK_PARTICIPANTS: VideoParticipant[] = MOCK_SESSIONS.slice(
  0,
  300,
).flatMap((s, i) => [
  {
    id: `part-${i}-p`,
    sessionId: s.sessionId,
    name: s.patientName,
    role: 'patient' as const,
    joinedAt: s.actualStart,
    leftAt: s.actualEnd,
    cameraOn: i % 5 !== 0,
    microphoneOn: i % 7 !== 0,
    screenSharing: false,
    connectionQuality: (['excellent', 'good', 'fair', 'poor'] as const)[i % 4]!,
    deviceType: 'mobile',
    browser: 'Chrome',
    networkType: 'wifi',
    permissions: ['join', 'chat'],
  },
  {
    id: `part-${i}-c`,
    sessionId: s.sessionId,
    name: s.clinicianName,
    role: 'clinician' as const,
    joinedAt: s.actualStart,
    leftAt: s.actualEnd,
    cameraOn: true,
    microphoneOn: true,
    screenSharing: i % 10 === 0,
    connectionQuality: 'excellent' as const,
    deviceType: 'desktop',
    browser: 'Chrome',
    networkType: 'ethernet',
    permissions: ['join', 'chat', 'record', 'host'],
  },
]);

export const MOCK_CLINICAL_NOTES: ClinicalNote[] = MOCK_SESSIONS.filter(
  (s) => s.status === 'completed',
)
  .slice(0, 200)
  .map((s, i) => ({
    id: `note-${String(i + 1).padStart(4, '0')}`,
    sessionId: s.sessionId,
    patientId: s.patientId,
    clinicianId: s.clinicianId,
    subjective: 'Patient reports symptoms as discussed during visit.',
    objective: 'Vitals reviewed remotely. Patient appears well.',
    assessment: 'Stable condition, continue current management.',
    plan: 'Continue medications. Follow-up in 4 weeks.',
    diagnosis: 'Essential hypertension',
    treatment: 'Lifestyle modification, medication review',
    recommendations: 'Monitor blood pressure daily',
    followUp: 'Telemedicine follow-up in 4 weeks',
    status: i % 5 === 0 ? 'draft' : 'signed',
    createdAt: s.actualEnd ?? s.scheduledEnd,
    updatedAt: s.updatedAt,
  }));

export const MOCK_PROVIDER_AVAILABILITY: ProviderAvailability[] =
  CLINICIANS.map((c, i) => ({
    providerId: c.id,
    providerName: c.name,
    specialty: c.specialty,
    availableSlots: Array.from({ length: 5 }, (_, j) => ({
      start: daysFromNow(j + 1 + i),
      end: new Date(
        new Date(daysFromNow(j + 1 + i)).getTime() + 30 * 60 * 1000,
      ).toISOString(),
    })),
    telemedicineEnabled: true,
  }));

export function getPatientIdForUser(userId: string) {
  return AUTH_USER_PATIENT_MAP[userId] ?? TELEMEDICINE_PATIENT_IDS[0]!;
}

export function buildDashboard(patientId?: string, clinicianId?: string) {
  let sessions = MOCK_SESSIONS;
  if (patientId) sessions = sessions.filter((s) => s.patientId === patientId);
  if (clinicianId)
    sessions = sessions.filter((s) => s.clinicianId === clinicianId);
  const now = new Date();
  const upcoming = sessions.filter(
    (s) => s.status === 'scheduled' && new Date(s.scheduledStart) >= now,
  );
  const active = sessions.filter(
    (s) => s.status === 'in_progress' || s.status === 'waiting',
  );
  const completedToday = sessions.filter(
    (s) =>
      s.status === 'completed' &&
      s.actualEnd?.slice(0, 10) === now.toISOString().slice(0, 10),
  );
  const waiting = MOCK_WAITING_ROOM.filter(
    (w) =>
      w.status === 'waiting' &&
      sessions.some((s) => s.sessionId === w.sessionId),
  );

  return {
    upcomingSessions: upcoming.length,
    activeSessions: active.length,
    completedToday: completedToday.length,
    waitingRoomCount: waiting.length,
    averageQuality: Math.round(
      sessions.reduce((sum, s) => sum + (s.qualityScore ?? 80), 0) /
        Math.max(sessions.length, 1),
    ),
    recentSessions: sessions.slice(0, 8),
  };
}

export function buildTimeline(sessionId: string): SessionTimelineEntry[] {
  const session = MOCK_SESSIONS.find((s) => s.sessionId === sessionId);
  if (!session) return [];
  const messages = MOCK_MESSAGES.filter((m) => m.sessionId === sessionId).slice(
    0,
    10,
  );
  const notes = MOCK_CLINICAL_NOTES.filter((n) => n.sessionId === sessionId);
  const files = MOCK_ATTACHMENTS.filter((a) => a.sessionId === sessionId).slice(
    0,
    5,
  );
  const entries: SessionTimelineEntry[] = [
    {
      id: `${sessionId}-sched`,
      sessionId,
      date: session.scheduledStart,
      type: 'join',
      title: 'Session scheduled',
      description: session.specialty,
    },
    ...(session.actualStart
      ? [
          {
            id: `${sessionId}-start`,
            sessionId,
            date: session.actualStart,
            type: 'join' as const,
            title: 'Session started',
            description: 'Video consultation began',
            actor: session.clinicianName,
          },
        ]
      : []),
    ...messages.map((m) => ({
      id: m.id,
      sessionId,
      date: m.sentAt,
      type: 'message' as const,
      title: 'Chat message',
      description: m.content.slice(0, 80),
      actor: m.senderName,
    })),
    ...files.map((f) => ({
      id: f.id,
      sessionId,
      date: f.uploadedAt,
      type: 'file' as const,
      title: 'File uploaded',
      description: f.name,
    })),
    ...notes.map((n) => ({
      id: n.id,
      sessionId,
      date: n.updatedAt,
      type: 'note' as const,
      title: 'Clinical note saved',
      description: n.assessment.slice(0, 80),
    })),
  ];
  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
