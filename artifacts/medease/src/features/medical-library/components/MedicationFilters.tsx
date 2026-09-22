import { useMemo } from 'react';

import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { resolveSelectValue } from '@/shared/ui/select-utils';
import { Switch } from '@/shared/ui/switch';
import { FilterPanel } from '@/shared/components';
import type {
  MedicationCategory,
  MedicationSort,
} from '@/services/medical-library/medical-library.types';
import { MEDICATION_CATEGORY_LABELS } from '@/services/medical-library';

interface MedicationFiltersProps {
  therapeuticClass: string;
  category: MedicationCategory | 'all';
  sort: MedicationSort;
  favoritesOnly: boolean;
  overTheCounter: boolean;
  pediatric: boolean;
  geriatric: boolean;
  facets?: {
    therapeuticClasses: string[];
    categories: MedicationCategory[];
  };
  activeCount: number;
  onTherapeuticClassChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: MedicationSort) => void;
  onFavoritesChange: (value: boolean) => void;
  onOverTheCounterChange: (value: boolean) => void;
  onPediatricChange: (value: boolean) => void;
  onGeriatricChange: (value: boolean) => void;
}

const SORT_OPTIONS: { label: string; value: MedicationSort }[] = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Most searched', value: 'most_searched' },
  { label: 'Recently updated', value: 'updated' },
  { label: 'Therapeutic class', value: 'therapeutic_class' },
  { label: 'Manufacturer', value: 'manufacturer' },
];

export function MedicationFilters({
  therapeuticClass,
  category,
  sort,
  favoritesOnly,
  overTheCounter,
  pediatric,
  geriatric,
  facets,
  activeCount,
  onTherapeuticClassChange,
  onCategoryChange,
  onSortChange,
  onFavoritesChange,
  onOverTheCounterChange,
  onPediatricChange,
  onGeriatricChange,
}: MedicationFiltersProps) {
  const categoryOptions = useMemo(() => {
    const options = new Set<string>(['all']);
    for (const item of facets?.categories ??
      (Object.keys(MEDICATION_CATEGORY_LABELS) as MedicationCategory[])) {
      options.add(item);
    }
    if (category !== 'all') {
      options.add(category);
    }
    return [...options];
  }, [category, facets?.categories]);

  const therapeuticClassOptions = useMemo(() => {
    const options = new Set<string>(['all']);
    for (const item of facets?.therapeuticClasses ?? []) {
      options.add(item);
    }
    if (therapeuticClass) {
      options.add(therapeuticClass);
    }
    return [...options];
  }, [facets?.therapeuticClasses, therapeuticClass]);

  const sortOptions = useMemo(
    () => SORT_OPTIONS.map((option) => option.value),
    [],
  );

  const categoryValue = resolveSelectValue(category, categoryOptions, 'all');
  const therapeuticClassValue = resolveSelectValue(
    therapeuticClass || 'all',
    therapeuticClassOptions,
    'all',
  );
  const sortValue = resolveSelectValue(sort, sortOptions, 'alphabetical');

  return (
    <FilterPanel activeCount={activeCount}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="med-category">Category</Label>
          <Select value={categoryValue} onValueChange={onCategoryChange}>
            <SelectTrigger id="med-category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent portalled={false}>
              {categoryOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === 'all'
                    ? 'All categories'
                    : (MEDICATION_CATEGORY_LABELS[item as MedicationCategory] ??
                      item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="med-sort">Sort by</Label>
          <Select
            value={sortValue}
            onValueChange={(v) => onSortChange(v as MedicationSort)}
          >
            <SelectTrigger id="med-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent portalled={false}>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="med-class">Therapeutic class</Label>
          <Select
            value={therapeuticClassValue}
            onValueChange={(v) =>
              onTherapeuticClassChange(v === 'all' ? '' : v)
            }
          >
            <SelectTrigger id="med-class">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent portalled={false}>
              {therapeuticClassOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === 'all' ? 'All classes' : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="fav-only">Favorites only</Label>
          <Switch
            id="fav-only"
            checked={favoritesOnly}
            onCheckedChange={onFavoritesChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="otc-only">Over-the-counter only</Label>
          <Switch
            id="otc-only"
            checked={overTheCounter}
            onCheckedChange={onOverTheCounterChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="pediatric">Pediatric approved</Label>
          <Switch
            id="pediatric"
            checked={pediatric}
            onCheckedChange={onPediatricChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="geriatric">Geriatric approved</Label>
          <Switch
            id="geriatric"
            checked={geriatric}
            onCheckedChange={onGeriatricChange}
          />
        </div>
      </div>
    </FilterPanel>
  );
}
