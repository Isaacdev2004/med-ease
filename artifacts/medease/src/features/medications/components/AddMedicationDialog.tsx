import { useState } from 'react';

import { useMedicationMutations } from '@/features/medications/mutations/medications.mutations';
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

const FREQUENCIES = [
  { value: '1x/jour', times: ['08:00'] },
  { value: '2x/jour', times: ['08:00', '20:00'] },
  { value: '3x/jour', times: ['08:00', '14:00', '20:00'] },
  { value: '4x/jour', times: ['08:00', '12:00', '16:00', '20:00'] },
  { value: 'Si besoin', times: ['08:00'] },
];

const MEAL_CONDITIONS = [
  'Avant le repas',
  'Pendant le repas',
  'Après le repas',
  'À distance des repas',
  'Indifférent',
];

/** Formulaire Studio — Ajouter un médicament au pilulier. */
export function AddMedicationDialog({ patientId }: { patientId: string }) {
  const { createPrescription } = useMedicationMutations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Doliprane');
  const [generic, setGeneric] = useState('Paracétamol');
  const [strength, setStrength] = useState('500 mg');
  const [form, setForm] = useState('Comprimé');
  const [tabletCount, setTabletCount] = useState('1');
  const [frequency, setFrequency] = useState('3x/jour');
  const [scheduleTimes, setScheduleTimes] = useState('08:00, 14:00, 20:00');
  const [mealCondition, setMealCondition] = useState('Après le repas');
  const [durationDays, setDurationDays] = useState('7');

  const applyFrequency = (value: string) => {
    setFrequency(value);
    const preset = FREQUENCIES.find((f) => f.value === value);
    if (preset) setScheduleTimes(preset.times.join(', '));
  };

  const submit = () => {
    const times = scheduleTimes
      .split(/[,;]/)
      .map((t) => t.trim())
      .filter(Boolean);
    const dose = `${tabletCount} ${form.toLowerCase()}${Number(tabletCount) > 1 ? 's' : ''}`;
    createPrescription.mutate(
      {
        patientId,
        medicationName: name,
        genericName: generic,
        brandName: name,
        strength,
        dose,
        frequency,
        route: 'oral',
        durationDays: Number(durationDays) || 7,
        instructions: `${dose} — ${frequency} — ${mealCondition} — horaires ${times.join(' / ')}`,
        scheduleTimes: times,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Ajouter un médicament</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter au pilulier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Nom du médicament *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>DCI / générique</Label>
            <Input value={generic} onChange={(e) => setGeneric(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Dosage *</Label>
              <Input
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="500 mg"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Forme</Label>
              <Input value={form} onChange={(e) => setForm(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Nombre de comprimés / unité *</Label>
              <Input
                type="number"
                min={1}
                value={tabletCount}
                onChange={(e) => setTabletCount(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Durée (jours)</Label>
              <Input
                type="number"
                min={1}
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Posologie (fréquence) *</Label>
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
          <div className="grid gap-1.5">
            <Label>Horaires de prise *</Label>
            <Input
              value={scheduleTimes}
              onChange={(e) => setScheduleTimes(e.target.value)}
              placeholder="08:00, 14:00, 20:00"
            />
            <p className="text-xs text-muted-foreground">
              Séparez les horaires par des virgules (matin / midi / soir).
            </p>
          </div>
          <div className="grid gap-1.5">
            <Label>Conditions de prise</Label>
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
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={createPrescription.isPending || !patientId || !name}
          >
            {createPrescription.isPending ? 'Ajout…' : 'Ajouter au pilulier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
