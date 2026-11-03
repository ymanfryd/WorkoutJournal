import {createWorkout} from '@/api/workouts';
import type {WorkoutPlan} from '@/api/workoutPlans';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan?: WorkoutPlan) => createWorkout(plan),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['workouts']});
      await queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    },
  });
}
