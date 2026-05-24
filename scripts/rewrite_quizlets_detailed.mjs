import fs from "node:fs";
import vm from "node:vm";

const FILE = "quizlets-data.js";

function cleanText(value = "") {
  return String(value)
    .replace(/`+/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function coreAnswer(text) {
  const parts = splitSentences(text);
  if (!parts.length) return "";
  return parts.slice(0, 3).join(" ");
}

function toLowerSafe(value) {
  return String(value || "").toLowerCase();
}

function buildSqlAnswer(card, base) {
  const q = card.front;
  return `${base}

Подробно для собеседования:
1) Сначала проговори цель запроса: что именно нужно получить на выходе (какие строки и какие столбцы).
2) Потом объясни порядок мышления: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.
3) Укажи типичные риски: дубли после JOIN, неверный фильтр, NULL-значения, потеря строк из-за INNER JOIN.
4) После написания запроса сделай самопроверку: количество строк, названия столбцов, сортировка, граничные случаи.
5) На собесе полезно добавить короткий пример из практики: как таким запросом проверял данные после API или UI-действия.

Как ответить уверенно:
- «В этом вопросе (${q}) я сначала фиксирую ожидаемый результат, затем собираю запрос по шагам и проверяю корректность вывода по данным».`;
}

function buildApiAnswer(card, base) {
  const q = card.front;
  return `${base}

Подробно для собеседования:
1) Раздели ответ на три части: протокол/метод -> контракт ответа -> практическая проверка.
2) Обязательно проговори позитивные и негативные сценарии: валидный запрос, невалидные данные, отсутствие прав, граничные значения.
3) Уточни, что проверяешь не только status code, но и тело ответа, обязательные поля, типы данных и бизнес-эффект.
4) Для уверенного уровня добавь, как проверяешь связку UI -> API -> БД и где ищешь причину ошибки.
5) Назови частую ошибку: ориентироваться только на код ответа и не валидировать содержимое payload.

Как ответить уверенно:
- «По вопросу (${q}) я всегда проверяю контракт, права доступа и последствия в данных, а не только успешный HTTP-код».`;
}

function buildTestingAnswer(card, base) {
  const q = card.front;
  return `${base}

Подробно для собеседования:
1) Дай короткое определение термина своими словами, без заученной формулировки.
2) Покажи практическое применение: где это использовалось в проекте и какую проблему решало.
3) Обозначь порядок действий QA: приоритизация рисков -> подготовка сценариев -> проверка -> фиксация результата.
4) Добавь антипример: что ломается, если этот подход игнорировать.
5) Заверши ответ мини-выводом: как это влияет на качество релиза и скорость команды.

Как ответить уверенно:
- «На вопрос (${q}) отвечаю через структуру: что это, зачем это нужно, как делал на практике и какие ошибки это предотвращает».`;
}

function buildProcessAnswer(card, base) {
  const q = card.front;
  return `${base}

Подробно для собеседования:
1) Покажи понимание роли QA в процессе: не только поиск багов, но и управление рисками качества.
2) Привяжи ответ к этапам работы команды: планирование, разработка, тестирование, релиз, пост-релизная проверка.
3) Подчеркни коммуникацию: как согласовываешь критерии приемки, как эскалируешь блокеры, как фиксируешь договоренности.
4) Укажи артефакты: чек-лист, тест-кейсы, баг-репорты, release notes, smoke-план.
5) Добавь пример реальной ситуации, где процессное решение помогло не выпустить критический дефект.

Как ответить уверенно:
- «По теме (${q}) я показываю, как QA влияет на предсказуемость релиза и прозрачность работы команды».`;
}

function buildDetailedAnswer(card) {
  const topic = toLowerSafe(card.topic);
  const question = toLowerSafe(card.front);
  const original = cleanText(card.back);

  const fallback =
    "Базовый ответ: важно дать определение, показать применение на практике и проговорить, как это проверяется в реальном проекте.";
  const base = coreAnswer(original) || fallback;

  const isSql = topic.includes("sql") || question.includes(" join") || question.includes("select");
  const isApi =
    topic.includes("api") ||
    question.includes("http") ||
    question.includes("rest") ||
    question.includes("postman") ||
    question.includes("swagger");
  const isProcess =
    topic.includes("agile") ||
    topic.includes("процесс") ||
    question.includes("scrum") ||
    question.includes("sprint") ||
    question.includes("релиз");

  if (isSql) return buildSqlAnswer(card, base);
  if (isApi) return buildApiAnswer(card, base);
  if (isProcess) return buildProcessAnswer(card, base);
  return buildTestingAnswer(card, base);
}

function main() {
  const source = fs.readFileSync(FILE, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);

  const cards = Array.isArray(sandbox.window.QA_QUIZLETS) ? sandbox.window.QA_QUIZLETS : [];

  const filtered = cards.filter((card) => !String(card?.id || "").startsWith("sobes_rev_"));
  const rewritten = filtered.map((card) => ({
    ...card,
    back: buildDetailedAnswer(card)
  }));

  const output = `window.QA_QUIZLETS = ${JSON.stringify(rewritten, null, 2)};\n`;
  fs.writeFileSync(FILE, output, "utf8");

  console.log(`rewritten: ${rewritten.length}`);
}

main();
