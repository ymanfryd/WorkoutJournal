import {addSetToExercise} from '@/api/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useAddSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSetToExercise,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
