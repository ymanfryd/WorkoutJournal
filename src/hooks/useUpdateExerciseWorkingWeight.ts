import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateExerciseWorkingWeight} from '@/api/exercises';

export function useUpdateExerciseWorkingWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({id, workingWeight}: {id: string; workingWeight?: number}) =>
      updateExerciseWorkingWeight(id, workingWeight),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['exercises']}),
  });
}
