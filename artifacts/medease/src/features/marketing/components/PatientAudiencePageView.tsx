import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { patientAudiencePage } from '@/features/marketing/content/patient-audience-fr';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Button } from '@/shared/ui/button';

export function PatientAudiencePageView() {
  const page = patientAudiencePage;
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
      {/* Hero — gradient, visual left, copy right */}
      <section className="marketing-foundations-band overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <figure className="marketing-reveal order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
            <img
              src={marketingAssets.patientPro}
              alt="Application patient Med'ease — santé entre de bonnes mains"
              className="w-full rounded-2xl object-cover object-left shadow-2xl shadow-teal-950/30"
            />
          </figure>

          <div className="marketing-reveal-delay order-1 lg:order-2">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {page.hero.badge}
            </span>
            <h1 className="mt-5 font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.08]">
              {page.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              {page.hero.subtitle}
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 bg-white px-8 text-[#0b8f9e] hover:bg-white/90"
              onClick={() => openCta(page.hero.ctaId)}
            >
              {page.hero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section id="parcours" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
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
                  className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/90 px-4 py-3.5 text-sm text-[#0b3d66]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0b8f9e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Impact */}
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {page.impact.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-[#0b8f9e]/20 to-[#1a6fb5]/20" />
                <h3 className="font-semibold text-[#072a47]">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {page.impact.trustMarks.map((mark) => (
              <span
                key={mark}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="marketing-foundations-band py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl">
            {page.conclusion}
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 bg-white px-8 text-[#0b8f9e] hover:bg-white/90"
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
