import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants.ts";
import { createProfile, fetchProfile } from "@/api/profile.ts";
import type { PostgrestError } from "@supabase/supabase-js";
import { useSession } from "@/store/session.ts";

export function useProfileData(userId?: string) {
  const session = useSession();
  const isMine = userId === session?.user.id;

  return useQuery({
    // enabled: !!userId 로 userId가 있을경우에만 queryFn이 실행되기떄문에 userId가 있다고 단언해도된다.
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      try {
        return await fetchProfile(userId!);
      } catch (error) {
        if (isMine && (error as PostgrestError).code === "PGRST116") {
          return await createProfile(userId!);
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
}
