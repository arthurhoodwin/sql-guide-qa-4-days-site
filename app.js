const STORAGE_KEY = "vk-qa-day-progress-v1";
const QUIZ_STATE_KEY = "vk-qa-quiz-state-v1";
const SQL_TASK_STATE_KEY = "vk-qa-sql-task-state-v1";
const SQL_DRAFT_KEY = "vk-qa-sql-draft-v1";

const DAYS = [
  { id: 1, mode: "quiz", title: "Теория тестирования", subtitle: "Виды тестирования, smoke/sanity/retest/regression" },
  { id: 2, mode: "quiz", title: "Тест-дизайн", subtitle: "Эквивалентность, границы, decision table, state transition" },
  { id: 3, mode: "quiz", title: "SDLC и Agile", subtitle: "Процессы, роли, сущности, артефакты" },
  { id: 4, mode: "quiz", title: "Клиент-сервер и API", subtitle: "HTTP, коды, контракты, проверки API" },
  { id: 5, mode: "quiz", title: "Тест-документация", subtitle: "Test case/checklist/bug report/RTM" },
  { id: 6, mode: "sql", title: "SQL лайвкодинг I", subtitle: "Базовые SELECT/WHERE/ORDER BY/LIMIT" },
  { id: 7, mode: "sql", title: "SQL лайвкодинг II", subtitle: "JOIN/GROUP BY/HAVING/поиск аномалий" },
  { id: 8, mode: "quiz", title: "Репетиция собеса", subtitle: "Финальный микс вопросов и стратегии ответа" }
];

const DAY_MAP = Object.fromEntries(DAYS.map((d) => [d.id, d]));
const TOTAL_DAYS = DAYS.length;

const QUIZ_BANK = {
  1: [
    {
      id: "d1_q1",
      question: "Чем retest отличается от regression?",
      options: [
        "Retest проверяет конкретно фикс, regression проверяет что остальное не сломали",
        "Retest это то же самое что regression",
        "Retest всегда автоматизированный, regression всегда ручной",
        "Retest делают только перед релизом"
      ],
      correct: 0,
      explain: "Retest = проверка исправленного дефекта. Regression = проверка смежной функциональности на побочки."
    },
    {
      id: "d1_q2",
      question: "Что обычно включает smoke-тест после деплоя?",
      options: [
        "Только критические end-to-end пути системы",
        "Полный регресс всех модулей",
        "Только UI-проверки без API",
        "Только нагрузочные тесты"
      ],
      correct: 0,
      explain: "Smoke должен быстро ответить на вопрос: система вообще жива и можно ли продолжать тестирование."
    },
    {
      id: "d1_q3",
      question: "Какой вид тестирования в первую очередь про производительность?",
      options: ["Функциональное", "Usability", "Performance", "Compatibility"],
      correct: 2,
      explain: "Performance-тестирование покрывает скорость, стабильность под нагрузкой и деградации."
    }
  ],
  2: [
    {
      id: "d2_q1",
      question: "Для диапазона 1..100 какие значения наиболее важны по BVA?",
      options: ["1, 100, 0, 101", "50, 51, 52", "10, 20, 30", "2, 99"],
      correct: 0,
      explain: "Границы и ближайшие значения вокруг них чаще всего дают дефекты."
    },
    {
      id: "d2_q2",
      question: "Когда лучше использовать decision table?",
      options: [
        "Когда много комбинаций условий и бизнес-правил",
        "Когда один input и один output",
        "Только для UI верстки",
        "Только для SQL"
      ],
      correct: 0,
      explain: "Decision table помогает системно покрыть комбинации условий/правил."
    },
    {
      id: "d2_q3",
      question: "Что такое эквивалентные классы?",
      options: [
        "Группы значений, которые система обрабатывает одинаково",
        "Список всех возможных значений поля",
        "Только граничные значения",
        "Только невалидные значения"
      ],
      correct: 0,
      explain: "Техника нужна, чтобы сократить набор тестов без потери покрытия логики."
    }
  ],
  3: [
    {
      id: "d3_q1",
      question: "Что из этого относится к Scrum-ритуалам?",
      options: ["Daily, Sprint Planning, Review, Retro", "Only Kanban Board", "Only Bug Triage", "Only Release Meeting"],
      correct: 0,
      explain: "Это базовый набор регулярных scrum-событий."
    },
    {
      id: "d3_q2",
      question: "Что такое Definition of Done (DoD)?",
      options: [
        "Критерии, при которых задача считается завершенной командой",
        "То же самое что acceptance criteria",
        "Список багов в спринте",
        "Только инструкция для QA"
      ],
      correct: 0,
      explain: "DoD про готовность инкремента в целом, а AC про конкретную user story."
    },
    {
      id: "d3_q3",
      question: "Главная идея Kanban?",
      options: ["Фиксированные 2-недельные спринты", "Непрерывный поток + WIP-лимиты", "Без приоритизации", "Только для поддержки"],
      correct: 1,
      explain: "Kanban оптимизирует поток доставки и ограничивает параллельную работу."
    }
  ],
  4: [
    {
      id: "d4_q1",
      question: "Какой HTTP-метод обычно используют для частичного обновления ресурса?",
      options: ["GET", "POST", "PATCH", "DELETE"],
      correct: 2,
      explain: "PATCH применяют для частичного обновления; PUT обычно про полную замену ресурса."
    },
    {
      id: "d4_q2",
      question: "Какой код ответа означает неавторизованный запрос?",
      options: ["200", "401", "404", "500"],
      correct: 1,
      explain: "401 = Unauthorized. 403 = Forbidden (авторизован, но нет прав)."
    },
    {
      id: "d4_q3",
      question: "Что в API тестах означает " + '"контракт"' + "?",
      options: [
        "Согласованная схема/формат запроса и ответа",
        "Только URL endpoint",
        "Только структура БД",
        "Только swagger-док"
      ],
      correct: 0,
      explain: "Контракт — это договор о структуре и поведении API между клиентом и сервером."
    }
  ],
  5: [
    {
      id: "d5_q1",
      question: "Когда лучше checklist вместо детальных test cases?",
      options: [
        "Когда проверка типовая/быстрая и нужны краткие контрольные пункты",
        "Никогда",
        "Только для автоматизации",
        "Только для API"
      ],
      correct: 0,
      explain: "Checklist быстрее в поддержке, но для сложной логики часто нужны подробные test cases."
    },
    {
      id: "d5_q2",
      question: "Что обязательно должно быть в bug report?",
      options: ["Только скрин", "Шаги + expected/actual + окружение", "Только severity", "Только ссылку на таску"],
      correct: 1,
      explain: "Без шагов/результатов/окружения баг сложно воспроизвести и качественно починить."
    },
    {
      id: "d5_q3",
      question: "Для чего RTM (traceability matrix)?",
      options: [
        "Связать требования с тестами и контролировать покрытие",
        "Планировать релизы",
        "Хранить логи сервера",
        "Считать velocity"
      ],
      correct: 0,
      explain: "RTM помогает увидеть, какие требования не покрыты тестами."
    }
  ],
  8: [
    {
      id: "d8_q1",
      question: "Если не знаешь ответ на вопрос интервьюера, лучший ход?",
      options: [
        "Честно сказать и предложить структурированную гипотезу",
        "Импровизировать уверенно любой ценой",
        "Перевести тему",
        "Сказать " + '"не знаю"' + " и молчать"
      ],
      correct: 0,
      explain: "Прозрачность + логика рассуждения лучше, чем уверенная выдумка."
    },
    {
      id: "d8_q2",
      question: "Какая структура ответа на техничке обычно самая сильная?",
      options: [
        "Определение → когда применяю → пример → риски/trade-off",
        "Сразу длинная история",
        "Только термин без примера",
        "Только пример без термина"
      ],
      correct: 0,
      explain: "Структурный ответ показывает системность и практичность мышления QA."
    },
    {
      id: "d8_q3",
      question: "Что важно в SQL-лайвкодинге кроме синтаксиса?",
      options: ["Молчать и быстро печатать", "Озвучивать ход мысли и проверять результат", "Сразу писать подзапросы", "Игнорировать edge cases"],
      correct: 1,
      explain: "Интервьюер оценивает не только код, но и твой инженерный процесс."
    }
  ]
};

const SQL_SEEDS = {
  6: `
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
      (5, 'Клавиатура Logitech', 'Периферия', 3499, 30),
      (6, 'Мышь Razer', 'Периферия', 2999, 40);
  `,
  7: `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS orders;
    CREATE TABLE users (
      user_id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      city TEXT
    );
    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      amount REAL,
      status TEXT
    );
    INSERT INTO users (user_id, username, city) VALUES
      (1, 'ivan', 'Москва'),
      (2, 'maria', 'Казань'),
      (3, 'anna', 'Москва'),
      (4, 'oleg', 'Самара');
    INSERT INTO orders (order_id, user_id, amount, status) VALUES
      (1, 1, 5000, 'paid'),
      (2, 1, 2500, 'paid'),
      (3, 2, 3000, 'cancelled'),
      (4, 2, 4200, 'paid'),
      (5, 3, 1500, 'paid');
  `
};

const SQL_TASKS = {
  6: [
    {
      id: "d6_t1",
      title: "Товары дороже 10000",
      prompt: "Выведи product_name и price для товаров дороже 10000.",
      starter: "SELECT product_name, price\nFROM products\nWHERE price > 0;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидаются строки результата." };
        const i = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (i < 0) return { ok: false, message: "Нужна колонка price." };
        const ok = lastResult.values.every((r) => Number(r[i]) > 10000);
        return ok ? { ok: true, message: "Верно." } : { ok: false, message: "Есть строки с price <= 10000." };
      }
    },
    {
      id: "d6_t2",
      title: "Топ-3 дорогих",
      prompt: "Покажи 3 самых дорогих товара.",
      starter: "SELECT product_name, price\nFROM products\nORDER BY price ASC\nLIMIT 3;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length !== 3) return { ok: false, message: "Нужно ровно 3 строки." };
        const i = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (i < 0) return { ok: false, message: "Нужна колонка price." };
        const arr = lastResult.values.map((r) => Number(r[i]));
        const sorted = [...arr].sort((a, b) => b - a);
        const ok = arr.every((v, idx) => v === sorted[idx]);
        return ok ? { ok: true, message: "Отлично." } : { ok: false, message: "Проверь ORDER BY DESC." };
      }
    }
  ],
  7: [
    {
      id: "d7_t1",
      title: "Пользователи без заказов",
      prompt: "Найди пользователей без заказов (LEFT JOIN + IS NULL).",
      starter: "SELECT u.user_id, u.username\nFROM users u\nLEFT JOIN orders o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL;",
      validate: ({ db, lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается минимум 1 пользователь." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("user_id"));
        if (idx < 0) return { ok: false, message: "В выдаче нужен user_id." };
        const actual = [...new Set(lastResult.values.map((r) => Number(r[idx])))].sort((a, b) => a - b);
        const exp = db.exec("SELECT user_id FROM users WHERE user_id NOT IN (SELECT DISTINCT user_id FROM orders) ORDER BY user_id;");
        const expected = exp.length ? exp[0].values.map((r) => Number(r[0])) : [];
        const ok = actual.length === expected.length && actual.every((v, i) => v === expected[i]);
        return ok ? { ok: true, message: "Верно." } : { ok: false, message: "Список пользователей не совпал." };
      }
    },
    {
      id: "d7_t2",
      title: "Сумма paid-заказов по пользователю",
      prompt: "Выведи user_id и total_paid только по статусу paid, отсортируй по total_paid убыванию.",
      starter: "SELECT user_id, SUM(amount) AS total_paid\nFROM orders\nWHERE status = 'paid'\nGROUP BY user_id\nORDER BY total_paid ASC;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается непустой результат." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("total"));
        if (idx < 0) return { ok: false, message: "Нужна колонка total_paid." };
        const arr = lastResult.values.map((r) => Number(r[idx]));
        const sorted = [...arr].sort((a, b) => b - a);
        const ok = arr.every((v, i) => v === sorted[i]);
        return ok ? { ok: true, message: "Отлично." } : { ok: false, message: "Проверь ORDER BY ... DESC." };
      }
    }
  ]
};

let sqlJsPromise = null;

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

function loadProgress() {
  const saved = loadJson(STORAGE_KEY, {});
  const result = {};
  DAYS.forEach((d) => { result[d.id] = Boolean(saved[d.id]); });
  return result;
}

function saveProgress(progress) {
  saveJson(STORAGE_KEY, progress);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function setDayCompleted(dayId, toggleBtn) {
  const p = loadProgress();
  p[dayId] = true;
  saveProgress(p);
  if (toggleBtn) toggleBtn.textContent = "Убрать отметку о прохождении";
}

function buildDayCard(day, progress) {
  const done = progress[day.id];
  return `
    <article class="panel day-card">
      <div class="day-badge">День ${day.id}</div>
      <h3 class="day-title">${escapeHtml(day.title)}</h3>
      <p class="day-sub">${escapeHtml(day.subtitle)}</p>
      <div class="day-actions">
        <a class="btn primary" href="day${day.id}.html">Открыть</a>
        <button class="btn ghost" data-day-toggle="${day.id}" type="button">${done ? "Сбросить" : "Готово"}</button>
        <span class="status">${done ? "Пройдено" : "В процессе"}</span>
      </div>
    </article>`;
}

function renderIndex() {
  const progress = loadProgress();
  const grid = document.getElementById("days-grid");
  const done = Object.values(progress).filter(Boolean).length;
  grid.innerHTML = DAYS.map((d) => buildDayCard(d, progress)).join("");

  const txt = document.getElementById("overall-progress");
  const fill = document.getElementById("progress-fill");
  txt.textContent = `${done} из ${TOTAL_DAYS} модулей отмечено как пройдено`;
  fill.style.width = `${(done / TOTAL_DAYS) * 100}%`;

  grid.querySelectorAll("[data-day-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dayId = Number(btn.getAttribute("data-day-toggle"));
      progress[dayId] = !progress[dayId];
      saveProgress(progress);
      renderIndex();
    });
  });
}

function buildDayPagination(dayId) {
  const wrap = document.getElementById("day-nav");
  const idx = DAYS.findIndex((d) => d.id === dayId);
  const prev = idx > 0 ? DAYS[idx - 1] : null;
  const next = idx < DAYS.length - 1 ? DAYS[idx + 1] : null;
  wrap.innerHTML = `${prev ? `<a class="btn ghost" href="day${prev.id}.html">← День ${prev.id}</a>` : "<span></span>"}${next ? `<a class="btn primary" href="day${next.id}.html">День ${next.id} →</a>` : `<a class="btn primary" href="index.html">К модулям</a>`}`;
}

function renderMarkdownContent(contentEl, tocEl, md) {
  marked.setOptions({ gfm: true, breaks: false });
  contentEl.innerHTML = marked.parse(md);
  const headers = contentEl.querySelectorAll("h2, h3");
  tocEl.innerHTML = "";
  headers.forEach((header) => {
    const id = slugify(header.textContent || "section") || `section-${Math.random().toString(36).slice(2, 7)}`;
    header.id = id;
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = header.textContent || "Раздел";
    tocEl.appendChild(a);
  });
  if (!headers.length) tocEl.innerHTML = "<p>Разделы не найдены</p>";
}

function renderQuiz(dayId, toggleBtn) {
  const panel = document.getElementById("practice-panel");
  const questions = QUIZ_BANK[dayId] || [];
  if (!questions.length) {
    panel.innerHTML = "<p>Квиз для этого дня еще не добавлен.</p>";
    return;
  }

  const state = loadJson(QUIZ_STATE_KEY, {});
  if (!state[dayId]) state[dayId] = {};

  panel.innerHTML = `
    <div class="practice-head">
      <h2>Интерактив: Квиз</h2>
      <p>Отвечай на вопросы. Состояние сохраняется. День засчитывается автоматически при всех верных ответах.</p>
    </div>
    <div id="quiz-root" class="quiz-root"></div>
  `;

  const root = panel.querySelector("#quiz-root");

  function calcSummary() {
    let correct = 0;
    let answered = 0;
    questions.forEach((q) => {
      const selected = state[dayId][q.id];
      if (typeof selected === "number") {
        answered += 1;
        if (selected === q.correct) correct += 1;
      }
    });
    return { correct, answered };
  }

  function renderQuizCards() {
    const summary = calcSummary();
    root.innerHTML = `
      <div class="quiz-summary panel">
        <strong>Прогресс: ${summary.correct}/${questions.length} верно</strong>
        <span>Отвечено: ${summary.answered}/${questions.length}</span>
      </div>
      ${questions.map((q, idx) => {
        const selected = state[dayId][q.id];
        const isAnswered = typeof selected === "number";
        const isCorrect = isAnswered && selected === q.correct;
        const resultClass = isAnswered ? (isCorrect ? "ok" : "fail") : "";

        return `
          <section class="panel quiz-card ${resultClass}">
            <h3>${idx + 1}. ${escapeHtml(q.question)}</h3>
            <div class="quiz-options">
              ${q.options.map((opt, i) => {
                const active = selected === i ? "active" : "";
                return `<button class="quiz-option ${active}" data-qid="${q.id}" data-opt="${i}" type="button">${escapeHtml(opt)}</button>`;
              }).join("")}
            </div>
            ${isAnswered ? `<p class="quiz-explain ${isCorrect ? "ok" : "fail"}">${escapeHtml(q.explain)}</p>` : ""}
          </section>
        `;
      }).join("")}
    `;

    root.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-qid");
        const opt = Number(btn.getAttribute("data-opt"));
        state[dayId][qid] = opt;
        saveJson(QUIZ_STATE_KEY, state);
        renderQuizCards();
      });
    });

    const after = calcSummary();
    if (after.correct === questions.length) {
      setDayCompleted(dayId, toggleBtn);
    }
  }

  renderQuizCards();
}

async function getSqlJs() {
  if (!sqlJsPromise) {
    sqlJsPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlJsPromise;
}

async function buildSqlDb(dayId) {
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  db.run(SQL_SEEDS[dayId] || "");
  return db;
}

async function cloneSqlDb(source) {
  const SQL = await getSqlJs();
  return new SQL.Database(source.export());
}

function runSql(db, sql) {
  const clean = sql.trim();
  if (!clean) throw new Error("SQL-запрос пуст.");
  const before = db.getRowsModified();
  const sets = db.exec(clean);
  const changed = db.getRowsModified() - before;
  const last = sets.length ? sets[sets.length - 1] : null;
  const summary = last ? `OK: ${last.values.length} строк(и)` : `OK: изменено строк ${Math.max(changed, 0)}`;
  return { lastResult: last, summary };
}

function renderSqlResult(host, runData) {
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

function renderSchema(db, host) {
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  if (!tables.length || !tables[0].values.length) {
    host.innerHTML = "<p class='sql-message'>Таблиц нет.</p>";
    return;
  }
  const names = tables[0].values.map((r) => String(r[0]));
  const blocks = names.map((name) => {
    const info = db.exec(`PRAGMA table_info(${name});`);
    const rows = info.length ? info[0].values : [];
    return `
      <h4>${escapeHtml(name)}</h4>
      <table class="result-table">
        <thead><tr><th>column</th><th>type</th><th>constraints</th><th>key</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td>${Number(r[3]) ? "NOT NULL" : ""}</td><td>${Number(r[5]) ? "PK" : ""}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
  }).join("");
  host.innerHTML = `<p class='sql-message'>Схема текущей БД</p>${blocks}`;
}

async function renderSqlPractice(dayId, toggleBtn) {
  const panel = document.getElementById("practice-panel");
  const tasks = SQL_TASKS[dayId] || [];
  if (!tasks.length) {
    panel.innerHTML = "<p>SQL-практика для этого дня еще не добавлена.</p>";
    return;
  }

  const taskState = loadJson(SQL_TASK_STATE_KEY, {});
  if (!taskState[dayId]) taskState[dayId] = {};
  const drafts = loadJson(SQL_DRAFT_KEY, {});
  if (!drafts[dayId]) drafts[dayId] = {};

  panel.innerHTML = `
    <div class="practice-head">
      <h2>Интерактив: SQL Лайвкодинг</h2>
      <p>Run SQL меняет учебную БД. Проверка задачи запускается в изолированной копии БД.</p>
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
          <button class="btn ghost" id="show-schema" type="button">Показать схему</button>
          <button class="btn ghost" id="reset-db" type="button">Сбросить БД</button>
        </div>
        <div id="check-status" class="check-status"></div>
        <div id="sql-result" class="sql-result"></div>
      </section>
    </div>
  `;

  const list = panel.querySelector("#task-list");
  const title = panel.querySelector("#task-title");
  const prompt = panel.querySelector("#task-prompt");
  const progressEl = panel.querySelector("#task-progress");
  const input = panel.querySelector("#sql-input");
  const runBtn = panel.querySelector("#run-sql");
  const checkBtn = panel.querySelector("#check-sql");
  const schemaBtn = panel.querySelector("#show-schema");
  const resetBtn = panel.querySelector("#reset-db");
  const status = panel.querySelector("#check-status");
  const result = panel.querySelector("#sql-result");

  let active = 0;
  let db = await buildSqlDb(dayId);

  function updateHeaderProgress() {
    const solved = tasks.filter((t) => Boolean(taskState[dayId][t.id])).length;
    progressEl.textContent = `Решено: ${solved}/${tasks.length}`;
    if (solved === tasks.length) setDayCompleted(dayId, toggleBtn);
  }

  function renderTaskButtons() {
    list.innerHTML = tasks.map((t, i) => {
      const done = Boolean(taskState[dayId][t.id]);
      return `<button class="task-btn ${i === active ? "active" : ""}" data-task="${i}" type="button"><span>${escapeHtml(t.title)}</span><strong>${done ? "✓" : "•"}</strong></button>`;
    }).join("");

    list.querySelectorAll("[data-task]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = Number(btn.getAttribute("data-task"));
        loadTask();
      });
    });
  }

  function loadTask() {
    const t = tasks[active];
    title.textContent = t.title;
    prompt.textContent = t.prompt;
    input.value = drafts[dayId][t.id] || t.starter;
    status.textContent = "";
    status.className = "check-status";
    result.innerHTML = "";
    renderTaskButtons();
    updateHeaderProgress();
  }

  input.addEventListener("input", () => {
    const t = tasks[active];
    drafts[dayId][t.id] = input.value;
    saveJson(SQL_DRAFT_KEY, drafts);
  });

  runBtn.addEventListener("click", () => {
    try {
      status.className = "check-status";
      const runData = runSql(db, input.value);
      renderSqlResult(result, runData);
      status.textContent = "SQL выполнен в учебной БД.";
    } catch (e) {
      result.innerHTML = "";
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${e.message}`;
    }
  });

  checkBtn.addEventListener("click", async () => {
    const t = tasks[active];
    let checkDb = null;
    try {
      checkDb = await cloneSqlDb(db);
      const runData = runSql(checkDb, input.value);
      renderSqlResult(result, runData);
      const verdict = t.validate({ db: checkDb, lastResult: runData.lastResult });
      if (verdict.ok) {
        taskState[dayId][t.id] = true;
        saveJson(SQL_TASK_STATE_KEY, taskState);
        status.className = "check-status ok";
        status.textContent = verdict.message;
      } else {
        status.className = "check-status fail";
        status.textContent = verdict.message;
      }
      renderTaskButtons();
      updateHeaderProgress();
    } catch (e) {
      result.innerHTML = "";
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${e.message}`;
    } finally {
      if (checkDb) checkDb.close();
    }
  });

  schemaBtn.addEventListener("click", () => {
    try {
      status.textContent = "";
      status.className = "check-status";
      renderSchema(db, result);
    } catch (e) {
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${e.message}`;
    }
  });

  resetBtn.addEventListener("click", async () => {
    db.close();
    db = await buildSqlDb(dayId);
    result.innerHTML = "";
    status.className = "check-status";
    status.textContent = "База дня сброшена к начальному состоянию.";
  });

  loadTask();
}

async function renderDay() {
  const dayId = Number(document.body.dataset.day);
  const day = DAY_MAP[dayId];
  const content = document.getElementById("content");
  const toc = document.getElementById("toc");
  const toggle = document.getElementById("toggle-complete");

  if (!day) {
    content.innerHTML = "<p>День не найден.</p>";
    return;
  }

  const progress = loadProgress();
  const updateToggleLabel = () => {
    toggle.textContent = progress[dayId] ? "Убрать отметку о прохождении" : "Отметить день пройденным";
  };
  updateToggleLabel();

  toggle.addEventListener("click", () => {
    const p = loadProgress();
    p[dayId] = !p[dayId];
    saveProgress(p);
    progress[dayId] = p[dayId];
    updateToggleLabel();
  });

  try {
    const res = await fetch(`content/day${dayId}.md`);
    if (!res.ok) throw new Error("Не удалось загрузить контент дня");
    const md = await res.text();
    renderMarkdownContent(content, toc, md);
  } catch (e) {
    content.innerHTML = `<p>Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
  }

  buildDayPagination(dayId);
  if (day.mode === "quiz") renderQuiz(dayId, toggle);
  if (day.mode === "sql") await renderSqlPractice(dayId, toggle);
}

function main() {
  const page = document.body.dataset.page;
  if (page === "index") renderIndex();
  if (page === "day") renderDay();
}

main();
