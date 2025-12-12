import { useState, useEffect } from "react";
import { PostCard, PostCardProps } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_POSTS: PostCardProps[] = [
  {
    id: "1",
    filename: "src/auth.ts",
    language: "TypeScript",
    author: {
      name: "Alex Rivera",
      username: "arivera",
      avatar: ""
    },
    timestamp: "2 hours ago",
    code: `export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error };
  }
};`,
    likes: 24,
    comments: 5,
    forks: 2,
    tags: ["typescript", "auth", "jwt"]
  },
  {
    id: "2",
    filename: "components/Button.jsx",
    language: "React",
    author: {
      name: "Sarah Chen",
      username: "sarahcodes",
      avatar: ""
    },
    timestamp: "5 hours ago",
    code: `export function Button({ children, onClick }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
}`,
    likes: 156,
    comments: 42,
    forks: 12,
    tags: ["react", "ui", "components"]
  }
];

export default function Main() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono tracking-tight">Your Feed</h1>
        {/* Можно добавить фильтры здесь */}
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-4">
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
          ))
        ) : (
          MOCK_POSTS.map((post) => (
            <PostCard key={post.id} {...post} />
          ))
        )}
      </div>
    </div>
  );
}
