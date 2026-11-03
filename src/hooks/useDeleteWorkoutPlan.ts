import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteWorkoutPlan} from '@/api/workoutPlans';

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkoutPlan,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['workoutPlans']}),
  });
}
