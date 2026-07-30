import {getWorkoutById} from '@/api/workouts';
import {useQuery} from '@tanstack/react-query';

export function useWorkoutById(id: string) {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: () => getWorkoutById(id),
  });
}
