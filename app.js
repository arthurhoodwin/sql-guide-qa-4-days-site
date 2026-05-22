const TOTAL_DAYS = 4;
const STORAGE_KEY = "sql-guide-progress-v1";
const TASK_STORAGE_KEY = "sql-guide-task-progress-v1";

const dayMeta = {
  1: "Установка, база данных, CREATE/INSERT/SELECT",
  2: "WHERE, фильтры, сортировка, LIMIT, DISTINCT",
  3: "Агрегация, GROUP BY, HAVING, JOIN",
  4: "Сложные запросы и подготовка к собеседованию"
};

const DAY_SEEDS = {
  1: `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      age INTEGER,
      registration_date DATE DEFAULT CURRENT_DATE
    );
    INSERT INTO users (id, name, email, age, registration_date) VALUES
      (1, 'Иван Петров', 'ivan@test.ru', 25, '2024-01-01'),
      (2, 'Мария Сидорова', 'maria@test.ru', 30, '2024-01-05'),
      (3, 'Петр Иванов', 'petr@test.ru', 28, '2024-01-10');
  `,
  2: `
    DROP TABLE IF EXISTS products;
    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT,
      price REAL,
      in_stock INTEGER
    );
    INSERT INTO products (product_id, product_name, category, price, in_stock) VALUES
      (1, 'iPhone 14', 'Электроника', 79990, 15),
      (2, 'Samsung Galaxy S23', 'Электроника', 69990, 20),
      (3, 'Ноутбук ASUS', 'Электроника', 54990, 8),
      (4, 'Наушники Sony', 'Аксессуары', 5990, 50),
      (5, 'Чехол для телефона', 'Аксессуары', 499, 100),
      (6, 'Зарядное устройство', 'Аксессуары', 1290, 75),
      (7, 'Apple Watch', 'Электроника', 39990, 12),
      (8, 'Клавиатура Logitech', 'Периферия', 3499, 30),
      (9, 'Мышь Razer', 'Периферия', 2999, 40),
      (10, 'Веб-камера', 'Периферия', 4999, 25);
  `,
  3: `
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS customer_orders;
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT
    );
    CREATE TABLE customer_orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      product TEXT,
      amount REAL,
      order_date DATE
    );
    INSERT INTO customers (customer_id, name, city) VALUES
      (1, 'Иван', 'Москва'),
      (2, 'Мария', 'Казань'),
      (3, 'Анна', 'Москва'),
      (4, 'Дмитрий', 'Самара'),
      (5, 'Олег', 'Казань');
    INSERT INTO customer_orders (order_id, customer_id, product, amount, order_date) VALUES
      (1, 1, 'Ноутбук', 50000, '2024-01-10'),
      (2, 1, 'Мышь', 3000, '2024-01-12'),
      (3, 2, 'Смартфон', 30000, '2024-01-11'),
      (4, 3, 'Наушники', 5000, '2024-01-13'),
      (5, 2, 'Клавиатура', 3500, '2024-01-14');
  `,
  4: `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS order_items;

    CREATE TABLE users (
      user_id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      registration_date DATE
    );

    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY,
      category_name TEXT NOT NULL
    );

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL,
      stock_quantity INTEGER DEFAULT 0
    );

    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      order_date DATE,
      total_amount REAL,
      status TEXT CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
    );

    CREATE TABLE order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_price REAL
    );

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
      (6, 'Роман Война и мир', 3, 800, 20),
      (7, 'Учебник SQL', 3, 1500, 15),
      (8, 'Пальто', 2, 9000, 6);

    INSERT INTO orders (order_id, user_id, order_date, total_amount, status) VALUES
      (1, 1, '2024-01-16', 51000, 'delivered'),
      (2, 2, '2024-01-17', 30000, 'delivered'),
      (3, 1, '2024-01-18', 5000, 'shipped'),
      (4, 3, '2024-01-19', 4500, 'cancelled'),
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
  `
};

const DAY_TASKS = {
  1: [
    {
      id: "d1_t1",
      title: "Создай таблицу products",
      prompt: "Создай таблицу products с полями: product_id (PK), product_name (NOT NULL), category, price, in_stock.",
      starter: "-- Создай таблицу products\nCREATE TABLE products (\n  product_id INTEGER PRIMARY KEY,\n  product_name TEXT NOT NULL,\n  category TEXT,\n  price REAL,\n  in_stock INTEGER\n);",
      validate: ({ db }) => {
        const r = db.exec("PRAGMA table_info(products);");
        if (!r.length || !r[0].values.length) return { ok: false, message: "Таблица products не найдена." };
        const rows = r[0].values;
        const names = rows.map((v) => String(v[1]));
        const needed = ["product_id", "product_name", "category", "price", "in_stock"];
        const missing = needed.filter((n) => !names.includes(n));
        if (missing.length) return { ok: false, message: `Не хватает колонок: ${missing.join(", ")}` };
        const pk = rows.find((v) => String(v[1]) === "product_id");
        if (!pk || Number(pk[5]) !== 1) return { ok: false, message: "product_id должен быть PRIMARY KEY." };
        return { ok: true, message: "Отлично: структура таблицы верная." };
      }
    },
    {
      id: "d1_t2",
      title: "Добавь минимум 5 товаров",
      prompt: "Вставь минимум 5 строк в products через INSERT.",
      starter: "-- Добавь минимум 5 товаров\nINSERT INTO products (product_id, product_name, category, price, in_stock) VALUES\n  -- (1, 'Название', 'Категория', 1000, 10)\n;",
      validate: ({ db }) => {
        const r = db.exec("SELECT COUNT(*) as c FROM products;");
        const count = Number(r[0].values[0][0]);
        if (count < 5) return { ok: false, message: `Сейчас в products только ${count} строк.` };
        return { ok: true, message: `Готово: добавлено ${count} строк.` };
      }
    },
    {
      id: "d1_t3",
      title: "SELECT с фильтром",
      prompt: "Выведи товары дороже 10000 рублей.",
      starter: "-- Выведи товары дороже 10000\nSELECT\nFROM\nWHERE ;",
      validate: ({ lastResult }) => {
        if (!lastResult) return { ok: false, message: "Запрос должен возвращать результат SELECT." };
        if (!lastResult.values.length) return { ok: false, message: "Пустой результат, ожидаются строки." };
        const priceIdx = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (priceIdx === -1) return { ok: false, message: "В результате должен быть столбец price." };
        const allGood = lastResult.values.every((row) => Number(row[priceIdx]) > 10000);
        if (!allGood) return { ok: false, message: "Есть строки с price <= 10000." };
        return { ok: true, message: "Верно: фильтрация по цене работает." };
      }
    }
  ],
  2: [
    {
      id: "d2_t1",
      title: "WHERE по категории",
      prompt: "Выведи все товары категории Электроника.",
      starter: "-- Выведи все товары категории Электроника\nSELECT\nFROM\nWHERE ;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидаются строки с результатом." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase() === "category");
        if (idx < 0) return { ok: false, message: "Нужен столбец category в результате." };
        const ok = lastResult.values.every((r) => String(r[idx]) === "Электроника");
        return ok ? { ok: true, message: "Да, отфильтровано корректно." } : { ok: false, message: "В выдаче есть не-Электроника." };
      }
    },
    {
      id: "d2_t2",
      title: "ORDER BY + LIMIT",
      prompt: "Покажи топ-3 самых дорогих товара.",
      starter: "-- Топ-3 самых дорогих товара\nSELECT\nFROM\nORDER BY\nLIMIT ;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length !== 3) return { ok: false, message: "Ожидается ровно 3 строки." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (idx < 0) return { ok: false, message: "Нужен столбец price." };
        const prices = lastResult.values.map((r) => Number(r[idx]));
        const sorted = [...prices].sort((a, b) => b - a);
        const same = prices.every((v, i) => v === sorted[i]);
        return same ? { ok: true, message: "Сортировка и LIMIT верны." } : { ok: false, message: "Проверь порядок DESC." };
      }
    },
    {
      id: "d2_t3",
      title: "DISTINCT",
      prompt: "Выведи все уникальные категории товаров.",
      starter: "-- Уникальные категории\nSELECT DISTINCT\nFROM ;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Результат пуст." };
        const vals = lastResult.values.map((r) => String(r[0]));
        const uniq = new Set(vals);
        if (uniq.size !== vals.length) return { ok: false, message: "Есть дубликаты, нужен DISTINCT." };
        if (uniq.size < 3) return { ok: false, message: "Ожидалось минимум 3 уникальные категории." };
        return { ok: true, message: "Отлично: уникальные категории получены." };
      }
    }
  ],
  3: [
    {
      id: "d3_t1",
      title: "GROUP BY",
      prompt: "Посчитай количество клиентов по городам.",
      starter: "-- Количество клиентов по городам\nSELECT\nFROM\nGROUP BY ;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length < 2) return { ok: false, message: "Нужна сгруппированная выдача по городам." };
        const countIdx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("count") || c.toLowerCase().includes("total"));
        if (countIdx < 0) return { ok: false, message: "Нужен агрегат COUNT." };
        return { ok: true, message: "GROUP BY применен корректно." };
      }
    },
    {
      id: "d3_t2",
      title: "INNER JOIN",
      prompt: "Покажи клиентов и их заказы (name, product, amount) через INNER JOIN.",
      starter: "-- Клиенты и их заказы через INNER JOIN\nSELECT\nFROM customers c\nINNER JOIN customer_orders o ON ;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "JOIN не дал строк, проверь условие ON." };
        const cols = lastResult.columns.map((c) => c.toLowerCase());
        const hasName = cols.some((c) => c.includes("name"));
        const hasProduct = cols.some((c) => c.includes("product"));
        return hasName && hasProduct
          ? { ok: true, message: "JOIN работает, данные склеены." }
          : { ok: false, message: "Добавь в SELECT имя клиента и товар." };
      }
    },
    {
      id: "d3_t3",
      title: "LEFT JOIN + NULL",
      prompt: "Найди клиентов без заказов (LEFT JOIN + WHERE ... IS NULL).",
      starter: "-- Клиенты без заказов\nSELECT\nFROM customers c\nLEFT JOIN customer_orders o ON\nWHERE ;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидался хотя бы 1 клиент без заказов." };
        return { ok: true, message: "Верно: найден(ы) клиент(ы) без заказов." };
      }
    }
  ],
  4: [
    {
      id: "d4_t1",
      title: "Подзапрос NOT IN",
      prompt: "Найди товары, которые никогда не покупали.",
      starter: "-- Товары, которые не покупали\nSELECT\nFROM products\nWHERE product_id NOT IN (\n  SELECT\n  FROM\n);",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается непустой результат." };
        const idIdx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("product_id"));
        if (idIdx < 0) return { ok: false, message: "Нужен product_id в результате." };
        const ids = lastResult.values.map((r) => Number(r[idIdx]));
        if (!ids.includes(8)) return { ok: false, message: "В тестовых данных ожидается товар с product_id = 8." };
        return { ok: true, message: "Супер: подзапрос решает задачу." };
      }
    },
    {
      id: "d4_t2",
      title: "Топ-3 товара",
      prompt: "Выведи топ-3 самых продаваемых товара по количеству.",
      starter: "-- Топ-3 по продажам\nSELECT\nFROM products p\nJOIN order_items oi ON\nGROUP BY\nORDER BY\nLIMIT ;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length !== 3) return { ok: false, message: "Ожидаются ровно 3 строки." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("total"));
        if (idx < 0) return { ok: false, message: "Нужна агрегированная колонка total_sold." };
        const vals = lastResult.values.map((r) => Number(r[idx]));
        const sorted = [...vals].sort((a, b) => b - a);
        const ok = vals.every((v, i) => v === sorted[i]);
        return ok ? { ok: true, message: "Топ построен корректно." } : { ok: false, message: "Проверь сортировку DESC." };
      }
    },
    {
      id: "d4_t3",
      title: "Проверка целостности сумм",
      prompt: "Найди заказы, где total_amount не равен сумме order_items.",
      starter: "-- Заказы с некорректной total_amount\nSELECT\nFROM orders o\nLEFT JOIN order_items oi ON\nGROUP BY\nHAVING ;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидался минимум один проблемный заказ." };
        const idIdx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("order_id"));
        const ids = idIdx >= 0 ? lastResult.values.map((r) => Number(r[idIdx])) : [];
        if (ids.length && !ids.includes(4)) return { ok: false, message: "В тестовых данных заказ #4 должен быть найден." };
        return { ok: true, message: "Отлично: найдено расхождение totals." };
      }
    }
  ]
};

let sqlJsPromise = null;

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const days = {};
    for (let i = 1; i <= TOTAL_DAYS; i++) days[i] = Boolean(parsed[i]);
    return days;
  } catch {
    return { 1: false, 2: false, 3: false, 4: false };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadTaskProgress() {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTaskProgress(progress) {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(progress));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildDayCard(day, progress) {
  const done = progress[day];
  return `
    <article class="panel day-card">
      <div class="day-badge">День ${day}</div>
      <h3 class="day-title">${dayMeta[day]}</h3>
      <p class="day-sub">Теория + интерактивные SQL-задачи с автопроверкой.</p>
      <div class="day-actions">
        <a class="btn primary" href="day${day}.html">Открыть</a>
        <button class="btn ghost" data-day-toggle="${day}" type="button">${done ? "Сбросить" : "Готово"}</button>
        <span class="status">${done ? "Пройдено" : "В процессе"}</span>
      </div>
    </article>`;
}

function renderIndex() {
  const progress = loadProgress();
  const daysGrid = document.getElementById("days-grid");
  const totalDone = Object.values(progress).filter(Boolean).length;

  daysGrid.innerHTML = [1, 2, 3, 4].map((d) => buildDayCard(d, progress)).join("");

  const progressText = document.getElementById("overall-progress");
  const progressFill = document.getElementById("progress-fill");
  progressText.textContent = `${totalDone} из ${TOTAL_DAYS} дней отмечено как пройдено`;
  progressFill.style.width = `${(totalDone / TOTAL_DAYS) * 100}%`;

  daysGrid.querySelectorAll("[data-day-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const day = Number(button.getAttribute("data-day-toggle"));
      progress[day] = !progress[day];
      saveProgress(progress);
      renderIndex();
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildDayPagination(day) {
  const wrap = document.getElementById("day-nav");
  const prev = day > 1 ? `<a class="btn ghost" href="day${day - 1}.html">← День ${day - 1}</a>` : `<span></span>`;
  const next = day < TOTAL_DAYS ? `<a class="btn primary" href="day${day + 1}.html">День ${day + 1} →</a>` : `<a class="btn primary" href="index.html">Ко всем дням</a>`;
  wrap.innerHTML = prev + next;
}

function renderResult(resultHost, runData) {
  if (!runData.lastResult) {
    resultHost.innerHTML = `<p class="sql-message">${escapeHtml(runData.summary)}</p>`;
    return;
  }
  const cols = runData.lastResult.columns;
  const rows = runData.lastResult.values;
  const header = cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`)
    .join("");
  resultHost.innerHTML = `
    <p class="sql-message">${escapeHtml(runData.summary)}</p>
    <div class="result-scroll">
      <table class="result-table">
        <thead><tr>${header}</tr></thead>
        <tbody>${body || `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`}</tbody>
      </table>
    </div>`;
}

function executeSql(db, sql) {
  const clean = sql.trim();
  if (!clean) throw new Error("SQL-запрос пуст");
  const before = db.getRowsModified();
  const resultSets = db.exec(clean);
  const changed = db.getRowsModified() - before;
  const lastResult = resultSets.length ? resultSets[resultSets.length - 1] : null;
  const summary = lastResult
    ? `OK: ${lastResult.values.length} строк(и)`
    : `OK: изменено строк ${Math.max(changed, 0)}`;
  return { lastResult, summary };
}

async function getSqlJs() {
  if (!sqlJsPromise) {
    sqlJsPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlJsPromise;
}

async function buildDatabaseForDay(day) {
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  db.run(DAY_SEEDS[day] || "");
  return db;
}

function getTaskState(day) {
  const state = loadTaskProgress();
  if (!state[day]) state[day] = {};
  return state;
}

async function renderPractice(day) {
  const panel = document.getElementById("practice-panel");
  if (!panel) return;

  const tasks = DAY_TASKS[day] || [];
  if (!tasks.length) {
    panel.innerHTML = "<p>Для этого дня интерактив пока не подготовлен.</p>";
    return;
  }

  panel.innerHTML = `
    <div class="practice-head">
      <h2>Интерактивная Практика</h2>
      <p>Выполняй SQL прямо на странице. Проверка идет по реальному результату запроса.</p>
    </div>
    <div class="practice-grid">
      <aside class="task-list" id="task-list"></aside>
      <section class="task-workbench">
        <div class="task-meta">
          <h3 id="task-title"></h3>
          <p id="task-prompt"></p>
          <p class="task-progress" id="task-progress"></p>
        </div>
        <textarea id="sql-input" spellcheck="false"></textarea>
        <div class="workbench-actions">
          <button class="btn primary" id="run-sql" type="button">Run SQL</button>
          <button class="btn ghost" id="check-sql" type="button">Проверить задачу</button>
          <button class="btn ghost" id="reset-db" type="button">Сбросить БД</button>
        </div>
        <div id="check-status" class="check-status"></div>
        <div id="sql-result" class="sql-result"></div>
      </section>
    </div>
  `;

  const taskState = getTaskState(day);
  let activeTask = 0;
  let db = await buildDatabaseForDay(day);

  const taskList = panel.querySelector("#task-list");
  const title = panel.querySelector("#task-title");
  const prompt = panel.querySelector("#task-prompt");
  const progress = panel.querySelector("#task-progress");
  const input = panel.querySelector("#sql-input");
  const runBtn = panel.querySelector("#run-sql");
  const checkBtn = panel.querySelector("#check-sql");
  const resetBtn = panel.querySelector("#reset-db");
  const checkStatus = panel.querySelector("#check-status");
  const result = panel.querySelector("#sql-result");

  function refreshHeaderProgress() {
    const done = tasks.filter((t) => Boolean(taskState[day][t.id])).length;
    progress.textContent = `Решено: ${done}/${tasks.length}`;

    if (done === tasks.length) {
      const dayProgress = loadProgress();
      dayProgress[day] = true;
      saveProgress(dayProgress);
      const toggle = document.getElementById("toggle-complete");
      if (toggle) toggle.textContent = "Убрать отметку о прохождении";
    }
  }

  function renderTaskButtons() {
    taskList.innerHTML = tasks
      .map((task, i) => {
        const done = Boolean(taskState[day][task.id]);
        const active = i === activeTask;
        return `<button class="task-btn ${active ? "active" : ""}" data-task-index="${i}" type="button">
          <span>${escapeHtml(task.title)}</span>
          <strong>${done ? "✓" : "•"}</strong>
        </button>`;
      })
      .join("");

    taskList.querySelectorAll("[data-task-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTask = Number(btn.getAttribute("data-task-index"));
        loadTask();
      });
    });
  }

  function loadTask() {
    const task = tasks[activeTask];
    title.textContent = task.title;
    prompt.textContent = task.prompt;
    input.value = task.starter;
    checkStatus.textContent = "";
    result.innerHTML = "";
    renderTaskButtons();
    refreshHeaderProgress();
  }

  runBtn.addEventListener("click", () => {
    checkStatus.textContent = "";
    try {
      const runData = executeSql(db, input.value);
      renderResult(result, runData);
    } catch (error) {
      result.innerHTML = "";
      checkStatus.textContent = `Ошибка: ${error.message}`;
      checkStatus.className = "check-status fail";
    }
  });

  checkBtn.addEventListener("click", () => {
    const task = tasks[activeTask];
    try {
      const runData = executeSql(db, input.value);
      renderResult(result, runData);
      const verdict = task.validate({ db, lastResult: runData.lastResult });
      if (verdict.ok) {
        taskState[day][task.id] = true;
        saveTaskProgress(taskState);
        checkStatus.textContent = verdict.message;
        checkStatus.className = "check-status ok";
      } else {
        checkStatus.textContent = verdict.message;
        checkStatus.className = "check-status fail";
      }
      renderTaskButtons();
      refreshHeaderProgress();
    } catch (error) {
      result.innerHTML = "";
      checkStatus.textContent = `Ошибка: ${error.message}`;
      checkStatus.className = "check-status fail";
    }
  });

  resetBtn.addEventListener("click", async () => {
    db.close();
    db = await buildDatabaseForDay(day);
    result.innerHTML = "";
    checkStatus.textContent = "База сброшена к начальному состоянию дня.";
    checkStatus.className = "check-status";
  });

  loadTask();
}

async function renderDay() {
  const day = Number(document.body.dataset.day);
  const content = document.getElementById("content");
  const toc = document.getElementById("toc");
  const toggle = document.getElementById("toggle-complete");
  const progress = loadProgress();

  const updateToggleLabel = () => {
    toggle.textContent = progress[day] ? "Убрать отметку о прохождении" : "Отметить день пройденным";
  };
  updateToggleLabel();

  toggle.addEventListener("click", () => {
    progress[day] = !progress[day];
    saveProgress(progress);
    updateToggleLabel();
  });

  try {
    const res = await fetch(`content/day${day}.md`);
    if (!res.ok) throw new Error("Не удалось загрузить markdown");
    const md = await res.text();
    marked.setOptions({ gfm: true, breaks: false });
    content.innerHTML = marked.parse(md);

    const headers = content.querySelectorAll("h2, h3");
    toc.innerHTML = "";
    headers.forEach((header) => {
      const base = slugify(header.textContent || "section");
      const id = base || `section-${Math.random().toString(36).slice(2, 7)}`;
      header.id = id;
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = header.textContent || "Раздел";
      toc.appendChild(link);
    });

    if (!headers.length) toc.innerHTML = "<p>Разделы не найдены</p>";
  } catch (error) {
    content.innerHTML = `<p>Ошибка загрузки: ${escapeHtml(error.message)}</p>`;
  }

  buildDayPagination(day);
  await renderPractice(day);
}

function main() {
  const page = document.body.dataset.page;
  if (page === "index") renderIndex();
  if (page === "day") renderDay();
}

main();
