import type { BdpmRecord } from '@/services/medical-library/medical-library.types';

/** BDPM-style CIS records (France). */
export const BDPM_MOCK_RECORDS: BdpmRecord[] = [
  { cis: '60002283', name: 'DOLIPRANE 500 mg, comprimé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '60498335', name: 'ADVIL 400 mg, comprimé pelliculé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '60315859', name: 'CLAMOXYL 500 mg/5 ml, poudre pour suspension buvable', form: 'suspension', route: 'orale', status: 'Autorisation active' },
  { cis: '65197451', name: 'GLUCOPHAGE 850 mg, comprimé pelliculé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '63256759', name: 'LANTUS 100 UI/ml, solution injectable', form: 'solution', route: 'injectable', status: 'Autorisation active' },
  { cis: '64405985', name: 'VENTOLINE 100 microgrammes/dose, suspension pressurée inhalée', form: 'inhalation', route: 'inhalée', status: 'Autorisation active' },
  { cis: '60477288', name: 'LEVOTHYROX 100 microgrammes, comprimé sécable', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '60234100', name: 'MOPRAL 20 mg, gélule gastro-résistante', form: 'gélule', route: 'orale', status: 'Autorisation active' },
  { cis: '63415964', name: 'AMLODIPINE EG 5 mg, comprimé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '63431654', name: 'Tahor 20 mg, comprimé pelliculé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '60002746', name: 'ASPEGIC 1000 mg, poudre pour solution buvable en sachet-dose', form: 'sachet', route: 'orale', status: 'Autorisation active' },
  { cis: '63406493', name: 'PLAVIX 75 mg, comprimé pelliculé', form: 'comprimé', route: 'orale', status: 'Autorisation active' },
  { cis: '65996239', name: 'SPIKEVAX, suspension injectable (COVID-19)', form: 'suspension', route: 'injectable', status: 'Autorisation active' },
];
