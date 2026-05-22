# 🎯 ДЕНЬ 6: SQL лайвкодинг (простые запросы)

## Что будет на техничке

Обычно просят 1-2 простых запроса:
- `SELECT ... WHERE`
- `ORDER BY`, `LIMIT`
- `COUNT`, `SUM`, `AVG`

## Как не застрять

1. Сначала выпиши таблицу и нужные поля
2. Скажи вслух, какой результат нужен
3. Напиши запрос кусками: `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `ORDER BY`

## Мини-шаблоны

```sql
SELECT * FROM table_name WHERE condition;
SELECT col1, col2 FROM table_name ORDER BY col2 DESC LIMIT 5;
SELECT col, COUNT(*) FROM table_name GROUP BY col;
```

## Фокус дня

Скорость + аккуратный синтаксис без паники.
