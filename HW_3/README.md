# E-commerce Admin Panel

Административная панель для e-commerce системы, разработанная с использованием React, TypeScript, Redux Toolkit и RTK Query.

## Запуск проекта

1.  **Установка зависимостей:**
    ```bash
    npm install
    ```

2.  **Запуск в режиме разработки:**
    ```bash
    npm run dev
    ```

3.  **Сборка для продакшена:**
    ```bash
    npm run build
    ```

## Архитектура

Проект построен на основе методологии Feature-Sliced Design

### Структура папок (`src/`)

*   **`app/`** — Инициализация приложения (store, router, глобальные стили)
*   **`pages/`** — Страницы приложения (Login, Dashboard, Products, Profile, Settings)
*   **`widgets/`** — Самостоятельные UI-блоки (Header, Sidebar, Layout)
*   **`features/`** — Бизнес-фичи (Auth, Settings)
*   **`entities/`** — Бизнес-сущности (Product, User)
*   **`shared/`** — Переиспользуемый код (UI-кит, хуки, конфиги, типы)

## Технологический стек

*   **Core:** React 18, TypeScript
*   **State Management:** Redux Toolkit
*   **Data Fetching:** RTK Query
*   **Routing:** React Router v6
*   **i18n:** i18next, react-i18next
*   **Build Tool:** Vite
*   **Styling:** CSS Modules

## Функциональность

1.  **Авторизация:**
    *   Вход по логину/паролю (DummyJSON API).
    *   Сохранение сессии (localStorage).
    *   Защищенные маршруты (`RequireAuth`).
2.  **Продукты:**
    *   Список продуктов с пагинацией.
    *   Поиск по названию (с debounce).
    *   Детальная страница продукта.
3.  **Профиль:**
    *   Отображение данных пользователя.
4.  **Настройки:**
    *   Смена темы (светлая/темная).
    *   Смена языка (русский/английский).
    *   Настройка количества элементов на странице.
