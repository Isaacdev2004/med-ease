import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  admissionsQueryKeys,
} from '@/features/admissions/hooks/use-admissions';
import { admissionsService } from '@/services/admissions';
import {
  DEMO_FACILITY_PARIS,
  type CreateTransferInput,
  type PatientTransfer,
} from '@/services/admissions/types';
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

const DEMO_PATIENTS = [
  {
    id: '01930000-0000-7000-8000-000000000301',
    name: 'Sarah Jenkins',
  },
  {
    id: '01930000-0000-7000-8000-000000000302',
    name: 'James Wilson',
  },
  {
    id: '01930000-0000-7000-8000-000000000303',
    name: 'Maria Lopez',
  },
] as const;

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
  <h1>Lettre de liaison — Transfert patient</h1>
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
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState<string>(DEMO_PATIENTS[0].id);
  const [toFacilityId, setToFacilityId] = useState<string>(DESTINATIONS[0].id);
  const [fromWard, setFromWard] = useState('Médecine A');
  const [toWard, setToWard] = useState('Urgences');
  const [reason, setReason] = useState('Transfert pour avis spécialisé');
  const [notes, setNotes] = useState('');

  const createTransfer = useMutation({
    mutationFn: (input: CreateTransferInput) =>
      admissionsService.createTransfer(input),
    onSuccess: async (transfer) => {
      await queryClient.invalidateQueries({
        queryKey: admissionsQueryKeys.transfers,
      });
      downloadLiaisonLetterPdf(transfer);
      appToast.success({
        title: 'Transfert créé',
        description: 'Lettre de liaison générée.',
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      appToast.error({
        title: 'Échec du transfert',
        description: error.message,
      });
    },
  });

  const submit = () => {
    const patient = DEMO_PATIENTS.find((p) => p.id === patientId)!;
    const dest = DESTINATIONS.find((d) => d.id === toFacilityId)!;
    createTransfer.mutate({
      patientId: patient.id,
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard,
      toFacilityId: dest.id,
      toFacilityName: dest.name,
      toWard,
      reason,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Demander un transfert</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Demande de transfert</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEMO_PATIENTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Établissement destinataire</Label>
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
            <Label>Motif</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={createTransfer.isPending}
          >
            {createTransfer.isPending
              ? 'Création…'
              : 'Créer + générer la lettre'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
