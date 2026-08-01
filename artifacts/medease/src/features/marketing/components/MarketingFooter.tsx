import { Link } from 'wouter';

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
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
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

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
