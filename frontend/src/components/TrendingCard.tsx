import { Link } from "react-router-dom";
import { Flame, Heart, GitFork, Eye, MessageSquare, TrendingUp, ArrowUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ForumPost } from "@/services/api";

interface TrendingCardProps extends ForumPost {
  rank: number;
  isHot?: boolean;
  growthPercent?: number;
}

// Language color mapping (можно вынести в utils)
const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-yellow-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  Swift: "bg-orange-600",
  CSS: "bg-purple-500",
  React: "bg-cyan-400",
  YAML: "bg-red-500",
};

export function TrendingCard({
  id,
  rank,
  title,
  description,
  language,
  author,
  forks_count,
  trending_score,
  created_at,
  tags,
  likes_count = 0,
  comments_count = 0,
  views = 0,
  isHot = false,
  growthPercent,
}: TrendingCardProps) {
  const languageColor = languageColors[language] || "bg-gray-500";

  // Calculate time ago (simple version, можно улучшить)
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 336) return "1 week ago";
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

  return (
    <Link to={`/post/${id}`}>
      <article className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
        {/* Rank Badge */}
        <div
          className={cn(
            "absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm border-2",
            rank === 1 && "bg-yellow-500/20 border-yellow-500 text-yellow-500",
            rank === 2 && "bg-slate-400/20 border-slate-400 text-slate-400",
            rank === 3 && "bg-amber-600/20 border-amber-600 text-amber-600",
            rank > 3 && "bg-muted border-border text-muted-foreground"
          )}
        >
          #{rank}
        </div>

        {/* Hot indicator */}
        {isHot && (
          <div className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/50 px-2 py-0.5">
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span className="text-xs font-medium text-orange-500">HOT</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3 mt-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("h-3 w-3 rounded-full shrink-0", languageColor)} />
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <Badge variant="secondary" className="font-mono text-xs shrink-0">
            {language}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal px-2 py-0">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Growth Indicator (if available) */}
        {growthPercent && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">
              <ArrowUp className="h-3 w-3 inline" /> {growthPercent}% growth
            </span>
            <span className="text-xs text-muted-foreground ml-auto">in last 24h</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={`/api/placeholder/32/32`} alt={author.username} />
              <AvatarFallback className="text-xs">{author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {author.username}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
            <span className="flex items-center gap-1.5" title="Likes">
              <Heart className="h-3.5 w-3.5" />
              {likes_count}
            </span>
            <span className="flex items-center gap-1.5" title="Comments">
              <MessageSquare className="h-3.5 w-3.5" />
              {comments_count}
            </span>
            <span className="flex items-center gap-1.5" title="Forks">
              <GitFork className="h-3.5 w-3.5" />
              {forks_count}
            </span>
            <span className="flex items-center gap-1.5" title="Views">
              <Eye className="h-3.5 w-3.5" />
              {views}
            </span>
          </div>
        </div>

        {/* Time posted */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{timeAgo(created_at)}</span>
          <span className="text-primary font-medium" title="Trending Score">
            Score: {trending_score.toFixed(2)}
          </span>
        </div>
      </article>
    </Link>
  );
}
