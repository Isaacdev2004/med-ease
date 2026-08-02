import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { SecuritySection } from '@/features/marketing/components/LandingSections';
import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import { visionPage } from '@/features/marketing/content/audience-pages-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';

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
      <section className="marketing-hero-bg relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="marketing-hero-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {visionPage.hero.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {visionPage.hero.subtitle}
            </p>
          </div>
          <figure className="marketing-media-frame mx-auto mt-12 max-w-4xl overflow-hidden">
            <img
              src={marketingAssets.notreVision}
              alt="Construire la santé de demain — Med'ease"
              className="w-full object-cover"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <MarketingSection id="conviction" title={visionPage.conviction.title} tone="muted">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="text-xl font-medium">{visionPage.conviction.lead}</p>
          <ul className="space-y-3 text-muted-foreground">
            {visionPage.conviction.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </MarketingSection>

      <MarketingSection id="piliers" title="Nous sommes">
        <div className="grid gap-6 md:grid-cols-2">
          {visionPage.pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-2xl">{pillar.emoji}</p>
              <h3 className="mt-3 text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection title="Nos deux engagements-clés" tone="accent">
        <ul className="mx-auto flex max-w-2xl flex-col gap-4">
          {visionPage.commitments.map((item) => (
            <li
              key={item}
              className="rounded-xl border bg-card px-6 py-4 text-center font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="manifeste" title={visionPage.manifesto.title}>
        <div className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg font-medium text-foreground">
            {visionPage.manifesto.intro}
          </p>
          {visionPage.manifesto.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection title={visionPage.philosophy.title} tone="muted">
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
          {visionPage.philosophy.body}
        </p>
      </MarketingSection>

      <MarketingSection id="valeurs" title="Nos valeurs fondamentales">
        <div className="grid gap-6 md:grid-cols-2">
          {visionPage.values.map((value, index) => (
            <div key={value.title} className="rounded-2xl border bg-card p-6">
              <p className="text-sm font-semibold text-primary">
                {index + 1}. {value.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection tone="accent">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-semibold">{visionPage.leitmotiv}</p>
          <Button
            size="lg"
            className="mt-8"
            onClick={() => openCta(visionPage.hero.ctaId)}
          >
            {visionPage.hero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </MarketingSection>

      <SecuritySection />
    </>
  );
}
