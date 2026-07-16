import { useEffect, useMemo, useState } from 'react';
import { GitCompare } from 'lucide-react';

import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { MOCK_MEDICATIONS } from '@/services/medical-library';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { cn } from '@/shared/lib/utils';

interface ComparisonDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primary: MedicationRecord | null;
  candidates?: MedicationRecord[];
}

const COMPARISON_ROWS: Array<{
  label: string;
  value: (medication: MedicationRecord) => string;
}> = [
  { label: 'Generic name', value: (med) => med.genericName },
  { label: 'Strength', value: (med) => med.strength },
  { label: 'Dosage form', value: (med) => med.dosageForm },
  { label: 'Route', value: (med) => med.route },
  { label: 'Therapeutic class', value: (med) => med.therapeuticClass },
  { label: 'Prescription', value: (med) => (med.prescriptionRequired ? 'Required' : 'OTC') },
  { label: 'Pregnancy safety', value: (med) => med.pregnancySafety },
  { label: 'Breastfeeding', value: (med) => med.breastfeedingSafety },
  { label: 'Pediatric approved', value: (med) => (med.pediatricApproved ? 'Yes' : 'No') },
  { label: 'Interactions', value: (med) => String(med.interactions.length) },
  { label: 'Contraindications', value: (med) => String(med.contraindications.length) },
];

function formatSafety(value: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (value === 'safe') return 'default';
  if (value === 'caution') return 'secondary';
  if (value === 'contraindicated') return 'destructive';
  return 'outline';
}

/** Side-by-side medication comparison panel. */
export function ComparisonDrawer({
  open,
  onOpenChange,
  primary,
  candidates,
}: ComparisonDrawerProps) {
  const options = useMemo(() => {
    const pool = candidates?.length ? candidates : MOCK_MEDICATIONS;
    if (!primary) return pool;
    return pool.filter((medication) => medication.id !== primary.id);
  }, [candidates, primary]);

  const [secondaryId, setSecondaryId] = useState<string>('');

  useEffect(() => {
    if (!open || !primary) return;
    const defaultSecondary = options.find((med) => med.therapeuticClass === primary.therapeuticClass)?.id
      ?? options[0]?.id
      ?? '';
    setSecondaryId(defaultSecondary);
  }, [open, primary, options]);

  const secondary = options.find((medication) => medication.id === secondaryId) ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GitCompare className="size-5" />
            Medication comparison
          </SheetTitle>
          <SheetDescription>
            Review dosage, safety, and interaction differences side-by-side.
          </SheetDescription>
        </SheetHeader>

        {!primary ? (
          <p className="text-muted-foreground mt-6 text-sm">Select a medication to compare.</p>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Primary</p>
                <p className="mt-1 font-semibold">{primary.name}</p>
                <p className="text-muted-foreground text-sm">{primary.strength}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compare-secondary">Compare with</Label>
                <Select value={secondaryId} onValueChange={setSecondaryId}>
                  <SelectTrigger id="compare-secondary">
                    <SelectValue placeholder="Choose medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((medication) => (
                      <SelectItem key={medication.id} value={medication.id}>
                        {medication.name} · {medication.strength}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {secondary ? (
              <>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="p-3 text-left font-medium">Attribute</th>
                        <th className="p-3 text-left font-medium">{primary.name}</th>
                        <th className="p-3 text-left font-medium">{secondary.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row) => {
                        const left = row.value(primary);
                        const right = row.value(secondary);
                        const differs = left !== right;

                        return (
                          <tr key={row.label} className="border-b last:border-0">
                            <td className="text-muted-foreground p-3">{row.label}</td>
                            <td className={cn('p-3', differs && 'bg-amber-50/60 dark:bg-amber-950/20')}>
                              {row.label.includes('safety') || row.label.includes('Breastfeeding') ? (
                                <Badge variant={formatSafety(left)}>{left}</Badge>
                              ) : (
                                left
                              )}
                            </td>
                            <td className={cn('p-3', differs && 'bg-amber-50/60 dark:bg-amber-950/20')}>
                              {row.label.includes('safety') || row.label.includes('Breastfeeding') ? (
                                <Badge variant={formatSafety(right)}>{right}</Badge>
                              ) : (
                                right
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="mb-2 font-medium">{primary.name} — key warnings</p>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                      {primary.warnings.slice(0, 3).map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="mb-2 font-medium">{secondary.name} — key warnings</p>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                      {secondary.warnings.slice(0, 3).map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button className="w-full" onClick={() => onOpenChange(false)}>
                  Close comparison
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Choose a second medication to compare.</p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
