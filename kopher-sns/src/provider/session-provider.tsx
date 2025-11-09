import { type ReactNode, useEffect } from "react";
import { useIsSessionLoaded, useSetSession } from "@/store/session.ts";
import supabase from "@/lib/supabase.ts";
import GlobalLoader from "@/components/global-loader.tsx";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) {
    return <GlobalLoader />;
  }

  return children;
}
