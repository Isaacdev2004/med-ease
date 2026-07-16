import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/shared/ui/command';
import { useGlobalSearchShortcut } from '@/shared/hooks/use-global-search';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_ITEMS = [
  { label: 'Patients', group: 'Navigate' },
  { label: 'Facilities', group: 'Navigate' },
  { label: 'Healthcare Professionals', group: 'Navigate' },
  { label: 'Medications', group: 'Navigate' },
  { label: 'Transfers', group: 'Navigate' },
  { label: 'Appointments', group: 'Navigate' },
  { label: 'Bed Availability', group: 'Navigate' },
  { label: 'Go to Dashboard', group: 'Commands' },
  { label: 'Open Settings', group: 'Commands' },
];

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  useGlobalSearchShortcut(() => onOpenChange(true));

  const groups = ['Navigate', 'Commands'] as const;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search patients, medications, commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, groupIndex) => (
          <div key={group}>
            {groupIndex > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group}>
              {SEARCH_ITEMS.filter((item) => item.group === group).map(
                (item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => onOpenChange(false)}
                  >
                    {item.label}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
