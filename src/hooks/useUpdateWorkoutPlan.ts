import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateWorkoutPlan, type WorkoutPlanInput} from '@/api/workoutPlans';

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, input}: {id: string; input: WorkoutPlanInput}) =>
      updateWorkoutPlan(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['workoutPlans']}),
  });
}
