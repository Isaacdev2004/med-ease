import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { medicalLibraryService } from '@/services/medical-library/medical-library.service';
import { useAuth } from '@/services/auth/auth-context';
import { appToast } from '@/services/api/toast';

export function useMedicalLibraryMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.medicalLibrary.all });
  };

  const toggleFavorite = useMutation({
    mutationFn: (medicationId: string) =>
      medicalLibraryService.toggleFavorite(userId, medicationId),
    onSuccess: (isFavorite) => {
      invalidate();
      appToast.success({
        title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
    },
  });

  return { toggleFavorite };
}
