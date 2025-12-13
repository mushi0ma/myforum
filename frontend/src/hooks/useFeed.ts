import { useInfiniteQuery } from "@tanstack/react-query";
import { forumApi, ForumPost } from "@/services/api";

const PAGE_SIZE = 10;

export const useFeed = () => {
  return useInfiniteQuery<ForumPost[], Error>({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await forumApi.getExplorePosts({
        ordering: "-created_at",
        page: pageParam as number,
        page_size: PAGE_SIZE,
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than PAGE_SIZE, we've reached the end
      return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
  });
};
