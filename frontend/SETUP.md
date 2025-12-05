# Установка и Запуск

## Требования

- Node.js 18+
- npm 9+

## Установка зависимостей

```bash
npm install
```

## Режим разработки

Запустить dev-сервер на http://localhost:3000:

```bash
npm run dev
```

## Сборка для production

```bash
npm run build
```

Результат сборки будет в папке `dist/`.

## Предпросмотр production сборки

```bash
npm run preview
```

## Проверка кода (ESLint)

```bash
npm run lint
```

## Структура проекта

```
frontend-clean/
├── public/
│   └── fonts/                  # Шрифты (Reddit Sans Chocolate, Monaspace)
├── src/
│   ├── assets/                 # Изображения, логотипы, SVG
│   ├── components/
│   │   ├── ui/                 # UI компоненты (shadcn/ui, Radix UI)
│   │   └── figma/              # Кастомные Figma компоненты
│   ├── pages/
│   │   ├── Login.tsx           # Страница входа
│   │   └── Register.tsx        # Страница регистрации
│   ├── App.tsx                 # Главный компонент с маршрутизацией
│   ├── main.tsx                # Точка входа приложения
│   └── index.css               # Глобальные стили и CSS-переменные
├── index.html                  # HTML шаблон
├── vite.config.ts              # Конфигурация Vite
├── tailwind.config.js          # Конфигурация Tailwind CSS
├── postcss.config.js           # Конфигурация PostCSS
├── tsconfig.json               # Конфигурация TypeScript
├── eslint.config.js            # Конфигурация ESLint
└── package.json                # Зависимости и скрипты

```

## Технологии

### Core
- **React 19.2.0** - UI библиотека
- **React Router 6.28.0** - Маршрутизация
- **TypeScript** - Типизация
- **Vite 7.2.4** - Сборщик и dev-сервер

### Стили
- **Tailwind CSS 4.1.17** - Utility-first CSS фреймворк
- **@tailwindcss/postcss** - PostCSS плагин для Tailwind CSS 4
- **PostCSS** - CSS процессор
- **Autoprefixer** - Автоматические вендорные префиксы

### UI Компоненты (Radix UI)
- Accordion, Alert Dialog, Avatar, Checkbox
- Dialog, Dropdown Menu, Hover Card, Label
- Navigation Menu, Popover, Progress, Radio Group
- Scroll Area, Select, Separator, Slider
- Switch, Tabs, Toggle, Tooltip и др.

### Дополнительные библиотеки
- **lucide-react** - Иконки
- **react-hook-form** - Работа с формами
- **react-day-picker** - Выбор даты
- **recharts** - Графики и диаграммы
- **sonner** - Toast уведомления
- **vaul** - Drawer компонент
- **embla-carousel** - Карусель
- **cmdk** - Command menu
- **class-variance-authority** - Варианты классов
- **clsx** & **tailwind-merge** - Утилиты для классов

## Шрифты

Проект использует два основных шрифта:

1. **Reddit Sans Chocolate** - основной шрифт (Light, Regular, SemiBold, Bold)
2. **Monaspace Xenon** - моноширинный шрифт для заголовков (Regular, SemiBold, Bold)

Шрифты находятся в `public/fonts/` и подключены через `@font-face` в `index.css`.

## Цветовая схема

Проект использует темную цветовую схему на основе GitHub:

- **Black (#000000)** - основной фон
- **Dark-1 (#1a1d1f)** - карточки и компоненты
- **Dark-2 (#333637)** - границы
- **Gray (#656869)** - приглушенный текст
- **White (#ffffff)** - основной текст
- **Accent (GitHub Blue)** - акцентные элементы

Все цвета определены как CSS-переменные в `:root`.

## Примечания

- Используется `legacy-peer-deps` для совместимости React 19 с библиотеками, которые еще не обновились
- Tailwind CSS 4 использует новый синтаксис `@import "tailwindcss"`
- Настроены path aliases: `@/*` → `./src/*`
- Порт dev-сервера: **3000**
