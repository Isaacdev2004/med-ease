import { format } from 'date-fns';
import { CalendarIcon, Eye, EyeOff, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';

type BaseFieldProps<T extends FieldValues> = {
  control: T extends FieldValues ? import('react-hook-form').Control<T> : never;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  readOnly,
  required,
  className,
  type = 'text',
}: BaseFieldProps<T> & { type?: React.HTMLInputTypeAttribute }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? (
              <span className="text-destructive ml-0.5">*</span>
            ) : null}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              value={field.value ?? ''}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  readOnly,
  required,
  className,
  maxLength,
}: BaseFieldProps<T> & { maxLength?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? (
              <span className="text-destructive ml-0.5">*</span>
            ) : null}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              value={field.value ?? ''}
            />
          </FormControl>
          {maxLength ? (
            <p className="text-xs text-muted-foreground text-right">
              {field.value?.length ?? 0}/{maxLength}
            </p>
          ) : null}
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  className,
}: BaseFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? (
              <span className="text-destructive ml-0.5">*</span>
            ) : null}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={visible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10"
                value={field.value ?? ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SelectOption {
  label: string;
  value: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = 'Select an option',
  disabled,
  required,
  className,
  options,
}: BaseFieldProps<T> & { options: SelectOption[] }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? (
              <span className="text-destructive ml-0.5">*</span>
            ) : null}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
}: BaseFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-start space-x-3 space-y-0',
            className,
          )}
        >
          <FormControl>
            <Checkbox
              checked={field.value === true}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
}: BaseFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          <FormLabel>
            {label}
            {required ? (
              <span className="text-destructive ml-0.5">*</span>
            ) : null}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FileUploadFieldProps<
  T extends FieldValues,
> extends BaseFieldProps<T> {
  accept?: string;
  maxSizeMb?: number;
}

function resolveUploadedFile(value: unknown): File | null {
  if (value instanceof FileList) return value[0] ?? null;
  if (value instanceof File) return value;
  return null;
}

export function FileUploadField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  accept = '.pdf,.jpg,.jpeg,.png',
}: FileUploadFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => {
        const resolved = resolveUploadedFile(value);

        return (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required ? (
                <span className="text-destructive ml-0.5">*</span>
              ) : null}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <label
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50',
                    disabled && 'pointer-events-none opacity-50',
                  )}
                >
                  <Upload
                    className="h-8 w-8 text-muted-foreground mb-2"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PDF, JPEG, or PNG up to 10 MB
                  </span>
                  <Input
                    {...field}
                    type="file"
                    accept={accept}
                    disabled={disabled}
                    className="sr-only"
                    onChange={(event) => onChange(event.target.files)}
                  />
                </label>
                {resolved ? (
                  <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span className="truncate">{resolved.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove file"
                      onClick={() => onChange(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
