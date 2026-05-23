const CUSTOM_DATASETS_KEY = "vk-qa-sandbox-custom-datasets-v2";
const HISTORY_KEY = "vk-qa-sandbox-history-v3";
const STATE_KEY = "vk-qa-sandbox-state-v3";
const TASK_PROGRESS_KEY = "vk-qa-sandbox-task-progress-v1";

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

const TASK_BANK = [
  {
    id: "tb_1",
    dataset: "support",
    level: "easy",
    title: "Открытые критичные тикеты",
    prompt: "Выведи ticket_id, title, agent_id для тикетов со статусом open и severity critical/high. Сортировка по severity, затем ticket_id.",
    solutionSql: `
      SELECT ticket_id, title, agent_id
      FROM tickets
      WHERE status = 'open'
        AND severity IN ('critical', 'high')
      ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END, ticket_id;
    `
  },
  {
    id: "tb_2",
    dataset: "support",
    level: "easy",
    title: "Тикеты без комментариев",
    prompt: "Найди тикеты, у которых нет ни одного комментария.",
    solutionSql: `
      SELECT t.ticket_id, t.title
      FROM tickets t
      LEFT JOIN comments c ON c.ticket_id = t.ticket_id
      WHERE c.comment_id IS NULL
      ORDER BY t.ticket_id;
    `
  },
  {
    id: "tb_3",
    dataset: "support",
    level: "medium",
    title: "Последний комментарий по тикету",
    prompt: "Для каждого ticket_id выведи дату последнего комментария и тип автора этого комментария.",
    solutionSql: `
      WITH last_comment AS (
        SELECT ticket_id, MAX(created_at) AS max_created
        FROM comments
        GROUP BY ticket_id
      )
      SELECT c.ticket_id, c.created_at, c.author_type
      FROM comments c
      JOIN last_comment l
        ON l.ticket_id = c.ticket_id AND l.max_created = c.created_at
      ORDER BY c.ticket_id;
    `
  },
  {
    id: "tb_4",
    dataset: "support",
    level: "medium",
    title: "Нагрузка по агентам",
    prompt: "Посчитай количество активных тикетов (open/in_progress) на каждого агента, включая агентов с нулем.",
    solutionSql: `
      SELECT a.agent_id, a.agent_name, COUNT(t.ticket_id) AS active_cnt
      FROM agents a
      LEFT JOIN tickets t
        ON t.agent_id = a.agent_id
        AND t.status IN ('open', 'in_progress')
      GROUP BY a.agent_id, a.agent_name
      ORDER BY active_cnt DESC, a.agent_id;
    `
  },
  {
    id: "tb_5",
    dataset: "users",
    level: "medium",
    title: "Доля cancelled по городам",
    prompt: "Для каждого города посчитай paid_cnt, cancelled_cnt и cancelled_share = cancelled_cnt / all_cnt.",
    solutionSql: `
      SELECT
        u.city,
        SUM(CASE WHEN o.status = 'paid' THEN 1 ELSE 0 END) AS paid_cnt,
        SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_cnt,
        ROUND(
          SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(o.order_id), 0),
          3
        ) AS cancelled_share
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.user_id
      GROUP BY u.city
      ORDER BY u.city;
    `
  },
  {
    id: "tb_6",
    dataset: "users",
    level: "easy",
    title: "Первая покупка пользователя",
    prompt: "Для каждого user_id найди дату первого paid-заказа.",
    solutionSql: `
      SELECT user_id, MIN(created_at) AS first_paid_at
      FROM orders
      WHERE status = 'paid'
      GROUP BY user_id
      ORDER BY user_id;
    `
  },
  {
    id: "tb_7",
    dataset: "users",
    level: "hard",
    title: "Лидеры по выручке в каждом городе",
    prompt: "Найди пользователя(ей) с максимальной суммой paid-заказов в каждом городе.",
    solutionSql: `
      WITH totals AS (
        SELECT
          u.city,
          u.user_id,
          u.username,
          SUM(CASE WHEN o.status = 'paid' THEN o.amount ELSE 0 END) AS paid_sum
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.user_id
        GROUP BY u.city, u.user_id, u.username
      ),
      ranked AS (
        SELECT
          city,
          user_id,
          username,
          paid_sum,
          DENSE_RANK() OVER (PARTITION BY city ORDER BY paid_sum DESC) AS rnk
        FROM totals
      )
      SELECT city, user_id, username, paid_sum
      FROM ranked
      WHERE rnk = 1
      ORDER BY city, user_id;
    `
  },
  {
    id: "tb_8",
    dataset: "shop",
    level: "medium",
    title: "Выручка по категориям",
    prompt: "Посчитай revenue = SUM(quantity * price) по category только для paid заказов.",
    solutionSql: `
      SELECT p.category, SUM(o.quantity * p.price) AS revenue
      FROM orders o
      JOIN products p ON p.product_id = o.product_id
      WHERE o.status = 'paid'
      GROUP BY p.category
      ORDER BY revenue DESC, p.category;
    `
  },
  {
    id: "tb_9",
    dataset: "shop",
    level: "medium",
    title: "Категории без продаж",
    prompt: "Выведи категории, по которым нет paid-заказов.",
    solutionSql: `
      SELECT DISTINCT p.category
      FROM products p
      LEFT JOIN orders o
        ON o.product_id = p.product_id
        AND o.status = 'paid'
      WHERE o.order_id IS NULL
      ORDER BY p.category;
    `
  },
  {
    id: "tb_10",
    dataset: "qa",
    level: "hard",
    title: "Топ-группа по выручке в заказе",
    prompt: "Для каждого order_id найди product_group с максимальной выручкой quantity * unit_price.",
    solutionSql: `
      WITH grp AS (
        SELECT
          order_id,
          product_group,
          SUM(quantity * unit_price) AS grp_sum
        FROM order_items
        GROUP BY order_id, product_group
      ),
      ranked AS (
        SELECT
          order_id,
          product_group,
          grp_sum,
          ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY grp_sum DESC, product_group) AS rn
        FROM grp
      )
      SELECT order_id, product_group, grp_sum
      FROM ranked
      WHERE rn = 1
      ORDER BY order_id;
    `
  },
  {
    id: "tb_11",
    dataset: "qa",
    level: "easy",
    title: "Средний чек paid",
    prompt: "Посчитай средний total_amount только по paid заказам.",
    solutionSql: `
      SELECT AVG(total_amount) AS avg_paid_check
      FROM orders
      WHERE status = 'paid';
    `
  },
  {
    id: "tb_12",
    dataset: "qa",
    level: "medium",
    title: "Заказы, где аксессуары > 15%",
    prompt: "Найди order_id, где доля product_group='accessories' больше 15% от calc_total заказа.",
    solutionSql: `
      WITH sums AS (
        SELECT
          order_id,
          SUM(quantity * unit_price) AS calc_total,
          SUM(CASE WHEN product_group = 'accessories' THEN quantity * unit_price ELSE 0 END) AS acc_total
        FROM order_items
        GROUP BY order_id
      )
      SELECT order_id, calc_total, acc_total
      FROM sums
      WHERE acc_total * 1.0 / calc_total > 0.15
      ORDER BY order_id;
    `
  },
  {
    id: "tb_13",
    dataset: "users",
    level: "medium",
    title: "3-дневная активность",
    prompt: "Найди пользователей, у которых есть paid-заказы минимум в 2 разные даты.",
    solutionSql: `
      SELECT user_id
      FROM orders
      WHERE status = 'paid'
      GROUP BY user_id
      HAVING COUNT(DISTINCT created_at) >= 2
      ORDER BY user_id;
    `
  },
  {
    id: "tb_14",
    dataset: "support",
    level: "hard",
    title: "Время до первого ответа агента",
    prompt: "Для каждого тикета посчитай разницу в днях между ticket.created_at и первым comment от agent.",
    solutionSql: `
      WITH first_agent AS (
        SELECT ticket_id, MIN(created_at) AS first_agent_at
        FROM comments
        WHERE author_type = 'agent'
        GROUP BY ticket_id
      )
      SELECT
        t.ticket_id,
        ROUND(julianday(f.first_agent_at) - julianday(t.created_at), 3) AS days_to_first_agent
      FROM tickets t
      JOIN first_agent f ON f.ticket_id = t.ticket_id
      ORDER BY t.ticket_id;
    `
  },
  {
    id: "tb_15",
    dataset: "shop",
    level: "hard",
    title: "ABC-анализ по выручке",
    prompt: "Разбей товары на классы A/B/C по накопленной доле выручки (A до 80%, B до 95%, C — остальное).",
    solutionSql: `
      WITH revenue AS (
        SELECT
          p.product_id,
          p.product_name,
          SUM(CASE WHEN o.status = 'paid' THEN o.quantity * p.price ELSE 0 END) AS rev
        FROM products p
        LEFT JOIN orders o ON o.product_id = p.product_id
        GROUP BY p.product_id, p.product_name
      ),
      ranked AS (
        SELECT
          product_id,
          product_name,
          rev,
          SUM(rev) OVER (ORDER BY rev DESC, product_id) * 1.0 / SUM(rev) OVER () AS cum_share
        FROM revenue
      )
      SELECT
        product_id,
        product_name,
        rev,
        CASE
          WHEN cum_share <= 0.80 THEN 'A'
          WHEN cum_share <= 0.95 THEN 'B'
          ELSE 'C'
        END AS abc_class
      FROM ranked
      ORDER BY rev DESC, product_id;
    `
  },
  {
    id: "tb_16",
    dataset: "users",
    level: "easy",
    title: "Пользователи без paid заказов",
    prompt: "Найди пользователей, у которых нет ни одного paid-заказа.",
    solutionSql: `
      SELECT u.user_id, u.username
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.user_id AND o.status = 'paid'
      WHERE o.order_id IS NULL
      ORDER BY u.user_id;
    `
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

function getDatasetLibrary() {
  return { ...BUILTIN_DATASETS, ...loadJson(CUSTOM_DATASETS_KEY, {}) };
}

function isBuiltInDataset(id) {
  return Object.prototype.hasOwnProperty.call(BUILTIN_DATASETS, id);
}

function normalizeDatasetId(raw) {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function loadState() {
  return loadJson(STATE_KEY, {
    dataset: "shop",
    sql: "",
    activeTaskId: "",
    taskDatasetFilter: "all",
    taskLevelFilter: "all"
  });
}

function saveState(state) {
  saveJson(STATE_KEY, state);
}

function loadProgress() {
  return loadJson(TASK_PROGRESS_KEY, {});
}

function saveProgress(progress) {
  saveJson(TASK_PROGRESS_KEY, progress);
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
    out = out.replace(new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "gi"), kw.toUpperCase());
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

async function cloneDb(sourceDb) {
  const SQL = await getSql();
  return new SQL.Database(sourceDb.export());
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
  return {
    summary: lastResult
      ? `OK: выражений ${statements.length}, строк в результате: ${lastResult.values.length}`
      : `OK: выражений ${statements.length}, изменено строк: ${changed}`,
    lastResult
  };
}

function normalizeResult(result) {
  if (!result) return { columns: [], rows: [] };
  return {
    columns: [...result.columns],
    rows: result.values.map((row) => row.map((v) => (v === null ? "NULL" : String(v))))
  };
}

function compareResults(a, b) {
  const left = normalizeResult(a);
  const right = normalizeResult(b);
  if (left.columns.length !== right.columns.length) return { ok: false, message: "Количество колонок не совпадает." };
  for (let i = 0; i < left.columns.length; i += 1) {
    if (left.columns[i] !== right.columns[i]) return { ok: false, message: `Колонка #${i + 1} не совпадает.` };
  }
  if (left.rows.length !== right.rows.length) return { ok: false, message: `Количество строк не совпадает (${left.rows.length} vs ${right.rows.length}).` };
  const lRows = left.rows.map((r) => JSON.stringify(r)).sort();
  const rRows = right.rows.map((r) => JSON.stringify(r)).sort();
  for (let i = 0; i < lRows.length; i += 1) {
    if (lRows[i] !== rRows[i]) return { ok: false, message: "Результат запроса отличается от ожидаемого." };
  }
  return { ok: true, message: "Верно: задача решена." };
}

function renderResult(host, runData) {
  if (!runData.lastResult) {
    host.innerHTML = `<p class="sql-message">${escapeHtml(runData.summary)}</p>`;
    return;
  }
  const cols = runData.lastResult.columns;
  const rows = runData.lastResult.values;
  host.innerHTML = `
    <p class="sql-message">${escapeHtml(runData.summary)}</p>
    <div class="result-scroll">
      <table class="result-table">
        <thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>${rows.length ? rows.map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderSchema(host) {
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  if (!tables.length || !tables[0].values.length) {
    host.innerHTML = "<p class='sql-message'>Таблиц не найдено.</p>";
    return;
  }
  const names = tables[0].values.map((row) => String(row[0]));
  host.innerHTML = names.map((table) => {
    const info = db.exec(`PRAGMA table_info(${table});`)[0]?.values || [];
    return `
      <h4>${escapeHtml(table)}</h4>
      <table class="result-table">
        <thead><tr><th>column</th><th>type</th><th>constraints</th><th>key</th></tr></thead>
        <tbody>${info.map((r) => `<tr><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td>${Number(r[3]) ? "NOT NULL" : ""}</td><td>${Number(r[5]) ? "PK" : ""}</td></tr>`).join("")}</tbody>
      </table>
    `;
  }).join("");
}

function renderPreview(host, tableName) {
  if (!tableName) {
    host.innerHTML = "<p class='sql-message'>Сначала выбери таблицу.</p>";
    return;
  }
  const safeName = tableName.replace(/[^a-zA-Z0-9_]/g, "");
  const set = db.exec(`SELECT * FROM ${safeName} LIMIT 20;`)[0];
  if (!set) {
    host.innerHTML = `<p class='sql-message'>Таблица ${escapeHtml(tableName)} пустая.</p>`;
    return;
  }
  renderResult(host, { summary: `Первые 20 строк таблицы ${tableName}`, lastResult: set });
}

function renderExplain(host, sqlText) {
  const statements = splitSqlStatements(sqlText);
  if (!statements.length) throw new Error("Сначала введи SQL-запрос.");
  const set = db.exec(`EXPLAIN QUERY PLAN ${statements[0]}`)[0];
  renderResult(host, { summary: "План выполнения запроса (EXPLAIN)", lastResult: set || null });
}

function appendHistory(entry) {
  const history = loadJson(HISTORY_KEY, []);
  history.unshift(entry);
  saveJson(HISTORY_KEY, history.slice(0, 80));
}

function renderHistory(host, onLoad) {
  const history = loadJson(HISTORY_KEY, []);
  if (!history.length) {
    host.innerHTML = "<p class='sql-message'>История пока пустая.</p>";
    return;
  }
  host.innerHTML = history.map((item, i) => `
    <article class="history-item">
      <div class="history-meta">
        <strong>${escapeHtml(item.dataset.toUpperCase())}</strong>
        <span>${escapeHtml(new Date(item.at).toLocaleString("ru-RU", { hour12: false }))}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <code>${escapeHtml(item.sql.slice(0, 140))}${item.sql.length > 140 ? "..." : ""}</code>
      <div class="saved-task-actions"><button class="btn ghost" data-load-history="${i}" type="button">Вставить</button></div>
    </article>
  `).join("");
  host.querySelectorAll("[data-load-history]").forEach((btn) => {
    btn.addEventListener("click", () => onLoad(history[Number(btn.getAttribute("data-load-history"))]));
  });
}

function renderTaskSelect(selectEl, activeTaskId) {
  const options = [`<option value="">Свободный режим (без задачи)</option>`].concat(
    TASK_BANK.map((task) => `<option value="${task.id}">${escapeHtml(task.title)} — ${escapeHtml(task.dataset)} / ${escapeHtml(task.level.toUpperCase())}</option>`)
  );
  selectEl.innerHTML = options.join("");
  selectEl.value = activeTaskId || "";
}

function renderTaskCard(cardEl, task, done, datasetLabel) {
  if (!task) {
    cardEl.innerHTML = `
      <h2>Свободный режим</h2>
      <p>Без активной задачи: можешь писать любые запросы на выбранном датасете.</p>
      <div class="sandbox3-task-meta">
        <span class="chip" id="active-task-dataset">Датасет: не выбран</span>
        <span class="chip" id="active-task-level">Уровень: —</span>
        <span class="chip" id="active-task-state">Статус: —</span>
      </div>
    `;
    return;
  }
  cardEl.innerHTML = `
    <h2>${escapeHtml(task.title)}</h2>
    <p>${escapeHtml(task.prompt)}</p>
    <div class="sandbox3-task-meta">
      <span class="chip">Датасет: ${escapeHtml(datasetLabel)}</span>
      <span class="chip">Уровень: ${escapeHtml(task.level.toUpperCase())}</span>
      <span class="chip ${done ? "chip-ok" : ""}">Статус: ${done ? "Выполнено" : "Не выполнено"}</span>
    </div>
  `;
}

function renderTaskBank(host, filters, progress, library) {
  const tasks = TASK_BANK.filter((task) => (filters.dataset === "all" || task.dataset === filters.dataset) && (filters.level === "all" || task.level === filters.level));
  if (!tasks.length) {
    host.innerHTML = "<p class='sql-message'>По фильтрам задач нет.</p>";
    return;
  }
  host.innerHTML = tasks.map((task) => `
    <article class="task-bank-card" data-task-id="${task.id}">
      <div class="task-bank-meta">
        <span class="chip">${escapeHtml(library[task.dataset]?.label || task.dataset)}</span>
        <span class="chip">${escapeHtml(task.level.toUpperCase())}</span>
        <span class="chip ${progress[task.id] ? "chip-ok" : ""}">${progress[task.id] ? "Выполнено" : "Не выполнено"}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.prompt)}</p>
      <div class="saved-task-actions"><button class="btn ghost" data-pick-task="${task.id}" type="button">Решать задачу</button></div>
    </article>
  `).join("");
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
  const runBtn = document.getElementById("run-sql");
  const clearHistoryBtn = document.getElementById("clear-history");
  const status = document.getElementById("sandbox-status");
  const result = document.getElementById("sandbox-result");
  const sqlInput = document.getElementById("sandbox-sql");
  const historyHost = document.getElementById("history-list");

  const taskSelect = document.getElementById("task-select");
  const pickTaskBtn = document.getElementById("pick-task");
  const checkTaskBtn = document.getElementById("check-task");
  const resetTaskProgressBtn = document.getElementById("reset-task-progress");
  const activeTaskCard = document.getElementById("active-task-card");
  const taskDatasetFilter = document.getElementById("task-dataset-filter");
  const taskLevelFilter = document.getElementById("task-level-filter");
  const taskRandomBtn = document.getElementById("task-random");
  const taskBankHost = document.getElementById("task-bank-list");

  const newDatasetId = document.getElementById("new-dataset-id");
  const newDatasetName = document.getElementById("new-dataset-name");
  const newDatasetSql = document.getElementById("new-dataset-sql");
  const saveDatasetBtn = document.getElementById("save-dataset");
  const importDatasetsBtn = document.getElementById("import-datasets");
  const exportDatasetsBtn = document.getElementById("export-datasets");
  const importDatasetsFile = document.getElementById("import-datasets-file");

  const state = loadState();
  let activeDataset = state.dataset;
  let activeTaskId = state.activeTaskId || "";
  let progress = loadProgress();

  function setStatus(text, kind = "") {
    status.className = `check-status${kind ? ` ${kind}` : ""}`;
    status.textContent = text;
  }

  function persist() {
    saveState({
      dataset: activeDataset,
      sql: sqlInput.value,
      activeTaskId,
      taskDatasetFilter: taskDatasetFilter.value,
      taskLevelFilter: taskLevelFilter.value
    });
  }

  function getActiveTask() {
    return TASK_BANK.find((task) => task.id === activeTaskId) || null;
  }

  function renderDatasetSelectors() {
    const library = getDatasetLibrary();
    const ids = Object.keys(library);
    if (!ids.length) throw new Error("Нет датасетов.");
    if (!library[activeDataset]) activeDataset = ids[0];
    datasetSelect.innerHTML = ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(library[id].label)}</option>`).join("");
    datasetSelect.value = activeDataset;
    const currentFilter = taskDatasetFilter.value || state.taskDatasetFilter || "all";
    taskDatasetFilter.innerHTML = [`<option value="all">Все датасеты</option>`, ...ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(library[id].label)}</option>`)].join("");
    taskDatasetFilter.value = taskDatasetFilter.querySelector(`option[value="${currentFilter}"]`) ? currentFilter : "all";
  }

  function refreshTablePicker() {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
    const names = (tables[0]?.values || []).map((v) => String(v[0]));
    tablePicker.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  }

  function refreshTaskUI() {
    const library = getDatasetLibrary();
    renderTaskSelect(taskSelect, activeTaskId);
    renderTaskCard(activeTaskCard, getActiveTask(), Boolean(progress[activeTaskId]), library[activeDataset]?.label || activeDataset);
    renderTaskBank(taskBankHost, { dataset: taskDatasetFilter.value, level: taskLevelFilter.value }, progress, library);
    taskBankHost.querySelectorAll("[data-pick-task]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-pick-task");
        activeTaskId = id || "";
        const task = getActiveTask();
        if (task) {
          activeDataset = task.dataset;
          datasetSelect.value = activeDataset;
          await initDb(activeDataset, getDatasetLibrary());
          refreshTablePicker();
          setStatus(`Задача выбрана. Датасет автоматически переключен на '${getDatasetLibrary()[activeDataset]?.label || activeDataset}'.`);
        }
        refreshTaskUI();
        persist();
      });
    });
  }

  async function executeSql() {
    try {
      const runData = runSql(db, sqlInput.value);
      renderResult(result, runData);
      let statusMessage = "SQL выполнен.";

      const task = getActiveTask();
      if (task) {
        let userDb = null;
        let refDb = null;
        try {
          userDb = await cloneDb(db);
          refDb = await cloneDb(db);
          const userRun = runSql(userDb, sqlInput.value);
          const refRun = runSql(refDb, task.solutionSql);
          const verdict = compareResults(userRun.lastResult, refRun.lastResult);
          if (verdict.ok) {
            progress[task.id] = true;
            saveProgress(progress);
            statusMessage = "SQL выполнен. Задача автоматически отмечена как выполненная.";
            refreshTaskUI();
          }
        } catch {
          // Silent fallback: manual check button still available.
        } finally {
          if (userDb) userDb.close();
          if (refDb) refDb.close();
        }
      }

      setStatus(statusMessage, "ok");
      appendHistory({ dataset: activeDataset, sql: sqlInput.value, summary: runData.summary, at: Date.now() });
      renderHistory(historyHost, (item) => {
        activeDataset = item.dataset;
        datasetSelect.value = activeDataset;
        sqlInput.value = item.sql;
        persist();
        setStatus("Запрос из истории вставлен.");
      });
      persist();
    } catch (error) {
      result.innerHTML = "";
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  }

  sqlInput.value = state.sql || "";
  taskLevelFilter.value = state.taskLevelFilter || "all";
  renderDatasetSelectors();
  await initDb(activeDataset, getDatasetLibrary());
  refreshTablePicker();
  renderHistory(historyHost, (item) => {
    activeDataset = item.dataset;
    datasetSelect.value = activeDataset;
    sqlInput.value = item.sql;
    persist();
    setStatus("Запрос из истории вставлен.");
  });
  refreshTaskUI();

  loadDatasetBtn.addEventListener("click", async () => {
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    setStatus("Датасет загружен.", "ok");
    persist();
    refreshTaskUI();
  });

  deleteDatasetBtn.addEventListener("click", async () => {
    const id = datasetSelect.value;
    if (isBuiltInDataset(id)) {
      setStatus("Базовые датасеты удалить нельзя.", "fail");
      return;
    }
    const custom = loadJson(CUSTOM_DATASETS_KEY, {});
    delete custom[id];
    saveJson(CUSTOM_DATASETS_KEY, custom);
    renderDatasetSelectors();
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    refreshTaskUI();
    setStatus("Кастомный датасет удален.", "ok");
    persist();
  });

  showSchemaBtn.addEventListener("click", () => {
    try {
      renderSchema(result);
      setStatus("Схема БД показана.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  previewBtn.addEventListener("click", () => {
    try {
      renderPreview(result, tablePicker.value);
      setStatus("Показаны первые строки таблицы.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  runExplainBtn.addEventListener("click", () => {
    try {
      renderExplain(result, sqlInput.value);
      setStatus("План выполнения запроса построен.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  formatBtn.addEventListener("click", () => {
    sqlInput.value = formatSqlBasic(sqlInput.value);
    setStatus("SQL отформатирован.");
    persist();
  });

  resetDbBtn.addEventListener("click", async () => {
    await initDb(activeDataset, getDatasetLibrary());
    refreshTablePicker();
    setStatus("БД сброшена в исходное состояние датасета.");
  });

  resetSqlBtn.addEventListener("click", () => {
    sqlInput.value = "";
    setStatus("Редактор SQL очищен.");
    persist();
  });

  runBtn.addEventListener("click", executeSql);
  sqlInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      executeSql();
    }
  });
  sqlInput.addEventListener("input", persist);

  pickTaskBtn.addEventListener("click", async () => {
    activeTaskId = taskSelect.value || "";
    const task = getActiveTask();
    if (task) {
      activeDataset = task.dataset;
      datasetSelect.value = activeDataset;
      await initDb(activeDataset, getDatasetLibrary());
      refreshTablePicker();
      setStatus(`Задача выбрана. Датасет '${getDatasetLibrary()[activeDataset]?.label || activeDataset}' загружен.`, "ok");
    } else {
      setStatus("Включен свободный режим.");
    }
    refreshTaskUI();
    persist();
  });

  checkTaskBtn.addEventListener("click", async () => {
    const task = getActiveTask();
    if (!task) {
      setStatus("Сначала выбери задачу для проверки.", "fail");
      return;
    }
    if (!sqlInput.value.trim()) {
      setStatus("SQL-запрос пустой.", "fail");
      return;
    }
    let userDb = null;
    let refDb = null;
    try {
      userDb = await cloneDb(db);
      refDb = await cloneDb(db);
      const userRun = runSql(userDb, sqlInput.value);
      const refRun = runSql(refDb, task.solutionSql);
      renderResult(result, userRun);
      const verdict = compareResults(userRun.lastResult, refRun.lastResult);
      if (verdict.ok) {
        progress[task.id] = true;
        saveProgress(progress);
        setStatus("Решение принято: задача отмечена как выполненная.", "ok");
      } else {
        setStatus(verdict.message, "fail");
      }
      refreshTaskUI();
    } catch (error) {
      setStatus(`Ошибка проверки: ${error.message}`, "fail");
    } finally {
      if (userDb) userDb.close();
      if (refDb) refDb.close();
    }
  });

  resetTaskProgressBtn.addEventListener("click", () => {
    const task = getActiveTask();
    if (!task) {
      setStatus("Нет активной задачи для сброса.", "fail");
      return;
    }
    delete progress[task.id];
    saveProgress(progress);
    refreshTaskUI();
    setStatus("Прогресс задачи сброшен.");
  });

  taskDatasetFilter.addEventListener("change", () => {
    refreshTaskUI();
    persist();
  });

  taskLevelFilter.addEventListener("change", () => {
    refreshTaskUI();
    persist();
  });

  taskRandomBtn.addEventListener("click", () => {
    const cards = Array.from(taskBankHost.querySelectorAll(".task-bank-card"));
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    cards.forEach((it) => it.classList.remove("task-bank-pick"));
    card.classList.add("task-bank-pick");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  clearHistoryBtn.addEventListener("click", () => {
    saveJson(HISTORY_KEY, []);
    renderHistory(historyHost, () => {});
    setStatus("История запусков очищена.");
  });

  saveDatasetBtn.addEventListener("click", async () => {
    const id = normalizeDatasetId(newDatasetId.value);
    const label = newDatasetName.value.trim();
    const seed = newDatasetSql.value.trim();
    if (!id || id.length < 2) {
      setStatus("Укажи корректный ID датасета.", "fail");
      return;
    }
    if (!label) {
      setStatus("Укажи название датасета.", "fail");
      return;
    }
    if (!seed) {
      setStatus("SQL-скрипт датасета пустой.", "fail");
      return;
    }
    try {
      const tempDb = await createDbFromSeed(seed);
      tempDb.close();
      const custom = loadJson(CUSTOM_DATASETS_KEY, {});
      custom[id] = { label, seed };
      saveJson(CUSTOM_DATASETS_KEY, custom);
      renderDatasetSelectors();
      refreshTaskUI();
      setStatus(`Кастомный датасет '${id}' сохранен.`, "ok");
    } catch (error) {
      setStatus(`Ошибка SQL-скрипта датасета: ${error.message}`, "fail");
    }
  });

  exportDatasetsBtn.addEventListener("click", () => {
    const payload = {
      version: 1,
      exportedAt: Date.now(),
      datasets: loadJson(CUSTOM_DATASETS_KEY, {})
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sql-datasets-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Кастомные датасеты экспортированы.", "ok");
  });

  importDatasetsBtn.addEventListener("click", () => importDatasetsFile.click());
  importDatasetsFile.addEventListener("change", async () => {
    const file = importDatasetsFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = parsed.datasets || parsed;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        throw new Error("Ожидается JSON-объект datasets.");
      }
      const custom = loadJson(CUSTOM_DATASETS_KEY, {});
      let imported = 0;
      for (const [rawId, data] of Object.entries(incoming)) {
        const id = normalizeDatasetId(rawId);
        if (!id || isBuiltInDataset(id)) continue;
        const label = String(data?.label || "").trim();
        const seed = String(data?.seed || "").trim();
        if (!label || !seed) continue;
        const tempDb = await createDbFromSeed(seed);
        tempDb.close();
        custom[id] = { label, seed };
        imported += 1;
      }
      saveJson(CUSTOM_DATASETS_KEY, custom);
      renderDatasetSelectors();
      refreshTaskUI();
      setStatus(`Импортировано датасетов: ${imported}.`, "ok");
    } catch (error) {
      setStatus(`Ошибка импорта: ${error.message}`, "fail");
    } finally {
      importDatasetsFile.value = "";
    }
  });
}

main();
