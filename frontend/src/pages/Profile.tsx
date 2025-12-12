import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Book,
    GitFork,
    Star,
    Users,
    Building2,
    MapPin,
    Link as LinkIcon,
    Mail,
    Calendar,
    Package,
    FolderKanban,
    BookMarked,
    Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// --- MOCK DATA ---
const userData = {
    name: 'Алексей Петров',
    username: 'alexdev',
    avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    bio: 'Full-stack разработчик. Увлекаюсь Open Source, машинным обучением и созданием инструментов для разработчиков. Люблю чистый код и хорошую документацию.',
    company: 'GitForum Inc.',
    location: 'Москва, Россия',
    website: 'https://alexdev.io',
    email: 'alex@gitforum.dev',
    followers: 1247,
    following: 89,
    joinedDate: 'Январь 2021',
};

const repositories = [
    {
        id: 1,
        name: 'gitforum-cli',
        description: 'Командная утилита для работы с GitForum из терминала. Поддерживает все основные операции.',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stars: 342,
        forks: 56,
        isPublic: true,
    },
    {
        id: 2,
        name: 'react-markdown-editor',
        description: 'Современный редактор Markdown с поддержкой синтаксиса GFM и превью в реальном времени.',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stars: 891,
        forks: 124,
        isPublic: true,
    },
    {
        id: 3,
        name: 'neural-code-review',
        description: 'AI-powered инструмент для автоматического код-ревью с использованием LLM.',
        language: 'Python',
        languageColor: '#3572A5',
        stars: 2103,
        forks: 287,
        isPublic: true,
    },
    {
        id: 4,
        name: 'awesome-devtools',
        description: 'Курируемый список полезных инструментов и ресурсов для разработчиков.',
        language: 'Markdown',
        languageColor: '#ffffff',
        stars: 567,
        forks: 89,
        isPublic: true,
    },
    {
        id: 5,
        name: 'go-microservices',
        description: 'Шаблон для создания микросервисной архитектуры на Go с gRPC и Kubernetes.',
        language: 'Go',
        languageColor: '#00ADD8',
        stars: 445,
        forks: 78,
        isPublic: true,
    },
    {
        id: 6,
        name: 'vim-config',
        description: 'Моя конфигурация Neovim с LSP, автодополнением и кастомными плагинами.',
        language: 'Lua',
        languageColor: '#000080',
        stars: 234,
        forks: 45,
        isPublic: true,
    },
];

// Генерация графика активности
const generateContributions = () => {
    return Array.from({ length: 364 }, () => {
        const random = Math.random();
        if (random < 0.3) return 0;
        if (random < 0.5) return 1;
        if (random < 0.7) return 2;
        if (random < 0.9) return 3;
        return 4;
    });
};

const contributions = generateContributions();

const getContributionColor = (level: number) => {
    // Цвета GitHub Dark Mode
    const colors = [
        'bg-[#161b22]', // 0: Empty
        'bg-[#0e4429]', // 1: Low
        'bg-[#006d32]', // 2: Medium
        'bg-[#26a641]', // 3: High
        'bg-[#39d353]', // 4: Peak
    ];
    return colors[level];
};

export default function Profile() {
    const [activeTab, setActiveTab] = useState('overview');

    const formatNumber = (num: number): string => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        // Убрали внешний контейнер с фоном, так как он есть в Layout
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[296px_1fr] gap-8">

                {/* --- LEFT COLUMN: SIDEBAR --- */}
                <aside className="space-y-6">
                    {/* Avatar */}
                    <div className="group relative">
                        <Avatar className="w-full h-auto aspect-square border-2 border-[#333637] shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                            <AvatarImage src={userData.avatar} alt={userData.name} />
                            <AvatarFallback className="bg-[#1a1d1f] text-[#58a6ff] text-6xl font-bold font-mono">
                                {userData.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {/* Status Icon Placeholder (можно добавить позже) */}
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-[#1a1d1f] border border-[#333637] rounded-full flex items-center justify-center shadow-lg group-hover:border-[#58a6ff] transition-colors cursor-pointer">
                            <span className="text-lg">💻</span>
                        </div>
                    </div>

                    {/* Names */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#ffffff] font-mono tracking-tight">
                            {userData.name}
                        </h1>
                        <p className="text-xl text-[#656869] font-mono">
                            {userData.username}
                        </p>
                    </div>

                    {/* Action Button */}
                    <Link to="/settings">
                        <Button
                            className="w-full bg-[#1a1d1f] border border-[#333637] text-[#ffffff] hover:bg-[#333637] hover:border-[#58a6ff] transition-all font-medium font-sans gap-2"
                        >
                            <Edit2 size={16} />
                            Редактировать профиль
                        </Button>
                    </Link>

                    {/* Bio */}
                    <p className="text-[#ffffff] text-[15px] leading-relaxed font-sans">
                        {userData.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm font-sans">
                        <a href="#" className="flex items-center gap-1.5 text-[#656869] hover:text-[#58a6ff] transition-colors group">
                            <Users size={16} className="group-hover:text-[#58a6ff]" />
                            <span className="font-bold text-[#ffffff] font-mono">{formatNumber(userData.followers)}</span>
                            <span>followers</span>
                        </a>
                        <span className="text-[#333637]">·</span>
                        <a href="#" className="flex items-center gap-1.5 text-[#656869] hover:text-[#58a6ff] transition-colors group">
                            <span className="font-bold text-[#ffffff] font-mono">{userData.following}</span>
                            <span>following</span>
                        </a>
                    </div>

                    <Separator className="bg-[#333637]" />

                    {/* Details List */}
                    <div className="space-y-3 text-sm">
                        {userData.company && (
                            <div className="flex items-center gap-2.5 text-[#ffffff]">
                                <Building2 size={18} className="text-[#656869] flex-shrink-0" />
                                <span className="font-sans font-medium">{userData.company}</span>
                            </div>
                        )}
                        {userData.location && (
                            <div className="flex items-center gap-2.5 text-[#c9d1d9]">
                                <MapPin size={18} className="text-[#656869] flex-shrink-0" />
                                <span className="font-sans">{userData.location}</span>
                            </div>
                        )}
                        {userData.website && (
                            <div className="flex items-center gap-2.5">
                                <LinkIcon size={18} className="text-[#656869] flex-shrink-0" />
                                <a href={userData.website} target="_blank" className="text-[#58a6ff] hover:underline font-sans truncate font-medium">
                                    {userData.website.replace('https://', '')}
                                </a>
                            </div>
                        )}
                        {userData.email && (
                            <div className="flex items-center gap-2.5">
                                <Mail size={18} className="text-[#656869] flex-shrink-0" />
                                <a href={`mailto:${userData.email}`} className="text-[#58a6ff] hover:underline font-sans font-medium">
                                    {userData.email}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-2.5 text-[#656869]">
                            <Calendar size={18} className="flex-shrink-0" />
                            <span className="font-sans">Joined {userData.joinedDate}</span>
                        </div>
                    </div>
                </aside>

                {/* --- RIGHT COLUMN: TABS & CONTENT --- */}
                <main className="min-w-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                        {/* Navigation Tabs */}
                        <TabsList className="bg-transparent border-b border-[#333637] w-full justify-start p-0 h-auto gap-1">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-[#f78166] data-[state=active]:text-[#ffffff] data-[state=active]:font-semibold text-[#656869] border-b-2 border-transparent px-4 py-3 gap-2 rounded-t-lg hover:text-[#c9d1d9] hover:bg-[#1a1d1f]/50 transition-all"
                            >
                                <Book size={16} />
                                <span className="font-sans">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="repositories"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-[#f78166] data-[state=active]:text-[#ffffff] data-[state=active]:font-semibold text-[#656869] border-b-2 border-transparent px-4 py-3 gap-2 rounded-t-lg hover:text-[#c9d1d9] hover:bg-[#1a1d1f]/50 transition-all"
                            >
                                <BookMarked size={16} />
                                <span className="font-sans">Repositories</span>
                                <span className="ml-1 px-2 py-0.5 text-xs bg-[#333637] text-white rounded-full font-mono">
                                    {repositories.length}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-[#f78166] data-[state=active]:text-[#ffffff] text-[#656869] border-b-2 border-transparent px-4 py-3 gap-2 rounded-t-lg hover:text-[#c9d1d9] hover:bg-[#1a1d1f]/50 transition-all"
                            >
                                <FolderKanban size={16} />
                                <span className="font-sans">Projects</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="packages"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-[#f78166] data-[state=active]:text-[#ffffff] text-[#656869] border-b-2 border-transparent px-4 py-3 gap-2 rounded-t-lg hover:text-[#c9d1d9] hover:bg-[#1a1d1f]/50 transition-all"
                            >
                                <Package size={16} />
                                <span className="font-sans">Packages</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* === OVERVIEW TAB === */}
                        <TabsContent value="overview" className="mt-6 space-y-6">

                            {/* Popular Repos Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-normal text-[#ffffff] font-mono">Popular repositories</h2>
                                    <a href="#" className="text-xs text-[#58a6ff] hover:underline font-sans">Customize your pins</a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {repositories.slice(0, 6).map((repo) => (
                                        <Card
                                            key={repo.id}
                                            className="bg-[#0d1117] border-[#333637] hover:border-[#58a6ff]/50 transition-all group cursor-pointer"
                                        >
                                            <CardHeader className="pb-2 pt-4 px-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <BookMarked size={16} className="text-[#656869] group-hover:text-[#58a6ff] transition-colors" />
                                                        <CardTitle className="text-[15px] font-bold">
                                                            <a href="#" className="text-[#58a6ff] group-hover:underline font-mono">
                                                                {repo.name}
                                                            </a>
                                                        </CardTitle>
                                                    </div>
                                                    <span className="px-2 py-0.5 text-[10px] border border-[#333637] rounded-full text-[#656869] font-mono uppercase tracking-wide">
                                                        Public
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="px-4 pb-4">
                                                <p className="text-xs text-[#8b949e] mb-4 line-clamp-2 font-sans min-h-[32px]">
                                                    {repo.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-[#656869]">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-2.5 h-2.5 rounded-full border border-[#ffffff]/10" style={{ backgroundColor: repo.languageColor }} />
                                                        <span className="font-sans text-[#8b949e]">{repo.language}</span>
                                                    </div>
                                                    {repo.stars > 0 && (
                                                        <div className="flex items-center gap-1 hover:text-[#58a6ff]">
                                                            <Star size={14} />
                                                            <span className="font-mono">{formatNumber(repo.stars)}</span>
                                                        </div>
                                                    )}
                                                    {repo.forks > 0 && (
                                                        <div className="flex items-center gap-1 hover:text-[#58a6ff]">
                                                            <GitFork size={14} />
                                                            <span className="font-mono">{repo.forks}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Contribution Graph */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-normal text-[#ffffff] font-mono">Contributions in the last year</h2>
                                    <span className="text-xs text-[#656869] font-mono">Total: 1,843</span>
                                </div>

                                <Card className="bg-[#0d1117] border-[#333637] p-4">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto pb-2">
                                            <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px] min-w-max">
                                                {contributions.map((level, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-[11px] h-[11px] rounded-sm ${getContributionColor(level)} border border-[#ffffff]/5 hover:ring-1 hover:ring-[#ffffff]/50 transition-all cursor-pointer`}
                                                        title={`${level} contributions on date...`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-[#656869] font-sans">
                                            <span>Less</span>
                                            {[0, 1, 2, 3, 4].map((level) => (
                                                <div key={level} className={`w-[10px] h-[10px] rounded-sm ${getContributionColor(level)} border border-[#ffffff]/5`} />
                                            ))}
                                            <span>More</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* === OTHER TABS (Placeholders) === */}
                        <TabsContent value="repositories" className="mt-6 text-[#656869] text-center font-mono py-10">
                            Full repository list will be here.
                        </TabsContent>
                        <TabsContent value="projects" className="mt-6 text-[#656869] text-center font-mono py-10">
                            Projects section coming soon.
                        </TabsContent>
                        <TabsContent value="packages" className="mt-6 text-[#656869] text-center font-mono py-10">
                            Packages section coming soon.
                        </TabsContent>

                    </Tabs>
                </main>
            </div>
        </div>
    );
}