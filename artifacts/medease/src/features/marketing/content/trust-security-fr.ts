import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export const trustSecurityPage = {
  seo: {
    title: "Med'ease | Confiance & Sécurité",
    description:
      'Infrastructure de santé sécurisée, conforme et interopérable : HDS, RGPD, chiffrement AES-256, souveraineté numérique en France.',
  },
  hero: {
    title:
      'Une infrastructure de santé sécurisée, conforme et interopérable',
    subtitle:
      'Données de santé protégées, hébergement certifié et standards d’échange ouverts pour connecter vos systèmes sans rupture.',
    ctaLabel: "Explorer l'offre",
    ctaId: 'hub' as CtaFormId,
  },
  partners: {
    eyebrow: 'Partenaires techniques',
    title:
      'Une infrastructure basée sur des partenaires technologiques reconnus',
    items: [
      'OVHcloud',
      'AWS',
      'CNIL',
      'ISO 27001',
      'HL7 FHIR',
      'SESAM-Vitale',
    ],
  },
  pillars: [
    {
      title: 'Conformité & Protection',
      headline: 'Les données restent sous contrôle',
      items: [
        'RGPD (UE)',
        'Hébergeur HDS',
        'Chiffrement des données',
        'Gestion des accès',
        'Journalisation (logs)',
      ],
    },
    {
      title: 'Interopérabilité médicale',
      headline: 'Intégration sans rupture',
      items: [
        'HL7',
        'FHIR',
        'API sécurisées',
        'Compatibilité SIH',
        'Ségur du numérique',
      ],
    },
    {
      title: 'Sécurité technique',
      headline: 'Niveau exigeant',
      items: [
        'Chiffrement AES-256',
        'Authentification forte (MFA)',
        'Gestion des rôles (RBAC)',
        'Audit & traçabilité',
        'Tests de pénétration réguliers',
      ],
    },
  ],
  sovereignty: {
    title: 'Souveraineté Numérique',
    body: 'Les données de santé sont hébergées en France sur des infrastructures certifiées, sous gouvernance claire et traçable.',
    badges: [
      '100% Souveraineté France',
      'AES-256 Chiffrement',
      'MFA Authentification',
      '24/7 Monitoring',
    ],
  },
};
