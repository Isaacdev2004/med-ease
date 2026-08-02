import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'wouter';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { visionPage } from '@/features/marketing/content/audience-pages-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function VisionPageView() {
  const { openCta } = useMarketingCta();

  useDocumentTitle(visionPage.seo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', visionPage.seo.description);
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="marketing-hero-bleed overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div className="marketing-reveal max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
              {visionPage.hero.eyebrow}
            </p>
            <h1 className="font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-[#072a47] sm:text-5xl lg:text-[3.2rem] lg:leading-[1.08]">
              {visionPage.hero.titleLead}{' '}
              <span className="text-[#0b8f9e]">{visionPage.hero.titleBrand}</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#1a445f]/85 sm:text-lg">
              {visionPage.hero.subtitle}
            </p>
            <Button
              size="lg"
              className="marketing-primary-cta mt-8 h-12 px-8"
              onClick={() => openCta(visionPage.hero.ctaId)}
            >
              {visionPage.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <figure className="marketing-reveal-delay mx-auto w-full max-w-xl lg:max-w-none">
            <img
              src={marketingAssets.notreVision}
              alt="L'expérience Med'ease — collaboration des soignants"
              className="w-full object-contain drop-shadow-xl"
            />
          </figure>
        </div>
      </section>

      {/* Conviction */}
      <section id="conviction" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
              {visionPage.conviction.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#072a47] sm:text-4xl">
              {visionPage.conviction.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {visionPage.conviction.lead}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visionPage.conviction.points.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-[#0b8f9e]/12" />
                <h3 className="font-semibold text-[#072a47]">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="piliers" className="border-y border-border/60 bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
              {visionPage.pillars.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {visionPage.pillars.title}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {visionPage.pillars.items.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-[#0b8f9e]/20 bg-card p-6"
              >
                <div className="mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-[#0b8f9e]/20 to-[#1a6fb5]/20" />
                <h3 className="text-xl font-semibold text-[#072a47]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {visionPage.pillars.ctas.map((cta) =>
              'href' in cta && cta.href ? (
                <Button
                  key={cta.label}
                  size="lg"
                  asChild
                  className={cn(
                    'h-12 w-full',
                    cta.tone === 'navy'
                      ? 'bg-[#0b3d66] text-white hover:bg-[#072a47]'
                      : 'marketing-primary-cta',
                  )}
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ) : (
                <Button
                  key={cta.label}
                  size="lg"
                  className={cn(
                    'h-12 w-full',
                    cta.tone === 'navy'
                      ? 'bg-[#0b3d66] text-white hover:bg-[#072a47]'
                      : 'marketing-primary-cta',
                  )}
                  onClick={() =>
                    'ctaId' in cta && cta.ctaId
                      ? openCta(cta.ctaId)
                      : undefined
                  }
                >
                  {cta.label}
                </Button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Manifesto band */}
      <section className="marketing-foundations-band py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
          <p className="text-lg text-white/85">{visionPage.manifesto.intro}</p>
          <p className="mt-6 font-[family-name:var(--marketing-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
            {visionPage.manifesto.highlight}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-white/80">
            {visionPage.manifesto.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {visionPage.manifesto.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium text-white/90">
            {visionPage.manifesto.closing}
          </p>
        </div>
      </section>

      {/* Values */}
      <section id="valeurs" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
              {visionPage.values.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {visionPage.values.title}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visionPage.values.items.map((value, index) => (
              <div
                key={value.title}
                className={cn(
                  'rounded-2xl border border-border bg-card p-6',
                  index === 3 && 'lg:col-start-1 lg:col-end-2',
                  index === 4 && 'sm:col-span-2 lg:col-span-2',
                )}
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-[#0b8f9e]/15" />
                <h3 className="text-lg font-semibold text-[#072a47]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="marketing-foundations-band py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--marketing-display)] text-2xl font-bold text-white sm:text-3xl">
            {visionPage.engagement.title}
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 bg-white px-8 text-[#0b8f9e] hover:bg-white/90"
            onClick={() => openCta(visionPage.engagement.ctaId)}
          >
            {visionPage.engagement.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
