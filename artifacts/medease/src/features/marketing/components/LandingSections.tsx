import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

import { useMarketingCta } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingSection } from '@/features/marketing/components/MarketingSection';
import {
  landingAudiences,
  landingDualCta,
  landingFaq,
  landingFoundations,
  landingHero,
  landingImpact,
  landingProblem,
  landingSolution,
  landingTrust,
  landingWhyNow,
} from '@/features/marketing/content/landing-fr';
import { marketingAssets } from '@/features/marketing/content/marketing-assets';
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
  blue: 'border-sky-200/70 bg-gradient-to-br from-sky-50/90 to-transparent',
  green:
    'border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 to-transparent',
  amber:
    'border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-transparent',
  rose: 'border-rose-200/70 bg-gradient-to-br from-rose-50/80 to-transparent',
};

const actorToneClass = {
  patient: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/25',
  pro: 'bg-sky-500/15 text-sky-900 border-sky-500/25',
  facility: 'bg-rose-500/15 text-rose-900 border-rose-500/25',
  pharmacy: 'bg-lime-500/15 text-lime-900 border-lime-500/25',
  transport: 'bg-indigo-500/15 text-indigo-900 border-indigo-500/25',
};

export function HeroSection() {
  const { openCta } = useMarketingCta();

  return (
    <section
      id="hero"
      className="marketing-hero-bleed relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24 md:pt-24"
    >
      <img
        src={marketingAssets.hero}
        alt=""
        aria-hidden
        className="marketing-hero-photo absolute inset-0 h-full w-full object-cover object-[68%_center]"
      />
      <div className="marketing-hero-scrim absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="marketing-reveal max-w-xl md:max-w-2xl">
          <div className="mb-8 flex items-center gap-3">
            <img
              src={marketingAssets.logoMark}
              alt=""
              className="h-14 w-14 rounded-2xl shadow-lg shadow-teal-900/20 md:h-16 md:w-16"
            />
            <div>
              <p className="font-[family-name:var(--marketing-display)] text-3xl font-extrabold tracking-tight text-[#0b3d66] md:text-4xl">
                {landingHero.brand}
              </p>
              <p className="text-sm font-medium text-[#0b3d66]/70">
                Hub de coordination territoriale
              </p>
            </div>
          </div>

          <h1 className="font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-[#072a47] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            {landingHero.titleLead}{' '}
            <span className="marketing-accent-word">{landingHero.titleAccent}</span>{' '}
            {landingHero.titleTrail}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#1a445f]/85 sm:text-lg">
            {landingHero.subtitle}
          </p>

          <div className="mt-9">
            <Button
              size="lg"
              className="marketing-primary-cta h-12 px-8 text-base"
              onClick={() => openCta('discover')}
            >
              {landingHero.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="marketing-reveal-delay space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Aujourd&apos;hui
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              {landingProblem.today.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e85d4c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Résultat
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              {landingProblem.result.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b8f9e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="marketing-media-frame overflow-hidden">
          <img
            src={marketingAssets.hubEcosystem}
            alt="Système fragmenté versus hub Med'ease synchronisé"
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </figure>
      </div>
    </MarketingSection>
  );
}

export function AudienceDualSection() {
  const { openCta } = useMarketingCta();
  const { patient, professional } = landingAudiences;

  return (
    <section id="audiences" className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
            Pour qui
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem]">
            Patients, aidants et professionnels — un même hub
          </h2>
        </div>

        <figure className="marketing-media-frame mb-14 overflow-hidden">
          <img
            src={marketingAssets.patientPro}
            alt="Espace patient et espace professionnel Med'ease"
            className="w-full object-cover object-center"
            loading="lazy"
          />
        </figure>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              {patient.eyebrow}
            </p>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {patient.title}
            </h3>
            <ul className="space-y-4">
              {patient.features.map((feature) => (
                <li key={feature.title}>
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              {patient.values.join(' · ')}
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-600/30 text-emerald-900 hover:bg-emerald-50"
              onClick={() => openCta(patient.ctaId)}
            >
              {patient.ctaLabel}
            </Button>
            <p className="text-sm">
              <Link href={ROUTES.patients} className="text-primary hover:underline">
                En savoir plus pour les patients
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-800">
              {professional.eyebrow}
            </p>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {professional.title}
            </h3>
            <ul className="space-y-4">
              {professional.features.map((feature) => (
                <li key={feature.title}>
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              {professional.values.join(' · ')}
            </p>
            <Button
              size="lg"
              className="marketing-primary-cta"
              onClick={() => openCta(professional.ctaId)}
            >
              {professional.ctaLabel}
            </Button>
            <p className="text-sm">
              <Link
                href={ROUTES.professionnels}
                className="text-primary hover:underline"
              >
                En savoir plus pour les professionnels
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <MarketingSection
      id="solution"
      eyebrow="La solution"
      title={landingSolution.title}
      subtitle={landingSolution.intro}
    >
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {landingSolution.actors.map((actor) => (
          <span
            key={actor.label}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              actorToneClass[actor.tone],
            )}
          >
            {actor.label}
          </span>
        ))}
      </div>

      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {landingSolution.features.map((feature) => (
          <div key={feature.title} className="border-t border-border/70 pt-5">
            <h3 className="text-lg font-semibold leading-snug">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
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
              'rounded-2xl border p-6 md:p-7',
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

export function WhyNowSection() {
  return (
    <section
      id="why-now"
      className="marketing-why-now py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300/90">
            Pourquoi maintenant
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {landingWhyNow.title}
          </h2>
          <p className="mt-4 text-lg text-white/70">{landingWhyNow.subtitle}</p>
        </div>

        <div className="mb-14 flex justify-center">
          <div className="marketing-wait-ring text-center">
            <p className="font-[family-name:var(--marketing-display)] text-5xl font-extrabold tracking-tight md:text-6xl">
              {landingWhyNow.waitTime.value}
            </p>
            <p className="mt-2 max-w-[12rem] text-xs font-medium uppercase tracking-wider text-white/65">
              {landingWhyNow.waitTime.label}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-teal-200">Urgences saturées</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {landingWhyNow.urgency.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-teal-200">
              Coordination fragmentée
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {landingWhyNow.coordination.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-teal-200">Chaque jour</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {landingWhyNow.daily.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImpactSection() {
  return (
    <MarketingSection
      id="impact"
      eyebrow="Impact mesurable"
      title={landingImpact.title}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <ul className="space-y-4">
          {landingImpact.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0b8f9e]" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <p className="border-l-4 border-[#0b8f9e] pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
          {landingImpact.sovereignty}
        </p>
      </div>
    </MarketingSection>
  );
}

export function TrustSection() {
  return (
    <MarketingSection
      id="security"
      eyebrow="Confiance & sécurité"
      title={landingTrust.title}
      subtitle={landingTrust.subtitle}
      tone="muted"
    >
      <figure className="marketing-media-frame mb-10 overflow-hidden">
        <img
          src={marketingAssets.etablissementConfiance}
          alt="Pilotage territorial et souveraineté numérique Med'ease"
          className="w-full object-cover object-top"
          loading="lazy"
        />
      </figure>
      <div className="flex flex-wrap justify-center gap-3">
        {landingTrust.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold tracking-wide text-foreground"
          >
            {badge}
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

/** Kept for audience/vision pages that still import SecuritySection. */
export function SecuritySection() {
  return <TrustSection />;
}
