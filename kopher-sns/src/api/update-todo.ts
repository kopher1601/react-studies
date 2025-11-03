import type { Todo } from "@/types.ts";
import { API_URL } from "@/lib/constants.ts";

export async function updateTodo(
  todo: Partial<Todo> & { id: string },
): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: "PATCH",
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Update failed");
  }

  return response.json();
}
