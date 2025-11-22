import { PlusCircleIcon } from "lucide-react";
import { useOpenCreatePostModal } from "@/store/post-editor-modal.ts";

export default function CreatePostButton() {
  const openCreatePostModal = useOpenCreatePostModal();
  return (
    <div
      onClick={openCreatePostModal}
      className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <p>あなたの話を聞かせてください👂</p>
        <PlusCircleIcon className="h-5 w-5" />
      </div>
    </div>
  );
}
