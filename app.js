const STORAGE_KEY = "vk-qa-day-progress-v1";
const THEORY_QUIZ_STATE_KEY = "vk-qa-theory-quiz-state-v2";
const SQL_QUIZ_STATE_KEY = "vk-qa-sql-quiz-state-v1";
const SQL_TASK_STATE_KEY = "vk-qa-sql-task-state-v1";
const SQL_DRAFT_KEY = "vk-qa-sql-draft-v1";

const DAYS = [
  {
    id: 1,
    title: "День 1: База QA + SQL основы",
    subtitle: "Теория тестирования, тест-дизайн, SQL SELECT/WHERE"
  },
  {
    id: 2,
    title: "День 2: Процессы + API + SQL JOIN",
    subtitle: "SDLC/Agile, клиент-сервер, API, SQL JOIN/GROUP BY"
  },
  {
    id: 3,
    title: "День 3: Репетиция технички",
    subtitle: "Документация, mixed-вопросы, финальный SQL лайвкодинг"
  }
];

const TRACKS = [
  {
    id: "theory",
    label: "Теория",
    cardSubtitleByDay: {
      1: "Виды тестирования, тест-дизайн, risk-based подход",
      2: "SDLC/Agile, клиент-сервер, API, жизненный цикл",
      3: "Тестовая документация, баг-репорты, репетиция технички"
    }
  },
  {
    id: "sql",
    label: "SQL",
    cardSubtitleByDay: {
      1: "SELECT/WHERE/ORDER BY/LIMIT на базовых таблицах",
      2: "JOIN/GROUP BY/агрегации на интервью задачах",
      3: "Контрольные SQL задачи и лайвкодинг под собес"
    }
  }
];

const DAY_MAP = Object.fromEntries(DAYS.map((d) => [d.id, d]));
const TOTAL_MODULES = DAYS.length * TRACKS.length;

const QUIZ_BANK = {
  1: [
    {
      id: "d1_q1",
      question: "Чем retest отличается от regression?",
      options: [
        "Retest проверяет конкретный фикс, regression ищет побочные поломки",
        "Они полностью одинаковы",
        "Retest только авто, regression только ручной",
        "Retest делают только на проде"
      ],
      correct: 0,
      explain: "Retest = проверка исправления дефекта. Regression = проверка, что рядом ничего не сломалось."
    },
    {
      id: "d1_q2",
      question: "Для диапазона 1..100 какие значения критичны по BVA?",
      options: ["1, 100, 0, 101", "50, 51", "10, 20, 30", "2, 99"],
      correct: 0,
      explain: "Границы и соседние значения дают максимальный шанс найти дефект."
    },
    {
      id: "d1_q3",
      question: "Когда лучше использовать checklist, а не детальные test cases?",
      options: [
        "Когда нужны быстрые повторяемые проверки и низкая сложность сценариев",
        "Никогда",
        "Только для API",
        "Только для автоматизации"
      ],
      correct: 0,
      explain: "Checklist быстрее поддерживать, но он хуже для сложных ветвлений."
    },
    {
      id: "d1_q4",
      question: "Что обычно включает smoke после деплоя?",
      options: [
        "Проверку критических user flow и жизнеспособности системы",
        "Полный регресс",
        "Только UI анимации",
        "Только нагрузку"
      ],
      correct: 0,
      explain: "Smoke нужен, чтобы быстро понять: можно ли продолжать полноценное тестирование."
    },
    {
      id: "d1_q5",
      question: "Какое тестирование в первую очередь проверяет взаимодействие модулей?",
      options: ["Интеграционное", "Юзабилити", "Приемочное", "Нагрузочное"],
      correct: 0,
      explain: "Интеграционное фокусируется на стыках компонентов и обмене данными между ними."
    },
    {
      id: "d1_q6",
      question: "Что лучше сделать первым при очень маленьком окне на тестирование?",
      options: [
        "Риск-бейзд приоритизацию и проверку критического пути",
        "Запуск полного регресса без приоритетов",
        "Проверить только happy path UI",
        "Отложить тестирование"
      ],
      correct: 0,
      explain: "На техничке ждут, что QA умеет резать scope по рискам, а не случайно."
    },
    {
      id: "d1_q7",
      question: "Какая формулировка про severity и priority наиболее корректна?",
      options: [
        "Severity — влияние дефекта, Priority — срочность исправления",
        "Severity и Priority всегда одно и то же",
        "Priority задает только QA, Severity только PM",
        "Severity нужна только для UI-багов"
      ],
      correct: 0,
      explain: "Это базовая терминология, которую почти всегда спрашивают на интервью."
    },
    {
      id: "d1_q8",
      question: "State Transition Testing (тестирование переходов состояний) лучше всего подходит для...",
      options: [
        "Систем с явными статусами и переходами между ними",
        "Проверки орфографии в UI",
        "Только нагрузки",
        "Только SQL запросов"
      ],
      correct: 0,
      explain: "Техника полезна для сценариев заказа/платежа/workflow со статусами."
    },
    {
      id: "d1_q9",
      question: "Error Guessing (предугадывание ошибок) чаще всего основан на...",
      options: [
        "Опыте QA и типовых уязвимых местах системы",
        "Случайном выборе тестов",
        "Только официальной документации",
        "Только автотестах"
      ],
      correct: 0,
      explain: "Опыт помогает быстро находить зоны с высокой вероятностью дефектов."
    },
    {
      id: "d1_q10",
      question: "Какая приоритизация чаще всего верна при остром дедлайне?",
      options: [
        "Критический путь + высокорисковые зоны в первую очередь",
        "Случайный порядок тестов",
        "Только самые простые кейсы",
        "Только UI smoke"
      ],
      correct: 0,
      explain: "Risk-based подход снижает шанс пропустить критичный дефект."
    },
    {
      id: "d1_q11",
      question: "Какая техника тест-дизайна (test design technique — техника проектирования тестов) лучше подходит для большого числа комбинаций параметров?",
      options: [
        "Pairwise (попарное тестирование)",
        "Только random testing",
        "Только smoke",
        "Только exploratory"
      ],
      correct: 0,
      explain: "Pairwise уменьшает число кейсов и сохраняет приемлемое покрытие комбинаций."
    },
    {
      id: "d1_q12",
      question: "Что важнее всего проверить в acceptance criteria (критериях приемки) перед началом тестирования?",
      options: [
        "Измеримость и однозначность формулировок",
        "Только количество пунктов",
        "Только орфографию",
        "Только ссылку на макет"
      ],
      correct: 0,
      explain: "Неоднозначные критерии обычно приводят к спорным дефектам и потерям времени."
    }
  ],
  2: [
    {
      id: "d2_q1",
      question: "Какая разница между 401 и 403?",
      options: [
        "401 — не авторизован, 403 — авторизован, но нет прав",
        "401 и 403 это одно и то же",
        "401 — ошибка сервера, 403 — ошибка клиента",
        "403 бывает только у GET"
      ],
      correct: 0,
      explain: "Классический вопрос по API и auth."
    },
    {
      id: "d2_q2",
      question: "Что такое API-контракт для QA?",
      options: [
        "Согласованная структура запросов/ответов и правила поведения endpoint",
        "Только URL ручки",
        "Только SQL схема БД",
        "Только swagger-файл без логики"
      ],
      correct: 0,
      explain: "Контракт помогает валидировать формат, типы, обязательность полей и коды ответов."
    },
    {
      id: "d2_q3",
      question: "Что описывает Definition of Done?",
      options: [
        "Критерии завершенности задачи/инкремента",
        "Только acceptance criteria",
        "Список багов в спринте",
        "Роли команды"
      ],
      correct: 0,
      explain: "DoD — про общую готовность результата команды."
    },
    {
      id: "d2_q4",
      question: "Когда уместно просить риск-бейзд сужение покрытия?",
      options: [
        "Когда сроки жесткие и нужно явно зафиксировать компромисс по рискам",
        "Никогда",
        "Когда лень писать тесты",
        "Только после релиза"
      ],
      correct: 0,
      explain: "Важно не молча резать покрытие, а прозрачно коммуницировать риски."
    },
    {
      id: "d2_q5",
      question: "Какой HTTP-метод обычно используют для частичного обновления ресурса?",
      options: ["GET", "PATCH", "DELETE", "OPTIONS"],
      correct: 1,
      explain: "PATCH применяют для частичных изменений. PUT обычно трактуют как полную замену."
    },
    {
      id: "d2_q6",
      question: "Что полезнее всего проверить в негативном API-сценарии?",
      options: [
        "Код ошибки, тело ошибки и консистентность сообщения",
        "Только код 4xx/5xx",
        "Только время ответа",
        "Только запись в UI"
      ],
      correct: 0,
      explain: "На техничке важно показать, что ты проверяешь контракт ошибок, а не только статус-код."
    },
    {
      id: "d2_q7",
      question: "Что лучше описывает Scrum Daily?",
      options: [
        "Короткий синк по плану/блокерам, а не детальная техдискуссия",
        "Полноценный статус-репорт на 30-40 минут",
        "Демо для заказчика",
        "Ретроспектива по багам"
      ],
      correct: 0,
      explain: "Daily нужен для синхронизации команды и выявления блокеров."
    },
    {
      id: "d2_q8",
      question: "Что важно в API negative case (негативном сценарии)?",
      options: [
        "Проверить и код ошибки, и структуру/понятность error body",
        "Только HTTP статус",
        "Только время ответа",
        "Только то, что фронт показал алерт"
      ],
      correct: 0,
      explain: "Хороший API-тест валидирует диагностичность ошибки для клиента и поддержки."
    },
    {
      id: "d2_q9",
      question: "Когда уместно дополнительно проверять идемпотентность (idempotency — идемпотентность)?",
      options: [
        "Когда возможны повторные запросы/ретраи по сети",
        "Никогда",
        "Только для GET",
        "Только в проде"
      ],
      correct: 0,
      explain: "Особенно критично для create/payment-like операций."
    },
    {
      id: "d2_q10",
      question: "Что должен уметь QA объяснить про Agile (Аджайл) на техничке?",
      options: [
        "Как команда планирует, тестирует в спринте и управляет рисками качества",
        "Только названия церемоний",
        "Только роль scrum-мастера",
        "Только как писать автотесты"
      ],
      correct: 0,
      explain: "Интервьюеру важна практическая применимость процесса, а не теория ради теории."
    },
    {
      id: "d2_q11",
      question: "Что из перечисленного точнее всего описывает контрактное тестирование API (contract testing — контрактное тестирование)?",
      options: [
        "Проверка, что запросы/ответы соответствуют согласованной схеме и правилам",
        "Только проверка времени ответа",
        "Только проверка UI после API вызова",
        "Только проверка логов сервера"
      ],
      correct: 0,
      explain: "Контрактное тестирование снижает риск рассинхронизации между фронтом и бэком."
    },
    {
      id: "d2_q12",
      question: "Как лучше валидировать pagination (пагинацию) в API?",
      options: [
        "Проверить limit/offset, стабильность сортировки и отсутствие дублей между страницами",
        "Проверить только первую страницу",
        "Проверить только статус 200",
        "Проверить только UI-таблицу"
      ],
      correct: 0,
      explain: "Типовая ошибка пагинации проявляется при переходах между страницами и сортировке."
    }
  ],
  3: [
    {
      id: "d3_q1",
      question: "Что должно быть в хорошем bug report?",
      options: [
        "Шаги, окружение, expected/actual, severity/priority, вложения",
        "Только заголовок",
        "Только скрин",
        "Только ссылку на таску"
      ],
      correct: 0,
      explain: "Цель баг-репорта — быстрое воспроизведение и корректный приоритет фикса."
    },
    {
      id: "d3_q2",
      question: "Лучшая структура устного ответа на техничке?",
      options: [
        "Определение → применение → пример → риски/trade-off",
        "Сразу длинная история без структуры",
        "Только термин",
        "Только пример"
      ],
      correct: 0,
      explain: "Структурные ответы сильно повышают впечатление от кандидата."
    },
    {
      id: "d3_q3",
      question: "Если не уверен в ответе, как лучше?",
      options: [
        "Честно обозначить неопределенность и предложить аргументированную гипотезу",
        "Уверенно выдумывать",
        "Молчать",
        "Сменить тему"
      ],
      correct: 0,
      explain: "На техничке ценят мышление и прозрачность."
    },
    {
      id: "d3_q4",
      question: "RTM нужен прежде всего для...",
      options: [
        "Трассировки требований в тесты и контроля coverage",
        "Подсчета velocity",
        "Логирования API",
        "Планирования отпусков"
      ],
      correct: 0,
      explain: "RTM помогает обнаружить непокрытые требования до релиза."
    },
    {
      id: "d3_q5",
      question: "Какая структура шага в bug report самая рабочая?",
      options: [
        "Пронумерованные шаги + конкретные входные данные + expected/actual",
        "Свободный текст без структуры",
        "Только видео и скрин",
        "Только stack trace"
      ],
      correct: 0,
      explain: "Воспроизводимость — ключ к быстрому и качественному исправлению."
    },
    {
      id: "d3_q6",
      question: "Что важно делать во время SQL лайвкодинга на интервью?",
      options: [
        "Озвучивать ход мысли и валидировать промежуточный результат",
        "Писать молча и быстро",
        "Сразу решать через сложные подзапросы",
        "Избегать уточнений требований"
      ],
      correct: 0,
      explain: "Интервьюер оценивает не только результат, но и процесс инженерного мышления."
    },
    {
      id: "d3_q7",
      question: "Если вопрос сформулирован неоднозначно, лучшее действие?",
      options: [
        "Уточнить допущения и продолжить решение явно проговорив их",
        "Сделать случайный выбор и молчать",
        "Сказать, что задача плохая",
        "Перескочить к следующему вопросу"
      ],
      correct: 0,
      explain: "Уточнение требований — сильный сигнал зрелого QA-подхода."
    },
    {
      id: "d3_q8",
      question: "Что наиболее важно в шаге воспроизведения (steps to reproduce — шаги воспроизведения)?",
      options: [
        "Достаточная точность, чтобы другой человек стабильно получил тот же результат",
        "Короткость любой ценой",
        "Только один скрин вместо шагов",
        "Описание без тестовых данных"
      ],
      correct: 0,
      explain: "Без воспроизводимости баг-репорт теряет ценность для разработки."
    },
    {
      id: "d3_q9",
      question: "Почему на SQL-лайвкодинге важно проговаривать ход мысли?",
      options: [
        "Потому что оценивают не только результат, но и инженерный процесс",
        "Чтобы выиграть время",
        "Это не важно",
        "Только чтобы попросить подсказку"
      ],
      correct: 0,
      explain: "Прозрачное рассуждение повышает оценку даже при неидеальном финальном ответе."
    },
    {
      id: "d3_q10",
      question: "Что из этого лучше всего показывает зрелость QA на финальном этапе подготовки?",
      options: [
        "Умение объяснить компромиссы coverage/сроки и дать риск-прогноз",
        "Знать наизусть определения без примеров",
        "Сделать только красивые заметки",
        "Решать только легкие SQL задачи"
      ],
      correct: 0,
      explain: "Для технички важно мышление о рисках и коммуникация, а не только теория."
    },
    {
      id: "d3_q11",
      question: "Какой ответ на вопрос про severity/priority на собесе считается сильным?",
      options: [
        "С примерами, когда severity высокая, а priority может быть ниже, и наоборот",
        "Просто сказать, что это одно и то же",
        "Сказать, что эти поля не нужны",
        "Обсудить только UI баги"
      ],
      correct: 0,
      explain: "Интервьюеры ждут практику, а не заученное определение без контекста."
    },
    {
      id: "d3_q12",
      question: "Что лучше всего сделать, если на лайвкодинге SQL запрос не работает с первого раза?",
      options: [
        "Проверить синтаксис по шагам, сузить выборку и проговорить, что исправляешь",
        "Сразу переписать всё с нуля молча",
        "Прекратить попытки",
        "Сказать, что задача некорректная"
      ],
      correct: 0,
      explain: "Спокойная отладка и прозрачность мышления на интервью ценятся выше скорости."
    }
  ]
};

const SQL_QUIZ_BANK = {
  1: [
    {
      id: "sd1_q1",
      question: "Какой запрос корректно выбирает все колонки из таблицы products?",
      options: ["SELECT * FROM products;", "GET ALL FROM products;", "SHOW products *;", "SELECT products;"],
      correct: 0,
      explain: "В SQL стандартный синтаксис выборки: SELECT <columns> FROM <table>."
    },
    {
      id: "sd1_q2",
      question: "Что делает WHERE в запросе?",
      options: [
        "Фильтрует строки по условию",
        "Сортирует строки",
        "Группирует строки",
        "Удаляет таблицу"
      ],
      correct: 0,
      explain: "WHERE определяет предикат отбора строк до группировки/сортировки."
    },
    {
      id: "sd1_q3",
      question: "Чем `ORDER BY price DESC` отличается от `ORDER BY price ASC`?",
      options: [
        "DESC сортирует по убыванию, ASC по возрастанию",
        "DESC работает только с числами",
        "ASC и DESC одинаковы",
        "DESC сортирует только текст"
      ],
      correct: 0,
      explain: "DESC = от большего к меньшему, ASC = от меньшего к большему."
    },
    {
      id: "sd1_q4",
      question: "Как ограничить результат первыми 5 строками в SQLite?",
      options: ["LIMIT 5", "TOP 5", "ROWNUM 5", "TAKE 5"],
      correct: 0,
      explain: "Для SQLite и Postgres используется LIMIT."
    },
    {
      id: "sd1_q5",
      question: "Что возвращает COUNT(*)?",
      options: [
        "Количество строк в выборке",
        "Сумму значений первого столбца",
        "Количество таблиц в БД",
        "Количество уникальных значений"
      ],
      correct: 0,
      explain: "COUNT(*) считает все строки результата."
    },
    {
      id: "sd1_q6",
      question: "Как записывается проверка на NULL?",
      options: ["IS NULL", "= NULL", "== NULL", "IN NULL"],
      correct: 0,
      explain: "NULL сравнивается через IS NULL / IS NOT NULL."
    },
    {
      id: "sd1_q7",
      question: "Для чего нужен DISTINCT?",
      options: [
        "Убирает дубликаты строк/значений",
        "Переименовывает колонки",
        "Удаляет данные из таблицы",
        "Объединяет таблицы"
      ],
      correct: 0,
      explain: "DISTINCT оставляет только уникальные комбинации выбранных колонок."
    },
    {
      id: "sd1_q8",
      question: "Какая часть запроса обычно выполняется раньше логически: WHERE или ORDER BY?",
      options: ["WHERE", "ORDER BY", "Они одновременно", "Сначала LIMIT"],
      correct: 0,
      explain: "Сначала фильтрация WHERE, потом сортировка ORDER BY."
    }
  ],
  2: [
    {
      id: "sd2_q1",
      question: "Что делает INNER JOIN?",
      options: [
        "Возвращает только совпавшие строки из обеих таблиц",
        "Возвращает все строки из левой таблицы",
        "Возвращает все строки из правой таблицы",
        "Удаляет несовпавшие строки физически"
      ],
      correct: 0,
      explain: "INNER JOIN оставляет только строки с совпадением по условию ON."
    },
    {
      id: "sd2_q2",
      question: "Для поиска записей без пары в правой таблице чаще используют...",
      options: [
        "LEFT JOIN + WHERE right_col IS NULL",
        "INNER JOIN + WHERE right_col IS NULL",
        "UNION",
        "TRUNCATE"
      ],
      correct: 0,
      explain: "Классический анти-join: LEFT JOIN + фильтрация NULL справа."
    },
    {
      id: "sd2_q3",
      question: "Когда нужен GROUP BY?",
      options: [
        "Когда рассчитываются агрегаты по группам",
        "Только при сортировке",
        "Только при удалении дублей",
        "Он обязателен в каждом SELECT"
      ],
      correct: 0,
      explain: "GROUP BY нужен для агрегаций на уровне групп."
    },
    {
      id: "sd2_q4",
      question: "Где правильно фильтровать агрегаты?",
      options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
      correct: 0,
      explain: "WHERE работает до агрегации, HAVING после агрегации."
    },
    {
      id: "sd2_q5",
      question: "Как посчитать число заказов на пользователя?",
      options: [
        "GROUP BY user_id + COUNT(*)",
        "ORDER BY user_id + SUM(*)",
        "WHERE user_id + COUNT",
        "LIMIT 1"
      ],
      correct: 0,
      explain: "Базовый паттерн: SELECT user_id, COUNT(*) FROM ... GROUP BY user_id."
    },
    {
      id: "sd2_q6",
      question: "Что лучше для читаемости сложного запроса?",
      options: [
        "Алиасы таблиц и понятные имена вычисляемых полей",
        "Запрос в одну строку без отступов",
        "Минимум пробелов",
        "Только подзапросы без JOIN"
      ],
      correct: 0,
      explain: "На лайвкодинге читаемость = быстрее отладка и легче объяснение."
    },
    {
      id: "sd2_q7",
      question: "В чем типичная ошибка при JOIN?",
      options: [
        "Неполное условие ON, которое создает лишние дубли",
        "Использование SELECT",
        "Применение ORDER BY",
        "Наличие LIMIT"
      ],
      correct: 0,
      explain: "Если ON задан неверно, количество строк может резко вырасти."
    },
    {
      id: "sd2_q8",
      question: "Как правильно отсортировать пользователей по общей сумме оплат по убыванию?",
      options: [
        "ORDER BY total_paid DESC",
        "ORDER BY total_paid ASC",
        "WHERE total_paid DESC",
        "HAVING total_paid DESC"
      ],
      correct: 0,
      explain: "Сортировка по агрегату обычно идет после вычисления алиаса."
    }
  ],
  3: [
    {
      id: "sd3_q1",
      question: "Что делать первым делом на SQL лайвкодинге, если условие не до конца ясно?",
      options: [
        "Уточнить допущения и проговорить трактовку задачи",
        "Сразу писать длинный запрос",
        "Отказаться решать",
        "Спросить правильный ответ"
      ],
      correct: 0,
      explain: "Уточнение допущений показывает зрелый инженерный подход."
    },
    {
      id: "sd3_q2",
      question: "Как чаще всего находят n-й максимум без оконных функций?",
      options: [
        "ORDER BY DESC + LIMIT 1 OFFSET n-1",
        "WHERE MAX() = n",
        "GROUP BY без агрегатов",
        "JOIN таблицы сама на себя без условий"
      ],
      correct: 0,
      explain: "Для простых задач LIMIT/OFFSET обычно достаточно."
    },
    {
      id: "sd3_q3",
      question: "Как проверить, что total заказа совпадает с суммой items?",
      options: [
        "Сгруппировать items по order_id и сравнить агрегат с total",
        "Проверить только одну строку вручную",
        "Сделать SELECT * без условий",
        "Использовать только ORDER BY"
      ],
      correct: 0,
      explain: "Это классическая задача на data quality/consistency."
    },
    {
      id: "sd3_q4",
      question: "Что лучше на интервью: идеальный, но необъяснимый запрос или чуть проще, но с ясной логикой?",
      options: [
        "Чуть проще, но полностью объяснимый",
        "Необъяснимый, но длинный",
        "Любой, если много строк",
        "Только с CTE"
      ],
      correct: 0,
      explain: "Интервью оценивает прозрачность мышления, не только финальный текст SQL."
    },
    {
      id: "sd3_q5",
      question: "Как безопасно отлаживать запрос с ошибкой?",
      options: [
        "Разбить на этапы: FROM/JOIN, затем WHERE, затем агрегаты и сортировку",
        "Сразу переписать с нуля",
        "Менять все части одновременно",
        "Удалить WHERE и оставить как есть"
      ],
      correct: 0,
      explain: "Пошаговая отладка резко ускоряет поиск причины ошибки."
    },
    {
      id: "sd3_q6",
      question: "Почему полезно проверять количество строк после JOIN?",
      options: [
        "Чтобы заметить неожиданные дубли/потери данных",
        "Это не нужно",
        "Только для больших БД",
        "Только при UPDATE"
      ],
      correct: 0,
      explain: "Контроль кардинальности защищает от логических ошибок в отчете."
    },
    {
      id: "sd3_q7",
      question: "Как обычно задают алиас вычисляемому полю?",
      options: ["AS alias_name", "TO alias_name", "ALIAS alias_name", "NAME alias_name"],
      correct: 0,
      explain: "Стандарт: SUM(amount) AS total_amount."
    },
    {
      id: "sd3_q8",
      question: "Что из этого верно про SQL собеседование QA?",
      options: [
        "Чаще спрашивают базовые запросы и логику проверки данных, а не сложные оптимизации",
        "Всегда дают только оконные функции и рекурсию",
        "SQL не спрашивают у QA вообще",
        "Нужно знать только синтаксис CREATE TABLE"
      ],
      correct: 0,
      explain: "Обычно это практичные задачи на выборку, join и проверку консистентности."
    }
  ]
};

const SQL_SEEDS = {
  1: `
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
      (2, 'Samsung S23', 'Электроника', 69990, 20),
      (3, 'Ноутбук ASUS', 'Электроника', 54990, 8),
      (4, 'Наушники Sony', 'Аксессуары', 5990, 50),
      (5, 'Мышь Razer', 'Периферия', 2999, 40),
      (6, 'Веб-камера', 'Периферия', 4999, 25);
  `,
  2: `
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
  `,
  3: `
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
    INSERT INTO orders (order_id, total_amount) VALUES
      (1, 51000),
      (2, 30000),
      (3, 5000),
      (4, 4500);
    INSERT INTO order_items (item_id, order_id, quantity, unit_price) VALUES
      (1, 1, 1, 50000),
      (2, 1, 1, 1000),
      (3, 2, 1, 30000),
      (4, 3, 1, 5000),
      (5, 4, 1, 3000),
      (6, 4, 1, 1000);
  `
};

const SQL_TASKS = {
  1: [
    {
      id: "d1_t1",
      title: "SELECT + WHERE",
      prompt: "Выведи product_name и price только для товаров дороже 10000.",
      starter: "SELECT product_name, price\nFROM products\nWHERE price > 0;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается непустой SELECT-результат." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (idx < 0) return { ok: false, message: "В результате должна быть колонка price." };
        const ok = lastResult.values.every((r) => Number(r[idx]) > 10000);
        return ok ? { ok: true, message: "Отлично: фильтрация корректная." } : { ok: false, message: "Есть строки с price <= 10000." };
      }
    },
    {
      id: "d1_t2",
      title: "ORDER BY + LIMIT",
      prompt: "Покажи топ-2 самых дорогих товара (по убыванию цены).",
      starter: "SELECT product_name, price\nFROM products\nORDER BY price ASC\nLIMIT 2;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length !== 2) return { ok: false, message: "Нужно ровно 2 строки." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase() === "price");
        if (idx < 0) return { ok: false, message: "Нужна колонка price." };
        const arr = lastResult.values.map((r) => Number(r[idx]));
        const sorted = [...arr].sort((a, b) => b - a);
        const ok = arr.every((v, i) => v === sorted[i]);
        return ok ? { ok: true, message: "Супер: сортировка и лимит корректны." } : { ok: false, message: "Проверь ORDER BY price DESC." };
      }
    }
  ],
  2: [
    {
      id: "d2_t1",
      title: "LEFT JOIN: пользователи без заказов",
      prompt: "Найди пользователей, у которых нет заказов.",
      starter: "SELECT u.user_id, u.username\nFROM users u\nLEFT JOIN orders o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL;",
      validate: ({ db, lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается минимум один пользователь." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("user_id"));
        if (idx < 0) return { ok: false, message: "Нужна колонка user_id в результате." };
        const actual = [...new Set(lastResult.values.map((r) => Number(r[idx])))].sort((a, b) => a - b);
        const expRaw = db.exec("SELECT user_id FROM users WHERE user_id NOT IN (SELECT DISTINCT user_id FROM orders) ORDER BY user_id;");
        const expected = expRaw.length ? expRaw[0].values.map((r) => Number(r[0])) : [];
        const ok = actual.length === expected.length && actual.every((v, i) => v === expected[i]);
        return ok ? { ok: true, message: "Верно: пользователи без заказов найдены." } : { ok: false, message: "Проверь логику JOIN/IS NULL." };
      }
    },
    {
      id: "d2_t2",
      title: "GROUP BY: сумма paid заказов",
      prompt: "Выведи user_id и total_paid по статусу paid, отсортируй по total_paid убыванию.",
      starter: "SELECT user_id, SUM(amount) AS total_paid\nFROM orders\nWHERE status = 'paid'\nGROUP BY user_id\nORDER BY total_paid ASC;",
      validate: ({ lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается непустой результат." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("total"));
        if (idx < 0) return { ok: false, message: "Нужна колонка total_paid." };
        const arr = lastResult.values.map((r) => Number(r[idx]));
        const sorted = [...arr].sort((a, b) => b - a);
        const ok = arr.every((v, i) => v === sorted[i]);
        return ok ? { ok: true, message: "Отлично: агрегация и сортировка верны." } : { ok: false, message: "Проверь ORDER BY total_paid DESC." };
      }
    }
  ],
  3: [
    {
      id: "d3_t1",
      title: "Проверка целостности totals",
      prompt: "Найди заказы, где total_amount не совпадает с суммой order_items.",
      starter: "SELECT o.order_id, o.total_amount, SUM(oi.quantity * oi.unit_price) AS calc_total\nFROM orders o\nLEFT JOIN order_items oi ON o.order_id = oi.order_id\nGROUP BY o.order_id;",
      validate: ({ db, lastResult }) => {
        if (!lastResult || !lastResult.values.length) return { ok: false, message: "Ожидается непустой результат." };
        const idx = lastResult.columns.findIndex((c) => c.toLowerCase().includes("order_id"));
        if (idx < 0) return { ok: false, message: "Нужна колонка order_id." };
        const actual = [...new Set(lastResult.values.map((r) => Number(r[idx])))].sort((a, b) => a - b);
        const expRaw = db.exec(`
          SELECT o.order_id
          FROM orders o
          LEFT JOIN order_items oi ON o.order_id = oi.order_id
          GROUP BY o.order_id
          HAVING ABS(o.total_amount - SUM(oi.quantity * oi.unit_price)) > 0.01
          ORDER BY o.order_id;
        `);
        const expected = expRaw.length ? expRaw[0].values.map((r) => Number(r[0])) : [];
        const ok = actual.length === expected.length && actual.every((v, i) => v === expected[i]);
        return ok ? { ok: true, message: "Верно: аномальные заказы найдены." } : { ok: false, message: "Нужен HAVING по расхождению сумм." };
      }
    },
    {
      id: "d3_t2",
      title: "N-й максимум",
      prompt: "Выведи второй по сумме заказ (order_id, total_amount).",
      starter: "SELECT order_id, total_amount\nFROM orders\nORDER BY total_amount DESC\nLIMIT 1 OFFSET 0;",
      validate: ({ lastResult }) => {
        if (!lastResult || lastResult.values.length !== 1) return { ok: false, message: "Ожидается ровно 1 строка." };
        const idxOrder = lastResult.columns.findIndex((c) => c.toLowerCase().includes("order_id"));
        const idxAmount = lastResult.columns.findIndex((c) => c.toLowerCase().includes("total_amount"));
        if (idxOrder < 0 || idxAmount < 0) return { ok: false, message: "Нужны order_id и total_amount." };
        const orderId = Number(lastResult.values[0][idxOrder]);
        const amount = Number(lastResult.values[0][idxAmount]);
        if (orderId === 2 && amount === 30000) return { ok: true, message: "Отлично: второй максимум найден." };
        return { ok: false, message: "Проверь OFFSET для второго места." };
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

function moduleKey(trackId, dayId) {
  return `${trackId}-${dayId}`;
}

function getTrack(trackId) {
  return TRACKS.find((track) => track.id === trackId) || TRACKS[0];
}

function loadProgress() {
  const data = loadJson(STORAGE_KEY, {});
  const p = {};
  DAYS.forEach((d) => {
    TRACKS.forEach((track) => {
      const key = moduleKey(track.id, d.id);
      // Legacy migration: old format stored one shared status by day id.
      p[key] = Boolean(data[key] ?? data[d.id]);
    });
  });
  return p;
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

function setModuleCompleted(dayId, trackId, toggleBtn) {
  const p = loadProgress();
  p[moduleKey(trackId, dayId)] = true;
  saveProgress(p);
  if (toggleBtn) {
    const track = getTrack(trackId);
    toggleBtn.textContent = `Убрать отметку (${track.label})`;
  }
}

function buildDayCard(day, track, progress) {
  const key = moduleKey(track.id, day.id);
  const done = Boolean(progress[key]);
  const subtitle = track.cardSubtitleByDay[day.id] || day.subtitle;
  const link = `day${day.id}.html?view=${track.id}`;
  return `
    <article class="panel day-card">
      <div class="day-badge">День ${day.id}</div>
      <h3 class="day-title">День ${day.id}: ${escapeHtml(track.label)}</h3>
      <p class="day-sub">${escapeHtml(subtitle)}</p>
      <div class="day-actions">
        <a class="btn primary" href="${link}">Открыть</a>
        <button class="btn ghost" data-module-toggle="${escapeHtml(key)}" type="button">${done ? "Сбросить" : "Готово"}</button>
        <span class="status">${done ? "Пройдено" : "В процессе"}</span>
      </div>
    </article>`;
}

function renderIndex() {
  const progress = loadProgress();
  const theoryGrid = document.getElementById("theory-grid");
  const sqlGrid = document.getElementById("sql-grid");
  const done = Object.values(progress).filter(Boolean).length;
  const theoryTrack = getTrack("theory");
  const sqlTrack = getTrack("sql");

  theoryGrid.innerHTML = DAYS.map((d) => buildDayCard(d, theoryTrack, progress)).join("");
  sqlGrid.innerHTML = DAYS.map((d) => buildDayCard(d, sqlTrack, progress)).join("");

  const text = document.getElementById("overall-progress");
  const fill = document.getElementById("progress-fill");
  text.textContent = `${done} из ${TOTAL_MODULES} модулей отмечено как пройдено`;
  fill.style.width = `${(done / TOTAL_MODULES) * 100}%`;

  document.querySelectorAll("[data-module-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-module-toggle");
      progress[key] = !progress[key];
      saveProgress(progress);
      renderIndex();
    });
  });
}

function buildDayPagination(dayId, view = "theory") {
  const wrap = document.getElementById("day-nav");
  const index = DAYS.findIndex((d) => d.id === dayId);
  const prev = index > 0 ? DAYS[index - 1] : null;
  const next = index < DAYS.length - 1 ? DAYS[index + 1] : null;
  const suffix = `?view=${view === "sql" ? "sql" : "theory"}`;
  wrap.innerHTML = `${prev ? `<a class="btn ghost" href="day${prev.id}.html${suffix}">← День ${prev.id}</a>` : "<span></span>"}${next ? `<a class="btn primary" href="day${next.id}.html${suffix}">День ${next.id} →</a>` : `<a class="btn primary" href="index.html">К модулям</a>`}`;
}

function renderMarkdown(contentEl, tocEl, markdownText) {
  marked.setOptions({ gfm: true, breaks: false });
  contentEl.innerHTML = marked.parse(markdownText);
  const headers = contentEl.querySelectorAll("h2, h3");
  tocEl.innerHTML = "";
  headers.forEach((header) => {
    const id = slugify(header.textContent || "section") || `section-${Math.random().toString(36).slice(2, 8)}`;
    header.id = id;
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = header.textContent || "Раздел";
    tocEl.appendChild(link);
  });
  if (!headers.length) tocEl.innerHTML = "<p>Разделы не найдены</p>";
}

function getQuizStats(dayId, bank, stateKey) {
  const questions = bank[dayId] || [];
  const state = loadJson(stateKey, {});
  const answers = state[String(dayId)] || {};
  let answered = 0;
  let correct = 0;
  questions.forEach((q) => {
    const pick = answers[q.id];
    if (typeof pick === "number") {
      answered += 1;
      if (pick === q.correct) correct += 1;
    }
  });
  return { total: questions.length, answered, correct };
}

function getSqlTaskStats(dayId) {
  const tasks = SQL_TASKS[dayId] || [];
  const state = loadJson(SQL_TASK_STATE_KEY, {});
  const solvedState = state[String(dayId)] || {};
  const solved = tasks.filter((t) => Boolean(solvedState[t.id])).length;
  return { total: tasks.length, solved };
}

function renderQuizInto(dayId, container, options) {
  const { bank, stateKey, title, onProgress } = options;
  const questions = bank[dayId] || [];
  const allState = loadJson(stateKey, {});
  if (!allState[String(dayId)]) allState[String(dayId)] = {};

  function draw() {
    const answers = allState[String(dayId)];
    const stats = getQuizStats(dayId, bank, stateKey);

    container.innerHTML = `
      <div class="quiz-summary panel">
        <strong>${escapeHtml(title)}: ${stats.correct}/${stats.total} верно</strong>
        <span>Отвечено: ${stats.answered}/${stats.total}</span>
      </div>
      ${questions.map((q, idx) => {
        const selected = answers[q.id];
        const isAnswered = typeof selected === "number";
        const isCorrect = isAnswered && selected === q.correct;
        const cls = isAnswered ? (isCorrect ? "ok" : "fail") : "";
        return `
          <section class="panel quiz-card ${cls}">
            <h3>${idx + 1}. ${escapeHtml(q.question)}</h3>
            <div class="quiz-options">
              ${q.options.map((opt, i) => `<button class="quiz-option ${selected === i ? "active" : ""}" data-qid="${q.id}" data-opt="${i}" type="button">${escapeHtml(opt)}</button>`).join("")}
            </div>
            ${isAnswered ? `<p class="quiz-explain ${isCorrect ? "ok" : "fail"}">${escapeHtml(q.explain)}</p>` : ""}
          </section>
        `;
      }).join("")}
    `;

    container.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-qid");
        const opt = Number(btn.getAttribute("data-opt"));
        allState[String(dayId)][qid] = opt;
        saveJson(stateKey, allState);
        draw();
        onProgress();
      });
    });
  }

  draw();
}

async function getSqlJs() {
  if (!sqlJsPromise) {
    sqlJsPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlJsPromise;
}

async function buildDb(dayId) {
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  db.run(SQL_SEEDS[dayId] || "");
  return db;
}

async function cloneDb(sourceDb) {
  const SQL = await getSqlJs();
  return new SQL.Database(sourceDb.export());
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
        <tbody>
          ${rows.length ? rows.map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderSchema(db, host) {
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  if (!tables.length || !tables[0].values.length) {
    host.innerHTML = "<p class='sql-message'>Таблиц не найдено.</p>";
    return;
  }
  const names = tables[0].values.map((r) => String(r[0]));
  const blocks = names.map((tableName) => {
    const info = db.exec(`PRAGMA table_info(${tableName});`);
    const rows = info.length ? info[0].values : [];
    return `
      <h4>${escapeHtml(tableName)}</h4>
      <table class="result-table">
        <thead><tr><th>column</th><th>type</th><th>constraints</th><th>key</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td>${Number(r[3]) ? "NOT NULL" : ""}</td><td>${Number(r[5]) ? "PK" : ""}</td></tr>`).join("")}</tbody>
      </table>
    `;
  }).join("");
  host.innerHTML = `<p class='sql-message'>Схема текущей учебной БД</p>${blocks}`;
}

async function renderSqlInto(dayId, container, onProgress) {
  const tasks = SQL_TASKS[dayId] || [];
  const allState = loadJson(SQL_TASK_STATE_KEY, {});
  const allDrafts = loadJson(SQL_DRAFT_KEY, {});
  if (!allState[String(dayId)]) allState[String(dayId)] = {};
  if (!allDrafts[String(dayId)]) allDrafts[String(dayId)] = {};

  let active = 0;
  let db = await buildDb(dayId);

  container.innerHTML = `
    <div class="sql-shell">
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
          <button class="btn ghost" id="show-schema" type="button">Схема БД</button>
          <button class="btn ghost" id="reset-db" type="button">Сброс БД</button>
        </div>
        <div id="check-status" class="check-status"></div>
        <div id="sql-result" class="sql-result"></div>
      </section>
    </div>
  `;

  const list = container.querySelector("#task-list");
  const title = container.querySelector("#task-title");
  const prompt = container.querySelector("#task-prompt");
  const progressEl = container.querySelector("#task-progress");
  const input = container.querySelector("#sql-input");
  const runBtn = container.querySelector("#run-sql");
  const checkBtn = container.querySelector("#check-sql");
  const schemaBtn = container.querySelector("#show-schema");
  const resetBtn = container.querySelector("#reset-db");
  const status = container.querySelector("#check-status");
  const result = container.querySelector("#sql-result");

  function redrawTaskList() {
    list.innerHTML = tasks.map((task, index) => {
      const solved = Boolean(allState[String(dayId)][task.id]);
      return `<button class="task-btn ${index === active ? "active" : ""}" data-task="${index}" type="button"><span>${escapeHtml(task.title)}</span><strong>${solved ? "✓" : "•"}</strong></button>`;
    }).join("");

    list.querySelectorAll("[data-task]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = Number(btn.getAttribute("data-task"));
        loadTask();
      });
    });
  }

  function updateProgressText() {
    const solved = tasks.filter((t) => Boolean(allState[String(dayId)][t.id])).length;
    progressEl.textContent = `SQL-прогресс: ${solved}/${tasks.length}`;
  }

  function loadTask() {
    const task = tasks[active];
    title.textContent = task.title;
    prompt.textContent = task.prompt;
    input.value = allDrafts[String(dayId)][task.id] || task.starter;
    status.textContent = "";
    status.className = "check-status";
    result.innerHTML = "";
    redrawTaskList();
    updateProgressText();
  }

  input.addEventListener("input", () => {
    const task = tasks[active];
    allDrafts[String(dayId)][task.id] = input.value;
    saveJson(SQL_DRAFT_KEY, allDrafts);
  });

  runBtn.addEventListener("click", () => {
    try {
      const runData = runSql(db, input.value);
      renderSqlResult(result, runData);
      status.className = "check-status";
      status.textContent = "SQL выполнен в учебной БД.";
    } catch (error) {
      result.innerHTML = "";
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${error.message}`;
    }
  });

  checkBtn.addEventListener("click", async () => {
    const task = tasks[active];
    let checkDb = null;
    try {
      checkDb = await cloneDb(db);
      const runData = runSql(checkDb, input.value);
      renderSqlResult(result, runData);
      const verdict = task.validate({ db: checkDb, lastResult: runData.lastResult });
      if (verdict.ok) {
        allState[String(dayId)][task.id] = true;
        saveJson(SQL_TASK_STATE_KEY, allState);
        status.className = "check-status ok";
        status.textContent = verdict.message;
      } else {
        status.className = "check-status fail";
        status.textContent = verdict.message;
      }
      redrawTaskList();
      updateProgressText();
      onProgress();
    } catch (error) {
      result.innerHTML = "";
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${error.message}`;
    } finally {
      if (checkDb) checkDb.close();
    }
  });

  schemaBtn.addEventListener("click", () => {
    try {
      renderSchema(db, result);
      status.className = "check-status";
      status.textContent = "";
    } catch (error) {
      status.className = "check-status fail";
      status.textContent = `Ошибка: ${error.message}`;
    }
  });

  resetBtn.addEventListener("click", async () => {
    db.close();
    db = await buildDb(dayId);
    result.innerHTML = "";
    status.className = "check-status";
    status.textContent = "База дня сброшена.";
  });

  loadTask();
}

function contentPath(trackId, dayId) {
  const safeTrack = trackId === "sql" ? "sql" : "theory";
  return `content/${safeTrack}-day${dayId}.md`;
}

async function renderTheoryPractice(dayId, toggleBtn) {
  const panel = document.getElementById("practice-panel");
  panel.innerHTML = `
    <div class="practice-cockpit">
      <div class="cockpit-head">
        <div>
          <p class="eyebrow">Практический тренажер</p>
          <h2>Теория: День ${dayId}</h2>
        </div>
        <div class="cockpit-chips" id="cockpit-chips"></div>
      </div>
      <section class="practice-view active" id="theory-quiz-view"></section>
    </div>
  `;

  const chips = panel.querySelector("#cockpit-chips");
  const quizView = panel.querySelector("#theory-quiz-view");

  const refresh = () => {
    const stats = getQuizStats(dayId, QUIZ_BANK, THEORY_QUIZ_STATE_KEY);

    chips.innerHTML = `
      <span class="chip">Квиз: ${stats.correct}/${stats.total}</span>
      <span class="chip ${stats.correct === stats.total ? "chip-ok" : ""}">Статус: ${stats.correct === stats.total ? "Готов" : "В процессе"}</span>
    `;

    if (stats.total > 0 && stats.correct === stats.total) setModuleCompleted(dayId, "theory", toggleBtn);
  };

  renderQuizInto(dayId, quizView, {
    bank: QUIZ_BANK,
    stateKey: THEORY_QUIZ_STATE_KEY,
    title: "Теория",
    onProgress: refresh
  });
  refresh();
}

async function renderSqlPractice(dayId, toggleBtn) {
  const panel = document.getElementById("practice-panel");
  panel.innerHTML = `
    <div class="practice-cockpit">
      <div class="cockpit-head">
        <div>
          <p class="eyebrow">Практический тренажер</p>
          <h2>SQL: День ${dayId}</h2>
        </div>
        <div class="cockpit-chips" id="cockpit-chips"></div>
      </div>
      <section class="practice-view active" id="sql-quiz-view"></section>
      <section class="practice-view active" id="sql-live-view"></section>
    </div>
  `;

  const chips = panel.querySelector("#cockpit-chips");
  const quizView = panel.querySelector("#sql-quiz-view");
  const liveView = panel.querySelector("#sql-live-view");

  const refresh = () => {
    const quizStats = getQuizStats(dayId, SQL_QUIZ_BANK, SQL_QUIZ_STATE_KEY);
    const sqlStats = getSqlTaskStats(dayId);
    const done = quizStats.correct === quizStats.total && sqlStats.solved === sqlStats.total;

    chips.innerHTML = `
      <span class="chip">SQL-квиз: ${quizStats.correct}/${quizStats.total}</span>
      <span class="chip">SQL-задачи: ${sqlStats.solved}/${sqlStats.total}</span>
      <span class="chip ${done ? "chip-ok" : ""}">Статус: ${done ? "Готов" : "В процессе"}</span>
    `;

    if (done) setModuleCompleted(dayId, "sql", toggleBtn);
  };

  renderQuizInto(dayId, quizView, {
    bank: SQL_QUIZ_BANK,
    stateKey: SQL_QUIZ_STATE_KEY,
    title: "SQL-квиз",
    onProgress: refresh
  });
  await renderSqlInto(dayId, liveView, refresh);
  refresh();
}

async function renderDay() {
  const dayId = Number(document.body.dataset.day);
  const day = DAY_MAP[dayId];
  const content = document.getElementById("content");
  const toc = document.getElementById("toc");
  const toggle = document.getElementById("toggle-complete");
  const params = new URLSearchParams(window.location.search);
  const activeTrack = params.get("view") === "sql" ? "sql" : "theory";

  if (!day) {
    content.innerHTML = "<p>День не найден.</p>";
    return;
  }

  const updateToggle = () => {
    const progress = loadProgress();
    const done = Boolean(progress[moduleKey(activeTrack, dayId)]);
    const track = getTrack(activeTrack);
    document.title = `День ${dayId} — ${track.label} — Подготовка к техничке QA в ВК`;
    toggle.textContent = done ? `Убрать отметку (${track.label})` : `Отметить пройденным (${track.label})`;
  };
  updateToggle();

  toggle.addEventListener("click", () => {
    const p = loadProgress();
    const key = moduleKey(activeTrack, dayId);
    p[key] = !p[key];
    saveProgress(p);
    updateToggle();
  });

  try {
    const res = await fetch(contentPath(activeTrack, dayId));
    if (!res.ok) throw new Error("Не удалось загрузить контент дня");
    const md = await res.text();
    renderMarkdown(content, toc, md);
  } catch (error) {
    content.innerHTML = `<p>Ошибка загрузки: ${escapeHtml(error.message)}</p>`;
  }

  buildDayPagination(dayId, activeTrack);
  if (activeTrack === "sql") await renderSqlPractice(dayId, toggle);
  else await renderTheoryPractice(dayId, toggle);
}

function main() {
  const page = document.body.dataset.page;
  if (page === "index") renderIndex();
  if (page === "day") renderDay();
}

main();
