import * as React from "react";
import { createPortal } from "react-dom";
import PostEditorModal from "@/components/modal/post-editor-modal.tsx";
import AlertModal from "@/components/modal/alert-modal.tsx";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {createPortal(
        <>
          <PostEditorModal />
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
