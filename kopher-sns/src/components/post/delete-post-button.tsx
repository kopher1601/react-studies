import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { toast } from "sonner";

export default function DeletePostButton({ id }: { id: number }) {
    const openAlertModal = useOpenAlertModal()
    const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
        onError: (error) => {
            toast.error("投稿の削除に失敗しました", { position: "top-center" })
        }
    })

    const handleDeleteClick = () => {
        openAlertModal({
            title: "削除",
            description: "この投稿を削除しますか？",
            onPositive: () => {
                deletePost(id)
            }
        })
    }

    return (
        <Button className="cursor-pointer" variant="ghost" onClick={handleDeleteClick} disabled={isDeletePostPending}>
            削除
        </Button>
    )
}