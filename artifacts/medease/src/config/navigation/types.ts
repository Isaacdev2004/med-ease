import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

export interface PortalConfig {
  id: string;
  roleName: string;
  userName: string;
  basePath: string;
  navigation: NavItem[];
}
