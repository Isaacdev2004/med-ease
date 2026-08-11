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

export function AddMedicationDialog({ patientId }: { patientId: string }) {
  const { createPrescription } = useMedicationMutations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Doliprane');
  const [generic, setGeneric] = useState('Paracetamol');
  const [strength, setStrength] = useState('500 mg');
  const [dose, setDose] = useState('1 comprimé');
  const [frequency, setFrequency] = useState('3x/jour');

  const submit = () => {
    createPrescription.mutate(
      {
        patientId,
        medicationName: name,
        genericName: generic,
        strength,
        dose,
        frequency,
        route: 'oral',
        durationDays: 7,
        instructions: `${dose} — ${frequency}`,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Ajouter un médicament</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter au pilulier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Nom / marque</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>DCI / générique</Label>
            <Input value={generic} onChange={(e) => setGeneric(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Dosage</Label>
              <Input
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Prise</Label>
              <Input value={dose} onChange={(e) => setDose(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Fréquence</Label>
            <Input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={createPrescription.isPending || !patientId}
          >
            {createPrescription.isPending ? 'Ajout…' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
