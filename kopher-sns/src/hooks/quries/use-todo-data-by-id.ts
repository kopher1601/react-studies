import { useQuery } from "@tanstack/react-query";
import { fetchTodoById } from "@/api/fetch-todo-by-id.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useTodoDataById(id: string, type: "detail" | "list") {
  return useQuery({
    queryFn: () => fetchTodoById(id),
    queryKey: QUERY_KEYS.todo.detail(id),
    enabled: type === "detail",
  });
}
