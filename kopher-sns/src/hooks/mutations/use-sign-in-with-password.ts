import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/auth.ts";

export function useSignInWithPassword() {
  return useMutation({
    mutationFn: signIn,
  });
}
