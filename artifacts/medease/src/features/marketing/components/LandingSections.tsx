import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingEyebrow } from '@/features/marketing/components/MarketingEyebrow';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import { audienceNavLinks } from '@/features/marketing/content/audience-pages-fr';
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
  blue: 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-white dark:border-sky-900 dark:from-sky-950/40 dark:to-background',
  green:
    'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900 dark:from-emerald-950/40 dark:to-background',
  amber:
    'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white dark:border-amber-900 dark:from-amber-950/40 dark:to-background',
  rose: 'border-rose-200/80 bg-gradient-to-br from-rose-50 to-white dark:border-rose-900 dark:from-rose-950/40 dark:to-background',
};

export function HeroSection() {
  const { openCta } = useMarketingCta();

  return (
    <section
      id="hero"
      className="marketing-hero-bg relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28"
    >
      <div className="marketing-hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <MarketingEyebrow label="Hub de coordination territoriale de santé" />

        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl lg:leading-[1.05]">
          {landingHero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          {landingHero.subtitle}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground/90">
          {landingHero.ctaSubtext}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base shadow-lg shadow-primary/20"
            onClick={() => openCta('discover')}
          >
            {landingHero.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-primary/20 bg-background/80 px-8 text-base backdrop-blur-sm"
            onClick={() => openCta('hub')}
          >
            {landingHero.secondaryCtaLabel}
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <Button variant="link" asChild className="text-primary">
            <Link href={ROUTES.connexion}>Accéder à mon espace</Link>
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {audienceNavLinks.map((link) => (
              <Link key={link.path} href={link.path} className="marketing-audience-chip">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <MarketingSection
      id="problem"
      eyebrow="Le constat"
      title={landingProblem.title}
      tone="muted"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="marketing-card p-6 md:p-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Aujourd&apos;hui</h3>
          <ul className="space-y-3 text-muted-foreground">
            {landingProblem.today.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="marketing-card border-destructive/20 p-6 md:p-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Résultat</h3>
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
      eyebrow="La réponse Med'ease"
      title={landingSolution.title}
      subtitle={landingSolution.intro}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {landingSolution.questions.map((item) => (
          <div key={item.question} className="marketing-card p-6 md:p-7">
            <h3 className="text-lg font-semibold leading-snug">{item.question}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
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
      eyebrow="Les fondations"
      title={landingFoundations.title}
      subtitle={landingFoundations.tagline}
      tone="accent"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {landingFoundations.cards.map((card) => (
          <div
            key={card.title}
            className={cn(
              'marketing-card border p-6 md:p-7',
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
    <MarketingSection
      id="impact"
      eyebrow="Impact mesurable"
      title={landingImpact.title}
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <ul className="space-y-4">
          {landingImpact.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <div className="marketing-card border-primary/15 bg-primary/5 p-6 text-sm leading-relaxed text-muted-foreground">
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
      eyebrow="Pourquoi maintenant"
      title={landingWhyNow.title}
      subtitle={landingWhyNow.subtitle}
      tone="muted"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="marketing-card p-6">
          <h3 className="font-semibold">Urgences saturées</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {landingWhyNow.urgency.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="marketing-card p-6">
          <h3 className="font-semibold">Coordination fragmentée</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {landingWhyNow.coordination.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="marketing-card p-6">
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
    <MarketingSection id="cta" eyebrow="Rejoignez le mouvement" tone="accent">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="marketing-cta-panel">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Établissement
          </p>
          <h3 className="mt-3 text-2xl font-bold">
            Rejoignez les établissements pilotes
          </h3>
          <Button
            className="mt-6 shadow-sm"
            size="lg"
            onClick={() => openCta(landingDualCta.establishment.ctaId)}
          >
            {landingDualCta.establishment.label}
          </Button>
        </div>
        <div className="marketing-cta-panel">
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
    <MarketingSection id="faq" eyebrow="FAQ" title={landingFaq.title}>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {landingFaq.items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
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
      eyebrow="Confiance & sécurité"
      title="Données de santé protégées"
      subtitle="Hébergement HDS, conformité RGPD et traçabilité pour protéger les données de santé."
      tone="muted"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-card p-8 text-center leading-relaxed text-muted-foreground shadow-sm">
        Med&apos;ease est conçue pour la santé : authentification multi-profils,
        isolation multi-tenant, audit des accès et interopérabilité avec vos
        systèmes existants.
      </div>
    </MarketingSection>
  );
}
