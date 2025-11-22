import { create } from "zustand/react";
import { combine, devtools } from "zustand/middleware";

type CreateMode = {
  isOpen: true,
  type: "CREATE"
}

type EditMode = {
  isOpen: true,
  type: "EDIT",
  postId: number,
  content: string,
  imageUrls: string[] | null
}

type OpenState = CreateMode | EditMode;

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => {
          set({ isOpen: true, type: "CREATE" });
        },
        openEdit: (postId: number, content: string, imageUrls: string[] | null) => {
          set({ isOpen: true, type: "EDIT", postId, content, imageUrls });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "postEditorModalStore" },
  ),
);

export const useOpenCreatePostModal = () => {
  return usePostEditorModalStore((store) => store.actions.openCreate);
};

export const useOpenEditPostModal = () => {
  return usePostEditorModalStore((store) => store.actions.openEdit);
};

export const usePostEditorModal = () => {
  const store = usePostEditorModalStore();
  return store as typeof store & State
};
