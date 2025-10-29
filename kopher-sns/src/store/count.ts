import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useCountStore = create(
  immer(
    combine(
      {
        count: 0,
      },
      (set) => ({
        increment: () => {
          set((state) => (state.count += 1));
        },
        decrement: () => {
          set((state) => (state.count -= 1));
        },
      }),
    ),
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
