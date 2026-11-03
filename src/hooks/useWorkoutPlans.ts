import {useQuery} from '@tanstack/react-query';
import {getWorkoutPlans} from '@/api/workoutPlans';

export function useWorkoutPlans() {
  return useQuery({queryKey: ['workoutPlans'], queryFn: getWorkoutPlans});
}
