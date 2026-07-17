import { Heart } from 'lucide-react';

import { useMedicalLibraryMutations } from '@/features/medical-library/mutations/medical-library.mutations';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface FavoriteButtonProps {
  medicationId: string;
  isFavorite?: boolean;
  size?: 'sm' | 'default' | 'icon';
  className?: string;
}

export function FavoriteButton({
  medicationId,
  isFavorite = false,
  size = 'icon',
  className,
}: FavoriteButtonProps) {
  const { toggleFavorite } = useMedicalLibraryMutations();

  return (
    <Button
      type="button"
      variant={isFavorite ? 'default' : 'outline'}
      size={size}
      className={cn(className)}
      disabled={toggleFavorite.isPending}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite.mutate(medicationId)}
    >
      <Heart
        className={cn('h-4 w-4', isFavorite ? 'fill-current' : undefined)}
      />
      {size !== 'icon' ? (
        <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
      ) : null}
    </Button>
  );
}
