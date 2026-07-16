import { Globe, Languages, Shield, Stethoscope, Video } from 'lucide-react';

import type { DirectoryProvider } from '@/services/directory/directory.types';
import { Badge } from '@/shared/ui/badge';

interface ProviderBadgesProps {
  provider: DirectoryProvider;
}

export function ProviderBadges({ provider }: ProviderBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {provider.teleconsultation ? (
        <Badge variant="secondary" className="gap-1">
          <Video className="h-3 w-3" aria-hidden="true" />
          Teleconsultation
        </Badge>
      ) : null}
      {provider.emergencyServices ? (
        <Badge variant="destructive" className="gap-1">
          <Shield className="h-3 w-3" aria-hidden="true" />
          Emergency
        </Badge>
      ) : null}
      {provider.specialty ? (
        <Badge variant="outline" className="gap-1">
          <Stethoscope className="h-3 w-3" aria-hidden="true" />
          {provider.specialty}
        </Badge>
      ) : null}
      {provider.languages.slice(0, 2).map((lang) => (
        <Badge key={lang} variant="outline" className="gap-1">
          <Languages className="h-3 w-3" aria-hidden="true" />
          {lang}
        </Badge>
      ))}
      {provider.finessNumber ? (
        <Badge variant="outline" className="gap-1">
          <Globe className="h-3 w-3" aria-hidden="true" />
          FINESS {provider.finessNumber}
        </Badge>
      ) : null}
    </div>
  );
}
