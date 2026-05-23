(function () {
  const HARD_KEY = "vk-qa-quizlets-hard-v1";
  const cards = Array.isArray(window.QA_QUIZLETS) ? window.QA_QUIZLETS : [];

  const topicSelect = document.getElementById("quiz-topic");
  const searchInput = document.getElementById("quiz-search");
  const countEl = document.getElementById("quiz-count");
  const hardCountEl = document.getElementById("quiz-hard-count");
  const frontEl = document.getElementById("card-front");
  const backEl = document.getElementById("card-back");
  const cardEl = document.getElementById("quiz-card");
  const progressEl = document.getElementById("quiz-progress");
  const prevBtn = document.getElementById("quiz-prev");
  const nextBtn = document.getElementById("quiz-next");
  const randomBtn = document.getElementById("quiz-random");
  const flipBtn = document.getElementById("quiz-flip");
  const markHardBtn = document.getElementById("quiz-mark-hard");
  const onlyHardBtn = document.getElementById("quiz-only-hard");

  let filtered = [...cards];
  let index = 0;
  let flipped = false;
  let onlyHard = false;
  let hardSet = loadHardSet();

  function loadHardSet() {
    try {
      const raw = localStorage.getItem(HARD_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveHardSet() {
    localStorage.setItem(HARD_KEY, JSON.stringify([...hardSet]));
  }

  function uniqueTopics(list) {
    return [...new Set(list.map((c) => c.topic))].sort((a, b) => a.localeCompare(b, "ru"));
  }

  function fillTopics() {
    const topics = uniqueTopics(cards);
    topicSelect.innerHTML = ['<option value="all">Все темы</option>']
      .concat(topics.map((t) => `<option value="${t}">${t}</option>`))
      .join("");
  }

  function updateModeButton() {
    if (onlyHard) {
      onlyHardBtn.textContent = "Режим: только сложные";
      onlyHardBtn.classList.add("toggle-active");
    } else {
      onlyHardBtn.textContent = "Режим: все карточки";
      onlyHardBtn.classList.remove("toggle-active");
    }
  }

  function updateHardButton() {
    const card = filtered[index];
    if (!card) {
      markHardBtn.textContent = "Отметить как сложную";
      return;
    }
    if (hardSet.has(card.id)) {
      markHardBtn.textContent = "Убрать из сложных";
      markHardBtn.classList.add("toggle-active");
    } else {
      markHardBtn.textContent = "Отметить как сложную";
      markHardBtn.classList.remove("toggle-active");
    }
  }

  function applyFilters(resetIndex = false) {
    const topic = topicSelect.value;
    const q = searchInput.value.trim().toLowerCase();

    filtered = cards.filter((c) => {
      const topicOk = topic === "all" || c.topic === topic;
      const text = `${c.front} ${c.back} ${c.topic}`.toLowerCase();
      const queryOk = !q || text.includes(q);
      const hardOk = !onlyHard || hardSet.has(c.id);
      return topicOk && queryOk && hardOk;
    });

    if (resetIndex || index >= filtered.length) index = 0;
    flipped = false;
    updateCount();
    renderCard();
  }

  function updateCount() {
    countEl.textContent = `Карточек: ${filtered.length} из ${cards.length}`;
    hardCountEl.textContent = `Сложных: ${hardSet.size}`;
  }

  function renderCard() {
    if (!filtered.length) {
      frontEl.textContent = onlyHard
        ? "В режиме 'только сложные' пока нет карточек."
        : "Ничего не найдено по текущим фильтрам.";
      backEl.textContent = onlyHard
        ? "Отметь хотя бы одну карточку как сложную."
        : "Попробуй очистить поиск или выбрать другую тему.";
      progressEl.textContent = "0 / 0";
      cardEl.classList.remove("flipped");
      updateHardButton();
      return;
    }

    const card = filtered[index];
    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    progressEl.textContent = `${index + 1} / ${filtered.length}`;
    cardEl.classList.toggle("flipped", flipped);
    updateHardButton();
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
    const card = filtered[index];
    if (!card) return;
    if (hardSet.has(card.id)) hardSet.delete(card.id);
    else hardSet.add(card.id);
    saveHardSet();
    applyFilters(false);
  }

  function toggleOnlyHardMode() {
    onlyHard = !onlyHard;
    updateModeButton();
    applyFilters(true);
  }

  topicSelect.addEventListener("change", () => applyFilters(true));
  searchInput.addEventListener("input", () => applyFilters(true));
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  randomBtn.addEventListener("click", randomCard);
  flipBtn.addEventListener("click", flip);
  cardEl.addEventListener("click", flip);
  markHardBtn.addEventListener("click", toggleHardForCurrent);
  onlyHardBtn.addEventListener("click", toggleOnlyHardMode);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === " ") {
      e.preventDefault();
      flip();
    }
  });

  fillTopics();
  updateModeButton();
  applyFilters(true);
})();
