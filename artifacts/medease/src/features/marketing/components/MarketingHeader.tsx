import { ArrowRight, Menu } from 'lucide-react';
import { Link, useLocation } from 'wouter';

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
  const cta = useMarketingCtaOptional();
  const [location] = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/90 backdrop-blur-xl"
      aria-label="Navigation marketing"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2.5 font-semibold">
          <img
            src={marketingAssets.logoMark}
            alt=""
            className="h-9 w-9 rounded-xl shadow-sm"
          />
          <span className="text-xl tracking-tight text-[#072a47]">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-0.5 text-sm font-medium text-[#1a445f]/75 xl:flex">
          {landingNav.map((link) =>
            link.kind === 'route' ? (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 transition-colors hover:bg-muted hover:text-[#072a47]',
                  location === link.href && 'bg-[#0b8f9e]/10 text-[#0b8f9e]',
                )}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2.5 py-2 transition-colors hover:bg-muted hover:text-[#072a47]"
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
              <DropdownMenuItem
                onClick={() => cta?.openCta('hub')}
                className="font-medium text-[#0b8f9e]"
              >
                Explorer le Hub
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="marketing-primary-cta h-10 rounded-full px-5 text-sm"
            onClick={() => cta?.openCta('hub')}
          >
            Explorer le Hub
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
