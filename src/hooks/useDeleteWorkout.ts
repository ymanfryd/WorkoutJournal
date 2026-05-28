import {deleteWorkout} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
    },
  });
}
