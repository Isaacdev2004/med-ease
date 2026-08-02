import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export const establishmentAudiencePage = {
  seo: {
    title: "Med'ease Établissements | Maîtrisez et optimisez vos flux",
    description:
      'Pilotez capacités, admissions et coordinations territoriales en temps réel : désengorgement des urgences et optimisation des lits d\'aval.',
  },
  hero: {
    badge: 'Établissements de santé',
    titleLead: 'Maîtrisez et Optimisez vos flux.',
    titleAccent: 'Libérez vos lits.',
    subtitle:
      'Pilotez en temps réel les parcours, les capacités, les admissions et les coordinations territoriales depuis une infrastructure unique.',
    ctaLabel: 'Réinventer votre coordination',
    ctaId: 'establishment' as CtaFormId,
  },
  problem: {
    eyebrow: 'Le problème',
    title: 'Les défis des établissements',
    items: [
      'Saturation des urgences sans solution de délestage',
      'Manque de pilotage des capacités en temps réel',
      'Coordination territoriale insuffisante',
      'Bloc opératoire sous-optimisé',
    ],
  },
  solution: {
    eyebrow: 'La solution',
    title: "Med'ease pour votre établissement",
    items: [
      'Gestion des flux hospitaliers en temps réel',
      'Optimisation du bloc opératoire',
      'Gestion du transport sanitaire',
      'Triage et admissions numériques',
      'Tableaux de bord KPI complets',
    ],
  },
  impact: {
    eyebrow: 'Impact',
    title: 'Des résultats mesurables',
    items: [
      {
        title: 'Désengorgement des urgences',
        description: 'Fluidifier les flux et réduire les goulots d’étranglement.',
        tone: 'navy' as const,
      },
      {
        title: 'Optimisation capacité hospitalière',
        description: 'Visibilité temps réel sur les lits et les sorties.',
        tone: 'teal' as const,
      },
      {
        title: 'Performance renforcée en continu',
        description: 'KPI et alertes pour piloter au quotidien.',
        tone: 'deep' as const,
      },
      {
        title: 'Amélioration image d’établissement',
        description: 'Une coordination visible et fiable pour les partenaires.',
        tone: 'blue' as const,
      },
    ],
  },
  conclusion:
    "Bien plus qu'un outil métier, Med'ease déploie une infrastructure territoriale intelligente qui optimise vos lits d'aval, désengorge vos flux et sécurise la continuité des soins ville-hôpital.",
};
