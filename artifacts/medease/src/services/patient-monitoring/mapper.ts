import type { MonitoringDevice, Observation, RemoteMonitoringProgram, VitalSign } from '@/services/patient-monitoring/types';

export function toFhirObservation(observation: Observation) {
  return {
    resourceType: 'Observation' as const,
    id: observation.id,
    status: observation.status,
    category: [{ coding: [{ code: observation.category }] }],
    code: { text: observation.display },
    subject: { reference: `Patient/${observation.patientId}` },
    effectiveDateTime: observation.recordedAt,
    valueQuantity: typeof observation.value === 'number'
      ? { value: observation.value, unit: observation.unit }
      : undefined,
    valueString: typeof observation.value === 'string' ? observation.value : undefined,
    interpretation: observation.interpretation
      ? [{ text: observation.interpretation }]
      : undefined,
    device: observation.deviceId ? { reference: `Device/${observation.deviceId}` } : undefined,
  };
}

export function toFhirDevice(device: MonitoringDevice) {
  return {
    resourceType: 'Device' as const,
    id: device.id,
    deviceName: [{ name: device.name, type: 'user-friendly-name' }],
    manufacturer: device.manufacturer,
    modelNumber: device.model,
    serialNumber: device.serialNumber,
    status: device.status === 'online' ? 'active' : 'inactive',
  };
}

export function toFhirDeviceMetric(vital: VitalSign) {
  return {
    resourceType: 'DeviceMetric' as const,
    id: `metric-${vital.id}`,
    type: { text: vital.type },
    unit: { text: vital.unit },
    source: vital.deviceId ? { reference: `Device/${vital.deviceId}` } : undefined,
  };
}

export function toFhirEncounter(sessionId: string, patientId: string) {
  return {
    resourceType: 'Encounter' as const,
    id: sessionId,
    status: 'in-progress',
    class: { code: 'VR', display: 'virtual' },
    subject: { reference: `Patient/${patientId}` },
  };
}

export function toFhirCarePlanMonitoring(program: RemoteMonitoringProgram) {
  return {
    resourceType: 'CarePlan' as const,
    id: program.carePlanId ?? program.id,
    status: program.status === 'active' ? 'active' : 'completed',
    intent: 'plan',
    subject: { reference: `Patient/${program.patientId}` },
    title: program.name,
    period: { start: program.enrolledAt, end: program.completedAt },
  };
}

export function toFhirQuestionnaireResponse(patientId: string, symptomReport: string) {
  return {
    resourceType: 'QuestionnaireResponse' as const,
    id: `qr-${Date.now()}`,
    status: 'completed',
    subject: { reference: `Patient/${patientId}` },
    authored: new Date().toISOString(),
    item: [{ text: 'Symptom report', answer: [{ valueString: symptomReport }] }],
  };
}
