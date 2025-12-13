import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Star, Loader2 } from "lucide-react";
import { forumApi, ForumPost } from "@/services/api";

// ==========================================
// Trending Posts Widget (Real API)
// ==========================================
export function Widgets() {
  const [trendingPosts, setTrendingPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await forumApi.getTrendingPosts();
        // Take top 5 trending posts
        setTrendingPosts(data.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        console.error("Failed to fetch trending:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="sticky top-[4.5rem] flex flex-col gap-4">
        {/* Trending Posts Widget */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Trending Posts</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Unable to load trending posts
            </p>
          ) : trendingPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No trending posts yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="flex items-center justify-between hover:bg-secondary/50 -mx-2 px-2 py-1.5 rounded-md transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-primary truncate">
                      {post.title || `Post #${post.id}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{post.author_username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0 ml-2">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="text-xs">{post.likes_count}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/*
        ==========================================
        TODO: Top Contributors Widget
        ==========================================
        This widget is hidden until we have a real API endpoint
        for fetching top contributors.

        Future API endpoint suggestion:
        GET /api/forum/users/top-contributors/

        Response format:
        [
          { username, avatar_url, posts_count, likes_received }
        ]
        ==========================================
        */}

        {/* Quick Links Widget */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              to="/explore"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Explore all posts
            </Link>
            <Link
              to="/trending"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Trending this week
            </Link>
            <Link
              to="/bookmarks"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Your bookmarks
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-muted-foreground px-2">
          <p>GitForum &copy; 2025</p>
          <p className="mt-1">
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            {" · "}
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            {" · "}
            <Link to="/help" className="hover:text-primary">Help</Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
