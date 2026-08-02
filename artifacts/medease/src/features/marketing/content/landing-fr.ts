export const landingSeo = {
  title:
    "Med'ease | Hub de coordination territoriale de santé & parcours de soins connecté",
  description:
    "Med'ease fluidifie le parcours de soins : gestion des lits hospitaliers, désengorgement des urgences, coordination patients et professionnels.",
};

export const landingNav = [
  { href: '/notre-vision', label: 'Notre Vision', kind: 'route' as const },
  { href: '/patients', label: 'Patients & Aidants', kind: 'route' as const },
  { href: '/professionnels', label: 'Professionnels', kind: 'route' as const },
  { href: '/etablissements', label: 'Établissements', kind: 'route' as const },
  { href: '/conciergerie', label: 'Coordinateur Santé', kind: 'route' as const },
  {
    href: '/confiance-securite',
    label: 'Confiance & Sécurité',
    kind: 'route' as const,
  },
  { href: '/help', label: "Centre d'aide", kind: 'route' as const },
];

export const landingHero = {
  eyebrow: 'Une solution pour tous les acteurs',
  titleLead: 'Le Hub de santé qui',
  titleAccent: 'reconnecte',
  titleTrail: 'la ville et l’hôpital.',
  subtitle:
    "Med'ease est un hub de coordination territoriale de santé qui synchronise patients, établissements, professionnels de santé, transports et soins de proximité en temps réel pour une prise en charge à 360°.",
  ctaLabel: 'Découvrir la Santé autrement',
  stats: [
    { value: '+80%', label: 'de fluidité sur les parcours coordonnés' },
    { value: '85%', label: 'des équipes gagnent du temps médical' },
  ],
};

export const landingProblem = {
  title:
    'Un système de santé fragmenté, des urgences saturées, une coordination complexe',
  items: [
    'Manque de visibilité sur les lits disponibles en temps réel',
    'Parcours de soins désorganisé',
    'Coordination inter-établissements limitée',
    'Transferts et admissions chronophages',
    'Transport sanitaire peu synchronisé',
    'Charge administrative croissante pour les professionnels',
  ],
};

export const landingSolution = {
  titleLead: 'Une plateforme de coordination',
  titleAccent: 'territoriale & sécurisée',
  intro:
    "Med'ease centralise et connecte patients, aidants, professionnels de santé, établissements, pharmacies et transporteurs sanitaires.",
  modules: [
    {
      title: 'Missions de coordination',
      description: 'Orientations, demandes et priorisation en temps réel.',
      tone: 'green' as const,
    },
    {
      title: 'Urgences',
      description: 'Fluidifier les flux et réduire les goulots d’étranglement.',
      tone: 'rose' as const,
    },
    {
      title: 'Parcours de soins',
      description: 'E-parcours connecté de la ville à l’hôpital.',
      tone: 'blue' as const,
    },
    {
      title: 'Suivi & pilotage',
      description: 'Tableaux de bord, KPI et alertes territoriales.',
      tone: 'sky' as const,
    },
  ],
};

export const landingFaq = {
  title: "Comment se place Med'ease dans cet écosystème ?",
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
    {
      question: 'Combien de temps prend la mise en place ?',
      answer:
        'Les établissements pilotes démarrent en quelques semaines : paramétrage, formation courte des équipes, puis montée en charge progressive.',
    },
  ],
};

export const landingFoundations = {
  title: "Les Fondations de Med'ease",
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
  metrics: [
    { value: '+21%', label: 'passages urgences / an', tone: 'teal' as const },
    { value: '04:35', label: 'attente moyenne urgences', tone: 'navy' as const },
    { value: '93%', label: 'parcours mieux coordonnés', tone: 'blue' as const },
    { value: '350', label: 'établissements adressables', tone: 'indigo' as const },
  ],
  chartLabel: 'Évolution de la fluidité des parcours (indicative)',
  chartBars: [42, 55, 61, 70, 78, 88],
};

export const landingWhyNow = {
  title: 'Le système de santé atteint ses limites.',
  subtitle: 'Chaque jour, des patients attendent, des équipes s’épuisent, des décisions sont retardées.',
  waitTime: {
    value: '04:35',
    label: 'Temps d’attente moyen aux urgences',
  },
  facts: [
    '+21 millions de passages aux urgences chaque année en France',
    'Près de 30 000 lits d’hospitalisation complète supprimés en 10 ans',
    'Jusqu’à 30 % du temps des soignants perdu en tâches administratives',
  ],
  audiences: [
    {
      title: 'Patient & Aidant',
      description: 'Carnet de santé, pilulier et parcours clarifié.',
      href: '/patients',
    },
    {
      title: 'Professionnel',
      description: 'Moins d’administratif, plus de temps pour soigner.',
      href: '/professionnels',
    },
    {
      title: 'Établissement',
      description: 'Pilotage des lits, urgences et flux territoriaux.',
      href: '/etablissements',
    },
  ],
};

export const landingPartners = {
  title: 'Un écosystème ouvert et interopérable',
  items: [
    'HDS',
    'CNIL / RGPD',
    'ISO 27001',
    'ANS',
    'SESAM-Vitale',
    'HL7 FHIR',
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

export const ctaConfirmationMessage =
  "Bienvenue dans l'expérience Med'ease. Votre demande est entre les mains de nos équipes. Nous reviendrons vers vous rapidement afin de construire, ensemble, un parcours de santé plus fluide, plus humain et mieux coordonné.";
