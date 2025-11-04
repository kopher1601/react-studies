import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/api/delete-todo.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (deletedTodo) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.todo.detail(deletedTodo.id),
      });
      queryClient.setQueryData<string[]>(QUERY_KEYS.todo.list, (oldData) => {
        if (!oldData) return [];
        return oldData.filter((id) => id !== deletedTodo.id);
      });
    },
  });
}
