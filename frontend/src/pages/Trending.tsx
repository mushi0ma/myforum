import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Flame,
  Clock,
  Calendar,
  CalendarDays,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Star,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingCard } from "@/components/TrendingCard";
import { forumApi, type ForumPost } from "@/services/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const timeFilters = [
  { id: "today", label: "Today", icon: Clock },
  { id: "week", label: "This Week", icon: Calendar },
  { id: "month", label: "This Month", icon: CalendarDays },
];

const sortOptions = [
  { id: "growth", label: "Growth Rate", icon: TrendingUp },
  { id: "stars", label: "Most Stars", icon: Star },
  { id: "comments", label: "Most Comments", icon: MessageSquare },
];

const languages = [
  "All",
  "JavaScript",
  "Python",
  "TypeScript",
  "React",
  "Go",
  "Rust",
  "CSS",
];

export default function TrendingPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTime, setActiveTime] = useState("today");
  const [activeLanguage, setActiveLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("growth");

  // Fetch trending posts from API
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getTrendingPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trending posts:", err);
        setError("Failed to load trending posts. Please try again later.");
        toast.error("Не удалось загрузить трендовые посты");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  // Client-side filtering and sorting
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Language filter
      const matchesLanguage = activeLanguage === "All" || post.language === activeLanguage;

      // Time filter (based on created_at)
      let matchesTime = true;
      if (activeTime === "today") {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        matchesTime = new Date(post.created_at).getTime() > oneDayAgo;
      } else if (activeTime === "week") {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesTime = new Date(post.created_at).getTime() > oneWeekAgo;
      } else if (activeTime === "month") {
        const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        matchesTime = new Date(post.created_at).getTime() > oneMonthAgo;
      }

      return matchesSearch && matchesLanguage && matchesTime;
    });

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (b.likes_count || 0) - (a.likes_count || 0);
        case "comments":
          return (b.comments_count || 0) - (a.comments_count || 0);
        case "growth":
        default:
          return b.trending_score - a.trending_score;
      }
    });

    // Add rank to posts
    return filtered.map((post, index) => ({
      ...post,
      rank: index + 1,
      isHot: index < 3, // Top 3 are HOT
    }));
  }, [posts, searchQuery, activeLanguage, activeTime, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading trending posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Flame className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Trending</h1>
        </div>
        <p className="text-muted-foreground">
          Discover the hottest code snippets based on engagement velocity and community activity.
        </p>
      </div>

      {/* How Trending Works */}
      <div className="mb-6 p-4 rounded-lg border border-border bg-card/50">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          How Trending Works
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Posts are ranked by <span className="text-foreground font-medium">engagement velocity</span> — how quickly
          they gain likes, comments, and forks. The formula:{" "}
          <code className="bg-muted px-1 rounded text-[10px]">
            score = (likes + comments×2 + forks×3) / hours^1.5
          </code>
          . Posts marked{" "}
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-orange-500 border-orange-500/50">
            HOT
          </Badge>{" "}
          are in the top 3.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trending snippets..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Time Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeTime === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTime(filter.id)}
              className={cn("gap-1.5", activeTime === filter.id && "bg-primary text-primary-foreground")}
            >
              <filter.icon className="h-3.5 w-3.5" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-1">Sort by:</span>
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant={sortBy === option.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy(option.id)}
              className={cn("gap-1.5", sortBy === option.id && "bg-secondary")}
            >
              <option.icon className="h-3.5 w-3.5" />
              {option.label}
            </Button>
          ))}
        </div>

        {/* Language Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {languages.map((lang) => (
            <Badge
              key={lang}
              variant={activeLanguage === lang ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                activeLanguage === lang ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
              onClick={() => setActiveLanguage(lang)}
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {filteredAndSortedPosts.length} trending snippet{filteredAndSortedPosts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Trending Grid */}
      <div className="space-y-4">
        {filteredAndSortedPosts.map((post) => (
          <TrendingCard key={post.id} {...post} />
        ))}
      </div>

      {filteredAndSortedPosts.length === 0 && (
        <div className="text-center py-12">
          <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No trending posts found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
