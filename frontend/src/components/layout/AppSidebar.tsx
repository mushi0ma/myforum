import {
    Home,
    Hash,
    Flame,
    Bookmark,
    User,
    Settings,
    LogOut,
    Code2,
    GitBranch
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ==========================================
// FUTURE: Split navigation into Forum & Git tabs
// ==========================================
// Forum items: Home, Explore, Trending, Bookmarks (forum posts)
// Git items: Repositories, Commits, Pull Requests, Issues
// Use <Tabs> component to switch between Forum/Git modes
// ==========================================

// Menu navigation (adapted from donor project)
const forumItems = [
    { title: "Home", url: "/main", icon: Home },
    { title: "Explore", url: "/explore", icon: Hash },
    { title: "Trending", url: "/trending", icon: Flame },
    { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
];

// FUTURE: Git items (uncomment when ready)
// const gitItems = [
//   { title: "Repositories", url: "/repos", icon: GitBranch },
//   { title: "Commits", url: "/commits", icon: GitCommit },
//   { title: "Pull Requests", url: "/pulls", icon: GitPullRequest },
//   { title: "Issues", url: "/issues", icon: AlertCircle },
// ];

const utilityItems = [
    { title: "AI Tools", url: "/test-ai", icon: Code2 },
    { title: "Profile", url: "/profile", icon: User },
    { title: "Settings", url: "/settings", icon: Settings },
];

// Combine all items for now (FUTURE: separate by tabs)
const items = [...forumItems, ...utilityItems];

export function AppSidebar() {
    const location = useLocation(); // Хук React Router для подсветки активной ссылки

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border/50 p-4">
                <Link to="/main" className="flex items-center gap-2 font-mono font-bold text-xl text-primary">
                    <GitBranch className="h-6 w-6" />
                    <span>GitForum</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Forum Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        className="font-medium"
                                    >
                                        <Link to={item.url}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/logout" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Мини-профиль снизу (идея из дизайна партнера) */}
                <div className="mt-4 flex items-center gap-3 px-2">
                    <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold">My User</span>
                        <span className="text-[10px] text-muted-foreground">Pro Member</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}