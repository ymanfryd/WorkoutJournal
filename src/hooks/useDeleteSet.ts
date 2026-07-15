import {deleteSet} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useDeleteSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
      await queryClient.invalidateQueries({queryKey: ['workouts']});
    },
  });
}
