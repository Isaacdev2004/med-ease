import { useEffect } from 'react';

import {
  DualCtaSection,
  FaqSection,
  FoundationsSection,
  HeroSection,
  ImpactSection,
  PartnersSection,
  ProblemSection,
  SolutionSection,
  WhyNowSection,
} from '@/features/marketing/components/LandingSections';
import { landingSeo } from '@/features/marketing/content/landing-fr';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function Landing() {
  useDocumentTitle(landingSeo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', landingSeo.description);
    }
  }, []);

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FaqSection />
      <FoundationsSection />
      <ImpactSection />
      <WhyNowSection />
      <PartnersSection />
      <DualCtaSection />
    </>
  );
}
