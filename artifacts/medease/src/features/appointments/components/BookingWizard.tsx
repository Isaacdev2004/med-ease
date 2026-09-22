import { format } from 'date-fns';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAvailableSlots } from '@/features/appointments/hooks/use-appointments';
import { useBookAppointment } from '@/features/appointments/mutations/appointments.mutations';
import {
  bookingSchema,
  bookingStepFields,
  bookingWizardSteps,
  type BookingFormValues,
} from '@/features/appointments/validation/booking.schema';
import { directoryQueries } from '@/features/directory/queries/directory.queries';
import { patientsQueries } from '@/features/patients/queries/patients.queries';
import { SPECIALTIES } from '@/services/appointments';
import { useAuth } from '@/services/auth/auth-context';
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

interface BookingWizardProps {
  defaultPatientId?: string;
  /** Patient portal: skip clinician patient picker and lock the resolved id. */
  lockPatient?: boolean;
  onSuccess?: (appointmentId: string) => void;
  className?: string;
}

function selectValue(value: string | undefined) {
  return value?.trim() ? value : undefined;
}

export function BookingWizard({
  defaultPatientId,
  lockPatient = false,
  onSuccess,
  className,
}: BookingWizardProps) {
  const { user } = useAuth();
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
  const slotsQuery = useAvailableSlots(
    watch.providerId,
    watch.facilityId,
    watch.date,
  );

  useEffect(() => {
    if (defaultPatientId) {
      form.setValue('patientId', defaultPatientId);
    }
  }, [defaultPatientId, form]);

  const patientsQuery = useQuery({
    ...patientsQueries.list({ pageSize: 50 }),
    enabled: !lockPatient,
  });
  const lockedPatientQuery = useQuery({
    ...patientsQueries.detail(defaultPatientId ?? ''),
    enabled: lockPatient && Boolean(defaultPatientId),
  });
  const providersQuery = useQuery(
    directoryQueries.search({
      type: 'professional',
      specialty: watch.specialty || undefined,
      pageSize: 50,
    }),
  );
  const facilitiesQuery = useQuery(
    directoryQueries.search({ type: 'facility', pageSize: 50 }),
  );

  const patients = lockPatient && defaultPatientId
    ? [
        {
          patientId: defaultPatientId,
          fullName:
            lockedPatientQuery.data?.fullName ??
            user?.fullName ??
            user?.email ??
            'Mon dossier patient',
        },
      ]
    : (patientsQuery.data?.items ?? []).filter((p) => p.patientId);
  const providers = (providersQuery.data?.items ?? []).filter((p) => p.id);
  const facilities = (facilitiesQuery.data?.items ?? []).filter((f) => f.id);

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
            {lockPatient ? (
              <Card>
                <CardContent className="pt-4 text-sm">
                  <p className="font-medium">
                    {patients[0]?.fullName ?? 'Mon dossier patient'}
                  </p>
                  <p className="text-muted-foreground">
                    Réservation pour votre compte patient.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Select
                value={selectValue(watch.patientId)}
                onValueChange={(v) => form.setValue('patientId', v)}
              >
                <SelectTrigger id="patientId">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.patientId} value={p.patientId}>
                      {p.fullName ?? p.patientId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!lockPatient && patientsQuery.isLoading ? (
              <p className="text-xs text-muted-foreground">Loading patients…</p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service</Label>
            <Select
              value={selectValue(watch.serviceType)}
              onValueChange={(v) => form.setValue('serviceType', v)}
            >
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Consultation',
                  'Follow-up',
                  'Procedure',
                  'Diagnostic',
                  'Therapy',
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
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
              <Select
                value={selectValue(watch.specialty)}
                onValueChange={(v) => {
                  form.setValue('specialty', v);
                  form.setValue('providerId', '');
                  form.setValue(
                    'visitType',
                    v === 'Telemedicine' ? 'telemedicine' : 'in_person',
                  );
                }}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visit type</Label>
              <Input
                value={(watch.visitType ?? 'in_person').replaceAll('_', ' ')}
                readOnly
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="providerId">Provider</Label>
            <Select
              value={selectValue(watch.providerId)}
              onValueChange={(v) => form.setValue('providerId', v)}
            >
              <SelectTrigger id="providerId">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                    {p.specialty ? ` — ${p.specialty}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {providersQuery.isLoading ? (
              <p className="text-xs text-muted-foreground">
                Loading providers…
              </p>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <Label htmlFor="facilityId">Facility</Label>
            <Select
              value={selectValue(watch.facilityId)}
              onValueChange={(v) => form.setValue('facilityId', v)}
            >
              <SelectTrigger id="facilityId">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {facilitiesQuery.isLoading ? (
              <p className="text-xs text-muted-foreground">
                Loading facilities…
              </p>
            ) : null}
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
            <div
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              role="listbox"
              aria-label="Time slots"
            >
              {(slotsQuery.data ?? []).map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  role="option"
                  aria-selected={watch.scheduledAt === slot.start}
                  className={cn(
                    'rounded-md border px-2 py-2 text-sm hover:bg-muted',
                    watch.scheduledAt === slot.start &&
                      'border-primary bg-primary/10',
                  )}
                  onClick={() => form.setValue('scheduledAt', slot.start)}
                >
                  {format(new Date(slot.start), 'HH:mm')}
                </button>
              ))}
            </div>
          </div>
        );
      case 7: {
        const patient = patients.find((p) => p.patientId === watch.patientId);
        const provider = providers.find((p) => p.id === watch.providerId);
        const facility = facilities.find((f) => f.id === watch.facilityId);
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
                <p>
                  <strong>Patient:</strong> {patient?.fullName ?? watch.patientId}
                </p>
                <p>
                  <strong>Provider:</strong> {provider?.name ?? watch.providerId}
                </p>
                <p>
                  <strong>Facility:</strong>{' '}
                  {facility?.name ?? watch.facilityId}
                </p>
                <p>
                  <strong>When:</strong>{' '}
                  {watch.scheduledAt
                    ? format(new Date(watch.scheduledAt), 'PPp')
                    : '—'}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }
      default:
        return (
          <p className="text-success font-medium">
            Appointment booked successfully!
          </p>
        );
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
    <div
      className="grid grid-cols-4 gap-2"
      role="listbox"
      aria-label="Available time slots"
    >
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
