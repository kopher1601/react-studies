import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/api/delete-todo.ts";
import type { Todo } from "@/types.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (deletedTodo) => {
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (oldData) => {
        if (!oldData) return [];
        return oldData.filter((todo) => todo.id !== deletedTodo.id);
      });
    },
  });
}
