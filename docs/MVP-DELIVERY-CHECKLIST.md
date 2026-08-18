# Med'ease MVP — Delivery Checklist

**App:** https://med-ease-api.vercel.app  
**Login:** https://med-ease-api.vercel.app/login  
**Demo password (all accounts):** `demo`  
**Designer:** SABA Gill  
**Guide FR:** [MVP-GUIDE-FR.md](./MVP-GUIDE-FR.md)

---

## 1. Success criteria — status

| Critère | Statut | URL / test |
|---------|--------|------------|
| **Répertoire** — établissements + geo | ✅ | `/patient/directory` — recherche ville, onglets, itinéraire carte |
| **Bibliothèque** — fiches + DCI | ✅ | `/patient/medical-library` — recherche *paracetamol* |
| **Pilulier** — ajout + marquage | ✅ | `/patient/medications/today` |
| **Mega carnet** — 5 profils | ✅ | `/patient/records` — panneau 5 profils |
| **E-Parcours** — ≥5 parcours | ✅ | `/professional/pathways` + `/patient/care-plan/timeline` |
| **Conciergerie** — demande + suivi | ✅ | `/conciergerie` → `/admin/conciergerie-suivi` |
| **Transfert** — formulaire + lettre | ✅ | `/facility/transfers` |
| **UI française (MVP)** | 🟡 | Nav patient FR ; pages clés FR ; pro/admin partiellement EN |
| **Figma / landing** | 🟡 | Assets dans `public/marketing/` ; pixel-perfect avec SABA Gill |
| **Vidéos démo** | ⬜ | Scripts ci-dessous — enregistrement Loom à faire |

---

## 2. Deploy checklist (before client demo)

### Frontend (Vercel)
- [ ] Auto-deploy from `main` completed
- [ ] Hard refresh (Ctrl+F5) after deploy
- [ ] Landing images load (`/marketing/hero.png`, etc.)

### API (Render)
- [ ] Auto-deploy from `main` completed
- [ ] Run seed: `pnpm prisma:seed` (directory geo, pathways FR, medications)
- [ ] Env vars set:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `MARKETING_LEADS_NOTIFY_EMAIL=contact@medease.health` (or client inbox)
  - SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (for concierge emails)

### Smoke test (15 min)
1. Login patient → Bibliothèque search → open fiche → back
2. Répertoire search → provider profile → itinéraire
3. Pilulier today → add med → mark taken
4. Mega carnet → 5 profils
5. E-Parcours timeline
6. Conciergerie form → admin follow-up list
7. Facility transfer → liaison letter download

---

## 3. Demo accounts

| Rôle | Email | Portail |
|------|-------|---------|
| Patient | `patient@medease.health` | `/patient` |
| Médecin | `doctor@medease.health` | `/professional` |
| Établissement | `facility@medease.health` | `/facility` |
| Admin | `admin@medease.health` | `/admin` |

---

## 4. Video scripts (Loom — ~3–5 min each)

Record in **French** with browser at 1280×720. Show login → sidebar → 2–3 key flows per profile.

### A. Patient (`patient@medease.health`)
1. **Intro** (20 s): « Espace patient Med'ease — Sarah Jenkins, compte démo. »
2. **Tableau de bord** (30 s): résumé santé, prochain RDV.
3. **Bibliothèque** (45 s): recherche *Doliprane* ou *paracetamol*, ouvrir fiche DCI.
4. **Pilulier** (45 s): `/medications/today` — ajouter médicament, marquer prise.
5. **Mega carnet** (30 s): 5 profils → consulter profil médical.
6. **E-Parcours** (30 s): timeline du parcours diabète.
7. **Répertoire** (30 s): recherche Paris, carte, itinéraire.
8. **Outro** (15 s): « Merci — Med'ease pour les patients. »

### B. Médecin (`doctor@medease.health`)
1. Connexion espace professionnel.
2. **Parcours cliniques** `/professional/pathways` — 5 parcours (diabète, HTA, IC, post-chir, BPCO).
3. **Prescriptions** — créer / consulter ordonnance patient.
4. **Transferts** `/professional/transfers` — liste + demande.
5. **Répertoire / Bibliothèque** — recherche rapide.

### C. Établissement (`facility@medease.health`)
1. Connexion espace établissement.
2. **Transferts** `/facility/transfers` — formulaire, établissement destinataire, lettre de liaison PDF.
3. **Répertoire** — établissements indexés.
4. **Admissions** (si visible) — vue liste.

### D. Administrateur (`admin@medease.health`)
1. Connexion administration.
2. **Conciergerie suivi** `/admin/conciergerie-suivi` — demandes depuis landing.
3. **Répertoire admin** — vue globale.
4. **Tableau de bord** — KPIs plateforme (aperçu).

---

## 5. Known limitations (transparent with client)

- Carte répertoire : vue simplifiée + lien Google Maps (pas carte embarquée Mapbox).
- Mega carnet : profils consultables ; édition complète post-MVP.
- Portails pro/admin : libellés partiellement anglais hors modules MVP.
- Figma : alignement visuel landing en coordination avec **SABA Gill**.
- API Render : premier appel peut prendre 30–60 s (cold start).

---

## 6. Client message template (FR)

> Bonjour,  
> La mise à jour MVP est déployée. Vous pouvez retester avec le guide [MVP-GUIDE-FR.md](./MVP-GUIDE-FR.md).  
> Nous préparons les vidéos par profil et finalisons l’alignement Figma avec SABA Gill.  
> Merci pour votre patience — nous sommes très proches de la livraison complète des critères de succès.

---

*Last updated: 2026-08-18*
