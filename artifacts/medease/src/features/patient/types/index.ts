export interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  refillsRemaining: number;
}

export interface PatientAppointmentSummary {
  id: string;
  providerName: string;
  specialty: string;
  scheduledAt: string;
  location: string;
}

export interface PatientDashboardData {
  patientId: string;
  greetingName: string;
  nextAppointment: PatientAppointmentSummary | null;
  recentTestLabel: string;
  medications: PatientMedication[];
}

export interface Appointment {
  id: string;
  patientId: string;
  providerName: string;
  specialty: string;
  scheduledAt: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
