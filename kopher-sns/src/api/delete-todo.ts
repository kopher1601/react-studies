import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export async function deleteTodo(id: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo with id ${id}`);
  }

  return response.json();
}
