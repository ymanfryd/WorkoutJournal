import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createWorkoutPlan} from '@/api/workoutPlans';

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkoutPlan,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['workoutPlans']}),
  });
}
