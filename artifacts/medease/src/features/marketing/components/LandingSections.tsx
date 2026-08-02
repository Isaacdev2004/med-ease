import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import {
  landingDualCta,
  landingFaq,
  landingFoundations,
  landingHero,
  landingImpact,
  landingPartners,
  landingProblem,
  landingSolution,
  landingWhyNow,
} from '@/features/marketing/content/landing-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
import { Button } from '@/shared/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { cn } from '@/shared/lib/utils';

const foundationToneClass = {
  blue: 'border-sky-200/70 bg-white/90',
  green: 'border-emerald-200/70 bg-white/90',
  amber: 'border-amber-200/70 bg-white/90',
  rose: 'border-rose-200/70 bg-white/90',
};

const moduleToneClass = {
  green: 'border-emerald-200 bg-emerald-50/80',
  rose: 'border-rose-200 bg-rose-50/80',
  blue: 'border-sky-200 bg-sky-50/80',
  sky: 'border-cyan-200 bg-cyan-50/70',
};

const metricToneClass = {
  teal: 'bg-[#0b8f9e] text-white',
  navy: 'bg-[#0b3d66] text-white',
  blue: 'bg-[#1a6fb5] text-white',
  indigo: 'bg-[#3d4f8f] text-white',
};

export function HeroSection() {
  const { openCta } = useMarketingCta();

  return (
    <section
      id="hero"
      className="marketing-hero-bleed relative overflow-hidden pb-10 pt-28 md:pb-16 md:pt-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:px-8">
        <div className="marketing-reveal relative z-10 max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
            {landingHero.eyebrow}
          </p>

          <h1 className="font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-[#072a47] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.08]">
            {landingHero.titleLead}{' '}
            <span className="marketing-accent-word">{landingHero.titleAccent}</span>{' '}
            {landingHero.titleTrail}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[#1a445f]/85 sm:text-lg">
            {landingHero.subtitle}
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              className="marketing-primary-cta h-12 px-8 text-base"
              onClick={() => openCta('discover')}
            >
              {landingHero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-[#0b3d66]/10 pt-8">
            {landingHero.stats.map((stat) => (
              <div key={stat.value}>
                <p className="font-[family-name:var(--marketing-display)] text-3xl font-extrabold text-[#0b3d66]">
                  {stat.value}
                </p>
                <p className="mt-1 max-w-[11rem] text-xs leading-snug text-[#1a445f]/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <figure className="marketing-reveal-delay relative mx-auto w-full max-w-2xl lg:max-w-none">
          <img
            src={marketingAssets.hero}
            alt="Hub Med'ease reconnectant ville et hôpital"
            className="marketing-hero-photo w-full object-contain drop-shadow-xl"
          />
        </figure>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section
      id="comment"
      className="marketing-problem-band py-20 text-white md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="marketing-reveal">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:leading-tight">
            {landingProblem.title}
          </h2>
          <ul className="mt-8 space-y-3 text-white/75">
            {landingProblem.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e85d4c]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
          <img
            src={marketingAssets.hubEcosystem}
            alt="Système de santé fragmenté versus hub synchronisé"
            className="w-full object-cover object-bottom"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <MarketingSection
      id="solution"
      eyebrow="Notre Solution"
      title={
        <>
          {landingSolution.titleLead}{' '}
          <span className="text-[#0b8f9e]">{landingSolution.titleAccent}</span>
        </>
      }
      subtitle={landingSolution.intro}
    >
      <figure className="marketing-media-frame mb-10 overflow-hidden">
        <img
          src={marketingAssets.solutionFoundations}
          alt="Modules de la plateforme Med'ease"
          className="w-full object-cover object-top"
          loading="lazy"
        />
      </figure>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {landingSolution.modules.map((module) => (
          <div
            key={module.title}
            className={cn(
              'rounded-2xl border p-5',
              moduleToneClass[module.tone],
            )}
          >
            <h3 className="font-semibold">{module.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}

export function FaqSection() {
  return (
    <MarketingSection id="faq" eyebrow="FAQ" title={landingFaq.title}>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {landingFaq.items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MarketingSection>
  );
}

export function FoundationsSection() {
  return (
    <section
      id="foundations"
      className="marketing-foundations-band py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {landingFoundations.title}
          </h2>
          <p className="mt-4 text-lg text-white/75">
            {landingFoundations.tagline}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {landingFoundations.cards.map((card) => (
            <div
              key={card.title}
              className={cn(
                'rounded-2xl border p-6 shadow-lg shadow-teal-950/10',
                foundationToneClass[card.tone],
              )}
            >
              <h3 className="text-xl font-semibold text-[#072a47]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#1a445f]/75">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImpactSection() {
  const maxBar = Math.max(...landingImpact.chartBars);

  return (
    <MarketingSection
      id="impact"
      eyebrow="Impact & Valeurs"
      title={landingImpact.title}
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <ul className="space-y-4">
          {landingImpact.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0b8f9e]" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {landingImpact.metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn(
                  'rounded-2xl p-5 shadow-md',
                  metricToneClass[metric.tone],
                )}
              >
                <p className="font-[family-name:var(--marketing-display)] text-3xl font-extrabold">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs font-medium text-white/80">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {landingImpact.chartLabel}
            </p>
            <div className="flex h-32 items-end gap-2">
              {landingImpact.chartBars.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-[#0b3d66] to-[#0b8f9e]"
                  style={{ height: `${(value / maxBar) * 100}%` }}
                  title={String(value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketingSection>
  );
}

export function WhyNowSection() {
  return (
    <section id="why-now" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {landingWhyNow.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {landingWhyNow.subtitle}
          </p>
        </div>

        <div className="marketing-why-now overflow-hidden rounded-3xl p-6 text-white md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <div className="marketing-wait-ring text-center">
                <p className="font-[family-name:var(--marketing-display)] text-5xl font-extrabold tracking-tight md:text-6xl">
                  {landingWhyNow.waitTime.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-xs font-medium uppercase tracking-wider text-white/65">
                  {landingWhyNow.waitTime.label}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {landingWhyNow.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={marketingAssets.etablissementConfiance}
                alt="Tableau de bord territorial et limites du système de santé"
                className="w-full object-cover object-top"
                loading="lazy"
              />
            </figure>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {landingWhyNow.audiences.map((audience) => (
            <Link
              key={audience.title}
              href={audience.href}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-[#0b8f9e]/40 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold group-hover:text-[#0b8f9e]">
                {audience.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {audience.description}
              </p>
              <p className="mt-4 text-sm font-medium text-[#0b8f9e]">
                En savoir plus →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <MarketingSection
      id="partenaires"
      eyebrow="Partenaires"
      title={landingPartners.title}
      tone="muted"
    >
      <div className="flex flex-wrap justify-center gap-3">
        {landingPartners.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </MarketingSection>
  );
}

export function DualCtaSection() {
  const { openCta } = useMarketingCta();

  return (
    <MarketingSection id="cta" eyebrow="Rejoignez le mouvement" tone="accent">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="marketing-cta-panel">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0b8f9e]">
            Établissement
          </p>
          <h3 className="mt-3 text-2xl font-bold">
            Rejoignez les établissements pilotes
          </h3>
          <Button
            className="marketing-primary-cta mt-6"
            size="lg"
            onClick={() => openCta(landingDualCta.establishment.ctaId)}
          >
            {landingDualCta.establishment.label}
          </Button>
        </div>
        <div className="marketing-cta-panel">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0b8f9e]">
            Patient
          </p>
          <h3 className="mt-3 text-2xl font-bold">
            Reprenez le contrôle de votre parcours
          </h3>
          <Button
            className="mt-6"
            size="lg"
            variant="outline"
            onClick={() => openCta(landingDualCta.patient.ctaId)}
          >
            {landingDualCta.patient.label}
          </Button>
        </div>
      </div>
    </MarketingSection>
  );
}

/** Kept for audience/vision pages that still import SecuritySection. */
export function SecuritySection() {
  return (
    <MarketingSection
      id="security"
      eyebrow="Confiance & sécurité"
      title="Données de santé protégées"
      subtitle="Hébergement HDS, conformité RGPD et traçabilité pour protéger les données de santé."
      tone="muted"
    >
      <div className="mx-auto max-w-3xl text-center leading-relaxed text-muted-foreground">
        Med&apos;ease est conçue pour la santé : authentification multi-profils,
        isolation multi-tenant, audit des accès et interopérabilité avec vos
        systèmes existants.
      </div>
    </MarketingSection>
  );
}
