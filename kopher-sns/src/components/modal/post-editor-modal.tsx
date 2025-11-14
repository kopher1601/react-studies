import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ImageIcon } from "lucide-react";
import { usePostEditorModal } from "@/store/post-editor-modal.ts";
import { useEffect, useRef, useState } from "react";

export default function PostEditorModal() {
  const { isOpen, close } = usePostEditorModal();
  const [content, setContent] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCloseModal = () => {
    close();
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    textAreaRef.current?.focus();
    setContent("");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>ポスト作成</DialogTitle>
        <textarea
          placeholder="あなたの話を聞かせてください👂"
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="foucs:outline-none max-h-125 min-h-25"
        />
        <Button variant="outline" className="cursor-pointer">
          <ImageIcon />
          イメージ追加
        </Button>
        <Button className="cursor-pointer">保存</Button>
      </DialogContent>
    </Dialog>
  );
}
