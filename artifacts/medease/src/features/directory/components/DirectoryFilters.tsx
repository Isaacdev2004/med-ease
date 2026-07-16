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
import type { DirectorySort, ProviderType } from '@/services/directory/directory.types';

interface DirectoryFiltersProps {
  specialty: string;
  department: string;
  city: string;
  sort: DirectorySort;
  type: ProviderType | 'all';
  favoritesOnly: boolean;
  teleconsultation: boolean;
  emergency: boolean;
  openNow: boolean;
  facets?: {
    specialties: string[];
    departments: string[];
    cities: string[];
  };
  activeCount: number;
  onSpecialtyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSortChange: (value: DirectorySort) => void;
  onTypeChange: (value: string) => void;
  onFavoritesChange: (value: boolean) => void;
  onTeleconsultationChange: (value: boolean) => void;
  onEmergencyChange: (value: boolean) => void;
  onOpenNowChange: (value: boolean) => void;
}

const TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Professionals', value: 'professional' },
  { label: 'Facilities', value: 'facility' },
  { label: 'Pharmacies', value: 'pharmacy' },
  { label: 'Transport', value: 'transport' },
  { label: 'Nursing homes', value: 'nursing_home' },
  { label: 'Medical centers', value: 'medical_center' },
];

const SORT_OPTIONS: { label: string; value: DirectorySort }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Distance', value: 'distance' },
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Availability', value: 'availability' },
  { label: 'Recently updated', value: 'updated' },
];

export function DirectoryFilters({
  specialty,
  department,
  city,
  sort,
  type,
  favoritesOnly,
  teleconsultation,
  emergency,
  openNow,
  facets,
  activeCount,
  onSpecialtyChange,
  onDepartmentChange,
  onCityChange,
  onSortChange,
  onTypeChange,
  onFavoritesChange,
  onTeleconsultationChange,
  onEmergencyChange,
  onOpenNowChange,
}: DirectoryFiltersProps) {
  return (
    <FilterPanel activeCount={activeCount}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="directory-type">Provider type</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger id="directory-type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory-sort">Sort by</Label>
          <Select value={sort} onValueChange={(v) => onSortChange(v as DirectorySort)}>
            <SelectTrigger id="directory-sort">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory-specialty">Specialty</Label>
          <Select value={specialty || 'all'} onValueChange={(v) => onSpecialtyChange(v === 'all' ? '' : v)}>
            <SelectTrigger id="directory-specialty">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialties</SelectItem>
              {(facets?.specialties ?? []).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory-department">Department</Label>
          <Select value={department || 'all'} onValueChange={(v) => onDepartmentChange(v === 'all' ? '' : v)}>
            <SelectTrigger id="directory-department">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {(facets?.departments ?? []).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory-city">City</Label>
          <Select value={city || 'all'} onValueChange={(v) => onCityChange(v === 'all' ? '' : v)}>
            <SelectTrigger id="directory-city">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {(facets?.cities ?? []).map((item) => (
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
          <Label htmlFor="filter-favorites">Favorites only</Label>
          <Switch id="filter-favorites" checked={favoritesOnly} onCheckedChange={onFavoritesChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-tele">Teleconsultation</Label>
          <Switch id="filter-tele" checked={teleconsultation} onCheckedChange={onTeleconsultationChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-emergency">Emergency services</Label>
          <Switch id="filter-emergency" checked={emergency} onCheckedChange={onEmergencyChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-open">Open now</Label>
          <Switch id="filter-open" checked={openNow} onCheckedChange={onOpenNowChange} />
        </div>
      </div>
    </FilterPanel>
  );
}
