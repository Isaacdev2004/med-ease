import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { admissionsQueryKeys } from '@/features/admissions/hooks/use-admissions';
import { loadMegaProfile } from '@/features/patient-records/components/MegaProfileEditor';
import { usePatientId } from '@/features/patient-records/hooks/use-patient-records';
import { admissionsService } from '@/services/admissions';
import {
  DEMO_FACILITY_PARIS,
  type CreateTransferInput,
  type PatientTransfer,
} from '@/services/admissions/types';
import { useAuth } from '@/services/auth/auth-context';
import { DEMO_FACILITY_ID } from '@/shared/constants/demo-ids';
import { appToast } from '@/services/api/toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';

const DESTINATIONS = [
  {
    id: '01930000-0000-7000-8000-000000000202',
    name: 'Hôpital Édouard Herriot (Lyon)',
  },
  {
    id: '01930000-0000-7000-8000-000000000203',
    name: 'CHU de Tours',
  },
  {
    id: DEMO_FACILITY_ID,
    name: 'Pitié-Salpêtrière (Paris)',
  },
] as const;

const REQUEST_TYPES = [
  { value: 'hospitalisation', label: 'Hospitalisation' },
  { value: 'transfert', label: 'Transfert' },
  { value: 'ssr', label: 'SSR' },
  { value: 'ehpad', label: 'EHPAD' },
  { value: 'retour_domicile', label: 'Retour domicile' },
] as const;

const URGENCY_LEVELS = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
] as const;

const STEPS = ['Patient', 'Demande', 'Médical', 'Confirmation'];

export function downloadLiaisonLetterPdf(transfer: PatientTransfer) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Lettre de liaison — ${transfer.patientName}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; color: #111; line-height: 1.5; }
    h1 { font-size: 22px; }
    .meta { color: #444; font-size: 14px; margin-bottom: 24px; }
    .box { border: 1px solid #ccc; padding: 16px; margin: 16px 0; }
    .label { font-size: 12px; text-transform: uppercase; color: #666; }
  </style>
</head>
<body>
  <h1>Lettre de liaison — Med'ease</h1>
  <p class="meta">Générée le ${new Date().toLocaleString('fr-FR')} · Réf. ${transfer.id}</p>
  <div class="box">
    <p><span class="label">Patient</span><br/>${transfer.patientName} (ID ${transfer.patientId})</p>
    <p><span class="label">Établissement d'origine</span><br/>${transfer.fromFacilityName} — ${transfer.fromWard}</p>
    <p><span class="label">Établissement destinataire</span><br/>${transfer.toFacilityName} — ${transfer.toWard}</p>
    <p><span class="label">Motif</span><br/>${transfer.reason ?? 'Non renseigné'}</p>
    <p><span class="label">Notes</span><br/>${transfer.notes ?? '—'}</p>
  </div>
  <p>Document de liaison Med'ease MVP — à transmettre à l'établissement destinataire.</p>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lettre-liaison-${transfer.patientId.slice(-6)}.html`;
  a.click();
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function TransferRequestDialog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const resolveQuery = usePatientId();
  const clinicalPatientId = resolveQuery.data ?? undefined;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [patientRef, setPatientRef] = useState('');

  const [requestType, setRequestType] = useState('transfert');
  const [specialty, setSpecialty] = useState('');
  const [toFacilityId, setToFacilityId] = useState<string>(DESTINATIONS[0].id);
  const [fromWard, setFromWard] = useState('Médecine');
  const [toWard, setToWard] = useState('Urgences');
  const [requestedDate, setRequestedDate] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [reason, setReason] = useState('');

  const [diagnosis, setDiagnosis] = useState('');
  const [history, setHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [treatments, setTreatments] = useState('');
  const [autonomy, setAutonomy] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [attachLetter, setAttachLetter] = useState(false);
  const [attachPrescription, setAttachPrescription] = useState(false);

  useEffect(() => {
    if (!open || !clinicalPatientId) return;
    const general = loadMegaProfile(clinicalPatientId, 'general');
    const urgence = loadMegaProfile(clinicalPatientId, 'urgence');
    const physique = loadMegaProfile(clinicalPatientId, 'physique');
    setLastName(general?.lastName ?? '');
    setFirstName(general?.firstName ?? '');
    setBirthDate(general?.birthDate ?? '');
    setPhone(general?.phone ?? '');
    setPatientRef(clinicalPatientId);
    setAllergies(
      [urgence?.severeAllergies, physique?.allergies].filter(Boolean).join(' · '),
    );
  }, [open, clinicalPatientId]);

  const patientDisplayName = useMemo(
    () => [firstName, lastName].filter(Boolean).join(' ') || 'Patient',
    [firstName, lastName],
  );

  const createTransfer = useMutation({
    mutationFn: (input: CreateTransferInput) =>
      admissionsService.createTransfer(input),
    onSuccess: async (transfer) => {
      await queryClient.invalidateQueries({
        queryKey: admissionsQueryKeys.transfers,
      });
      downloadLiaisonLetterPdf(transfer);
      appToast.success({
        title: 'Demande enregistrée',
        description: 'Lettre de liaison générée.',
      });
      setOpen(false);
      setStep(0);
    },
    onError: (error: Error) => {
      appToast.error({
        title: 'Échec de la demande',
        description: error.message,
      });
    },
  });

  const submit = () => {
    const dest = DESTINATIONS.find((d) => d.id === toFacilityId)!;
    const medicalBlock = [
      diagnosis && `Diagnostic : ${diagnosis}`,
      history && `Antécédents : ${history}`,
      allergies && `Allergies : ${allergies}`,
      treatments && `Traitements : ${treatments}`,
      autonomy && `Autonomie : ${autonomy}`,
      specialNeeds && `Besoins : ${specialNeeds}`,
      specialty && `Spécialité : ${specialty}`,
      `Type : ${REQUEST_TYPES.find((t) => t.value === requestType)?.label ?? requestType}`,
      `Urgence : ${urgency}`,
      requestedDate && `Date souhaitée : ${requestedDate}`,
      attachLetter && 'Pièce jointe : lettre médicale',
      attachPrescription && 'Pièce jointe : ordonnance',
    ]
      .filter(Boolean)
      .join('\n');

    createTransfer.mutate({
      patientId: patientRef || clinicalPatientId || user?.id || '',
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Établissement demandeur',
      fromWard,
      toFacilityId: dest.id,
      toFacilityName: dest.name,
      toWard,
      reason: reason || 'Demande de transfert / hospitalisation',
      notes: `Patient: ${patientDisplayName}\n${medicalBlock}`,
    });
  };

  const canNext = () => {
    if (step === 0) return Boolean(lastName && firstName && birthDate && phone);
    if (step === 1) return Boolean(requestType && toFacilityId && reason);
    if (step === 2) return Boolean(diagnosis);
    return true;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setStep(0);
      }}
    >
      <DialogTrigger asChild>
        <Button>Demander un transfert</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Demande de transfert / hospitalisation — étape {step + 1}/4
          </DialogTitle>
        </DialogHeader>
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {step === 0 ? (
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Nom *</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Prénom *</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Date de naissance *</Label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Identifiant patient</Label>
              <Input value={patientRef} onChange={(e) => setPatientRef(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Téléphone *</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Type de demande *</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Spécialité</Label>
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex. Orthopédie"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Établissement destinataire *</Label>
              <Select value={toFacilityId} onValueChange={setToFacilityId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Service d&apos;origine</Label>
                <Input value={fromWard} onChange={(e) => setFromWard(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Service destinataire</Label>
                <Input value={toWard} onChange={(e) => setToWard(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Date souhaitée</Label>
              <Input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Niveau d&apos;urgence</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_LEVELS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Motif *</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Diagnostic *</Label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Antécédents</Label>
              <Textarea value={history} onChange={(e) => setHistory(e.target.value)} rows={2} />
            </div>
            <div className="grid gap-1.5">
              <Label>Allergies</Label>
              <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Traitements en cours</Label>
              <Textarea
                value={treatments}
                onChange={(e) => setTreatments(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Autonomie</Label>
              <Input value={autonomy} onChange={(e) => setAutonomy(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Besoins spécifiques</Label>
              <Textarea
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                rows={2}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={attachLetter}
                onCheckedChange={(c) => setAttachLetter(Boolean(c))}
              />
              Joindre une lettre médicale (MVP — référence)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={attachPrescription}
                onCheckedChange={(c) => setAttachPrescription(Boolean(c))}
              />
              Joindre une ordonnance (MVP — référence)
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2 rounded-lg border p-4 text-sm">
            <p className="font-semibold">Résumé de la demande</p>
            <p>{patientDisplayName}</p>
            <p>
              {REQUEST_TYPES.find((t) => t.value === requestType)?.label} — {reason}
            </p>
            <p>{DESTINATIONS.find((d) => d.id === toFacilityId)?.name}</p>
            <p className="text-muted-foreground">{diagnosis}</p>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              Retour
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Continuer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={createTransfer.isPending}
            >
              {createTransfer.isPending
                ? 'Envoi…'
                : 'Valider et générer la lettre'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
