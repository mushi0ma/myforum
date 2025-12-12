import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, GitFork } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  code: string; // Текст кода для подсветки
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
    <article className="rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-primary/50">

      {/* Post Header - Author Info */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
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
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
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

      {/* Code Block with Syntax Highlighting */}
      <div className="overflow-x-auto code-scrollbar">
        <SyntaxHighlighter
          language={language.toLowerCase()}
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
          {code}
        </SyntaxHighlighter>
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
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-red-400"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-primary"
            onClick={(e) => e.preventDefault()}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-green-400"
            onClick={(e) => e.preventDefault()}
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
            onClick={(e) => e.preventDefault()}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={(e) => e.preventDefault()}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );

  if (id) {
    return (
      <Link to={`/post/${id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
