import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";

export function useSignUp({ onError }: UseMutationCallback) {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });
}
