import { Link } from "react-router-dom";
import { TrendingUp, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Временные данные (позже заменим на API запрос)
const trendingRepos = [
    { name: "react-query-utils", author: "tanstack", stars: "2.4k" },
    { name: "next-auth-helpers", author: "authjs", stars: "1.8k" },
    { name: "tailwind-animate", author: "jamiebuilds", stars: "956" },
    { name: "zod-form-data", author: "airjp73", stars: "742" },
];

const topContributors = [
    { name: "Sarah Chen", username: "sarahcodes", avatar: "", posts: 142 },
    { name: "Alex Rivera", username: "arivera", avatar: "", posts: 98 },
    { name: "Jordan Kim", username: "jkim_dev", avatar: "", posts: 87 },
];

export function Widgets() {
    return (
        <aside className="w-full space-y-6">

            {/* Блок Трендов */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Trending Repos</h3>
                </div>
                <div className="flex flex-col gap-1">
                    {trendingRepos.map((repo) => (
                        <Link
                            key={repo.name}
                            to={`/repo/${repo.author}/${repo.name}`}
                            className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors group"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{repo.name}</span>
                                <span className="text-xs text-muted-foreground">@{repo.author}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded text-xs">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span>{repo.stars}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Блок Топ Контрибьюторов */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-4 pb-2 border-b border-border/50">Top Contributors</h3>
                <div className="flex flex-col gap-3">
                    {topContributors.map((contributor, index) => (
                        <Link
                            key={contributor.username}
                            to={`/u/${contributor.username}`}
                            className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                        >
                            <span className="text-xs font-mono text-muted-foreground w-4 text-center">{index + 1}</span>
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src={contributor.avatar} />
                                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate">{contributor.name}</span>
                                <span className="text-xs text-muted-foreground">@{contributor.username}</span>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                                {contributor.posts}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}