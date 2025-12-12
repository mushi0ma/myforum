import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TrendingUp, Flame, Clock } from "lucide-react";
import { ExploreFilters } from "@/components/ExploreFilters";
import { PostCard } from "@/components/PostCard";
import { forumApi, type ForumPost } from "@/services/api";
import { toast } from "sonner";

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const tagFromUrl = searchParams.get("tag");

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("All");
  const [activeTags, setActiveTags] = useState<string[]>(tagFromUrl ? [tagFromUrl] : []);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeTime, setActiveTime] = useState("This Week");
  const [activeSort, setActiveSort] = useState("Most Stars");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchQuery || undefined,
          language: activeLanguage !== "All" ? activeLanguage : undefined,
          tags: activeTags.length > 0 ? activeTags.join(",") : undefined,
          ordering: getOrderingParam(activeSort),
        };

        const data = await forumApi.getExplorePosts(params);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch explore posts:", err);
        setError("Failed to load posts. Please try again later.");
        toast.error("Не удалось загрузить посты");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, activeLanguage, activeTags, activeSort]);

  // Set tag from URL on mount
  useEffect(() => {
    if (tagFromUrl && !activeTags.includes(tagFromUrl)) {
      setActiveTags([tagFromUrl]);
    }
  }, [tagFromUrl]);

  // Convert sort option to API ordering param
  const getOrderingParam = (sort: string): "-created_at" | "-views" | "-forks_count" | "-trending_score" => {
    switch (sort) {
      case "Most Stars":
        return "-trending_score"; // Use trending_score as proxy for popularity
      case "Most Forks":
        return "-forks_count";
      case "Recent":
        return "-created_at";
      case "Most Comments":
        return "-views"; // Use views as proxy (TODO: add comments_count to API)
      default:
        return "-trending_score";
    }
  };

  // Client-side time filtering
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Time filter
    if (activeTime !== "All Time") {
      const now = Date.now();
      let timeThreshold = 0;

      switch (activeTime) {
        case "Today":
          timeThreshold = now - 24 * 60 * 60 * 1000;
          break;
        case "This Week":
          timeThreshold = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case "This Month":
          timeThreshold = now - 30 * 24 * 60 * 60 * 1000;
          break;
      }

      if (timeThreshold > 0) {
        filtered = filtered.filter((post) => new Date(post.created_at).getTime() > timeThreshold);
      }
    }

    return filtered;
  }, [posts, activeTime]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Explore</h1>
        <p className="text-muted-foreground">Discover trending code snippets and repositories</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ExploreFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
          activeTags={activeTags}
          onTagsChange={setActiveTags}
          activeCategories={activeCategories}
          onCategoriesChange={setActiveCategories}
          activeTime={activeTime}
          onTimeChange={setActiveTime}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          showFilters={showFilters}
          onShowFiltersChange={setShowFilters}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{filteredPosts.filter((p) => {
              const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
              return new Date(p.created_at).getTime() > oneDayAgo;
            }).length}</p>
            <p className="text-xs text-muted-foreground">Trending Today</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-green-500/10">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{filteredPosts.filter((p) => {
              const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
              return new Date(p.created_at).getTime() > oneWeekAgo;
            }).length}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{filteredPosts.length}</p>
            <p className="text-xs text-muted-foreground">Total Results</p>
          </div>
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || activeLanguage !== "All" || activeTags.length > 0) && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              id={String(post.id)}
              filename={`${post.title}.${post.language.toLowerCase()}`}
              language={post.language}
              author={{
                name: post.author.username,
                username: post.author.username,
                avatar: "/placeholder-user.jpg",
              }}
              timestamp={new Date(post.created_at).toLocaleDateString()}
              code={post.code_snippet || "// No code snippet available"}
              likes={post.likes_count || 0}
              comments={post.comments_count || 0}
              forks={post.forks_count}
              tags={post.tags}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
