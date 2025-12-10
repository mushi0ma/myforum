import { PostCard, PostCardProps } from "@/components/PostCard";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono tracking-tight">Your Feed</h1>
        {/* Можно добавить фильтры здесь */}
      </div>
      
      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}