import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { conciergePage } from '@/features/marketing/content/audience-pages-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';

export function ConciergePageView() {
  const { openCta } = useMarketingCta();

  useDocumentTitle(conciergePage.seo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', conciergePage.seo.description);
    }
  }, []);

  return (
    <>
      <section className="marketing-foundations-band overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div className="marketing-reveal">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {conciergePage.hero.badge}
            </span>
            <h1 className="mt-5 font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.08]">
              {conciergePage.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              {conciergePage.hero.subtitle}
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 bg-white px-8 text-[#0b8f9e] hover:bg-white/90"
              onClick={() => openCta(conciergePage.hero.ctaId)}
            >
              {conciergePage.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <figure className="marketing-reveal-delay mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-teal-950/30 lg:max-w-none">
            <img
              src={marketingAssets.notreVision}
              alt="Réseau de coordination santé Med'ease"
              className="w-full object-cover"
            />
          </figure>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#072a47] sm:text-3xl">
            {conciergePage.transition.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {conciergePage.transition.subtitle}
          </p>
        </div>
      </section>

      <section id="expertises" className="border-y border-border/60 bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {conciergePage.expertiseGroups.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {conciergePage.expertiseGroups.title}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {conciergePage.expertiseGroups.items.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-sky-100 bg-sky-50/60 p-6"
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-[#0b8f9e]/15" />
                <h3 className="text-lg font-semibold text-[#072a47]">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#0b8f9e]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {conciergePage.journey.map((step) => (
              <div
                key={step.phase}
                className="rounded-2xl border border-border bg-card px-5 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0b8f9e]">
                  {step.phase}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="coordination" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {conciergePage.differentiators.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {conciergePage.differentiators.title}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {conciergePage.differentiators.items.map((item) => (
              <div
                key={item.title}
                className="marketing-foundations-band rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-white/15" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-foundations-band py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-[family-name:var(--marketing-display)] text-3xl font-bold text-white sm:text-4xl">
            {conciergePage.closing.title}
          </h2>
          <p className="mt-5 text-lg text-white/85">{conciergePage.closing.body}</p>
          <p className="mt-4 text-sm font-medium text-white/90">
            {conciergePage.closing.tagline}
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 bg-white px-8 text-[#0b8f9e] hover:bg-white/90"
            onClick={() => openCta(conciergePage.hero.ctaId)}
          >
            {conciergePage.closing.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
