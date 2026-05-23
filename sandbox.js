const TASKS_KEY = "vk-qa-sandbox-custom-tasks-v2";
const HISTORY_KEY = "vk-qa-sandbox-history-v1";
const STATE_KEY = "vk-qa-sandbox-state-v1";

const DATASETS = {
  shop: `
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
  `,
  users: `
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
      status TEXT
    );
    INSERT INTO users VALUES
      (1, 'ivan', 'Moscow'),
      (2, 'maria', 'Kazan'),
      (3, 'anna', 'Moscow'),
      (4, 'oleg', 'Samara'),
      (5, 'nina', 'Kazan');
    INSERT INTO orders VALUES
      (1, 1, 5000, 'paid'),
      (2, 1, 2500, 'paid'),
      (3, 2, 3000, 'cancelled'),
      (4, 3, 1500, 'paid'),
      (5, 3, 1800, 'paid'),
      (6, 5, 4200, 'paid');
  `,
  qa: `
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS order_items;
    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      total_amount REAL
    );
    CREATE TABLE order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      quantity INTEGER,
      unit_price REAL
    );
    INSERT INTO orders VALUES
      (1, 51000),
      (2, 30000),
      (3, 5000),
      (4, 4500),
      (5, 18000);
    INSERT INTO order_items VALUES
      (1, 1, 1, 50000),
      (2, 1, 1, 1000),
      (3, 2, 1, 30000),
      (4, 3, 1, 5000),
      (5, 4, 1, 3000),
      (6, 4, 1, 1000),
      (7, 5, 3, 6000);
  `,
  support: `
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
      message TEXT
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
      (1, 101, 'user', 'Cannot login for 30 minutes'),
      (2, 101, 'agent', 'Investigating logs'),
      (3, 102, 'user', 'Price is doubled after refresh'),
      (4, 104, 'user', 'Cancellation fails with 409'),
      (5, 104, 'agent', 'Escalated to backend team');
  `
};

const SNIPPETS = [
  { label: "SELECT + LIMIT", sql: "SELECT *\nFROM products\nLIMIT 5;" },
  { label: "WHERE + ORDER BY", sql: "SELECT *\nFROM orders\nWHERE status = 'paid'\nORDER BY order_id DESC;" },
  { label: "JOIN", sql: "SELECT u.username, o.amount\nFROM users u\nJOIN orders o ON o.user_id = u.user_id\nWHERE o.status = 'paid';" },
  { label: "GROUP BY + HAVING", sql: "SELECT user_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) >= 2;" },
  { label: "LEFT JOIN anti", sql: "SELECT u.user_id, u.username\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.user_id\nWHERE o.order_id IS NULL;" }
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

function loadTasks() {
  return loadJson(TASKS_KEY, []);
}

function saveTasks(tasks) {
  saveJson(TASKS_KEY, tasks);
}

function loadHistory() {
  return loadJson(HISTORY_KEY, []);
}

function saveHistory(history) {
  saveJson(HISTORY_KEY, history.slice(0, 100));
}

function loadState() {
  return loadJson(STATE_KEY, {
    dataset: "shop",
    sql: "",
    activeTaskId: null,
    form: {
      title: "",
      text: "",
      expectedSql: "",
      dataset: "shop",
      ignoreOrder: true
    }
  });
}

function saveState(state) {
  saveJson(STATE_KEY, state);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now()}`;
}

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString("ru-RU", { hour12: false });
  } catch {
    return "";
  }
}

function getSnippetSql(label) {
  const hit = SNIPPETS.find((s) => s.label === label);
  return hit ? hit.sql : "";
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

    if (!inSingle && !inBacktick && ch === '"') {
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
    "left join", "right join", "inner join", "full join", "join", "on",
    "insert into", "values", "update", "set", "delete", "create table", "drop table",
    "case", "when", "then", "else", "end", "as", "and", "or"
  ];

  let out = sql.replace(/\s+/g, " ").trim();

  keywords
    .sort((a, b) => b.length - a.length)
    .forEach((kw) => {
      const escaped = kw.replace(/\s+/g, "\\s+");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      out = out.replace(regex, kw.toUpperCase());
    });

  out = out
    .replace(/\s+(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|ON|VALUES|SET)\b/g, "\n$1")
    .replace(/\s+,\s*/g, ", ")
    .replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlPromise;
}

async function createDbFromDataset(datasetName) {
  const SQL = await getSql();
  const temp = new SQL.Database();
  temp.run(DATASETS[datasetName] || DATASETS.shop);
  return temp;
}

async function initDb(datasetName) {
  if (db) db.close();
  db = await createDbFromDataset(datasetName);
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

function resultToComparable(result) {
  if (!result) return { columns: [], rows: [] };
  return {
    columns: [...result.columns],
    rows: result.values.map((row) => row.map((v) => (v === null ? "NULL" : String(v))))
  };
}

function compareResults(userResult, expectedResult, ignoreOrder) {
  const user = resultToComparable(userResult);
  const expected = resultToComparable(expectedResult);

  if (user.columns.length !== expected.columns.length) {
    return { ok: false, message: "Количество колонок не совпадает с эталоном." };
  }

  for (let i = 0; i < user.columns.length; i += 1) {
    if (user.columns[i] !== expected.columns[i]) {
      return { ok: false, message: `Колонка #${i + 1} должна быть '${expected.columns[i]}'.` };
    }
  }

  if (user.rows.length !== expected.rows.length) {
    return { ok: false, message: `Количество строк не совпадает: ожидается ${expected.rows.length}, получено ${user.rows.length}.` };
  }

  const userRows = ignoreOrder
    ? [...user.rows].map((r) => JSON.stringify(r)).sort()
    : user.rows.map((r) => JSON.stringify(r));
  const expRows = ignoreOrder
    ? [...expected.rows].map((r) => JSON.stringify(r)).sort()
    : expected.rows.map((r) => JSON.stringify(r));

  for (let i = 0; i < userRows.length; i += 1) {
    if (userRows[i] !== expRows[i]) {
      return { ok: false, message: `Результат отличается от эталона (проверь фильтры, JOIN и агрегаты).` };
    }
  }

  return { ok: true, message: "Отлично: результат совпал с эталоном." };
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
          ${rows.length ? rows.map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`}
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
    ...sets[0],
    lastResult: sets[0],
    summary: `Превью таблицы ${tableName} (до 20 строк)`
  });
}

function renderExplain(resultHost, sql) {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error("Сначала введи SQL.");
  const first = statements[0];
  const explainSet = db.exec(`EXPLAIN QUERY PLAN ${first}`);
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

function renderHistory(listHost, onLoad, onRun) {
  const history = loadHistory();
  if (!history.length) {
    listHost.innerHTML = "<p class='sql-message'>История пока пустая.</p>";
    return;
  }

  listHost.innerHTML = history.map((item, idx) => `
    <article class="history-item">
      <div class="history-meta">
        <strong>${escapeHtml(item.dataset.toUpperCase())}</strong>
        <span>${escapeHtml(formatDateTime(item.at))}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <code>${escapeHtml(item.sql.slice(0, 180))}${item.sql.length > 180 ? "..." : ""}</code>
      <div class="saved-task-actions">
        <button class="btn ghost" data-hload="${idx}" type="button">Вставить</button>
        <button class="btn ghost" data-hrun="${idx}" type="button">Запустить</button>
      </div>
    </article>
  `).join("");

  listHost.querySelectorAll("[data-hload]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = history[Number(btn.getAttribute("data-hload"))];
      onLoad(item);
    });
  });

  listHost.querySelectorAll("[data-hrun]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = history[Number(btn.getAttribute("data-hrun"))];
      onRun(item);
    });
  });
}

function renderSnippetBank(host, onPick) {
  host.innerHTML = SNIPPETS.map((snippet) => `<button class="btn ghost" data-snip="${escapeHtml(snippet.label)}" type="button">${escapeHtml(snippet.label)}</button>`).join("");
  host.querySelectorAll("[data-snip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.getAttribute("data-snip");
      onPick(getSnippetSql(label));
    });
  });
}

function renderCustomTasks(listHost, form, handlers) {
  const tasks = loadTasks();
  if (!tasks.length) {
    listHost.innerHTML = "<p class='sql-message'>Пока нет сохраненных задач.</p>";
    return;
  }

  listHost.innerHTML = tasks.map((task) => `
    <article class="saved-task ${form.activeTaskId === task.id ? "saved-task-active" : ""}">
      <h4>${escapeHtml(task.title)}</h4>
      <p>${escapeHtml(task.text)}</p>
      <div class="saved-task-badges">
        <span class="chip">${escapeHtml(task.dataset)}</span>
        <span class="chip">${task.expectedSql ? "с эталоном" : "без эталона"}</span>
      </div>
      <div class="saved-task-actions">
        <button class="btn ghost" data-load="${task.id}" type="button">В редактор</button>
        <button class="btn ghost" data-put-expected="${task.id}" type="button">Эталон в SQL</button>
        <button class="btn ghost" data-delete="${task.id}" type="button">Удалить</button>
      </div>
    </article>
  `).join("");

  listHost.querySelectorAll("[data-load]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-load");
      handlers.onLoadTask(id);
    });
  });

  listHost.querySelectorAll("[data-put-expected]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-put-expected");
      handlers.onFillExpected(id);
    });
  });

  listHost.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-delete");
      handlers.onDeleteTask(id);
    });
  });
}

function exportTasks() {
  const payload = {
    exportedAt: Date.now(),
    version: 2,
    tasks: loadTasks()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sql-sandbox-tasks-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function main() {
  const dataset = document.getElementById("dataset");
  const loadDatasetBtn = document.getElementById("load-dataset");
  const showSchemaBtn = document.getElementById("show-schema");
  const previewBtn = document.getElementById("preview-table");
  const tablePicker = document.getElementById("table-picker");
  const runBtn = document.getElementById("run-sql");
  const resetSqlBtn = document.getElementById("reset-sql");
  const resetDbBtn = document.getElementById("reset-db");
  const explainBtn = document.getElementById("run-explain");
  const formatBtn = document.getElementById("format-sql");
  const sqlInput = document.getElementById("sandbox-sql");
  const status = document.getElementById("sandbox-status");
  const result = document.getElementById("sandbox-result");
  const snippetBank = document.getElementById("snippet-bank");

  const titleInput = document.getElementById("custom-title");
  const textInput = document.getElementById("custom-text");
  const expectedInput = document.getElementById("custom-expected");
  const taskDatasetInput = document.getElementById("task-dataset");
  const ignoreOrderInput = document.getElementById("task-ignore-order");

  const saveTaskBtn = document.getElementById("save-task");
  const checkCurrentTaskBtn = document.getElementById("check-current-task");
  const exportTasksBtn = document.getElementById("export-tasks");
  const importTasksBtn = document.getElementById("import-tasks");
  const clearTasksBtn = document.getElementById("clear-tasks");
  const importFile = document.getElementById("import-file");

  const taskList = document.getElementById("saved-tasks");
  const historyList = document.getElementById("history-list");

  const pageState = loadState();
  let activeTaskId = pageState.activeTaskId;

  dataset.value = DATASETS[pageState.dataset] ? pageState.dataset : "shop";
  taskDatasetInput.value = DATASETS[pageState.form.dataset] ? pageState.form.dataset : dataset.value;
  titleInput.value = pageState.form.title || "";
  textInput.value = pageState.form.text || "";
  expectedInput.value = pageState.form.expectedSql || "";
  ignoreOrderInput.checked = Boolean(pageState.form.ignoreOrder ?? true);
  sqlInput.value = pageState.sql || "";

  function setStatus(text, kind = "") {
    status.className = `check-status${kind ? ` ${kind}` : ""}`;
    status.textContent = text;
  }

  function persistState() {
    saveState({
      dataset: dataset.value,
      sql: sqlInput.value,
      activeTaskId,
      form: {
        title: titleInput.value,
        text: textInput.value,
        expectedSql: expectedInput.value,
        dataset: taskDatasetInput.value,
        ignoreOrder: ignoreOrderInput.checked
      }
    });
  }

  function loadTaskToForm(id) {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    activeTaskId = id;
    titleInput.value = task.title;
    textInput.value = task.text;
    expectedInput.value = task.expectedSql || "";
    taskDatasetInput.value = task.dataset || "shop";
    ignoreOrderInput.checked = Boolean(task.ignoreOrder ?? true);
    dataset.value = task.dataset || dataset.value;
    persistState();
    setStatus("Задача загружена в редактор.");
    refreshTaskList();
  }

  function refreshTaskList() {
    renderCustomTasks(taskList, { activeTaskId }, {
      onLoadTask: (id) => loadTaskToForm(id),
      onFillExpected: (id) => {
        const tasks = loadTasks();
        const task = tasks.find((t) => t.id === id);
        if (task?.expectedSql) {
          sqlInput.value = task.expectedSql;
          persistState();
          setStatus("Эталонный SQL подставлен в редактор.");
        } else {
          setStatus("У этой задачи не заполнен эталонный SQL.", "fail");
        }
      },
      onDeleteTask: (id) => {
        const tasks = loadTasks().filter((t) => t.id !== id);
        saveTasks(tasks);
        if (activeTaskId === id) activeTaskId = null;
        persistState();
        refreshTaskList();
        setStatus("Задача удалена.");
      }
    });
  }

  function refreshHistory() {
    renderHistory(historyList, (item) => {
      dataset.value = item.dataset;
      sqlInput.value = item.sql;
      persistState();
      setStatus("SQL из истории загружен в редактор.");
    }, async (item) => {
      dataset.value = item.dataset;
      await initDb(dataset.value);
      await refreshTablePicker();
      sqlInput.value = item.sql;
      persistState();
      await executeSql(true);
    });
  }

  async function refreshTablePicker() {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
    const names = (tables[0]?.values || []).map((r) => String(r[0]));
    tablePicker.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  }

  async function executeSql(recordHistory = true) {
    const started = performance.now();
    try {
      const runData = runSql(db, sqlInput.value);
      runData.durationMs = performance.now() - started;
      renderResult(result, runData);
      setStatus("SQL выполнен.");
      if (recordHistory) {
        appendHistory({
          id: uid("history"),
          sql: sqlInput.value,
          dataset: dataset.value,
          at: Date.now(),
          ok: true,
          summary: runData.summary,
          durationMs: runData.durationMs
        });
        refreshHistory();
      }
    } catch (error) {
      result.innerHTML = "";
      setStatus(`Ошибка: ${error.message}`, "fail");
      if (recordHistory) {
        appendHistory({
          id: uid("history"),
          sql: sqlInput.value,
          dataset: dataset.value,
          at: Date.now(),
          ok: false,
          summary: String(error.message)
        });
        refreshHistory();
      }
    } finally {
      persistState();
    }
  }

  await initDb(dataset.value);
  await refreshTablePicker();
  renderSnippetBank(snippetBank, (sql) => {
    sqlInput.value = sql;
    persistState();
    setStatus("Шаблон SQL вставлен.");
  });
  refreshTaskList();
  refreshHistory();

  loadDatasetBtn.addEventListener("click", async () => {
    await initDb(dataset.value);
    await refreshTablePicker();
    result.innerHTML = "";
    setStatus("Датасет загружен.");
    persistState();
  });

  showSchemaBtn.addEventListener("click", () => {
    try {
      renderSchema(result);
      setStatus("");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  previewBtn.addEventListener("click", () => {
    try {
      renderPreviewTable(result, tablePicker.value);
      setStatus("");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  explainBtn.addEventListener("click", () => {
    try {
      renderExplain(result, sqlInput.value);
      setStatus("План выполнения построен.");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  });

  runBtn.addEventListener("click", () => executeSql(true));

  resetSqlBtn.addEventListener("click", () => {
    sqlInput.value = "";
    persistState();
    setStatus("Редактор SQL очищен.");
  });

  resetDbBtn.addEventListener("click", async () => {
    await initDb(dataset.value);
    await refreshTablePicker();
    result.innerHTML = "";
    setStatus("База датасета сброшена.");
  });

  formatBtn.addEventListener("click", () => {
    sqlInput.value = formatSqlBasic(sqlInput.value);
    persistState();
    setStatus("SQL отформатирован.");
  });

  saveTaskBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const text = textInput.value.trim();
    const expectedSql = expectedInput.value.trim();
    const taskDataset = taskDatasetInput.value;

    if (!title || !text) {
      setStatus("Заполни название и условие задачи.", "fail");
      return;
    }

    const tasks = loadTasks();
    if (activeTaskId) {
      const idx = tasks.findIndex((t) => t.id === activeTaskId);
      if (idx >= 0) {
        tasks[idx] = {
          ...tasks[idx],
          title,
          text,
          expectedSql,
          dataset: taskDataset,
          ignoreOrder: ignoreOrderInput.checked,
          updatedAt: Date.now()
        };
      }
    } else {
      const task = {
        id: uid("task"),
        title,
        text,
        expectedSql,
        dataset: taskDataset,
        ignoreOrder: ignoreOrderInput.checked,
        createdAt: Date.now()
      };
      tasks.unshift(task);
      activeTaskId = task.id;
    }

    saveTasks(tasks);
    persistState();
    refreshTaskList();
    setStatus("Задача сохранена.", "ok");
  });

  checkCurrentTaskBtn.addEventListener("click", async () => {
    const userSql = sqlInput.value.trim();
    const expectedSql = expectedInput.value.trim();
    const taskDataset = taskDatasetInput.value;

    if (!userSql) {
      setStatus("Сначала напиши SQL в редакторе.", "fail");
      return;
    }
    if (!expectedSql) {
      setStatus("Для проверки нужен эталонный SQL в карточке задачи.", "fail");
      return;
    }

    let userDb = null;
    let expectedDb = null;

    try {
      userDb = await createDbFromDataset(taskDataset);
      expectedDb = await createDbFromDataset(taskDataset);

      const userRun = runSql(userDb, userSql);
      const expectedRun = runSql(expectedDb, expectedSql);
      renderResult(result, userRun);

      const verdict = compareResults(userRun.lastResult, expectedRun.lastResult, ignoreOrderInput.checked);
      if (verdict.ok) {
        setStatus(verdict.message, "ok");
      } else {
        setStatus(verdict.message, "fail");
      }
    } catch (error) {
      setStatus(`Ошибка проверки: ${error.message}`, "fail");
    } finally {
      if (userDb) userDb.close();
      if (expectedDb) expectedDb.close();
    }
  });

  exportTasksBtn.addEventListener("click", () => {
    exportTasks();
    setStatus("JSON с задачами экспортирован.");
  });

  importTasksBtn.addEventListener("click", () => {
    importFile.click();
  });

  importFile.addEventListener("change", async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = Array.isArray(parsed) ? parsed : parsed.tasks;
      if (!Array.isArray(incoming)) throw new Error("Неверный формат файла.");

      const existing = loadTasks();
      const normalized = incoming
        .map((t) => ({
          id: t.id || uid("task"),
          title: String(t.title || "").trim(),
          text: String(t.text || "").trim(),
          expectedSql: String(t.expectedSql || "").trim(),
          dataset: DATASETS[t.dataset] ? t.dataset : "shop",
          ignoreOrder: Boolean(t.ignoreOrder ?? true),
          createdAt: Number(t.createdAt || Date.now())
        }))
        .filter((t) => t.title && t.text);

      saveTasks([...normalized, ...existing]);
      refreshTaskList();
      setStatus(`Импортировано задач: ${normalized.length}.`, "ok");
    } catch (error) {
      setStatus(`Ошибка импорта: ${error.message}`, "fail");
    } finally {
      importFile.value = "";
    }
  });

  clearTasksBtn.addEventListener("click", () => {
    saveTasks([]);
    activeTaskId = null;
    persistState();
    refreshTaskList();
    setStatus("Все кастомные задачи удалены.");
  });

  [dataset, taskDatasetInput, titleInput, textInput, expectedInput, ignoreOrderInput, sqlInput].forEach((el) => {
    el.addEventListener("input", persistState);
    el.addEventListener("change", persistState);
  });

  sqlInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      executeSql(true);
    }
  });
}

main();
