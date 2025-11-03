import { useMutation } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";

export function useCreateTodoMutation() {
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      window.location.reload();
    },
  });
}
