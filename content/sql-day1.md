# SQL День 1: Полный ноль → уверенная база (максимально подробно)

## Цель дня

Сегодня цель простая: сделать так, чтобы ты не просто «узнавал» SQL, а **понимал буквально каждую строчку запроса**.

К концу дня ты должен без паники объяснить:

1. Что такое `SELECT`.
2. Что такое `FROM` и зачем он обязателен почти в каждом запросе.
3. Что такое фильтрация (`WHERE`), сортировка (`ORDER BY`), ограничение (`LIMIT`) и пагинация (`pagination` — постраничный вывод данных).
4. Как читать запрос **в логическом порядке выполнения**, а не только «сверху вниз».

---

## 1) Что такое SQL и база данных

## SQL (Structured Query Language — структурированный язык запросов)

SQL — это язык, на котором мы общаемся с базой данных (`database` — хранилище данных).

Через SQL мы:

- получаем данные (`SELECT` — выборка);
- добавляем (`INSERT` — вставка);
- обновляем (`UPDATE` — обновление);
- удаляем (`DELETE` — удаление).

На собесе junior QA чаще всего проверяют именно `SELECT`-часть.

## База данных: простая ментальная модель

- **Table (таблица)** — как лист Excel.
- **Row (строка)** — одна запись (один объект).
- **Column (колонка/столбец)** — одно поле объекта.
- **Schema (схема)** — структура таблиц и типов полей.

Пример таблицы `users`:

| user_id | name  | city   |
|--------:|-------|--------|
| 1       | Анна  | Москва |
| 2       | Илья  | Казань |

---

## 2) Анатомия самого базового запроса

```sql
SELECT user_id, name
FROM users;
```

Разбор по словам:

- `SELECT` — «хочу выбрать/показать»;
- `user_id, name` — какие именно колонки показать;
- `FROM users` — из какой таблицы брать данные;
- `;` — конец команды.

## Важный момент

Если у тебя нет `FROM`, то в 99% реальных задач запрос неполный.

---

## 3) `FROM` (откуда берём данные) — максимально подробно

`FROM` определяет **источник данных**.

Без понимания `FROM` невозможно понять ни JOIN, ни агрегации, ни подзапросы.

### 3.1 Простейший `FROM`

```sql
SELECT *
FROM products;
```

Это означает: возьми все колонки (`*`) из таблицы `products`.

### 3.2 `FROM` + выбор конкретных колонок

```sql
SELECT product_id, product_name, price
FROM products;
```

### 3.3 `FROM` с псевдонимом (`alias` — короткое имя)

```sql
SELECT p.product_id, p.product_name
FROM products AS p;
```

или эквивалентно:

```sql
SELECT p.product_id, p.product_name
FROM products p;
```

Зачем псевдоним:

- короче писать;
- удобнее читать;
- обязательно в сложных запросах с несколькими таблицами.

### 3.4 `FROM` с временным источником (подзапрос)

```sql
SELECT t.user_id, t.total_orders
FROM (
  SELECT user_id, COUNT(*) AS total_orders
  FROM orders
  GROUP BY user_id
) AS t;
```

Здесь `FROM` берёт данные не из «физической таблицы», а из результата внутреннего запроса.

---

## 4) Логический порядок выполнения запроса (`query execution order` — порядок выполнения)

Запрос пишется так:

```sql
SELECT ...
FROM ...
WHERE ...
ORDER BY ...
LIMIT ...
```

Но движок мыслит так:

1. `FROM` — сначала берём источник данных.
2. `WHERE` — фильтруем строки.
3. `GROUP BY` — если есть, группируем.
4. `HAVING` — если есть, фильтруем группы.
5. `SELECT` — формируем итоговые колонки.
6. `ORDER BY` — сортируем.
7. `LIMIT/OFFSET` — обрезаем выдачу.

Почему это важно: перестаёшь писать SQL «вслепую».

---

## 5) `WHERE` (фильтрация) с нуля

`WHERE` — это условие, какие строки оставить.

### 5.1 Операторы сравнения

```sql
WHERE price > 10000
WHERE price >= 10000
WHERE status = 'paid'
WHERE city <> 'Москва'
```

### 5.2 Диапазон `BETWEEN`

```sql
WHERE price BETWEEN 1000 AND 5000
```

### 5.3 Список значений `IN`

```sql
WHERE city IN ('Москва', 'Казань', 'Самара')
```

### 5.4 Текстовый поиск `LIKE`

```sql
WHERE product_name LIKE '%phone%'
```

`%` — любое количество символов.

### 5.5 Комбинация условий

```sql
WHERE status = 'paid' AND amount > 3000
WHERE city = 'Москва' OR city = 'Казань'
WHERE NOT (status = 'cancelled')
```

---

## 6) `NULL` (отсутствие значения) — критически важная тема

`NULL` — не пустая строка и не 0. Это «значение отсутствует».

### Главное правило

Нельзя писать:

```sql
WHERE deleted_at = NULL
```

Нужно писать:

```sql
WHERE deleted_at IS NULL
```

или

```sql
WHERE deleted_at IS NOT NULL
```

---

## 7) `ORDER BY` (сортировка)

```sql
ORDER BY price ASC
ORDER BY price DESC
```

- `ASC` (ascending — по возрастанию) — можно не писать, это дефолт.
- `DESC` (descending — по убыванию).

### Сортировка по нескольким колонкам

```sql
ORDER BY status ASC, created_at DESC
```

Сначала сортировка по `status`, внутри каждого `status` — по `created_at`.

---

## 8) `LIMIT` и `OFFSET` + пагинация (`pagination`)

## Что такое пагинация

Пагинация (`pagination` — постраничный вывод) — когда мы показываем не все данные сразу, а частями: страница 1, 2, 3...

### Базовый синтаксис

```sql
LIMIT 10 OFFSET 0   -- первая страница
LIMIT 10 OFFSET 10  -- вторая страница
LIMIT 10 OFFSET 20  -- третья страница
```

Где:

- `LIMIT` — сколько строк вернуть;
- `OFFSET` — сколько строк пропустить.

### Почему перед пагинацией нужна сортировка

Неправильно:

```sql
SELECT *
FROM orders
LIMIT 10 OFFSET 10;
```

Правильно:

```sql
SELECT *
FROM orders
ORDER BY order_id
LIMIT 10 OFFSET 10;
```

Без `ORDER BY` страницы могут быть нестабильными.

### Формула офсета

`offset = (page - 1) * page_size`

Пример:

- `page = 4`, `page_size = 25`;
- `offset = (4 - 1) * 25 = 75`.

---

## 9) `DISTINCT` (уникальные значения)

```sql
SELECT DISTINCT city
FROM users;
```

Возвращает каждый город один раз.

---

## 10) Базовые агрегаты (`aggregate functions` — агрегатные функции)

### `COUNT` (количество)

```sql
SELECT COUNT(*) AS total_rows
FROM orders;
```

### `SUM` (сумма)

```sql
SELECT SUM(amount) AS total_amount
FROM orders;
```

### `AVG` (среднее)

```sql
SELECT AVG(amount) AS avg_amount
FROM orders;
```

### `MIN` / `MAX` (минимум/максимум)

```sql
SELECT MIN(price) AS min_price, MAX(price) AS max_price
FROM products;
```

---

## 11) Частые ошибки новичка (которые режут баллы)

1. Писать `= NULL` вместо `IS NULL`.
2. Делать `LIMIT/OFFSET` без `ORDER BY`.
3. Путать `AND` и `OR` без скобок.
4. Выбирать `*` там, где нужны 2-3 колонки.
5. Не проверять, что фильтр реально применился.

---

## 12) 12 обязательных запросов Дня 1 (от простого к рабочему)

### 1

```sql
SELECT *
FROM users;
```

### 2

```sql
SELECT user_id, name
FROM users;
```

### 3

```sql
SELECT name, city
FROM users
WHERE city = 'Москва';
```

### 4

```sql
SELECT name, city
FROM users
WHERE city IN ('Москва', 'Казань');
```

### 5

```sql
SELECT product_name, price
FROM products
WHERE price > 10000
ORDER BY price DESC;
```

### 6

```sql
SELECT product_name
FROM products
WHERE product_name LIKE '%pro%';
```

### 7

```sql
SELECT *
FROM orders
WHERE shipped_at IS NULL;
```

### 8

```sql
SELECT *
FROM orders
ORDER BY created_at DESC
LIMIT 20;
```

### 9

```sql
SELECT *
FROM orders
ORDER BY order_id
LIMIT 10 OFFSET 20;
```

### 10

```sql
SELECT DISTINCT status
FROM orders;
```

### 11

```sql
SELECT COUNT(*) AS orders_cnt
FROM orders
WHERE status = 'paid';
```

### 12

```sql
SELECT SUM(amount) AS paid_total
FROM orders
WHERE status = 'paid';
```

---

## 13) Как отвечать на собесе, если спрашивают «что такое FROM?»

Коротко и сильно:

> `FROM` — это часть SQL-запроса, которая определяет источник данных: таблицу, набор таблиц после JOIN или подзапрос. Логически SQL начинает выполнение именно с `FROM`.

---

## 14) Как отвечать на собесе, если спрашивают «что такое пагинация?»

> Пагинация (`pagination` — постраничный вывод) — способ выдавать данные частями. В SQL обычно делается через `LIMIT` и `OFFSET`, но обязательно со стабильной сортировкой (`ORDER BY`), чтобы страницы не “прыгали”.

---

## 15) Чек-лист перед завершением Дня 1

Ты прошёл день хорошо, если:

- можешь вслух объяснить `SELECT/FROM/WHERE/ORDER BY/LIMIT/OFFSET`;
- можешь написать 10 запросов без подсказки;
- не путаешь `NULL`;
- понимаешь пагинацию и зачем нужна сортировка.

---

## 16) Формат ожидаемого вывода в задачах Дня 1

Чтобы на лайвкодинге не терять баллы, всегда проговаривай:

1. Какие именно колонки должны быть в финальном ответе.
2. В каком порядке эти колонки идут.
3. Нужна ли сортировка.
4. Пример 1-2 строк результата.

Примеры:

- Задача «Товары дороже 10000»:
  - колонки: `product_name`, `price`;
  - сортировка: `price DESC` (если просят топ/самые дорогие);
  - пример строки: `('Laptop', 90000)`.
- Задача «Статусы заказов»:
  - колонки: `status`;
  - формат: уникальные значения (`DISTINCT`);
  - пример вывода: `paid`, `cancelled`.
- Задача «Пагинация заказов»:
  - колонки: `order_id`, `created_at`, `amount`;
  - обязательно: `ORDER BY` + `LIMIT/OFFSET`;
  - пример строки: `(125, '2026-05-23', 4200)`.
