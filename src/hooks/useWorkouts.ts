import {getWorkouts} from '@/api/workouts';
import {useQuery} from '@tanstack/react-query';

export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  });
}
