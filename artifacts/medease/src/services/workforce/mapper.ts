import type { Employee, Shift } from '@/services/workforce/types';

export function toFhirPractitioner(employee: Employee) {
  return {
    resourceType: 'Practitioner',
    id: employee.providerId ?? employee.employeeId,
    identifier: [{ value: employee.employeeNumber }],
    name: [{ family: employee.lastName, given: [employee.firstName] }],
    telecom: [
      { system: 'email', value: employee.email },
      { system: 'phone', value: employee.phone },
    ],
    qualification: employee.licenses.map((l) => ({
      code: { text: l.type },
      identifier: [{ value: l.number }],
    })),
  };
}

export function toFhirPractitionerRole(employee: Employee) {
  return {
    resourceType: 'PractitionerRole',
    id: `pr-${employee.employeeId}`,
    practitioner: {
      reference: `Practitioner/${employee.providerId ?? employee.employeeId}`,
    },
    organization: { reference: `Organization/${employee.facilityId}` },
    code: [{ text: employee.jobTitle }],
    specialty: [{ text: employee.roleName }],
  };
}

export function toFhirSchedule(shifts: Shift[], employeeId: string) {
  return {
    resourceType: 'Schedule',
    id: `sched-${employeeId}`,
    actor: [{ reference: `Practitioner/${employeeId}` }],
    planningHorizon: shifts.length
      ? { start: shifts[0]!.startTime, end: shifts[shifts.length - 1]!.endTime }
      : undefined,
  };
}

export function toFhirSlot(shift: Shift) {
  return {
    resourceType: 'Slot',
    id: shift.shiftId,
    schedule: { reference: `Schedule/sched-${shift.employeeId}` },
    status: shift.status === 'cancelled' ? 'busy-unavailable' : 'busy',
    start: shift.startTime,
    end: shift.endTime,
  };
}
