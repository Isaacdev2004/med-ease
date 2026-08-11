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

**Objectif :** établissements indexés + recherche (ville / type / distance).

1. Connectez-vous en **patient** : `patient@medease.health` / `demo`
2. Ouvrez : **Directory** → ou URL directe  
   https://med-ease-api.vercel.app/patient/directory  
   https://med-ease-api.vercel.app/patient/directory/facilities
3. Utilisez la barre de recherche (nom, ville, spécialité).
4. Filtrez par type d’établissement / distance si proposé.

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

1. **Ajout (médecin)** — `doctor@medease.health` / `demo`  
   https://med-ease-api.vercel.app/professional/prescriptions  
   ou prescription patient : `/professional/patient/:patientId/prescribe`
2. **Prises (patient)** — `patient@medease.health` / `demo`  
   https://med-ease-api.vercel.app/patient/medications  
   Marquez les doses du jour depuis les cartes / actions de prise.

---

### D. Mega carnet (Mega Notebook)

**Objectif :** profils santé consultables / renseignables.

1. Compte **patient** : `patient@medease.health` / `demo`
2. Ouvrez : https://med-ease-api.vercel.app/patient/records
3. Parcourez les sections : profil, résumé, constantes, timeline, profil d’urgence, etc.
4. Vue clinicien : `/professional/patient/:patientId` (compte médecin).

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

**Objectif :** demande créée + suivi + notification e-mail.

1. Sans connexion, ouvrez : https://med-ease-api.vercel.app/conciergerie
2. Cliquez sur le CTA / formulaire « rejoindre / demande ».
3. Remplissez et validez — la demande est enregistrée côté plateforme.
4. La notification e-mail part vers la boîte commerciale configurée (`MARKETING_LEADS_NOTIFY_EMAIL`, ex. `contact@medease.health`).

---

### G. Transfert (Transfer)

**Objectif :** formulaire, lettre de liaison, établissement destinataire.

1. Compte **établissement** ou **médecin** :  
   `facility@medease.health` ou `doctor@medease.health` / `demo`
2. Ouvrez :  
   https://med-ease-api.vercel.app/facility/transfers  
   ou https://med-ease-api.vercel.app/professional/transfers  
   Vue patient : https://med-ease-api.vercel.app/patient/transfers
3. Consultez la liste des transferts / statuts et l’établissement de destination.

---

## 3. Astuces si « la recherche ne fonctionne pas »

1. Utilisez **Connexion** (bouton sur la landing) puis le compte **patient** pour Directory / Library.
2. Attendez 30–60 s au premier chargement (API Render peut être en veille).
3. Hard refresh du navigateur (Ctrl+F5) après déploiement.
4. Vérifiez que vous êtes bien sur https://med-ease-api.vercel.app (pas une ancienne URL).

---

## 4. Langue & landing

- Pages marketing (landing, audiences, conciergerie) : **français**.
- Portails connectés : francisation en cours pour aligner l’UI MVP sur le français.
- Alignement landing ↔ Figma : coordination en cours avec le designer.

---

*Document de démonstration MVP — Med'ease*
