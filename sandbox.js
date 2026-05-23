const CUSTOM_DATASETS_KEY = "vk-qa-sandbox-custom-datasets-v1";
const HISTORY_KEY = "vk-qa-sandbox-history-v2";
const STATE_KEY = "vk-qa-sandbox-state-v2";

const BUILTIN_DATASETS = {
  shop: {
    label: "Магазин (products/orders)",
    seed: `
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS orders;
      CREATE TABLE products (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT,
        category TEXT,
        price REAL
      );
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        product_id INTEGER,
        quantity INTEGER,
        status TEXT
      );
      INSERT INTO products VALUES
        (1, 'Phone', 'Electronics', 70000),
        (2, 'Headphones', 'Accessories', 5000),
        (3, 'Keyboard', 'Peripherals', 3500),
        (4, 'Laptop', 'Electronics', 90000),
        (5, 'Mouse', 'Peripherals', 2500);
      INSERT INTO orders VALUES
        (1, 1, 1, 'paid'),
        (2, 2, 2, 'paid'),
        (3, 4, 1, 'cancelled'),
        (4, 3, 3, 'paid'),
        (5, 5, 4, 'paid');
    `
  },
  users: {
    label: "Пользователи и заказы (users/orders)",
    seed: `
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS orders;
      CREATE TABLE users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        city TEXT
      );
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        amount REAL,
        status TEXT,
        created_at TEXT
      );
      INSERT INTO users VALUES
        (1, 'ivan', 'Moscow'),
        (2, 'maria', 'Kazan'),
        (3, 'anna', 'Moscow'),
        (4, 'oleg', 'Samara'),
        (5, 'nina', 'Kazan');
      INSERT INTO orders VALUES
        (1, 1, 5000, 'paid', '2026-05-20'),
        (2, 1, 2500, 'paid', '2026-05-21'),
        (3, 2, 3000, 'cancelled', '2026-05-22'),
        (4, 3, 1500, 'paid', '2026-05-22'),
        (5, 3, 1800, 'paid', '2026-05-23'),
        (6, 5, 4200, 'paid', '2026-05-23');
    `
  },
  qa: {
    label: "QA кейс (orders/order_items)",
    seed: `
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS order_items;
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        total_amount REAL,
        status TEXT
      );
      CREATE TABLE order_items (
        item_id INTEGER PRIMARY KEY,
        order_id INTEGER,
        quantity INTEGER,
        unit_price REAL,
        product_group TEXT
      );
      INSERT INTO orders VALUES
        (1, 51000, 'paid'),
        (2, 30000, 'paid'),
        (3, 5000, 'cancelled'),
        (4, 4500, 'paid'),
        (5, 18000, 'paid');
      INSERT INTO order_items VALUES
        (1, 1, 1, 50000, 'phones'),
        (2, 1, 1, 1000, 'accessories'),
        (3, 2, 1, 30000, 'laptops'),
        (4, 3, 1, 5000, 'accessories'),
        (5, 4, 1, 3000, 'peripherals'),
        (6, 4, 1, 1000, 'accessories'),
        (7, 5, 3, 6000, 'tablets');
    `
  },
  support: {
    label: "Support кейс (tickets/comments/agents)",
    seed: `
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS agents;
      CREATE TABLE agents (
        agent_id INTEGER PRIMARY KEY,
        agent_name TEXT,
        team TEXT
      );
      CREATE TABLE tickets (
        ticket_id INTEGER PRIMARY KEY,
        title TEXT,
        severity TEXT,
        status TEXT,
        agent_id INTEGER,
        created_at TEXT
      );
      CREATE TABLE comments (
        comment_id INTEGER PRIMARY KEY,
        ticket_id INTEGER,
        author_type TEXT,
        message TEXT,
        created_at TEXT
      );
      INSERT INTO agents VALUES
        (1, 'Ilya', 'Core'),
        (2, 'Nora', 'Payments'),
        (3, 'Pavel', 'Core');
      INSERT INTO tickets VALUES
        (101, 'Login 500', 'high', 'open', 1, '2026-05-20'),
        (102, 'Wrong price in cart', 'medium', 'in_progress', 2, '2026-05-21'),
        (103, 'Push notifications delayed', 'low', 'closed', 3, '2026-05-21'),
        (104, 'Order cannot be cancelled', 'critical', 'open', 2, '2026-05-22');
      INSERT INTO comments VALUES
        (1, 101, 'user', 'Cannot login for 30 minutes', '2026-05-20'),
        (2, 101, 'agent', 'Investigating logs', '2026-05-20'),
        (3, 102, 'user', 'Price is doubled after refresh', '2026-05-21'),
        (4, 104, 'user', 'Cancellation fails with 409', '2026-05-22'),
        (5, 104, 'agent', 'Escalated to backend team', '2026-05-22');
    `
  }
};

const SNIPPETS = [
  { label: "CREATE TABLE", sql: "CREATE TABLE demo (\\n  id INTEGER PRIMARY KEY,\\n  name TEXT\\n);" },
  { label: "INSERT INTO", sql: "INSERT INTO demo (id, name) VALUES\\n  (1, 'Alice'),\\n  (2, 'Bob');" },
  { label: "SELECT + FILTER", sql: "SELECT *\\nFROM demo\\nWHERE id >= 1\\nORDER BY id;" },
  { label: "JOIN skeleton", sql: "SELECT a.id, b.value\\nFROM table_a a\\nJOIN table_b b ON b.a_id = a.id;" },
  { label: "GROUP BY skeleton", sql: "SELECT status, COUNT(*) AS cnt\\nFROM orders\\nGROUP BY status\\nORDER BY cnt DESC;" }
];

const TASK_BANK = [
  {
    id: "tb_1",
    dataset: "support",
    level: "easy",
    title: "Открытые критичные тикеты",
    prompt: "Выведи ticket_id, title, agent_id для тикетов со статусом open и severity critical/high. Сортировка по severity, затем ticket_id.",
    starterSql: "SELECT ticket_id, title, agent_id\\nFROM tickets\\nWHERE status = 'open'\\n  AND severity IN ('critical', 'high')\\nORDER BY /* ... */;"
  },
  {
    id: "tb_2",
    dataset: "support",
    level: "easy",
    title: "Тикеты без комментариев",
    prompt: "Найди тикеты, у которых нет ни одного комментария.",
    starterSql: "SELECT t.ticket_id, t.title\\nFROM tickets t\\nLEFT JOIN comments c ON c.ticket_id = t.ticket_id\\nWHERE /* ... */;"
  },
  {
    id: "tb_3",
    dataset: "support",
    level: "medium",
    title: "Последний комментарий по тикету",
    prompt: "Для каждого ticket_id выведи дату последнего комментария и тип автора этого комментария.",
    starterSql: "WITH last_comment AS (\\n  SELECT ticket_id, MAX(created_at) AS max_created\\n  FROM comments\\n  GROUP BY ticket_id\\n)\\nSELECT /* ... */;"
  },
  {
    id: "tb_4",
    dataset: "support",
    level: "medium",
    title: "Нагрузка по агентам",
    prompt: "Посчитай количество активных тикетов (open/in_progress) на каждого агента, включая агентов с нулем.",
    starterSql: "SELECT a.agent_id, a.agent_name, COUNT(t.ticket_id) AS active_cnt\\nFROM agents a\\nLEFT JOIN tickets t ON t.agent_id = a.agent_id\\n  AND t.status IN ('open', 'in_progress')\\nGROUP BY a.agent_id, a.agent_name\\nORDER BY active_cnt DESC;"
  },
  {
    id: "tb_5",
    dataset: "users",
    level: "medium",
    title: "Доля cancelled по городам",
    prompt: "Для каждого города посчитай paid_cnt, cancelled_cnt и cancelled_share = cancelled_cnt / all_cnt.",
    starterSql: "SELECT u.city,\\n  SUM(CASE WHEN o.status = 'paid' THEN 1 ELSE 0 END) AS paid_cnt,\\n  SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_cnt,\\n  COUNT(o.order_id) AS all_cnt\\nFROM users u\\nLEFT JOIN orders o ON o.user_id = u.user_id\\nGROUP BY u.city;"
  },
  {
    id: "tb_6",
    dataset: "users",
    level: "easy",
    title: "Первая покупка пользователя",
    prompt: "Для каждого user_id найди дату первого paid-заказа.",
    starterSql: "SELECT user_id, MIN(created_at) AS first_paid_at\\nFROM orders\\nWHERE status = 'paid'\\nGROUP BY user_id;"
  },
  {
    id: "tb_7",
    dataset: "users",
    level: "hard",
    title: "Лидеры по выручке в каждом городе",
    prompt: "Найди пользователя(ей) с максимальной суммой paid-заказов в каждом городе.",
    starterSql: "WITH totals AS (\\n  SELECT u.city, u.user_id, u.username, SUM(CASE WHEN o.status = 'paid' THEN o.amount ELSE 0 END) AS paid_sum\\n  FROM users u\\n  LEFT JOIN orders o ON o.user_id = u.user_id\\n  GROUP BY u.city, u.user_id, u.username\\n)\\nSELECT *\\nFROM totals\\nWHERE /* max per city */;"
  },
  {
    id: "tb_8",
    dataset: "shop",
    level: "medium",
    title: "Выручка по категориям",
    prompt: "Посчитай revenue = SUM(quantity * price) по category только для paid заказов.",
    starterSql: "SELECT p.category, SUM(o.quantity * p.price) AS revenue\\nFROM orders o\\nJOIN products p ON p.product_id = o.product_id\\nWHERE o.status = 'paid'\\nGROUP BY p.category\\nORDER BY revenue DESC;"
  },
  {
    id: "tb_9",
    dataset: "shop",
    level: "medium",
    title: "Категории без продаж",
    prompt: "Выведи категории, по которым нет paid-заказов.",
    starterSql: "SELECT DISTINCT p.category\\nFROM products p\\nLEFT JOIN orders o ON o.product_id = p.product_id\\n  AND o.status = 'paid'\\nWHERE o.order_id IS NULL;"
  },
  {
    id: "tb_10",
    dataset: "qa",
    level: "hard",
    title: "Топ-группа по выручке в заказе",
    prompt: "Для каждого order_id найди product_group с максимальной выручкой quantity * unit_price.",
    starterSql: "WITH grp AS (\\n  SELECT order_id, product_group, SUM(quantity * unit_price) AS grp_sum\\n  FROM order_items\\n  GROUP BY order_id, product_group\\n)\\nSELECT *\\nFROM grp\\nWHERE /* max by order */;"
  },
  {
    id: "tb_11",
    dataset: "qa",
    level: "easy",
    title: "Средний чек paid",
    prompt: "Посчитай средний total_amount только по paid заказам.",
    starterSql: "SELECT AVG(total_amount) AS avg_paid_check\\nFROM orders\\nWHERE status = 'paid';"
  },
  {
    id: "tb_12",
    dataset: "qa",
    level: "medium",
    title: "Заказы, где аксессуары > 15%",
    prompt: "Найди order_id, где доля product_group='accessories' больше 15% от calc_total заказа.",
    starterSql: "WITH sums AS (\\n  SELECT order_id,\\n    SUM(quantity * unit_price) AS calc_total,\\n    SUM(CASE WHEN product_group = 'accessories' THEN quantity * unit_price ELSE 0 END) AS acc_total\\n  FROM order_items\\n  GROUP BY order_id\\n)\\nSELECT order_id, calc_total, acc_total\\nFROM sums\\nWHERE acc_total * 1.0 / calc_total > 0.15;"
  },
  {
    id: "tb_13",
    dataset: "users",
    level: "medium",
    title: "3-дневная активность",
    prompt: "Найди пользователей, у которых есть paid-заказы минимум в 2 разные даты.",
    starterSql: "SELECT user_id\\nFROM orders\\nWHERE status = 'paid'\\nGROUP BY user_id\\nHAVING COUNT(DISTINCT created_at) >= 2;"
  },
  {
    id: "tb_14",
    dataset: "support",
    level: "hard",
    title: "Время до первого ответа агента",
    prompt: "Для каждого тикета посчитай разницу между ticket.created_at и первым comment от agent. Если ответа нет, не выводить.",
    starterSql: "WITH first_agent AS (\\n  SELECT ticket_id, MIN(created_at) AS first_agent_at\\n  FROM comments\\n  WHERE author_type = 'agent'\\n  GROUP BY ticket_id\\n)\\nSELECT t.ticket_id, t.created_at, f.first_agent_at\\nFROM tickets t\\nJOIN first_agent f ON f.ticket_id = t.ticket_id;"
  },
  {
    id: "tb_15",
    dataset: "shop",
    level: "hard",
    title: "ABC-анализ по выручке",
    prompt: "Разбей товары на классы A/B/C по накопленной доле выручки (A до 80%, B до 95%, C остальное).",
    starterSql: "WITH revenue AS (\\n  SELECT p.product_id, p.product_name, SUM(CASE WHEN o.status = 'paid' THEN o.quantity * p.price ELSE 0 END) AS rev\\n  FROM products p\\n  LEFT JOIN orders o ON o.product_id = p.product_id\\n  GROUP BY p.product_id, p.product_name\\n)\\nSELECT *\\nFROM revenue;"
  },
  {
    id: "tb_16",
    dataset: "users",
    level: "easy",
    title: "Пользователи без paid заказов",
    prompt: "Найди пользователей, у которых нет ни одного paid-заказа.",
    starterSql: "SELECT u.user_id, u.username\\nFROM users u\\nLEFT JOIN orders o ON o.user_id = u.user_id AND o.status = 'paid'\\nWHERE o.order_id IS NULL;"
  },
  {
    id: "tb_17",
    dataset: "support",
    level: "medium",
    title: "Тикеты с только user-комментами",
    prompt: "Выведи тикеты, у которых есть комментарии, но ни одного от agent.",
    starterSql: "SELECT c.ticket_id\\nFROM comments c\\nGROUP BY c.ticket_id\\nHAVING SUM(CASE WHEN author_type = 'agent' THEN 1 ELSE 0 END) = 0;"
  },
  {
    id: "tb_18",
    dataset: "qa",
    level: "medium",
    title: "Топ order_items по unit_price в каждом order",
    prompt: "Для каждого order_id найди item_id с максимальным unit_price.",
    starterSql: "WITH ranked AS (\\n  SELECT item_id, order_id, unit_price,\\n         ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY unit_price DESC, item_id) AS rn\\n  FROM order_items\\n)\\nSELECT item_id, order_id, unit_price\\nFROM ranked\\nWHERE rn = 1;"
  }
];

let sqlPromise = null;
let db = null;

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadCustomDatasets() {
  return loadJson(CUSTOM_DATASETS_KEY, {});
}

function saveCustomDatasets(data) {
  saveJson(CUSTOM_DATASETS_KEY, data);
}

function getDatasetLibrary() {
  return {
    ...BUILTIN_DATASETS,
    ...loadCustomDatasets()
  };
}

function isBuiltInDataset(id) {
  return Object.prototype.hasOwnProperty.call(BUILTIN_DATASETS, id);
}

function loadHistory() {
  return loadJson(HISTORY_KEY, []);
}

function saveHistory(history) {
  saveJson(HISTORY_KEY, history.slice(0, 80));
}

function loadState() {
  return loadJson(STATE_KEY, {
    dataset: "shop",
    sql: "",
    taskDatasetFilter: "all",
    taskLevelFilter: "all"
  });
}

function saveState(state) {
  saveJson(STATE_KEY, state);
}

function splitSqlStatements(sql) {
  const text = sql.trim();
  const out = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (!inDouble && !inBacktick && ch === "'" && next === "'") {
      buf += "''";
      i += 1;
      continue;
    }
    if (!inSingle && !inBacktick && ch === "\"") {
      inDouble = !inDouble;
      buf += ch;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`") {
      inBacktick = !inBacktick;
      buf += ch;
      continue;
    }
    if (!inDouble && !inBacktick && ch === "'") {
      inSingle = !inSingle;
      buf += ch;
      continue;
    }
    if (!inSingle && !inDouble && !inBacktick && ch === ";") {
      const ready = buf.trim();
      if (ready) out.push(ready);
      buf = "";
      continue;
    }
    buf += ch;
  }

  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

function formatSqlBasic(sql) {
  const keywords = [
    "select", "from", "where", "group by", "order by", "having", "limit", "offset",
    "left join", "right join", "inner join", "full join", "join", "on", "with",
    "insert into", "values", "update", "set", "delete", "create table", "drop table",
    "case", "when", "then", "else", "end", "as", "and", "or"
  ];

  let out = sql.replace(/\s+/g, " ").trim();
  keywords.sort((a, b) => b.length - a.length).forEach((kw) => {
    const escaped = kw.replace(/\s+/g, "\\s+");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "gi"), kw.toUpperCase());
  });

  return out
    .replace(/\s+(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|ON|VALUES|SET)\b/g, "\n$1")
    .replace(/\s+,\s*/g, ", ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlPromise;
}

async function createDbFromSeed(seedSql) {
  const SQL = await getSql();
  const tempDb = new SQL.Database();
  if (seedSql.trim()) tempDb.run(seedSql);
  return tempDb;
}

async function initDb(datasetId, library) {
  const dataset = library[datasetId];
  if (!dataset) throw new Error(`Датасет '${datasetId}' не найден.`);
  if (db) db.close();
  db = await createDbFromSeed(dataset.seed);
}

function runSql(targetDb, sql) {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error("SQL-запрос пуст.");
  let changed = 0;
  let lastResult = null;
  statements.forEach((statement, idx) => {
    try {
      const before = targetDb.getRowsModified();
      const sets = targetDb.exec(statement);
      changed += Math.max(targetDb.getRowsModified() - before, 0);
      if (sets.length) lastResult = sets[sets.length - 1];
    } catch (error) {
      throw new Error(`Ошибка в выражении ${idx + 1}: ${error.message}`);
    }
  });
  const rows = lastResult ? lastResult.values.length : 0;
  return {
    statementCount: statements.length,
    changed,
    rowCount: rows,
    lastResult,
    summary: lastResult
      ? `OK: выражений ${statements.length}, строк в последнем результате: ${rows}`
      : `OK: выражений ${statements.length}, изменено строк: ${changed}`
  };
}

function renderResult(host, runData) {
  if (!runData.lastResult) {
    host.innerHTML = `<p class="sql-message">${escapeHtml(runData.summary)}</p>`;
    return;
  }
  const cols = runData.lastResult.columns;
  const rows = runData.lastResult.values;
  const timing = typeof runData.durationMs === "number" ? ` • ${runData.durationMs.toFixed(1)} ms` : "";
  host.innerHTML = `
    <p class="sql-message">${escapeHtml(runData.summary + timing)}</p>
    <div class="result-scroll">
      <table class="result-table">
        <thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.length
    ? rows.map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderSchema(resultHost) {
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  if (!tables.length || !tables[0].values.length) {
    resultHost.innerHTML = "<p class='sql-message'>Таблиц не найдено.</p>";
    return;
  }
  const names = tables[0].values.map((r) => String(r[0]));
  const html = names.map((name) => {
    const info = db.exec(`PRAGMA table_info(${name});`);
    const rows = info.length ? info[0].values : [];
    return `
      <h4>${escapeHtml(name)}</h4>
      <table class="result-table">
        <thead><tr><th>column</th><th>type</th><th>constraints</th><th>key</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td>${Number(r[3]) ? "NOT NULL" : ""}</td><td>${Number(r[5]) ? "PK" : ""}</td></tr>`).join("")}</tbody>
      </table>
    `;
  }).join("");
  resultHost.innerHTML = `<p class="sql-message">Схема текущего датасета</p>${html}`;
}

function renderPreviewTable(resultHost, tableName) {
  if (!tableName) {
    resultHost.innerHTML = "<p class='sql-message'>Сначала выбери таблицу.</p>";
    return;
  }
  const safe = tableName.replace(/[^a-zA-Z0-9_]/g, "");
  const sets = db.exec(`SELECT * FROM ${safe} LIMIT 20;`);
  if (!sets.length) {
    resultHost.innerHTML = `<p class='sql-message'>Таблица ${escapeHtml(tableName)} пустая.</p>`;
    return;
  }
  renderResult(resultHost, {
    lastResult: sets[0],
    summary: `Превью таблицы ${tableName} (до 20 строк)`
  });
}

function renderExplain(resultHost, sql) {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error("Сначала введи SQL.");
  const explainSet = db.exec(`EXPLAIN QUERY PLAN ${statements[0]}`);
  if (!explainSet.length) {
    resultHost.innerHTML = "<p class='sql-message'>EXPLAIN не вернул результат.</p>";
    return;
  }
  renderResult(resultHost, {
    summary: "План выполнения (EXPLAIN QUERY PLAN)",
    lastResult: explainSet[0]
  });
}

function appendHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  saveHistory(history);
}

function renderHistory(host, onLoad) {
  const history = loadHistory();
  if (!history.length) {
    host.innerHTML = "<p class='sql-message'>История пока пустая.</p>";
    return;
  }
  host.innerHTML = history.map((item, idx) => `
    <article class="history-item">
      <div class="history-meta">
        <strong>${escapeHtml(item.dataset.toUpperCase())}</strong>
        <span>${escapeHtml(new Date(item.at).toLocaleString("ru-RU", { hour12: false }))}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <code>${escapeHtml(item.sql.slice(0, 140))}${item.sql.length > 140 ? "..." : ""}</code>
      <div class="saved-task-actions">
        <button class="btn ghost" data-hload="${idx}" type="button">Вставить</button>
      </div>
    </article>
  `).join("");
  host.querySelectorAll("[data-hload]").forEach((btn) => {
    btn.addEventListener("click", () => onLoad(history[Number(btn.getAttribute("data-hload"))]));
  });
}

function renderSnippets(host, onPick) {
  host.innerHTML = SNIPPETS.map((snippet) => `<button class="btn ghost" data-snip="${escapeHtml(snippet.label)}" type="button">${escapeHtml(snippet.label)}</button>`).join("");
  host.querySelectorAll("[data-snip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const snippet = SNIPPETS.find((s) => s.label === btn.getAttribute("data-snip"));
      if (snippet) onPick(snippet.sql);
    });
  });
}

function renderTaskBank(host, filters, library, onUse) {
  const tasks = TASK_BANK.filter((task) => (filters.dataset === "all" || task.dataset === filters.dataset) && (filters.level === "all" || task.level === filters.level));
  if (!tasks.length) {
    host.innerHTML = "<p class='sql-message'>По текущим фильтрам задач нет.</p>";
    return;
  }
  host.innerHTML = tasks.map((task) => `
    <article class="task-bank-card" data-task-id="${task.id}">
      <div class="task-bank-meta">
        <span class="chip">${escapeHtml(library[task.dataset]?.label || task.dataset)}</span>
        <span class="chip">${escapeHtml(task.level.toUpperCase())}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.prompt)}</p>
      <div class="saved-task-actions">
        <button class="btn ghost" data-use="${task.id}" type="button">Вставить заготовку</button>
      </div>
    </article>
  `).join("");
  host.querySelectorAll("[data-use]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const task = TASK_BANK.find((t) => t.id === btn.getAttribute("data-use"));
      if (task) onUse(task);
    });
  });
}

function normalizeDatasetId(raw) {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

async function validateSeedSql(seedSql) {
  const tempDb = await createDbFromSeed(seedSql);
  tempDb.close();
}

function exportCustomDatasets() {
  const payload = { version: 1, exportedAt: Date.now(), datasets: loadCustomDatasets() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sql-sandbox-datasets-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function main() {
  const datasetSelect = document.getElementById("dataset");
  const loadDatasetBtn = document.getElementById("load-dataset");
  const deleteDatasetBtn = document.getElementById("delete-dataset");
  const showSchemaBtn = document.getElementById("show-schema");
  const previewBtn = document.getElementById("preview-table");
  const tablePicker = document.getElementById("table-picker");
  const runExplainBtn = document.getElementById("run-explain");
  const formatBtn = document.getElementById("format-sql");
  const resetDbBtn = document.getElementById("reset-db");
  const resetSqlBtn = document.getElementById("reset-sql");
  const clearHistoryBtn = document.getElementById("clear-history");
  const sqlInput = document.getElementById("sandbox-sql");
  const runBtn = document.getElementById("run-sql");
  const status = document.getElementById("sandbox-status");
  const result = document.getElementById("sandbox-result");
  const snippetBank = document.getElementById("snippet-bank");
  const historyList = document.getElementById("history-list");
  const newDatasetId = document.getElementById("new-dataset-id");
  const newDatasetName = document.getElementById("new-dataset-name");
  const newDatasetSql = document.getElementById("new-dataset-sql");
  const saveDatasetBtn = document.getElementById("save-dataset");
  const importDatasetsBtn = document.getElementById("import-datasets");
  const exportDatasetsBtn = document.getElementById("export-datasets");
  const importDatasetsFile = document.getElementById("import-datasets-file");
  const taskDatasetFilter = document.getElementById("task-dataset-filter");
  const taskLevelFilter = document.getElementById("task-level-filter");
  const taskRandomBtn = document.getElementById("task-random");
  const taskBankList = document.getElementById("task-bank-list");

  const state = loadState();
  let activeDataset = state.dataset;

  function setStatus(text, kind = "") {
    status.className = `check-status${kind ? ` ${kind}` : ""}`;
    status.textContent = text;
  }

  function persist() {
    saveState({
      dataset: activeDataset,
      sql: sqlInput.value,
      taskDatasetFilter: taskDatasetFilter.value,
      taskLevelFilter: taskLevelFilter.value
    });
  }

  function refreshDatasetSelectors() {
    const lib = getDatasetLibrary();
    const ids = Object.keys(lib);
    if (!ids.length) throw new Error("Нет доступных датасетов.");
    if (!lib[activeDataset]) activeDataset = ids[0];
    const currentTaskFilter = taskDatasetFilter.value || state.taskDatasetFilter || "all";
    datasetSelect.innerHTML = ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(lib[id].label)}</option>`).join("");
    datasetSelect.value = activeDataset;
    taskDatasetFilter.innerHTML = ["<option value=\"all\">Все датасеты</option>", ...ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(lib[id].label)}</option>`)].join("");
    taskDatasetFilter.value = taskDatasetFilter.querySelector(`option[value="${currentTaskFilter}"]`) ? currentTaskFilter : "all";
  }

  function refreshTablePicker() {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
    const names = (tables[0]?.values || []).map((r) => String(r[0]));
    tablePicker.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  }

  function refreshTaskBank() {
    renderTaskBank(taskBankList, { dataset: taskDatasetFilter.value, level: taskLevelFilter.value }, getDatasetLibrary(), (task) => {
      activeDataset = task.dataset;
      datasetSelect.value = activeDataset;
      sqlInput.value = task.starterSql;
      persist();
      setStatus(`Заготовка задачи '${task.title}' вставлена.`, "ok");
    });
  }

  function refreshHistory() {
    renderHistory(historyList, (item) => {
      activeDataset = item.dataset;
      datasetSelect.value = activeDataset;
      sqlInput.value = item.sql;
      persist();
      setStatus("Запрос из истории вставлен в редактор.");
    });
  }

  function executeSql() {
    const start = performance.now();
    try {
      const runData = runSql(db, sqlInput.value);
      runData.durationMs = performance.now() - start;
      renderResult(result, runData);
      setStatus("SQL выполнен.", "ok");
      appendHistory({ dataset: activeDataset, sql: sqlInput.value, summary: runData.summary, at: Date.now() });
      refreshHistory();
      persist();
    } catch (error) {
      result.innerHTML = "";
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  }

  sqlInput.value = state.sql || "";
  taskLevelFilter.value = state.taskLevelFilter || "all";

  refreshDatasetSelectors();
  await initDb(activeDataset, getDatasetLibrary());
  refreshTablePicker();
  refreshTaskBank();
  refreshHistory();
  renderSnippets(snippetBank, (snippetSql) => {
    sqlInput.value = snippetSql;
    persist();
    setStatus("SQL-шаблон вставлен.");
  });

  loadDatasetBtn.addEventListener("click", async () => {
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    result.innerHTML = "";
    setStatus("Датасет загружен.", "ok");
    persist();
  });

  deleteDatasetBtn.addEventListener("click", async () => {
    const id = datasetSelect.value;
    if (!id) return;
    if (isBuiltInDataset(id)) {
      setStatus("Базовые датасеты удалить нельзя.", "fail");
      return;
    }
    const custom = loadCustomDatasets();
    delete custom[id];
    saveCustomDatasets(custom);
    refreshDatasetSelectors();
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    refreshTaskBank();
    setStatus(`Кастомный датасет '${id}' удален.`, "ok");
    persist();
  });

  showSchemaBtn.addEventListener("click", () => {
    try {
      renderSchema(result);
      setStatus("Схема выведена.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  previewBtn.addEventListener("click", () => {
    try {
      renderPreviewTable(result, tablePicker.value);
      setStatus("Превью таблицы выведено.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  runExplainBtn.addEventListener("click", () => {
    try {
      renderExplain(result, sqlInput.value);
      setStatus("EXPLAIN готов.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  formatBtn.addEventListener("click", () => {
    sqlInput.value = formatSqlBasic(sqlInput.value);
    persist();
    setStatus("SQL отформатирован.");
  });

  resetDbBtn.addEventListener("click", async () => {
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    result.innerHTML = "";
    setStatus("База сброшена к исходному состоянию датасета.");
  });

  resetSqlBtn.addEventListener("click", () => {
    sqlInput.value = "";
    persist();
    setStatus("SQL-редактор очищен.");
  });

  clearHistoryBtn.addEventListener("click", () => {
    saveHistory([]);
    refreshHistory();
    setStatus("История запусков очищена.");
  });

  runBtn.addEventListener("click", executeSql);

  saveDatasetBtn.addEventListener("click", async () => {
    const id = normalizeDatasetId(newDatasetId.value);
    const label = newDatasetName.value.trim();
    const seed = newDatasetSql.value.trim();
    if (!id || id.length < 2) {
      setStatus("Укажи корректный ID датасета (минимум 2 символа).", "fail");
      return;
    }
    if (!label) {
      setStatus("Укажи читаемое название датасета.", "fail");
      return;
    }
    if (!seed) {
      setStatus("SQL-скрипт датасета пустой.", "fail");
      return;
    }
    try {
      await validateSeedSql(seed);
      const custom = loadCustomDatasets();
      custom[id] = { label, seed };
      saveCustomDatasets(custom);
      refreshDatasetSelectors();
      refreshTaskBank();
      setStatus(`Датасет '${id}' сохранен.`, "ok");
      newDatasetId.value = id;
    } catch (error) {
      setStatus(`Ошибка в SQL-скрипте датасета: ${error.message}`, "fail");
    }
  });

  exportDatasetsBtn.addEventListener("click", () => {
    exportCustomDatasets();
    setStatus("Кастомные датасеты экспортированы в JSON.", "ok");
  });

  importDatasetsBtn.addEventListener("click", () => importDatasetsFile.click());
  importDatasetsFile.addEventListener("change", async () => {
    const file = importDatasetsFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = parsed.datasets || parsed;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        throw new Error("Ожидался объект datasets.");
      }
      const current = loadCustomDatasets();
      let validCount = 0;
      for (const [rawId, data] of Object.entries(incoming)) {
        const id = normalizeDatasetId(rawId);
        if (!id || isBuiltInDataset(id) || !data || typeof data !== "object") continue;
        const label = String(data.label || "").trim();
        const seed = String(data.seed || "").trim();
        if (!label || !seed) continue;
        await validateSeedSql(seed);
        current[id] = { label, seed };
        validCount += 1;
      }
      saveCustomDatasets(current);
      refreshDatasetSelectors();
      refreshTaskBank();
      setStatus(`Импортировано датасетов: ${validCount}.`, "ok");
    } catch (error) {
      setStatus(`Ошибка импорта: ${error.message}`, "fail");
    } finally {
      importDatasetsFile.value = "";
    }
  });

  taskDatasetFilter.addEventListener("change", () => {
    refreshTaskBank();
    persist();
  });
  taskLevelFilter.addEventListener("change", () => {
    refreshTaskBank();
    persist();
  });
  taskRandomBtn.addEventListener("click", () => {
    const cards = Array.from(taskBankList.querySelectorAll(".task-bank-card"));
    if (!cards.length) return;
    const picked = cards[Math.floor(Math.random() * cards.length)];
    cards.forEach((card) => card.classList.remove("task-bank-pick"));
    picked.classList.add("task-bank-pick");
    picked.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  sqlInput.addEventListener("input", persist);
  sqlInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      executeSql();
    }
  });
}

main();
