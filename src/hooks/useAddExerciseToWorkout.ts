import {addExerciseToActiveWorkout} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addExerciseToActiveWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
