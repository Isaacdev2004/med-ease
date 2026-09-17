import type {
  DirectoryProvider,
  DirectoryFilters,
  ProviderType,
} from '@/services/directory/directory.types';

const FINESS_SEARCH_URL = 'https://recherche-entreprises.api.gouv.fr/search';

type FinessEstablishment = {
  siret?: string;
  adresse?: string;
  code_postal?: string;
  commune?: string;
  libelle_commune?: string;
  latitude?: string | number;
  longitude?: string | number;
  liste_enseignes?: string[] | null;
  liste_finess?: string[] | null;
  activite_principale?: string;
};

type FinessSearchResult = {
  nom_complet?: string;
  nom_raison_sociale?: string;
  sigle?: string;
  siege?: FinessEstablishment;
  matching_etablissements?: FinessEstablishment[];
  complements?: { est_finess?: boolean };
};

function inferProviderType(
  activity?: string,
  name?: string,
  filterType?: DirectoryFilters['type'],
): ProviderType {
  if (filterType && filterType !== 'all') {
    if (filterType === 'facility') return 'facility';
    return filterType;
  }

  const hay = (name ?? '').toLowerCase();
  if (hay.includes('pharmac')) return 'pharmacy';
  if (hay.includes('ambulanc') || hay.includes('transport')) return 'transport';
  if (hay.includes('ehpad') || hay.includes('maison de retraite')) {
    return 'nursing_home';
  }
  if (activity?.startsWith('86.21')) return 'pharmacy';
  if (activity?.startsWith('86.90')) return 'transport';
  return 'facility';
}

function mapEstablishment(
  row: FinessEstablishment,
  fallbackName: string,
  filterType?: DirectoryFilters['type'],
): DirectoryProvider | null {
  const finess = row.liste_finess?.[0];
  const enseigne = row.liste_enseignes?.[0];
  const name = enseigne ?? fallbackName;
  if (!name?.trim()) return null;

  const city = row.libelle_commune ?? row.commune ?? '';
  const postal = row.code_postal ?? '';
  const department = postal.slice(0, 2) === '97' ? postal.slice(0, 3) : postal.slice(0, 2);
  const lat =
    typeof row.latitude === 'number'
      ? row.latitude
      : row.latitude
        ? Number(row.latitude)
        : undefined;
  const lon =
    typeof row.longitude === 'number'
      ? row.longitude
      : row.longitude
        ? Number(row.longitude)
        : undefined;

  const type = inferProviderType(row.activite_principale, name, filterType);

  return {
    id: finess ? `finess-ext-${finess}` : `siret-ext-${row.siret ?? name}`,
    finessNumber: finess,
    type,
    name,
    facilityType:
      type === 'facility'
        ? 'Établissement de santé'
        : type === 'pharmacy'
          ? 'Pharmacie'
          : undefined,
    address: {
      street: row.adresse ?? '',
      city,
      department,
      postalCode: postal,
      country: 'France',
      latitude: Number.isFinite(lat) ? lat : undefined,
      longitude: Number.isFinite(lon) ? lon : undefined,
    },
    availability: 'Open data FINESS',
    status: 'stable',
    languages: ['French'],
    emergencyServices: type === 'facility' && /hopital|urgence|chru|ap-hp/i.test(name),
    services: type === 'facility' ? ['Consultations', 'Soins'] : undefined,
    updatedAt: new Date().toISOString(),
  };
}

function flattenResults(
  results: FinessSearchResult[],
  filters: DirectoryFilters,
): DirectoryProvider[] {
  const out: DirectoryProvider[] = [];
  const seen = new Set<string>();

  for (const org of results) {
    const fallback =
      org.sigle ??
      org.nom_complet ??
      org.nom_raison_sociale ??
      'Établissement';

    const rows = [
      ...(org.matching_etablissements ?? []),
      ...(org.siege ? [org.siege] : []),
    ];

    for (const row of rows) {
      const mapped = mapEstablishment(row, fallback, filters.type);
      if (!mapped) continue;
      const key = mapped.finessNumber ?? mapped.id;
      if (seen.has(key)) continue;
      seen.add(key);

      if (filters.city && !mapped.address.city.toLowerCase().includes(filters.city.toLowerCase())) {
        continue;
      }
      if (
        filters.department &&
        !mapped.address.department.includes(filters.department) &&
        !mapped.address.postalCode.startsWith(filters.department)
      ) {
        continue;
      }
      if (filters.type && filters.type !== 'all' && mapped.type !== filters.type) {
        if (filters.type === 'facility' && mapped.type === 'nursing_home') {
          // keep
        } else if (filters.type === 'facility' && mapped.type === 'medical_center') {
          // keep
        } else if (mapped.type !== filters.type) {
          continue;
        }
      }

      out.push(mapped);
    }
  }

  return out;
}

/** Live FINESS search via API Recherche d'entreprises (MVP codages). */
export async function searchFinessExternal(
  filters: DirectoryFilters = {},
): Promise<DirectoryProvider[]> {
  const q = filters.q?.trim();
  if (!q || q.length < 2) return [];

  try {
    const params = new URLSearchParams({
      q,
      est_finess: 'true',
      per_page: String(filters.pageSize ?? 20),
      page: String(filters.page ?? 1),
    });
    if (filters.department) params.set('departement', filters.department);

    const res = await fetch(`${FINESS_SEARCH_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { results?: FinessSearchResult[] };
    return flattenResults(data.results ?? [], filters);
  } catch {
    return [];
  }
}
