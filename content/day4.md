# 🎯 ДЕНЬ 4: Сложные запросы и подготовка к собеседованию

## Часть 1: Подзапросы (Subqueries) — 2 часа

### Что такое подзапрос?

Подзапрос — это запрос внутри другого запроса. Позволяет разбить сложную задачу на части.

### Подзапросы в WHERE

```sql
-- Найти товары дороже средней цены
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

**Как это работает:**
1. Сначала выполняется внутренний запрос: `SELECT AVG(price) FROM products`
2. Результат (например, 15000) подставляется в основной запрос
3. Выполняется: `SELECT * FROM products WHERE price > 15000`

---

### Подзапросы с IN

```sql
-- Найти всех клиентов, которые делали заказы
SELECT * FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id 
    FROM customer_orders
);
```

---

### Подзапросы в SELECT

```sql
-- Показать каждый товар и его отклонение от средней цены
SELECT 
    product_name,
    price,
    (SELECT AVG(price) FROM products) as avg_price,
    price - (SELECT AVG(price) FROM products) as difference
FROM products;
```

---

### EXISTS — проверка существования

```sql
-- Найти клиентов, у которых ЕСТЬ заказы
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM customer_orders o
    WHERE o.customer_id = c.customer_id
);

-- Найти клиентов, у которых НЕТ заказов
SELECT * FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM customer_orders o
    WHERE o.customer_id = c.customer_id
);
```

---

## Часть 2: Полезные функции и операторы — 1 час

### CASE — условная логика (как if-else)

```sql
-- Категоризация товаров по цене
SELECT 
    product_name,
    price,
    CASE 
        WHEN price < 1000 THEN 'Дешевый'
        WHEN price BETWEEN 1000 AND 10000 THEN 'Средний'
        ELSE 'Дорогой'
    END as price_category
FROM products;
```

```sql
-- Категоризация заказов по статусу
SELECT 
    order_id,
    status,
    CASE status
        WHEN 'completed' THEN 'Выполнен'
        WHEN 'pending' THEN 'В обработке'
        WHEN 'cancelled' THEN 'Отменен'
        ELSE 'Неизвестно'
    END as status_ru
FROM orders;
```

---

### COALESCE — замена NULL

```sql
-- Если email пустой, показать "Не указан"
SELECT 
    name,
    COALESCE(email, 'Не указан') as email
FROM customers;

-- Для расчетов: NULL превратить в 0
SELECT 
    customer_id,
    COALESCE(SUM(amount), 0) as total
FROM customer_orders
GROUP BY customer_id;
```

---

### Работа со строками

```sql
-- UPPER, LOWER — регистр
SELECT UPPER(name), LOWER(email) FROM customers;

-- LENGTH — длина строки
SELECT name, LENGTH(name) as name_length FROM customers;

-- TRIM — убрать пробелы
SELECT TRIM('  текст  ') as cleaned;

-- CONCAT или || — склеивание строк
SELECT name || ' <' || email || '>' as full_info FROM customers;

-- SUBSTR — вырезать часть строки
SELECT SUBSTR(email, 1, 5) as email_prefix FROM customers;
```

---

### Работа с датами

```sql
-- Текущая дата и время
SELECT CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP;

-- Извлечение части даты
SELECT 
    order_date,
    strftime('%Y', order_date) as year,
    strftime('%m', order_date) as month,
    strftime('%d', order_date) as day
FROM orders;

-- Разница в днях (SQLite)
SELECT 
    order_id,
    order_date,
    julianday(CURRENT_DATE) - julianday(order_date) as days_ago
FROM orders;
```

---

## Часть 3: Типичные задачи для QA — 2 часа

### Задача 1: Поиск дубликатов

```sql
-- Найти дубликаты email у клиентов
SELECT email, COUNT(*) as count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

```sql
-- Найти всех клиентов с дублирующимся email
SELECT * FROM customers
WHERE email IN (
    SELECT email
    FROM customers
    GROUP BY email
    HAVING COUNT(*) > 1
);
```

---

### Задача 2: Проверка целостности данных

```sql
-- Найти заказы от несуществующих клиентов (ошибка в данных!)
SELECT * FROM customer_orders
WHERE customer_id NOT IN (
    SELECT customer_id FROM customers
);
```

```sql
-- Найти заказы с некорректными значениями
SELECT * FROM orders
WHERE 
    total_price < 0  -- отрицательная цена
    OR quantity <= 0  -- нулевое или отрицательное количество
    OR status NOT IN ('completed', 'pending', 'cancelled');  -- неизвестный статус
```

---

### Задача 3: N-й максимальный элемент

```sql
-- Найти второй по дороговизне заказ
SELECT * FROM orders
ORDER BY total_price DESC
LIMIT 1 OFFSET 1;

-- Найти третий по популярности товар
SELECT product_name, COUNT(*) as order_count
FROM orders
GROUP BY product_name
ORDER BY order_count DESC
LIMIT 1 OFFSET 2;
```

---

### Задача 4: Ранжирование

```sql
-- Добавить ранг к каждому заказу по цене (SQLite не поддерживает ROW_NUMBER, используем альтернативу)
SELECT 
    order_id,
    total_price,
    (SELECT COUNT(*) FROM orders o2 
     WHERE o2.total_price > o1.total_price) + 1 as price_rank
FROM orders o1
ORDER BY total_price DESC;
```

---

### Задача 5: Процент от общего

```sql
-- Доля каждого статуса от общего количества заказов
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage
FROM orders
GROUP BY status;
```

---

## Часть 4: Подготовка к собеседованию — 3 часа

### Типовые вопросы и ответы

#### 1. В чем разница между WHERE и HAVING?

**WHERE:**
- Фильтрует строки ДО группировки
- Работает с отдельными записями
- Не может использовать агрегатные функции

**HAVING:**
- Фильтрует группы ПОСЛЕ группировки
- Работает с результатами группировки
- Может использовать агрегатные функции

```sql
-- WHERE — фильтруем строки
SELECT customer_name, COUNT(*)
FROM orders
WHERE status = 'completed'  -- ДО группировки
GROUP BY customer_name;

-- HAVING — фильтруем группы
SELECT customer_name, COUNT(*)
FROM orders
GROUP BY customer_name
HAVING COUNT(*) > 2;  -- ПОСЛЕ группировки
```

---

#### 2. В чем разница между INNER JOIN и LEFT JOIN?

**INNER JOIN:**
- Возвращает только те строки, где есть совпадения в ОБЕИХ таблицах
- Если в правой таблице нет совпадения — строка не попадет в результат

**LEFT JOIN:**
- Возвращает ВСЕ строки из левой таблицы
- Если в правой таблице нет совпадения — поля будут NULL

```sql
-- INNER JOIN: только клиенты с заказами
SELECT c.name, o.product
FROM customers c
INNER JOIN customer_orders o ON c.customer_id = o.customer_id;

-- LEFT JOIN: все клиенты (даже без заказов)
SELECT c.name, o.product
FROM customers c
LEFT JOIN customer_orders o ON c.customer_id = o.customer_id;
```

---

#### 3. Как найти дубликаты в таблице?

```sql
-- Способ 1: GROUP BY + HAVING
SELECT column_name, COUNT(*)
FROM table_name
GROUP BY column_name
HAVING COUNT(*) > 1;

-- Способ 2: Все записи с дублирующимися значениями
SELECT * FROM table_name
WHERE column_name IN (
    SELECT column_name
    FROM table_name
    GROUP BY column_name
    HAVING COUNT(*) > 1
);
```

---

#### 4. Что такое первичный ключ (PRIMARY KEY)?

**Ответ:**
- Уникальный идентификатор записи в таблице
- Не может быть NULL
- Не может повторяться
- Обычно это столбец `id`
- Используется для связи таблиц через внешние ключи (FOREIGN KEY)

---

#### 5. Зачем нужен индекс?

**Ответ:**
- Ускоряет поиск данных в больших таблицах
- Как оглавление в книге
- Создается на часто используемых столбцах (например, email, username)
- Замедляет INSERT/UPDATE (нужно обновлять индекс)

---

#### 6. Что делает DISTINCT?

**Ответ:**
- Убирает дубликаты из результата
- Возвращает только уникальные значения

```sql
-- Все уникальные города клиентов
SELECT DISTINCT city FROM customers;
```

---

#### 7. Как найти N-й максимальный элемент?

```sql
-- 3-й по величине заказ
SELECT * FROM orders
ORDER BY total_price DESC
LIMIT 1 OFFSET 2;
```

---

### Практические задачи для собеседования

Создай тестовую базу данных интернет-магазина:

```sql
-- Пользователи
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    registration_date DATE
);

-- Категории товаров
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    category_name TEXT NOT NULL
);

-- Товары
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    category_id INTEGER,
    price REAL NOT NULL,
    stock_quantity INTEGER DEFAULT 0
);

-- Заказы
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    order_date DATE,
    total_amount REAL,
    status TEXT CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Детали заказов
CREATE TABLE order_items (
    item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price REAL
);

-- Заполнение данными
INSERT INTO users (user_id, username, email, registration_date) VALUES
    (1, 'ivan_petrov', 'ivan@test.ru', '2024-01-01'),
    (2, 'maria_s', 'maria@test.ru', '2024-01-05'),
    (3, 'petr_ivanov', 'petr@test.ru', '2024-01-10'),
    (4, 'anna_smith', 'anna@test.ru', '2024-01-15'),
    (5, 'test_user', NULL, '2024-01-20');

INSERT INTO categories (category_id, category_name) VALUES
    (1, 'Электроника'),
    (2, 'Одежда'),
    (3, 'Книги');

INSERT INTO products (product_id, product_name, category_id, price, stock_quantity) VALUES
    (1, 'Ноутбук', 1, 50000, 10),
    (2, 'Смартфон', 1, 30000, 25),
    (3, 'Наушники', 1, 5000, 50),
    (4, 'Футболка', 2, 1000, 100),
    (5, 'Джинсы', 2, 3000, 40),
    (6, 'Роман "Война и мир"', 3, 800, 20),
    (7, 'Учебник SQL', 3, 1500, 15);

INSERT INTO orders (order_id, user_id, order_date, total_amount, status) VALUES
    (1, 1, '2024-01-16', 51000, 'delivered'),
    (2, 2, '2024-01-17', 30000, 'delivered'),
    (3, 1, '2024-01-18', 5000, 'shipped'),
    (4, 3, '2024-01-19', 4000, 'cancelled'),
    (5, 4, '2024-01-20', 85000, 'processing'),
    (6, 1, '2024-01-21', 1500, 'pending');

INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 1, 50000),
    (2, 1, 4, 1, 1000),
    (3, 2, 2, 1, 30000),
    (4, 3, 3, 1, 5000),
    (5, 4, 5, 1, 3000),
    (6, 4, 4, 1, 1000),
    (7, 5, 1, 1, 50000),
    (8, 5, 2, 1, 30000),
    (9, 5, 3, 1, 5000),
    (10, 6, 7, 1, 1500);
```

---

## 📝 ФИНАЛЬНЫЕ ЗАДАНИЯ (Собеседование)

### Блок 1: Проверка целостности данных (QA-задачи)

**1. Найди пользователей без email (потенциальная проблема)**
```sql
-- ТВОЙ КОД
```

**2. Найди заказы, где total_amount не совпадает с суммой items**
```sql
-- Подсказка: нужен JOIN между orders и order_items с GROUP BY
-- ТВОЙ КОД
```

**3. Найди товары, которые есть в заказах, но отсутствуют в таблице products**
```sql
-- ТВОЙ КОД
```

**4. Найди заказы с некорректными статусами**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM users WHERE email IS NULL;

-- 2
SELECT 
    o.order_id,
    o.total_amount,
    SUM(oi.quantity * oi.unit_price) as calculated_total,
    o.total_amount - SUM(oi.quantity * oi.unit_price) as difference
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id
HAVING ABS(o.total_amount - SUM(oi.quantity * oi.unit_price)) > 0.01;

-- 3
SELECT DISTINCT oi.product_id
FROM order_items oi
WHERE oi.product_id NOT IN (SELECT product_id FROM products);

-- 4
SELECT * FROM orders
WHERE status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
```
</details>

---

### Блок 2: Бизнес-метрики

**1. Топ-3 самых продаваемых товара (по количеству)**
```sql
-- ТВОЙ КОД
```

**2. Выручка по каждой категории товаров**
```sql
-- ТВОЙ КОД
```

**3. Пользователи с максимальной суммой покупок**
```sql
-- ТВОЙ КОД
```

**4. Средний чек по каждому статусу заказа**
```sql
-- ТВОЙ КОД
```

**5. Конверсия пользователей (сколько % зарегистрированных сделали заказ)**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT 
    p.product_name,
    SUM(oi.quantity) as total_sold
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id
ORDER BY total_sold DESC
LIMIT 3;

-- 2
SELECT 
    c.category_name,
    SUM(oi.quantity * oi.unit_price) as revenue
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY c.category_id
ORDER BY revenue DESC;

-- 3
SELECT 
    u.username,
    SUM(o.total_amount) as total_spent
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
WHERE o.status != 'cancelled'
GROUP BY u.user_id
ORDER BY total_spent DESC
LIMIT 5;

-- 4
SELECT 
    status,
    ROUND(AVG(total_amount), 2) as avg_check,
    COUNT(*) as order_count
FROM orders
GROUP BY status;

-- 5
SELECT 
    (SELECT COUNT(DISTINCT user_id) FROM orders) * 100.0 / 
    (SELECT COUNT(*) FROM users) as conversion_rate;
```
</details>

---

### Блок 3: Сложные запросы

**1. Найди товары, которые никогда не покупали**
```sql
-- ТВОЙ КОД
```

**2. Для каждого пользователя: общая сумма, количество заказов, средний чек**
```sql
-- ТВОЙ КОД
```

**3. Найди категорию с самым низким средним чеком**
```sql
-- ТВОЙ КОД
```

**4. Найди пользователей, которые делали заказы каждый день с момента регистрации**
```sql
-- Сложная задача! Можно пропустить для начала
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM products
WHERE product_id NOT IN (
    SELECT DISTINCT product_id FROM order_items
);

-- 2
SELECT 
    u.username,
    COUNT(o.order_id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    COALESCE(AVG(o.total_amount), 0) as avg_check
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id
ORDER BY total_spent DESC;

-- 3
SELECT 
    c.category_name,
    AVG(oi.unit_price) as avg_price
FROM categories c
INNER JOIN products p ON c.category_id = p.category_id
INNER JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY c.category_id
ORDER BY avg_price ASC
LIMIT 1;
```
</details>

---

## ✅ Финальный чек-лист готовности к собеседованию:

### Технические навыки:
- [ ] Умею писать SELECT с условиями WHERE
- [ ] Понимаю операторы AND, OR, BETWEEN, IN, LIKE
- [ ] Умею сортировать ORDER BY и ограничивать LIMIT
- [ ] Знаю агрегатные функции: COUNT, SUM, AVG, MIN, MAX
- [ ] Умею группировать GROUP BY
- [ ] Понимаю разницу WHERE vs HAVING
- [ ] Освоил INNER JOIN и LEFT JOIN
- [ ] Умею находить записи без связей
- [ ] Могу писать подзапросы
- [ ] Использую CASE для условной логики

### Типичные QA-задачи:
- [ ] Поиск дубликатов
- [ ] Проверка целостности данных
- [ ] Поиск NULL значений
- [ ] Поиск некорректных значений
- [ ] Проверка бизнес-правил
- [ ] Расчет метрик и статистики

### Вопросы для собеседования:
- [ ] Разница WHERE vs HAVING
- [ ] Разница INNER JOIN vs LEFT JOIN
- [ ] Что такое PRIMARY KEY
- [ ] Как найти дубликаты
- [ ] Как найти N-й максимум
- [ ] Зачем нужен индекс
- [ ] Что делает DISTINCT

---

## 🎓 Дополнительные ресурсы

### Для практики:
1. **SQL-EX** (https://www.sql-ex.ru/) — задачи на русском языке
2. **SQLZoo** (https://sqlzoo.net/) — интерактивные уроки
3. **LeetCode Database** (https://leetcode.com/problemset/database/) — задачи разных уровней
4. **HackerRank SQL** (https://www.hackerrank.com/domains/sql) — практика с рейтингом

### Шпаргалка основных команд:

```sql
-- Создание
CREATE TABLE table_name (column1 type, column2 type);

-- Вставка
INSERT INTO table_name (col1, col2) VALUES (val1, val2);

-- Выборка
SELECT col1, col2 FROM table_name WHERE condition;

-- Группировка
SELECT col, COUNT(*) FROM table_name GROUP BY col;

-- Объединение
SELECT * FROM t1 JOIN t2 ON t1.id = t2.id;

-- Сортировка
SELECT * FROM table_name ORDER BY col DESC;

-- Агрегация
SELECT COUNT(*), SUM(col), AVG(col), MIN(col), MAX(col) FROM table_name;
```

---

## 🎯 Что дальше?

После прохождения 4-дневного курса:

1. **Практикуйся каждый день** — хотя бы 30 минут
2. **Реши 20-30 задач** на SQL-EX или LeetCode
3. **Создай свою базу данных** с данными, которые тебе интересны
4. **Попрактикуй собеседовательные вопросы** вслух
5. **Изучи специфику конкретной СУБД** (PostgreSQL, MySQL, MS SQL) если знаешь куда идешь

---

## 🏆 Поздравляю!

Ты прошел полный путь от установки до сложных запросов. Теперь ты готов к собеседованию на позицию ручного QA, где требуется знание SQL!

**Удачи на собеседовании! 🚀**

---

## Обратная связь

Если нашел ошибку или у тебя есть вопросы — не стесняйся спрашивать!

