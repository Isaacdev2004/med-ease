import type { HealthcareStatus } from '@/config/design-tokens';

export type ProviderType =
  | 'professional'
  | 'facility'
  | 'pharmacy'
  | 'transport'
  | 'nursing_home'
  | 'medical_center';

export type DirectorySort =
  | 'relevance'
  | 'distance'
  | 'alphabetical'
  | 'availability'
  | 'updated';

export type DirectoryViewMode = 'cards' | 'table' | 'compact' | 'map';

export interface DirectoryAddress {
  street: string;
  city: string;
  department: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface DirectoryProvider {
  id: string;
  finessNumber?: string;
  type: ProviderType;
  name: string;
  title?: string;
  specialty?: string;
  medicalSpecialty?: string;
  facilityType?: string;
  address: DirectoryAddress;
  distanceKm?: number;
  phone?: string;
  email?: string;
  website?: string;
  availability?: string;
  status: HealthcareStatus;
  languages: string[];
  insuranceAccepted?: string[];
  teleconsultation?: boolean;
  emergencyServices?: boolean;
  accessibility?: string[];
  openingHours?: Record<string, string>;
  services?: string[];
  qualifications?: string[];
  associatedFacilityIds?: string[];
  relatedProfessionalIds?: string[];
  updatedAt: string;
}

export interface DirectoryFilters {
  q?: string;
  type?: ProviderType | 'all';
  specialty?: string;
  department?: string;
  city?: string;
  postalCode?: string;
  distanceMax?: number;
  teleconsultation?: boolean;
  emergency?: boolean;
  openNow?: boolean;
  favoritesOnly?: boolean;
  sort?: DirectorySort;
  page?: number;
  pageSize?: number;
}

export interface DirectorySearchResult {
  items: DirectoryProvider[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    specialties: string[];
    departments: string[];
    cities: string[];
  };
}

export interface DirectoryStats {
  total: number;
  professionals: number;
  facilities: number;
  pharmacies: number;
  transport: number;
  favorites: number;
}

/** Raw FINESS-style record for future API mapping. */
export interface FinessRecord {
  finessNumber: string;
  legalName: string;
  commercialName?: string;
  category: string;
  department: string;
  city: string;
  postalCode: string;
  street: string;
  phone?: string;
}
