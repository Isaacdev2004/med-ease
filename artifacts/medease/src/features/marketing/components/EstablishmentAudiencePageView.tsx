import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { establishmentAudiencePage } from '@/features/marketing/content/establishment-audience-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const impactToneClass = {
  navy: 'bg-[#0b3d66] text-white',
  teal: 'bg-[#0b8f9e] text-white',
  deep: 'bg-[#0a6b7a] text-white',
  blue: 'bg-[#1a6fb5] text-white',
};

export function EstablishmentAudiencePageView() {
  const page = establishmentAudiencePage;
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
      <section className="marketing-foundations-band overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="marketing-reveal mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {page.hero.badge}
            </span>
            <h1 className="mt-5 font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.1rem] lg:leading-[1.1]">
              {page.hero.titleLead}{' '}
              <span className="text-white/95">{page.hero.titleAccent}</span>
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

          <figure className="marketing-reveal-delay mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-teal-950/40">
            <img
              src={marketingAssets.etablissementConfiance}
              alt="Tableau de bord territorial Med'ease pour les établissements"
              className="w-full object-cover object-top"
            />
          </figure>
        </div>
      </section>

      <section id="pilotage" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e85d4c]">
              {page.problem.eyebrow}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#072a47] sm:text-3xl">
              {page.problem.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {page.problem.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3.5 text-sm text-[#5c2a2a]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e85d4c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {page.solution.eyebrow}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#072a47] sm:text-3xl">
              {page.solution.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {page.solution.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/90 px-4 py-3.5 text-sm text-[#0b3d66]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="impact" className="border-y border-border/60 bg-muted/35 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {page.impact.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {page.impact.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.impact.items.map((item) => (
              <div
                key={item.title}
                className={cn(
                  'rounded-2xl p-6 shadow-md',
                  impactToneClass[item.tone],
                )}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-foundations-band py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl">
            {page.conclusion}
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
      </section>
    </>
  );
}
