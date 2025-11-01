import type { Todo } from "@/types.ts";
import { API_URL } from "@/lib/constants.ts";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return await response.json();
}
