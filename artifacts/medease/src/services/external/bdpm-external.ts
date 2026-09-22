import type {
  MedicationCategory,
  MedicationRecord,
  MedicationRoute,
} from '@/services/medical-library/medical-library.types';

/** Public BDPM mirror (data.gouv.fr / BDPM open data). */
const BDPM_SEARCH_URL = 'https://medicaments-api.giygas.dev/v1/medicaments';

type BdpmComposition = {
  denominationSubstance?: string;
  dosage?: string;
  natureComposant?: string;
};

type BdpmItem = {
  cis?: number | string;
  elementPharmaceutique?: string;
  formePharmaceutique?: string;
  voiesAdministration?: string[];
  statusAutorisation?: string;
  titulaire?: string;
  composition?: BdpmComposition[];
};

function mapRoute(voies: string[] | undefined): MedicationRoute {
  const raw = (voies?.[0] ?? 'orale').toLowerCase();
  if (raw.includes('inject')) return 'injection';
  if (raw.includes('inhal')) return 'inhalation';
  if (raw.includes('topique') || raw.includes('cutan')) return 'topical';
  if (raw.includes('rect')) return 'rectal';
  if (raw.includes('subling')) return 'sublingual';
  if (raw.includes('ophtalm')) return 'ophthalmic';
  if (raw.includes('intravein')) return 'intravenous';
  return 'oral';
}

function inferCategory(name: string, dci: string): MedicationCategory {
  const hay = `${name} ${dci}`.toLowerCase();
  if (/amox|augmentin|antibio|cef|penicill/.test(hay)) return 'antibiotics';
  if (/metform|insulin|glucoph|lantus/.test(hay)) return 'diabetes';
  if (/ator|tahor|statine|amlodip/.test(hay)) return 'cardiology';
  if (/ventolin|salbut|asth/.test(hay)) return 'respiratory';
  if (/omepr|mopral|inhibiteur.*pompe/.test(hay)) return 'gastroenterology';
  if (/vaccin|spikevax/.test(hay)) return 'vaccines';
  return 'pain_relief';
}

function activeIngredient(composition: BdpmComposition[] | undefined): string {
  const active =
    composition?.find((c) => c.natureComposant === 'SA') ?? composition?.[0];
  return active?.denominationSubstance?.trim() ?? '';
}

function strengthFromComposition(composition: BdpmComposition[] | undefined): string {
  const active =
    composition?.find((c) => c.natureComposant === 'SA') ?? composition?.[0];
  return active?.dosage?.trim() ?? '';
}

export function mapBdpmItemToMedicationRecord(item: BdpmItem): MedicationRecord {
  const cis = String(item.cis ?? '');
  const name = item.elementPharmaceutique?.trim() ?? 'Médicament';
  const dci = activeIngredient(item.composition) || name;
  const strength = strengthFromComposition(item.composition) || '—';
  const form = item.formePharmaceutique?.trim() || '—';
  const now = new Date().toISOString();

  return {
    id: `bdpm-${cis}`,
    bdpmId: cis,
    name,
    brandName: name.split(',')[0]?.trim(),
    genericName: dci,
    strength,
    dosageForm: form,
    route: mapRoute(item.voiesAdministration),
    atcCode: '',
    therapeuticClass: dci,
    category: inferCategory(name, dci),
    manufacturer: item.titulaire?.trim(),
    prescriptionRequired: true,
    controlledSubstance: false,
    pregnancySafety: 'unknown',
    breastfeedingSafety: 'unknown',
    pediatricApproved: false,
    geriatricApproved: true,
    available: item.statusAutorisation?.toLowerCase().includes('active') ?? true,
    searchCount: 0,
    description: `${name} — ${form}. Source BDPM.`,
    activeIngredients: item.composition
      ?.filter((c) => c.natureComposant === 'SA')
      .map((c) => `${c.denominationSubstance ?? ''} ${c.dosage ?? ''}`.trim())
      .filter(Boolean) ?? [dci],
    indications: [],
    contraindications: [],
    warnings: [],
    precautions: [],
    sideEffects: [],
    administration: item.voiesAdministration ?? [],
    storage: 'Voir notice officielle',
    patientInformation: 'Consultez la notice ou votre pharmacien.',
    professionalInformation: 'Données BDPM — Base de Données Publique des Médicaments.',
    references: [
      'BDPM — https://base-donnees-publique.medicaments.gouv.fr',
      'API — https://medicaments-api.giygas.dev',
    ],
    dosages: [],
    interactions: [],
    relatedMedicationIds: [],
    updatedAt: now,
  };
}

/** Live BDPM search (MVP codages fallback layer). */
export async function searchBdpmExternal(
  query: string,
  limit = 20,
): Promise<MedicationRecord[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url = `${BDPM_SEARCH_URL}?search=${encodeURIComponent(q)}&pageSize=${limit}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];

    const data = (await res.json()) as BdpmItem[] | BdpmItem;
    const items = Array.isArray(data) ? data : [data];
    return items.slice(0, limit).map(mapBdpmItemToMedicationRecord);
  } catch {
    return [];
  }
}

export async function getBdpmMedicationByCis(
  cis: string,
): Promise<MedicationRecord | null> {
  if (!cis.trim()) return null;
  try {
    const res = await fetch(`${BDPM_SEARCH_URL}/${encodeURIComponent(cis)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as BdpmItem;
    return mapBdpmItemToMedicationRecord(data);
  } catch {
    return null;
  }
}
