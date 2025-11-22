import { useOpenEditPostModal } from "@/store/post-editor-modal";
import { Button } from "../ui/button";
import type { PostEntity } from "@/types";

export default function EditPostItemButton(props: PostEntity) {
    const openEditPostModal = useOpenEditPostModal();

    const handleButtonClick = () => {
        openEditPostModal(props.id, props.content, props.image_urls);
    }
    return (
        <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={handleButtonClick}
        >
            수정
        </Button>
    )
}