import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (oldData) => {
        if (!oldData) return;
        return [...oldData, newTodo];
      });
    },
  });
}
