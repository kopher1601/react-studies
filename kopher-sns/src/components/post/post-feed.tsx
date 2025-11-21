import Fallback from "@/components/fallback.tsx";
import Loader from "@/components/loader.tsx";
import PostItem from "@/components/post/post-item.tsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfinitePostData } from "@/hooks/queries/use-infinite-posts.data";

export default function PostFeed() {
  const { data, error, isPending, fetchNextPage, isFetchingNextPage } = useInfinitePostData();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (error) return <Fallback />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {data.pages.map((page) => (
        page.map((post) => (
          <PostItem key={post.id} {...post} />
        ))
      ))}
      {isFetchingNextPage && <Loader />}
      <div ref={ref}></div>
    </div>
  );
}
