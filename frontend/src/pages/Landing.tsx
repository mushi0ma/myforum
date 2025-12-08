import { Link } from 'react-router-dom';
import { Code2, GitBranch, MessageSquare } from 'lucide-react';
import logo from '@/assets/GitForum logo.svg'; // Убедитесь, что пути к картинкам верные

export default function Landing() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#000000] text-white selection:bg-[#58a6ff] selection:text-white">
            {/* --- BACKGROUND EFFECTS (Точно как в Login) --- */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#1a1d1f] to-[#000000]"></div>
            <div className="absolute inset-0 bg-gradient-radial from-[#1a1d1f]/0 via-[#1a1d1f]/20 to-[#000000]/0 opacity-50"></div>

            {/* --- NAVBAR --- */}
            <nav className="relative z-20 border-b border-[#333637] bg-[#0d1117]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-8 w-8" />
                        <span className="font-bold text-xl tracking-tight">GitForum</span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className="text-sm font-medium text-[#ffffff] hover:text-[#58a6ff] transition-colors py-2">
                            Войти
                        </Link>
                        <Link to="/register" className="text-sm font-medium bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md transition-all shadow-lg shadow-[#238636]/20">
                            Регистрация
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">

                {/* Анимация заголовка (как в Login) */}
                <div className="relative inline-block mb-6 group cursor-default">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#58a6ff]/0 via-[#58a6ff]/20 to-[#3fb950]/0 rounded-2xl opacity-50 blur-2xl"></div>
                    <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight mb-4">
                        Where
                        <span className="bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent px-2">
                            Code
                        </span>
                        Meets
                        <span className="bg-gradient-to-r from-[#58a6ff] to-[#a371f7] bg-clip-text text-transparent px-2">
                            Community
                        </span>
                    </h1>
                </div>

                <p className="text-xl text-[#656869] max-w-2xl mb-10 leading-relaxed">
                    Единая платформа для разработчиков. Обсуждайте архитектуру, делитесь репозиториями
                    и находите решения в формате Reddit + GitHub.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register">
                        <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636] text-white font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl hover:shadow-[#238636]/40 transform hover:-translate-y-1">
                            Начать бесплатно
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="w-full sm:w-auto px-8 py-4 bg-[#1a1d1f] border border-[#333637] hover:border-[#58a6ff] text-white hover:text-[#58a6ff] font-bold rounded-lg transition-all">
                            У меня есть аккаунт
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: GitBranch, title: "Репозитории", desc: "Интеграция с GitHub и GitLab. Следите за обновлениями любимых проектов." },
                        { icon: MessageSquare, title: "Обсуждения", desc: "Ветки обсуждений как на Reddit, но с поддержкой Markdown и сниппетов кода." },
                        { icon: Code2, title: "Сниппеты", desc: "Делитесь красивым кодом с подсветкой синтаксиса в один клик." },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-[#1a1d1f]/50 backdrop-blur-sm border border-[#333637] p-6 rounded-xl hover:border-[#58a6ff]/50 transition-colors group">
                            <div className="w-12 h-12 bg-[#0d1117] rounded-lg flex items-center justify-center mb-4 border border-[#333637] group-hover:border-[#58a6ff] transition-colors">
                                <feature.icon className="text-[#58a6ff]" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-[#656869]">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="relative z-10 border-t border-[#333637] bg-[#0d1117] py-8 mt-auto">
                <div className="text-center text-[#656869] text-sm">
                    © 2025 GitForum. Open Source Community.
                </div>
            </footer>
        </div>
    );
}