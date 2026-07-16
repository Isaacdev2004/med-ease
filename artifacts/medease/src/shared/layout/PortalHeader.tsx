import { Menu, Search } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { GlobalSearch } from '@/shared/layout/GlobalSearch';
import { LAYOUT } from '@/shared/layout/constants';
import { NotificationCenter } from '@/shared/layout/NotificationCenter';
import { UserMenu } from '@/shared/layout/UserMenu';
import { useDisclosure } from '@/shared/hooks/use-global-search';

interface PortalHeaderProps {
  userName: string;
  roleName: string;
  onMenuClick: () => void;
}

export function PortalHeader({
  userName,
  roleName,
  onMenuClick,
}: PortalHeaderProps) {
  const search = useDisclosure();

  return (
    <>
      <header
        className="sticky top-0 z-40 flex shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 lg:px-6"
        style={{ height: LAYOUT.headerHeight }}
        role="banner"
      >
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          className="hidden sm:flex flex-1 max-w-md justify-start text-muted-foreground h-9"
          onClick={search.onOpen}
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">Search everywhere...</span>
          <kbd className="ml-auto hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={search.onOpen}
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <NotificationCenter />
          <UserMenu userName={userName} roleName={roleName} />
        </div>
      </header>

      <GlobalSearch open={search.open} onOpenChange={search.setOpen} />
    </>
  );
}
