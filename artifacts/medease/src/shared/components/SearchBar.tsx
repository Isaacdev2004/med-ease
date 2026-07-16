import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SEARCH_DEBOUNCE_MS } from '@/services/api/cache-config';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** Debounced search input with clear button, loading state, and keyboard shortcut (/). */
export function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = 'Search…',
  debounceMs = SEARCH_DEBOUNCE_MS,
  loading,
  className,
  'aria-label': ariaLabel = 'Search',
}: SearchBarProps) {
  const [input, setInput] = useState(defaultValue);
  const debounced = useDebouncedValue(input, debounceMs);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        document.getElementById('medease-search-input')?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn('relative', className)}>
      {loading ? (
        <Loader2
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <Input
        id="medease-search-input"
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label={ariaLabel}
      />
      {input ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-9"
          onClick={() => setInput('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
