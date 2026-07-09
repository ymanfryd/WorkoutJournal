import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createExercise} from '@/api/exercises';

export function useCreateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => qc.invalidateQueries({queryKey: ['exercises']}),
  });
}
