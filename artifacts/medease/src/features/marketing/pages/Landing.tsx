import { useEffect } from 'react';

import {
  AudienceDualSection,
  DualCtaSection,
  FaqSection,
  FoundationsSection,
  HeroSection,
  ImpactSection,
  ProblemSection,
  SolutionSection,
  TrustSection,
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
      <AudienceDualSection />
      <SolutionSection />
      <FoundationsSection />
      <WhyNowSection />
      <ImpactSection />
      <TrustSection />
      <DualCtaSection />
      <FaqSection />
    </>
  );
}
