# SQL День 2: JOIN, GROUP BY, агрегаты

## Цель дня

- Научиться решать типичные собесные задачи на объединение таблиц.
- Уверенно писать `JOIN`, `GROUP BY`, `HAVING`, агрегаты (`SUM`, `COUNT`, `AVG`).
- Видеть и контролировать дубли после JOIN.

## План дня (6-8 часов)

1. `1.5 ч` — JOIN-теория.
2. `1.5 ч` — агрегаты и группировка.
3. `2-3 ч` — задачи в тренажёре.
4. `1-2 ч` — устный прогон и закрепление.

## 1) JOIN (соединение таблиц)

### INNER JOIN

Возвращает только совпадения по условию `ON`.

```sql
SELECT u.user_id, u.username, o.amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id;
```

### LEFT JOIN

Возвращает все строки из левой таблицы и совпадения справа.

```sql
SELECT u.user_id, u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

### Поиск «без пары»

```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

## 2) GROUP BY и агрегаты

### SUM / COUNT / AVG

```sql
SELECT user_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY user_id;
```

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id;
```

```sql
SELECT user_id, AVG(amount) AS avg_amount
FROM orders
GROUP BY user_id;
```

## 3) HAVING (фильтрация агрегатов)

```sql
SELECT user_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(amount) > 5000;
```

Разница:

- `WHERE` фильтрует строки до группировки.
- `HAVING` фильтрует группы после агрегирования.

## 4) Типовые задачи для технички

1. Пользователи без заказов.
2. Сумма оплат по пользователям.
3. Количество заказов по статусам.
4. Топ пользователей по сумме покупок.
5. Пользователи, у которых больше N заказов.

## 5) Частые ошибки на JOIN и GROUP BY

- Неполное условие `ON` -> лишние дубли.
- Использование `WHERE` вместо `HAVING` для агрегатов.
- Выбор колонок, не входящих в `GROUP BY` и не агрегированных.
- Неверный порядок сортировки (`ASC` вместо `DESC`).

## 6) Пошаговая отладка сложного запроса

1. Запусти `FROM + JOIN` без фильтров и посмотри количество строк.
2. Добавь `WHERE` и снова проверь кардинальность.
3. Добавь `GROUP BY`.
4. Добавь агрегаты.
5. Добавь `HAVING`.
6. Добавь `ORDER BY` и `LIMIT`.

## 7) Как озвучивать решение на интервью

- «Сначала объединяю таблицы users и orders по user_id, потом фильтрую paid, дальше группирую по user_id, считаю SUM(amount), сортирую по убыванию total_paid».

Это лучше, чем молча написать запрос и отдать результат.

## 8) Контрольный oral drill

Проговори и напиши:

1. Найди пользователей без заказов.
2. Выведи user_id и total_paid только для paid.
3. Оставь только пользователей с total_paid > 5000.
4. Отсортируй по total_paid по убыванию.

## 9) Финал дня

Ты готов к собесному блоку JOIN/агрегаты, если:

- за 5-8 минут решаешь задачу на LEFT JOIN + IS NULL;
- уверенно пишешь GROUP BY + SUM/COUNT;
- не путаешь WHERE и HAVING;
- замечаешь дубли и объясняешь, почему они появились.
