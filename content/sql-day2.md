# SQL День 2: JOIN, GROUP BY, HAVING — максимально подробно

## Главная цель дня

- Закрыть самый частый блок лайвкодинга на QA собеседовании: `JOIN + агрегаты`.
- Научиться избегать дублей, правильно считать суммы/количества и уверенно объяснять логику.
- Дойти до состояния «могу решить задачу на пользователей/заказы за 5-10 минут».

## Результат к концу дня

Ты должен:

1. Отличать `INNER JOIN` и `LEFT JOIN` на практике.
2. Находить записи «без пары» (`LEFT JOIN + IS NULL`).
3. Писать `GROUP BY + SUM/COUNT/AVG`.
4. Понимать, когда `WHERE`, а когда `HAVING`.
5. Контролировать кардинальность и дубли после JOIN.

## 1) JOIN: что происходит по факту

JOIN объединяет строки из таблиц по условию `ON`.

### 1.1 INNER JOIN

Оставляет только совпавшие строки.

```sql
SELECT u.user_id, u.username, o.order_id, o.amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id;
```

### 1.2 LEFT JOIN

Оставляет все строки слева и совпадения справа.

```sql
SELECT u.user_id, u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

### 1.3 Anti-join (поиск «без пары»)

```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

Это один из любимых форматов задач на собесе.

## 2) Кардинальность (1:1, 1:N, N:M)

Почему важно:

- при `1:N` количество строк после JOIN вырастет;
- это нормально, но нужно контролировать;
- иначе можно ошибиться в суммах/количествах.

Типовой фейл:

- ожидаешь 4 строки пользователей, получаешь 20 строк — потому что у каждого по несколько заказов.

## 3) GROUP BY подробно

`GROUP BY` группирует строки по ключу.

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id;
```

Правило:

- в SELECT должны быть либо поля из GROUP BY, либо агрегаты.

## 4) Агрегаты

### COUNT

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id;
```

### SUM

```sql
SELECT user_id, SUM(amount) AS total_amount
FROM orders
GROUP BY user_id;
```

### AVG

```sql
SELECT user_id, AVG(amount) AS avg_amount
FROM orders
GROUP BY user_id;
```

## 5) WHERE vs HAVING (обязательно)

- `WHERE` — фильтрует строки до группировки.
- `HAVING` — фильтрует группы после агрегации.

Пример:

```sql
SELECT user_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(amount) > 5000;
```

## 6) Сортировка агрегатов

```sql
SELECT user_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY user_id
ORDER BY total_paid DESC;
```

Частая ошибка:

- сортировать ASC, когда задача просит топы.

## 7) Пошаговый шаблон решения JOIN-задачи

1. Прочитай условие и назови сущности (users/orders).
2. Определи тип JOIN.
3. Напиши FROM + JOIN + ON.
4. Добавь WHERE (если фильтры по исходным строкам).
5. Добавь GROUP BY (если есть агрегаты).
6. Добавь HAVING (если фильтр по агрегату).
7. Добавь ORDER BY/LIMIT.
8. Проверь результат глазами.

## 8) Топ-7 типовых задач (с шаблонами)

### 8.1 Пользователи без заказов

```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

### 8.2 Сумма оплаченных заказов по пользователям

```sql
SELECT o.user_id, SUM(o.amount) AS total_paid
FROM orders o
WHERE o.status = 'paid'
GROUP BY o.user_id
ORDER BY total_paid DESC;
```

### 8.3 Количество заказов по статусам

```sql
SELECT status, COUNT(*) AS cnt
FROM orders
GROUP BY status
ORDER BY cnt DESC;
```

### 8.4 Пользователи с более чем 2 заказами

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 2;
```

### 8.5 Средний чек по пользователям

```sql
SELECT user_id, AVG(amount) AS avg_check
FROM orders
WHERE status = 'paid'
GROUP BY user_id;
```

### 8.6 Топ-3 пользователя по обороту

```sql
SELECT user_id, SUM(amount) AS turnover
FROM orders
WHERE status = 'paid'
GROUP BY user_id
ORDER BY turnover DESC
LIMIT 3;
```

### 8.7 Кол-во пользователей с заказами и без

```sql
SELECT
  CASE WHEN o.order_id IS NULL THEN 'without_orders' ELSE 'with_orders' END AS segment,
  COUNT(DISTINCT u.user_id) AS users_cnt
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY segment;
```

## 9) Ошибки, которые «роняют» кандидатов

1. Неправильный JOIN-тип.
2. Потеря строк из-за INNER JOIN там, где нужен LEFT JOIN.
3. Неверный ON -> дубли.
4. WHERE вместо HAVING для агрегатов.
5. Сумма без фильтра статуса (`paid`/`cancelled` смешались).

## 10) QA-практика: как использовать это в реальной работе

- Проверка отчетов и дашбордов.
- Валидация API-ответа против БД.
- Поиск «почему цифры в UI не сходятся».
- Расследование инцидентов по данным.

## 11) Проверка себя перед Днём 3

Ты готов, если:

- решаешь anti-join задачу без подсказки;
- пишешь GROUP BY/HAVING стабильно правильно;
- объясняешь, почему появилась каждая строка результата;
- быстро находишь источник дублей.

## 12) Режим тренировки

- 5 задач подряд по 8-10 минут.
- На каждую задачу: 30 секунд на план + 6 минут на код + 1 минута на самопроверку.
- Обязательно проговаривать логику вслух.

Ключевая мысль:

На интервью важен не только SQL-синтаксис, но и способность контролировать логику данных после JOIN.
