import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface RouteRedirectProps {
  to: string;
}

export function RouteRedirect({ to }: RouteRedirectProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [setLocation, to]);

  return null;
}
