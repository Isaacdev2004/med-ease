import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

import { SecuritySection } from '@/features/marketing/components/LandingSections';
import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import { conciergePage } from '@/features/marketing/content/audience-pages-fr';
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
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            Conciergerie médicale
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {conciergePage.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {conciergePage.hero.subtitle}
          </p>
          <Button
            size="lg"
            className="mt-10 h-12 px-8 text-base shadow-lg"
            onClick={() => openCta(conciergePage.hero.ctaId)}
          >
            {conciergePage.hero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <MarketingSection
        id="expertises"
        title="Nos expertises"
        subtitle="Parce qu'un parcours de soins ne commence pas à l'hôpital."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {conciergePage.expertiseGroups.map((group) => (
            <div key={group.title} className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="parcours" title="Votre parcours, étape par étape">
        <div className="grid gap-6 md:grid-cols-3">
          {conciergePage.journey.map((step, index) => (
            <div
              key={step.phase}
              className="rounded-2xl border bg-card p-6 text-center"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Étape {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{step.phase}</h3>
              <p className="mt-3 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        title="Bien plus qu'une assistance administrative"
        tone="accent"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {conciergePage.differentiators.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="services" title="Accompagnement personnalisé en santé">
        <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {conciergePage.services.map((service) => (
            <li key={service} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{service}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
          {conciergePage.closing}
        </p>
        <div className="mt-10 flex justify-center">
          <Button size="lg" onClick={() => openCta(conciergePage.hero.ctaId)}>
            {conciergePage.hero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </MarketingSection>

      <SecuritySection />
    </>
  );
}
