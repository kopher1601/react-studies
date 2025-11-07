import { useMutation } from "@tanstack/react-query";
import { signInWithOAuth } from "@/api/auth.ts";

export function useSignInWithOAuth() {
  return useMutation({
    mutationFn: signInWithOAuth,
  });
}
