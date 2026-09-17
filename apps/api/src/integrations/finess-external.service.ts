import { Injectable, Logger } from '@nestjs/common';

export type FinessExternalRecord = {
  id: string;
  finessNumber?: string;
  name: string;
  type: string;
  street: string;
  city: string;
  department: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
};

type Establishment = {
  siret?: string;
  adresse?: string;
  code_postal?: string;
  commune?: string;
  libelle_commune?: string;
  latitude?: string | number;
  longitude?: string | number;
  liste_enseignes?: string[] | null;
  liste_finess?: string[] | null;
};

type SearchOrg = {
  nom_complet?: string;
  nom_raison_sociale?: string;
  sigle?: string;
  siege?: Establishment;
  matching_etablissements?: Establishment[];
};

@Injectable()
export class FinessExternalService {
  private readonly logger = new Logger(FinessExternalService.name);
  private readonly baseUrl = 'https://recherche-entreprises.api.gouv.fr/search';

  async search(query: string, limit = 20): Promise<FinessExternalRecord[]> {
    const q = query.trim();
    if (q.length < 2) return [];

    try {
      const params = new URLSearchParams({
        q,
        est_finess: 'true',
        per_page: String(limit),
      });
      const res = await fetch(`${this.baseUrl}?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return [];

      const data = (await res.json()) as { results?: SearchOrg[] };
      return this.flatten(data.results ?? []).slice(0, limit);
    } catch (error) {
      this.logger.warn(`FINESS search failed: ${String(error)}`);
      return [];
    }
  }

  private flatten(results: SearchOrg[]): FinessExternalRecord[] {
    const out: FinessExternalRecord[] = [];
    const seen = new Set<string>();

    for (const org of results) {
      const fallback =
        org.sigle ?? org.nom_complet ?? org.nom_raison_sociale ?? 'Établissement';
      const rows = [
        ...(org.matching_etablissements ?? []),
        ...(org.siege ? [org.siege] : []),
      ];

      for (const row of rows) {
        const finess = row.liste_finess?.[0];
        const name = row.liste_enseignes?.[0] ?? fallback;
        const key = finess ?? row.siret ?? name;
        if (seen.has(key)) continue;
        seen.add(key);

        const postal = row.code_postal ?? '';
        const department =
          postal.slice(0, 2) === '97' ? postal.slice(0, 3) : postal.slice(0, 2);
        const lat = row.latitude != null ? Number(row.latitude) : undefined;
        const lon = row.longitude != null ? Number(row.longitude) : undefined;

        out.push({
          id: finess ? `finess-ext-${finess}` : `siret-ext-${row.siret ?? key}`,
          finessNumber: finess,
          name,
          type: 'facility',
          street: row.adresse ?? '',
          city: row.libelle_commune ?? row.commune ?? '',
          department,
          postalCode: postal,
          latitude: Number.isFinite(lat) ? lat : undefined,
          longitude: Number.isFinite(lon) ? lon : undefined,
        });
      }
    }

    return out;
  }
}
