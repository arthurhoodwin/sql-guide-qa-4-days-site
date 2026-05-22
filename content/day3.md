# 🎯 ДЕНЬ 3: Агрегация, группировка и JOIN

## Часть 1: Агрегатные функции (2 часа)

### Что такое агрегатные функции?

Агрегатные функции берут много строк и возвращают ОДНО значение.

### Основные функции:

| Функция | Что делает | Пример |
|---------|-----------|--------|
| COUNT() | Считает количество строк | COUNT(*) |
| SUM() | Сумма значений | SUM(price) |
| AVG() | Среднее значение | AVG(age) |
| MIN() | Минимальное значение | MIN(price) |
| MAX() | Максимальное значение | MAX(price) |

---

### COUNT — подсчет количества

```sql
-- Сколько всего заказов?
SELECT COUNT(*) FROM orders;

-- Сколько завершенных заказов?
SELECT COUNT(*) FROM orders WHERE status = 'completed';

-- Сколько уникальных клиентов?
SELECT COUNT(DISTINCT customer_name) FROM orders;
```

⚠️ **Разница:**
- `COUNT(*)` — считает ВСЕ строки, включая NULL
- `COUNT(столбец)` — считает строки, где столбец НЕ NULL
- `COUNT(DISTINCT столбец)` — считает уникальные значения

---

### SUM — сумма

```sql
-- Общая сумма всех заказов
SELECT SUM(total_price) FROM orders;

-- Сумма завершенных заказов
SELECT SUM(total_price) FROM orders WHERE status = 'completed';

-- Общее количество проданных товаров
SELECT SUM(quantity) FROM orders WHERE status = 'completed';
```

---

### AVG — среднее значение

```sql
-- Средний чек заказа
SELECT AVG(total_price) FROM orders;

-- Средний чек завершенных заказов
SELECT AVG(total_price) FROM orders WHERE status = 'completed';

-- Округлим до 2 знаков
SELECT ROUND(AVG(total_price), 2) FROM orders;
```

---

### MIN и MAX — минимум и максимум

```sql
-- Самый дешевый и самый дорогой заказ
SELECT MIN(total_price), MAX(total_price) FROM orders;

-- Самая ранняя и самая поздняя дата заказа
SELECT MIN(order_date), MAX(order_date) FROM orders;
```

---

### Комбинирование функций

```sql
-- Статистика по заказам
SELECT 
    COUNT(*) as total_orders,
    SUM(total_price) as total_revenue,
    AVG(total_price) as average_check,
    MIN(total_price) as min_price,
    MAX(total_price) as max_price
FROM orders
WHERE status = 'completed';
```

---

## Часть 2: GROUP BY — группировка (2 часа)

### Зачем нужна группировка?

Представь: нужно посчитать сколько заказов сделал КАЖДЫЙ клиент. GROUP BY решает эту задачу!

### Синтаксис

```sql
SELECT столбец, АГРЕГАТНАЯ_ФУНКЦИЯ(столбец)
FROM таблица
GROUP BY столбец;
```

### Примеры:

#### Количество заказов по каждому клиенту

```sql
SELECT customer_name, COUNT(*) as orders_count
FROM orders
GROUP BY customer_name;
```

**Результат:**
| customer_name | orders_count |
|---------------|--------------|
| Анна Смирнова | 3 |
| Дмитрий Козлов | 3 |
| Иван Петров | 3 |
| Мария Сидорова | 3 |
| Петр Иванов | 3 |

---

#### Общая сумма покупок каждого клиента

```sql
SELECT 
    customer_name, 
    SUM(total_price) as total_spent
FROM orders
GROUP BY customer_name
ORDER BY total_spent DESC;
```

---

#### Количество заказов по каждому статусу

```sql
SELECT 
    status, 
    COUNT(*) as count,
    SUM(total_price) as total
FROM orders
GROUP BY status;
```

---

#### Группировка по нескольким столбцам

```sql
-- Количество заказов каждого клиента по каждому статусу
SELECT 
    customer_name, 
    status, 
    COUNT(*) as count
FROM orders
GROUP BY customer_name, status
ORDER BY customer_name, status;
```

---

### HAVING — фильтр после группировки

**WHERE** фильтрует строки ДО группировки.  
**HAVING** фильтрует группы ПОСЛЕ группировки.

```sql
-- Клиенты, у которых больше 2 заказов
SELECT customer_name, COUNT(*) as orders_count
FROM orders
GROUP BY customer_name
HAVING COUNT(*) > 2;
```

```sql
-- Клиенты, которые потратили больше 100000 рублей
SELECT 
    customer_name, 
    SUM(total_price) as total_spent
FROM orders
WHERE status = 'completed'  -- WHERE — фильтр ДО группировки
GROUP BY customer_name
HAVING SUM(total_price) > 100000;  -- HAVING — фильтр ПОСЛЕ
```

---

### Порядок выполнения SQL:

1. **FROM** — берем таблицу
2. **WHERE** — фильтруем строки
3. **GROUP BY** — группируем
4. **HAVING** — фильтруем группы
5. **SELECT** — выбираем столбцы
6. **ORDER BY** — сортируем
7. **LIMIT** — ограничиваем

---

## Часть 3: JOIN — объединение таблиц (3 часа)

### Зачем нужен JOIN?

В реальных базах данные хранятся в РАЗНЫХ таблицах. JOIN позволяет их объединять.

### Подготовка: создаем связанные таблицы

```sql
-- Таблица клиентов
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    city TEXT
);

INSERT INTO customers (customer_id, name, email, city) VALUES
    (1, 'Иван Петров', 'ivan@test.ru', 'Москва'),
    (2, 'Мария Сидорова', 'maria@test.ru', 'Санкт-Петербург'),
    (3, 'Петр Иванов', 'petr@test.ru', 'Казань'),
    (4, 'Анна Смирнова', 'anna@test.ru', 'Москва'),
    (5, 'Дмитрий Козлов', 'dmitry@test.ru', 'Новосибирск'),
    (6, 'Елена Волкова', 'elena@test.ru', 'Москва');

-- Таблица заказов (упрощенная)
CREATE TABLE customer_orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    product TEXT,
    amount REAL,
    order_date DATE
);

INSERT INTO customer_orders (order_id, customer_id, product, amount, order_date) VALUES
    (1, 1, 'iPhone 14', 79990, '2024-01-15'),
    (2, 2, 'Наушники', 5990, '2024-01-16'),
    (3, 1, 'Чехол', 499, '2024-01-17'),
    (4, 3, 'Ноутбук', 54990, '2024-01-18'),
    (5, 4, 'Клавиатура', 3499, '2024-01-19'),
    (6, 1, 'Мышь', 2999, '2024-01-20'),
    (7, 2, 'Веб-камера', 4999, '2024-01-21');
```

**Связь:** `customer_orders.customer_id` → `customers.customer_id`

---

### INNER JOIN — только совпадения

Возвращает строки, где есть совпадение в ОБЕИХ таблицах.

```sql
SELECT 
    customers.name,
    customers.city,
    customer_orders.product,
    customer_orders.amount
FROM customers
INNER JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id;
```

**Что происходит:**
- Берем каждый заказ
- Ищем клиента с таким customer_id
- Если нашли — объединяем данные
- Если НЕ нашли — пропускаем

**Результат:** Только клиенты, у которых есть заказы (Елена Волкова НЕ появится).

---

### LEFT JOIN — все из левой таблицы

Возвращает ВСЕ строки из левой таблицы + совпадения из правой.

```sql
SELECT 
    customers.name,
    customer_orders.product,
    customer_orders.amount
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id;
```

**Результат:** ВСЕ клиенты, включая Елену Волкову (у нее product и amount будут NULL).

---

### Разница между INNER JOIN и LEFT JOIN

```sql
-- INNER JOIN: только клиенты с заказами
SELECT COUNT(DISTINCT customers.customer_id)
FROM customers
INNER JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id;
-- Результат: 4

-- LEFT JOIN: все клиенты
SELECT COUNT(DISTINCT customers.customer_id)
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id;
-- Результат: 6
```

---

### JOIN + WHERE — фильтрация

```sql
-- Заказы клиентов из Москвы
SELECT 
    customers.name,
    customers.city,
    customer_orders.product,
    customer_orders.amount
FROM customers
INNER JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
WHERE customers.city = 'Москва';
```

---

### JOIN + GROUP BY — группировка по объединенным данным

```sql
-- Сколько денег потратил каждый клиент
SELECT 
    customers.name,
    COUNT(customer_orders.order_id) as orders_count,
    SUM(customer_orders.amount) as total_spent
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
GROUP BY customers.customer_id
ORDER BY total_spent DESC;
```

---

### QA-задача: Найти клиентов БЕЗ заказов

```sql
SELECT customers.name, customers.email
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
WHERE customer_orders.order_id IS NULL;
```

**Логика:**
- LEFT JOIN вернет всех клиентов
- У клиентов без заказов order_id будет NULL
- Фильтруем по IS NULL

---

## 📝 ЗАДАНИЯ ДЕНЬ 3

### Задание 3.1: Агрегатные функции

Используй таблицу `orders` из Дня 2.

**1. Сколько всего заказов в базе?**
```sql
-- ТВОЙ КОД
```

**2. Какая общая сумма всех заказов?**
```sql
-- ТВОЙ КОД
```

**3. Какой средний чек заказа?**
```sql
-- ТВОЙ КОД
```

**4. Самый дешевый и самый дорогой заказ?**
```sql
-- ТВОЙ КОД
```

**5. Сколько уникальных клиентов сделали заказы?**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT COUNT(*) as total_orders FROM orders;

-- 2
SELECT SUM(total_price) as total_revenue FROM orders;

-- 3
SELECT ROUND(AVG(total_price), 2) as average_check FROM orders;

-- 4
SELECT MIN(total_price) as min_order, MAX(total_price) as max_order FROM orders;

-- 5
SELECT COUNT(DISTINCT customer_name) as unique_customers FROM orders;
```
</details>

---

### Задание 3.2: GROUP BY

**1. Сколько заказов сделал каждый клиент?**
```sql
-- ТВОЙ КОД
```

**2. Какую общую сумму потратил каждый клиент? (сортировка по убыванию)**
```sql
-- ТВОЙ КОД
```

**3. Количество заказов по каждому статусу**
```sql
-- ТВОЙ КОД
```

**4. Средний чек по каждому статусу заказа**
```sql
-- ТВОЙ КОД
```

**5. Сколько разных товаров заказал каждый клиент?**
```sql
-- Подсказка: используй COUNT(DISTINCT product_name)
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT customer_name, COUNT(*) as order_count
FROM orders
GROUP BY customer_name
ORDER BY order_count DESC;

-- 2
SELECT customer_name, SUM(total_price) as total_spent
FROM orders
GROUP BY customer_name
ORDER BY total_spent DESC;

-- 3
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status;

-- 4
SELECT status, ROUND(AVG(total_price), 2) as avg_check
FROM orders
GROUP BY status;

-- 5
SELECT customer_name, COUNT(DISTINCT product_name) as unique_products
FROM orders
GROUP BY customer_name
ORDER BY unique_products DESC;
```
</details>

---

### Задание 3.3: HAVING

**1. Найди клиентов, у которых больше 2 заказов**
```sql
-- ТВОЙ КОД
```

**2. Найди клиентов, которые потратили больше 50000 рублей**
```sql
-- ТВОЙ КОД
```

**3. Найди статусы, где средний чек больше 10000 рублей**
```sql
-- ТВОЙ КОД
```

**4. Найди товары, которые заказывали больше 2 раз**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT customer_name, COUNT(*) as order_count
FROM orders
GROUP BY customer_name
HAVING COUNT(*) > 2;

-- 2
SELECT customer_name, SUM(total_price) as total_spent
FROM orders
GROUP BY customer_name
HAVING SUM(total_price) > 50000;

-- 3
SELECT status, AVG(total_price) as avg_check
FROM orders
GROUP BY status
HAVING AVG(total_price) > 10000;

-- 4
SELECT product_name, COUNT(*) as times_ordered
FROM orders
GROUP BY product_name
HAVING COUNT(*) > 2
ORDER BY times_ordered DESC;
```
</details>

---

### Задание 3.4: JOIN

Используй таблицы `customers` и `customer_orders`.

**1. Выведи все заказы с именами клиентов**
```sql
-- ТВОЙ КОД
```

**2. Выведи имя, город и общую сумму покупок каждого клиента**
```sql
-- ТВОЙ КОД
```

**3. Найди клиентов БЕЗ заказов**
```sql
-- ТВОЙ КОД
```

**4. Выведи заказы клиентов только из Москвы**
```sql
-- ТВОЙ КОД
```

**5. Посчитай количество заказов и общую сумму по каждому городу**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT 
    customers.name,
    customer_orders.product,
    customer_orders.amount,
    customer_orders.order_date
FROM customers
INNER JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id;

-- 2
SELECT 
    customers.name,
    customers.city,
    SUM(customer_orders.amount) as total_spent
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
GROUP BY customers.customer_id;

-- 3
SELECT customers.name, customers.email
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
WHERE customer_orders.order_id IS NULL;

-- 4
SELECT 
    customers.name,
    customers.city,
    customer_orders.product,
    customer_orders.amount
FROM customers
INNER JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
WHERE customers.city = 'Москва';

-- 5
SELECT 
    customers.city,
    COUNT(customer_orders.order_id) as orders_count,
    COALESCE(SUM(customer_orders.amount), 0) as total_revenue
FROM customers
LEFT JOIN customer_orders 
    ON customers.customer_id = customer_orders.customer_id
GROUP BY customers.city
ORDER BY total_revenue DESC;
```
</details>

---

## ✅ Чек-лист дня 3:

- [ ] Понял и использовал COUNT, SUM, AVG, MIN, MAX
- [ ] Научился группировать данные через GROUP BY
- [ ] Понял разницу между WHERE и HAVING
- [ ] Освоил INNER JOIN
- [ ] Освоил LEFT JOIN
- [ ] Понял разницу между INNER JOIN и LEFT JOIN
- [ ] Умею находить записи без связей (клиенты без заказов)
- [ ] Комбинирую JOIN + GROUP BY

**День 3 — самый сложный, но ты справился! Переходим к финалу 🔥**

---
---

