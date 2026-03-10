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
| Axios | 1 | HTTP-запросы к ПоискКино API |

## Запуск

### 1. (Опционально) Получи API-ключ ПоискКино

Зарегистрируйся на [poiskkino.dev](https://poiskkino.dev/) — бесплатно, 200 запросов/день. Без ключа приложение автоматически использует встроенный набор из 10 фильмов.

```bash
cp .env.example .env
# Вставь свой ключ в VITE_KP_KEY
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
