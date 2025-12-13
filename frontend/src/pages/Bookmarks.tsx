import { useState, useEffect } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { BookmarksEmpty } from "@/components/BookmarksEmpty";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid3X3, List, Bookmark, Loader2 } from "lucide-react";
import { forumApi, SavedPost } from "@/services/api";
import { toast } from "sonner";

// Language color mapping
const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-yellow-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  Ruby: "bg-red-400",
  PHP: "bg-purple-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-400",
  default: "bg-gray-500",
};

// Helper to get relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await forumApi.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load bookmarks";
      setError(message);
      // Don't show error toast for auth errors - just show empty state
      if (!message.includes("Unauthorized")) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: number) => {
    try {
      await forumApi.unsavePost(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      toast.success("Bookmark removed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove bookmark";
      toast.error(message);
    }
  };

  // Transform API data to display format
  const displayBookmarks = bookmarks.map((saved) => ({
    id: saved.id,
    postId: saved.post.id,
    title: saved.post.title,
    description: saved.post.description,
    language: saved.post.language,
    languageColor: languageColors[saved.post.language] || languageColors.default,
    author: {
      name: saved.post.author_username || "Anonymous",
      avatar: "",
    },
    stars: saved.post.likes_count,
    forks: saved.post.forks_count,
    views: saved.post.views,
    tags: [], // Tags would come from taggit - could be added to serializer
    savedAt: getRelativeTime(saved.saved_at),
  }));

  const filteredBookmarks = displayBookmarks
    .filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLanguage = filterLanguage === "all" || b.language.toLowerCase() === filterLanguage.toLowerCase();
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // recent - keep original order (already sorted by saved_at from API)
    });

  const languages = [...new Set(displayBookmarks.map((b) => b.language))];

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading bookmarks...</span>
        </div>
      </div>
    );
  }

  // Error state (for non-auth errors)
  if (error && !error.includes("Unauthorized")) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchBookmarks}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            Bookmarks
          </h1>
          <p className="text-muted-foreground">
            {bookmarks.length} saved snippet{bookmarks.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <BookmarksEmpty />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                className="pl-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Date Added</SelectItem>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookmarks match your search.</p>
            </div>
          ) : (
            <div
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}
            >
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  id={String(bookmark.postId)}
                  title={bookmark.title}
                  description={bookmark.description}
                  language={bookmark.language}
                  languageColor={bookmark.languageColor}
                  author={bookmark.author}
                  stars={bookmark.stars}
                  forks={bookmark.forks}
                  views={bookmark.views}
                  tags={bookmark.tags}
                  savedAt={bookmark.savedAt}
                  onRemove={() => handleRemoveBookmark(bookmark.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
