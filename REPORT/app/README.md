# CineSwipe — Tinder для фильмов

Приложение для быстрого выбора фильмов в стиле Tinder: свайпай карточки вправо, если фильм нравится, и влево — если нет.

## Технологии

| Технология | Версия | Назначение |
|---|---|---|
| React | 18 | UI-фреймворк, компонентный подход |
| Vite | 5 | Сборщик и dev-server |
| TypeScript | 5 | Статическая типизация |
| Tailwind CSS | 3 | Утилитарные стили, тёмная тема |
| Framer Motion | 11 | Анимации карточек (drag, swipe, AnimatePresence) |
| Zustand | 4 | Глобальное состояние (очередь, лайки, жанры) |
| Axios | 1 | HTTP-запросы к TMDB API |

## Запуск

### 1. (Опционально) Получи API-ключ TMDB

Зарегистрируйся на [themoviedb.org](https://www.themoviedb.org/) → Settings → API → создай ключ (бесплатно). Если TMDB недоступен в твоём регионе, приложение автоматически использует встроенный набор из 30 фильмов.

```bash
cp .env.example .env
# Вставь свой ключ в VITE_TMDB_KEY
```

### 2. Установи зависимости и запусти

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:5173](http://localhost:5173).

### Сборка для продакшена

```bash
npm run build
npm run preview
```

## Скриншот стартовой страницы

> Тёмный интерфейс с карточкой фильма посередине, жанровыми фильтрами сверху и кнопками Like/Dislike снизу.

![Стартовая страница](./screenshot.png)

## Структура проекта

```
src/
├── api/
│   └── tmdb.ts           # Axios-клиент TMDB API
├── components/
│   ├── MovieCard.tsx      # Карточка с drag-анимацией
│   ├── CardStack.tsx      # Стек из 3 видимых карточек
│   ├── ActionButtons.tsx  # Кнопки Like/Dislike
│   └── LikedMovies.tsx    # Боковая панель понравившихся
├── store/
│   └── useMovieStore.ts   # Zustand store
├── types/
│   └── movie.ts           # TypeScript типы
├── App.tsx
└── main.tsx
```
