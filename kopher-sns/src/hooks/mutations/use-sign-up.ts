import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/api/auth.ts";

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
