# SQL День 2: JOIN + GROUP BY + HAVING (очень подробный разбор)

## Цель дня

Сегодня мы закрываем самый частый live-coding блок (`live coding` — решение задачи в реальном времени):

- объединение таблиц (`JOIN` — соединение);
- группировка (`GROUP BY` — группировка строк);
- агрегаты (`aggregate functions` — агрегатные функции);
- фильтр по агрегатам (`HAVING`).

К концу дня ты должен уверенно решать типовые задачи вида:

- «пользователи без заказов»;
- «сумма продаж по пользователям»;
- «топ-3 по обороту»;
- «количество заказов по статусам».

---

## 1) Почему вообще нужен JOIN

В реальной БД данные лежат в разных таблицах.

Пример:

- `users` — пользователи;
- `orders` — заказы.

Чтобы получить «имя пользователя + сумма его заказов», нужна связка таблиц.

Эту связку делает `JOIN`.

---

## 2) `JOIN` (соединение таблиц) с нуля

## 2.1 INNER JOIN (внутреннее соединение)

Возвращает только те строки, где нашлось совпадение в обеих таблицах.

```sql
SELECT u.user_id, u.username, o.order_id, o.amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id;
```

Если у пользователя нет заказа — его строки не будет.

## 2.2 LEFT JOIN (левое соединение)

Возвращает **все строки из левой таблицы** + совпадения справа.

```sql
SELECT u.user_id, u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

Если совпадения нет, поля правой таблицы будут `NULL`.

## 2.3 Что значит ON

`ON` — условие, по какому ключу соединять строки.

```sql
ON u.user_id = o.user_id
```

Если условие в `ON` неверное, ты получишь:

- либо потери данных;
- либо дубли;
- либо «взрыв» количества строк.

---

## 3) Кардинальность (`cardinality` — тип связи) и дубли

### 3.1 Типы связей

- `1:1` (one-to-one — один к одному);
- `1:N` (one-to-many — один ко многим);
- `N:M` (many-to-many — многие ко многим).

### 3.2 Почему это критично

Если связь `1:N`, после JOIN строк станет больше — это нормально.

Пример:

- 1 пользователь;
- 3 заказа;
- после JOIN будет 3 строки пользователя.

Если забыть это, можно неправильно посчитать суммы и количества.

---

## 4) Anti-join (поиск записей «без пары»)

Очень частая задача на собесе.

### Шаблон

```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

Логика:

1. Берём всех пользователей;
2. пытаемся присоединить заказы;
3. оставляем только тех, у кого заказ не нашёлся (`NULL`).

---

## 5) GROUP BY (группировка)

`GROUP BY` объединяет строки в группы по выбранному признаку.

### Пример: количество заказов на пользователя

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id;
```

Здесь каждая группа = один `user_id`.

---

## 6) Агрегатные функции (`aggregate functions`)

### 6.1 COUNT

```sql
SELECT COUNT(*) AS rows_cnt
FROM orders;
```

### 6.2 SUM

```sql
SELECT SUM(amount) AS total_amount
FROM orders;
```

### 6.3 AVG

```sql
SELECT AVG(amount) AS avg_amount
FROM orders;
```

### 6.4 MIN / MAX

```sql
SELECT MIN(amount) AS min_amount, MAX(amount) AS max_amount
FROM orders;
```

---

## 7) WHERE vs HAVING (классический вопрос интервью)

- `WHERE` — фильтрует строки **до** группировки;
- `HAVING` — фильтрует группы **после** группировки.

### Пример с обоими

```sql
SELECT user_id, SUM(amount) AS paid_total
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(amount) > 5000;
```

Что делает запрос:

1. Берёт только оплаченные строки (`WHERE`);
2. группирует по `user_id`;
3. оставляет только группы, где сумма > 5000 (`HAVING`).

---

## 8) CASE WHEN (условная логика в SQL)

`CASE WHEN` (`условный оператор`) — SQL-аналог `if/else`.

```sql
SELECT
  order_id,
  amount,
  CASE
    WHEN amount >= 10000 THEN 'big'
    WHEN amount >= 5000 THEN 'medium'
    ELSE 'small'
  END AS check_size
FROM orders;
```

Это полезно для сегментации, отчётов, QA-аналитики.

---

## 9) Пошаговый алгоритм решения JOIN-задачи на собесе

1. Переведи задачу на язык сущностей:
   - какие таблицы;
   - какой ключ связи;
   - какая метрика нужна.
2. Построй каркас:
   - `SELECT ...`;
   - `FROM ...`;
   - `JOIN ... ON ...`.
3. Добавь строковые фильтры (`WHERE`).
4. Если нужна метрика по группам — `GROUP BY`.
5. Если фильтр по метрике — `HAVING`.
6. Добавь сортировку (`ORDER BY`) и топ (`LIMIT`).
7. Сделай sanity-check (`санити-проверка`):
   - нет ли дублей;
   - сходится ли логика результата.

---

## 10) Подробные практические шаблоны

## 10.1 Пользователи без заказов

```sql
SELECT u.user_id, u.username
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

## 10.2 Сумма оплаченных заказов по пользователям

```sql
SELECT o.user_id, SUM(o.amount) AS total_paid
FROM orders o
WHERE o.status = 'paid'
GROUP BY o.user_id
ORDER BY total_paid DESC;
```

## 10.3 Количество заказов по статусам

```sql
SELECT status, COUNT(*) AS cnt
FROM orders
GROUP BY status
ORDER BY cnt DESC;
```

## 10.4 Пользователи с более чем 2 заказами

```sql
SELECT user_id, COUNT(*) AS orders_cnt
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 2;
```

## 10.5 Средний чек по пользователям

```sql
SELECT user_id, AVG(amount) AS avg_check
FROM orders
WHERE status = 'paid'
GROUP BY user_id;
```

## 10.6 Топ-3 пользователя по обороту

```sql
SELECT user_id, SUM(amount) AS turnover
FROM orders
WHERE status = 'paid'
GROUP BY user_id
ORDER BY turnover DESC
LIMIT 3;
```

## 10.7 Сколько пользователей с заказами и без

```sql
SELECT
  CASE WHEN o.order_id IS NULL THEN 'without_orders' ELSE 'with_orders' END AS segment,
  COUNT(DISTINCT u.user_id) AS users_cnt
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY segment;
```

---

## 11) Частые ошибки (и как сразу себя проверить)

1. Неправильный тип JOIN.
2. Условие соединения (`ON`) не по тому ключу.
3. WHERE вместо HAVING для агрегата.
4. Считаешь всё подряд, забыв фильтр `status = 'paid'`.
5. Не учитываешь дубли после JOIN.

Быстрый самоконтроль:

- «Почему строк стало именно столько?»
- «Не умножил ли я строки JOIN-ом?»
- «Где фильтр по бизнес-условию?»

---

## 12) Мини-словарь дня 2

- `JOIN` (соединение таблиц)
- `INNER JOIN` (внутреннее соединение)
- `LEFT JOIN` (левое соединение)
- `ON` (условие соединения)
- `GROUP BY` (группировка)
- `HAVING` (фильтр групп)
- `Aggregate` (агрегат)
- `Cardinality` (кардинальность, тип связи)

---

## 13) Чек-лист «готов к Дню 3»

Ты готов, если умеешь:

- объяснить разницу `INNER` vs `LEFT` без запинки;
- решать anti-join задачу без подсказки;
- писать `GROUP BY + HAVING` правильно;
- замечать и объяснять дубли после JOIN.