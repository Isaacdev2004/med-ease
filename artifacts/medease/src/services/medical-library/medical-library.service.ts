import type {
  MedicationCategory,
  MedicationCategoryInfo,
  MedicationFilters,
  MedicationLibraryStats,
  MedicationRecord,
  MedicationSearchResult,
} from '@/services/medical-library/medical-library.types';
import {
  MEDICATION_CATEGORY_LABELS,
} from '@/services/medical-library/medical-library.types';
import {
  MOCK_MEDICATIONS,
  POPULAR_MEDICATIONS,
  getCategoryCounts,
} from '@/services/medical-library/medical-library.mapper';

const FAVORITES_KEY = 'medease:medical-library:favorites';
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

function matchesQuery(med: MedicationRecord, q: string) {
  if (!q) return true;
  const haystack = [
    med.name,
    med.brandName,
    med.genericName,
    med.atcCode,
    med.therapeuticClass,
    ...med.activeIngredients,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function applyFilters(
  medications: MedicationRecord[],
  filters: MedicationFilters,
  favoriteIds: Set<string>,
): MedicationRecord[] {
  const q = normalizeQuery(filters.q);

  return medications.filter((med) => {
    if (filters.category && filters.category !== 'all' && med.category !== filters.category) {
      return false;
    }
    if (filters.therapeuticClass && med.therapeuticClass !== filters.therapeuticClass) {
      return false;
    }
    if (filters.atcCode && !med.atcCode.startsWith(filters.atcCode)) return false;
    if (filters.prescriptionRequired !== undefined && med.prescriptionRequired !== filters.prescriptionRequired) {
      return false;
    }
    if (filters.overTheCounter && med.prescriptionRequired) return false;
    if (filters.route && med.route !== filters.route) return false;
    if (filters.manufacturer && med.manufacturer !== filters.manufacturer) return false;
    if (filters.pregnancySafety && med.pregnancySafety !== filters.pregnancySafety) return false;
    if (filters.pediatric && !med.pediatricApproved) return false;
    if (filters.geriatric && !med.geriatricApproved) return false;
    if (filters.controlledSubstance && !med.controlledSubstance) return false;
    if (filters.available !== undefined && med.available !== filters.available) return false;
    if (filters.favoritesOnly && !favoriteIds.has(med.id)) return false;
    return matchesQuery(med, q);
  });
}

function sortMedications(
  medications: MedicationRecord[],
  sort: MedicationFilters['sort'],
  q: string,
): MedicationRecord[] {
  const items = [...medications];

  switch (sort) {
    case 'most_searched':
      return items.sort((a, b) => b.searchCount - a.searchCount);
    case 'updated':
      return items.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case 'therapeutic_class':
      return items.sort((a, b) => a.therapeuticClass.localeCompare(b.therapeuticClass));
    case 'manufacturer':
      return items.sort((a, b) => (a.manufacturer ?? '').localeCompare(b.manufacturer ?? ''));
    case 'alphabetical':
    default:
      if (!q) return items.sort((a, b) => a.name.localeCompare(b.name));
      return items.sort((a, b) => {
        const aMatch = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bMatch = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aMatch - bMatch || a.name.localeCompare(b.name);
      });
  }
}

function buildFacets(medications: MedicationRecord[]) {
  const categories = new Set<MedicationCategory>();
  const therapeuticClasses = new Set<string>();
  const manufacturers = new Set<string>();
  const routes = new Set<MedicationRecord['route']>();

  for (const med of medications) {
    categories.add(med.category);
    therapeuticClasses.add(med.therapeuticClass);
    if (med.manufacturer) manufacturers.add(med.manufacturer);
    routes.add(med.route);
  }

  return {
    categories: [...categories],
    therapeuticClasses: [...therapeuticClasses].sort(),
    manufacturers: [...manufacturers].sort(),
    routes: [...routes],
  };
}

export const medicalLibraryService = {
  async search(filters: MedicationFilters = {}): Promise<MedicationSearchResult> {
    await delay();
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const favoriteIds = new Set(Object.values(getFavoritesStore()).flat());

    const filtered = sortMedications(
      applyFilters(MOCK_MEDICATIONS, filters, favoriteIds),
      filters.sort ?? 'alphabetical',
      normalizeQuery(filters.q),
    );

    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      facets: buildFacets(MOCK_MEDICATIONS),
    };
  },

  async getMedication(id: string): Promise<MedicationRecord | null> {
    await delay();
    return MOCK_MEDICATIONS.find((med) => med.id === id) ?? null;
  },

  async getRelatedMedications(id: string): Promise<MedicationRecord[]> {
    await delay(150);
    const med = MOCK_MEDICATIONS.find((item) => item.id === id);
    if (!med) return [];
    return MOCK_MEDICATIONS.filter(
      (item) => med.relatedMedicationIds.includes(item.id) || (item.category === med.category && item.id !== id),
    ).slice(0, 4);
  },

  async getCategories(): Promise<MedicationCategoryInfo[]> {
    await delay(100);
    const counts = getCategoryCounts();
    return (Object.keys(MEDICATION_CATEGORY_LABELS) as MedicationCategory[]).map((id) => ({
      id,
      label: MEDICATION_CATEGORY_LABELS[id],
      description: `Browse ${MEDICATION_CATEGORY_LABELS[id].toLowerCase()} medications`,
      count: counts[id] ?? 0,
    }));
  },

  async getStats(userId: string): Promise<MedicationLibraryStats> {
    await delay(100);
    const favorites = getFavoritesStore()[userId] ?? [];
    const all = MOCK_MEDICATIONS;
    const categories = new Set(all.map((m) => m.category));

    return {
      total: all.length,
      prescription: all.filter((m) => m.prescriptionRequired).length,
      overTheCounter: all.filter((m) => !m.prescriptionRequired).length,
      categories: categories.size,
      favorites: favorites.length,
    };
  },

  async listFavorites(userId: string): Promise<MedicationRecord[]> {
    await delay();
    const ids = new Set(getFavoritesStore()[userId] ?? []);
    return MOCK_MEDICATIONS.filter((m) => ids.has(m.id));
  },

  async toggleFavorite(userId: string, medicationId: string): Promise<boolean> {
    await delay(100);
    const store = getFavoritesStore();
    const current = new Set(store[userId] ?? []);
    const isFavorite = current.has(medicationId);
    if (isFavorite) current.delete(medicationId);
    else current.add(medicationId);
    store[userId] = [...current];
    saveFavoritesStore(store);
    return !isFavorite;
  },

  getPopularMedications() {
    return POPULAR_MEDICATIONS;
  },

  getSuggestions(query: string): string[] {
    const q = normalizeQuery(query);
    if (!q) return POPULAR_MEDICATIONS.slice(0, 5);

    const matches = new Set<string>();
    for (const med of MOCK_MEDICATIONS) {
      if (med.name.toLowerCase().includes(q)) matches.add(med.name);
      if (med.brandName?.toLowerCase().includes(q)) matches.add(med.brandName);
      if (med.genericName.toLowerCase().includes(q)) matches.add(med.genericName);
      if (med.atcCode.toLowerCase().includes(q)) matches.add(`${med.name} (${med.atcCode})`);
      for (const ingredient of med.activeIngredients) {
        if (ingredient.toLowerCase().includes(q)) matches.add(ingredient);
      }
    }
    return [...matches].slice(0, 6);
  },
};

export function getMedicationProfilePath(portalBase: string, medicationId: string) {
  return `${portalBase}/medical-library/${medicationId}`;
}
