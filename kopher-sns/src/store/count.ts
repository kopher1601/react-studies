import { create } from "zustand";
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useCountStore = create(
  devtools(
    persist(
      // 브라우저의 localStorage 에 state 를 보관하게 해줌
      subscribeWithSelector(
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
      ),
      {
        name: "count-store",
        // localStorage 에 보관하고 싶은 값만 지정할 수 있다.
        partialize: (state) => ({ count: state.count }),
        // 브라우저의 sessionStorage 에 값을 보관게 지정
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "count-store", // 브라우저에서 redux dev tools 의 설치가 필요하다
    },
  ),
);

// useEffect 와 비슷한 역할을 한다
useCountStore.subscribe(
  (state) => state.count,
  // listener
  (count, prevCount) => {
    console.log("count changed", count);
    console.log("prevCount", prevCount);
  },
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
