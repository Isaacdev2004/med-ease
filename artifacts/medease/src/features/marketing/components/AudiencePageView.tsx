import { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import type { StandardAudiencePageId } from '@/features/marketing/content/audience-pages-fr';
import { standardAudiencePages } from '@/features/marketing/content/audience-pages-fr';
import { SecuritySection } from '@/features/marketing/components/LandingSections';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';

interface AudiencePageViewProps {
  pageId: StandardAudiencePageId;
}

export function AudiencePageView({ pageId }: AudiencePageViewProps) {
  const page = standardAudiencePages[pageId];
  const { openCta } = useMarketingCta();

  useDocumentTitle(page.seo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', page.seo.description);
    }
  }, [page.seo.description]);

  return (
    <>
      <section className="marketing-hero-bg relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="marketing-hero-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            {page.hero.badge}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {page.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.hero.subtitle}
          </p>
          <Button
            size="lg"
            className="mt-10 h-12 px-8 text-base shadow-lg shadow-primary/20"
            onClick={() => openCta(page.hero.ctaId)}
          >
            {page.hero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <MarketingSection id="probleme" title={page.problem.title} tone="muted">
        <ul className="mx-auto grid max-w-3xl gap-4">
          {page.problem.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border bg-card p-4 text-muted-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="solution" title={page.solution.title}>
        <ul className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
          {page.solution.items.map((item) => (
            <li
              key={item}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="impact" title={page.impact.title} tone="accent">
        <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {page.impact.items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection tone="muted">
        <blockquote className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground italic">
          {page.conclusion}
        </blockquote>
        <div className="mt-10 flex justify-center">
          <Button size="lg" onClick={() => openCta(page.hero.ctaId)}>
            {page.hero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </MarketingSection>

      <SecuritySection />
    </>
  );
}
