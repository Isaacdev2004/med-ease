import { useState } from 'react';

import { useMonitoringMutations } from '@/features/patient-monitoring/mutations/patient-monitoring.mutations';
import type {
  ObservationCategory,
  VitalType,
} from '@/services/patient-monitoring/types';
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

const METRICS: {
  code: VitalType | string;
  display: string;
  unit: string;
  category: ObservationCategory;
}[] = [
  {
    code: 'blood_pressure',
    display: 'Tension artérielle',
    unit: 'mmHg',
    category: 'vital-signs',
  },
  {
    code: 'heart_rate',
    display: 'Fréquence cardiaque',
    unit: 'bpm',
    category: 'vital-signs',
  },
  {
    code: 'temperature',
    display: 'Température',
    unit: '°C',
    category: 'vital-signs',
  },
  {
    code: 'spo2',
    display: 'Saturation SpO₂',
    unit: '%',
    category: 'vital-signs',
  },
  {
    code: 'blood_glucose',
    display: 'Glycémie',
    unit: 'mg/dL',
    category: 'vital-signs',
  },
  {
    code: 'weight',
    display: 'Poids',
    unit: 'kg',
    category: 'vital-signs',
  },
  {
    code: 'pain_score',
    display: 'Douleur (EVA)',
    unit: '/10',
    category: 'symptom',
  },
  {
    code: 'respiratory_rate',
    display: 'Fréquence respiratoire',
    unit: '/min',
    category: 'vital-signs',
  },
];

/** Formulaire Studio — saisie Suivi / constantes. */
export function AddObservationDialog({
  patientId,
}: {
  patientId: string;
}) {
  const { createObservation } = useMonitoringMutations();
  const [open, setOpen] = useState(false);
  const [metricCode, setMetricCode] = useState('heart_rate');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('bpm');
  const [notes, setNotes] = useState('');
  const [context, setContext] = useState<'home' | 'outpatient' | 'telemonitoring'>(
    'home',
  );

  const applyMetric = (code: string) => {
    setMetricCode(code);
    const m = METRICS.find((x) => x.code === code);
    if (m) setUnit(m.unit);
  };

  const submit = () => {
    const metric = METRICS.find((m) => m.code === metricCode) ?? METRICS[0]!;
    const numeric = Number(value.replace(',', '.'));
    createObservation.mutate(
      {
        patientId,
        category: metric.category,
        code: metric.code,
        display: metric.display,
        value: Number.isFinite(numeric) ? numeric : value,
        unit,
        context,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Ajouter une mesure</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Formulaire de suivi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Type de mesure *</Label>
            <Select value={metricCode} onValueChange={applyMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m.code} value={m.code}>
                    {m.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Valeur *</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={metricCode === 'blood_pressure' ? '120/80' : '72'}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Unité</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Contexte</Label>
            <Select
              value={context}
              onValueChange={(v) =>
                setContext(v as 'home' | 'outpatient' | 'telemonitoring')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Domicile</SelectItem>
                <SelectItem value="outpatient">Ambulatoire</SelectItem>
                <SelectItem value="telemonitoring">Télé-suivi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Symptômes, circonstances…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={createObservation.isPending || !patientId || !value.trim()}
          >
            {createObservation.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
