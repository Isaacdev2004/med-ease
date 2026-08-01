import { Link, useLocation } from 'wouter';
import { Moon, Sun, Monitor, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMarketingCtaOptional } from '@/features/marketing/components/MarketingCtaProvider';
import { audienceNavLinks } from '@/features/marketing/content/audience-pages-fr';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

const homeAnchorLinks = [
  { href: '/#solution', label: 'Solution' },
  { href: '/#foundations', label: 'Fondations' },
  { href: '/#impact', label: 'Impact' },
  { href: '/#faq', label: 'FAQ' },
];

export function MarketingHeader() {
  const { setTheme } = useTheme();
  const cta = useMarketingCtaOptional();
  const [location] = useLocation();
  const isHome = location === ROUTES.home;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl"
      aria-label="Navigation marketing"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2.5 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="font-serif text-lg font-bold italic leading-none">M</span>
          </div>
          <span className="text-xl tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium text-muted-foreground xl:flex">
          {isHome
            ? homeAnchorLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))
            : null}
          {audienceNavLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground',
                location === link.path && 'bg-primary/10 text-primary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {audienceNavLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link href={link.path}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {homeAnchorLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a href={link.href}>{link.label}</a>
                </DropdownMenuItem>
              ))}
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
            className="hidden md:inline-flex shadow-sm"
            onClick={() => cta?.openCta('hub')}
          >
            Explorer le Hub
          </Button>
        </div>
      </div>
    </nav>
  );
}
