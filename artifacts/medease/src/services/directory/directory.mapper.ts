import type { HealthcareStatus } from '@/config/design-tokens';
import type {
  DirectoryProvider,
  FinessRecord,
  ProviderType,
} from '@/services/directory/directory.types';
import { FINESS_MOCK_RECORDS } from '@/services/directory/directory.mock';

const FACILITY_TYPES = new Set([
  'Centre hospitalier',
  'Clinique privée',
  'EHPAD',
  'Centre de santé',
]);

function mapCategoryToType(category: string): ProviderType {
  if (category.includes('Pharmacie')) return 'pharmacy';
  if (category.includes('Transport')) return 'transport';
  if (category === 'EHPAD') return 'nursing_home';
  if (category === 'Centre de santé') return 'medical_center';
  return 'facility';
}

function defaultStatus(type: ProviderType): HealthcareStatus {
  if (type === 'transport') return 'success';
  return 'stable';
}

/** Maps a FINESS record into the unified directory provider model. */
export function mapFinessToProvider(
  record: FinessRecord,
  index: number,
): DirectoryProvider {
  const type = mapCategoryToType(record.category);
  const name = record.commercialName ?? record.legalName;

  return {
    id: `finess-${record.finessNumber}`,
    finessNumber: record.finessNumber,
    type,
    name,
    facilityType: FACILITY_TYPES.has(record.category)
      ? record.category
      : undefined,
    address: {
      street: record.street,
      city: record.city,
      department: record.department,
      postalCode: record.postalCode,
      country: 'France',
    },
    phone: record.phone,
    distanceKm: 1.2 + index * 0.8,
    availability: type === 'pharmacy' ? 'Open now' : 'Accepting patients',
    status: defaultStatus(type),
    languages: ['French', index % 2 === 0 ? 'English' : 'Arabic'].filter(
      Boolean,
    ),
    teleconsultation: type === 'medical_center',
    emergencyServices:
      type === 'facility' && record.category.includes('hospitalier'),
    accessibility: ['Wheelchair access', 'Elevator'],
    openingHours: {
      Monday: '08:00 – 19:00',
      Tuesday: '08:00 – 19:00',
      Wednesday: '08:00 – 19:00',
      Thursday: '08:00 – 19:00',
      Friday: '08:00 – 19:00',
      Saturday: '09:00 – 13:00',
      Sunday: 'Closed',
    },
    services:
      type === 'facility' ? ['Emergency', 'Imaging', 'Laboratory'] : undefined,
    updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
  };
}

const PROFESSIONAL_MOCK: DirectoryProvider[] = [
  {
    id: 'pro-001',
    name: 'Dr. Marie Dupont',
    title: 'Médecin généraliste',
    type: 'professional',
    specialty: 'General Practice',
    medicalSpecialty: 'Médecine générale',
    address: {
      street: '22 Rue de Rivoli',
      city: 'Paris',
      department: 'Paris',
      postalCode: '75004',
      country: 'France',
    },
    phone: '+33 1 42 77 88 99',
    email: 'marie.dupont@medease.fr',
    distanceKm: 0.8,
    availability: 'Available today',
    status: 'stable',
    languages: ['French', 'English'],
    teleconsultation: true,
    insuranceAccepted: ['Sécurité Sociale', 'Mutuelle Générale'],
    qualifications: ['MD — Université Paris Cité', 'DES Médecine générale'],
    associatedFacilityIds: ['finess-750000001'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pro-002',
    name: 'Dr. Jean-Luc Martin',
    title: 'Cardiologue',
    type: 'professional',
    specialty: 'Cardiology',
    medicalSpecialty: 'Cardiologie et maladies vasculaires',
    address: {
      street: "5 Place d'Arsonval",
      city: 'Lyon',
      department: 'Rhône',
      postalCode: '69003',
      country: 'France',
    },
    phone: '+33 4 72 11 80 00',
    distanceKm: 2.4,
    availability: 'Next slot: Wed 14:00',
    status: 'stable',
    languages: ['French'],
    teleconsultation: true,
    associatedFacilityIds: ['finess-690000002'],
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'pro-003',
    name: 'Dr. Sophie Bernard',
    title: 'Pédiatre',
    type: 'professional',
    specialty: 'Pediatrics',
    medicalSpecialty: 'Pédiatrie',
    address: {
      street: '264 Rue Saint-Pierre',
      city: 'Marseille',
      department: 'Bouches-du-Rhône',
      postalCode: '13005',
      country: 'France',
    },
    phone: '+33 4 91 38 12 00',
    distanceKm: 3.1,
    availability: 'Available tomorrow',
    status: 'stable',
    languages: ['French', 'English', 'Spanish'],
    teleconsultation: false,
    associatedFacilityIds: ['finess-130000003'],
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'pro-004',
    name: 'Dr. Antoine Leroy',
    title: 'Anesthésiste-réanimateur',
    type: 'professional',
    specialty: 'Anesthesiology',
    medicalSpecialty: 'Anesthésie-réanimation',
    address: {
      street: '45 Avenue de Lombez',
      city: 'Toulouse',
      department: 'Haute-Garonne',
      postalCode: '31076',
      country: 'France',
    },
    distanceKm: 5.2,
    availability: 'On call',
    status: 'pending',
    languages: ['French'],
    associatedFacilityIds: ['finess-310000004'],
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const TRANSPORT_MOCK: DirectoryProvider[] = [
  {
    id: 'tr-001',
    name: 'Ambulances VSL Paris Est',
    type: 'transport',
    specialty: 'Medical Transport',
    address: {
      street: '18 Rue de Charonne',
      city: 'Paris',
      department: 'Paris',
      postalCode: '75011',
      country: 'France',
    },
    phone: '+33 1 43 57 89 00',
    distanceKm: 1.5,
    availability: '24/7 dispatch',
    status: 'success',
    languages: ['French', 'English'],
    emergencyServices: true,
    services: ['VSL', 'Ambulance', 'Inter-hospital transfer'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tr-002',
    name: 'Transports Sanitaires Lyon Métropole',
    type: 'transport',
    address: {
      street: '42 Cours Lafayette',
      city: 'Lyon',
      department: 'Rhône',
      postalCode: '69003',
      country: 'France',
    },
    phone: '+33 4 78 60 12 34',
    distanceKm: 4.0,
    availability: 'Available',
    status: 'stable',
    languages: ['French'],
    services: ['VSL', 'Taxi conventionné'],
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_DIRECTORY_PROVIDERS: DirectoryProvider[] = [
  ...PROFESSIONAL_MOCK,
  ...FINESS_MOCK_RECORDS.map(mapFinessToProvider),
  ...TRANSPORT_MOCK,
];

export const POPULAR_SEARCHES = [
  'Cardiologue Paris',
  'Pharmacie de garde',
  'Hôpital Lyon',
  'Transport sanitaire',
  'Médecin généraliste',
];

export const RECENT_SEARCHES_KEY = 'medease:directory:recent-searches';
