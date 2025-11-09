import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";

export function useUpdatePassword(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    },
    onError: (error) => {
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    },
  });
}
