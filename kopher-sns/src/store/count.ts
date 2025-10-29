import { create } from "zustand";
import { combine } from "zustand/middleware";

const useCountStore = create(
  combine(
    {
      count: 0,
    },
    (set) => ({
      increment: () => {
        set((state) => ({ count: state.count + 1 }));
      },
      decrement: () => {
        set((state) => ({ count: state.count - 1 }));
      },
    }),
  ),
);

export function useCount() {
  return useCountStore((store) => store.count);
}

export function useIncrementCount() {
  return useCountStore((store) => store.increment);
}

export function useDecrementCount() {
  return useCountStore((store) => store.decrement);
}
