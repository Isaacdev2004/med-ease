import {
  HelpCircle,
  Keyboard,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, useLocation } from 'wouter';

import { PORTAL_PATHS, ROUTES } from '@/config/routes';
import { getPortalForRole } from '@/config/permissions/portal-roles';
import { useAuth } from '@/services/auth/auth-context';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/shared/ui/dropdown-menu';

interface UserMenuProps {
  userName: string;
  roleName: string;
  organization?: string;
}

function resolvePortalBase(pathname: string, role?: string): string {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (
    segment === 'patient' ||
    segment === 'professional' ||
    segment === 'facility' ||
    segment === 'admin' ||
    segment === 'pharmacy' ||
    segment === 'transport'
  ) {
    return `/${segment}`;
  }
  if (role) {
    const portalId = getPortalForRole(role as never);
    return PORTAL_PATHS[portalId] ?? '/patient';
  }
  return '/patient';
}

export function UserMenu({ userName, roleName, organization }: UserMenuProps) {
  const { setTheme } = useTheme();
  const { organization: authOrg, user, logout } = useAuth();
  const [location] = useLocation();
  const portalBase = resolvePortalBase(location, user?.role);
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const orgLabel = organization ?? authOrg?.name ?? "Med'ease Network";
  const profileHref =
    portalBase === '/patient'
      ? `${portalBase}/records/profile`
      : `${portalBase}/profile`;
  const settingsHref = `${portalBase}/settings`;
  const helpHref = '/help';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
          aria-label="Menu utilisateur"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {roleName}
            </p>
            <p className="text-xs leading-none text-muted-foreground pt-1">
              {orgLabel}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref}>
            <User className="mr-2 h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={settingsHref}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={helpHref}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Keyboard className="mr-2 h-4 w-4" />
          Raccourcis clavier
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4 dark:hidden" />
            <Moon className="mr-2 h-4 w-4 hidden dark:block" />
            Thème
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Clair
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Sombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                Système
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          asChild
        >
          <Link
            href={ROUTES.logout}
            onClick={() => {
              void logout?.();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
