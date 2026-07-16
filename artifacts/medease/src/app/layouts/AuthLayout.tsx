import { Link } from 'wouter';
import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

/** Authentication layout — centered form, split welcome panel on desktop. */
export function AuthLayout({
  children,
  title = `Welcome to ${APP_NAME}`,
  subtitle = 'Secure access to the enterprise healthcare network.',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
            <span className="font-serif italic text-xl font-bold leading-none">M</span>
          </div>
          <span className="text-2xl">{APP_NAME}</span>
        </Link>

        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight">
            Healthcare coordination, synchronized.
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            One secure platform connecting patients, professionals, facilities,
            pharmacies, and transport providers.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium bg-primary-foreground/10 rounded-full px-4 py-2 w-fit">
            <Shield className="h-4 w-4" />
            HIPAA Compliant · SOC2 Type II
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          Need help?{' '}
          <a href="#" className="underline underline-offset-4 hover:text-primary-foreground">
            Contact support
          </a>
        </p>
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
        <div className="mb-8 flex lg:hidden items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="font-serif italic text-xl font-bold leading-none">M</span>
          </div>
          <span className="text-xl font-semibold">{APP_NAME}</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
