import {useQuery} from '@tanstack/react-query';
import {getExercises} from '@/api/exercises';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: getExercises,
  });
}
