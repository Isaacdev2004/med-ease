export type CtaFormId =
  | 'hub'
  | 'discover'
  | 'patient'
  | 'professional'
  | 'establishment'
  | 'vision'
  | 'concierge';

export type CtaFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'radio'
  | 'checkbox';

export interface CtaFieldOption {
  label: string;
  value: string;
}

export interface CtaField {
  name: string;
  label: string;
  type: CtaFieldType;
  required?: boolean;
  placeholder?: string;
  options?: CtaFieldOption[];
}

export interface CtaFormConfig {
  id: CtaFormId;
  title: string;
  subtitle?: string;
  submitLabel: string;
  fields: CtaField[];
}

export const ctaForms: Record<CtaFormId, CtaFormConfig> = {
  hub: {
    id: 'hub',
    title: 'Explorer le Hub',
    subtitle:
      'Découvrez comment Med\'ease peut transformer votre parcours de santé. Quelques informations suffisent pour vous orienter vers la bonne expérience.',
    submitLabel: 'Explorer le Hub',
    fields: [
      {
        name: 'profile',
        label: 'Vous êtes',
        type: 'radio',
        required: true,
        options: [
          { label: 'Patient', value: 'patient' },
          { label: 'Aidant', value: 'aidant' },
          { label: 'Professionnel de santé', value: 'professional' },
          { label: 'Établissement', value: 'establishment' },
          { label: 'Institution', value: 'institution' },
          { label: 'Autre', value: 'other' },
        ],
      },
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true },
      { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone (optionnel)', type: 'tel' },
      {
        name: 'need',
        label: 'Votre besoin concerne',
        type: 'radio',
        required: true,
        options: [
          { label: "Découvrir Med'ease", value: 'discover' },
          { label: 'Être accompagné', value: 'support' },
          { label: 'Optimiser mon organisation', value: 'optimize' },
          { label: 'Demander une démonstration', value: 'demo' },
          { label: 'Autre', value: 'other' },
        ],
      },
      {
        name: 'message',
        label: 'Message libre',
        type: 'textarea',
        placeholder: 'Décrivez votre besoin…',
      },
    ],
  },
  discover: {
    id: 'discover',
    title: 'Découvrir la santé autrement',
    submitLabel: "Découvrir Med'ease",
    fields: [
      {
        name: 'profile',
        label: 'Vous êtes',
        type: 'radio',
        required: true,
        options: [
          { label: 'Patient', value: 'patient' },
          { label: 'Aidant', value: 'aidant' },
          { label: 'Professionnel de santé', value: 'professional' },
          { label: 'Établissement', value: 'establishment' },
          { label: 'Institution', value: 'institution' },
          { label: 'Autre', value: 'other' },
        ],
      },
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true },
      { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone (optionnel)', type: 'tel' },
      {
        name: 'improve',
        label: 'Qu\'aimeriez-vous améliorer ?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Mon parcours de soins', value: 'care-path' },
          { label: 'Mon organisation', value: 'organization' },
          { label: 'La coordination de mon établissement', value: 'facility' },
          { label: 'Les parcours patients', value: 'patient-paths' },
          { label: 'Autre', value: 'other' },
        ],
      },
    ],
  },
  patient: {
    id: 'patient',
    title: 'Découvrir votre parcours personnalisé',
    subtitle:
      'Commençons par faire connaissance. Chaque parcours est unique — nous allons vous orienter vers la solution la plus adaptée.',
    submitLabel: 'Commencer mon parcours personnalisé',
    fields: [
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true },
      { name: 'email', label: 'Adresse mail', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
      {
        name: 'profile',
        label: 'Vous êtes',
        type: 'radio',
        required: true,
        options: [
          { label: 'Patient', value: 'patient' },
          { label: 'Aidant', value: 'aidant' },
          { label: 'Famille', value: 'family' },
        ],
      },
      {
        name: 'needs',
        label: "Quel est votre besoin aujourd'hui ?",
        type: 'checkbox',
        options: [
          { label: 'Préparer une hospitalisation', value: 'hospitalization' },
          { label: 'Retour à domicile', value: 'home' },
          { label: 'Rechercher un établissement', value: 'facility-search' },
          { label: 'Demande de transport', value: 'transport' },
          { label: "Recherche d'un professionnel", value: 'provider-search' },
          { label: 'Informations administratives', value: 'admin' },
          { label: 'HAD', value: 'had' },
          { label: 'EHPAD', value: 'ehpad' },
          { label: 'Résidence senior', value: 'senior' },
          { label: 'Autre', value: 'other' },
        ],
      },
      {
        name: 'contactPreference',
        label: 'Comment souhaitez-vous être recontacté ?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Téléphone', value: 'phone' },
          { label: 'Email', value: 'email' },
        ],
      },
    ],
  },
  professional: {
    id: 'professional',
    title: 'Découvrir votre futur Hub de coordination',
    subtitle:
      'Voyons ensemble comment Med\'ease peut simplifier votre quotidien.',
    submitLabel: 'Découvrir mon Hub',
    fields: [
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'profession', label: 'Profession', type: 'text', required: true },
      { name: 'establishment', label: 'Établissement', type: 'text', required: true },
      { name: 'role', label: 'Fonction', type: 'text', required: true },
      { name: 'email', label: 'Mail professionnel', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
      {
        name: 'practice',
        label: 'Vous exercez en',
        type: 'radio',
        required: true,
        options: [
          { label: 'Libéral', value: 'liberal' },
          { label: 'Hôpital', value: 'hospital' },
          { label: 'Clinique', value: 'clinic' },
          { label: 'Exercice mixte', value: 'mixed' },
          { label: 'HAD', value: 'had' },
          { label: 'EHPAD', value: 'ehpad' },
          { label: 'CPTS', value: 'cpts' },
          { label: 'MSP', value: 'msp' },
          { label: 'SSIAD', value: 'ssiad' },
          { label: 'DAC', value: 'dac' },
        ],
      },
      {
        name: 'priorities',
        label: 'Vos priorités',
        type: 'checkbox',
        options: [
          { label: 'Coordination', value: 'coordination' },
          { label: 'Lits', value: 'beds' },
          { label: 'Parcours patients', value: 'patient-paths' },
          { label: 'Téléexpertise', value: 'teleexpertise' },
          { label: 'RH', value: 'hr' },
          { label: 'Transport', value: 'transport' },
          { label: 'Ville-Hôpital', value: 'city-hospital' },
          { label: 'Réconciliation médicamenteuse', value: 'medication' },
          { label: 'IA', value: 'ai' },
        ],
      },
    ],
  },
  establishment: {
    id: 'establishment',
    title: 'Réinventons votre organisation',
    subtitle:
      'Quelques informations nous permettront de préparer un échange adapté à votre établissement.',
    submitLabel: 'Réinventer notre coordination',
    fields: [
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true },
      { name: 'role', label: 'Fonction', type: 'text', required: true },
      {
        name: 'establishmentName',
        label: 'Nom de l\'établissement',
        type: 'text',
        required: true,
      },
      {
        name: 'establishmentType',
        label: 'Type',
        type: 'radio',
        required: true,
        options: [
          { label: 'CHU', value: 'chu' },
          { label: 'CH', value: 'ch' },
          { label: 'Clinique', value: 'clinic' },
          { label: 'ESPIC', value: 'espic' },
          { label: 'GHT', value: 'ght' },
          { label: 'HAD', value: 'had' },
          { label: 'EHPAD', value: 'ehpad' },
          { label: 'Autre', value: 'other' },
        ],
      },
      {
        name: 'bedCount',
        label: 'Nombre de lits',
        type: 'radio',
        required: true,
        options: [
          { label: '<100', value: 'lt100' },
          { label: '100-300', value: '100-300' },
          { label: '300-600', value: '300-600' },
          { label: '600+', value: '600+' },
        ],
      },
      {
        name: 'challenges',
        label: 'Vos enjeux',
        type: 'checkbox',
        options: [
          { label: 'Gestion des lits & lits d\'aval', value: 'beds' },
          { label: 'Fluidification des parcours patients', value: 'paths' },
          { label: 'Optimisation des transports sanitaires', value: 'transport' },
          { label: 'Désengorgement des urgences', value: 'er' },
          { label: 'Réconciliation ville-hôpital', value: 'city-hospital' },
          { label: 'Autres', value: 'other' },
        ],
      },
    ],
  },
  vision: {
    id: 'vision',
    title: 'Construisons la santé de demain',
    subtitle:
      'Nous sommes convaincus que les meilleures transformations naissent des collaborations.',
    submitLabel: 'Construire ensemble',
    fields: [
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'organization', label: 'Organisation', type: 'text', required: true },
      { name: 'role', label: 'Fonction', type: 'text', required: true },
      { name: 'email', label: 'Mail', type: 'email', required: true },
      {
        name: 'profile',
        label: 'Vous êtes',
        type: 'radio',
        required: true,
        options: [
          { label: 'Institution', value: 'institution' },
          { label: 'ARS', value: 'ars' },
          { label: 'GHT', value: 'ght' },
          { label: 'Collectivité', value: 'collectivity' },
          { label: 'Association', value: 'association' },
          { label: 'Industriel', value: 'industry' },
          { label: 'Investisseur', value: 'investor' },
          { label: 'Partenaire', value: 'partner' },
        ],
      },
      {
        name: 'intent',
        label: 'Je souhaite',
        type: 'checkbox',
        options: [
          { label: 'Devenir partenaire', value: 'partner' },
          { label: "Découvrir Med'ease", value: 'discover' },
          { label: 'Participer à un programme pilote', value: 'pilot' },
          { label: 'Co-construire', value: 'co-build' },
          { label: 'Investir', value: 'invest' },
        ],
      },
    ],
  },
  concierge: {
    id: 'concierge',
    title: 'Un coordinateur à vos côtés',
    subtitle: 'Avant, pendant et après votre prise en charge.',
    submitLabel: 'Être accompagné',
    fields: [
      { name: 'lastName', label: 'Nom', type: 'text', required: true },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true },
      { name: 'email', label: 'Mail', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
      {
        name: 'profile',
        label: 'Vous êtes',
        type: 'radio',
        required: true,
        options: [
          { label: 'Patient', value: 'patient' },
          { label: 'Aidant', value: 'aidant' },
          { label: 'Famille', value: 'family' },
          { label: 'Professionnel', value: 'professional' },
          { label: 'Établissement', value: 'establishment' },
        ],
      },
      {
        name: 'support',
        label: 'Quel accompagnement recherchez-vous ?',
        type: 'checkbox',
        options: [
          { label: 'Admission', value: 'admission' },
          { label: 'HAD', value: 'had' },
          { label: 'EHPAD', value: 'ehpad' },
          { label: 'Retour domicile', value: 'home' },
          { label: 'Transport', value: 'transport' },
          { label: 'Coordination médicale', value: 'medical' },
          { label: 'Préparation intervention', value: 'surgery' },
          { label: 'Démarches administratives', value: 'admin' },
          { label: 'Recherche de professionnels', value: 'providers' },
        ],
      },
      {
        name: 'urgency',
        label: 'Urgence',
        type: 'radio',
        required: true,
        options: [
          { label: 'Rapide', value: 'fast' },
          { label: 'Cette semaine', value: 'week' },
          { label: 'Ce mois', value: 'month' },
        ],
      },
    ],
  },
};
