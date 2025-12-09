import { GitPullRequest } from 'lucide-react';

export default function Main() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Left Sidebar */}
            <aside className="hidden md:block col-span-1 space-y-4">
                <div className="bg-[#1a1d1f] border border-[#333637] rounded-xl p-4">
                    <nav className="space-y-1">
                        {['Моя лента', 'Популярное', 'Репозитории', 'Закладки'].map((item) => (
                            <a key={item} href="#" className="block px-3 py-2 rounded-md text-sm font-medium text-[#ffffff] hover:bg-[#333637] hover:text-[#58a6ff] transition-colors">
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Central Feed */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                {/* Welcome Card */}
                <div className="bg-[#1a1d1f] border border-[#333637] rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Добро пожаловать, <span className="text-[#58a6ff]">Разработчик</span>! 👋</h2>
                    <p className="text-[#656869] mb-4">Вы успешно вошли в систему. Это ваша персональная лента.</p>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors">
                            Создать первый пост
                        </button>
                        <button className="px-4 py-2 bg-[#333637] hover:bg-[#3f4345] text-white rounded-md text-sm font-medium transition-colors">
                            Подключить GitHub
                        </button>
                    </div>
                </div>

                {/* Post Placeholder */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#1a1d1f] border border-[#333637] rounded-xl p-4 hover:border-[#58a6ff]/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 mb-2 text-xs text-[#656869]">
                            <span className="font-bold text-[#ffffff] hover:underline">r/django</span>
                            <span>•</span>
                            <span>2 часа назад</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#58a6ff] transition-colors">
                            Как правильно настроить OAuth в Django Allauth?
                        </h3>
                        <div className="bg-[#0d1117] border border-[#333637] rounded p-3 mb-3 font-mono text-sm text-[#c9d1d9] overflow-x-auto">
                            LOGIN_REDIRECT_URL = '/main'<br />
                            SOCIALACCOUNT_AUTO_SIGNUP = True
                        </div>
                        <div className="flex items-center gap-4 text-[#656869] text-sm">
                            <span className="flex items-center gap-1 hover:text-[#58a6ff]"><GitPullRequest size={14} /> 12 Коммитов</span>
                            <span className="flex items-center gap-1 hover:text-[#58a6ff]">💬 4 Комментария</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Sidebar */}
            <aside className="hidden md:block col-span-1">
                <div className="bg-[#1a1d1f] border border-[#333637] rounded-xl p-4 sticky top-24">
                    <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#656869]">Тренды</h3>
                    <ul className="space-y-3">
                        {['#python', '#react', '#devops', '#opensource'].map(tag => (
                            <li key={tag} className="flex justify-between items-center text-sm group cursor-pointer">
                                <span className="text-[#ffffff] group-hover:text-[#58a6ff] transition-colors">{tag}</span>
                                <span className="text-[#656869] text-xs">1.2k постов</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

        </div>
    );
}