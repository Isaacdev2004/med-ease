import { workforceRepository } from '@/services/workforce/repository';
import type { AssignShiftInput, ClockInput, CreateEmployeeInput, LeaveRequestInput, WorkforceFilters } from '@/services/workforce/types';

const DELAY = 250;
async function delay(ms = DELAY) { await new Promise((r) => setTimeout(r, ms)); }

export const workforceService = {
  async searchEmployees(filters?: WorkforceFilters) { await delay(); return workforceRepository.searchEmployees(filters); },
  async getEmployee(employeeId: string) { await delay(); return workforceRepository.getEmployee(employeeId); },
  async createEmployee(input: CreateEmployeeInput) { await delay(); return workforceRepository.createEmployee(input); },
  async updateEmployee(employeeId: string, updates: Partial<CreateEmployeeInput>) { await delay(); return workforceRepository.updateEmployee(employeeId, updates); },
  async archiveEmployee(employeeId: string) { await delay(); return workforceRepository.archiveEmployee(employeeId); },

  async getDepartments(filters?: WorkforceFilters) { await delay(); return workforceRepository.getDepartments(filters); },
  async getSchedules(filters?: WorkforceFilters) { await delay(); return workforceRepository.getSchedules(filters); },
  async assignShift(input: AssignShiftInput) { await delay(); return workforceRepository.assignShift(input); },
  async getRoster(departmentId?: string) { await delay(); return workforceRepository.getRoster(departmentId); },

  async getAttendance(filters?: WorkforceFilters) { await delay(); return workforceRepository.getAttendance(filters); },
  async clock(input: ClockInput) { await delay(); return workforceRepository.clock(input); },

  async getLeaveRequests(filters?: WorkforceFilters) { await delay(); return workforceRepository.getLeaveRequests(filters); },
  async createLeaveRequest(input: LeaveRequestInput) { await delay(); return workforceRepository.createLeaveRequest(input); },
  async approveLeave(leaveId: string, approverId: string) { await delay(); return workforceRepository.approveLeave(leaveId, approverId); },
  async rejectLeave(leaveId: string) { await delay(); return workforceRepository.rejectLeave(leaveId); },

  async getTraining(filters?: WorkforceFilters) { await delay(); return workforceRepository.getTraining(filters); },
  async assignTraining(employeeId: string, courseName: string, mandatory?: boolean) { await delay(); return workforceRepository.assignTraining(employeeId, courseName, mandatory); },

  async getPerformance(filters?: WorkforceFilters) { await delay(); return workforceRepository.getPerformance(filters); },
  async getCredentials(employeeId: string) { await delay(); return workforceRepository.getCredentials(employeeId); },
  async renewCredential(employeeId: string, certificationId: string) { await delay(); return workforceRepository.renewCredential(employeeId, certificationId); },

  async getPayroll(filters?: WorkforceFilters) { await delay(); return workforceRepository.getPayroll(filters); },
  async getOnCall(filters?: WorkforceFilters) { await delay(); return workforceRepository.getOnCall(filters); },
  async getOrganization() { await delay(); return workforceRepository.getOrganization(); },

  async dashboard(facilityId?: string, departmentId?: string) { await delay(); return workforceRepository.dashboard(facilityId, departmentId); },
  async analytics() { await delay(); return workforceRepository.analytics(); },
  async coverage(departmentId?: string) { await delay(); return workforceRepository.coverage(departmentId); },
  async search(query: string, facilityId?: string) { await delay(); return workforceRepository.search(query, facilityId); },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') { await delay(); return workforceRepository.exportData(format); },
  async favorite(userId: string, entityType: 'employee' | 'department' | 'shift', entityId: string) { await delay(); return workforceRepository.favorite(userId, entityType, entityId); },
  async getFavorites(userId: string) { await delay(); return workforceRepository.getFavorites(userId); },
};
