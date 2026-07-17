export type EmploymentType =
  'full_time' | 'part_time' | 'contract' | 'agency' | 'volunteer' | 'locum';
export type EmploymentStatus =
  'active' | 'on_leave' | 'suspended' | 'terminated' | 'probation';
export type ShiftType =
  'day' | 'night' | 'evening' | 'on_call' | 'weekend' | 'holiday';
export type ShiftStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'swapped';
export type LeaveType =
  | 'annual'
  | 'sick'
  | 'maternity'
  | 'paternity'
  | 'unpaid'
  | 'study'
  | 'compassionate';
export type LeaveStatus =
  'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
export type AttendanceStatus =
  'present' | 'absent' | 'late' | 'early_departure' | 'on_break' | 'remote';
export type CredentialStatus =
  'valid' | 'expiring' | 'expired' | 'pending_verification' | 'revoked';
export type TrainingStatus =
  'not_started' | 'in_progress' | 'completed' | 'overdue' | 'expired';
export type PerformanceRating =
  'exceptional' | 'exceeds' | 'meets' | 'needs_improvement' | 'unsatisfactory';

export interface WorkforceFilters {
  q?: string;
  departmentId?: string;
  facilityId?: string;
  teamId?: string;
  role?: string;
  status?: string;
  employeeId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Department {
  departmentId: string;
  name: string;
  code: string;
  facilityId: string;
  facilityName: string;
  headEmployeeId?: string;
  staffCount: number;
  type:
    | 'clinical'
    | 'administrative'
    | 'support'
    | 'laboratory'
    | 'radiology'
    | 'pharmacy'
    | 'theatre';
}

export interface Team {
  teamId: string;
  name: string;
  departmentId: string;
  leadEmployeeId?: string;
  memberCount: number;
}

export interface OrganizationUnit {
  unitId: string;
  name: string;
  type:
    | 'hospital'
    | 'clinic'
    | 'pharmacy'
    | 'laboratory'
    | 'radiology'
    | 'theatre'
    | 'department';
  parentId?: string;
  facilityId: string;
  staffCount: number;
}

export interface Role {
  roleId: string;
  name: string;
  code: string;
  department?: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface ProfessionalLicense {
  licenseId: string;
  type: string;
  number: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: CredentialStatus;
}

export interface Certification {
  certificationId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CredentialStatus;
  mandatory: boolean;
}

export interface Competency {
  competencyId: string;
  name: string;
  level: number;
  maxLevel: number;
  lastAssessed: string;
  status: 'current' | 'due' | 'overdue';
}

export interface Employee {
  employeeId: string;
  providerId?: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  facilityId: string;
  facilityName: string;
  teamId?: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  hireDate: string;
  managerId?: string;
  avatar?: string;
  licenses: ProfessionalLicense[];
  certifications: Certification[];
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile extends Employee {
  bio?: string;
  specialties: string[];
  languages: string[];
  competencies: Competency[];
}

export interface Shift {
  shiftId: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  facilityId: string;
  shiftType: ShiftType;
  status: ShiftStatus;
  startTime: string;
  endTime: string;
  location: string;
  isOvertime: boolean;
  notes?: string;
}

export interface Roster {
  rosterId: string;
  departmentId: string;
  departmentName: string;
  weekStart: string;
  weekEnd: string;
  shifts: Shift[];
  coveragePercent: number;
  gaps: number;
}

export interface Schedule {
  scheduleId: string;
  employeeId: string;
  title: string;
  shifts: Shift[];
  availability: Availability[];
}

export interface Availability {
  availabilityId: string;
  employeeId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  preferred: boolean;
}

export interface LeaveRequest {
  leaveId: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  approverId?: string;
  createdAt: string;
}

export interface Attendance {
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  lateMinutes: number;
  departmentId: string;
}

export interface ClockEvent {
  eventId: string;
  employeeId: string;
  type: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
  timestamp: string;
  location?: string;
}

export interface Timesheet {
  timesheetId: string;
  employeeId: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  overtimeHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entries: Attendance[];
}

export interface Training {
  trainingId: string;
  employeeId: string;
  employeeName: string;
  courseName: string;
  category: string;
  status: TrainingStatus;
  dueDate: string;
  completedDate?: string;
  mandatory: boolean;
  credits: number;
}

export interface PerformanceReview {
  reviewId: string;
  employeeId: string;
  employeeName: string;
  period: string;
  rating: PerformanceRating;
  score: number;
  reviewerId: string;
  reviewerName: string;
  goals: Goal[];
  completedAt: string;
}

export interface Goal {
  goalId: string;
  title: string;
  progress: number;
  dueDate: string;
  status: 'on_track' | 'at_risk' | 'completed' | 'overdue';
}

export interface PayrollSummary {
  payrollId: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basePay: number;
  overtimePay: number;
  deductions: number;
  netPay: number;
  currency: 'EUR';
  status: 'draft' | 'processed' | 'paid';
}

export interface OnCallSchedule {
  onCallId: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  specialty: string;
  startTime: string;
  endTime: string;
  escalationLevel: number;
}

export interface ProviderAssignment {
  assignmentId: string;
  providerId: string;
  employeeId: string;
  departmentId: string;
  role: string;
  startDate: string;
  endDate?: string;
  isPrimary: boolean;
}

export interface CoverageMetrics {
  departmentId: string;
  departmentName: string;
  required: number;
  scheduled: number;
  coveragePercent: number;
  gaps: number;
  overtimeShifts: number;
}

export interface WorkforceDashboard {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  openShifts: number;
  pendingLeave: number;
  expiringCredentials: number;
  overdueTraining: number;
  coveragePercent: number;
  absenteeismRate: number;
  recentShifts: Shift[];
  pendingLeaveRequests: LeaveRequest[];
  expiringCertifications: Certification[];
}

export interface WorkforceAnalytics {
  staffTrends: { label: string; value: number }[];
  coverageByDepartment: { label: string; value: number }[];
  absenteeismTrend: { label: string; value: number }[];
  trainingCompliance: { label: string; value: number }[];
  credentialCompliance: number;
  overtimeHours: number;
  turnoverRate: number;
  burnoutIndicator: number;
  payrollCost: number;
  utilizationByDepartment: { label: string; value: number }[];
}

export interface WorkforcePermissions {
  canView: boolean;
  canWrite: boolean;
  canSchedule: boolean;
  canManageAttendance: boolean;
  canManageTraining: boolean;
  canManagePerformance: boolean;
  canManagePayroll: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface WorkforceFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'employee' | 'department' | 'shift';
  entityId: string;
  createdAt: string;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  roleId: string;
  departmentId: string;
  facilityId: string;
  employmentType: EmploymentType;
  hireDate: string;
}

export interface AssignShiftInput {
  employeeId: string;
  departmentId: string;
  facilityId: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  location: string;
}

export interface LeaveRequestInput {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ClockInput {
  employeeId: string;
  type: 'clock_in' | 'clock_out';
  location?: string;
}
