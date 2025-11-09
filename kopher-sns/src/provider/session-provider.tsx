import { type ReactNode, useEffect } from "react";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session.ts";
import supabase from "@/lib/supabase.ts";
import GlobalLoader from "@/components/global-loader.tsx";
import { useProfileData } from "@/hooks/queries/use-profile-data.ts";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  const { isLoading: isProfileLoading } = useProfileData(session?.user.id);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) {
    return <GlobalLoader />;
  }
  if (isProfileLoading) {
    return <GlobalLoader />;
  }

  return children;
}
