import {useQuery} from '@tanstack/react-query';
import {getExerciseById} from '@/api/exercises';

export function useExerciseById(id?: string) {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: () => getExerciseById(id!),
    enabled: Boolean(id),
  });
}
