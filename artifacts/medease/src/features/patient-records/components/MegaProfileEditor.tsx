import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { appToast } from '@/services/api/toast';

/** Aligné Formulaire Studio — 5 profils Mega Carnet. */
export type MegaProfileId =
  | 'general'
  | 'administratif'
  | 'urgence'
  | 'physique'
  | 'vaccination';

export type MegaProfileData = Record<string, string> & { updatedAt?: string };

const FIELD_SETS: Record<
  MegaProfileId,
  { title: string; fields: { key: string; label: string; required?: boolean; type?: string; placeholder?: string }[] }
> = {
  general: {
    title: 'Profil général',
    fields: [
      { key: 'photoDataUrl', label: 'Photo', type: 'photo' },
      { key: 'lastName', label: 'Nom', required: true },
      { key: 'firstName', label: 'Prénom', required: true },
      { key: 'usageName', label: "Nom d'usage" },
      { key: 'birthDate', label: 'Date de naissance', required: true, type: 'date' },
      { key: 'sex', label: 'Sexe', required: true, placeholder: 'F / M / Autre' },
      { key: 'address', label: 'Adresse' },
      { key: 'postalCode', label: 'Code postal' },
      { key: 'city', label: 'Ville' },
      { key: 'phone', label: 'Téléphone', required: true },
      { key: 'email', label: 'E-mail', required: true },
      { key: 'language', label: 'Langue préférée', placeholder: 'Français' },
      { key: 'trustedPerson', label: 'Personne de confiance' },
      { key: 'primaryCaregiver', label: 'Aidant principal' },
    ],
  },
  administratif: {
    title: 'Profil administratif',
    fields: [
      { key: 'address', label: 'Adresse' },
      { key: 'postalCode', label: 'Code postal' },
      { key: 'city', label: 'Ville' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'email', label: 'E-mail' },
      { key: 'emergencyContact', label: "Contact d'urgence" },
      { key: 'insuranceOrg', label: 'Organisme assurance' },
      { key: 'memberNumber', label: "Numéro d'adhérent" },
      { key: 'mutuelle', label: 'Mutuelle' },
      { key: 'teletransmission', label: 'Télétransmission', placeholder: 'Oui / Non' },
      { key: 'gpName', label: 'Médecin traitant' },
      { key: 'gpPhone', label: 'Tél. médecin traitant' },
      { key: 'specialist', label: 'Spécialiste / autre pro' },
    ],
  },
  urgence: {
    title: "Profil d'urgence",
    fields: [
      { key: 'bloodType', label: 'Groupe sanguin', placeholder: 'A+ / O- / Inconnu' },
      { key: 'severeAllergies', label: 'Allergies graves' },
      { key: 'conditions', label: 'Pathologies importantes', placeholder: 'Diabète, asthme…' },
      { key: 'criticalMeds', label: 'Traitements critiques' },
      { key: 'notifyName', label: 'Personne à prévenir — nom' },
      { key: 'notifyPhone', label: 'Personne à prévenir — téléphone' },
      { key: 'gpName', label: 'Médecin traitant — nom' },
      { key: 'gpPhone', label: 'Médecin traitant — téléphone' },
      { key: 'instructions', label: 'Consignes particulières', type: 'textarea' },
    ],
  },
  physique: {
    title: 'Profil physique',
    fields: [
      { key: 'heightCm', label: 'Taille (cm)' },
      { key: 'weightKg', label: 'Poids (kg)' },
      { key: 'bloodType', label: 'Groupe sanguin' },
      { key: 'laterality', label: 'Latéralité', placeholder: 'Droitier / Gaucher / Ambidextre' },
      { key: 'mobility', label: 'Mobilité', placeholder: 'Autonome / Aide / Fauteuil…' },
      { key: 'aids', label: 'Aides techniques', placeholder: 'Lunettes, canne…' },
      { key: 'allergies', label: 'Allergies' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  vaccination: {
    title: 'Vaccination',
    fields: [
      { key: 'vaccine', label: 'Vaccin', required: true, placeholder: 'COVID-19, Tétanos…' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'lot', label: 'Numéro de lot' },
      { key: 'center', label: 'Centre / professionnel' },
      { key: 'nextDose', label: 'Prochaine dose', type: 'date' },
      { key: 'status', label: 'Statut', placeholder: 'À jour / À renouveler' },
      { key: 'document', label: 'Document justificatif', placeholder: 'Réf. ou lien' },
    ],
  },
};

function storageKey(patientId: string, profileId: MegaProfileId) {
  return `medease.mega.v2.${patientId}.${profileId}`;
}

export function loadMegaProfile(
  patientId: string,
  profileId: MegaProfileId,
): MegaProfileData | null {
  try {
    const raw = localStorage.getItem(storageKey(patientId, profileId));
    return raw ? (JSON.parse(raw) as MegaProfileData) : null;
  } catch {
    return null;
  }
}

export function saveMegaProfile(
  patientId: string,
  profileId: MegaProfileId,
  data: Record<string, string>,
) {
  const payload: MegaProfileData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(patientId, profileId), JSON.stringify(payload));
  return payload;
}

export function megaProfileCompletion(patientId: string): number {
  const ids = Object.keys(FIELD_SETS) as MegaProfileId[];
  const filled = ids.filter((id) => {
    const data = loadMegaProfile(patientId, id);
    if (!data) return false;
    const required = FIELD_SETS[id].fields.filter((f) => f.required);
    if (required.length === 0) return Object.keys(data).some((k) => k !== 'updatedAt' && data[k]);
    return required.every((f) => Boolean(data[f.key]?.trim()));
  }).length;
  return Math.round((filled / ids.length) * 100);
}

interface MegaProfileEditorProps {
  patientId: string;
  profileId: MegaProfileId;
  triggerLabel?: string;
  onSaved?: () => void;
}

export function MegaProfileEditor({
  patientId,
  profileId,
  triggerLabel = 'Créer / Modifier',
  onSaved,
}: MegaProfileEditorProps) {
  const meta = FIELD_SETS[profileId];
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const existing = loadMegaProfile(patientId, profileId) ?? {};
    const next: Record<string, string> = {};
    for (const f of meta.fields) next[f.key] = existing[f.key] ?? '';
    setValues(next);
  }, [open, patientId, profileId, meta.fields]);

  const submit = () => {
    const missing = meta.fields.filter((f) => f.required && !values[f.key]?.trim());
    if (missing.length) {
      appToast.error({
        title: 'Champs obligatoires',
        description: missing.map((m) => m.label).join(', '),
      });
      return;
    }
    saveMegaProfile(patientId, profileId, values);
    appToast.success({
      title: 'Profil enregistré',
      description: `${meta.title} mis à jour.`,
    });
    setOpen(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {triggerLabel.includes('Créer') ? 'Créer' : 'Modifier'} — {meta.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {meta.fields.map((field) => (
            <div key={field.key} className="grid gap-1.5">
              <Label>
                {field.label}
                {field.required ? ' *' : ''}
              </Label>
              {field.type === 'photo' ? (
                <div className="space-y-2">
                  {values[field.key] ? (
                    <img
                      src={values[field.key]}
                      alt="Photo de profil"
                      className="h-20 w-20 rounded-full object-cover border"
                    />
                  ) : null}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setValues((v) => ({
                          ...v,
                          [field.key]: String(reader.result ?? ''),
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG ou PNG — stockée localement pour le MVP.
                  </p>
                </div>
              ) : field.type === 'textarea' ? (
                <Textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.key]: e.target.value }))
                  }
                  rows={3}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={submit}>Enregistrer mon profil</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MegaProfileView({
  patientId,
  profileId,
}: {
  patientId: string;
  profileId: MegaProfileId;
}) {
  const meta = FIELD_SETS[profileId];
  const data = loadMegaProfile(patientId, profileId);
  const entries = useMemo(() => {
    if (!data) return [];
    return meta.fields
      .filter((f) => f.type !== 'photo')
      .map((f) => ({ label: f.label, value: data[f.key] }))
      .filter((e) => e.value);
  }, [data, meta.fields]);

  if (!entries.length && !data?.photoDataUrl) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune information renseignée. Cliquez sur Créer / Modifier.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data?.photoDataUrl ? (
        <img
          src={data.photoDataUrl}
          alt="Photo"
          className="h-16 w-16 rounded-full object-cover border"
        />
      ) : null}
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        {entries.map((e) => (
          <div key={e.label}>
            <p className="text-muted-foreground">{e.label}</p>
            <p className="font-medium whitespace-pre-wrap">{e.value}</p>
          </div>
        ))}
        {data?.updatedAt ? (
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Mis à jour le {new Date(data.updatedAt).toLocaleString('fr-FR')}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { FIELD_SETS as MEGA_PROFILE_FIELDS };
