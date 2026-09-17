import { useEffect, useMemo, useState } from 'react';

import { useMedicationMutations } from '@/features/medications/mutations/medications.mutations';
import {
  MOCK_MEDICATIONS,
  medicalLibraryService,
} from '@/services/medical-library';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
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
import { Checkbox } from '@/shared/ui/checkbox';

function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function localSearch(q: string): MedicationRecord[] {
  const needle = fold(q.trim());
  if (!needle) return MOCK_MEDICATIONS.slice(0, 12);
  return MOCK_MEDICATIONS.filter((med) => {
    const hay = fold(
      [med.name, med.brandName, med.genericName, med.strength, med.dosageForm]
        .filter(Boolean)
        .join(' '),
    );
    return needle.split(/\s+/).every((t) => hay.includes(t));
  }).slice(0, 12);
}

const STEPS = [
  'Recherche',
  'Traitement',
  'Horaires',
  'Conditions',
  'Prescripteur',
  'Confirmation',
];

const FREQUENCIES = [
  { value: '1x/jour', times: ['08:00'] },
  { value: '2x/jour', times: ['08:00', '20:00'] },
  { value: '3x/jour', times: ['08:00', '12:00', '20:00'] },
  { value: '4x/jour', times: ['08:00', '12:00', '16:00', '20:00'] },
  { value: 'Si besoin', times: ['08:00'] },
  { value: 'Autre', times: ['08:00'] },
];

const SLOT_PRESETS = [
  { id: 'matin', label: 'Matin', time: '08:00' },
  { id: 'midi', label: 'Midi', time: '12:00' },
  { id: 'apres-midi', label: 'Après-midi', time: '16:00' },
  { id: 'soir', label: 'Soir', time: '20:00' },
];

const MEAL_CONDITIONS = [
  'Avant le repas',
  'Pendant le repas',
  'Après le repas',
  'À distance des repas',
  'Indifférent',
];

const DURATION_MODES = [
  { id: 'permanent', label: 'Traitement permanent' },
  { id: 'until', label: "Jusqu'à une date" },
  { id: 'days', label: 'Pendant N jours' },
  { id: 'order', label: "Jusqu'à nouvel ordre" },
] as const;

/** Formulaire Studio — Ajouter un médicament (étapes 1 → 6). */
export function AddMedicationDialog({ patientId }: { patientId: string }) {
  const { createPrescription } = useMedicationMutations();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MedicationRecord[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MedicationRecord | null>(null);

  const [form, setForm] = useState('Comprimé');
  const [dose, setDose] = useState('1 comprimé');
  const [route, setRoute] = useState('Orale');
  const [frequency, setFrequency] = useState('3x/jour');
  const [slots, setSlots] = useState<Record<string, boolean>>({
    matin: true,
    midi: true,
    soir: true,
  });
  const [customTime, setCustomTime] = useState('');
  const [mealCondition, setMealCondition] = useState('Après le repas');
  const [durationMode, setDurationMode] =
    useState<(typeof DURATION_MODES)[number]['id']>('days');
  const [durationDays, setDurationDays] = useState('7');
  const [untilDate, setUntilDate] = useState('');
  const [prescriber, setPrescriber] = useState('Médecin traitant');
  const [facility, setFacility] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );

  const scheduleTimes = useMemo(() => {
    const fromSlots = SLOT_PRESETS.filter((s) => slots[s.id]).map((s) => s.time);
    if (customTime.trim()) fromSlots.push(customTime.trim());
    return Array.from(new Set(fromSlots)).sort();
  }, [slots, customTime]);

  const reset = () => {
    setStep(0);
    setSelected(null);
    setQuery('');
    setResults([]);
  };

  const runSearch = async (term = query) => {
    setSearching(true);
    try {
      let items: MedicationRecord[] = [];
      try {
        const page = await medicalLibraryService.search({
          q: term.trim() || undefined,
          page: 1,
          pageSize: 12,
        });
        items = page.items;
      } catch {
        items = [];
      }
      if (!items.length) items = localSearch(term);
      setResults(items);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void runSearch(query);
  }, [open]);

  const selectMed = (med: MedicationRecord) => {
    setSelected(med);
    setForm(med.dosageForm || 'Comprimé');
    setDose(`1 ${(med.dosageForm || 'comprimé').toLowerCase()}`);
    setStep(1);
  };

  const applyFrequency = (value: string) => {
    setFrequency(value);
    const preset = FREQUENCIES.find((f) => f.value === value);
    if (!preset) return;
    const next: Record<string, boolean> = {};
    for (const slot of SLOT_PRESETS) {
      next[slot.id] = preset.times.includes(slot.time);
    }
    setSlots(next);
  };

  const canNext = () => {
    if (step === 0) return Boolean(selected);
    if (step === 1) return Boolean(dose && frequency);
    if (step === 2) return scheduleTimes.length > 0;
    if (step === 3) return Boolean(mealCondition);
    if (step === 4) return Boolean(prescriber);
    return true;
  };

  const submit = () => {
    if (!selected) return;
    const days =
      durationMode === 'days'
        ? Number(durationDays) || 7
        : durationMode === 'permanent' || durationMode === 'order'
          ? 90
          : 14;
    createPrescription.mutate(
      {
        patientId,
        medicationName: selected.name,
        genericName: selected.genericName,
        brandName: selected.brandName ?? selected.name,
        strength: selected.strength || '',
        dose,
        frequency,
        route: 'oral',
        durationDays: days,
        instructions: [
          `${dose} — ${frequency}`,
          `horaires ${scheduleTimes.join(' / ')}`,
          mealCondition,
          durationMode === 'until' && untilDate ? `jusqu'au ${untilDate}` : null,
          `prescripteur: ${prescriber}`,
          facility ? `établissement: ${facility}` : null,
          `ordonnance du ${prescriptionDate}`,
          `voie ${route}`,
          `forme ${form}`,
        ]
          .filter(Boolean)
          .join(' · '),
        scheduleTimes,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">Ajouter un médicament</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un médicament — étape {step + 1}/6</DialogTitle>
        </DialogHeader>

        <div className="mb-2 flex flex-wrap gap-1">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                i === step
                  ? 'bg-primary text-primary-foreground'
                  : i < step
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {step === 0 ? (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Rechercher un médicament *</Label>
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom commercial ou DCI"
                />
                <Button
                  type="button"
                  onClick={() => void runSearch(query)}
                  disabled={searching || query.trim().length < 2}
                >
                  {searching ? '…' : 'Chercher'}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              {results.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  className={`rounded-lg border p-3 text-left text-sm hover:bg-muted/50 ${
                    selected?.id === med.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => selectMed(med)}
                >
                  <p className="font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[med.genericName, med.strength, med.dosageForm]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 && selected ? (
          <div className="grid gap-3">
            <p className="text-sm font-medium">{selected.name}</p>
            <div className="grid gap-1.5">
              <Label>Forme</Label>
              <Input value={form} onChange={(e) => setForm(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Dose *</Label>
              <Input value={dose} onChange={(e) => setDose(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Voie</Label>
              <Input value={route} onChange={(e) => setRoute(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Fréquence *</Label>
              <Select value={frequency} onValueChange={applyFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3">
            <Label>Quand devez-vous le prendre ? *</Label>
            {SLOT_PRESETS.map((slot) => (
              <label key={slot.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={Boolean(slots[slot.id])}
                  onCheckedChange={(checked) =>
                    setSlots((s) => ({ ...s, [slot.id]: Boolean(checked) }))
                  }
                />
                {slot.label} {slot.time}
              </label>
            ))}
            <div className="grid gap-1.5">
              <Label>+ Ajouter un horaire</Label>
              <Input
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="15:30"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Conditions de prise *</Label>
              <Select value={mealCondition} onValueChange={setMealCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Durée</Label>
              <Select
                value={durationMode}
                onValueChange={(v) =>
                  setDurationMode(v as (typeof DURATION_MODES)[number]['id'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_MODES.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {durationMode === 'days' ? (
              <Input
                type="number"
                min={1}
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="Nombre de jours"
              />
            ) : null}
            {durationMode === 'until' ? (
              <Input
                type="date"
                value={untilDate}
                onChange={(e) => setUntilDate(e.target.value)}
              />
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Médecin / prescripteur *</Label>
              <Input
                value={prescriber}
                onChange={(e) => setPrescriber(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Établissement</Label>
              <Input
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="Optionnel"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Date de prescription</Label>
              <Input
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Document ordonnance : à joindre ultérieurement (MVP).
            </p>
          </div>
        ) : null}

        {step === 5 && selected ? (
          <div className="space-y-2 rounded-lg border p-4 text-sm">
            <p className="font-semibold">Résumé du traitement</p>
            <p>{selected.name}</p>
            <p>{dose}</p>
            <p>{scheduleTimes.join(' — ')}</p>
            <p>{mealCondition}</p>
            <p>
              {durationMode === 'days'
                ? `Pendant ${durationDays} jours`
                : durationMode === 'until'
                  ? `Jusqu’au ${untilDate || '—'}`
                  : DURATION_MODES.find((m) => m.id === durationMode)?.label}
            </p>
            <p className="text-muted-foreground">
              {prescriber}
              {facility ? ` · ${facility}` : ''} · {prescriptionDate}
            </p>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              Retour
            </Button>
          ) : null}
          {step < 5 ? (
            <Button
              type="button"
              disabled={!canNext()}
              onClick={() => {
                if (step === 0 && !selected) return;
                setStep((s) => Math.min(5, s + 1));
              }}
            >
              Continuer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={createPrescription.isPending || !patientId}
            >
              {createPrescription.isPending
                ? 'Ajout…'
                : 'Ajouter au pilulier'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
