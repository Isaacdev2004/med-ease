import { format } from 'date-fns';

import { useAvailableSlots } from '@/features/appointments/hooks/use-appointments';
import { useBookAppointment } from '@/features/appointments/mutations/appointments.mutations';
import {
  bookingSchema,
  bookingStepFields,
  bookingWizardSteps,
  type BookingFormValues,
} from '@/features/appointments/validation/booking.schema';
import { FACILITIES, PROVIDERS, SPECIALTIES } from '@/services/appointments';
import { FormWizard } from '@/shared/forms/FormWizard';
import { useZodForm } from '@/shared/forms/use-zod-form';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const DEMO_PATIENTS = Array.from({ length: 8 }, (_, i) => ({
  id: `phr-${String(i + 1).padStart(3, '0')}`,
  name: `Patient ${i + 1}`,
}));

interface BookingWizardProps {
  defaultPatientId?: string;
  onSuccess?: (appointmentId: string) => void;
  className?: string;
}

export function BookingWizard({ defaultPatientId, onSuccess, className }: BookingWizardProps) {
  const form = useZodForm(bookingSchema, {
    patientId: defaultPatientId ?? '',
    serviceType: '',
    specialty: '',
    providerId: '',
    facilityId: '',
    date: '',
    scheduledAt: '',
    visitType: 'in_person',
    reason: '',
    insurance: '',
    notes: '',
  });
  const bookMutation = useBookAppointment();
  const watch = form.watch();
  const slotsQuery = useAvailableSlots(watch.providerId, watch.facilityId, watch.date);

  async function validateStep(stepIndex: number) {
    const fields = bookingStepFields[stepIndex];
    if (!fields?.length) return true;
    return form.trigger(fields);
  }

  async function onComplete(values: BookingFormValues) {
    const result = await bookMutation.mutateAsync({
      patientId: values.patientId,
      providerId: values.providerId,
      facilityId: values.facilityId,
      specialty: values.specialty,
      serviceType: values.serviceType,
      scheduledAt: values.scheduledAt,
      visitType: values.visitType,
      reason: values.reason,
      insurance: values.insurance,
      notes: values.notes,
    });
    if (result && typeof result === 'object' && 'id' in result) {
      onSuccess?.((result as { id: string }).id);
    }
  }

  function renderStep(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <Select value={watch.patientId} onValueChange={(v) => form.setValue('patientId', v)}>
              <SelectTrigger id="patientId"><SelectValue placeholder="Select patient" /></SelectTrigger>
              <SelectContent>
                {DEMO_PATIENTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service</Label>
            <Select value={watch.serviceType} onValueChange={(v) => form.setValue('serviceType', v)}>
              <SelectTrigger id="serviceType"><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>
                {['Consultation', 'Follow-up', 'Procedure', 'Diagnostic', 'Therapy'].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={watch.specialty} onValueChange={(v) => {
                form.setValue('specialty', v);
                form.setValue('visitType', v === 'Telemedicine' ? 'telemedicine' : 'in_person');
              }}>
                <SelectTrigger id="specialty"><SelectValue placeholder="Specialty" /></SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visit type</Label>
              <Input value={watch.visitType.replace('_', ' ')} readOnly />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="providerId">Provider</Label>
            <Select value={watch.providerId} onValueChange={(v) => form.setValue('providerId', v)}>
              <SelectTrigger id="providerId"><SelectValue placeholder="Select provider" /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.fullName} — {p.specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <Label htmlFor="facilityId">Facility</Label>
            <Select value={watch.facilityId} onValueChange={(v) => form.setValue('facilityId', v)}>
              <SelectTrigger id="facilityId"><SelectValue placeholder="Select facility" /></SelectTrigger>
              <SelectContent>
                {FACILITIES.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 5:
        return (
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...form.register('date')} />
          </div>
        );
      case 6:
        return (
          <div className="space-y-2">
            <Label>Available time slots</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="listbox" aria-label="Time slots">
              {(slotsQuery.data ?? []).map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  role="option"
                  aria-selected={watch.scheduledAt === slot.start}
                  className={cn(
                    'rounded-md border px-2 py-2 text-sm hover:bg-muted',
                    watch.scheduledAt === slot.start && 'border-primary bg-primary/10',
                  )}
                  onClick={() => form.setValue('scheduledAt', slot.start)}
                >
                  {format(new Date(slot.start), 'HH:mm')}
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for visit</Label>
              <Input id="reason" {...form.register('reason')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance (optional)</Label>
              <Input id="insurance" {...form.register('insurance')} />
            </div>
            <Card>
              <CardContent className="pt-4 text-sm space-y-1">
                <p><strong>Patient:</strong> {watch.patientId}</p>
                <p><strong>Provider:</strong> {PROVIDERS.find((p) => p.id === watch.providerId)?.fullName}</p>
                <p><strong>When:</strong> {watch.scheduledAt ? format(new Date(watch.scheduledAt), 'PPp') : '—'}</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <p className="text-success font-medium">Appointment booked successfully!</p>;
    }
  }

  return (
    <FormWizard
      className={className}
      form={form}
      steps={bookingWizardSteps.slice(0, 8)}
      renderStep={renderStep}
      validateStep={validateStep}
      onComplete={onComplete}
      submitting={bookMutation.isPending}
    />
  );
}

export function TimeSlotPicker({
  providerId,
  facilityId,
  date,
  value,
  onChange,
}: {
  providerId: string;
  facilityId: string;
  date: string;
  value?: string;
  onChange: (slot: string) => void;
}) {
  const slotsQuery = useAvailableSlots(providerId, facilityId, date);
  return (
    <div className="grid grid-cols-4 gap-2" role="listbox" aria-label="Available time slots">
      {(slotsQuery.data ?? []).map((slot) => (
        <button
          key={slot.id}
          type="button"
          className={cn(
            'rounded border px-2 py-1 text-sm',
            value === slot.start && 'border-primary bg-primary/10',
          )}
          onClick={() => onChange(slot.start)}
        >
          {format(new Date(slot.start), 'HH:mm')}
        </button>
      ))}
    </div>
  );
}
