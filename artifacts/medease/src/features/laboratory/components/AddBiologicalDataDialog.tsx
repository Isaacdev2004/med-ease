import { useState } from 'react';

import { useLaboratoryMutations } from '@/features/laboratory/mutations/laboratory.mutations';
import { LAB_TEST_CATALOG } from '@/services/laboratory';
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
import { appToast } from '@/services/api/toast';

/** Demo facility / physician UUIDs (seed clinical). */
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_FACILITY_ID = '01930000-0000-7000-8000-000000000201';

export interface BiologicalEntry {
  id: string;
  examName: string;
  testId: string;
  value: string;
  unit: string;
  collectedAt: string;
  labName: string;
  notes?: string;
  createdAt: string;
}

function bioKey(patientId: string) {
  return `medease.lab.bio.${patientId}`;
}

export function loadBiologicalEntries(patientId: string): BiologicalEntry[] {
  try {
    const raw = localStorage.getItem(bioKey(patientId));
    return raw ? (JSON.parse(raw) as BiologicalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveBiologicalEntry(patientId: string, entry: BiologicalEntry) {
  const list = [entry, ...loadBiologicalEntries(patientId)];
  localStorage.setItem(bioKey(patientId), JSON.stringify(list.slice(0, 50)));
}

const COMMON_EXAMS = [
  { id: 't-hgb', label: 'Hémoglobine' },
  { id: 't-wbc', label: 'Leucocytes (GB)' },
  { id: 't-plt', label: 'Plaquettes' },
  { id: 't-glucose', label: 'Glycémie' },
  { id: 't-creat', label: 'Créatinine' },
  { id: 't-hba1c', label: 'HbA1c' },
  { id: 't-hdl', label: 'HDL' },
  { id: 't-ldl', label: 'LDL' },
  { id: 't-tsh', label: 'TSH' },
  { id: 'custom', label: 'Autre examen' },
];

/** Formulaire Studio — ajout de données biologiques (Laboratoire). */
export function AddBiologicalDataDialog({
  patientId,
  patientName,
  onSaved,
}: {
  patientId: string;
  patientName?: string;
  onSaved?: () => void;
}) {
  const { createOrder } = useLaboratoryMutations();
  const [open, setOpen] = useState(false);
  const [examKey, setExamKey] = useState('t-glucose');
  const [customName, setCustomName] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('mg/dL');
  const [collectedAt, setCollectedAt] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [labName, setLabName] = useState('Laboratoire Biologie Médicale');
  const [notes, setNotes] = useState('');

  const catalogTest =
    examKey === 'custom'
      ? null
      : LAB_TEST_CATALOG.find((t) => t.id === examKey);

  const submit = () => {
    const examName =
      examKey === 'custom'
        ? customName.trim()
        : (COMMON_EXAMS.find((e) => e.id === examKey)?.label ??
          catalogTest?.name ??
          'Examen');
    if (!examName || !value.trim()) {
      appToast.error({
        title: 'Champs obligatoires',
        description: 'Indiquez l’examen et la valeur.',
      });
      return;
    }

    const testId = examKey === 'custom' ? 't-hgb' : examKey;
    const entry: BiologicalEntry = {
      id: `bio-${Date.now()}`,
      examName,
      testId,
      value: value.trim(),
      unit: unit.trim() || catalogTest?.units || '',
      collectedAt,
      labName,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveBiologicalEntry(patientId, entry);

    createOrder.mutate(
      {
        patientId,
        patientName: patientName ?? 'Patient',
        orderingPhysician: 'Saisie patient',
        orderingPhysicianId: DEMO_PHYSICIAN_ID,
        facilityId: DEMO_FACILITY_ID,
        facilityName: labName,
        department: 'Biologie',
        laboratoryId: DEMO_FACILITY_ID,
        laboratoryName: labName,
        priority: 'routine',
        collectionMethod: 'external_lab',
        clinicalIndication: `${examName} = ${value} ${unit} (${collectedAt})`,
        testIds: [testId],
        notes: [
          `Valeur: ${value} ${unit}`,
          `Date prélèvement: ${collectedAt}`,
          notes.trim() || null,
        ]
          .filter(Boolean)
          .join(' · '),
        scheduledAt: collectedAt,
      },
      {
        onSuccess: () => {
          setOpen(false);
          onSaved?.();
        },
        onError: () => {
          // Local save already done — still confirm for MVP offline / API gaps
          appToast.success({
            title: 'Donnée biologique enregistrée localement',
            description: 'La synchronisation serveur pourra être relancée plus tard.',
          });
          setOpen(false);
          onSaved?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Ajouter une donnée biologique</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une donnée biologique</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Examen *</Label>
            <Select
              value={examKey}
              onValueChange={(v) => {
                setExamKey(v);
                const t = LAB_TEST_CATALOG.find((x) => x.id === v);
                if (t?.units) setUnit(t.units);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_EXAMS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {examKey === 'custom' ? (
            <div className="grid gap-1.5">
              <Label>Nom de l’examen *</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex. CRP, HbA1c…"
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Valeur *</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="5.2"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Unité</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Date de prélèvement</Label>
            <Input
              type="date"
              value={collectedAt}
              onChange={(e) => setCollectedAt(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Laboratoire</Label>
            <Input value={labName} onChange={(e) => setLabName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="À jeun, contexte clinique…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={createOrder.isPending || !patientId}
          >
            {createOrder.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
