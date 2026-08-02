import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { trustSecurityPage } from '@/features/marketing/content/trust-security-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';

export function TrustSecurityPageView() {
  const page = trustSecurityPage;
  const { openCta } = useMarketingCta();

  useDocumentTitle(page.seo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', page.seo.description);
    }
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b8f9e] via-[#0b3d66] to-[#061a2b]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="marketing-reveal mx-auto max-w-3xl text-center">
            <h1 className="font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.1]">
              {page.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {page.hero.subtitle}
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 bg-white px-8 text-[#0b3d66] hover:bg-white/90"
              onClick={() => openCta(page.hero.ctaId)}
            >
              {page.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <figure className="marketing-reveal-delay mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40">
            <img
              src={marketingAssets.etablissementConfiance}
              alt="Souveraineté numérique et coffre-fort de données de santé"
              className="w-full object-cover object-bottom"
            />
          </figure>
        </div>
      </section>

      <section id="partenaires" className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {page.partners.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {page.partners.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {page.partners.items.map((partner) => (
              <div
                key={partner}
                className="flex min-h-[5.5rem] items-center justify-center rounded-2xl border border-border bg-card px-4 py-5 text-center text-sm font-semibold text-[#072a47] shadow-sm"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="piliers" className="border-y border-border/60 bg-muted/35 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {page.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 h-10 w-10 rounded-lg bg-[#0b8f9e]/15" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0b8f9e]">
                {pillar.title}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#072a47]">
                {pillar.headline}
              </h3>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {pillar.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#0b8f9e]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="souverainete"
        className="bg-[#061a2b] py-20 text-white md:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider">
            🇫🇷 FR
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {page.sovereignty.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            {page.sovereignty.body}
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.sovereignty.badges.map((badge) => (
              <div
                key={badge}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-teal-200"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
