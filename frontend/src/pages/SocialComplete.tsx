import { useState } from 'react';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function SocialComplete() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Получаем CSRF токен
    const getCookie = (name: string) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email.includes('@')) {
            setError('Введите корректный email');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken') || '');

        try {
            // Отправляем запрос вручную
            const response = await fetch('http://34.66.184.215.nip.io/api/forum/accounts/social/signup/', {
                method: 'POST',
                body: formData,
                redirect: 'manual' // Важно: не следовать за редиректом автоматически
            });

            // Django Allauth при успехе возвращает 302 Redirect.
            // Fetch с 'manual' вернет type: 'opaqueredirect' или статус 0/302.
            // Если же вернулся обычный HTML (статус 200), значит это страница с ошибкой.

            if (response.type === 'opaqueredirect' || response.status === 302) {
                // УСПЕХ! Django принял данные и пытается нас перекинуть.
                // Делаем это вручную.
                window.location.href = '/main';
            } else if (response.ok) {
                // Если статус 200, значит Django вернул страницу с ошибками, а не редирект.
                // Скорее всего, email занят.
                setError('Пользователь с таким email уже существует. Пожалуйста, войдите через логин/пароль и привяжите соцсеть в настройках.');
            } else {
                setError('Произошла ошибка сервера. Попробуйте позже.');
            }

        } catch (err) {
            console.error(err);
            // Иногда успешный редирект (CORS) может упасть в catch, 
            // но если мы на одном домене, это должно работать.
            // На всякий случай проверяем:
            window.location.href = '/main';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#1a1d1f] to-[#000000]"></div>
            <div className="absolute inset-0 bg-gradient-radial from-[#1a1d1f]/0 via-[#1a1d1f]/20 to-[#000000]/0 opacity-50"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-[#1a1d1f]/80 backdrop-blur-sm border border-[#333637] rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-2">Почти готово!</h2>
                <p className="text-[#656869] text-center mb-6 text-sm">
                    Сервис не передал ваш Email. Пожалуйста, введите его вручную.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-[#ffffff] mb-2.5 text-sm font-medium">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#656869]" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите ваш email"
                                className={`w-full bg-[#000000] border rounded-lg pl-12 pr-4 py-3.5 text-[#ffffff] outline-none transition-all ${error ? 'border-[#da3633] focus:border-[#da3633]' : 'border-[#333637] focus:border-[#58a6ff]'
                                    }`}
                                required
                            />
                        </div>
                        {error && (
                            <div className="mt-3 p-3 bg-[#da3633]/10 border border-[#da3633]/20 rounded-lg flex gap-2 items-start">
                                <AlertCircle size={16} className="text-[#da3633] mt-0.5 flex-shrink-0" />
                                <p className="text-[#da3633] text-xs leading-relaxed">{error}</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-[#238636]/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                        {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <a href="/login" className="text-[#656869] text-sm hover:text-[#58a6ff] transition-colors">
                        Отменить и вернуться
                    </a>
                </div>
            </div>
        </div>
    );
}