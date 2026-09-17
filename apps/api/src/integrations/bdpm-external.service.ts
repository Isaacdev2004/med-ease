import { Injectable, Logger } from '@nestjs/common';

export type BdpmExternalRecord = {
  id: string;
  bdpmId: string;
  name: string;
  brandName?: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  route: string;
  manufacturer?: string;
  description: string;
  activeIngredients: string[];
};

type BdpmItem = {
  cis?: number | string;
  elementPharmaceutique?: string;
  formePharmaceutique?: string;
  voiesAdministration?: string[];
  statusAutorisation?: string;
  titulaire?: string;
  composition?: Array<{
    denominationSubstance?: string;
    dosage?: string;
    natureComposant?: string;
  }>;
};

@Injectable()
export class BdpmExternalService {
  private readonly logger = new Logger(BdpmExternalService.name);
  private readonly baseUrl = 'https://medicaments-api.giygas.dev/v1/medicaments';

  async search(query: string, limit = 20): Promise<BdpmExternalRecord[]> {
    const q = query.trim();
    if (q.length < 3) return [];

    try {
      const url = `${this.baseUrl}?search=${encodeURIComponent(q)}&pageSize=${limit}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return [];

      const data = (await res.json()) as BdpmItem[] | BdpmItem;
      const items = Array.isArray(data) ? data : [data];
      return items.slice(0, limit).map((item) => this.mapItem(item));
    } catch (error) {
      this.logger.warn(`BDPM search failed: ${String(error)}`);
      return [];
    }
  }

  private mapItem(item: BdpmItem): BdpmExternalRecord {
    const cis = String(item.cis ?? '');
    const name = item.elementPharmaceutique?.trim() ?? 'Médicament';
    const active =
      item.composition?.find((c) => c.natureComposant === 'SA') ??
      item.composition?.[0];

    return {
      id: `bdpm-${cis}`,
      bdpmId: cis,
      name,
      brandName: name.split(',')[0]?.trim(),
      genericName: active?.denominationSubstance?.trim() ?? name,
      strength: active?.dosage?.trim() ?? '—',
      dosageForm: item.formePharmaceutique?.trim() ?? '—',
      route: item.voiesAdministration?.[0] ?? 'orale',
      manufacturer: item.titulaire?.trim(),
      description: `${name}. Source BDPM (${item.statusAutorisation ?? '—'}).`,
      activeIngredients: item.composition
        ?.filter((c) => c.natureComposant === 'SA')
        .map((c) => `${c.denominationSubstance ?? ''} ${c.dosage ?? ''}`.trim())
        .filter(Boolean) ?? [],
    };
  }
}
