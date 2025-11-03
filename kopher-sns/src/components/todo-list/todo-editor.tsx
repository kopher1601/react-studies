import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { useCreateTodoMutation } from "@/hooks/mutations/use-create-todo-mutation.ts";

export default function TodoEditor() {
  const { mutate, isPending } = useCreateTodoMutation();
  const [content, setContent] = useState("");

  const handleAddClick = () => {
    if (content.trim() === "") {
      return;
    }

    mutate(content);
    setContent("");
  };
  return (
    <div className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="新しい TODO　を入力してください"
      />
      <Button disabled={isPending} onClick={handleAddClick}>
        追加
      </Button>
    </div>
  );
}
