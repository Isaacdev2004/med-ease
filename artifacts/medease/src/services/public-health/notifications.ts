export function notifyCaseReported(disease: string, caseId: string) {
  return { type: 'publicHealth.case', title: 'Disease Case Reported', message: `${disease} case ${caseId} registered` };
}

export function notifyOutbreakDeclared(name: string) {
  return { type: 'publicHealth.outbreak', title: 'Outbreak Declared', message: `Outbreak investigation opened: ${name}` };
}

export function notifyImmunizationDue(patientId: string, vaccine: string) {
  return { type: 'publicHealth.immunization', title: 'Immunization Due', message: `${vaccine} due for patient ${patientId}` };
}
