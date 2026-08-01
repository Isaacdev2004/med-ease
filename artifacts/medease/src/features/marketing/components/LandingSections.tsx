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
  landingProblem,
  landingSolution,
  landingWhyNow,
} from '@/features/marketing/content/landing-fr';
import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { cn } from '@/shared/lib/utils';

const foundationToneClass = {
  blue: 'border-sky-200 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/30',
  green:
    'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30',
  amber:
    'border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/30',
  rose: 'border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/30',
};

export function HeroSection() {
  const { openCta } = useMarketingCta();

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-primary" />
          Hub de coordination territoriale de santé
        </div>

        <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {landingHero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          {landingHero.subtitle}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
          {landingHero.ctaSubtext}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base shadow-lg"
            onClick={() => openCta('discover')}
          >
            {landingHero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            onClick={() => openCta('hub')}
          >
            {landingHero.secondaryCtaLabel}
          </Button>
        </div>

        <div className="mt-8">
          <Button variant="link" asChild>
            <Link href={ROUTES.connexion}>Accéder à mon espace</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <MarketingSection id="problem" title={landingProblem.title} tone="muted">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Aujourd&apos;hui</h3>
          <ul className="space-y-3 text-muted-foreground">
            {landingProblem.today.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Résultat</h3>
          <ul className="space-y-3 text-muted-foreground">
            {landingProblem.result.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MarketingSection>
  );
}

export function SolutionSection() {
  return (
    <MarketingSection
      id="solution"
      title={landingSolution.title}
      subtitle={landingSolution.intro}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {landingSolution.questions.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold">{item.question}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}

export function FoundationsSection() {
  return (
    <MarketingSection
      id="foundations"
      title={landingFoundations.title}
      subtitle={landingFoundations.tagline}
      tone="accent"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {landingFoundations.cards.map((card) => (
          <div
            key={card.title}
            className={cn(
              'rounded-2xl border p-6 shadow-sm',
              foundationToneClass[card.tone],
            )}
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}

export function ImpactSection() {
  return (
    <MarketingSection id="impact" title={landingImpact.title}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <ul className="space-y-4">
          {landingImpact.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border bg-muted/40 p-6 text-sm leading-relaxed text-muted-foreground">
          {landingImpact.sovereignty}
        </div>
      </div>
    </MarketingSection>
  );
}

export function WhyNowSection() {
  return (
    <MarketingSection
      id="why-now"
      title={landingWhyNow.title}
      subtitle={landingWhyNow.subtitle}
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Urgences saturées</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {landingWhyNow.urgency.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Coordination fragmentée</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {landingWhyNow.coordination.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Chaque jour</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {landingWhyNow.daily.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </MarketingSection>
  );
}

export function DualCtaSection() {
  const { openCta } = useMarketingCta();

  return (
    <MarketingSection id="cta" tone="accent">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Établissement
          </p>
          <h3 className="mt-3 text-2xl font-bold">
            Rejoignez les établissements pilotes
          </h3>
          <Button
            className="mt-6"
            size="lg"
            onClick={() => openCta(landingDualCta.establishment.ctaId)}
          >
            {landingDualCta.establishment.label}
          </Button>
        </div>
        <div className="rounded-2xl border bg-card p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
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

export function FaqSection() {
  return (
    <MarketingSection id="faq" title={landingFaq.title}>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {landingFaq.items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MarketingSection>
  );
}

export function SecuritySection() {
  return (
    <MarketingSection
      id="security"
      title="Confiance & sécurité"
      subtitle="Hébergement HDS, conformité RGPD et traçabilité pour protéger les données de santé."
      tone="muted"
    >
      <div className="mx-auto max-w-3xl text-center text-muted-foreground leading-relaxed">
        Med&apos;ease est conçue pour la santé : authentification multi-profils,
        isolation multi-tenant, audit des accès et interopérabilité avec vos
        systèmes existants.
      </div>
    </MarketingSection>
  );
}
