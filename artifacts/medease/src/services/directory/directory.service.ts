import type {
  DirectoryFilters,
  DirectoryProvider,
  DirectorySearchResult,
  DirectoryStats,
} from '@/services/directory/directory.types';
import {
  MOCK_DIRECTORY_PROVIDERS,
  POPULAR_SEARCHES,
} from '@/services/directory/directory.mapper';

const FAVORITES_KEY = 'medease:directory:favorites';
const SIMULATED_DELAY_MS = 250;

function delay(ms = SIMULATED_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFavoritesStore(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

function saveFavoritesStore(store: Record<string, string[]>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(store));
}

function normalizeQuery(q?: string) {
  return q?.trim().toLowerCase() ?? '';
}

function matchesQuery(provider: DirectoryProvider, q: string) {
  if (!q) return true;
  const haystack = [
    provider.name,
    provider.title,
    provider.specialty,
    provider.medicalSpecialty,
    provider.facilityType,
    provider.address.city,
    provider.address.department,
    provider.address.postalCode,
    provider.finessNumber,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function applyFilters(
  providers: DirectoryProvider[],
  filters: DirectoryFilters,
  favoriteIds: Set<string>,
): DirectoryProvider[] {
  const q = normalizeQuery(filters.q);

  return providers.filter((provider) => {
    if (filters.type && filters.type !== 'all' && provider.type !== filters.type) {
      return false;
    }
    if (filters.specialty && provider.specialty !== filters.specialty && provider.medicalSpecialty !== filters.specialty) {
      return false;
    }
    if (filters.department && provider.address.department !== filters.department) {
      return false;
    }
    if (filters.city && provider.address.city !== filters.city) {
      return false;
    }
    if (filters.postalCode && !provider.address.postalCode.startsWith(filters.postalCode)) {
      return false;
    }
    if (filters.distanceMax && (provider.distanceKm ?? Infinity) > filters.distanceMax) {
      return false;
    }
    if (filters.teleconsultation && !provider.teleconsultation) return false;
    if (filters.emergency && !provider.emergencyServices) return false;
    if (filters.openNow && provider.availability !== 'Open now' && provider.availability !== '24/7 dispatch') {
      return false;
    }
    if (filters.favoritesOnly && !favoriteIds.has(provider.id)) return false;
    return matchesQuery(provider, q);
  });
}

function sortProviders(
  providers: DirectoryProvider[],
  sort: DirectoryFilters['sort'],
  q: string,
): DirectoryProvider[] {
  const items = [...providers];

  switch (sort) {
    case 'distance':
      return items.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    case 'alphabetical':
      return items.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    case 'availability':
      return items.sort((a, b) => (a.availability ?? '').localeCompare(b.availability ?? '', 'fr'));
    case 'updated':
      return items.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case 'relevance':
    default:
      if (!q) return items;
      return items.sort((a, b) => {
        const aName = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bName = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aName - bName || a.name.localeCompare(b.name, 'fr');
      });
  }
}

function buildFacets(providers: DirectoryProvider[]) {
  const specialties = new Set<string>();
  const departments = new Set<string>();
  const cities = new Set<string>();

  for (const provider of providers) {
    if (provider.specialty) specialties.add(provider.specialty);
    if (provider.medicalSpecialty) specialties.add(provider.medicalSpecialty);
    departments.add(provider.address.department);
    cities.add(provider.address.city);
  }

  return {
    specialties: [...specialties].sort(),
    departments: [...departments].sort(),
    cities: [...cities].sort(),
  };
}

export const directoryService = {
  async search(filters: DirectoryFilters = {}): Promise<DirectorySearchResult> {
    await delay();
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const favoriteIds = new Set(
      getFavoritesStore()['global'] ?? [],
    );

    const filtered = sortProviders(
      applyFilters(MOCK_DIRECTORY_PROVIDERS, filters, favoriteIds),
      filters.sort ?? 'relevance',
      normalizeQuery(filters.q),
    );

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      facets: buildFacets(MOCK_DIRECTORY_PROVIDERS),
    };
  },

  async getProvider(id: string): Promise<DirectoryProvider | null> {
    await delay();
    const provider = MOCK_DIRECTORY_PROVIDERS.find((item) => item.id === id) ?? null;
    if (!provider) return null;

    if (provider.associatedFacilityIds?.length) {
      const facilities = MOCK_DIRECTORY_PROVIDERS.filter((item) =>
        provider.associatedFacilityIds?.includes(item.id),
      );
      return { ...provider, associatedFacilityIds: facilities.map((f) => f.id) };
    }

    return provider;
  },

  async getRelatedProviders(id: string): Promise<DirectoryProvider[]> {
    await delay(150);
    const provider = MOCK_DIRECTORY_PROVIDERS.find((item) => item.id === id);
    if (!provider) return [];

    if (provider.type === 'professional' && provider.associatedFacilityIds?.length) {
      return MOCK_DIRECTORY_PROVIDERS.filter((item) =>
        provider.associatedFacilityIds?.includes(item.id),
      );
    }

    return MOCK_DIRECTORY_PROVIDERS.filter(
      (item) =>
        item.id !== id &&
        item.type === provider.type &&
        item.address.city === provider.address.city,
    ).slice(0, 4);
  },

  async getStats(userId: string): Promise<DirectoryStats> {
    await delay(100);
    const favorites = getFavoritesStore()[userId] ?? getFavoritesStore()['global'] ?? [];
    const all = MOCK_DIRECTORY_PROVIDERS;

    return {
      total: all.length,
      professionals: all.filter((p) => p.type === 'professional').length,
      facilities: all.filter((p) => p.type === 'facility').length,
      pharmacies: all.filter((p) => p.type === 'pharmacy').length,
      transport: all.filter((p) => p.type === 'transport').length,
      favorites: favorites.length,
    };
  },

  async listFavorites(userId: string): Promise<DirectoryProvider[]> {
    await delay();
    const ids = new Set(getFavoritesStore()[userId] ?? []);
    return MOCK_DIRECTORY_PROVIDERS.filter((p) => ids.has(p.id));
  },

  async toggleFavorite(userId: string, providerId: string): Promise<boolean> {
    await delay(100);
    const store = getFavoritesStore();
    const current = new Set(store[userId] ?? []);
    const isFavorite = current.has(providerId);

    if (isFavorite) {
      current.delete(providerId);
    } else {
      current.add(providerId);
    }

    store[userId] = [...current];
    saveFavoritesStore(store);
    return !isFavorite;
  },

  async isFavorite(userId: string, providerId: string): Promise<boolean> {
    await delay(50);
    const store = getFavoritesStore();
    return (store[userId] ?? []).includes(providerId);
  },

  getPopularSearches() {
    return POPULAR_SEARCHES;
  },

  getSuggestions(query: string): string[] {
    const q = normalizeQuery(query);
    if (!q) return POPULAR_SEARCHES.slice(0, 5);

    const matches = new Set<string>();
    for (const provider of MOCK_DIRECTORY_PROVIDERS) {
      if (provider.name.toLowerCase().includes(q)) matches.add(provider.name);
      if (provider.specialty?.toLowerCase().includes(q)) matches.add(provider.specialty);
      if (provider.address.city.toLowerCase().includes(q)) {
        matches.add(`${provider.specialty ?? provider.facilityType ?? 'Provider'} ${provider.address.city}`);
      }
    }
    return [...matches].slice(0, 6);
  },
};

export function getProviderProfilePath(portalBase: string, providerId: string) {
  return `${portalBase}/directory/${providerId}`;
}
