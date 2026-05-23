(function () {
  const STATUS_KEY = "vk-qa-quizlets-status-v2";
  const cards = Array.isArray(window.QA_QUIZLETS) ? window.QA_QUIZLETS : [];

  const topicSelect = document.getElementById("quiz-topic");
  const modeSelect = document.getElementById("quiz-mode");
  const searchInput = document.getElementById("quiz-search");
  const countEl = document.getElementById("quiz-count");
  const hardCountEl = document.getElementById("quiz-hard-count");
  const knownCountEl = document.getElementById("quiz-known-count");
  const progressEl = document.getElementById("quiz-progress");
  const progressLineFill = document.getElementById("quiz-progress-line-fill");

  const frontEl = document.getElementById("card-front");
  const backEl = document.getElementById("card-back");
  const cardEl = document.getElementById("quiz-card");
  const cardTopicEl = document.getElementById("card-topic");
  const cardLevelEl = document.getElementById("card-level");
  const cardStateEl = document.getElementById("card-state");

  const prevBtn = document.getElementById("quiz-prev");
  const nextBtn = document.getElementById("quiz-next");
  const randomBtn = document.getElementById("quiz-random");
  const flipBtn = document.getElementById("quiz-flip");
  const markHardBtn = document.getElementById("quiz-mark-hard");
  const markKnownBtn = document.getElementById("quiz-mark-known");
  const resetCardBtn = document.getElementById("quiz-reset-card");

  let filtered = [...cards];
  let index = 0;
  let flipped = false;
  let statusMap = loadStatusMap();

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stemToken(token) {
    const t = String(token || "");
    if (t.length <= 4) return t;

    if (/^[a-z]+$/i.test(t)) {
      return t
        .replace(/(ations|ation|ments|ment|ingly|edly|ing|edly|edly|ed|ly|es|s)$/i, "")
        .trim() || t;
    }

    return t
      .replace(/(иями|ями|ами|ого|его|ому|ему|ыми|ими|иях|иях|ией|ией|иям|ием|иях|иях|ция|ции|ций|ировать|ировать|ного|ными|ными|ный|ная|ное|ные|ать|ить|ешь|ете|ют|ет|ая|яя|ое|ее|ые|ие|ов|ев|ом|ем|ам|ям|ах|ях|а|я|ы|и|о|е|у|ю)$/u, "")
      .trim() || t;
  }

  function tokenize(value) {
    return normalizeText(value)
      .split(" ")
      .map((item) => item.trim())
      .filter((item) => item.length > 1);
  }

  function loadStatusMap() {
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveStatusMap() {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statusMap));
  }

  function cardState(cardId) {
    const state = statusMap[cardId] || {};
    return {
      hard: Boolean(state.hard),
      known: Boolean(state.known)
    };
  }

  function patchCardState(cardId, patch) {
    const prev = statusMap[cardId] || {};
    statusMap[cardId] = {
      ...prev,
      ...patch
    };
    saveStatusMap();
  }

  function resetCardState(cardId) {
    delete statusMap[cardId];
    saveStatusMap();
  }

  function uniqueTopics(list) {
    return [...new Set(list.map((c) => c.topic))].sort((a, b) => a.localeCompare(b, "ru"));
  }

  function fillTopics() {
    const topics = uniqueTopics(cards);
    topicSelect.innerHTML = ["<option value=\"all\">Все темы</option>"]
      .concat(topics.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`))
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function searchCard(card, queryTokens) {
    if (!queryTokens.length) return true;

    const haystack = `${card.front} ${card.back} ${card.topic} ${card.level || ""}`;
    const rawTokens = tokenize(haystack);
    const rawSet = new Set(rawTokens);
    const stemSet = new Set(rawTokens.map(stemToken));

    return queryTokens.every((token) => {
      const stem = stemToken(token);
      return rawSet.has(token) || stemSet.has(stem);
    });
  }

  function applyFilters(resetIndex = false) {
    const topic = topicSelect.value;
    const mode = modeSelect.value;
    const queryTokens = tokenize(searchInput.value);

    filtered = cards.filter((card) => {
      const state = cardState(card.id);
      const topicOk = topic === "all" || card.topic === topic;
      const modeOk =
        mode === "all" ||
        (mode === "hard" && state.hard) ||
        (mode === "known" && state.known) ||
        (mode === "learning" && !state.known);
      const queryOk = searchCard(card, queryTokens);
      return topicOk && modeOk && queryOk;
    });

    if (resetIndex || index >= filtered.length) index = 0;
    flipped = false;
    updateMeta();
    renderCard();
  }

  function updateMeta() {
    const hardCount = cards.filter((card) => cardState(card.id).hard).length;
    const knownCount = cards.filter((card) => cardState(card.id).known).length;

    countEl.textContent = `Карточек: ${filtered.length} из ${cards.length}`;
    hardCountEl.textContent = `Сложных: ${hardCount}`;
    knownCountEl.textContent = `Выучено: ${knownCount}`;

    const pct = cards.length ? Math.round((knownCount / cards.length) * 100) : 0;
    progressLineFill.style.width = `${pct}%`;
  }

  function currentCard() {
    return filtered[index] || null;
  }

  function statusLabelFor(card) {
    if (!card) return "Статус: —";
    const state = cardState(card.id);
    if (state.known && state.hard) return "Статус: выучено, но помечено сложным";
    if (state.known) return "Статус: выучено";
    if (state.hard) return "Статус: сложная";
    return "Статус: в работе";
  }

  function updateActionButtons(card) {
    if (!card) {
      markHardBtn.textContent = "Отметить как сложную";
      markKnownBtn.textContent = "Отметить как выученную";
      return;
    }

    const state = cardState(card.id);
    markHardBtn.textContent = state.hard ? "Убрать из сложных" : "Отметить как сложную";
    markKnownBtn.textContent = state.known ? "Снять отметку выученной" : "Отметить как выученную";

    markHardBtn.classList.toggle("toggle-active", state.hard);
    markKnownBtn.classList.toggle("toggle-active", state.known);
  }

  function setInteractiveDisabled(disabled) {
    [prevBtn, nextBtn, randomBtn, flipBtn, markHardBtn, markKnownBtn, resetCardBtn].forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  function renderCard() {
    const card = currentCard();

    if (!card) {
      frontEl.textContent = "Ничего не найдено по текущим фильтрам.";
      backEl.textContent = "Смени тему, режим или очисти поиск.";
      progressEl.textContent = "0 / 0";
      cardTopicEl.textContent = "Тема: —";
      cardLevelEl.textContent = "Уровень: —";
      cardStateEl.textContent = "Статус: —";
      cardEl.classList.remove("flipped");
      setInteractiveDisabled(true);
      updateActionButtons(null);
      return;
    }

    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    progressEl.textContent = `${index + 1} / ${filtered.length}`;
    cardTopicEl.textContent = `Тема: ${card.topic}`;
    cardLevelEl.textContent = `Уровень: ${card.level || "Intern/Junior"}`;
    cardStateEl.textContent = statusLabelFor(card);
    cardEl.classList.toggle("flipped", flipped);
    setInteractiveDisabled(false);
    updateActionButtons(card);
  }

  function next() {
    if (!filtered.length) return;
    index = (index + 1) % filtered.length;
    flipped = false;
    renderCard();
  }

  function prev() {
    if (!filtered.length) return;
    index = (index - 1 + filtered.length) % filtered.length;
    flipped = false;
    renderCard();
  }

  function randomCard() {
    if (!filtered.length) return;
    index = Math.floor(Math.random() * filtered.length);
    flipped = false;
    renderCard();
  }

  function flip() {
    if (!filtered.length) return;
    flipped = !flipped;
    cardEl.classList.toggle("flipped", flipped);
  }

  function toggleHardForCurrent() {
    const card = currentCard();
    if (!card) return;
    const state = cardState(card.id);
    patchCardState(card.id, { hard: !state.hard });
    updateMeta();
    applyFilters(false);
  }

  function toggleKnownForCurrent() {
    const card = currentCard();
    if (!card) return;
    const state = cardState(card.id);
    patchCardState(card.id, { known: !state.known });
    updateMeta();
    applyFilters(false);
  }

  function resetCurrentCardState() {
    const card = currentCard();
    if (!card) return;
    resetCardState(card.id);
    updateMeta();
    applyFilters(false);
  }

  topicSelect.addEventListener("change", () => applyFilters(true));
  modeSelect.addEventListener("change", () => applyFilters(true));
  searchInput.addEventListener("input", () => applyFilters(true));
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  randomBtn.addEventListener("click", randomCard);
  flipBtn.addEventListener("click", flip);
  cardEl.addEventListener("click", flip);
  markHardBtn.addEventListener("click", toggleHardForCurrent);
  markKnownBtn.addEventListener("click", toggleKnownForCurrent);
  resetCardBtn.addEventListener("click", resetCurrentCardState);

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
    if (event.key === " ") {
      event.preventDefault();
      flip();
    }
    if (event.key.toLowerCase() === "h") toggleHardForCurrent();
    if (event.key.toLowerCase() === "k") toggleKnownForCurrent();
  });

  fillTopics();
  applyFilters(true);
})();