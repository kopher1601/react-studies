import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ImageIcon, XIcon } from "lucide-react";
import { usePostEditorModal } from "@/store/post-editor-modal.ts";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post.ts";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.tsx";
import { useSession } from "@/store/session.ts";
import { useOpenAlertModal } from "@/store/alert-modal.ts";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();
  const { isOpen, close } = usePostEditorModal();
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: () => {
      toast.error("ポスト生成に失敗しました", { position: "top-center" });
    },
  });

  const handleCloseModal = () => {
    if (content !== "" || images.length !== 0) {
      openAlertModal({
        title: "作成中のものがあります",
        description: "この画面から出ると、作成中の内容が失われます",
        onPositive: () => close(),
      });
      return;
    }
    close();
  };

  const handleCreatePostClick = () => {
    if (content.trim() === "") {
      return;
    }
    createPost({
      content,
      images: images.map((image) => image.file),
      userId: session!.user.id,
    });
  };

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        setImages((prevImages) => [
          ...prevImages,
          { file, previewUrl: URL.createObjectURL(file) },
        ]);
      });
    }

    e.target.value = "";
  };

  const handleDeleteImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img.previewUrl !== image.previewUrl),
    );
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
    setImages([]);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>ポスト作成</DialogTitle>
        <textarea
          disabled={isCreatePostPending}
          placeholder="あなたの話を聞かせてください👂"
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="foucs:outline-none max-h-125 min-h-25"
        />
        <input
          onChange={handleSelectImages}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem className="basis-2/5">
                  <div className="relative">
                    <img
                      className="h-full w-full rounded-sm object-cover"
                      key={index}
                      src={image.previewUrl}
                      alt={`image-${index}`}
                    />
                    <div
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isCreatePostPending}
          variant="outline"
          className="cursor-pointer"
        >
          <ImageIcon />
          イメージ追加
        </Button>
        <Button
          disabled={isCreatePostPending}
          onClick={handleCreatePostClick}
          className="cursor-pointer"
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
}
