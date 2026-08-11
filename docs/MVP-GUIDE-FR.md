# Guide de navigation — Med'ease MVP

**Application :** https://med-ease-api.vercel.app  
**Connexion :** https://med-ease-api.vercel.app/login  
**Mot de passe (tous les comptes démo) :** `demo`

---

## 1. Comptes de démonstration

| Rôle | E-mail | Portail |
|------|--------|---------|
| Patient | `patient@medease.health` | Espace patient |
| Médecin | `doctor@medease.health` | Espace professionnel |
| Établissement | `facility@medease.health` | Espace établissement |
| Administrateur | `admin@medease.health` | Administration |

Après connexion, utilisez le menu latéral pour accéder aux modules ci-dessous.

---

## 2. Critères de succès — parcours de test

### A. Répertoire (Directory)

**Objectif :** établissements indexés + recherche géolocalisée (ville / type / itinéraire).

1. Connectez-vous en **patient** : `patient@medease.health` / `demo`
2. Ouvrez : **Répertoire** → ou URL directe  
   https://med-ease-api.vercel.app/patient/directory  
   https://med-ease-api.vercel.app/patient/directory/facilities
3. Utilisez la barre de recherche (nom, ville, spécialité).
4. Sur la carte, sélectionnez un établissement puis **Itinéraire** (Google Maps).

**Aussi accessible depuis :** professionnel (`/professional/directory`) et établissement (`/facility/directory`).

---

### B. Bibliothèque (Library)

**Objectif :** fiches médicaments + recherche par nom / DCI (générique).

1. Compte **patient** (ou médecin / pharmacie).
2. Ouvrez :  
   https://med-ease-api.vercel.app/patient/medical-library  
   Recherche : https://med-ease-api.vercel.app/patient/medical-library/search
3. Saisissez un nom de médicament ou un générique (DCI).
4. Ouvrez une fiche pour consulter le détail.

---

### C. Pilulier (Pill Organizer)

**Objectif :** ajout de médicament + marquage de prise quotidienne.

1. Compte **patient** : `patient@medease.health` / `demo`  
   https://med-ease-api.vercel.app/patient/medications/today  
2. Cliquez **Ajouter un médicament**, renseignez nom / DCI, enregistrez.
3. Sur chaque carte de dose, cliquez **Marquer comme pris**.
4. (Optionnel) Prescription clinicien :  
   https://med-ease-api.vercel.app/professional/prescriptions

---

### D. Mega carnet (Mega Notebook)

**Objectif :** 5 profils configurables / consultables.

1. Compte **patient** : `patient@medease.health` / `demo`
2. Ouvrez : https://med-ease-api.vercel.app/patient/records
3. Utilisez le panneau **Mega carnet — 5 profils** : médical, urgence, familial, mode de vie, constantes.
4. Ouvrez chaque profil via **Consulter**, puis renseignez / consultez les sections.
5. Vue clinicien : `/professional/patient/:patientId` (compte médecin).

---

### E. E-Parcours (E-Pathway)

**Objectif :** au moins 5 parcours types + timeline.

1. **Liste des parcours (médecin)** — `doctor@medease.health` / `demo`  
   https://med-ease-api.vercel.app/professional/pathways  
   Parcours types attendus : diabète, hypertension, insuffisance cardiaque, post-chirurgie, BPCO.
2. **Timeline patient** — `patient@medease.health` / `demo`  
   https://med-ease-api.vercel.app/patient/care-plan  
   https://med-ease-api.vercel.app/patient/care-plan/timeline

---

### F. Conciergerie (Concierge)

**Objectif :** demande créée + suivi patient + notification e-mail.

1. Sans connexion, ouvrez : https://med-ease-api.vercel.app/conciergerie
2. Cliquez sur le CTA / formulaire « rejoindre / demande ».
3. Remplissez et validez — la demande est enregistrée côté plateforme.
4. **Suivi admin** — `admin@medease.health` / `demo` :  
   https://med-ease-api.vercel.app/admin/conciergerie-suivi  
   (menu **Conciergerie**)
5. La notification e-mail part vers la boîte commerciale configurée (`MARKETING_LEADS_NOTIFY_EMAIL`).

---

### G. Transfert (Transfer)

**Objectif :** formulaire, lettre de liaison (PDF/HTML), établissement destinataire.

1. Compte **établissement** ou **médecin** :  
   `facility@medease.health` ou `doctor@medease.health` / `demo`
2. Ouvrez :  
   https://med-ease-api.vercel.app/facility/transfers  
   ou https://med-ease-api.vercel.app/professional/transfers  
   Vue patient : https://med-ease-api.vercel.app/patient/transfers
3. Cliquez **Demander un transfert**, choisissez le patient et l’**établissement destinataire**, validez.
4. La **lettre de liaison** se télécharge / s’ouvre automatiquement ; vous pouvez aussi la régénérer depuis la liste.

---

## 3. Astuces si « la recherche ne fonctionne pas »

1. Utilisez **Connexion** (bouton sur la landing) puis le compte **patient** pour Répertoire / Bibliothèque.
2. Attendez 30–60 s au premier chargement (API Render peut être en veille).
3. Hard refresh du navigateur (Ctrl+F5) après déploiement.
4. Vérifiez que vous êtes bien sur https://med-ease-api.vercel.app (pas une ancienne URL).
5. Après un déploiement API : redéployez Render puis `pnpm prisma:seed` pour lat/long du répertoire et les parcours.

---

## 4. Langue & landing

- Pages marketing (landing, audiences, conciergerie) : **français**.
- Portail patient MVP : navigation et modules clés en **français** (Pilulier, Mega carnet, Répertoire, Bibliothèque, E-Parcours, Transferts).
- Alignement landing ↔ Figma : coordination en cours avec le designer.

---

*Document de démonstration MVP — Med'ease*
