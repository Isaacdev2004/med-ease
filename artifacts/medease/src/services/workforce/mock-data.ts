import type {
  Attendance,
  Certification,
  Department,
  Employee,
  LeaveRequest,
  OnCallSchedule,
  OrganizationUnit,
  PayrollSummary,
  PerformanceReview,
  Roster,
  Shift,
  Team,
  Training,
  WorkforceDashboard,
} from '@/services/workforce/types';

const DEPT_TYPES = ['clinical', 'administrative', 'support', 'laboratory', 'radiology', 'pharmacy', 'theatre'] as const;
const ROLES = ['Physician', 'Nurse', 'Pharmacist', 'Lab Technician', 'Radiographer', 'Admin', 'Manager', 'Support Staff'];
const FACILITIES = Array.from({ length: 20 }, (_, i) => ({ id: `fac-${String(i + 1).padStart(3, '0')}`, name: `Hospital ${i + 1}` }));
const CLINICS = Array.from({ length: 50 }, (_, i) => ({ id: `cln-${String(i + 1).padStart(3, '0')}`, name: `Clinic ${i + 1}`, parent: FACILITIES[i % 20]!.id }));

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const MOCK_DEPARTMENTS: Department[] = Array.from({ length: 300 }, (_, i) => {
  const fac = FACILITIES[i % 20]!;
  return {
    departmentId: `dept-${String(i + 1).padStart(4, '0')}`,
    name: `${DEPT_TYPES[i % DEPT_TYPES.length]!.replace('_', ' ')} Dept ${(i % 30) + 1}`,
    code: `DPT-${String(i + 1).padStart(4, '0')}`,
    facilityId: fac.id,
    facilityName: fac.name,
    headEmployeeId: `emp-${String((i % 8000) + 1).padStart(5, '0')}`,
    staffCount: 10 + (i % 80),
    type: DEPT_TYPES[i % DEPT_TYPES.length]!,
  };
});

export const MOCK_TEAMS: Team[] = Array.from({ length: 700 }, (_, i) => ({
  teamId: `team-${String(i + 1).padStart(4, '0')}`,
  name: `Team ${(i % 50) + 1}`,
  departmentId: MOCK_DEPARTMENTS[i % MOCK_DEPARTMENTS.length]!.departmentId,
  leadEmployeeId: `emp-${String((i % 8000) + 1).padStart(5, '0')}`,
  memberCount: 3 + (i % 15),
}));

export const MOCK_ORG_UNITS: OrganizationUnit[] = [
  ...FACILITIES.map((f, i) => ({
    unitId: f.id,
    name: f.name,
    type: 'hospital' as const,
    facilityId: f.id,
    staffCount: 200 + i * 10,
  })),
  ...CLINICS.map((c) => ({
    unitId: c.id,
    name: c.name,
    type: 'clinic' as const,
    parentId: c.parent,
    facilityId: c.parent,
    staffCount: 15 + (parseInt(c.id.replace('cln-', ''), 10) % 30),
  })),
];

function buildCerts(empIdx: number): Certification[] {
  const count = 1 + (empIdx % 3);
  return Array.from({ length: count }, (_, j) => {
    const expDays = 10 + ((empIdx + j) % 120);
    return {
      certificationId: `cert-${empIdx}-${j}`,
      name: ['BLS', 'ACLS', 'Infection Control', 'Fire Safety', 'GDPR'][j % 5]!,
      issuer: 'MedCert Board',
      issueDate: daysAgo(365),
      expiryDate: daysFromNow(expDays),
      status: expDays <= 30 ? 'expiring' as const : 'valid' as const,
      mandatory: j === 0,
    };
  });
}

export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 8000 }, (_, i) => {
  const dept = MOCK_DEPARTMENTS[i % MOCK_DEPARTMENTS.length]!;
  const fac = FACILITIES.find((f) => f.id === dept.facilityId)!;
  const role = ROLES[i % ROLES.length]!;
  const empType = (['full_time', 'part_time', 'contract', 'agency', 'volunteer'] as const)[i % 5]!;
  const first = ['James', 'Maria', 'Chen', 'Aisha', 'Pierre', 'Sarah', 'Olu', 'Elena'][i % 8]!;
  const last = ['Smith', 'Garcia', 'Wei', 'Okonkwo', 'Dubois', 'Johnson', 'Adeyemi', 'Popov'][i % 8]!;
  return {
    employeeId: `emp-${String(i + 1).padStart(5, '0')}`,
    providerId: i % 3 === 0 ? `prov-${String((i % 500) + 1).padStart(4, '0')}` : undefined,
    employeeNumber: `EN-${20250000 + i}`,
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@medease.example.com`,
    phone: `+33 6 ${String(10000000 + i).slice(0, 8)}`,
    jobTitle: role,
    roleId: `role-${(i % 8) + 1}`,
    roleName: role,
    departmentId: dept.departmentId,
    departmentName: dept.name,
    facilityId: fac.id,
    facilityName: fac.name,
    teamId: MOCK_TEAMS[i % MOCK_TEAMS.length]!.teamId,
    employmentType: empType,
    status: i % 50 === 0 ? 'on_leave' : i % 200 === 0 ? 'probation' : 'active',
    hireDate: daysAgo(365 + (i % 2000)),
    managerId: i > 0 ? `emp-${String((i % 100) + 1).padStart(5, '0')}` : undefined,
    licenses: i % 4 === 0 ? [{
      licenseId: `lic-${i}`,
      type: 'Medical License',
      number: `ML-${100000 + i}`,
      issuingBody: 'National Medical Council',
      issueDate: daysAgo(1000),
      expiryDate: daysFromNow(180 + (i % 365)),
      status: (i % 20 === 0 ? 'expiring' : 'valid') as Certification['status'],
    }] : [],
    certifications: buildCerts(i),
    emergencyContacts: [{ name: 'Emergency Contact', relationship: 'Spouse', phone: '+33 6 00000000' }],
    createdAt: daysAgo(400 + (i % 100)),
    updatedAt: daysAgo(i % 30),
  };
});

export const MOCK_SHIFTS: Shift[] = Array.from({ length: 20000 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const dayOffset = i % 60;
  const start = new Date();
  start.setDate(start.getDate() - 30 + dayOffset);
  start.setHours(8 + (i % 3) * 8, 0, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + 8);
  return {
    shiftId: `shf-${String(i + 1).padStart(5, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    departmentId: emp.departmentId,
    facilityId: emp.facilityId,
    shiftType: (['day', 'night', 'evening', 'on_call', 'weekend'] as const)[i % 5]!,
    status: dayOffset < 0 ? 'completed' : dayOffset === 0 ? 'in_progress' : 'scheduled',
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    location: emp.facilityName,
    isOvertime: i % 15 === 0,
  };
});

export const MOCK_ATTENDANCE: Attendance[] = Array.from({ length: 80000 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const dayOffset = i % 90;
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  const late = i % 10 === 0;
  return {
    attendanceId: `att-${String(i + 1).padStart(6, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    date: date.toISOString().slice(0, 10),
    clockIn: `${date.toISOString().slice(0, 10)}T${late ? '09:15' : '08:00'}:00.000Z`,
    clockOut: `${date.toISOString().slice(0, 10)}T17:00:00.000Z`,
    status: i % 20 === 0 ? 'absent' : late ? 'late' : 'present',
    hoursWorked: i % 20 === 0 ? 0 : 8 + (i % 3 === 0 ? 1 : 0),
    overtimeHours: i % 15 === 0 ? 2 : 0,
    lateMinutes: late ? 15 : 0,
    departmentId: emp.departmentId,
  };
});

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = Array.from({ length: 12000 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const days = 1 + (i % 14);
  return {
    leaveId: `lv-${String(i + 1).padStart(5, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    leaveType: (['annual', 'sick', 'maternity', 'study', 'compassionate'] as const)[i % 5]!,
    status: (['pending', 'approved', 'rejected', 'draft'] as const)[i % 4]!,
    startDate: daysFromNow(1 + (i % 30)),
    endDate: daysFromNow(days + (i % 30)),
    days,
    reason: i % 3 === 0 ? 'Personal' : undefined,
    createdAt: daysAgo(i % 14),
  };
});

export const MOCK_TRAINING: Training[] = Array.from({ length: 15000 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const st = (['not_started', 'in_progress', 'completed', 'overdue'] as const)[i % 4]!;
  return {
    trainingId: `trn-${String(i + 1).padStart(5, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    courseName: ['HIPAA', 'Fire Safety', 'Infection Control', 'Clinical Skills', 'Leadership'][i % 5]!,
    category: ['mandatory', 'clinical', 'compliance', 'leadership'][i % 4]!,
    status: st,
    dueDate: daysFromNow(7 + (i % 60)),
    completedDate: st === 'completed' ? daysAgo(10) : undefined,
    mandatory: i % 3 === 0,
    credits: 1 + (i % 5),
  };
});

export const MOCK_PERFORMANCE: PerformanceReview[] = Array.from({ length: 4000 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const score = 60 + (i % 40);
  return {
    reviewId: `prv-${String(i + 1).padStart(5, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    period: `2025 Q${(i % 4) + 1}`,
    rating: score >= 90 ? 'exceptional' : score >= 80 ? 'exceeds' : score >= 70 ? 'meets' : 'needs_improvement',
    score,
    reviewerId: `emp-${String((i % 50) + 1).padStart(5, '0')}`,
    reviewerName: 'Manager',
    goals: [{ goalId: `g-${i}`, title: 'Patient satisfaction', progress: 50 + (i % 50), dueDate: daysFromNow(90), status: 'on_track' }],
    completedAt: daysAgo(30 + (i % 60)),
  };
});

export const MOCK_ON_CALL: OnCallSchedule[] = Array.from({ length: 500 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  return {
    onCallId: `oc-${String(i + 1).padStart(4, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    departmentId: emp.departmentId,
    specialty: emp.jobTitle,
    startTime: daysFromNow(i % 7),
    endTime: daysFromNow((i % 7) + 1),
    escalationLevel: 1 + (i % 3),
  };
});

export const MOCK_PAYROLL: PayrollSummary[] = Array.from({ length: 300 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length]!;
  const base = 3000 + (i % 50) * 200;
  const ot = (i % 5) * 150;
  return {
    payrollId: `pay-${String(i + 1).padStart(4, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    period: '2025-06',
    basePay: base,
    overtimePay: ot,
    deductions: Math.round(base * 0.22),
    netPay: base + ot - Math.round(base * 0.22),
    currency: 'EUR',
    status: 'processed',
  };
});

export const MOCK_ROSTERS: Roster[] = Array.from({ length: 100 }, (_, i) => {
  const dept = MOCK_DEPARTMENTS[i % MOCK_DEPARTMENTS.length]!;
  const shifts = MOCK_SHIFTS.filter((s) => s.departmentId === dept.departmentId).slice(0, 20);
  return {
    rosterId: `rst-${String(i + 1).padStart(4, '0')}`,
    departmentId: dept.departmentId,
    departmentName: dept.name,
    weekStart: daysAgo(7),
    weekEnd: daysFromNow(0),
    shifts,
    coveragePercent: 75 + (i % 25),
    gaps: i % 5,
  };
});

export function buildWorkforceDashboard(facilityId?: string, departmentId?: string): WorkforceDashboard {
  let employees = MOCK_EMPLOYEES.filter((e) => e.status === 'active' || e.status === 'on_leave');
  if (facilityId) employees = employees.filter((e) => e.facilityId === facilityId);
  if (departmentId) employees = employees.filter((e) => e.departmentId === departmentId);

  const pendingLeave = MOCK_LEAVE_REQUESTS.filter((l) => l.status === 'pending');
  const expiringCerts = MOCK_EMPLOYEES.flatMap((e) => e.certifications).filter((c) => c.status === 'expiring');
  const absent = MOCK_ATTENDANCE.filter((a) => a.status === 'absent').length;
  const totalAtt = MOCK_ATTENDANCE.length;

  return {
    totalStaff: employees.length,
    activeStaff: employees.filter((e) => e.status === 'active').length,
    onLeave: employees.filter((e) => e.status === 'on_leave').length,
    openShifts: MOCK_SHIFTS.filter((s) => s.status === 'scheduled').length,
    pendingLeave: pendingLeave.length,
    expiringCredentials: expiringCerts.length,
    overdueTraining: MOCK_TRAINING.filter((t) => t.status === 'overdue').length,
    coveragePercent: 87,
    absenteeismRate: Math.round((absent / totalAtt) * 1000) / 10,
    recentShifts: MOCK_SHIFTS.slice(0, 8),
    pendingLeaveRequests: pendingLeave.slice(0, 6),
    expiringCertifications: expiringCerts.slice(0, 6),
  };
}
