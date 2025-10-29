import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Todo } from "@/types.ts";

const initialState: {
  todos: Todo[];
} = { todos: [] };

const useTodoStore = create(
  immer(
    combine(initialState, (set) => ({
      actions: {
        createTodo: (content: string) => {
          set((state) => {
            state.todos.push({
              id: new Date().getTime(),
              content,
            });
          });
        },
        deleteTodo: (targetId: number) => {
          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== targetId);
          });
        },
      },
    })),
  ),
);

export const useTodos = () => {
  return useTodoStore((store) => store.todos);
};

export const useCreateTodo = () => {
  return useTodoStore((store) => store.actions.createTodo);
};

export const useDeleteTodo = () => {
  return useTodoStore((store) => store.actions.deleteTodo);
};
