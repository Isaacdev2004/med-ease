import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export const professionalAudiencePage = {
  seo: {
    title: "Med'ease Professionnels | Vous soignez. On coordonne.",
    description:
      'Reprenez votre cœur de métier : Med\'ease gère la coordination avec dossier partagé, messagerie santé et gestion des lits en temps réel.',
  },
  hero: {
    badge: 'Professionnel de santé',
    title: 'Vous Soignez. On coordonne.',
    subtitle:
      'Votre hub de coordination médicale centralise les informations, fluidifie les parcours et vous rend du temps pour soigner.',
    ctaLabel: 'Découvrir votre Hub de coordination',
    ctaId: 'professional' as CtaFormId,
  },
  problem: {
    eyebrow: 'Le problème',
    title: 'Ce qui épuise les professionnels',
    items: [
      'Charge administrative excessive et chronophage',
      'Manque de visibilité sur les lits disponibles en temps réel',
      'Difficulté de coordination pluridisciplinaire',
      'Gestion complexe des admissions et transferts',
    ],
  },
  solution: {
    eyebrow: 'La solution',
    title: "Med'ease libère votre temps médical",
    items: [
      'Dossier patient partagé et sécurisé',
      'Messagerie santé sécurisée entre professionnels',
      'Gestion des lits d’aval en temps réel',
      'Demande d’hospitalisation numérique simplifiée',
      'E-parcours configurables selon vos besoins',
    ],
  },
  features: {
    eyebrow: 'Fonctionnalités clés',
    title: 'Tout ce dont vous avez besoin en un seul Hub',
    items: [
      { title: 'Gain de temps', description: 'Moins d’administratif au quotidien.' },
      { title: 'Sécurité', description: 'Échanges et données protégés HDS.' },
      { title: 'Dossier patient', description: 'Vue partagée, zéro double saisie.' },
      { title: 'Collaboration', description: 'Équipes coordonnées en temps réel.' },
      { title: 'Analytiques', description: 'Indicateurs utiles pour piloter.' },
      { title: 'Tout exercice', description: 'Ville, hôpital et structures.' },
    ],
  },
  conclusion:
    'Parce que chaque minute gagnée sur la coordination est une minute rendue aux patients, Med\'ease libère votre temps, valorise votre expertise et vous permet de vous consacrer pleinement au soin.',
};
