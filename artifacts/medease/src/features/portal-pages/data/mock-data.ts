export interface PatientRow {
  id: string;
  name: string;
  mrn: string;
  ward: string;
  status: 'stable' | 'critical' | 'observation' | 'discharged';
  attending: string;
}

export interface AdmissionRow {
  id: string;
  patient: string;
  mrn: string;
  ward: string;
  admittedAt: string;
  status: 'pending' | 'admitted' | 'discharged';
  priority: 'routine' | 'urgent';
}

export interface TransferRow {
  id: string;
  patient: string;
  fromWard: string;
  toWard: string;
  requestedAt: string;
  status: 'requested' | 'in-transit' | 'completed' | 'cancelled';
}

export interface ConsultationRow {
  id: string;
  patient: string;
  specialty: string;
  scheduledAt: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  provider: string;
}

export interface ClinicalTaskRow {
  id: string;
  task: string;
  patient: string;
  dueAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'done';
}

export interface BedRow {
  id: string;
  ward: string;
  bed: string;
  type: string;
  status: 'available' | 'occupied' | 'cleaning' | 'reserved';
  patient?: string;
}

export interface ProfessionalRow {
  id: string;
  name: string;
  specialty: string;
  license: string;
  facility: string;
  status: 'active' | 'on-leave' | 'inactive';
}

export interface MedicationRequestRow {
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'dispensed' | 'rejected';
}

export interface VaccinationRow {
  id: string;
  vaccine: string;
  dose: string;
  administeredAt: string;
  provider: string;
  status: 'completed' | 'due' | 'overdue';
}

export interface VehicleRow {
  id: string;
  unit: string;
  type: string;
  capacity: number;
  status: 'available' | 'en-route' | 'maintenance' | 'offline';
  lastService: string;
}

export interface DriverRow {
  id: string;
  name: string;
  license: string;
  shift: string;
  status: 'on-duty' | 'off-duty' | 'on-call';
  certifications: string;
}

export interface TransportScheduleRow {
  id: string;
  patient: string;
  pickup: string;
  destination: string;
  scheduledAt: string;
  status: 'scheduled' | 'dispatched' | 'completed' | 'cancelled';
}

export interface TransportHistoryRow {
  id: string;
  patient: string;
  route: string;
  completedAt: string;
  duration: string;
  outcome: 'on-time' | 'delayed' | 'cancelled';
}

export interface FacilityRow {
  id: string;
  name: string;
  type: string;
  address: string;
  beds: number;
  status: 'operational' | 'limited' | 'closed';
}

export const MOCK_PATIENTS: PatientRow[] = [
  { id: 'p1', name: 'Maria Santos', mrn: 'MRN-10482', ward: 'ICU-3', status: 'critical', attending: 'Dr. Chen' },
  { id: 'p2', name: 'James Okafor', mrn: 'MRN-10491', ward: 'Med-Surg 2B', status: 'stable', attending: 'Dr. Patel' },
  { id: 'p3', name: 'Elena Rodriguez', mrn: 'MRN-10503', ward: 'Pediatrics', status: 'observation', attending: 'Dr. Kim' },
  { id: 'p4', name: 'Robert Vance', mrn: 'MRN-10517', ward: 'Cardiology', status: 'stable', attending: 'Dr. Nguyen' },
  { id: 'p5', name: 'Aisha Mohammed', mrn: 'MRN-10528', ward: 'Maternity', status: 'stable', attending: 'Dr. Lewis' },
];

export const MOCK_ADMISSIONS: AdmissionRow[] = [
  { id: 'a1', patient: 'Thomas Wright', mrn: 'MRN-10531', ward: 'Emergency', admittedAt: '2026-07-15 08:12', status: 'pending', priority: 'urgent' },
  { id: 'a2', patient: 'Grace Liu', mrn: 'MRN-10529', ward: 'Orthopedics', admittedAt: '2026-07-15 07:45', status: 'admitted', priority: 'routine' },
  { id: 'a3', patient: 'David Cohen', mrn: 'MRN-10522', ward: 'Neurology', admittedAt: '2026-07-14 22:30', status: 'admitted', priority: 'urgent' },
  { id: 'a4', patient: 'Sophie Martin', mrn: 'MRN-10518', ward: 'Med-Surg 4A', admittedAt: '2026-07-14 16:00', status: 'discharged', priority: 'routine' },
];

export const MOCK_TRANSFERS: TransferRow[] = [
  { id: 't1', patient: 'Maria Santos', fromWard: 'Emergency', toWard: 'ICU-3', requestedAt: '2026-07-15 09:00', status: 'in-transit' },
  { id: 't2', patient: 'James Okafor', fromWard: 'Med-Surg 2B', toWard: 'Rehab', requestedAt: '2026-07-15 10:30', status: 'requested' },
  { id: 't3', patient: 'Elena Rodriguez', fromWard: 'Pediatrics', toWard: 'Observation', requestedAt: '2026-07-14 18:15', status: 'completed' },
];

export const MOCK_CONSULTATIONS: ConsultationRow[] = [
  { id: 'c1', patient: 'Robert Vance', specialty: 'Cardiology', scheduledAt: '2026-07-15 11:00', status: 'scheduled', provider: 'Dr. Nguyen' },
  { id: 'c2', patient: 'Aisha Mohammed', specialty: 'Obstetrics', scheduledAt: '2026-07-15 09:30', status: 'in-progress', provider: 'Dr. Lewis' },
  { id: 'c3', patient: 'David Cohen', specialty: 'Neurology', scheduledAt: '2026-07-15 14:00', status: 'scheduled', provider: 'Dr. Shah' },
];

export const MOCK_CLINICAL_TASKS: ClinicalTaskRow[] = [
  { id: 'k1', task: 'Review lab results', patient: 'Maria Santos', dueAt: '2026-07-15 12:00', priority: 'high', status: 'open' },
  { id: 'k2', task: 'Medication reconciliation', patient: 'James Okafor', dueAt: '2026-07-15 15:00', priority: 'medium', status: 'in-progress' },
  { id: 'k3', task: 'Discharge summary', patient: 'Sophie Martin', dueAt: '2026-07-15 17:00', priority: 'low', status: 'open' },
  { id: 'k4', task: 'Wound dressing change', patient: 'Grace Liu', dueAt: '2026-07-15 13:30', priority: 'medium', status: 'done' },
];

export const MOCK_BEDS: BedRow[] = [
  { id: 'b1', ward: 'ICU-3', bed: 'ICU-3-01', type: 'Critical care', status: 'occupied', patient: 'Maria Santos' },
  { id: 'b2', ward: 'ICU-3', bed: 'ICU-3-02', type: 'Critical care', status: 'available' },
  { id: 'b3', ward: 'Med-Surg 2B', bed: 'MS2B-14', type: 'Standard', status: 'occupied', patient: 'James Okafor' },
  { id: 'b4', ward: 'Med-Surg 2B', bed: 'MS2B-15', type: 'Standard', status: 'cleaning' },
  { id: 'b5', ward: 'Pediatrics', bed: 'PED-08', type: 'Pediatric', status: 'reserved', patient: 'Elena Rodriguez' },
];

export const MOCK_PROFESSIONALS: ProfessionalRow[] = [
  { id: 'hp1', name: 'Dr. Emily Chen', specialty: 'Internal Medicine', license: 'MD-48291', facility: 'Central Hospital', status: 'active' },
  { id: 'hp2', name: 'Dr. Raj Patel', specialty: 'Surgery', license: 'MD-39102', facility: 'Central Hospital', status: 'active' },
  { id: 'hp3', name: 'Nurse Sarah Kim', specialty: 'Critical Care', license: 'RN-77201', facility: 'North Clinic', status: 'on-leave' },
  { id: 'hp4', name: 'Dr. Michael Nguyen', specialty: 'Cardiology', license: 'MD-55820', facility: 'Heart Institute', status: 'active' },
];

export const MOCK_MEDICATION_REQUESTS: MedicationRequestRow[] = [
  { id: 'mr1', patient: 'Maria Santos', medication: 'Heparin', dosage: '5000 units IV', requestedAt: '2026-07-15 08:45', status: 'pending' },
  { id: 'mr2', patient: 'James Okafor', medication: 'Metformin', dosage: '500 mg PO BID', requestedAt: '2026-07-15 07:20', status: 'approved' },
  { id: 'mr3', patient: 'Robert Vance', medication: 'Atorvastatin', dosage: '40 mg PO daily', requestedAt: '2026-07-14 19:00', status: 'dispensed' },
];

export const MOCK_VACCINATIONS: VaccinationRow[] = [
  { id: 'v1', vaccine: 'Influenza (Flu)', dose: 'Annual', administeredAt: '2025-10-12', provider: 'North Clinic', status: 'completed' },
  { id: 'v2', vaccine: 'Tdap', dose: 'Booster', administeredAt: '2024-03-08', provider: 'Central Hospital', status: 'completed' },
  { id: 'v3', vaccine: 'COVID-19', dose: 'Fall 2026', administeredAt: '—', provider: '—', status: 'due' },
  { id: 'v4', vaccine: 'Shingles (Shingrix)', dose: 'Dose 2', administeredAt: '—', provider: '—', status: 'overdue' },
];

export const MOCK_VEHICLES: VehicleRow[] = [
  { id: 'veh1', unit: 'AMB-101', type: 'ALS Ambulance', capacity: 2, status: 'en-route', lastService: '2026-07-01' },
  { id: 'veh2', unit: 'AMB-204', type: 'BLS Ambulance', capacity: 2, status: 'available', lastService: '2026-06-28' },
  { id: 'veh3', unit: 'VAN-12', type: 'Wheelchair van', capacity: 4, status: 'maintenance', lastService: '2026-07-10' },
];

export const MOCK_DRIVERS: DriverRow[] = [
  { id: 'd1', name: 'Carlos Mendez', license: 'EMT-P-4421', shift: 'Day (06:00–18:00)', status: 'on-duty', certifications: 'ALS, PHTLS' },
  { id: 'd2', name: 'Jennifer Walsh', license: 'EMT-B-8832', shift: 'Night (18:00–06:00)', status: 'off-duty', certifications: 'BLS, EVOC' },
  { id: 'd3', name: 'Marcus Johnson', license: 'EMT-P-1190', shift: 'On-call', status: 'on-call', certifications: 'ALS, CCEMTP' },
];

export const MOCK_TRANSPORT_SCHEDULES: TransportScheduleRow[] = [
  { id: 'ts1', patient: 'Thomas Wright', pickup: 'North Clinic', destination: 'Central Hospital ER', scheduledAt: '2026-07-15 11:30', status: 'scheduled' },
  { id: 'ts2', patient: 'Grace Liu', pickup: 'Central Hospital', destination: 'Rehab Center', scheduledAt: '2026-07-15 14:00', status: 'dispatched' },
  { id: 'ts3', patient: 'David Cohen', pickup: 'Heart Institute', destination: 'Central Hospital', scheduledAt: '2026-07-14 20:15', status: 'completed' },
];

export const MOCK_TRANSPORT_HISTORY: TransportHistoryRow[] = [
  { id: 'th1', patient: 'Sophie Martin', route: 'Med-Surg → Home', completedAt: '2026-07-14 11:45', duration: '42 min', outcome: 'on-time' },
  { id: 'th2', patient: 'Elena Rodriguez', route: 'Pediatrics → Imaging', completedAt: '2026-07-13 15:20', duration: '28 min', outcome: 'on-time' },
  { id: 'th3', patient: 'James Okafor', route: 'Clinic → Central Hospital', completedAt: '2026-07-12 09:10', duration: '55 min', outcome: 'delayed' },
];

export const MOCK_FACILITIES: FacilityRow[] = [
  { id: 'f1', name: 'Central Hospital', type: 'Acute care', address: '1200 Medical Center Dr', beds: 420, status: 'operational' },
  { id: 'f2', name: 'North Clinic', type: 'Outpatient', address: '88 Wellness Blvd', beds: 0, status: 'operational' },
  { id: 'f3', name: 'Heart Institute', type: 'Specialty', address: '450 Cardiac Way', beds: 86, status: 'limited' },
];

export const MOCK_PROFILE = {
  name: 'Dr. Emily Chen',
  role: 'Attending Physician',
  department: 'Internal Medicine',
  email: 'emily.chen@medease.health',
  phone: '+1 (555) 012-8842',
  license: 'MD-48291',
  facility: 'Central Hospital',
  languages: ['English', 'Mandarin'],
  credentials: ['Board Certified Internal Medicine', 'ACLS', 'BLS'],
};

export const MOCK_EMERGENCY_PROFILE = {
  bloodType: 'O+',
  allergies: ['Penicillin', 'Shellfish'],
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  emergencyContact: { name: 'David Chen', relation: 'Spouse', phone: '+1 (555) 012-9901' },
  medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  primaryCare: 'Dr. Emily Chen',
  insurance: 'BlueCross PPO — Policy #BC-8849201',
};
