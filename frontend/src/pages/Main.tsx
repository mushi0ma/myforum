import { PostCard, PostCardProps } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { ForumPost } from "@/services/api";
import { useFeed } from "@/hooks/useFeed";

// ==========================================
// Helper: Format relative time
// ==========================================
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ==========================================
// Helper: Map API ForumPost to PostCardProps
// ==========================================
function mapToPostCard(post: ForumPost): PostCardProps {
  return {
    id: String(post.id),
    filename: post.title || `snippet.${post.language?.toLowerCase() || "txt"}`,
    language: post.language || "Plain Text",
    author: {
      name: post.author_username,
      username: post.author_username,
      avatar: "", // TODO: Add avatar URL when available from API
    },
    timestamp: formatTimeAgo(post.created_at),
    code: post.code_snippet || post.description || "",
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    forks: post.forks_count || 0,
    tags: post.tags || [],
  };
}

// ==========================================
// Loading Skeleton Component
// ==========================================
function PostSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[150px] w-full rounded-md" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// ==========================================
// Error State Component
// ==========================================
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
      <p className="text-destructive font-medium mb-2">Failed to load feed</p>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

// ==========================================
// Empty State Component
// ==========================================
function EmptyState() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground mb-2">No posts yet</p>
      <p className="text-sm text-muted-foreground">
        Be the first to share some code!
      </p>
    </div>
  );
}

// ==========================================
// Main Feed Page Component
// ==========================================
export default function Main() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFeed();

  const posts = data?.pages.flat() || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono tracking-tight">Your Feed</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : isError ? (
          // Error state
          <ErrorState message={error?.message || "Unknown error"} onRetry={() => refetch()} />
        ) : posts.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          // Render posts
          posts.map((post) => <PostCard key={post.id} {...mapToPostCard(post)} />)
        )}
        
        {/* Loading Spinner for Next Page */}
        {isFetchingNextPage && <PostSkeleton />}
      </div>

      {/* Load More */}
      {!isLoading && !isError && hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
      
      {!isLoading && !isError && !hasNextPage && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          You have reached the end of the feed.
        </p>
      )}
    </div>
  );
}