const TASKS_KEY = "vk-qa-sandbox-custom-tasks-v1";

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
      (4, 'Laptop', 'Electronics', 90000);
    INSERT INTO orders VALUES
      (1, 1, 1, 'paid'),
      (2, 2, 2, 'paid'),
      (3, 4, 1, 'cancelled'),
      (4, 3, 3, 'paid');
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
      (4, 'oleg', 'Samara');
    INSERT INTO orders VALUES
      (1, 1, 5000, 'paid'),
      (2, 1, 2500, 'paid'),
      (3, 2, 3000, 'cancelled'),
      (4, 3, 1500, 'paid');
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
      (4, 4500);
    INSERT INTO order_items VALUES
      (1, 1, 1, 50000),
      (2, 1, 1, 1000),
      (3, 2, 1, 30000),
      (4, 3, 1, 5000),
      (5, 4, 1, 3000),
      (6, 4, 1, 1000);
  `
};

let sqlPromise = null;
let db = null;

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlPromise;
}

async function initDb(datasetName) {
  const SQL = await getSql();
  if (db) db.close();
  db = new SQL.Database();
  db.run(DATASETS[datasetName]);
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

function runSql(sql) {
  const clean = sql.trim();
  if (!clean) throw new Error("SQL-запрос пуст.");
  const before = db.getRowsModified();
  const sets = db.exec(clean);
  const changed = db.getRowsModified() - before;
  const last = sets.length ? sets[sets.length - 1] : null;
  const summary = last ? `OK: ${last.values.length} строк(и)` : `OK: изменено строк ${Math.max(changed, 0)}`;
  return { lastResult: last, summary };
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

function renderCustomTasks(listHost, titleInput, textInput) {
  const tasks = loadTasks();
  if (!tasks.length) {
    listHost.innerHTML = "<p class='sql-message'>Пока нет сохраненных задач.</p>";
    return;
  }

  listHost.innerHTML = tasks.map((task, idx) => `
    <article class="saved-task">
      <h4>${escapeHtml(task.title)}</h4>
      <p>${escapeHtml(task.text)}</p>
      <div class="saved-task-actions">
        <button class="btn ghost" data-load="${idx}" type="button">В редактор</button>
        <button class="btn ghost" data-delete="${idx}" type="button">Удалить</button>
      </div>
    </article>
  `).join("");

  listHost.querySelectorAll("[data-load]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-load"));
      titleInput.value = tasks[idx].title;
      textInput.value = tasks[idx].text;
    });
  });

  listHost.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-delete"));
      const next = tasks.filter((_, i) => i !== idx);
      saveTasks(next);
      renderCustomTasks(listHost, titleInput, textInput);
    });
  });
}

async function main() {
  const dataset = document.getElementById("dataset");
  const loadDatasetBtn = document.getElementById("load-dataset");
  const showSchemaBtn = document.getElementById("show-schema");
  const runBtn = document.getElementById("run-sql");
  const resetSqlBtn = document.getElementById("reset-sql");
  const sqlInput = document.getElementById("sandbox-sql");
  const status = document.getElementById("sandbox-status");
  const result = document.getElementById("sandbox-result");

  const titleInput = document.getElementById("custom-title");
  const textInput = document.getElementById("custom-text");
  const saveTaskBtn = document.getElementById("save-task");
  const taskList = document.getElementById("saved-tasks");

  await initDb(dataset.value);
  renderCustomTasks(taskList, titleInput, textInput);

  loadDatasetBtn.addEventListener("click", async () => {
    await initDb(dataset.value);
    status.className = "check-status";
    status.textContent = "Датасет загружен.";
    result.innerHTML = "";
  });

  showSchemaBtn.addEventListener("click", () => {
    try {
      renderSchema(result);
      status.textContent = "";
      status.className = "check-status";
    } catch (error) {
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${error.message}`;
    }
  });

  runBtn.addEventListener("click", () => {
    try {
      const data = runSql(sqlInput.value);
      renderResult(result, data);
      status.className = "check-status";
      status.textContent = "SQL выполнен.";
    } catch (error) {
      result.innerHTML = "";
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${error.message}`;
    }
  });

  resetSqlBtn.addEventListener("click", () => {
    sqlInput.value = "";
    status.className = "check-status";
    status.textContent = "Редактор SQL очищен.";
  });

  saveTaskBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const text = textInput.value.trim();
    if (!title || !text) {
      status.className = "check-status fail";
      status.textContent = "Заполни и название, и условие задачи.";
      return;
    }
    const tasks = loadTasks();
    tasks.unshift({ title, text, createdAt: Date.now() });
    saveTasks(tasks);
    renderCustomTasks(taskList, titleInput, textInput);
    status.className = "check-status ok";
    status.textContent = "Кастомная задача сохранена.";
  });
}

main();
