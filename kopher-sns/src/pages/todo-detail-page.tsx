import { useParams } from "react-router";
import { useTodoDataById } from "@/hooks/quries/use-todo-data-by-id.ts";

export default function TodoDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useTodoDataById(String(id), "detail");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }

  return <div>{data?.content}</div>;
}
