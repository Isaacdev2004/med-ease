import type {
  Currency,
  Language,
  Localization,
  Timezone,
} from '@/services/platform-admin/types';

export function formatLocale(locale: Localization): string {
  return `${locale.defaultLanguage}-${locale.defaultCurrency}-${locale.defaultTimezone}`;
}

export function validateTimezone(
  timezoneId: string,
  timezones: Timezone[],
): boolean {
  return timezones.some((t) => t.id === timezoneId && t.enabled);
}

export function enabledLanguageCount(languages: Language[]): number {
  return languages.filter((l) => l.enabled).length;
}

export function enabledCurrencyCount(currencies: Currency[]): number {
  return currencies.filter((c) => c.enabled).length;
}
