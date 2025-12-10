import { Link } from 'react-router-dom';
import { Search, Bell, Plus, User } from 'lucide-react';
import logo from '@/assets/GitForum logo.svg';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        
        {/* Левая часть: Триггер сайдбара + Логотип + Поиск */}
        <div className="flex items-center gap-4 flex-1">
          {/* Кнопка открытия/закрытия сайдбара */}
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

          {/* Логотип */}
          <Link to="/main" className="flex items-center gap-2 flex-shrink-0 mr-4">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-bold hidden md:block font-mono tracking-tight text-lg">GitForum</span>
          </Link>

          {/* Поиск */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search ( / )"
              className="w-full bg-muted/50 border border-transparent rounded-md py-1.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground hover:bg-muted"
            />
          </div>
        </div>

        {/* Правая часть: Действия */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Bell size={20} />
          </button>

          <Link to="/new">
            <Button size="sm" className="hidden md:flex gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm">
              <Plus size={16} />
              <span>New Post</span>
            </Button>
          </Link>

          <Link to="/profile">
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
              <User size={18} className="text-muted-foreground" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}