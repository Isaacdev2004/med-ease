import { useEffect, useState } from 'react';

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

export type MegaProfileId =
  | 'medical'
  | 'emergency'
  | 'family'
  | 'lifestyle'
  | 'vitals';

export type MegaProfileDraft = {
  field1: string;
  field2: string;
  field3: string;
  notes: string;
  updatedAt: string;
};

const PROFILE_FIELDS: Record<
  MegaProfileId,
  { title: string; labels: [string, string, string]; notesLabel: string }
> = {
  medical: {
    title: 'Profil médical',
    labels: ['Allergies', 'Traitements en cours', 'Antécédents'],
    notesLabel: 'Notes cliniques',
  },
  emergency: {
    title: "Profil d'urgence",
    labels: ['Contact 1', 'Téléphone urgence', 'Directives'],
    notesLabel: 'Informations critiques',
  },
  family: {
    title: 'Profil familial',
    labels: ['Antécédents parents', 'Fratrie', 'Maladies héréditaires'],
    notesLabel: 'Notes familiales',
  },
  lifestyle: {
    title: 'Profil mode de vie',
    labels: ['Activité physique', 'Alimentation', 'Tabac / alcool'],
    notesLabel: 'Habitudes',
  },
  vitals: {
    title: 'Profil constantes',
    labels: ['Poids (kg)', 'Taille (cm)', 'Tension habituelle'],
    notesLabel: 'Suivi / objectifs',
  },
};

function storageKey(patientId: string, profileId: MegaProfileId) {
  return `medease.mega.${patientId}.${profileId}`;
}

export function loadMegaProfile(
  patientId: string,
  profileId: MegaProfileId,
): MegaProfileDraft | null {
  try {
    const raw = localStorage.getItem(storageKey(patientId, profileId));
    return raw ? (JSON.parse(raw) as MegaProfileDraft) : null;
  } catch {
    return null;
  }
}

export function saveMegaProfile(
  patientId: string,
  profileId: MegaProfileId,
  draft: Omit<MegaProfileDraft, 'updatedAt'>,
) {
  const payload: MegaProfileDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(patientId, profileId), JSON.stringify(payload));
  return payload;
}

interface MegaProfileEditorProps {
  patientId: string;
  profileId: MegaProfileId;
  triggerLabel?: string;
}

/** Editable Mega Carnet profile — persisted locally for demo (renseignable / consultable). */
export function MegaProfileEditor({
  patientId,
  profileId,
  triggerLabel = 'Modifier',
}: MegaProfileEditorProps) {
  const meta = PROFILE_FIELDS[profileId];
  const [open, setOpen] = useState(false);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    const existing = loadMegaProfile(patientId, profileId);
    setField1(existing?.field1 ?? '');
    setField2(existing?.field2 ?? '');
    setField3(existing?.field3 ?? '');
    setNotes(existing?.notes ?? '');
  }, [open, patientId, profileId]);

  const submit = () => {
    saveMegaProfile(patientId, profileId, { field1, field2, field3, notes });
    appToast.success({
      title: 'Profil enregistré',
      description: `${meta.title} mis à jour.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier — {meta.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>{meta.labels[0]}</Label>
            <Input value={field1} onChange={(e) => setField1(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>{meta.labels[1]}</Label>
            <Input value={field2} onChange={(e) => setField2(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>{meta.labels[2]}</Label>
            <Input value={field3} onChange={(e) => setField3(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>{meta.notesLabel}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>Enregistrer</Button>
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
  const meta = PROFILE_FIELDS[profileId];
  const data = loadMegaProfile(patientId, profileId);
  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune information renseignée. Cliquez sur Modifier pour créer ce profil.
      </p>
    );
  }
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2">
      {meta.labels.map((label, i) => (
        <div key={label}>
          <p className="text-muted-foreground">{label}</p>
          <p className="font-medium">
            {[data.field1, data.field2, data.field3][i] || '—'}
          </p>
        </div>
      ))}
      <div className="sm:col-span-2">
        <p className="text-muted-foreground">{meta.notesLabel}</p>
        <p className="font-medium whitespace-pre-wrap">{data.notes || '—'}</p>
      </div>
      <p className="sm:col-span-2 text-xs text-muted-foreground">
        Mis à jour le {new Date(data.updatedAt).toLocaleString('fr-FR')}
      </p>
    </div>
  );
}
