import {deleteExercise} from '@/api/exercises';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['exercises']});
    },
  });
}
