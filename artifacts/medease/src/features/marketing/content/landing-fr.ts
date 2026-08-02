export const landingSeo = {
  title:
    "Med'ease | Hub de coordination territoriale de santé & parcours de soins connecté",
  description:
    "Med'ease fluidifie le parcours de soins : gestion des lits hospitaliers, désengorgement des urgences, coordination patients et professionnels.",
};

export const landingHero = {
  brand: "Med'ease",
  titleLead: 'Le Hub de santé qui',
  titleAccent: 'reconnecte',
  titleTrail: 'la ville et l’hôpital.',
  subtitle:
    "Med'ease est un hub de coordination territoriale de santé qui synchronise patients, établissements, professionnels de santé, transports et soins de proximité en temps réel pour une prise en charge à 360°.",
  ctaLabel: 'Découvrir la Santé autrement',
};

export const landingProblem = {
  title:
    'Un système de santé fragmenté, des urgences saturées, une coordination complexe',
  today: [
    'Manque de visibilité sur les lits disponibles en temps réel',
    'Parcours de soins désorganisé',
    'Coordination inter-établissements limitée',
    'Transferts et admissions chronophages',
    'Transport sanitaire peu synchronisé',
    'Charge administrative croissante pour les professionnels',
  ],
  result: [
    'Saturation hospitalière',
    'Désengorgement difficile des urgences',
    'Retards d’admission',
    'Perte d’informations cliniques',
    'Stress pour les patients et les équipes',
    'Perte de chance de survie',
  ],
};

export const landingAudiences = {
  patient: {
    eyebrow: 'Patient & Aidant',
    title: 'Votre santé, entre de bonnes mains.',
    features: [
      {
        title: 'Pilulier virtuel',
        description: 'Suivi des traitements et rappels d’observance.',
      },
      {
        title: 'Mes rendez-vous',
        description: 'Agenda centralisé, confirmations et rappels.',
      },
      {
        title: 'Mon carnet de santé',
        description: 'Documents, résultats et ordonnances au même endroit.',
      },
      {
        title: 'Autour de moi',
        description: 'Médecins, pharmacies et urgences à proximité.',
      },
    ],
    values: ['Souveraineté', 'Partage maîtrisé', 'Simplicité', 'Sérénité'],
    ctaLabel: 'Reprendre le contrôle de mon parcours',
    ctaId: 'patient' as const,
  },
  professional: {
    eyebrow: 'Professionnel',
    title: 'Moins d’administratif, plus de temps pour soigner.',
    features: [
      {
        title: 'Gain de temps',
        description: 'Jusqu’à 40 % de tâches administratives en moins.',
      },
      {
        title: 'Sécurité',
        description: 'Messagerie professionnelle et données hébergées HDS.',
      },
      {
        title: 'Interopérabilité',
        description: 'Connexion aux outils métiers (DMP, DPI).',
      },
      {
        title: 'Collaboration',
        description: 'Parcours coordonnés pour les équipes de soins.',
      },
    ],
    values: [
      'Vue patient 360°',
      'Parcours fluides',
      'Échanges sécurisés',
      'Zéro double saisie',
    ],
    ctaLabel: 'Rejoindre les professionnels pilotes',
    ctaId: 'professional' as const,
  },
};

export const landingSolution = {
  title: 'Une plateforme de coordination territoriale et sécurisée',
  intro:
    "Med'ease centralise et connecte patients, aidants, professionnels de santé, établissements, pharmacies et transporteurs sanitaires.",
  actors: [
    { label: 'Patients', tone: 'patient' as const },
    { label: 'Aidants', tone: 'patient' as const },
    { label: 'Professionnels', tone: 'pro' as const },
    { label: 'Établissements', tone: 'facility' as const },
    { label: 'Pharmacies', tone: 'pharmacy' as const },
    { label: 'Transporteurs', tone: 'transport' as const },
  ],
  features: [
    {
      title: 'Pilulier virtuel',
      description:
        'Suivi des traitements en temps réel et observance médicamenteuse.',
    },
    {
      title: 'Gestion des lits',
      description:
        'Vision temps réel des capacités et facilitation des admissions.',
    },
    {
      title: 'E-parcours connecté',
      description:
        'De domicile à clinique : un parcours partagé et traçable.',
    },
    {
      title: 'Transport sanitaire',
      description: 'Planification et suivi en temps réel des transports.',
    },
    {
      title: 'Dossier & échanges sécurisés',
      description:
        'Partage documentaire et messagerie santé avec traçabilité.',
    },
    {
      title: 'Tableaux de bord & KPI',
      description:
        'Occupation, flux d’admission et indicateurs de fluidité.',
    },
  ],
};

export const landingFoundations = {
  title: "Les fondations de Med'ease",
  tagline: 'Fluidifier — Sécuriser — Optimiser — Humaniser',
  cards: [
    {
      title: 'Coordination',
      description:
        'Relier tous les acteurs du parcours de soins, de la ville à l’hôpital, en temps réel.',
      tone: 'blue' as const,
    },
    {
      title: 'Confiance',
      description:
        'Données de santé sécurisées, hébergement HDS, conformité RGPD et traçabilité totale.',
      tone: 'green' as const,
    },
    {
      title: 'Performance',
      description:
        'Optimisation des flux patients, réduction des délais d’admission et gain de temps médical.',
      tone: 'amber' as const,
    },
    {
      title: 'Humain',
      description:
        'Replacer le patient et les soignants au cœur du système de santé.',
      tone: 'rose' as const,
    },
  ],
};

export const landingImpact = {
  title:
    'Un impact mesurable sur la performance hospitalière et la santé publique',
  items: [
    'Optimisation des flux hospitaliers',
    'Réduction du délai moyen d’admission',
    'Meilleure coordination pluridisciplinaire',
    'Gain de temps médical',
    'Amélioration de la satisfaction patient',
    'Réduction des appels aux urgences',
  ],
  sovereignty:
    "Med'ease contribue à la souveraineté numérique en santé : plateforme sécurisée et interopérable — nous ne remplaçons pas les outils existants, nous les connectons.",
};

export const landingWhyNow = {
  title: 'Pourquoi maintenant ?',
  subtitle: 'Le système de santé atteint ses limites.',
  waitTime: {
    value: '04:35',
    label: 'Temps d’attente moyen aux urgences',
  },
  urgency: [
    '+21 millions de passages aux urgences chaque année en France',
    'Temps d’attente moyen : jusqu’à 4 à 5 heures, parfois plus',
    'Près de 30 000 lits d’hospitalisation complète supprimés en 10 ans',
    'Plus de 100 000 lits hospitaliers supprimés en 20 ans',
  ],
  coordination: [
    'Jusqu’à 30 % du temps des soignants perdu en tâches administratives',
    'Des milliers de lits immobilisés chaque jour faute de coordination',
    'Des délais d’admission allongés, des parcours ralentis',
  ],
  daily: [
    'Des patients attendent',
    'Des équipes s’épuisent',
    'Des décisions sont retardées',
  ],
};

export const landingTrust = {
  title: 'Établissements, confiance & sécurité',
  subtitle:
    'Pilotage territorial, interopérabilité HL7 FHIR et souveraineté numérique pour les données de santé.',
  badges: [
    'HDS',
    'CNIL / RGPD',
    'ISO 27001',
    'ANS',
    'SESAM-Vitale',
    'OVHcloud',
  ],
};

export const landingDualCta = {
  establishment: {
    label: 'Rejoindre les établissements pilotes',
    ctaId: 'establishment' as const,
  },
  patient: {
    label: 'Reprendre le contrôle de mon parcours de soins',
    ctaId: 'patient' as const,
  },
};

export const landingFaq = {
  title: 'Questions fréquentes',
  items: [
    {
      question: "Comment Med'ease aide à désengorger les urgences ?",
      answer:
        'En facilitant l’accès aux lits d’aval, en optimisant la gestion hospitalisation numérique et en améliorant l’orientation patient.',
    },
    {
      question: 'Comment fonctionne la gestion des lits ?',
      answer:
        'Les établissements mettent à jour leurs capacités en temps réel. Les demandes d’admission sont centralisées et priorisées.',
    },
    {
      question: "Med'ease est-elle conforme RGPD et HDS ?",
      answer:
        'Oui. Les données de santé sont sécurisées, hébergées en conformité HDS et protégées selon les normes européennes.',
    },
    {
      question: 'La plateforme est-elle compatible avec les systèmes hospitaliers ?',
      answer:
        "Med'ease est conçue pour être interopérable avec les logiciels hospitaliers existants (HL7 FHIR, DPI, DMP).",
    },
  ],
};

export const ctaConfirmationMessage =
  "Bienvenue dans l'expérience Med'ease. Votre demande est entre les mains de nos équipes. Nous reviendrons vers vous rapidement afin de construire, ensemble, un parcours de santé plus fluide, plus humain et mieux coordonné.";
