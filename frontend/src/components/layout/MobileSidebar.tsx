import {
  Home,
  Hash,
  Flame,
  Bookmark,
  User,
  Settings,
  LogOut,
  GitBranch,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Navigation items (shared with AppSidebar)
const items = [
  { title: "Home", url: "/main", icon: Home },
  { title: "Explore", url: "/explore", icon: Hash },
  { title: "Trending", url: "/trending", icon: Flame },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b border-border/50 p-4">
          <SheetTitle asChild>
            <Link
              to="/main"
              className="flex items-center gap-2 font-mono font-bold text-xl text-primary"
              onClick={() => onOpenChange(false)}
            >
              <GitBranch className="h-6 w-6" />
              <span>GitForum</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-5rem)]">
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.url;

              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
                    isActive && "bg-primary/10 text-primary shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer with User Profile and Sign Out */}
          <div className="border-t border-border/50 p-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
              asChild
            >
              <Link to="/logout" onClick={() => onOpenChange(false)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">My User</span>
                <span className="text-[10px] text-muted-foreground">Pro Member</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
