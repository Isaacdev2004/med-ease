export type HelpFaqCategoryId =
  | 'all'
  | 'urgences'
  | 'securite'
  | 'interop'
  | 'patients'
  | 'pros';

export const helpCenterPage = {
  seo: {
    title: "Med'ease | Centre d'aide",
    description:
      "Trouvez rapidement les réponses à vos questions sur Med'ease : urgences, sécurité, interopérabilité, patients et professionnels.",
  },
  hero: {
    eyebrow: "Centre d'aide",
    titleLead: 'Comment pouvons-nous',
    titleAccent: 'vous aider ?',
    subtitle: "Trouvez rapidement les réponses à vos questions sur Med'ease.",
    searchPlaceholder: 'Rechercher une réponse…',
  },
  channels: [
    {
      title: 'Documentation',
      description: 'Guides et tutoriels complets.',
    },
    {
      title: 'Chat en direct',
      description: 'Discutez en direct avec un conseiller.',
    },
    {
      title: 'Support téléphonique',
      description: 'Appelez-nous au +33 1 86 95 00 00.',
    },
    {
      title: 'Aide rapide',
      description: 'Découvrez les bases en 2 minutes.',
    },
  ],
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tout ce que vous devez savoir.',
    filters: [
      { id: 'all' as const, label: 'Tous' },
      { id: 'urgences' as const, label: 'Urgences & Flux Hospitaliers' },
      { id: 'securite' as const, label: 'Sécurité & Conformité' },
      { id: 'interop' as const, label: 'Interopérabilité & Intégration' },
      { id: 'patients' as const, label: 'Patients & Parcours de Soins' },
      { id: 'pros' as const, label: 'Professionnels & Établissements' },
    ],
    groups: [
      {
        id: 'urgences' as const,
        title: 'Urgences & Flux Hospitaliers',
        tone: 'orange' as const,
        items: [
          {
            question: "Comment Med'ease aide à désengorger les urgences ?",
            answer:
              'En facilitant l’accès aux lits d’aval, en priorisant les demandes d’admission et en améliorant l’orientation patient en temps réel.',
          },
          {
            question: 'Comment fonctionne la gestion des lits ?',
            answer:
              'Les établissements mettent à jour leurs capacités en continu. Les demandes sont centralisées, priorisées et suivies jusqu’à l’admission.',
          },
        ],
      },
      {
        id: 'securite' as const,
        title: 'Sécurité & Conformité',
        tone: 'blue' as const,
        items: [
          {
            question: "Med'ease est-elle conforme RGPD et HDS ?",
            answer:
              'Oui. Les données de santé sont hébergées en conformité HDS, chiffrées et protégées selon le RGPD.',
          },
          {
            question: 'Où sont hébergées les données ?',
            answer:
              'En France, sur des infrastructures certifiées, avec souveraineté numérique et traçabilité des accès.',
          },
          {
            question: 'Comment sont gérés les accès utilisateurs ?',
            answer:
              'Authentification forte, rôles (RBAC), isolation multi-tenant et journalisation des actions sensibles.',
          },
        ],
      },
      {
        id: 'interop' as const,
        title: 'Interopérabilité & Intégration',
        tone: 'teal' as const,
        items: [
          {
            question: 'La plateforme est-elle compatible avec les SIH ?',
            answer:
              "Med'ease s’intègre via standards HL7 FHIR et API sécurisées pour connecter vos outils existants sans rupture.",
          },
          {
            question: 'Quels standards sont supportés ?',
            answer:
              'HL7, FHIR, APIs sécurisées, compatibilité SIH et alignement Ségur du numérique.',
          },
        ],
      },
      {
        id: 'patients' as const,
        title: 'Patients & Parcours de Soins',
        tone: 'purple' as const,
        items: [
          {
            question: 'Comment accéder à mon carnet de santé ?',
            answer:
              'Depuis votre espace patient, après invitation par votre organisation ou activation via le lien reçu par e-mail.',
          },
          {
            question: 'Puis-je partager mes documents avec mon médecin ?',
            answer:
              'Oui, le partage est maîtrisé : vous choisissez quoi transmettre et à qui, avec traçabilité.',
          },
          {
            question: 'Comment fonctionnent les rappels de traitement ?',
            answer:
              'Le pilulier virtuel planifie vos prises et vous notifie pour renforcer l’observance au quotidien.',
          },
        ],
      },
      {
        id: 'pros' as const,
        title: 'Professionnels & Établissements',
        tone: 'green' as const,
        items: [
          {
            question: 'Comment rejoindre un établissement pilote ?',
            answer:
              'Utilisez le formulaire « Rejoindre les établissements pilotes » : nos équipes vous recontactent pour le paramétrage.',
          },
          {
            question: 'Combien de temps prend la mise en place ?',
            answer:
              'Les pilotes démarrent en quelques semaines : paramétrage, formation courte, puis montée en charge progressive.',
          },
        ],
      },
    ],
  },
};
