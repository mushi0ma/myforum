import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark, GitFork, ArrowLeft, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { forumApi, ForumPost, ForumComment } from "@/services/api";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="px-4 py-3 border-b border-border">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
        <div className="bg-secondary/50 px-4 py-2 border-b border-border">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="p-4 bg-[#1e1e1e]">
          <Skeleton className="h-40 w-full bg-zinc-800" />
        </div>
        <div className="px-4 py-3 border-t border-border">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [postData, commentsData] = await Promise.all([
          forumApi.getPostById(Number(id)),
          forumApi.getComments(Number(id)),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    try {
      await forumApi.votePost(post.id);
      setIsLiked(!isLiked);
      setPost((prev) =>
        prev ? { ...prev, likes_count: prev.likes_count + (isLiked ? -1 : 1) } : null
      );
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  const handleFork = async () => {
    if (!post) return;
    try {
      const forkedPost = await forumApi.forkPost(post.id);
      navigate(`/post/${forkedPost.id}`);
    } catch (err) {
      console.error("Failed to fork:", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!post || !commentText.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await forumApi.createComment(post.id, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      setPost((prev) =>
        prev ? { ...prev, comments_count: prev.comments_count + 1 } : null
      );
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            {error || "Post not found"}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/feed")}>
            Go to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      {/* Post Article */}
      <article className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Author Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/avatars/${post.author_username}.png`} />
              <AvatarFallback>{post.author_username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{post.author_username}</span>
              <span className="text-sm text-muted-foreground">
                @{post.author_username} · {formatTimeAgo(post.created_at)}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </div>

        {/* Title & Description */}
        <div className="px-4 py-3 border-b border-border space-y-2">
          <h1 className="text-lg font-semibold">{post.title}</h1>
          <p className="text-sm text-muted-foreground">{post.description}</p>
        </div>

        {/* Code Header - VS Code style */}
        {post.code_snippet && (
          <>
            <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 font-mono text-sm text-muted-foreground">
                  snippet.{post.language.toLowerCase()}
                </span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {post.language}
              </Badge>
            </div>

            {/* Code Block with Syntax Highlighting */}
            <div className="overflow-x-auto code-scrollbar">
              <SyntaxHighlighter
                language={post.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.625",
                  background: "#1e1e1e",
                }}
                showLineNumbers={false}
                wrapLines={false}
              >
                {post.code_snippet}
              </SyntaxHighlighter>
            </div>
          </>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 ${isLiked ? "text-red-400" : "text-muted-foreground"} hover:text-red-400`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{post.likes_count}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.comments_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-green-400"
              onClick={handleFork}
            >
              <GitFork className="h-4 w-4" />
              <span className="text-xs">{post.forks_count}</span>
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>

        {/* Comment Input */}
        <div className="flex gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-20 resize-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`/avatars/${comment.author_username}.png`} />
                  <AvatarFallback>{comment.author_username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author_username}</span>
                    <span className="text-xs text-muted-foreground">@{comment.author_username}</span>
                    <span className="text-xs text-muted-foreground">· {formatTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground hover:text-red-400 h-7 px-2"
                  >
                    <Heart className="h-3 w-3" />
                    <span className="text-xs">{comment.likes_count || 0}</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
