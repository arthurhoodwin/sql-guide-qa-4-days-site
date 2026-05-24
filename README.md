# VK QA Interview Sprint (3 дня)

<p align="center">
  <img src="https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-0B3D91?style=for-the-badge" alt="stack" />
  <img src="https://img.shields.io/badge/mode-static%20site-0EA5A4?style=for-the-badge" alt="mode" />
  <img src="https://img.shields.io/badge/focus-QA%20Interview-F59E0B?style=for-the-badge" alt="focus" />
</p>

Интерактивный тренажер для подготовки к QA-собеседованию за 3 дня:
- Теория QA + практические блоки
- Отдельный SQL-трек на 3 дня
- Поведенческий трек на 3 дня
- SQL-песочница с датасетами, банком задач и автопроверкой
- QA-квизлеты и поиск по материалам

---

## Что внутри

### 1. Трек «Теория и техничка» (3 дня)
- Виды тестирования, тест-дизайн, SDLC/STLC
- Клиент-сервер, HTTP/API, статус-коды
- Документация QA и типовые вопросы на интервью

### 2. Трек «SQL» (3 дня)
- День 1: SELECT / FROM / WHERE / ORDER BY / LIMIT / OFFSET
- День 2: JOIN / GROUP BY / HAVING / агрегаты
- День 3: финальный прогон лайвкодинга

### 3. Трек «Поведенческий» (3 дня)
- STAR-структура
- Ответы про опыт, фейлы, конфликты, мотивацию
- Подготовка к hr/behavioral части

### 4. SQL-песочница
- Готовые датасеты + кастомные датасеты
- Выбор задачи из банка (с автоподключением нужной БД)
- Автопроверка решения
- История запусков, автодополнение SQL по `Tab`

### 5. QA-квизлеты
- Большой набор карточек по темам junior QA
- Фильтрация по темам и поиск
- Перемешивание вариантов ответов

---

## Быстрый старт

```powershell
python -m http.server 8000
```

Открой в браузере: [http://localhost:8000](http://localhost:8000)

---

## Структура проекта

```text
.
├── index.html
├── day1.html / day2.html / day3.html
├── sandbox.html
├── quizlets.html
├── team-processes.html
├── team-processes-quiz.html
├── app.js
├── sandbox.js
├── quizlets.js
├── quizlets-data.js
├── styles.css
└── content/
    ├── theory-day1..3.md
    ├── sql-day1..3.md
    ├── behavioral-day1..3.md
    └── team-processes-deep.md
```

---

## Рекомендация по использованию

1. Проходи по дням последовательно (Теория + SQL + Поведенческий).
2. После каждого дня решай SQL-задачи в песочнице.
3. В конце дня прогоняй квизлеты по слабым темам.
4. В день собеса повтори только чек-листы и проблемные блоки.

---

## Планы развития

- Добавить больше SQL-датасетов под продуктовые кейсы
- Добавить расширенную аналитику прогресса
- Добавить больше тематических наборов квизлетов
