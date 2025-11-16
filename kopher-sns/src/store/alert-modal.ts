import { create } from "zustand/react";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

type CloseState = { isOpen: false };

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (state: Omit<OpenState, "isOpen">) =>
          set({ ...state, isOpen: true }),
        close: () => set({ isOpen: false }),
      },
    })),
    {
      name: "alertModalStore",
    },
  ),
);

export const useOpenAlertModal = () => {
  return useAlertModalStore((store) => store.actions.open);
};

export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & State;
};
