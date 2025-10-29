import { create } from "zustand";

interface Store {
  count: number;
  increment: () => void;
  decrement: () => void;
}
const useCountStore = create<Store>((set, get) => {
  return {
    count: 0,
    increment: () => {
      set({ count: get().count + 1 });
    },
    decrement: () => {
      set({ count: get().count - 1 });
    },
  };
});

export function useCount() {
  return useCountStore((store) => store.count);
}

export function useIncrementCount() {
  return useCountStore((store) => store.increment);
}

export function useDecrementCount() {
  return useCountStore((store) => store.decrement);
}
