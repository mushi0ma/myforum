import React from "react";
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
  code: React.ReactNode; // Текст кода или подсвеченный блок
  likes: number;
  comments: number;
  forks: number;
  tags: string[];
}

export function PostCard({
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
    <article className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/50 shadow-sm">
      
      {/* Шапка поста - Автор */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">
              {author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              @{author.username} · {timestamp}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Шапка файла (VS Code style) */}
      <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 opacity-70">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-mono text-sm text-muted-foreground">{filename}</span>
        </div>
        <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
          {language}
        </Badge>
      </div>

      {/* Блок кода */}
      <div className="overflow-x-auto bg-[#0d1117] dark:bg-[#0d1117] bg-zinc-950">
        <pre className="p-4 font-mono text-sm leading-relaxed text-gray-300">
          {code}
        </pre>
      </div>

      {/* Теги */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border bg-card/30">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs font-normal border-primary/20 text-primary/80 hover:bg-primary/10 cursor-pointer">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Действия (Лайки, Комменты) */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 px-2 h-8"
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 px-2 h-8"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-green-400 hover:bg-green-400/10 px-2 h-8"
          >
            <GitFork className="h-4 w-4" />
            <span className="text-xs font-medium">{forks}</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );

  if (id) {
    return (
      <Link to={`/post/${id}`} className="block transition-transform active:scale-[0.99]">
        {content}
      </Link>
    );
  }

  return content;
}