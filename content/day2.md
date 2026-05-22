# 🎯 ДЕНЬ 2: Фильтрация и работа с данными

## Часть 1: Продвинутые условия WHERE (2 часа)

### Операторы сравнения

| Оператор | Значение | Пример |
|----------|----------|--------|
| = | равно | `WHERE age = 25` |
| != или <> | не равно | `WHERE age != 25` |
| > | больше | `WHERE price > 1000` |
| < | меньше | `WHERE price < 1000` |
| >= | больше или равно | `WHERE age >= 18` |
| <= | меньше или равно | `WHERE age <= 65` |

### Логические операторы

#### AND — оба условия должны быть истинными

```sql
-- Найти товары из категории "Электроника" дороже 50000
SELECT * FROM products
WHERE category = 'Электроника' AND price > 50000;
```

#### OR — хотя бы одно условие истинно

```sql
-- Найти товары из категории "Электроника" ИЛИ "Периферия"
SELECT * FROM products
WHERE category = 'Электроника' OR category = 'Периферия';
```

#### Комбинация AND и OR (используй скобки!)

```sql
-- Дорогие товары (>50000) ИЛИ товары с маленьким остатком (<10)
-- из категории "Электроника"
SELECT * FROM products
WHERE category = 'Электроника' 
  AND (price > 50000 OR in_stock < 10);
```

⚠️ **ВАЖНО:** Скобки определяют порядок выполнения!

---

### Специальные операторы

#### BETWEEN — диапазон значений

```sql
-- Товары от 1000 до 10000 рублей
SELECT * FROM products
WHERE price BETWEEN 1000 AND 10000;

-- Это то же самое что:
SELECT * FROM products
WHERE price >= 1000 AND price <= 10000;
```

#### IN — список значений

```sql
-- Товары из нескольких категорий
SELECT * FROM products
WHERE category IN ('Электроника', 'Периферия');

-- Это короче чем:
SELECT * FROM products
WHERE category = 'Электроника' OR category = 'Периферия';
```

#### LIKE — поиск по шаблону

**Специальные символы:**
- `%` — любое количество любых символов (0 или больше)
- `_` — ровно один любой символ

```sql
-- Все товары, название которых начинается с "iPhone"
SELECT * FROM products
WHERE product_name LIKE 'iPhone%';

-- Все товары со словом "часы" в названии
SELECT * FROM products
WHERE product_name LIKE '%часы%';

-- Все товары, где название начинается на "Н" и содержит "к"
SELECT * FROM products
WHERE product_name LIKE 'Н%к%';
```

#### IS NULL / IS NOT NULL — проверка на пустое значение

```sql
-- Найти пользователей без email
SELECT * FROM users
WHERE email IS NULL;

-- Найти пользователей с указанным email
SELECT * FROM users
WHERE email IS NOT NULL;
```

⚠️ **ВАЖНО:** Нельзя писать `WHERE email = NULL`! Только `IS NULL`.

---

## Часть 2: Сортировка ORDER BY (1 час)

### Синтаксис

```sql
SELECT столбцы
FROM таблица
ORDER BY столбец1 [ASC|DESC], столбец2 [ASC|DESC];
```

- **ASC** — по возрастанию (по умолчанию)
- **DESC** — по убыванию

### Примеры

```sql
-- Товары от дешевых к дорогим
SELECT * FROM products
ORDER BY price ASC;

-- Товары от дорогих к дешевым
SELECT * FROM products
ORDER BY price DESC;

-- Сортировка по нескольким столбцам
-- Сначала по категории (алфавит), потом по цене (убывание)
SELECT * FROM products
ORDER BY category ASC, price DESC;
```

### LIMIT — ограничение количества результатов

```sql
-- Топ-5 самых дорогих товаров
SELECT * FROM products
ORDER BY price DESC
LIMIT 5;

-- Топ-3 товаров с самым маленьким остатком
SELECT product_name, in_stock
FROM products
ORDER BY in_stock ASC
LIMIT 3;
```

---

## Часть 3: DISTINCT — уникальные значения (30 минут)

### Синтаксис

```sql
SELECT DISTINCT столбец
FROM таблица;
```

### Примеры

```sql
-- Список всех уникальных категорий
SELECT DISTINCT category
FROM products;

-- Результат: Электроника, Аксессуары, Периферия
```

```sql
-- Уникальные возрасты пользователей
SELECT DISTINCT age
FROM users
ORDER BY age;
```

---

## 📝 ЗАДАНИЯ ДЕНЬ 2

Для выполнения заданий, сначала создай таблицу заказов:

```sql
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER,
    total_price REAL,
    order_date DATE,
    status TEXT
);

INSERT INTO orders (order_id, customer_name, product_name, quantity, total_price, order_date, status) VALUES
    (1, 'Иван Петров', 'iPhone 14', 1, 79990, '2024-01-15', 'completed'),
    (2, 'Мария Сидорова', 'Наушники Sony', 2, 11980, '2024-01-16', 'completed'),
    (3, 'Петр Иванов', 'Ноутбук ASUS', 1, 54990, '2024-01-16', 'pending'),
    (4, 'Анна Смирнова', 'Чехол для телефона', 3, 1497, '2024-01-17', 'completed'),
    (5, 'Дмитрий Козлов', 'Samsung Galaxy S23', 1, 69990, '2024-01-17', 'cancelled'),
    (6, 'Иван Петров', 'Зарядное устройство', 2, 2580, '2024-01-18', 'completed'),
    (7, 'Мария Сидорова', 'Клавиатура Logitech', 1, 3499, '2024-01-18', 'completed'),
    (8, 'Петр Иванов', 'Мышь Razer', 1, 2999, '2024-01-19', 'pending'),
    (9, 'Анна Смирнова', 'Умные часы Apple Watch', 1, 39990, '2024-01-19', 'cancelled'),
    (10, 'Дмитрий Козлов', 'Веб-камера', 1, 4999, '2024-01-20', 'completed'),
    (11, 'Иван Петров', 'iPhone 14', 1, 79990, '2024-01-20', 'completed'),
    (12, 'Мария Сидорова', 'Ноутбук ASUS', 1, 54990, '2024-01-21', 'completed'),
    (13, 'Петр Иванов', 'Чехол для телефона', 5, 2495, '2024-01-21', 'pending'),
    (14, 'Анна Смирнова', 'Наушники Sony', 1, 5990, '2024-01-22', 'completed'),
    (15, 'Дмитрий Козлов', 'Клавиатура Logitech', 2, 6998, '2024-01-22', 'cancelled');
```

---

### Задание 2.1: Базовая фильтрация

**1. Найди все завершенные заказы (status = 'completed')**
```sql
-- ТВОЙ КОД
```

**2. Найди все заказы дороже 10000 рублей**
```sql
-- ТВОЙ КОД
```

**3. Найди все заказы клиента "Иван Петров"**
```sql
-- ТВОЙ КОД
```

**4. Найди все отмененные заказы (status = 'cancelled')**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM orders WHERE status = 'completed';

-- 2
SELECT * FROM orders WHERE total_price > 10000;

-- 3
SELECT * FROM orders WHERE customer_name = 'Иван Петров';

-- 4
SELECT * FROM orders WHERE status = 'cancelled';
```
</details>

---

### Задание 2.2: Сложные условия

**1. Найди заказы в статусе "pending" ИЛИ "cancelled"**
```sql
-- ТВОЙ КОД
```

**2. Найди заказы Ивана Петрова, которые завершены**
```sql
-- ТВОЙ КОД
```

**3. Найди заказы с ценой от 5000 до 50000 рублей**
```sql
-- ТВОЙ КОД
```

**4. Найди заказы клиентов Иван Петров, Мария Сидорова или Петр Иванов**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM orders 
WHERE status = 'pending' OR status = 'cancelled';
-- Или так:
SELECT * FROM orders 
WHERE status IN ('pending', 'cancelled');

-- 2
SELECT * FROM orders 
WHERE customer_name = 'Иван Петров' AND status = 'completed';

-- 3
SELECT * FROM orders 
WHERE total_price BETWEEN 5000 AND 50000;

-- 4
SELECT * FROM orders 
WHERE customer_name IN ('Иван Петров', 'Мария Сидорова', 'Петр Иванов');
```
</details>

---

### Задание 2.3: Поиск по шаблону (LIKE)

**1. Найди все заказы, где в названии товара есть слово "iPhone"**
```sql
-- ТВОЙ КОД
```

**2. Найди всех клиентов, чье имя начинается на "А"**
```sql
-- ТВОЙ КОД
```

**3. Найди все товары, в названии которых есть слово "для"**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM orders WHERE product_name LIKE '%iPhone%';

-- 2
SELECT DISTINCT customer_name FROM orders WHERE customer_name LIKE 'А%';

-- 3
SELECT DISTINCT product_name FROM orders WHERE product_name LIKE '%для%';
```
</details>

---

### Задание 2.4: Сортировка

**1. Выведи все заказы, отсортированные по цене от дорогих к дешевым**
```sql
-- ТВОЙ КОД
```

**2. Выведи топ-5 самых дорогих заказов**
```sql
-- ТВОЙ КОД
```

**3. Выведи заказы, отсортированные сначала по клиенту (алфавит), потом по дате (новые первые)**
```sql
-- ТВОЙ КОД
```

**4. Найди 3 самых дешевых завершенных заказа**
```sql
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM orders ORDER BY total_price DESC;

-- 2
SELECT * FROM orders ORDER BY total_price DESC LIMIT 5;

-- 3
SELECT * FROM orders ORDER BY customer_name ASC, order_date DESC;

-- 4
SELECT * FROM orders 
WHERE status = 'completed' 
ORDER BY total_price ASC 
LIMIT 3;
```
</details>

---

### Задание 2.5: QA-сценарии (ВАЖНО ДЛЯ СОБЕСЕДОВАНИЯ!)

Это задания, которые часто встречаются в работе QA:

**1. Найди все заказы с отрицательной ценой (баг в системе!)**
```sql
-- ТВОЙ КОД
```

**2. Найди все заказы с нулевым количеством товара (тоже баг!)**
```sql
-- ТВОЙ КОД
```

**3. Найди все уникальные статусы заказов (проверка справочника)**
```sql
-- ТВОЙ КОД
```

**4. Найди заказы без даты (возможная проблема валидации)**
```sql
-- ТВОЙ КОД
```

**5. Найди дубликаты: одинаковые заказы от одного клиента в один день**
```sql
-- Подсказка: SELECT customer_name, order_date, COUNT(*) ...
-- ТВОЙ КОД
```

<details>
<summary>👁️ Показать решения</summary>

```sql
-- 1
SELECT * FROM orders WHERE total_price < 0;

-- 2
SELECT * FROM orders WHERE quantity = 0 OR quantity IS NULL;

-- 3
SELECT DISTINCT status FROM orders;

-- 4
SELECT * FROM orders WHERE order_date IS NULL;

-- 5
SELECT customer_name, order_date, COUNT(*) as order_count
FROM orders
GROUP BY customer_name, order_date
HAVING COUNT(*) > 1;
-- Примечание: GROUP BY и HAVING — это тема Дня 3, но можешь попробовать!
```
</details>

---

## ✅ Чек-лист дня 2:

- [ ] Понял разницу между AND и OR
- [ ] Научился использовать BETWEEN и IN
- [ ] Освоил LIKE для поиска по шаблону
- [ ] Понял разницу между = NULL и IS NULL
- [ ] Научился сортировать ORDER BY
- [ ] Использовал LIMIT для топ-N запросов
- [ ] Решил все QA-сценарии

**Готов к Дню 3? Там будет сложнее, но интереснее! 🚀**

---
---

