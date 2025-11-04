import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import type { Todo } from "@/types.ts";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation.ts";
import { useDeleteTodoMutation } from "@/hooks/mutations/use-delete-todo-mutation.ts";

export default function TodoItem({ id, content, isDone }: Todo) {
  const { mutate: updateTodo } = useUpdateTodoMutation();
  const { mutate: deleteTodo, isPending } = useDeleteTodoMutation();

  const handleDeleteClick = () => {
    deleteTodo(id);
  };

  const handleCheckboxClick = () => {
    updateTodo({ id, isDone: !isDone });
  };

  return (
    <div className="radius-md flex items-center justify-between border p-2">
      <div className="flex gap-5">
        <input
          disabled={isPending}
          type="checkbox"
          checked={isDone}
          onClick={handleCheckboxClick}
        />
        <Link to={`/todo-detail/${id}`}>{content}</Link>
      </div>
      <Button
        disabled={isPending}
        variant="destructive"
        onClick={handleDeleteClick}
      >
        削除
      </Button>
    </div>
  );
}
