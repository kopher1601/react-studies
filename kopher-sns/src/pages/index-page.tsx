import CreatePostButton from "@/components/post/create-post-button.tsx";
import PostFeed from "@/components/post/post-feed.tsx";

export default function IndexPage() {
  return (
    <div className="flex flex-col gap-10">
      <CreatePostButton />
      <PostFeed />
    </div>
  );
}
