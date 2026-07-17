import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
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
  return (
    <FilterPanel activeCount={activeCount}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="med-category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="med-category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(
                facets?.categories ?? Object.keys(MEDICATION_CATEGORY_LABELS)
              ).map((item) => (
                <SelectItem key={item} value={item}>
                  {MEDICATION_CATEGORY_LABELS[item as MedicationCategory] ??
                    item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="med-sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(v) => onSortChange(v as MedicationSort)}
          >
            <SelectTrigger id="med-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            value={therapeuticClass || 'all'}
            onValueChange={(v) =>
              onTherapeuticClassChange(v === 'all' ? '' : v)
            }
          >
            <SelectTrigger id="med-class">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {(facets?.therapeuticClasses ?? []).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
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
