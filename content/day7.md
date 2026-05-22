# 🎯 ДЕНЬ 7: SQL лайвкодинг (JOIN + агрегаты)

## Что спросить могут

- `INNER JOIN` vs `LEFT JOIN`
- `GROUP BY` + `HAVING`
- Поиск аномалий/дубликатов

## Базовые паттерны

```sql
SELECT a.id, b.name
FROM a
INNER JOIN b ON a.b_id = b.id;
```

```sql
SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 3;
```

## QA-направленные задачи

- Пользователи без заказов
- Заказы с неконсистентной суммой
- Дубликаты email/username

## Цель дня

Уметь объяснить **почему именно этот JOIN/агрегация**.
