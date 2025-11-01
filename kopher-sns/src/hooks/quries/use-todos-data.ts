import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/api/fetch-todos.ts";

export function useTodosData() {
  return useQuery({
    queryFn: fetchTodos,
    queryKey: ["todos"],
  });
}
