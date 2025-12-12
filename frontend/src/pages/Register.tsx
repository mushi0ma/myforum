import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import heroImage from '@/assets/monkey-hero.svg';
import logo from '@/assets/GitForum logo.svg';
import googleLogo from '@/assets/Google_Symbol_0.svg';
import githubLogo from '@/assets/github-mark-white.svg';
import gitlabLogo from '@/assets/gitlab-icon.svg';
import discordLogo from '@/assets/Discord-Symbol-Blurple.svg';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Zod schema for registration validation
const registerSchema = z.object({
  username: z.string().min(3, 'Имя пользователя должно содержать минимум 3 символа'),
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
  password: z.string()
    .min(8, 'Минимум 8 символов')
    .regex(/\d/, 'Минимум 1 цифра')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Минимум 1 спецсимвол (!@#$%^&*)'),
  confirmPassword: z.string().min(1, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  // Password requirements checks for UI display
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration data:', data);
      toast.success('Регистрация успешна!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Ошибка регистрации. Попробуйте снова.');
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[#000000]">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#1a1d1f] to-[#000000]"></div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1d1f]/0 via-[#1a1d1f]/20 to-[#000000]/0 opacity-50"></div>

      {/* Left side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-8 text-center group">
            {/* Logo with synchronized effects */}
            <div className="inline-flex items-center justify-center mb-5">
              <div className="relative cursor-pointer">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                <img
                  src={logo}
                  alt="GitForum Logo"
                  className="h-20 w-auto relative z-10 drop-shadow-2xl transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Title with synchronized effects */}
            <div className="relative inline-block cursor-pointer">
              {/* Glow effect background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#58a6ff]/0 via-[#58a6ff]/20 to-[#3fb950]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700"></div>

              <div className="relative">
                <h1 className="text-4xl font-bold tracking-tight mb-2 transition-all duration-500 group-hover:scale-[1.03] group-hover:tracking-wide">
                  <span className="bg-gradient-to-r from-[#ffffff] via-[#58a6ff] to-[#ffffff] bg-clip-text text-transparent bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-1000 ease-out">
                    GitForum
                  </span>
                </h1>
                <p className="text-[#656869] text-sm font-medium transition-all duration-500 group-hover:text-[#58a6ff] group-hover:tracking-widest group-hover:translate-y-0.5">
                  Присоединяйтесь к сообществу
                </p>
              </div>

              {/* Animated underline */}
              <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out shadow-[0_0_8px_rgba(88,166,255,0.5)]"></div>
            </div>
          </div>

          {/* Registration Form Card */}
          <div className="bg-[#1a1d1f]/80 backdrop-blur-sm border border-[#333637] rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Username Input */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-[#ffffff] mb-2.5 text-sm font-medium">
                  Имя пользователя
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#656869] group-focus-within:text-[#58a6ff] transition-colors" size={18} />
                  <input
                    type="text"
                    id="username"
                    {...register('username')}
                    placeholder="Введите имя пользователя"
                    className={`w-full bg-[#000000] border border-[#333637] rounded-lg pl-12 pr-4 py-3.5 text-[#ffffff] placeholder-[#656869] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all ${errors.username
                        ? 'border-[#da3633] focus:border-[#da3633] focus:ring-2 focus:ring-[#da3633]/30'
                        : 'border-[#333637] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30'
                      }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-[#da3633] text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-[#ffffff] mb-2.5 text-sm font-medium">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#656869] group-focus-within:text-[#58a6ff] transition-colors" size={18} />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="Введите email"
                    className={`w-full bg-[#000000] border rounded-lg pl-12 pr-4 py-3.5 text-[#ffffff] placeholder-[#656869] focus:outline-none transition-all ${errors.email
                        ? 'border-[#da3633] focus:border-[#da3633] focus:ring-2 focus:ring-[#da3633]/30'
                        : 'border-[#333637] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[#da3633] text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-[#ffffff] mb-2.5 text-sm font-medium">
                  Пароль
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#656869] group-focus-within:text-[#58a6ff] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register('password')}
                    onFocus={() => setShowPasswordHint(true)}
                    onBlur={() => setShowPasswordHint(false)}
                    placeholder="Введите пароль"
                    className={`w-full bg-[#000000] border border-[#333637] rounded-lg pl-12 pr-12 py-3.5 text-[#ffffff] placeholder-[#656869] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all ${errors.password
                        ? 'border-[#da3633] focus:border-[#da3633] focus:ring-2 focus:ring-[#da3633]/30'
                        : 'border-[#333637] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#656869] hover:text-[#ffffff] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Requirements Popup */}
                {showPasswordHint && (
                  <div className="absolute z-20 mt-2 w-full bg-[#1a1d1f] border border-[#333637] rounded-lg p-3 shadow-2xl">
                    <p className="text-[#ffffff] text-xs font-medium mb-2">Требования к паролю:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        {hasMinLength ? (
                          <CheckCircle2 size={14} className="text-[#3fb950] flex-shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-[#da3633] flex-shrink-0" />
                        )}
                        <span className={hasMinLength ? "text-[#3fb950]" : "text-[#da3633]"}>
                          Минимум 8 символов
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {hasNumber ? (
                          <CheckCircle2 size={14} className="text-[#3fb950] flex-shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-[#da3633] flex-shrink-0" />
                        )}
                        <span className={hasNumber ? "text-[#3fb950]" : "text-[#da3633]"}>
                          Минимум 1 цифра
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {hasSpecialChar ? (
                          <CheckCircle2 size={14} className="text-[#3fb950] flex-shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-[#da3633] flex-shrink-0" />
                        )}
                        <span className={hasSpecialChar ? "text-[#3fb950]" : "text-[#da3633]"}>
                          Минимум 1 спецсимвол (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && !showPasswordHint && (
                  <p className="text-[#da3633] text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block text-[#ffffff] mb-2.5 text-sm font-medium">
                  Подтвердите пароль
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#656869] group-focus-within:text-[#58a6ff] transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    placeholder="Повторите пароль"
                    className={`w-full bg-[#000000] border rounded-lg pl-12 pr-12 py-3.5 text-[#ffffff] placeholder-[#656869] focus:outline-none transition-all ${errors.confirmPassword
                        ? 'border-[#da3633] focus:border-[#da3633] focus:ring-2 focus:ring-[#da3633]/30'
                        : 'border-[#333637] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#656869] hover:text-[#ffffff] transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[#da3633] text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636] text-white font-semibold py-3.5 rounded-lg mb-3 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#238636]/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 group/btn"
              >
                {/* Wipe animation overlay */}
                <span className={`absolute inset-0 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] transform origin-left transition-transform duration-700 ${isSubmitting ? 'scale-x-100' : 'scale-x-0'}`}></span>
                <span className="relative z-10">{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333637]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1d1f] text-[#656869] font-medium">или</span>
              </div>
            </div>

            {/* Social Login Buttons - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => window.location.href = 'http://34.66.184.215.nip.io/api/forum/accounts/google/login/'} className="group/social bg-[#000000] border border-[#333637] hover:border-[#58a6ff] text-[#ffffff] hover:text-[#58a6ff] py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#58a6ff]/20">
                <img src={googleLogo} alt="Google" className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover/social:scale-110" />
                <span className="text-sm font-medium leading-none">Google</span>
              </button>

              <button onClick={() => window.location.href = 'http://34.66.184.215.nip.io/api/forum/accounts/github/login/'} className="group/social bg-[#000000] border border-[#333637] hover:border-[#58a6ff] text-[#ffffff] hover:text-[#58a6ff] py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#58a6ff]/20">
                <img src={githubLogo} alt="GitHub" className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover/social:scale-110" />
                <span className="text-sm font-medium leading-none">GitHub</span>
              </button>

              <button onClick={() => window.location.href = 'http://34.66.184.215.nip.io/api/forum/accounts/gitlab/login/'} className="group/social bg-[#000000] border border-[#333637] hover:border-[#58a6ff] text-[#ffffff] hover:text-[#58a6ff] py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#58a6ff]/20">
                <img src={gitlabLogo} alt="GitLab" className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover/social:scale-110" />
                <span className="text-sm font-medium leading-none">GitLab</span>
              </button>

              <button onClick={() => window.location.href = 'http://34.66.184.215.nip.io/api/forum/accounts/discord/login/'} className="group/social bg-[#000000] border border-[#333637] hover:border-[#58a6ff] text-[#ffffff] hover:text-[#58a6ff] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#58a6ff]/20">
                <img src={discordLogo} alt="Discord" className="w-5 h-5 flex-shrink-0 object-contain transition-all duration-300 group-hover/social:scale-110" />
                <span className="text-sm font-medium leading-none">Discord</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm mt-5">
            <span className="text-[#656869]">Уже есть аккаунт? </span>
            <Link to="/" className="text-[#58a6ff] hover:text-[#656869] transition-colors font-medium hover:underline">
              Войти
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-4 mb-3 text-xs text-[#656869]">
              <a href="#" className="hover:text-[#58a6ff] transition-colors">Условия</a>
              <span>•</span>
              <a href="#" className="hover:text-[#58a6ff] transition-colors">Конфиденциальность</a>
              <span>•</span>
              <a href="#" className="hover:text-[#58a6ff] transition-colors">Безопасность</a>
            </div>
            <p className="text-[#656869] text-xs">
              © 2025 GitForum
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#000000]/30"></div>
        </div>
      </div>
    </div>
  );
}
