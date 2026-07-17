import { useEffect, useState } from 'react';

import { SearchBar } from '@/shared/components';
import {
  medicalLibraryService,
  RECENT_MEDICATION_SEARCHES_KEY,
} from '@/services/medical-library';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface MedicationSearchProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  className?: string;
}

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_MEDICATION_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (!query.trim()) return;
  const recent = loadRecent().filter((item) => item !== query);
  recent.unshift(query);
  localStorage.setItem(
    RECENT_MEDICATION_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, 8)),
  );
}

export function MedicationSearch({
  defaultValue = '',
  onSearch,
  loading,
  className,
}: MedicationSearchProps) {
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const suggestions = defaultValue
    ? medicalLibraryService.getSuggestions(defaultValue)
    : [];
  const popular = medicalLibraryService.getPopularMedications();

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  function handleSearch(value: string) {
    onSearch(value);
    if (value.trim()) {
      saveRecent(value.trim());
      setRecent(loadRecent());
    }
  }

  function apply(value: string) {
    onSearch(value);
    saveRecent(value);
    setRecent(loadRecent());
    setFocused(false);
  }

  return (
    <div
      className={cn('relative', className)}
      onFocus={() => setFocused(true)}
      onBlur={() => setTimeout(() => setFocused(false), 150)}
    >
      <SearchBar
        defaultValue={defaultValue}
        onSearch={handleSearch}
        placeholder="Search medications by name, brand, ingredient, ATC…"
        loading={loading}
        aria-label="Search medical library"
      />
      {focused ? (
        <div
          className="absolute z-20 mt-2 w-full rounded-lg border bg-popover p-3 shadow-md"
          role="listbox"
        >
          {suggestions.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => apply(item)}
                  >
                    <Badge variant="secondary">{item}</Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {recent.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Recent
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => apply(item)}
                  >
                    <Badge variant="outline">{item}</Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Popular
            </p>
            <div className="flex flex-wrap gap-2">
              {popular.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => apply(item)}
                >
                  <Badge variant="outline">{item}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
