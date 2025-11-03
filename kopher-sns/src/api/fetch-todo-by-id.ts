import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export async function fetchTodoById(id: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`);

  console.log("call fetchTodoById", response);
  if (!response.ok) {
    throw new Error(`Failed to fetch todo with id ${id}`);
  }

  return await response.json();
}
