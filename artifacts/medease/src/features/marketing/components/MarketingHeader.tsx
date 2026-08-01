import { Link } from 'wouter';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMarketingCtaOptional } from '@/features/marketing/components/MarketingCtaProvider';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

const navLinks = [
  { href: '#solution', label: 'Solution' },
  { href: '#foundations', label: 'Fondations' },
  { href: '#impact', label: 'Impact' },
  { href: '#faq', label: 'FAQ' },
  { href: '#security', label: 'Sécurité' },
];

export function MarketingHeader() {
  const { setTheme } = useTheme();
  const cta = useMarketingCtaOptional();

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
      aria-label="Navigation marketing"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-serif text-lg font-bold italic leading-none">M</span>
          </div>
          <span className="text-xl tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center space-x-6 text-sm font-medium text-muted-foreground lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Thème">
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="hidden h-4 w-4 dark:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" /> Clair
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" /> Sombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" /> Système
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href={ROUTES.connexion}>Connexion</Link>
          </Button>
          <Button
            className="hidden md:inline-flex"
            onClick={() => cta?.openCta('hub')}
          >
            Explorer le Hub
          </Button>
        </div>
      </div>
    </nav>
  );
}
