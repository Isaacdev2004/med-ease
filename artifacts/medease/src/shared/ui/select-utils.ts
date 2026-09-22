/** Radix Select requires the value to match a SelectItem — otherwise it can crash on reconcile. */
export function resolveSelectValue(
  value: string | undefined,
  options: readonly string[],
  fallback: string,
): string {
  const normalized = value?.trim() ? value.trim() : fallback;
  return options.includes(normalized) ? normalized : fallback;
}

/** Omit value when empty so Radix shows the placeholder instead of an invalid selection. */
export function optionalSelectValue(value: string | undefined): string | undefined {
  return value?.trim() ? value.trim() : undefined;
}
