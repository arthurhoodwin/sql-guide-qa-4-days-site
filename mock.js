(function () {
  const allCards = Array.isArray(window.QA_QUIZLETS) ? window.QA_QUIZLETS : [];

  const sqlTaskPool = [
    "Выведи топ-3 самых дорогих товара (product_name, price).",
    "Найди пользователей без заказов через LEFT JOIN.",
    "Посчитай сумму paid-заказов по каждому user_id и отсортируй по убыванию.",
    "Выведи второй по сумме заказ (order_id, total_amount).",
    "Найди заказы, где total_amount не равен сумме quantity*unit_price по order_items.",
    "Покажи уникальные категории товаров (без дублей).",
    "Выведи количество заказов по каждому статусу.",
    "Найди пользователей, у которых больше 2 заказов."
  ];

  const els = {
    mode: document.getElementById("mock-mode"),
    duration: document.getElementById("mock-duration"),
    timer: document.getElementById("mock-timer"),
    start: document.getElementById("mock-start"),
    pause: document.getElementById("mock-pause"),
    reset: document.getElementById("mock-reset"),
    progress: document.getElementById("mock-progress"),
    known: document.getElementById("mock-known"),
    repeat: document.getElementById("mock-repeat"),
    topic: document.getElementById("mock-topic"),
    front: document.getElementById("mock-front"),
    back: document.getElementById("mock-back"),
    answerWrap: document.getElementById("mock-answer-wrap"),
    showAnswer: document.getElementById("mock-show-answer"),
    knownBtn: document.getElementById("mock-known-btn"),
    repeatBtn: document.getElementById("mock-repeat-btn"),
    next: document.getElementById("mock-next"),
    sqlPanel: document.getElementById("mock-sql-panel"),
    sqlTask: document.getElementById("mock-sql-task"),
    sqlNext: document.getElementById("mock-sql-next"),
    summary: document.getElementById("mock-summary-text")
  };

  let filtered = [];
  let index = 0;
  let knownCount = 0;
  let repeatCount = 0;
  let interval = null;
  let remaining = 20 * 60;
  let answered = 0;

  function pickPoolByMode() {
    const mode = els.mode.value;
    if (mode === "sql") return allCards.filter((c) => c.topic === "SQL");
    if (mode === "theory") return allCards.filter((c) => c.topic !== "SQL");
    return allCards;
  }

  function resetSessionState() {
    filtered = pickPoolByMode();
    index = 0;
    knownCount = 0;
    repeatCount = 0;
    answered = 0;
    hideAnswer();
    updateStats();
    renderQuestion();
    toggleSqlPanel();
    nextSqlTask();
    updateSummary();
  }

  function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateTimer() {
    els.timer.textContent = formatTime(remaining);
  }

  function startTimer() {
    if (interval) return;
    interval = setInterval(() => {
      if (remaining <= 0) {
        stopTimer();
        return;
      }
      remaining -= 1;
      updateTimer();
      if (remaining === 0) {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    remaining = Number(els.duration.value) * 60;
    updateTimer();
  }

  function hideAnswer() {
    els.answerWrap.classList.remove("show");
  }

  function showAnswer() {
    els.answerWrap.classList.add("show");
  }

  function renderQuestion() {
    if (!filtered.length) {
      els.topic.textContent = "Нет карточек";
      els.front.textContent = "Для выбранного режима карточки не найдены.";
      els.back.textContent = "Проверь банк вопросов.";
      return;
    }
    const card = filtered[index];
    els.topic.textContent = card.topic;
    els.front.textContent = card.front;
    els.back.textContent = card.back;
    hideAnswer();
  }

  function updateStats() {
    const total = filtered.length;
    els.progress.textContent = `Вопрос ${Math.min(index + 1, total)} / ${total}`;
    els.known.textContent = `Знаю: ${knownCount}`;
    els.repeat.textContent = `Повторить: ${repeatCount}`;
  }

  function nextQuestion() {
    if (!filtered.length) return;
    index = (index + 1) % filtered.length;
    updateStats();
    renderQuestion();
  }

  function markKnown() {
    knownCount += 1;
    answered += 1;
    updateStats();
    updateSummary();
    nextQuestion();
  }

  function markRepeat() {
    repeatCount += 1;
    answered += 1;
    updateStats();
    updateSummary();
    nextQuestion();
  }

  function toggleSqlPanel() {
    const mode = els.mode.value;
    els.sqlPanel.style.display = mode === "theory" ? "none" : "grid";
  }

  function nextSqlTask() {
    const idx = Math.floor(Math.random() * sqlTaskPool.length);
    els.sqlTask.textContent = sqlTaskPool[idx];
  }

  function updateSummary() {
    const total = knownCount + repeatCount;
    if (!total) {
      els.summary.textContent = "Пока нет ответов. Сделай хотя бы 10 вопросов в режиме таймера.";
      return;
    }
    const hitRate = Math.round((knownCount / total) * 100);
    let advice = "Фокус на SQL и API контракты.";
    if (hitRate >= 80) advice = "Отличный темп. Дожми слабые темы из блока 'Повторить'.";
    if (hitRate >= 60 && hitRate < 80) advice = "Нормально. Сделай еще 2 прогона: theory + mixed.";
    if (hitRate < 60) advice = "Нужно добить базу: пройди теорию День 1-2 и квизлеты по темам с ошибками.";

    els.summary.textContent = `Отвечено: ${total}. Попадание: ${hitRate}%. Рекомендация: ${advice}`;
  }

  els.mode.addEventListener("change", () => {
    resetSessionState();
  });

  els.duration.addEventListener("change", () => {
    resetTimer();
  });

  els.start.addEventListener("click", startTimer);
  els.pause.addEventListener("click", stopTimer);
  els.reset.addEventListener("click", () => {
    resetTimer();
    resetSessionState();
  });

  els.showAnswer.addEventListener("click", showAnswer);
  els.knownBtn.addEventListener("click", markKnown);
  els.repeatBtn.addEventListener("click", markRepeat);
  els.next.addEventListener("click", nextQuestion);
  els.sqlNext.addEventListener("click", nextSqlTask);

  resetTimer();
  resetSessionState();
})();
