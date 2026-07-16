import { offlineMutationQueue } from '@/services/api/offline-queue';
import {
  transferRequestSchema,
  transferStepFields,
  transferWizardSteps,
  type TransferRequestFormValues,
} from '@/features/transport/validation/transfer.schema';
import {
  AutosaveIndicator,
  DateField,
  FileUploadField,
  FormFieldGroup,
  FormSection,
  FormWizard,
  SelectField,
  TextField,
  TextareaField,
  UnsavedChangesDialog,
  useAutosave,
  useFormDraft,
  useFormSubmit,
  useUnsavedChanges,
  useZodForm,
} from '@/shared/forms';

const DRAFT_KEY = 'transfer-request-demo';

const URGENCY_OPTIONS = [
  { label: 'Routine', value: 'routine' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Critical', value: 'critical' },
];

/** Multi-step transfer request wizard demonstrating Doc 03.8 patterns. */
export function TransferRequestWizardDemo() {
  const form = useZodForm<TransferRequestFormValues>(transferRequestSchema, {
    patientName: '',
    patientId: '',
    originFacility: '',
    destinationFacility: '',
    urgency: 'routine',
    clinicalSummary: '',
    contactPhone: '',
    requestedDate: undefined,
    referralDocument: null,
  });

  useFormDraft({ form, draftKey: DRAFT_KEY });
  const { status, saveDraft, clearDraft } = useAutosave({
    form,
    draftKey: DRAFT_KEY,
    enabled: form.formState.isDirty,
  });

  const unsaved = useUnsavedChanges({
    isDirty: form.formState.isDirty,
    onSaveDraft: saveDraft,
  });

  const { submitting, handleSubmit } = useFormSubmit<TransferRequestFormValues>({
    successMessage: 'Transfer request submitted successfully.',
    errorMessage: 'Unable to submit transfer request.',
    onSubmit: async (values) => {
      const submit = async () => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        console.info('[transfer-demo] submitted', values);
      };

      if (!navigator.onLine) {
        offlineMutationQueue.enqueue({
          label: 'Transfer request',
          execute: submit,
        });
        return;
      }

      await submit();
      clearDraft();
    },
  });

  async function validateStep(stepIndex: number) {
    const fields = transferStepFields[stepIndex];
    if (fields.length === 0) return true;
    return form.trigger(fields);
  }

  function renderStep(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <FormSection title="Patient Information" description="Identify the patient being transferred.">
            <FormFieldGroup columns={2}>
              <TextField control={form.control} name="patientName" label="Patient Name" required />
              <TextField control={form.control} name="patientId" label="Patient ID" required />
            </FormFieldGroup>
            <TextField control={form.control} name="contactPhone" label="Contact Phone" required />
          </FormSection>
        );
      case 1:
        return (
          <FormSection title="Facilities" description="Select origin and destination facilities.">
            <FormFieldGroup columns={2}>
              <TextField control={form.control} name="originFacility" label="Origin Facility" required />
              <TextField
                control={form.control}
                name="destinationFacility"
                label="Destination Facility"
                required
              />
            </FormFieldGroup>
            <DateField control={form.control} name="requestedDate" label="Requested Transfer Date" required />
          </FormSection>
        );
      case 2:
        return (
          <FormSection title="Clinical Details" description="Provide clinical context for the transfer team.">
            <SelectField
              control={form.control}
              name="urgency"
              label="Urgency Level"
              options={URGENCY_OPTIONS}
              required
            />
            <TextareaField
              control={form.control}
              name="clinicalSummary"
              label="Clinical Summary"
              placeholder="Brief clinical summary for receiving facility…"
              required
              maxLength={2000}
            />
            <FileUploadField
              control={form.control}
              name="referralDocument"
              label="Referral Document (optional)"
              description="Attach referral letter or supporting documentation."
            />
          </FormSection>
        );
      default: {
        const values = form.getValues();
        return (
          <FormSection title="Review" description="Confirm details before submitting.">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Patient</dt><dd className="font-medium">{values.patientName}</dd></div>
              <div><dt className="text-muted-foreground">Patient ID</dt><dd className="font-medium">{values.patientId}</dd></div>
              <div><dt className="text-muted-foreground">Origin</dt><dd className="font-medium">{values.originFacility}</dd></div>
              <div><dt className="text-muted-foreground">Destination</dt><dd className="font-medium">{values.destinationFacility}</dd></div>
              <div><dt className="text-muted-foreground">Urgency</dt><dd className="font-medium capitalize">{values.urgency}</dd></div>
              <div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{values.contactPhone}</dd></div>
            </dl>
            <p className="text-sm mt-4"><span className="text-muted-foreground">Summary: </span>{values.clinicalSummary}</p>
          </FormSection>
        );
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Multi-step wizard with autosave, draft recovery, and offline queue support.
        </p>
        <AutosaveIndicator status={status} />
      </div>

      <FormWizard
        form={form}
        steps={[...transferWizardSteps]}
        renderStep={renderStep}
        validateStep={validateStep}
        submitting={submitting}
        onComplete={(values) => handleSubmit(values)}
      />

      <UnsavedChangesDialog
        open={unsaved.dialogOpen}
        onStay={unsaved.stay}
        onLeave={unsaved.leave}
        onSaveDraft={unsaved.saveDraftAndLeave}
      />
    </div>
  );
}
