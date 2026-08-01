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
    <footer className="marketing-footer-dark py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-serif text-sm font-bold italic leading-none">
                  M
                </span>
              </div>
              <span className="text-lg font-semibold text-white">{APP_NAME}</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Le hub de coordination territoriale qui reconnecte la ville et
              l&apos;hôpital — pour un parcours de soins plus fluide, plus humain
              et mieux coordonné.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white">Découvrir Med&apos;ease</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {audienceNavLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés. · Hébergement
          HDS · Conformité RGPD
        </p>
      </div>
    </footer>
  );
}
