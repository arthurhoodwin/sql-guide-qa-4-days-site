import fs from "node:fs/promises";

const LIMIT = Number(process.argv[2] || 300);
const LIST_URL = `https://sobes.tech/bank/qa?limit=${LIMIT}&order=VIEWS_DESC&grade=intern%2Cjunior`;
const OUT_PATH = "quizlets-data.js";

function decodeEscaped(value = "") {
  return String(value)
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, "\"")
    .replace(/\\\//g, "/")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\u0026/g, "&")
    .replace(/\\t/g, " ")
    .replace(/\\\\/g, "\\")
    .trim();
}

function cleanupAnswer(value = "") {
  let text = decodeEscaped(value);
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/^\|.*\|$/gm, " ");
  text = text.replace(/^\s*[-*]\s+/gm, "");
  text = text.replace(/\*\*/g, "");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  text = text.replace(/\s*\\\s*/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > 430) {
    const chunk = text.slice(0, 430);
    const lastDot = Math.max(chunk.lastIndexOf("."), chunk.lastIndexOf("!"), chunk.lastIndexOf("?"));
    text = (lastDot > 120 ? chunk.slice(0, lastDot + 1) : chunk).trim();
  }
  return text;
}

function classifyTopic(question, answer) {
  const src = `${question} ${answer}`.toLowerCase();
  if (/sql|join|select|where|group by|having|база дан|реляцион|индекс|postgres|mysql|таблиц/.test(src)) return "SQL и Базы данных";
  if (/api|http|rest|json|status|код ответ|endpoint|эндпоинт|запрос|ответ|клиент|сервер/.test(src)) return "API и Клиент-сервер";
  if (/баг|дефект|bug|severity|priority|репорт|jira|тикет/.test(src)) return "Баги и Документация";
  if (/эквивалент|гранич|pairwise|попар|state transition|decision table|тест-дизайн/.test(src)) return "Тест-дизайн";
  if (/agile|scrum|sprint|спринт|ретро|стендап|kanban|релиз|release|процесс/.test(src)) return "Процессы и Agile";
  if (/ui|ux|верст|адаптив|ios|android|чекбокс|интерфейс|figma/.test(src)) return "UI/UX и Платформы";
  if (/нагруз|перформ|stress|load|security|безопас|owasp/.test(src)) return "Нефункциональное тестирование";
  return "Собесные вопросы QA";
}

function parseDetail(html) {
  const questionMatch = html.match(/\\"question\\":\{\\"id\\":\\"([0-9a-f-]{36})\\"[\s\S]*?\\"question\\":\\"([\s\S]*?)\\",\\"grades\\":\[([\s\S]*?)\],\\"views\\":(\d+)/);
  if (!questionMatch) return null;

  const [, id, qRaw, gradesRaw, viewsRaw] = questionMatch;
  const question = decodeEscaped(qRaw);
  const grades = [...gradesRaw.matchAll(/\\"(.*?)\\"/g)].map((m) => m[1]);
  const views = Number(viewsRaw || 0);

  const answerMatch = html.match(/\\"suggestedAnswer\\":\[\{\\"@type\\":\\"Answer\\",\\"text\\":\\"([\s\S]*?)\\",\\"dateCreated\\":/);
  const answerRaw = answerMatch ? answerMatch[1] : "";
  const answer = cleanupAnswer(answerRaw);

  return { id, question, grades, views, answer };
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Codex Quizlet Importer)",
      "Accept-Language": "ru,en;q=0.8",
      "Cache-Control": "no-cache"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchDetailWithRetry(id, retries = 4) {
  const url = `https://sobes.tech/bank/qa/${id}`;
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const text = await fetchText(url);
      if (text.includes('\\"question\\":{\\"id\\":\\"')) return text;
      lastError = new Error("Detail payload missing question marker");
    } catch (err) {
      lastError = err;
    }
    await sleep(220 * attempt);
  }
  throw lastError || new Error(`Failed to fetch detail: ${id}`);
}

async function run() {
  const listHtml = await fetchText(LIST_URL);
  const ids = [...listHtml.matchAll(/\/bank\/qa\/([0-9a-f-]{36})/g)].map((m) => m[1]);
  const uniqueIds = [...new Set(ids)];

  const cards = [];
  const dedupe = new Set();
  let idx = 0;

  for (const id of uniqueIds) {
    idx += 1;
    if (idx % 20 === 0) console.log(`progress ${idx}/${uniqueIds.length}`);
    try {
      const html = await fetchDetailWithRetry(id);
      const data = parseDetail(html);
      if (!data || !data.question) continue;
      const normQ = data.question.toLowerCase();
      if (dedupe.has(normQ)) continue;
      dedupe.add(normQ);

      const level = data.grades.includes("intern") && data.grades.includes("junior")
        ? "Стажер/Джун"
        : data.grades.includes("intern")
          ? "Стажер"
          : data.grades.includes("junior")
            ? "Джун"
            : "Стажер/Джун";

      cards.push({
        id: `sobes_${cards.length + 1}`,
        topic: classifyTopic(data.question, data.answer),
        level,
        front: data.question,
        back: data.answer || "Ответ: дай определение, объясни логику, добавь пример и частые ошибки."
      });
    } catch {
      // Skip failed card fetches.
    }
  }

  const reverseCards = cards
    .filter((card) => card.front.length <= 150 && card.back.length >= 40)
    .map((card, i) => ({
      id: `sobes_rev_${i + 1}`,
      topic: card.topic,
      level: card.level,
      front: `Как бы ты ответил на собесе: ${card.front}`,
      back: card.back
    }));

  const all = [...cards, ...reverseCards];
  const output = `window.QA_QUIZLETS = ${JSON.stringify(all, null, 2)};\n`;
  await fs.writeFile(OUT_PATH, output, "utf8");

  console.log(`done base=${cards.length} reverse=${reverseCards.length} total=${all.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
