import { useEffect, useState } from 'react';

import { SearchBar } from '@/shared/components';
import { directoryService } from '@/services/directory/directory.service';
import { RECENT_SEARCHES_KEY } from '@/services/directory/directory.mapper';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface DirectorySearchProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  className?: string;
}

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (!query.trim()) return;
  const recent = loadRecentSearches().filter((item) => item !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 8)));
}

/** Directory search with suggestions, recent searches, and popular searches. */
export function DirectorySearch({
  defaultValue = '',
  onSearch,
  loading,
  className,
}: DirectorySearchProps) {
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const suggestions = defaultValue ? directoryService.getSuggestions(defaultValue) : [];
  const popular = directoryService.getPopularSearches();

  useEffect(() => {
    setRecent(loadRecentSearches());
  }, []);

  function handleSearch(value: string) {
    onSearch(value);
    if (value.trim()) {
      saveRecentSearch(value.trim());
      setRecent(loadRecentSearches());
    }
  }

  function applySuggestion(value: string) {
    onSearch(value);
    saveRecentSearch(value);
    setRecent(loadRecentSearches());
    setFocused(false);
  }

  const showPanel = focused;

  return (
    <div className={cn('relative', className)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}>
      <SearchBar
        defaultValue={defaultValue}
        onSearch={handleSearch}
        placeholder="Search professionals, facilities, pharmacies…"
        loading={loading}
        aria-label="Search healthcare directory"
      />
      {showPanel ? (
        <div
          className="absolute z-20 mt-2 w-full rounded-lg border bg-popover p-3 shadow-md"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="text-left"
                    onMouseDown={() => applySuggestion(item)}
                  >
                    <Badge variant="secondary">{item}</Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {recent.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Recent</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="text-left"
                    onMouseDown={() => applySuggestion(item)}
                  >
                    <Badge variant="outline">{item}</Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Popular</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="text-left"
                  onMouseDown={() => applySuggestion(item)}
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
