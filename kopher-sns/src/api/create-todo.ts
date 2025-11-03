import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export async function createTodo(content: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    body: JSON.stringify({
      content,
      isDone: false,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return response.json();
}
