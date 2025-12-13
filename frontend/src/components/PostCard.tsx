import { memo } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, GitFork } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PostCardProps {
  id?: string;
  filename: string;
  language: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  code: string; // Текст кода
  likes: number;
  comments: number;
  forks: number;
  tags: string[];
}

export const PostCard = memo(function PostCard({
  id,
  filename,
  language,
  author,
  timestamp,
  code,
  likes,
  comments,
  forks,
  tags,
}: PostCardProps) {
  const content = (
    <article className="rounded-lg border border-border bg-card text-card-foreground overflow-hidden transition-colors hover:border-primary/50">

      {/* Post Header - Author Info */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{author.name}</span>
            <span className="text-xs text-muted-foreground">
              @{author.username} · {timestamp}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            /* Добавить меню действий */
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Code File Header - Mimics VS Code tab */}
      <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-mono text-sm text-muted-foreground">{filename}</span>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {language}
        </Badge>
      </div>

      {/* Code Block Preview (Lightweight version) */}
      <div 
        className="relative overflow-x-auto code-scrollbar bg-[#1e1e1e] p-4 text-sm"
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }} // CSS Optimization
      >
        <pre className="font-mono text-gray-300">
          <code>
            {/* Обрезаем код для превью, чтобы не перегружать DOM */}
            {code.slice(0, 300)}
            {code.length > 300 && <span className="text-gray-500 opacity-50">...</span>}
          </code>
        </pre>
        {/* Градиент внизу, намекающий, что есть еще код */}
        {code.length > 300 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs font-normal">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-red-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              /* Добавить лайк */
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              /* Открыть комменты */
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-green-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              /* Форкнуть */
            }}
          >
            <GitFork className="h-4 w-4" />
            <span className="text-xs">{forks}</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              /* Сохранить */
            }}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              /* Поделиться */
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );

  if (id) {
    return (
      <Link to={`/post/${id}`} className="block w-full group text-foreground no-underline">
        {content}
      </Link>
    );
  }

  return content;
});
