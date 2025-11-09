import { create } from "zustand/react";
import { combine, devtools } from "zustand/middleware";
import type { Session } from "@supabase/supabase-js";

type State = {
  isLoaded: boolean;
  session: Session | null;
};

const initialState: State = {
  isLoaded: false,
  session: null,
};

const useSessionStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSession: (session: Session | null) => {
          set({ session, isLoaded: true }, undefined, "actions.setSession");
        },
      },
    })),
  ),
);

export const useSession = () => {
  return useSessionStore((store) => store.session);
};

export const useIsSessionLoaded = () => {
  return useSessionStore((store) => store.isLoaded);
};

export const useSetSession = () => {
  return useSessionStore((store) => store.actions.setSession);
};
