import { Link } from 'wouter';
import { Moon, Sun, Monitor } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from 'next-themes';

import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface MarketingLayoutProps {
  children: ReactNode;
}

/** Public website layout — marketing pages without dashboard shell. */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
        aria-label="Marketing navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 font-semibold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-serif italic text-lg font-bold leading-none">
                M
              </span>
            </div>
            <span className="text-xl tracking-tight">{APP_NAME}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Platform
            </a>
            <a
              href="#solutions"
              className="hover:text-foreground transition-colors"
            >
              Solutions
            </a>
            <a
              href="#security"
              className="hover:text-foreground transition-colors"
            >
              Security
            </a>
            <Link
              href={ROUTES.designSystem}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Design System
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Theme">
                  <Sun className="h-4 w-4 dark:hidden" />
                  <Moon className="h-4 w-4 hidden dark:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href={ROUTES.login}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.register}>Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>

      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="font-serif italic text-xs font-bold leading-none">
                M
              </span>
            </div>
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            The foundation for modern healthcare coordination.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {APP_NAME} Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
