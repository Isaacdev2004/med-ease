import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { directoryService } from '@/services/directory/directory.service';
import { useAuth } from '@/services/auth/auth-context';
import { appToast } from '@/services/api/toast';

export function useDirectoryMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.directory.all });
  };

  const toggleFavorite = useMutation({
    mutationFn: (providerId: string) => directoryService.toggleFavorite(userId, providerId),
    onSuccess: (isFavorite) => {
      invalidate();
      appToast.success({
        title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
    },
  });

  return { toggleFavorite };
}
