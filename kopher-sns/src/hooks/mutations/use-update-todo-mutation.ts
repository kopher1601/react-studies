import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/api/update-todo.ts";
import type { Todo } from "@/types.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      // 데이터 변경 처리 전에 조회 처리 후 업데이트 처리가 있을 경우 데이터 일관성의 불일치가 발생할 수 있기 때문에
      // 쿼리 처리가 있는 경우 캔슬시킨다.
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.list,
      });

      // 실패를 대비한 백업 데이터
      const prevTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todo.list);

      // mutate 함수가 실행될때 전달된 매개변수를 받아올 수 있다
      // 여기서 낙관적 쿼리관련 로직을 구현
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (oldData) => {
        if (!oldData) return;

        return oldData.map((prevTodo) =>
          prevTodo.id === updatedTodo.id
            ? { ...prevTodo, ...updatedTodo }
            : prevTodo,
        );
      });

      return {
        prevTodos,
      };
    },
    onError: (_error, _updatedTodo, context) => {
      if (context && context.prevTodos) {
        queryClient.setQueryData<Todo[]>(
          QUERY_KEYS.todo.list,
          context.prevTodos,
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
    },
  });
}
