import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { CtaFormId } from '@/features/marketing/content/cta-forms';
import { MarketingCtaDialog } from '@/features/marketing/components/MarketingCtaDialog';

interface MarketingCtaContextValue {
  openCta: (ctaId: CtaFormId) => void;
  closeCta: () => void;
}

const MarketingCtaContext = createContext<MarketingCtaContextValue | null>(null);

export function MarketingCtaProvider({ children }: { children: ReactNode }) {
  const [activeCtaId, setActiveCtaId] = useState<CtaFormId | null>(null);

  const openCta = useCallback((ctaId: CtaFormId) => {
    setActiveCtaId(ctaId);
  }, []);

  const closeCta = useCallback(() => {
    setActiveCtaId(null);
  }, []);

  const value = useMemo(
    () => ({ openCta, closeCta }),
    [openCta, closeCta],
  );

  return (
    <MarketingCtaContext.Provider value={value}>
      {children}
      <MarketingCtaDialog ctaId={activeCtaId} onClose={closeCta} />
    </MarketingCtaContext.Provider>
  );
}

export function useMarketingCta() {
  const context = useContext(MarketingCtaContext);
  if (!context) {
    throw new Error('useMarketingCta must be used within MarketingCtaProvider');
  }
  return context;
}

export function useMarketingCtaOptional() {
  return useContext(MarketingCtaContext);
}
