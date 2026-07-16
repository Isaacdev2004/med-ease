import { env } from '@/config/env';
import { getRoleForPortal } from '@/config/permissions/portal-roles';
import { PORTAL_PATHS, type PortalId } from '@/config/routes';
import { useAuth } from '@/services/auth/auth-context';
import { useLocation } from 'wouter';

interface RoleSwitcherProps {
  className?: string;
}

export function RoleSwitcher({ className }: RoleSwitcherProps) {
  const [location, setLocation] = useLocation();
  const { switchRole } = useAuth();

  if (!env.isDev) {
    return null;
  }

  const currentPortal =
    location.split('/')[1] ? `/${location.split('/')[1]}` : PORTAL_PATHS.patient;

  async function handleChange(nextPortal: string) {
    const portalId = nextPortal.replace(/^\//, '') as PortalId;
    const role = getRoleForPortal(portalId);
    const path = await switchRole(role);
    setLocation(path);
  }

  return (
    <div className={className}>
      <p className="text-xs mb-2 text-sidebar-foreground/50 font-medium uppercase tracking-wider">
        Dev Role Switcher
      </p>
      <select
        className="w-full text-xs bg-sidebar-accent border border-sidebar-border rounded-md p-2"
        onChange={(e) => void handleChange(e.target.value)}
        value={currentPortal}
        aria-label="Development role switcher"
      >
        {(Object.entries(PORTAL_PATHS) as [PortalId, string][]).map(
          ([id, path]) => (
            <option key={id} value={path}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </option>
          ),
        )}
      </select>
    </div>
  );
}
