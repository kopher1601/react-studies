import { useMutation } from "@tanstack/react-query";
import { signInWithOAuth } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";

export function useSignInWithOAuth({ onError }: UseMutationCallback) {
  return useMutation({
    mutationFn: signInWithOAuth,
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });
}
