const TOTAL_DAYS = 4;
const STORAGE_KEY = "sql-guide-progress-v1";

const dayMeta = {
  1: "Установка, база данных, CREATE/INSERT/SELECT",
  2: "WHERE, фильтры, сортировка, LIMIT, DISTINCT",
  3: "Агрегация, GROUP BY, HAVING, JOIN",
  4: "Сложные запросы и подготовка к собеседованию"
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const days = {};
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      days[i] = Boolean(parsed[i]);
    }
    return days;
  } catch {
    return { 1: false, 2: false, 3: false, 4: false };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function buildDayCard(day, progress) {
  const done = progress[day];
  return `
    <article class="panel day-card">
      <div class="day-badge">День ${day}</div>
      <h3 class="day-title">${dayMeta[day]}</h3>
      <p class="day-sub">Практика и теория в формате из исходного гайда.</p>
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

function renderDay() {
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

  const url = `content/day${day}.md`;
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Не удалось загрузить markdown");
      return res.text();
    })
    .then((md) => {
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

      if (!headers.length) {
        toc.innerHTML = "<p>Разделы не найдены</p>";
      }
    })
    .catch((error) => {
      content.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });

  buildDayPagination(day);
}

function main() {
  const page = document.body.dataset.page;
  if (page === "index") {
    renderIndex();
  }
  if (page === "day") {
    renderDay();
  }
}

main();
