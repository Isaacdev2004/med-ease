import { SearchBar } from '@/shared/components/SearchBar';

interface NotificationSearchProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function NotificationSearch({
  defaultValue,
  onSearch,
  loading,
}: NotificationSearchProps) {
  return (
    <SearchBar
      defaultValue={defaultValue}
      onSearch={onSearch}
      placeholder="Search notifications…"
      loading={loading}
      aria-label="Search notifications"
    />
  );
}
