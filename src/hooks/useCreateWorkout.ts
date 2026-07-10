import {createWorkout} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
