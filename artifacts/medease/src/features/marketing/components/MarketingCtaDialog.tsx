import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ctaForms,
  type CtaField,
  type CtaFormId,
} from '@/features/marketing/content/cta-forms';
import { ctaConfirmationMessage } from '@/features/marketing/content/landing-fr';
import { submitMarketingLead } from '@/features/marketing/services/leads.service';
import { LoadingButton } from '@/shared/components/LoadingButton';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Textarea } from '@/shared/ui/textarea';

interface MarketingCtaDialogProps {
  ctaId: CtaFormId | null;
  onClose: () => void;
}

type FormValues = Record<string, string | string[]>;

function defaultValues(fields: CtaField[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.name] = field.type === 'checkbox' ? [] : '';
    return acc;
  }, {});
}

function validateFields(fields: CtaField[], values: FormValues): string | null {
  for (const field of fields) {
    const value = values[field.name];
    if (!field.required) continue;

    if (field.type === 'checkbox') {
      if (!Array.isArray(value) || value.length === 0) {
        return `${field.label} est requis.`;
      }
      continue;
    }

    if (typeof value !== 'string' || !value.trim()) {
      return `${field.label} est requis.`;
    }
  }
  return null;
}

function FieldControl({
  field,
  values,
  setValue,
}: {
  field: CtaField;
  values: FormValues;
  setValue: (name: string, value: string | string[]) => void;
}) {
  const value = values[field.name];

  if (field.type === 'textarea') {
    return (
      <Textarea
        id={field.name}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder}
        onChange={(event) => setValue(field.name, event.target.value)}
        rows={4}
      />
    );
  }

  if (field.type === 'radio' && field.options) {
    return (
      <RadioGroup
        value={typeof value === 'string' ? value : ''}
        onValueChange={(next) => setValue(field.name, next)}
        className="grid gap-2"
      >
        {field.options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              id={`${field.name}-${option.value}`}
              value={option.value}
            />
            <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  if (field.type === 'checkbox' && field.options) {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="grid gap-2">
        {field.options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`${field.name}-${option.value}`}
                checked={checked}
                onCheckedChange={(next) => {
                  const nextSelected = next
                    ? [...selected, option.value]
                    : selected.filter((item) => item !== option.value);
                  setValue(field.name, nextSelected);
                }}
              />
              <Label htmlFor={`${field.name}-${option.value}`}>
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Input
      id={field.name}
      type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
      value={typeof value === 'string' ? value : ''}
      placeholder={field.placeholder}
      onChange={(event) => setValue(field.name, event.target.value)}
    />
  );
}

export function MarketingCtaDialog({ ctaId, onClose }: MarketingCtaDialogProps) {
  const config = ctaId ? ctaForms[ctaId] : null;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: config ? defaultValues(config.fields) : {},
  });

  useEffect(() => {
    if (!config) return;
    form.reset(defaultValues(config.fields));
    setSubmitted(false);
    setError(null);
  }, [config, form]);

  const values = form.watch();

  const fieldNodes = useMemo(() => {
    if (!config) return null;
    return config.fields.map((field) => (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required ? ' *' : ''}
        </Label>
        <FieldControl
          field={field}
          values={values}
          setValue={(name, value) => form.setValue(name, value)}
        />
      </div>
    ));
  }, [config, form, values]);

  if (!config) {
    return null;
  }

  async function handleSubmit() {
    const validationError = validateFields(config!.fields, values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitMarketingLead({ ctaId: config!.id, fields: values });
      setSubmitted(true);
    } catch {
      setError('Impossible d\'envoyer votre demande pour le moment. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={Boolean(ctaId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Bienvenue dans l&apos;expérience Med&apos;ease</DialogTitle>
              <DialogDescription>{ctaConfirmationMessage}</DialogDescription>
            </DialogHeader>
            <Button onClick={onClose} className="mt-4">
              Fermer
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{config.title}</DialogTitle>
              {config.subtitle ? (
                <DialogDescription>{config.subtitle}</DialogDescription>
              ) : null}
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
            >
              {fieldNodes}
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <LoadingButton type="submit" loading={submitting} className="w-full">
                {config.submitLabel}
              </LoadingButton>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
