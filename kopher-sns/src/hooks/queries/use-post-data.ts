import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants.ts";
import { fetchPosts } from "@/api/post.ts";

export function usePostData() {
  return useQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: () => fetchPosts(),
  });
}
