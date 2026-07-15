import {updateSet} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useUpdateSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
