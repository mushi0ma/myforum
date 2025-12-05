# Frontend

Чистый React фронтенд проект с Vite и Tailwind CSS.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Структура проекта

```
frontend-clean/
├── public/
│   └── fonts/          # Шрифты
├── src/
│   ├── assets/         # Изображения и SVG
│   ├── components/     # React компоненты
│   │   ├── ui/         # UI компоненты (shadcn/ui)
│   │   └── figma/      # Figma компоненты
│   ├── pages/          # Страницы приложения
│   ├── App.tsx         # Главный компонент
│   ├── main.tsx        # Точка входа
│   └── index.css       # Глобальные стили
├── index.html          # HTML шаблон
└── package.json        # Зависимости
```

## Технологии

- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 4.1.17
- TypeScript
- Radix UI
- React Router
