import * as React from "react";
import { createPortal } from "react-dom";
import PostEditorModal from "@/components/modal/post-editor-modal.tsx";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {createPortal(
        <PostEditorModal />,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
