import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useCarePlanMutations } from '@/features/care-plans/mutations/care-plans.mutations';
import { carePlanService } from '@/services/care-plans/care-plan.service';
import type { PathwayId } from '@/services/care-plans/types';
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

const DEMO_PATIENT = '01930000-0000-7000-8000-000000000301';

export function CreatePathwayDialog() {
  const { createCarePlan } = useCarePlanMutations();
  const pathwaysQuery = useQuery({
    queryKey: ['care-plans', 'pathways'],
    queryFn: () => carePlanService.getClinicalPathways(),
  });
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState(DEMO_PATIENT);
  const [pathwayId, setPathwayId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const pathways = pathwaysQuery.data ?? [];

  const submit = () => {
    const pathway = pathways.find((p) => p.id === pathwayId);
    createCarePlan.mutate(
      {
        patientId,
        title: title || pathway?.name || 'Nouveau parcours',
        description: pathway?.description,
        type: 'chronic_disease',
        pathwayId: (pathway?.id ?? pathwayId) as PathwayId,
        primaryDiagnosis: diagnosis || undefined,
        notes: notes || undefined,
        activate: true,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créer un parcours</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un e-parcours patient</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Patient (ID)</Label>
            <Input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Démo Sarah Jenkins : {DEMO_PATIENT}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Label>Parcours type</Label>
            <Select
              value={pathwayId}
              onValueChange={(v) => {
                setPathwayId(v);
                const p = pathways.find((x) => x.id === v);
                if (p) setTitle(p.name);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un parcours…" />
              </SelectTrigger>
              <SelectContent>
                {pathways.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Titre du plan</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Diagnostic principal</Label>
            <Input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="ex. Diabète type 2"
            />
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
            disabled={createCarePlan.isPending || !pathwayId || !patientId}
          >
            {createCarePlan.isPending ? 'Création…' : 'Créer et activer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
