import { useEffect } from 'react';
import { useLocation } from 'wouter';

/** Move focus to the primary page heading after navigation for screen readers. */
export function useRouteFocus() {
  const [location] = useLocation();

  useEffect(() => {
    const heading = document.querySelector<HTMLElement>(
      '#main-content h1, #main-content [role="heading"]',
    );
    heading?.focus({ preventScroll: true });
  }, [location]);
}
