import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateExercise, type NewExercise} from '@/api/exercises';

type UpdateExerciseInput = {id: string; exercise: NewExercise};

export function useUpdateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({id, exercise}: UpdateExerciseInput) =>
      updateExercise(id, exercise),
    onSuccess: () => qc.invalidateQueries({queryKey: ['exercises']}),
  });
}
