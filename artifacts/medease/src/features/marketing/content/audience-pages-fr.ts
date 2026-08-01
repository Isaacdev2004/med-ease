import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export type StandardAudiencePageId = 'patient' | 'professional' | 'establishment';

export interface StandardAudiencePage {
  seo: { title: string; description: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaId: CtaFormId;
  };
  problem: { title: string; items: string[] };
  solution: { title: string; items: string[] };
  impact: { title: string; items: string[] };
  conclusion: string;
}

export const standardAudiencePages: Record<
  StandardAudiencePageId,
  StandardAudiencePage
> = {
  patient: {
    seo: {
      title: "Med'ease Patients | Carnet de santé numérique & parcours de soins",
      description:
        'Organisez votre parcours de soins, trouvez un lit disponible, gérez vos médicaments et accédez à votre carnet de santé numérique sécurisé avec Med\'ease.',
    },
    hero: {
      badge: 'Espace Patient',
      title: 'Votre santé, partout avec vous, en toute sécurité.',
      subtitle:
        'Med\'ease vous accompagne avant, pendant et après vos soins : carnet numérique, pilulier intelligent et coordination de votre parcours.',
      ctaLabel: 'Reprendre le contrôle de mon parcours',
      ctaId: 'patient',
    },
    problem: {
      title: 'Les défis du parcours patient au quotidien',
      items: [
        'Difficulté à organiser son parcours de soins',
        'Ordonnances dispersées et/ou perdues',
        'Oublis de médicaments',
        'Manque d\'informations fiables',
      ],
    },
    solution: {
      title: 'Des outils concrets pour votre autonomie',
      items: [
        'Carnet de santé numérique',
        'Pilulier virtuel intelligent',
        'Recherche médecin de garde autour de moi',
        'Suivi post-opératoire',
        'Télésurveillance patient',
      ],
    },
    impact: {
      title: 'Un impact direct sur votre quotidien',
      items: [
        'Autonomie',
        'Meilleure observance',
        'Coordination simplifiée',
        'Réduction du stress',
      ],
    },
    conclusion:
      'Med\'ease synchronise l\'ensemble de vos acteurs de santé en temps réel pour transformer un parcours complexe en une trajectoire fluide, sécurisée et profondément humaine.',
  },
  professional: {
    seo: {
      title: "Med'ease Professionnels | Coordination médicale & gain de temps",
      description:
        'Reprenez votre cœur de métier : Med\'ease gère la coordination pour vous avec dossier partagé, messagerie santé et gestion des lits en temps réel.',
    },
    hero: {
      badge: 'Professionnels de santé',
      title: 'Vous soignez. On coordonne.',
      subtitle:
        'Reprenez votre cœur de métier : nous gérons la coordination pour vous — admissions, lits d\'aval et e-parcours connecté.',
      ctaLabel: 'Rejoindre les professionnels pilotes',
      ctaId: 'professional',
    },
    problem: {
      title: 'Ce qui freine votre pratique au quotidien',
      items: [
        'Charge administrative excessive',
        'Manque de visibilité lits disponibles temps réel',
        'Difficulté coordination pluridisciplinaire',
        'Gestion complexe des admissions',
      ],
    },
    solution: {
      title: 'Une plateforme pensée pour les soignants',
      items: [
        'Dossier patient partagé',
        'Messagerie santé sécurisée',
        'Gestion des lits d\'aval',
        'Demande d\'hospitalisation numérique',
        'E-parcours configurable',
      ],
    },
    impact: {
      title: 'Des bénéfices mesurables pour vos équipes',
      items: [
        'Gain de temps médical',
        'Meilleure organisation',
        'Réduction des appels',
        'Amélioration qualité de prise en charge',
      ],
    },
    conclusion:
      'Parce que chaque minute gagnée sur la coordination est une minute rendue aux patients, Med\'ease vous accompagne au quotidien, libère votre temps et vous permet de vous consacrer pleinement au soin.',
  },
  establishment: {
    seo: {
      title: "Med'ease Établissements | Gestion des flux hospitaliers",
      description:
        'Optimisez vos lits d\'aval et la coordination hospitalière en temps réel : désengorgement des urgences, pilotage des capacités et tableaux de bord KPI.',
    },
    hero: {
      badge: 'Établissements de santé',
      title: 'Maîtrisez et optimisez vos flux. Libérez vos lits.',
      subtitle:
        'Gestion des flux hospitaliers : pilotage des capacités, coordination territoriale et performance mesurable pour votre établissement.',
      ctaLabel: 'Rejoindre les établissements pilotes',
      ctaId: 'establishment',
    },
    problem: {
      title: 'Les tensions structurelles de votre établissement',
      items: [
        'Saturation des urgences',
        'Manque de pilotage des capacités',
        'Coordination territoriale insuffisante',
        'Bloc opératoire sous-optimisé',
      ],
    },
    solution: {
      title: 'Une infrastructure territoriale intelligente',
      items: [
        'Gestion lits hospitaliers temps réel',
        'Optimisation bloc opératoire',
        'Gestion transport sanitaire hôpital',
        'Triage admissions numérique',
        'Tableaux de bord KPI',
      ],
    },
    impact: {
      title: 'Performance hospitalière et image établissement',
      items: [
        'Désengorgement des urgences',
        'Optimisation capacité hospitalière',
        'Performance mesurable',
        'Amélioration image établissement',
      ],
    },
    conclusion:
      'Bien plus qu\'un outil métier, Med\'ease déploie une infrastructure territoriale intelligente qui optimise vos lits d\'aval, désengorge vos flux et sécurise la continuité des soins ville-hôpital.',
  },
};

export const visionPage = {
  seo: {
    title: "Med'ease | Notre vision — Construire la santé de demain",
    description:
      'Med\'ease construit le Hub de Coordination Territoriale qui reconnecte tous les acteurs du parcours de santé pour un système synchronisé.',
  },
  hero: {
    title: 'Construire la santé de demain',
    subtitle:
      'Chaque transformation majeure commence par une vision. Med\'ease construit le Hub de Coordination Territoriale qui reconnecte enfin tous les acteurs du parcours de santé.',
    ctaLabel: 'Construisons ensemble la santé de demain',
    ctaId: 'vision' as const,
  },
  conviction: {
    title: 'Notre conviction',
    lead: 'Nous croyons qu\'aucun patient ne devrait subir les limites organisationnelles.',
    points: [
      'La santé française dispose d\'excellents professionnels. Ce qui manque n\'est pas le talent — c\'est la coordination.',
      'Des informations dispersées.',
      'Des acteurs isolés.',
      'Des décisions ralenties.',
      'Des milliers d\'heures perdues chaque jour.',
    ],
  },
  pillars: [
    {
      emoji: '🧭',
      title: 'Vision',
      description:
        'Un système de santé plus fluide, plus juste et plus humain, où chaque patient est orienté au bon endroit, au bon moment, grâce à une coordination intelligente et partagée.',
    },
    {
      emoji: '🤝',
      title: 'Mission',
      description:
        'Agir concrètement pour une meilleure santé pour tous, en facilitant la coordination des soins et l\'accès à l\'information, en quelques clics.',
    },
    {
      emoji: '💡',
      title: 'Promesse',
      description:
        'Parce que chaque minute compte, notre hub de santé est présent à tout moment pour une vie plus sereine : moins d\'attente, moins de complications, plus de confiance et de qualité de vie.',
    },
    {
      emoji: '🚀',
      title: 'Ambition',
      description:
        'Simplifier et fluidifier l\'organisation des soins pour désengorger les urgences, réduire les inégalités d\'accès, renforcer la qualité des prises en charge et alléger la charge des professionnels.',
    },
  ],
  commitments: [
    'Votre santé, notre priorité. (pour les patients)',
    'Votre expertise, notre engagement. (pour les professionnels de santé)',
  ],
  manifesto: {
    title: 'Manifeste',
    intro:
      'Trop de patients attendent, trop de professionnels s\'épuisent, trop d\'urgences débordent. Mais nous croyons qu\'un autre système est possible.',
    body: [
      'Un système connecté et coordonné, où les bons soins arrivent au bon moment, où les professionnels retrouvent du temps médical, et où chaque citoyen accède à une prise en charge adaptée.',
      'Nous mettons la technologie au service de l\'humain. Grâce à l\'intelligence artificielle, nous analysons les données de terrain pour éclairer les décisions, fluidifier les parcours et optimiser les ressources.',
      'Moins d\'attente. Moins d\'erreurs. Moins de solitude. Plus de confiance. Plus d\'équité. Plus de santé.',
      'Nous sommes la première plateforme intelligente de coordination en santé — et nous ne faisons pas que connecter les acteurs : nous les rassemblons.',
    ],
  },
  philosophy: {
    title: 'Notre philosophie',
    body: 'Chez Med\'ease nous croyons que la santé ne se résume pas à des actes médicaux : elle commence par l\'écoute, l\'attention et la fluidité. Notre ambition n\'est pas seulement de coordonner les soins, mais de prendre soin, avec précision et humanité.',
  },
  values: [
    {
      title: 'Comprendre avant d\'agir',
      description:
        'Nous analysons, écoutons et observons. Un parcours de soin efficace commence par une compréhension fine de chaque situation.',
    },
    {
      title: 'Accompagner avec constance et proximité',
      description:
        'Nous ne sommes pas juste une plateforme, nous sommes un compagnon de santé : disponible, réactif, fiable.',
    },
    {
      title: 'Faciliter la vie de chacun',
      description:
        'Notre objectif est clair : moins de stress, plus de confort. Nous simplifions l\'accès aux soins et réduisons les frictions.',
    },
    {
      title: 'Allier innovation et responsabilité',
      description:
        'Notre technologie s\'appuie sur l\'intelligence artificielle de pointe, dans une logique d\'utilité, de sécurité et de respect des personnes.',
    },
  ],
  leitmotiv: 'Votre confort. Votre bien-être. Notre engagement.',
};

export const conciergePage = {
  seo: {
    title: "Med'ease Conciergerie | Coordination santé personnalisée",
    description:
        'Une seule demande, des centaines de démarches simplifiées. Votre compagnon de coordination avant, pendant et après votre prise en charge.',
  },
  hero: {
    title: 'Une seule demande. Des centaines de démarches simplifiées.',
    subtitle:
      'Votre compagnon de coordination avant, pendant et après votre prise en charge.',
    ctaLabel: 'Découvrir la Conciergerie médicale',
    ctaId: 'concierge' as const,
  },
  expertiseGroups: [
    {
      title: 'Admission',
      items: [
        'Préparation des dossiers',
        'Admission EHPAD',
        'Résidence autonomie',
        'USLD',
        'SSR',
        'HAD',
      ],
    },
    {
      title: 'Coordination',
      items: [
        'Gestion des admissions',
        'Organisation des sorties',
        'Coordination Ville-Hôpital',
        'Transport sanitaire',
        'Lien avec les professionnels',
      ],
    },
    {
      title: 'Accompagnement',
      items: [
        'Préparation intervention',
        'Organisation des soins',
        'Recherche de solutions',
        'Orientation',
        'Conseils personnalisés',
      ],
    },
    {
      title: 'Assistance administrative',
      items: [
        'Documents',
        'Assurances',
        'Organismes',
        'Sécurité sociale',
        'Mutuelles',
        'Constitution des dossiers',
      ],
    },
  ],
  journey: [
    {
      phase: 'Avant votre prise en charge',
      description: 'Nous préparons votre parcours.',
    },
    {
      phase: 'Pendant votre hospitalisation',
      description: 'Nous coordonnons chaque étape.',
    },
    {
      phase: 'Après votre hospitalisation',
      description: 'Le parcours continue.',
    },
  ],
  differentiators: [
    {
      title: 'Coordination intelligente',
      description: 'Chaque acteur est synchronisé.',
    },
    {
      title: 'Accompagnement personnalisé',
      description: 'Chaque patient bénéficie d\'un parcours adapté à ses besoins.',
    },
    {
      title: 'IA décisionnelle',
      description:
        'L\'intelligence artificielle identifie les prochaines actions, réduit les oublis et accompagne les professionnels dans leurs décisions opérationnelles.',
    },
  ],
  services: [
    'Aide aux aidants',
    'Orientation parcours complexe',
    'Logistique sanitaire',
    'Assistance administrative',
  ],
  closing:
    'Que votre besoin soit administratif, médical, social ou logistique, Med\'ease orchestre chaque étape afin que rien ne soit oublié.',
};

export const audienceNavLinks = [
  { path: '/patients', label: 'Patients' },
  { path: '/professionnels', label: 'Professionnels' },
  { path: '/etablissements', label: 'Établissements' },
  { path: '/notre-vision', label: 'Notre vision' },
  { path: '/conciergerie', label: 'Conciergerie' },
] as const;
