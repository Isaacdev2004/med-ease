import { computeHoursWorked, clockIn, clockOut } from '@/services/workforce/attendance';
import { renewCertification } from '@/services/workforce/credential-engine';
import { computeCoverage, computeWorkforceAnalytics } from '@/services/workforce/analytics';
import { detectShiftConflicts } from '@/services/workforce/scheduling-engine';
import {
  buildWorkforceDashboard,
  MOCK_ATTENDANCE,
  MOCK_DEPARTMENTS,
  MOCK_EMPLOYEES,
  MOCK_LEAVE_REQUESTS,
  MOCK_ON_CALL,
  MOCK_ORG_UNITS,
  MOCK_PAYROLL,
  MOCK_PERFORMANCE,
  MOCK_ROSTERS,
  MOCK_SHIFTS,
  MOCK_TRAINING,
} from '@/services/workforce/mock-data';
import type {
  AssignShiftInput,
  ClockInput,
  CreateEmployeeInput,
  LeaveRequestInput,
  WorkforceFavorite,
  WorkforceFilters,
} from '@/services/workforce/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class WorkforceRepository {
  private employees = [...MOCK_EMPLOYEES];
  private shifts = [...MOCK_SHIFTS];
  private attendance = [...MOCK_ATTENDANCE];
  private leaveRequests = [...MOCK_LEAVE_REQUESTS];
  private training = [...MOCK_TRAINING];
  private favorites: WorkforceFavorite[] = [];
  private nextId = 80000;

  searchEmployees(filters?: WorkforceFilters) {
    let items = this.employees;
    if (filters?.departmentId) items = items.filter((e) => e.departmentId === filters.departmentId);
    if (filters?.facilityId) items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.fullName, e.email, e.employeeNumber, e.jobTitle));
    return paginate([...items].sort((a, b) => a.fullName.localeCompare(b.fullName)), filters?.page, filters?.pageSize);
  }

  getEmployee(employeeId: string) {
    return this.employees.find((e) => e.employeeId === employeeId) ?? null;
  }

  createEmployee(input: CreateEmployeeInput) {
    const dept = MOCK_DEPARTMENTS.find((d) => d.departmentId === input.departmentId);
    const id = `emp-${String(++this.nextId)}`;
    const emp = {
      employeeId: id,
      employeeNumber: `EN-${20250000 + this.nextId}`,
      firstName: input.firstName,
      lastName: input.lastName,
      fullName: `${input.firstName} ${input.lastName}`,
      email: input.email,
      phone: input.phone,
      jobTitle: input.jobTitle,
      roleId: input.roleId,
      roleName: input.jobTitle,
      departmentId: input.departmentId,
      departmentName: dept?.name ?? 'Unknown',
      facilityId: input.facilityId,
      facilityName: dept?.facilityName ?? 'Unknown',
      employmentType: input.employmentType,
      status: 'active' as const,
      hireDate: input.hireDate,
      licenses: [],
      certifications: [],
      emergencyContacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.employees.unshift(emp);
    return emp;
  }

  updateEmployee(employeeId: string, updates: Partial<CreateEmployeeInput>) {
    const idx = this.employees.findIndex((e) => e.employeeId === employeeId);
    if (idx < 0) return null;
    const emp = this.employees[idx]!;
    if (updates.jobTitle) { emp.jobTitle = updates.jobTitle; emp.roleName = updates.jobTitle; }
    if (updates.phone) emp.phone = updates.phone;
    if (updates.email) emp.email = updates.email;
    emp.updatedAt = new Date().toISOString();
    this.employees[idx] = emp;
    return emp;
  }

  getDepartments(filters?: WorkforceFilters) {
    let items = MOCK_DEPARTMENTS;
    if (filters?.facilityId) items = items.filter((d) => d.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSchedules(filters?: WorkforceFilters) {
    let items = this.shifts;
    if (filters?.employeeId) items = items.filter((s) => s.employeeId === filters.employeeId);
    if (filters?.departmentId) items = items.filter((s) => s.departmentId === filters.departmentId);
    return paginate([...items].sort((a, b) => b.startTime.localeCompare(a.startTime)), filters?.page, filters?.pageSize);
  }

  assignShift(input: AssignShiftInput) {
    const emp = this.getEmployee(input.employeeId);
    const shift = {
      shiftId: `shf-${String(++this.nextId)}`,
      employeeId: input.employeeId,
      employeeName: emp?.fullName ?? 'Unknown',
      departmentId: input.departmentId,
      facilityId: input.facilityId,
      shiftType: input.shiftType,
      status: 'scheduled' as const,
      startTime: input.startTime,
      endTime: input.endTime,
      location: input.location,
      isOvertime: false,
    };
    const conflicts = detectShiftConflicts(this.shifts, shift);
    if (conflicts.length) return { shift: null, conflicts };
    this.shifts.unshift(shift);
    return { shift, conflicts: [] };
  }

  getRoster(departmentId?: string) {
    const roster = departmentId
      ? MOCK_ROSTERS.find((r) => r.departmentId === departmentId) ?? MOCK_ROSTERS[0]!
      : MOCK_ROSTERS[0]!;
    return roster;
  }

  getAttendance(filters?: WorkforceFilters) {
    let items = this.attendance;
    if (filters?.employeeId) items = items.filter((a) => a.employeeId === filters.employeeId);
    if (filters?.departmentId) items = items.filter((a) => a.departmentId === filters.departmentId);
    return paginate([...items].sort((a, b) => b.date.localeCompare(a.date)), filters?.page, filters?.pageSize);
  }

  clock(input: ClockInput) {
    const emp = this.getEmployee(input.employeeId);
    if (!emp) return null;
    const event = input.type === 'clock_in' ? clockIn(input.employeeId, input.location) : clockOut(input.employeeId, input.location);
    const today = new Date().toISOString().slice(0, 10);
    const idx = this.attendance.findIndex((a) => a.employeeId === input.employeeId && a.date === today);
    if (input.type === 'clock_in') {
      const record = {
        attendanceId: `att-${String(++this.nextId)}`,
        employeeId: input.employeeId,
        employeeName: emp.fullName,
        date: today,
        clockIn: event.timestamp,
        status: 'present' as const,
        hoursWorked: 0,
        overtimeHours: 0,
        lateMinutes: 0,
        departmentId: emp.departmentId,
      };
      if (idx >= 0) this.attendance[idx] = { ...this.attendance[idx]!, clockIn: event.timestamp, status: 'present' };
      else this.attendance.unshift(record);
    } else if (idx >= 0) {
      const rec = this.attendance[idx]!;
      rec.clockOut = event.timestamp;
      rec.hoursWorked = computeHoursWorked(rec.clockIn, rec.clockOut);
      this.attendance[idx] = rec;
    }
    return event;
  }

  getLeaveRequests(filters?: WorkforceFilters) {
    let items = this.leaveRequests;
    if (filters?.employeeId) items = items.filter((l) => l.employeeId === filters.employeeId);
    if (filters?.status) items = items.filter((l) => l.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createLeaveRequest(input: LeaveRequestInput) {
    const emp = this.getEmployee(input.employeeId);
    const days = Math.ceil((new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / 86400000) + 1;
    const req = {
      leaveId: `lv-${String(++this.nextId)}`,
      employeeId: input.employeeId,
      employeeName: emp?.fullName ?? 'Unknown',
      leaveType: input.leaveType,
      status: 'pending' as const,
      startDate: input.startDate,
      endDate: input.endDate,
      days,
      reason: input.reason,
      createdAt: new Date().toISOString(),
    };
    this.leaveRequests.unshift(req);
    return req;
  }

  approveLeave(leaveId: string, approverId: string) {
    const idx = this.leaveRequests.findIndex((l) => l.leaveId === leaveId);
    if (idx < 0) return null;
    this.leaveRequests[idx]!.status = 'approved';
    this.leaveRequests[idx]!.approverId = approverId;
    return this.leaveRequests[idx]!;
  }

  rejectLeave(leaveId: string) {
    const idx = this.leaveRequests.findIndex((l) => l.leaveId === leaveId);
    if (idx < 0) return null;
    this.leaveRequests[idx]!.status = 'rejected';
    return this.leaveRequests[idx]!;
  }

  getTraining(filters?: WorkforceFilters) {
    let items = this.training;
    if (filters?.employeeId) items = items.filter((t) => t.employeeId === filters.employeeId);
    if (filters?.status) items = items.filter((t) => t.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  assignTraining(employeeId: string, courseName: string, mandatory = false) {
    const emp = this.getEmployee(employeeId);
    const t = {
      trainingId: `trn-${String(++this.nextId)}`,
      employeeId,
      employeeName: emp?.fullName ?? 'Unknown',
      courseName,
      category: 'mandatory',
      status: 'not_started' as const,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      mandatory,
      credits: 1,
    };
    this.training.unshift(t);
    return t;
  }

  getPerformance(filters?: WorkforceFilters) {
    let items = MOCK_PERFORMANCE;
    if (filters?.employeeId) items = items.filter((p) => p.employeeId === filters.employeeId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCredentials(employeeId: string) {
    const emp = this.getEmployee(employeeId);
    if (!emp) return null;
    return { licenses: emp.licenses, certifications: emp.certifications };
  }

  renewCredential(employeeId: string, certificationId: string) {
    const idx = this.employees.findIndex((e) => e.employeeId === employeeId);
    if (idx < 0) return null;
    const emp = this.employees[idx]!;
    const cIdx = emp.certifications.findIndex((c) => c.certificationId === certificationId);
    if (cIdx < 0) return null;
    emp.certifications[cIdx] = renewCertification(emp.certifications[cIdx]!);
    this.employees[idx] = emp;
    return emp.certifications[cIdx]!;
  }

  getPayroll(filters?: WorkforceFilters) {
    let items = MOCK_PAYROLL;
    if (filters?.employeeId) items = items.filter((p) => p.employeeId === filters.employeeId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOnCall(filters?: WorkforceFilters) {
    let items = MOCK_ON_CALL;
    if (filters?.departmentId) items = items.filter((o) => o.departmentId === filters.departmentId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOrganization() {
    return MOCK_ORG_UNITS;
  }

  dashboard(facilityId?: string, departmentId?: string) {
    return buildWorkforceDashboard(facilityId, departmentId);
  }

  analytics() {
    return computeWorkforceAnalytics();
  }

  coverage(departmentId?: string) {
    return computeCoverage(departmentId);
  }

  search(query: string, facilityId?: string) {
    const filters: WorkforceFilters = { q: query, facilityId };
    return {
      employees: this.searchEmployees({ ...filters, pageSize: 5 }).items,
      departments: this.getDepartments({ ...filters, pageSize: 5 }).items,
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, generatedAt: new Date().toISOString(), recordCount: this.employees.length };
  }

  favorite(userId: string, entityType: WorkforceFavorite['entityType'], entityId: string) {
    const fav: WorkforceFavorite = { favoriteId: `fav-${Date.now()}`, userId, entityType, entityId, createdAt: new Date().toISOString() };
    this.favorites.push(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  archiveEmployee(employeeId: string) {
    const idx = this.employees.findIndex((e) => e.employeeId === employeeId);
    if (idx < 0) return null;
    this.employees[idx]!.status = 'terminated';
    return this.employees[idx]!;
  }
}

export const workforceRepository = new WorkforceRepository();
