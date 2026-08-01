import { Link } from 'wouter';

import { audienceNavLinks } from '@/features/marketing/content/audience-pages-fr';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';

const footerLinks = [
  { href: ROUTES.help, label: "Centre d'aide" },
  { href: ROUTES.contact, label: 'Contact' },
  { href: ROUTES.privacy, label: 'Confidentialité' },
  { href: ROUTES.terms, label: 'Conditions' },
];

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <span className="font-serif text-xs font-bold italic leading-none">
                  M
                </span>
              </div>
              <span className="font-semibold">{APP_NAME}</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Le hub de coordination territoriale qui reconnecte la ville et
              l&apos;hôpital.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Découvrir Med&apos;ease</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {audienceNavLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 border-t pt-8 text-sm text-muted-foreground md:justify-start">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/60 md:text-left">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
