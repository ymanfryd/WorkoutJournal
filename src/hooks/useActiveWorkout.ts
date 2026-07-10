import {getActiveWorkout} from '@/api/workouts';
import {useQuery} from '@tanstack/react-query';

export function useActiveWorkout() {
  return useQuery({
    queryKey: ['activeWorkout'],
    queryFn: getActiveWorkout,
  });
}
