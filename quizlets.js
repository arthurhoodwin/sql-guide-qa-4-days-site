(function () {
  const cards = Array.isArray(window.QA_QUIZLETS) ? window.QA_QUIZLETS : [];
  const topicSelect = document.getElementById('quiz-topic');
  const searchInput = document.getElementById('quiz-search');
  const countEl = document.getElementById('quiz-count');
  const frontEl = document.getElementById('card-front');
  const backEl = document.getElementById('card-back');
  const cardEl = document.getElementById('quiz-card');
  const progressEl = document.getElementById('quiz-progress');
  const prevBtn = document.getElementById('quiz-prev');
  const nextBtn = document.getElementById('quiz-next');
  const randomBtn = document.getElementById('quiz-random');
  const flipBtn = document.getElementById('quiz-flip');

  let filtered = [...cards];
  let index = 0;
  let flipped = false;

  function uniqueTopics(list) {
    return [...new Set(list.map((c) => c.topic))].sort((a, b) => a.localeCompare(b, 'ru'));
  }

  function fillTopics() {
    const topics = uniqueTopics(cards);
    topicSelect.innerHTML = ['<option value="all">Все темы</option>']
      .concat(topics.map((t) => `<option value="${t}">${t}</option>`))
      .join('');
  }

  function applyFilters(resetIndex = false) {
    const topic = topicSelect.value;
    const q = searchInput.value.trim().toLowerCase();

    filtered = cards.filter((c) => {
      const topicOk = topic === 'all' || c.topic === topic;
      const text = `${c.front} ${c.back} ${c.topic}`.toLowerCase();
      const queryOk = !q || text.includes(q);
      return topicOk && queryOk;
    });

    if (resetIndex || index >= filtered.length) index = 0;
    flipped = false;
    updateCount();
    renderCard();
  }

  function updateCount() {
    countEl.textContent = `Карточек: ${filtered.length} из ${cards.length}`;
  }

  function renderCard() {
    if (!filtered.length) {
      frontEl.textContent = 'Ничего не найдено по текущим фильтрам.';
      backEl.textContent = 'Попробуй очистить поиск или выбрать другую тему.';
      progressEl.textContent = '0 / 0';
      cardEl.classList.remove('flipped');
      return;
    }

    const card = filtered[index];
    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    progressEl.textContent = `${index + 1} / ${filtered.length}`;
    cardEl.classList.toggle('flipped', flipped);
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
    cardEl.classList.toggle('flipped', flipped);
  }

  topicSelect.addEventListener('change', () => {
    applyFilters(true);
  });
  searchInput.addEventListener('input', () => applyFilters(true));
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  randomBtn.addEventListener('click', randomCard);
  flipBtn.addEventListener('click', flip);
  cardEl.addEventListener('click', flip);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === ' ') {
      e.preventDefault();
      flip();
    }
  });

  fillTopics();
  applyFilters();
})();
