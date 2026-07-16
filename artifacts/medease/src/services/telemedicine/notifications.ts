import type { ChatMessage, TelemedicineSession } from '@/services/telemedicine/types';

type TelemedicineNotification = {
  id: string;
  title: string;
  message: string;
  type: 'telemedicine';
  priority: 'low' | 'normal' | 'high' | 'urgent';
};

export function buildAppointmentReminderNotification(session: TelemedicineSession): TelemedicineNotification {
  return {
    id: `notif-reminder-${session.sessionId}`,
    title: 'Telemedicine appointment reminder',
    message: `Your virtual visit with ${session.clinicianName} starts at ${new Date(session.scheduledStart).toLocaleString()}`,
    type: 'telemedicine',
    priority: 'normal',
  };
}

export function buildJoinSessionNotification(session: TelemedicineSession): TelemedicineNotification {
  return {
    id: `notif-join-${session.sessionId}`,
    title: 'Join your virtual visit',
    message: `Session ${session.meetingNumber} is ready. Click to join.`,
    type: 'telemedicine',
    priority: 'high',
  };
}

export function buildWaitingRoomNotification(patientName: string): TelemedicineNotification {
  return {
    id: `notif-wr-${Date.now()}`,
    title: 'Patient in waiting room',
    message: `${patientName} is waiting to be admitted`,
    type: 'telemedicine',
    priority: 'high',
  };
}

export function buildSessionStartedNotification(session: TelemedicineSession): TelemedicineNotification {
  return {
    id: `notif-start-${session.sessionId}`,
    title: 'Session started',
    message: `Virtual consultation with ${session.clinicianName} has begun`,
    type: 'telemedicine',
    priority: 'normal',
  };
}

export function buildRecordingStartedNotification(): TelemedicineNotification {
  return { id: `notif-rec-start-${Date.now()}`, title: 'Recording started', message: 'This session is being recorded with your consent', type: 'telemedicine', priority: 'normal' };
}

export function buildRecordingStoppedNotification(): TelemedicineNotification {
  return { id: `notif-rec-stop-${Date.now()}`, title: 'Recording stopped', message: 'Session recording has ended', type: 'telemedicine', priority: 'low' };
}

export function buildMissedVisitNotification(session: TelemedicineSession): TelemedicineNotification {
  return {
    id: `notif-missed-${session.sessionId}`,
    title: 'Missed virtual visit',
    message: `You missed your telemedicine appointment scheduled for ${new Date(session.scheduledStart).toLocaleString()}`,
    type: 'telemedicine',
    priority: 'high',
  };
}

export function buildProviderJoinedNotification(clinicianName: string): TelemedicineNotification {
  return { id: `notif-prov-${Date.now()}`, title: 'Provider joined', message: `${clinicianName} has joined the session`, type: 'telemedicine', priority: 'normal' };
}

export function buildChatMessageNotification(message: ChatMessage): TelemedicineNotification {
  return { id: `notif-chat-${message.id}`, title: 'New secure message', message: message.content.slice(0, 100), type: 'telemedicine', priority: 'normal' };
}

export function buildFileUploadedNotification(fileName: string): TelemedicineNotification {
  return { id: `notif-file-${Date.now()}`, title: 'File uploaded', message: `${fileName} was shared in the session`, type: 'telemedicine', priority: 'low' };
}

export function buildVisitSummaryNotification(session: TelemedicineSession): TelemedicineNotification {
  return { id: `notif-summary-${session.sessionId}`, title: 'Visit summary available', message: 'Your telemedicine visit summary is ready to review', type: 'telemedicine', priority: 'normal' };
}

export function buildFollowUpReminderNotification(session: TelemedicineSession): TelemedicineNotification {
  return { id: `notif-followup-${session.sessionId}`, title: 'Follow-up reminder', message: session.notes ?? 'Schedule your follow-up visit', type: 'telemedicine', priority: 'normal' };
}

export function buildPrescriptionReadyNotification(): TelemedicineNotification {
  return { id: `notif-rx-${Date.now()}`, title: 'Prescription ready', message: 'Your prescription from the virtual visit is available', type: 'telemedicine', priority: 'normal' };
}
