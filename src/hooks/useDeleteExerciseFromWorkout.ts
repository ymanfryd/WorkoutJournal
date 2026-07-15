import {deleteExerciseFromActiveWorkout} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useDeleteExerciseFromWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExerciseFromActiveWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
