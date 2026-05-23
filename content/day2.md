# 🎯 ДЕНЬ 2 (Осталось 2 дня): SDLC/Agile + API + SQL JOIN/Aggregation

## Режим дня

- Общая длительность: `8-10` часов
- Цель: уметь уверенно отвечать на процессные и архитектурные вопросы + закрыть SQL средний уровень.

---

## Блок A: SDLC/STLC/Agile — подробно

### 1. SDLC (Software Development Life Cycle — жизненный цикл разработки ПО)

Типовая цепочка:
1. Discovery / Planning (исследование и планирование)
2. Requirements (сбор и уточнение требований)
3. Design (проектирование)
4. Implementation (разработка)
5. Testing (тестирование)
6. Release (релиз)
7. Maintenance (поддержка)

### 2. STLC (Software Testing Life Cycle — жизненный цикл тестирования)

1. Requirement Analysis (анализ требований)
2. Test Planning (планирование тестирования)
3. Test Design (дизайн тестов)
4. Test Environment Setup (подготовка окружения)
5. Test Execution (выполнение тестов)
6. Defect Reporting (заведение дефектов)
7. Test Closure (закрытие цикла тестирования)

### 3. Scrum (Скрам)

- **Sprint (спринт)** — фиксированный итерационный период.
- **Sprint Planning (планирование спринта)** — выбор задач.
- **Daily Scrum (ежедневный стендап)** — короткая синхронизация.
- **Sprint Review (обзор спринта)** — демонстрация результата.
- **Sprint Retrospective (ретроспектива)** — улучшение процесса.

### 4. Kanban (Канбан)

- Непрерывный поток задач.
- **WIP limit (лимит незавершенной работы)**.
- Фокус на времени прохождения задачи.

### 5. Сущности и артефакты

- **User Story (пользовательская история)**
- **Acceptance Criteria (критерии приемки)**
- **Definition of Done (критерии завершенности)**
- **Task (задача)**
- **Bug (дефект)**
- **Epic (эпик)**
- **Backlog (бэклог)**

### 6. Роли

- **QA Engineer (инженер по тестированию)**
- **Developer (разработчик)**
- **Product Owner (владелец продукта)**
- **Project Manager (менеджер проекта)**
- **Business Analyst (бизнес-аналитик)**
- **DevOps Engineer (девопс-инженер)**

---

## Блок B: Клиент-сервер и API — системно

### 1. Клиент-серверная модель

- **Client (клиент)** — UI, отправляет запрос.
- **Server (сервер)** — обрабатывает запрос, возвращает ответ.
- **Database (база данных)** — хранит данные.

Схема: `Client -> API -> Service -> Database -> Response`.

### 2. HTTP основы

- **GET (получение)**
- **POST (создание)**
- **PUT (полная замена)**
- **PATCH (частичное обновление)**
- **DELETE (удаление)**

### 3. Коды ответов

- `2xx` — успех
- `4xx` — ошибка клиента
- `5xx` — ошибка сервера

Критичные:
- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized (не авторизован)`
- `403 Forbidden (доступ запрещен)`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

### 4. API Contract (API контракт)

Что QA проверяет:
- обязательные поля **Required fields (обязательные поля)**;
- типы данных **Data types (типы данных)**;
- формат даты/времени;
- набор возможных статусов;
- сообщения об ошибках и структура error-response.

### 5. Негативные API сценарии

- отсутствует обязательное поле;
- неверный тип (строка вместо числа);
- невалидный token (токен);
- недостаточно прав;
- повторная отправка запроса **Duplicate request (дублирующий запрос)**;
- граничные значения.

### 6. Логическая кейс-задача для интервью

"Есть endpoint создания заказа. Что проверяешь?"

Структурный ответ:
1. Happy path (позитивный сценарий)
2. Validation (валидация входа)
3. Auth/AuthZ (аутентификация/авторизация)
4. Idempotency (идемпотентность) при повторах
5. Data consistency (консистентность данных) в БД
6. Error handling (обработка ошибок)

---

## Блок C: SQL Средний уровень — JOIN + GROUP BY + HAVING

### 1. JOIN типы

1. **INNER JOIN (внутреннее соединение)**
- Возвращает только совпавшие записи из обеих таблиц.

2. **LEFT JOIN (левое соединение)**
- Возвращает все строки из левой таблицы + совпадения справа.
- Если совпадения нет, справа `NULL`.

```sql
SELECT u.user_id, u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

### 2. GROUP BY (группировка)

```sql
SELECT user_id, COUNT(*) AS orders_count
FROM orders
GROUP BY user_id;
```

### 3. HAVING (фильтрация после группировки)

```sql
SELECT user_id, COUNT(*) AS orders_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 1;
```

### 4. WHERE vs HAVING

- **WHERE (фильтрация до группировки)**
- **HAVING (фильтрация после группировки)**

### 5. Практические QA-запросы

1. Пользователи без заказов
```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

2. Топ пользователей по сумме paid-заказов
```sql
SELECT user_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY user_id
ORDER BY total_paid DESC;
```

---

## Блок D: Финальный чек дня

- Ты уверенно объясняешь SDLC/STLC/Agile.
- Понимаешь API проверки от контракта до логики ошибок.
- Пишешь JOIN/GROUP BY/HAVING без паники.

## Блок E: Устная разминка

1. Разница 401 и 403.
2. Что такое API контракт.
3. Почему LEFT JOIN нужен для поиска «без связей».
4. Где применяется HAVING.
