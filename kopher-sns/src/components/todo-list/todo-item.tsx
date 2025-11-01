import { Button } from "@/components/ui/button.tsx";
import { useDeleteTodo } from "@/store/todos.ts";
import { Link } from "react-router";

export default function TodoItem({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const deleteTodo = useDeleteTodo();
  const handleDeleteClick = () => {
    deleteTodo(id);
  };
  return (
    <div className="radius-md flex items-center justify-between border p-2">
      <Link to={`/todo-detail/${id}`}>{content}</Link>
      <Button variant="destructive" onClick={handleDeleteClick}>
        削除
      </Button>
    </div>
  );
}
