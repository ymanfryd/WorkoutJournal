import {finishActiveWorkout} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useFinishWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finishActiveWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
