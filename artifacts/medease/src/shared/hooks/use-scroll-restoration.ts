import { useEffect } from 'react';
import { useLocation } from 'wouter';

/** Scroll to top on route changes; preserves background scroll for overlays separately. */
export function useScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);
}
