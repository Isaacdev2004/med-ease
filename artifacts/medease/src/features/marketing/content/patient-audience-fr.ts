import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export const patientAudiencePage = {
  seo: {
    title: "Med'ease Patients & Aidants | Votre santé, partout avec vous",
    description:
      'Organisez votre parcours de soins, gérez vos médicaments et accédez à votre carnet de santé numérique sécurisé avec Med\'ease.',
  },
  hero: {
    badge: 'Patient & Aidant',
    title: 'Votre Santé, partout avec vous, en toute sécurité.',
    subtitle:
      'Med\'ease synchronise vos acteurs de santé pour transformer un parcours complexe en une trajectoire fluide, sécurisée et profondément humaine.',
    ctaLabel: 'Découvrir votre parcours personnalisé',
    ctaId: 'patient' as CtaFormId,
  },
  problem: {
    title: 'Ce que vivent les patients aujourd’hui',
    items: [
      'Difficulté à organiser son parcours de soins',
      'Informations et documents dispersés, peu lisibles',
      'Oublis de rendez-vous et de médicaments fréquents',
      'Manque d’information claire et de coordination',
    ],
  },
  solution: {
    eyebrow: 'La solution',
    title: "Med'ease à votre service",
    items: [
      'Dossier santé numérique centralisé',
      'Pilulier virtuel et rappels intelligents',
      'Recherche médicale simplifiée autour de moi',
      'Suivi post-opératoire personnalisé',
      'Télésurveillance patient en temps réel',
      'Et bien plus encore…',
    ],
  },
  impact: {
    eyebrow: "L'impact",
    title: "Ce que Med'ease change pour vous",
    items: [
      {
        title: 'Autonomie',
        description: 'Reprenez la main sur votre parcours de soins.',
      },
      {
        title: 'Meilleure observance',
        description: 'Ne ratez plus vos traitements ni vos rendez-vous.',
      },
      {
        title: 'Coordination simplifiée',
        description: 'Tous vos soignants connectés autour de vous.',
      },
      {
        title: 'Réduction du stress',
        description: 'Une information claire, un esprit rassuré.',
      },
    ],
    trustMarks: [
      'Hébergement France',
      'HDS',
      'RGPD',
      'Partage maîtrisé',
      '24/7',
      'Carnet sécurisé',
    ],
  },
  conclusion:
    "Med'ease synchronise l'ensemble de vos acteurs de santé en temps réel pour transformer un parcours complexe en une trajectoire fluide, sécurisée et profondément humaine.",
};
