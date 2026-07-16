import { Heart } from 'lucide-react';

import { useDirectoryMutations } from '@/features/directory/mutations/directory.mutations';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface FavoriteButtonProps {
  providerId: string;
  isFavorite?: boolean;
  size?: 'sm' | 'default' | 'icon';
  className?: string;
}

export function FavoriteButton({
  providerId,
  isFavorite = false,
  size = 'icon',
  className,
}: FavoriteButtonProps) {
  const { toggleFavorite } = useDirectoryMutations();

  return (
    <Button
      type="button"
      variant={isFavorite ? 'default' : 'outline'}
      size={size}
      className={cn(className)}
      disabled={toggleFavorite.isPending}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite.mutate(providerId)}
    >
      <Heart className={cn('h-4 w-4', isFavorite ? 'fill-current' : undefined)} />
      {size !== 'icon' ? (
        <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
      ) : null}
    </Button>
  );
}
