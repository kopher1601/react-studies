import { useMutation } from "@tanstack/react-query";
import { deletePost } from "@/api/post.ts";
import type { UseMutationCallback } from "@/types.ts";
import { deleteImageInPath } from "@/api/image";

export function useDeletePost(callbacks?: UseMutationCallback) {
    return useMutation({
        mutationFn: deletePost,
        onSuccess: async ({ author_id, id }) => {
            if (callbacks?.onSuccess) {
                callbacks.onSuccess();
            }
            await deleteImageInPath({ filePath: `${author_id}/${id}` });
        },
        onError: (error) => {
            if (callbacks?.onError) {
                callbacks.onError(error);
            }
        },
    });
}
