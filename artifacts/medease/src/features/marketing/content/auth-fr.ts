export const frenchAuthCopy = {
  connexion: {
    layout: {
      title: 'Connexion',
      subtitle: 'Accédez à votre espace Med\'ease en toute sécurité.',
      heroTitle: 'Le hub de santé qui reconnecte la ville et l\'hôpital.',
      heroSubtitle:
        'Patients, professionnels et établissements : un parcours de soins coordonné, sécurisé et fluide.',
      complianceBadge: 'Hébergement HDS · Conformité RGPD',
      supportLabel: 'Besoin d\'aide ?',
      supportLink: 'Contacter le support',
    },
    form: {
      submitLabel: 'Se connecter en toute sécurité',
      emailLabel: 'Adresse e-mail ou identifiant',
      emailPlaceholder: 'nom@exemple.com',
      passwordLabel: 'Mot de passe',
      forgotPasswordLabel: 'Mot de passe oublié ?',
      rememberMeLabel: 'Se souvenir de cet appareil pendant 30 jours',
      complianceHint: 'Portail sécurisé conforme aux exigences santé',
      devHint:
        'Développement : connectez-vous avec un compte démo (ex. admin@medease.health / demo).',
      prodHint: 'Connectez-vous avec vos identifiants organisationnels.',
      mockHint: 'Utilisez les identifiants de démonstration fournis.',
      noAccountLabel: 'Nouveau sur Med\'ease ?',
      createAccountLabel: 'Créer un compte',
    },
  },
  preInscription: {
    layout: {
      title: 'Pré-inscription',
      subtitle: 'Rejoignez Med\'ease et coordonnez votre parcours de santé.',
      heroTitle: 'Reprendre le contrôle de votre parcours de soins.',
      heroSubtitle:
        'Inscrivez-vous pour accéder au hub de coordination territoriale Med\'ease.',
      complianceBadge: 'Données chiffrées · Conformité RGPD',
      supportLabel: 'Une question ?',
      supportLink: 'Nous contacter',
    },
    form: {
      title: 'Créer votre compte',
      description:
        'Inscrivez-vous pour un accès sécurisé aux services Med\'ease.',
      submitLabel: 'Finaliser la pré-inscription',
      helpText:
        'Vos informations sont chiffrées et traitées conformément aux normes de protection des données de santé.',
      personalSectionTitle: 'Informations personnelles',
      securitySectionTitle: 'Sécurité',
      firstNameLabel: 'Prénom',
      firstNamePlaceholder: 'Marie',
      lastNameLabel: 'Nom',
      lastNamePlaceholder: 'Dupont',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'nom@exemple.com',
      roleLabel: 'Je m\'inscris en tant que…',
      passwordLabel: 'Mot de passe',
      passwordDescription:
        '12 caractères minimum, incluant un caractère spécial.',
      confirmPasswordLabel: 'Confirmer le mot de passe',
      complianceHint: 'Vos données sont chiffrées de bout en bout',
      hasAccountLabel: 'Vous avez déjà un compte ?',
      signInLabel: 'Se connecter',
      successMessage: 'Pré-inscription enregistrée. Vous pouvez vous connecter.',
      errorMessage: 'Impossible de finaliser la pré-inscription.',
      roleOptions: [
        { label: 'Patient', value: 'patient' },
        { label: 'Professionnel de santé', value: 'professional' },
        { label: 'Établissement de santé', value: 'facility' },
      ],
    },
  },
} as const;
