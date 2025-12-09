import { Outlet, Link } from 'react-router-dom';
import { Search, Bell, Plus, User, Menu, Home, Compass, GitBranch, Bookmark } from 'lucide-react';
import logo from '@/assets/GitForum logo.svg';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#000000] text-[#ffffff] selection:bg-[#58a6ff] selection:text-white">

            {/* === ГЛОБАЛЬНЫЙ ФОН === */}
            {/* Единый градиент для всех страниц внутри лейаута */}
            <div className="fixed inset-0 bg-gradient-radial from-[#1a1d1f]/20 via-[#000000] to-[#000000] pointer-events-none z-0"></div>

            {/* === HEADER === */}
            <header className="sticky top-0 z-50 border-b border-[#333637] bg-[#0d1117]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Левая часть: Лого + Мобильное меню */}
                    <div className="flex items-center gap-4 w-full max-w-2xl">

                        {/* Мобильное меню (Гамбургер) - видно только на маленьких экранах */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-[#656869] hover:text-white">
                                        <Menu size={20} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-[#0d1117] border-[#333637] text-white">
                                    <div className="flex items-center gap-3 mb-8">
                                        <img src={logo} alt="Logo" className="h-8 w-8" />
                                        <span className="font-bold text-xl font-mono">GitForum</span>
                                    </div>
                                    <nav className="space-y-2">
                                        {[
                                            { icon: Home, label: 'Моя лента', to: '/main' },
                                            { icon: Compass, label: 'Популярное', to: '/popular' },
                                            { icon: GitBranch, label: 'Репозитории', to: '/repos' },
                                            { icon: Bookmark, label: 'Закладки', to: '/saved' },
                                        ].map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className="flex items-center gap-3 px-3 py-2 rounded-md text-[#c9d1d9] hover:bg-[#1a1d1f] hover:text-[#58a6ff] transition-colors"
                                            >
                                                <item.icon size={18} />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Логотип (скрыт на мобильном, если мешает, или оставляем) */}
                        <Link to="/main" className="flex items-center gap-2 flex-shrink-0">
                            <img src={logo} alt="Logo" className="h-8 w-8" />
                            <span className="font-bold hidden md:block font-mono tracking-tight">GitForum</span>
                        </Link>

                        {/* Поиск */}
                        <div className="relative w-full hidden sm:block max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656869]" size={16} />
                            <input
                                type="text"
                                placeholder="Поиск ( / )"
                                className="w-full bg-[#000000] border border-[#333637] rounded-md py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all placeholder-[#656869]"
                            />
                        </div>
                    </div>

                    {/* Правая часть: Действия */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button className="p-2 text-[#656869] hover:text-[#58a6ff] transition-colors">
                            <Bell size={20} />
                        </button>

                        <button className="hidden md:flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-lg shadow-[#238636]/20">
                            <Plus size={16} />
                            <span>Новый пост</span>
                        </button>

                        {/* Аватарка -> Ссылка на Профиль */}
                        <Link to="/profile">
                            <div className="w-8 h-8 rounded-full bg-[#1a1d1f] border border-[#333637] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#58a6ff] transition-colors">
                                {/* Здесь можно будет подставить реальную аватарку юзера */}
                                <User size={18} className="text-[#656869]" />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* === КОНТЕНТ СТРАНИЦЫ === */}
            <main className="relative z-10">
                <Outlet />
            </main>

        </div>
    );
}