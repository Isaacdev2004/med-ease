import type { MedicationFilters } from '@medease/medications-contract';
import type { Prisma } from '@medease/prisma';

export function buildMedicationListWhere(
  tenantId: string,
  filters: MedicationFilters = {},
): Prisma.PatientMedicationWhereInput {
  const where: Prisma.PatientMedicationWhereInput = { tenantId };

  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.physician) {
    where.prescribingPhysician = {
      contains: filters.physician,
      mode: 'insensitive',
    };
  }
  if (filters.pharmacy) {
    where.dispensingPharmacy = {
      contains: filters.pharmacy,
      mode: 'insensitive',
    };
  }
  if (filters.condition) {
    where.condition = { contains: filters.condition, mode: 'insensitive' };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { genericName: { contains: filters.q, mode: 'insensitive' } },
      { prescribingPhysician: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function buildPrescriptionListWhere(
  tenantId: string,
  filters: MedicationFilters = {},
): Prisma.PrescriptionWhereInput {
  const where: Prisma.PrescriptionWhereInput = { tenantId };

  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.q) {
    where.OR = [
      { medicationName: { contains: filters.q, mode: 'insensitive' } },
      { prescriptionNumber: { contains: filters.q, mode: 'insensitive' } },
      { genericName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}
