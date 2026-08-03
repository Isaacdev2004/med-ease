import type { Prisma } from '@medease/prisma';
import type {
  DirectoryProvider,
  HealthcareStatus,
  ProviderType,
} from '@medease/directory-contract';

import { mapOpeningHours } from '../directory.helpers';

export function mapProviderType(type: string): ProviderType {
  switch (type) {
    case 'professional':
    case 'facility':
    case 'pharmacy':
    case 'transport':
    case 'nursing_home':
    case 'medical_center':
      return type;
    default:
      return 'facility';
  }
}

export function mapHealthcareStatus(status: string): HealthcareStatus {
  switch (status) {
    case 'critical':
    case 'stable':
    case 'observation':
    case 'discharged':
    case 'transferred':
    case 'pending':
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
    case 'neutral':
      return status;
    default:
      return 'stable';
  }
}

export function mapDirectoryProvider(
  row: Prisma.DirectoryProviderGetPayload<object>,
): DirectoryProvider {
  return {
    id: row.id,
    finessNumber: row.finessNumber ?? undefined,
    type: mapProviderType(row.type),
    name: row.name,
    title: row.title ?? undefined,
    specialty: row.specialty ?? undefined,
    medicalSpecialty: row.medicalSpecialty ?? undefined,
    facilityType: row.facilityType ?? undefined,
    address: {
      street: row.street,
      city: row.city,
      department: row.department,
      postalCode: row.postalCode,
      country: row.country,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
    },
    distanceKm: row.distanceKm ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    availability: row.availability ?? undefined,
    status: mapHealthcareStatus(row.status),
    languages: row.languages,
    insuranceAccepted: row.insuranceAccepted.length
      ? row.insuranceAccepted
      : undefined,
    teleconsultation: row.teleconsultation,
    emergencyServices: row.emergencyServices,
    accessibility: row.accessibility.length ? row.accessibility : undefined,
    openingHours: mapOpeningHours(row.openingHours),
    services: row.services.length ? row.services : undefined,
    qualifications: row.qualifications.length ? row.qualifications : undefined,
    associatedFacilityIds: row.associatedFacilityIds.length
      ? row.associatedFacilityIds
      : undefined,
    relatedProfessionalIds: row.relatedProfessionalIds.length
      ? row.relatedProfessionalIds
      : undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}
