import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";

export function useSignInWithPassword({ onError }: UseMutationCallback) {
  return useMutation({
    mutationFn: signIn,
    onError: (error) => {
      console.error(error);

      if (onError) {
        onError(error);
      }
    },
  });
}
