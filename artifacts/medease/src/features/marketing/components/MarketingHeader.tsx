import { Link, useLocation } from 'wouter';
import { Moon, Sun, Monitor, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMarketingCtaOptional } from '@/features/marketing/components/MarketingCtaProvider';
import { landingNav } from '@/features/marketing/content/landing-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

export function MarketingHeader() {
  const { setTheme } = useTheme();
  const cta = useMarketingCtaOptional();
  const [location] = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl"
      aria-label="Navigation marketing"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2.5 font-semibold">
          <img
            src={marketingAssets.logoMark}
            alt=""
            className="h-9 w-9 rounded-xl shadow-sm"
          />
          <span className="text-xl tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-0.5 text-sm font-medium text-muted-foreground xl:flex">
          {landingNav.map((link) =>
            link.kind === 'route' ? (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 transition-colors hover:bg-muted hover:text-foreground',
                  location === link.href && 'bg-primary/10 text-primary',
                )}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2.5 py-2 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {landingNav.map((link) =>
                link.kind === 'route' ? (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={link.href} asChild>
                    <a href={link.href}>{link.label}</a>
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
            className="marketing-primary-cta hidden md:inline-flex"
            onClick={() => cta?.openCta('hub')}
          >
            Contact
          </Button>
        </div>
      </div>
    </nav>
  );
}
