import { usePostData } from "@/hooks/queries/use-post-data.ts";
import Fallback from "@/components/fallback.tsx";
import Loader from "@/components/loader.tsx";
import PostItem from "@/components/post/post-item.tsx";

export default function PostFeed() {
  const { data, error, isPending } = usePostData();

  if (error) return <Fallback />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {data.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
}
