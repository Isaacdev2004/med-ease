import type { Certification, Employee, ProfessionalLicense, Training } from '@/services/workforce/types';

export function getExpiringCredentials(employee: Employee, withinDays = 30) {
  const cutoff = Date.now() + withinDays * 86400000;
  const licenses = employee.licenses.filter((l) => new Date(l.expiryDate).getTime() <= cutoff);
  const certs = employee.certifications.filter((c) => new Date(c.expiryDate).getTime() <= cutoff);
  return { licenses, certifications: certs };
}

export function verifyCredential(item: ProfessionalLicense | Certification): { verified: boolean; status: string } {
  const expired = new Date(item.expiryDate) < new Date();
  if (expired) return { verified: false, status: 'expired' };
  const expiring = new Date(item.expiryDate).getTime() - Date.now() < 30 * 86400000;
  return { verified: true, status: expiring ? 'expiring' : 'valid' };
}

export function mandatoryTrainingCompliance(training: Training[]): { complete: number; overdue: number; rate: number } {
  const mandatory = training.filter((t) => t.mandatory);
  const complete = mandatory.filter((t) => t.status === 'completed').length;
  const overdue = mandatory.filter((t) => t.status === 'overdue').length;
  return { complete, overdue, rate: mandatory.length ? Math.round((complete / mandatory.length) * 100) : 100 };
}

export function renewCertification(cert: Certification, extensionMonths = 12): Certification {
  const expiry = new Date(cert.expiryDate);
  expiry.setMonth(expiry.getMonth() + extensionMonths);
  return { ...cert, expiryDate: expiry.toISOString(), status: 'valid' };
}
