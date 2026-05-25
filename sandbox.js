const CUSTOM_DATASETS_KEY = "vk-qa-sandbox-custom-datasets-v3";
const HISTORY_KEY = "vk-qa-sandbox-history-v4";
const STATE_KEY = "vk-qa-sandbox-state-v4";
const TASK_PROGRESS_KEY = "vk-qa-sandbox-task-progress-v2";
const TASK_HINT_PROGRESS_KEY = "vk-qa-sandbox-task-hints-v1";

const BUILTIN_DATASETS = {
  shop: {
    label: "Магазин (products/orders)",
    seed: `
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
        (4, 'Laptop', 'Electronics', 90000),
        (5, 'Mouse', 'Peripherals', 2500);
      INSERT INTO orders VALUES
        (1, 1, 1, 'paid'),
        (2, 2, 2, 'paid'),
        (3, 4, 1, 'cancelled'),
        (4, 3, 3, 'paid'),
        (5, 5, 4, 'paid');
    `
  },
  users: {
    label: "Пользователи и заказы (users/orders)",
    seed: `
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
        status TEXT,
        created_at TEXT
      );
      INSERT INTO users VALUES
        (1, 'ivan', 'Moscow'),
        (2, 'maria', 'Kazan'),
        (3, 'anna', 'Moscow'),
        (4, 'oleg', 'Samara'),
        (5, 'nina', 'Kazan');
      INSERT INTO orders VALUES
        (1, 1, 5000, 'paid', '2026-05-20'),
        (2, 1, 2500, 'paid', '2026-05-21'),
        (3, 2, 3000, 'cancelled', '2026-05-22'),
        (4, 3, 1500, 'paid', '2026-05-22'),
        (5, 3, 1800, 'paid', '2026-05-23'),
        (6, 5, 4200, 'paid', '2026-05-23');
    `
  },
  qa: {
    label: "QA кейс (orders/order_items)",
    seed: `
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS order_items;
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        total_amount REAL,
        status TEXT
      );
      CREATE TABLE order_items (
        item_id INTEGER PRIMARY KEY,
        order_id INTEGER,
        quantity INTEGER,
        unit_price REAL,
        product_group TEXT
      );
      INSERT INTO orders VALUES
        (1, 51000, 'paid'),
        (2, 30000, 'paid'),
        (3, 5000, 'cancelled'),
        (4, 4500, 'paid'),
        (5, 18000, 'paid');
      INSERT INTO order_items VALUES
        (1, 1, 1, 50000, 'phones'),
        (2, 1, 1, 1000, 'accessories'),
        (3, 2, 1, 30000, 'laptops'),
        (4, 3, 1, 5000, 'accessories'),
        (5, 4, 1, 3000, 'peripherals'),
        (6, 4, 1, 1000, 'accessories'),
        (7, 5, 3, 6000, 'tablets');
    `
  },
  support: {
    label: "Support кейс (tickets/comments/agents)",
    seed: `
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS agents;
      CREATE TABLE agents (
        agent_id INTEGER PRIMARY KEY,
        agent_name TEXT,
        team TEXT
      );
      CREATE TABLE tickets (
        ticket_id INTEGER PRIMARY KEY,
        title TEXT,
        severity TEXT,
        status TEXT,
        agent_id INTEGER,
        created_at TEXT
      );
      CREATE TABLE comments (
        comment_id INTEGER PRIMARY KEY,
        ticket_id INTEGER,
        author_type TEXT,
        message TEXT,
        created_at TEXT
      );
      INSERT INTO agents VALUES
        (1, 'Ilya', 'Core'),
        (2, 'Nora', 'Payments'),
        (3, 'Pavel', 'Core');
      INSERT INTO tickets VALUES
        (101, 'Login 500', 'high', 'open', 1, '2026-05-20'),
        (102, 'Wrong price in cart', 'medium', 'in_progress', 2, '2026-05-21'),
        (103, 'Push notifications delayed', 'low', 'closed', 3, '2026-05-21'),
        (104, 'Order cannot be cancelled', 'critical', 'open', 2, '2026-05-22');
      INSERT INTO comments VALUES
        (1, 101, 'user', 'Cannot login for 30 minutes', '2026-05-20'),
        (2, 101, 'agent', 'Investigating logs', '2026-05-20'),
        (3, 102, 'user', 'Price is doubled after refresh', '2026-05-21'),
        (4, 104, 'user', 'Cancellation fails with 409', '2026-05-22'),
        (5, 104, 'agent', 'Escalated to backend team', '2026-05-22');
    `
  }
};

const EXTRA_BUILTIN_DATASETS = {
  fintech: {
    label: "FinTech кейс (accounts/cards/transactions)",
    seed: `
      DROP TABLE IF EXISTS accounts;
      DROP TABLE IF EXISTS cards;
      DROP TABLE IF EXISTS transactions;
      CREATE TABLE accounts (
        account_id INTEGER PRIMARY KEY,
        client_name TEXT,
        tier TEXT,
        city TEXT,
        balance REAL,
        status TEXT,
        opened_at TEXT
      );
      CREATE TABLE cards (
        card_id INTEGER PRIMARY KEY,
        account_id INTEGER,
        network TEXT,
        is_virtual INTEGER,
        is_blocked INTEGER
      );
      CREATE TABLE transactions (
        tx_id INTEGER PRIMARY KEY,
        account_id INTEGER,
        tx_type TEXT,
        amount REAL,
        currency TEXT,
        channel TEXT,
        status TEXT,
        created_at TEXT
      );
      INSERT INTO accounts VALUES
        (1, 'Artem', 'gold', 'Moscow', 183000, 'active', '2025-07-10'),
        (2, 'Mira', 'silver', 'Kazan', 55000, 'active', '2025-09-01'),
        (3, 'Nikita', 'gold', 'Moscow', 92000, 'frozen', '2024-12-17'),
        (4, 'Olga', 'platinum', 'SPB', 411000, 'active', '2024-05-22'),
        (5, 'Ira', 'silver', 'Samara', 17000, 'active', '2026-01-11'),
        (6, 'Dan', 'gold', 'SPB', 132000, 'closed', '2023-11-03');
      INSERT INTO cards VALUES
        (101, 1, 'VISA', 0, 0),
        (102, 1, 'VISA', 1, 0),
        (103, 2, 'MC', 0, 1),
        (104, 3, 'MIR', 0, 1),
        (105, 4, 'VISA', 0, 0),
        (106, 4, 'MC', 1, 0),
        (107, 5, 'MIR', 1, 0),
        (108, 6, 'MC', 0, 1);
      INSERT INTO transactions VALUES
        (1, 1, 'debit', 4200, 'RUB', 'app', 'posted', '2026-05-20'),
        (2, 1, 'credit', 15000, 'RUB', 'atm', 'posted', '2026-05-20'),
        (3, 2, 'debit', 1800, 'RUB', 'app', 'declined', '2026-05-21'),
        (4, 2, 'debit', 2500, 'RUB', 'web', 'posted', '2026-05-21'),
        (5, 3, 'debit', 9000, 'RUB', 'app', 'posted', '2026-05-21'),
        (6, 3, 'credit', 12000, 'RUB', 'branch', 'posted', '2026-05-22'),
        (7, 4, 'debit', 20000, 'RUB', 'app', 'posted', '2026-05-22'),
        (8, 4, 'debit', 3000, 'RUB', 'app', 'reversed', '2026-05-22'),
        (9, 4, 'credit', 50000, 'RUB', 'branch', 'posted', '2026-05-23'),
        (10, 5, 'debit', 700, 'RUB', 'app', 'posted', '2026-05-23'),
        (11, 5, 'debit', 900, 'RUB', 'web', 'declined', '2026-05-23'),
        (12, 6, 'debit', 10000, 'RUB', 'atm', 'posted', '2026-05-24'),
        (13, 6, 'credit', 7000, 'RUB', 'atm', 'posted', '2026-05-24'),
        (14, 2, 'debit', 4200, 'RUB', 'web', 'posted', '2026-05-24');
    `
  },
  logistics: {
    label: "Логистика (couriers/deliveries/events)",
    seed: `
      DROP TABLE IF EXISTS couriers;
      DROP TABLE IF EXISTS deliveries;
      DROP TABLE IF EXISTS delivery_events;
      CREATE TABLE couriers (
        courier_id INTEGER PRIMARY KEY,
        courier_name TEXT,
        hub_city TEXT,
        vehicle TEXT,
        status TEXT
      );
      CREATE TABLE deliveries (
        delivery_id INTEGER PRIMARY KEY,
        courier_id INTEGER,
        zone TEXT,
        status TEXT,
        fee REAL,
        created_at TEXT,
        delivered_at TEXT
      );
      CREATE TABLE delivery_events (
        event_id INTEGER PRIMARY KEY,
        delivery_id INTEGER,
        event_type TEXT,
        event_at TEXT
      );
      INSERT INTO couriers VALUES
        (1, 'Roman', 'Moscow', 'bike', 'active'),
        (2, 'Kira', 'Moscow', 'car', 'active'),
        (3, 'Sasha', 'SPB', 'bike', 'active'),
        (4, 'Maks', 'Kazan', 'car', 'vacation'),
        (5, 'Lena', 'SPB', 'foot', 'active');
      INSERT INTO deliveries VALUES
        (201, 1, 'north', 'delivered', 320, '2026-05-20', '2026-05-20'),
        (202, 1, 'north', 'failed', 0, '2026-05-20', NULL),
        (203, 2, 'center', 'delivered', 540, '2026-05-21', '2026-05-21'),
        (204, 2, 'center', 'delivered', 610, '2026-05-21', '2026-05-21'),
        (205, 3, 'west', 'in_progress', 0, '2026-05-22', NULL),
        (206, 3, 'west', 'delivered', 430, '2026-05-22', '2026-05-23'),
        (207, 5, 'east', 'delivered', 300, '2026-05-23', '2026-05-23'),
        (208, 5, 'east', 'cancelled', 0, '2026-05-24', NULL);
      INSERT INTO delivery_events VALUES
        (1, 201, 'created', '2026-05-20 09:00'),
        (2, 201, 'picked_up', '2026-05-20 09:20'),
        (3, 201, 'delivered', '2026-05-20 10:05'),
        (4, 202, 'created', '2026-05-20 10:10'),
        (5, 202, 'failed', '2026-05-20 11:00'),
        (6, 203, 'created', '2026-05-21 08:30'),
        (7, 203, 'delivered', '2026-05-21 09:25'),
        (8, 204, 'created', '2026-05-21 09:40'),
        (9, 204, 'delivered', '2026-05-21 10:20'),
        (10, 205, 'created', '2026-05-22 12:00'),
        (11, 206, 'created', '2026-05-22 12:30'),
        (12, 206, 'delivered', '2026-05-23 13:05'),
        (13, 207, 'created', '2026-05-23 14:00'),
        (14, 207, 'delivered', '2026-05-23 15:00');
    `
  },
  social: {
    label: "Соцсеть (members/posts/reactions)",
    seed: `
      DROP TABLE IF EXISTS members;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS reactions;
      CREATE TABLE members (
        member_id INTEGER PRIMARY KEY,
        username TEXT,
        city TEXT,
        joined_at TEXT
      );
      CREATE TABLE posts (
        post_id INTEGER PRIMARY KEY,
        member_id INTEGER,
        topic TEXT,
        is_deleted INTEGER,
        created_at TEXT
      );
      CREATE TABLE reactions (
        reaction_id INTEGER PRIMARY KEY,
        post_id INTEGER,
        member_id INTEGER,
        reaction_type TEXT,
        created_at TEXT
      );
      INSERT INTO members VALUES
        (1, 'anya', 'Moscow', '2025-01-03'),
        (2, 'vlad', 'SPB', '2025-02-12'),
        (3, 'rita', 'Kazan', '2025-03-11'),
        (4, 'tim', 'Moscow', '2025-04-01'),
        (5, 'ira', 'SPB', '2025-04-14'),
        (6, 'leo', 'Samara', '2025-06-01'),
        (7, 'katya', 'Moscow', '2025-06-21');
      INSERT INTO posts VALUES
        (301, 1, 'testing', 0, '2026-05-20'),
        (302, 1, 'career', 0, '2026-05-21'),
        (303, 2, 'testing', 0, '2026-05-21'),
        (304, 3, 'travel', 1, '2026-05-21'),
        (305, 4, 'backend', 0, '2026-05-22'),
        (306, 4, 'testing', 0, '2026-05-22'),
        (307, 5, 'design', 0, '2026-05-23'),
        (308, 6, 'testing', 0, '2026-05-23'),
        (309, 6, 'career', 0, '2026-05-24'),
        (310, 7, 'testing', 0, '2026-05-24');
      INSERT INTO reactions VALUES
        (1, 301, 2, 'like', '2026-05-20'),
        (2, 301, 3, 'like', '2026-05-20'),
        (3, 301, 4, 'wow', '2026-05-20'),
        (4, 302, 2, 'like', '2026-05-21'),
        (5, 302, 5, 'sad', '2026-05-21'),
        (6, 303, 1, 'like', '2026-05-21'),
        (7, 303, 4, 'like', '2026-05-22'),
        (8, 303, 5, 'angry', '2026-05-22'),
        (9, 305, 2, 'like', '2026-05-22'),
        (10, 305, 3, 'wow', '2026-05-22'),
        (11, 306, 1, 'like', '2026-05-22'),
        (12, 306, 5, 'like', '2026-05-22'),
        (13, 307, 1, 'wow', '2026-05-23'),
        (14, 307, 2, 'sad', '2026-05-23'),
        (15, 308, 1, 'like', '2026-05-23'),
        (16, 308, 3, 'like', '2026-05-23'),
        (17, 309, 7, 'like', '2026-05-24'),
        (18, 309, 4, 'wow', '2026-05-24'),
        (19, 310, 1, 'like', '2026-05-24'),
        (20, 310, 6, 'angry', '2026-05-24');
    `
  },
  billing: {
    label: "Подписки и биллинг (plans/subscriptions/invoices/payments)",
    seed: `
      DROP TABLE IF EXISTS plans;
      DROP TABLE IF EXISTS subscriptions;
      DROP TABLE IF EXISTS invoices;
      DROP TABLE IF EXISTS payments;
      CREATE TABLE plans (
        plan_id INTEGER PRIMARY KEY,
        plan_name TEXT,
        monthly_price REAL
      );
      CREATE TABLE subscriptions (
        sub_id INTEGER PRIMARY KEY,
        account_name TEXT,
        plan_id INTEGER,
        status TEXT,
        start_date TEXT,
        end_date TEXT
      );
      CREATE TABLE invoices (
        invoice_id INTEGER PRIMARY KEY,
        sub_id INTEGER,
        period TEXT,
        amount REAL,
        status TEXT,
        issued_at TEXT
      );
      CREATE TABLE payments (
        payment_id INTEGER PRIMARY KEY,
        invoice_id INTEGER,
        payment_method TEXT,
        amount REAL,
        status TEXT,
        paid_at TEXT
      );
      INSERT INTO plans VALUES
        (1, 'starter', 990),
        (2, 'pro', 2490),
        (3, 'enterprise', 7990);
      INSERT INTO subscriptions VALUES
        (1, 'alpha', 2, 'active', '2026-01-01', NULL),
        (2, 'beta', 1, 'active', '2026-02-01', NULL),
        (3, 'gamma', 3, 'active', '2025-12-10', NULL),
        (4, 'delta', 1, 'cancelled', '2025-08-01', '2026-03-15'),
        (5, 'omega', 2, 'active', '2026-04-01', NULL),
        (6, 'nova', 1, 'active', '2026-05-01', NULL),
        (7, 'terra', 2, 'past_due', '2026-02-20', NULL),
        (8, 'zen', 3, 'active', '2026-01-18', NULL);
      INSERT INTO invoices VALUES
        (401, 1, '2026-05', 2490, 'paid', '2026-05-01'),
        (402, 2, '2026-05', 990, 'paid', '2026-05-01'),
        (403, 3, '2026-05', 7990, 'paid', '2026-05-01'),
        (404, 4, '2026-03', 990, 'unpaid', '2026-03-01'),
        (405, 5, '2026-05', 2490, 'paid', '2026-05-03'),
        (406, 6, '2026-05', 990, 'paid', '2026-05-03'),
        (407, 7, '2026-05', 2490, 'unpaid', '2026-05-03'),
        (408, 8, '2026-05', 7990, 'paid', '2026-05-04'),
        (409, 1, '2026-04', 2490, 'paid', '2026-04-01'),
        (410, 7, '2026-04', 2490, 'paid', '2026-04-01');
      INSERT INTO payments VALUES
        (1, 401, 'card', 2490, 'succeeded', '2026-05-01'),
        (2, 402, 'card', 990, 'succeeded', '2026-05-01'),
        (3, 403, 'bank', 7990, 'succeeded', '2026-05-01'),
        (4, 405, 'card', 2490, 'succeeded', '2026-05-03'),
        (5, 406, 'card', 990, 'succeeded', '2026-05-03'),
        (6, 408, 'bank', 7990, 'succeeded', '2026-05-04'),
        (7, 409, 'card', 2490, 'succeeded', '2026-04-01'),
        (8, 410, 'card', 2490, 'succeeded', '2026-04-01'),
        (9, 407, 'card', 0, 'failed', '2026-05-05');
    `
  },
  ads: {
    label: "Реклама (campaigns/impressions/clicks)",
    seed: `
      DROP TABLE IF EXISTS campaigns;
      DROP TABLE IF EXISTS impressions;
      DROP TABLE IF EXISTS clicks;
      CREATE TABLE campaigns (
        campaign_id INTEGER PRIMARY KEY,
        campaign_name TEXT,
        channel TEXT,
        daily_budget REAL,
        status TEXT
      );
      CREATE TABLE impressions (
        imp_id INTEGER PRIMARY KEY,
        campaign_id INTEGER,
        event_date TEXT,
        impressions INTEGER,
        spend REAL
      );
      CREATE TABLE clicks (
        click_id INTEGER PRIMARY KEY,
        campaign_id INTEGER,
        event_date TEXT,
        clicks INTEGER,
        conversions INTEGER,
        revenue REAL
      );
      INSERT INTO campaigns VALUES
        (1, 'Brand Search', 'search', 12000, 'active'),
        (2, 'Retargeting', 'social', 9000, 'active'),
        (3, 'Video Reach', 'video', 15000, 'paused'),
        (4, 'Install Push', 'inapp', 7000, 'active'),
        (5, 'B2B Leads', 'search', 18000, 'active');
      INSERT INTO impressions VALUES
        (1, 1, '2026-05-21', 22000, 8200),
        (2, 1, '2026-05-22', 24000, 9100),
        (3, 2, '2026-05-21', 18000, 6400),
        (4, 2, '2026-05-22', 17500, 6200),
        (5, 3, '2026-05-21', 41000, 11200),
        (6, 3, '2026-05-22', 39000, 10800),
        (7, 4, '2026-05-22', 15000, 5000),
        (8, 4, '2026-05-23', 17000, 5600),
        (9, 5, '2026-05-22', 13000, 7200),
        (10, 5, '2026-05-23', 14000, 7600),
        (11, 2, '2026-05-23', 19000, 6600),
        (12, 1, '2026-05-23', 25000, 9600);
      INSERT INTO clicks VALUES
        (1, 1, '2026-05-21', 1200, 85, 19600),
        (2, 1, '2026-05-22', 1320, 96, 22800),
        (3, 2, '2026-05-21', 920, 74, 15800),
        (4, 2, '2026-05-22', 880, 66, 14100),
        (5, 3, '2026-05-21', 1100, 41, 12400),
        (6, 3, '2026-05-22', 1060, 39, 11800),
        (7, 4, '2026-05-22', 760, 58, 9100),
        (8, 4, '2026-05-23', 820, 65, 10100),
        (9, 5, '2026-05-22', 610, 72, 20300),
        (10, 5, '2026-05-23', 640, 79, 21900),
        (11, 2, '2026-05-23', 940, 77, 16600),
        (12, 1, '2026-05-23', 1380, 101, 24100);
    `
  }
};

Object.assign(BUILTIN_DATASETS, EXTRA_BUILTIN_DATASETS);

const TASK_BANK = [
  {
    id: "tb_1",
    dataset: "support",
    level: "easy",
    title: "Открытые критичные тикеты",
    prompt: "Выведи ticket_id, title, agent_id для тикетов со статусом open и severity critical/high. Сортировка по severity, затем ticket_id.",
    solutionSql: `
      SELECT ticket_id, title, agent_id
      FROM tickets
      WHERE status = 'open'
        AND severity IN ('critical', 'high')
      ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END, ticket_id;
    `
  },
  {
    id: "tb_2",
    dataset: "support",
    level: "easy",
    title: "Тикеты без комментариев",
    prompt: "Найди тикеты, у которых нет ни одного комментария.",
    solutionSql: `
      SELECT t.ticket_id, t.title
      FROM tickets t
      LEFT JOIN comments c ON c.ticket_id = t.ticket_id
      WHERE c.comment_id IS NULL
      ORDER BY t.ticket_id;
    `
  },
  {
    id: "tb_3",
    dataset: "support",
    level: "medium",
    title: "Нагрузка по агентам",
    prompt: "Посчитай количество активных тикетов (open/in_progress) на каждого агента, включая агентов с нулем.",
    solutionSql: `
      SELECT a.agent_id, a.agent_name, COUNT(t.ticket_id) AS active_cnt
      FROM agents a
      LEFT JOIN tickets t
        ON t.agent_id = a.agent_id
        AND t.status IN ('open', 'in_progress')
      GROUP BY a.agent_id, a.agent_name
      ORDER BY active_cnt DESC, a.agent_id;
    `
  },
  {
    id: "tb_4",
    dataset: "users",
    level: "medium",
    title: "Доля cancelled по городам",
    prompt: "Для каждого города посчитай paid_cnt, cancelled_cnt и cancelled_share = cancelled_cnt / all_cnt.",
    solutionSql: `
      SELECT
        u.city,
        SUM(CASE WHEN o.status = 'paid' THEN 1 ELSE 0 END) AS paid_cnt,
        SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_cnt,
        ROUND(
          SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(o.order_id), 0),
          3
        ) AS cancelled_share
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.user_id
      GROUP BY u.city
      ORDER BY u.city;
    `
  },
  {
    id: "tb_5",
    dataset: "users",
    level: "hard",
    title: "Лидеры по выручке в каждом городе",
    prompt: "Найди пользователя(ей) с максимальной суммой paid-заказов в каждом городе. Важно: учитываются все города, даже если в городе нет paid-заказов; в таком случае paid_sum = 0 (не NULL). Ожидаемые колонки: city, user_id, username, paid_sum. Пример вывода: (Kazan, 5, nina, 4200); (Moscow, 1, ivan, 7500); (Samara, 4, oleg, 0).",
    solutionSql: `
      WITH totals AS (
        SELECT
          u.city,
          u.user_id,
          u.username,
          SUM(CASE WHEN o.status = 'paid' THEN o.amount ELSE 0 END) AS paid_sum
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.user_id
        GROUP BY u.city, u.user_id, u.username
      ),
      ranked AS (
        SELECT city, user_id, username, paid_sum,
               DENSE_RANK() OVER (PARTITION BY city ORDER BY paid_sum DESC) AS rnk
        FROM totals
      )
      SELECT city, user_id, username, paid_sum
      FROM ranked
      WHERE rnk = 1
      ORDER BY city, user_id;
    `
  },
  {
    id: "tb_6",
    dataset: "shop",
    level: "medium",
    title: "Выручка по категориям",
    prompt: "Посчитай revenue = SUM(quantity * price) по category только для paid заказов.",
    solutionSql: `
      SELECT p.category, SUM(o.quantity * p.price) AS revenue
      FROM orders o
      JOIN products p ON p.product_id = o.product_id
      WHERE o.status = 'paid'
      GROUP BY p.category
      ORDER BY revenue DESC, p.category;
    `
  },
  {
    id: "tb_7",
    dataset: "qa",
    level: "medium",
    title: "Заказы, где аксессуары > 15%",
    prompt: "Найди order_id, где доля product_group='accessories' больше 15% от calc_total заказа.",
    solutionSql: `
      WITH sums AS (
        SELECT
          order_id,
          SUM(quantity * unit_price) AS calc_total,
          SUM(CASE WHEN product_group = 'accessories' THEN quantity * unit_price ELSE 0 END) AS acc_total
        FROM order_items
        GROUP BY order_id
      )
      SELECT order_id, calc_total, acc_total
      FROM sums
      WHERE acc_total * 1.0 / calc_total > 0.15
      ORDER BY order_id;
    `
  },
  {
    id: "tb_8",
    dataset: "support",
    level: "hard",
    title: "Время до первого ответа агента",
    prompt: "Для каждого тикета посчитай разницу в днях между ticket.created_at и первым comment от agent.",
    solutionSql: `
      WITH first_agent AS (
        SELECT ticket_id, MIN(created_at) AS first_agent_at
        FROM comments
        WHERE author_type = 'agent'
        GROUP BY ticket_id
      )
      SELECT
        t.ticket_id,
        ROUND(julianday(f.first_agent_at) - julianday(t.created_at), 3) AS days_to_first_agent
      FROM tickets t
      JOIN first_agent f ON f.ticket_id = t.ticket_id
      ORDER BY t.ticket_id;
    `
  }
];

const EXTRA_TASKS = [
  {
    id: "tb_9",
    dataset: "support",
    level: "easy",
    title: "Комментарии по типу автора",
    prompt: "Выведи колонки author_type, comments_cnt. comments_cnt = COUNT(*) по таблице comments. Сортировка: comments_cnt DESC, author_type ASC. Пример строки: ('user', 3).",
    solutionSql: `
      SELECT author_type, COUNT(*) AS comments_cnt
      FROM comments
      GROUP BY author_type
      ORDER BY comments_cnt DESC, author_type;
    `
  },
  {
    id: "tb_10",
    dataset: "support",
    level: "medium",
    title: "Открытые тикеты без ответа агента",
    prompt: "Выведи колонки ticket_id, title для тикетов со status='open', где нет ни одного комментария от agent. Сортировка: ticket_id ASC. Пример строки: (102, 'Wrong price in cart').",
    solutionSql: `
      SELECT t.ticket_id, t.title
      FROM tickets t
      LEFT JOIN comments c
        ON c.ticket_id = t.ticket_id
        AND c.author_type = 'agent'
      WHERE t.status = 'open' AND c.comment_id IS NULL
      ORDER BY t.ticket_id;
    `
  },
  {
    id: "tb_11",
    dataset: "support",
    level: "medium",
    title: "Среднее число комментариев по статусу тикета",
    prompt: "Выведи колонки status, avg_comments. avg_comments = среднее число комментариев на тикет внутри статуса. Округли до 2 знаков. Сортировка: status ASC. Пример: ('open', 1.5).",
    solutionSql: `
      WITH comments_per_ticket AS (
        SELECT t.ticket_id, t.status, COUNT(c.comment_id) AS comment_cnt
        FROM tickets t
        LEFT JOIN comments c ON c.ticket_id = t.ticket_id
        GROUP BY t.ticket_id, t.status
      )
      SELECT status, ROUND(AVG(comment_cnt), 2) AS avg_comments
      FROM comments_per_ticket
      GROUP BY status
      ORDER BY status;
    `
  },
  {
    id: "tb_12",
    dataset: "support",
    level: "hard",
    title: "Последний комментарий по тикету",
    prompt: "Выведи колонки ticket_id, last_author_type, last_comment_at. Нужен самый поздний комментарий каждого тикета. Сортировка: ticket_id ASC. Пример: (101, 'agent', '2026-05-20').",
    solutionSql: `
      WITH ranked AS (
        SELECT
          c.ticket_id,
          c.author_type,
          c.created_at,
          ROW_NUMBER() OVER (PARTITION BY c.ticket_id ORDER BY c.created_at DESC, c.comment_id DESC) AS rn
        FROM comments c
      )
      SELECT ticket_id, author_type AS last_author_type, created_at AS last_comment_at
      FROM ranked
      WHERE rn = 1
      ORDER BY ticket_id;
    `
  },
  {
    id: "tb_13",
    dataset: "users",
    level: "easy",
    title: "Выручка paid по пользователям",
    prompt: "Выведи колонки user_id, total_paid. total_paid = SUM(amount) для status='paid'. Сортировка: total_paid DESC, user_id ASC. Пример: (1, 7500).",
    solutionSql: `
      SELECT user_id, SUM(amount) AS total_paid
      FROM orders
      WHERE status = 'paid'
      GROUP BY user_id
      ORDER BY total_paid DESC, user_id;
    `
  },
  {
    id: "tb_14",
    dataset: "users",
    level: "medium",
    title: "Пользователи без paid заказов",
    prompt: "Выведи колонки user_id, username. Нужны пользователи, у которых нет ни одного заказа со статусом paid. Сортировка: user_id ASC. Пример: (2, 'maria').",
    solutionSql: `
      SELECT u.user_id, u.username
      FROM users u
      LEFT JOIN orders o
        ON o.user_id = u.user_id
        AND o.status = 'paid'
      WHERE o.order_id IS NULL
      ORDER BY u.user_id;
    `
  },
  {
    id: "tb_15",
    dataset: "users",
    level: "medium",
    title: "Дата первого заказа по пользователю",
    prompt: "Выведи колонки user_id, first_order_at. first_order_at = MIN(created_at) по всем заказам пользователя. Сортировка: user_id ASC. Пример: (1, '2026-05-20').",
    solutionSql: `
      SELECT user_id, MIN(created_at) AS first_order_at
      FROM orders
      GROUP BY user_id
      ORDER BY user_id;
    `
  },
  {
    id: "tb_16",
    dataset: "users",
    level: "hard",
    title: "Дневная paid-выручка",
    prompt: "Выведи колонки created_at, paid_gmv. paid_gmv = SUM(amount) только для paid. Сортировка: created_at ASC. Пример: ('2026-05-23', 6000).",
    solutionSql: `
      SELECT created_at, SUM(amount) AS paid_gmv
      FROM orders
      WHERE status = 'paid'
      GROUP BY created_at
      ORDER BY created_at;
    `
  },
  {
    id: "tb_17",
    dataset: "shop",
    level: "easy",
    title: "Товары без заказов",
    prompt: "Выведи колонки product_id, product_name для товаров, которых нет в таблице orders. Сортировка: product_id ASC. Пример: (NULL если все товары заказывались).",
    solutionSql: `
      SELECT p.product_id, p.product_name
      FROM products p
      LEFT JOIN orders o ON o.product_id = p.product_id
      WHERE o.order_id IS NULL
      ORDER BY p.product_id;
    `
  },
  {
    id: "tb_18",
    dataset: "shop",
    level: "medium",
    title: "Среднее количество в paid заказах по категориям",
    prompt: "Выведи колонки category, avg_qty. avg_qty = AVG(quantity) только по paid заказам. Округли до 2 знаков. Сортировка: avg_qty DESC, category ASC. Пример: ('Peripherals', 3.5).",
    solutionSql: `
      SELECT p.category, ROUND(AVG(o.quantity), 2) AS avg_qty
      FROM orders o
      JOIN products p ON p.product_id = o.product_id
      WHERE o.status = 'paid'
      GROUP BY p.category
      ORDER BY avg_qty DESC, p.category;
    `
  },
  {
    id: "tb_19",
    dataset: "shop",
    level: "medium",
    title: "Отмененные заказы с товаром",
    prompt: "Выведи колонки order_id, product_name, quantity только для status='cancelled'. Сортировка: order_id ASC. Пример: (3, 'Laptop', 1).",
    solutionSql: `
      SELECT o.order_id, p.product_name, o.quantity
      FROM orders o
      JOIN products p ON p.product_id = o.product_id
      WHERE o.status = 'cancelled'
      ORDER BY o.order_id;
    `
  },
  {
    id: "tb_20",
    dataset: "shop",
    level: "hard",
    title: "Лидер по проданным единицам",
    prompt: "Выведи колонки product_id, product_name, sold_units. sold_units = SUM(quantity) только по paid. Нужна строка с максимумом sold_units. Пример: (5, 'Mouse', 4).",
    solutionSql: `
      SELECT p.product_id, p.product_name, SUM(o.quantity) AS sold_units
      FROM orders o
      JOIN products p ON p.product_id = o.product_id
      WHERE o.status = 'paid'
      GROUP BY p.product_id, p.product_name
      ORDER BY sold_units DESC, p.product_id
      LIMIT 1;
    `
  },
  {
    id: "tb_21",
    dataset: "qa",
    level: "easy",
    title: "Заказы с 2+ позициями",
    prompt: "Выведи колонки order_id, items_cnt. items_cnt = COUNT(*) по order_items. Нужны order_id, где items_cnt >= 2. Сортировка: order_id ASC. Пример: (1, 2).",
    solutionSql: `
      SELECT order_id, COUNT(*) AS items_cnt
      FROM order_items
      GROUP BY order_id
      HAVING COUNT(*) >= 2
      ORDER BY order_id;
    `
  },
  {
    id: "tb_22",
    dataset: "qa",
    level: "medium",
    title: "Средняя цена позиции по product_group",
    prompt: "Выведи колонки product_group, avg_unit_price. avg_unit_price = AVG(unit_price). Округли до 2 знаков. Сортировка: avg_unit_price DESC. Пример: ('laptops', 30000).",
    solutionSql: `
      SELECT product_group, ROUND(AVG(unit_price), 2) AS avg_unit_price
      FROM order_items
      GROUP BY product_group
      ORDER BY avg_unit_price DESC, product_group;
    `
  },
  {
    id: "tb_23",
    dataset: "qa",
    level: "medium",
    title: "Cancelled заказы и их calc_total",
    prompt: "Выведи колонки order_id, calc_total для заказов со статусом cancelled. calc_total = SUM(quantity * unit_price). Сортировка: order_id ASC. Пример: (3, 5000).",
    solutionSql: `
      SELECT o.order_id, SUM(oi.quantity * oi.unit_price) AS calc_total
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.order_id
      WHERE o.status = 'cancelled'
      GROUP BY o.order_id
      ORDER BY o.order_id;
    `
  },
  {
    id: "tb_24",
    dataset: "qa",
    level: "hard",
    title: "Заказ с максимальным calc_total",
    prompt: "Выведи колонки order_id, calc_total. Нужен заказ с максимальным calc_total = SUM(quantity * unit_price). Пример: (1, 51000).",
    solutionSql: `
      SELECT oi.order_id, SUM(oi.quantity * oi.unit_price) AS calc_total
      FROM order_items oi
      GROUP BY oi.order_id
      ORDER BY calc_total DESC, oi.order_id
      LIMIT 1;
    `
  },
  {
    id: "tb_25",
    dataset: "fintech",
    level: "easy",
    title: "Активные аккаунты с высоким балансом",
    prompt: "Выведи колонки account_id, client_name, balance для active аккаунтов с balance > 100000. Сортировка: balance DESC. Пример: (4, 'Olga', 411000).",
    solutionSql: `
      SELECT account_id, client_name, balance
      FROM accounts
      WHERE status = 'active' AND balance > 100000
      ORDER BY balance DESC, account_id;
    `
  },
  {
    id: "tb_26",
    dataset: "fintech",
    level: "easy",
    title: "Блокировки карт по сети",
    prompt: "Выведи колонки network, blocked_cards. blocked_cards = COUNT(*) где is_blocked=1. Сортировка: blocked_cards DESC, network ASC. Пример: ('MC', 2).",
    solutionSql: `
      SELECT network, COUNT(*) AS blocked_cards
      FROM cards
      WHERE is_blocked = 1
      GROUP BY network
      ORDER BY blocked_cards DESC, network;
    `
  },
  {
    id: "tb_27",
    dataset: "fintech",
    level: "medium",
    title: "Аккаунты без карт",
    prompt: "Выведи колонки account_id, client_name для аккаунтов без карт. Сортировка: account_id ASC. Пример: (NULL если у всех есть карты).",
    solutionSql: `
      SELECT a.account_id, a.client_name
      FROM accounts a
      LEFT JOIN cards c ON c.account_id = a.account_id
      WHERE c.card_id IS NULL
      ORDER BY a.account_id;
    `
  },
  {
    id: "tb_28",
    dataset: "fintech",
    level: "medium",
    title: "Дебетовый outflow по аккаунтам",
    prompt: "Выведи колонки account_id, debit_outflow. debit_outflow = SUM(amount) где tx_type='debit' и status='posted'. Сортировка: debit_outflow DESC. Пример: (4, 20000).",
    solutionSql: `
      SELECT account_id, SUM(amount) AS debit_outflow
      FROM transactions
      WHERE tx_type = 'debit' AND status = 'posted'
      GROUP BY account_id
      ORDER BY debit_outflow DESC, account_id;
    `
  },
  {
    id: "tb_29",
    dataset: "fintech",
    level: "medium",
    title: "Decline rate по каналам",
    prompt: "Выведи колонки channel, decline_rate. decline_rate = declined_cnt / all_cnt по каждому channel. Округли до 3 знаков. Сортировка: decline_rate DESC. Пример: ('web', 0.333).",
    solutionSql: `
      SELECT
        channel,
        ROUND(SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 3) AS decline_rate
      FROM transactions
      GROUP BY channel
      ORDER BY decline_rate DESC, channel;
    `
  },
  {
    id: "tb_30",
    dataset: "fintech",
    level: "hard",
    title: "Первый posted-транзакшен по аккаунту",
    prompt: "Выведи колонки account_id, first_posted_at. first_posted_at = MIN(created_at) по status='posted'. Сортировка: account_id ASC. Пример: (1, '2026-05-20').",
    solutionSql: `
      SELECT account_id, MIN(created_at) AS first_posted_at
      FROM transactions
      WHERE status = 'posted'
      GROUP BY account_id
      ORDER BY account_id;
    `
  },
  {
    id: "tb_31",
    dataset: "fintech",
    level: "hard",
    title: "Аккаунты с debit и credit",
    prompt: "Выведи колонку account_id для аккаунтов, где есть и debit, и credit транзакции. Сортировка: account_id ASC. Пример: 1.",
    solutionSql: `
      SELECT account_id
      FROM transactions
      GROUP BY account_id
      HAVING SUM(CASE WHEN tx_type = 'debit' THEN 1 ELSE 0 END) > 0
         AND SUM(CASE WHEN tx_type = 'credit' THEN 1 ELSE 0 END) > 0
      ORDER BY account_id;
    `
  },
  {
    id: "tb_32",
    dataset: "fintech",
    level: "hard",
    title: "Доля виртуальных карт по tier",
    prompt: "Выведи колонки tier, virtual_share. virtual_share = virtual_cards / all_cards в рамках tier. Округли до 3 знаков. Сортировка: tier ASC. Пример: ('gold', 0.333).",
    solutionSql: `
      SELECT
        a.tier,
        ROUND(SUM(CASE WHEN c.is_virtual = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 3) AS virtual_share
      FROM accounts a
      JOIN cards c ON c.account_id = a.account_id
      GROUP BY a.tier
      ORDER BY a.tier;
    `
  },
  {
    id: "tb_33",
    dataset: "logistics",
    level: "easy",
    title: "Доставки по статусам",
    prompt: "Выведи колонки status, deliveries_cnt. deliveries_cnt = COUNT(*) в deliveries. Сортировка: deliveries_cnt DESC. Пример: ('delivered', 5).",
    solutionSql: `
      SELECT status, COUNT(*) AS deliveries_cnt
      FROM deliveries
      GROUP BY status
      ORDER BY deliveries_cnt DESC, status;
    `
  },
  {
    id: "tb_34",
    dataset: "logistics",
    level: "easy",
    title: "Выручка курьеров",
    prompt: "Выведи колонки courier_id, courier_name, delivered_fee. delivered_fee = SUM(fee) для status='delivered'. Сортировка: delivered_fee DESC. Пример: (2, 'Kira', 1150).",
    solutionSql: `
      SELECT c.courier_id, c.courier_name, SUM(d.fee) AS delivered_fee
      FROM couriers c
      JOIN deliveries d ON d.courier_id = c.courier_id
      WHERE d.status = 'delivered'
      GROUP BY c.courier_id, c.courier_name
      ORDER BY delivered_fee DESC, c.courier_id;
    `
  },
  {
    id: "tb_35",
    dataset: "logistics",
    level: "medium",
    title: "Курьеры без доставок",
    prompt: "Выведи колонки courier_id, courier_name для курьеров без записей в deliveries. Сортировка: courier_id ASC. Пример: (4, 'Maks').",
    solutionSql: `
      SELECT c.courier_id, c.courier_name
      FROM couriers c
      LEFT JOIN deliveries d ON d.courier_id = c.courier_id
      WHERE d.delivery_id IS NULL
      ORDER BY c.courier_id;
    `
  },
  {
    id: "tb_36",
    dataset: "logistics",
    level: "medium",
    title: "Среднее время доставки по зоне",
    prompt: "Выведи колонки zone, avg_hours_to_deliver. Для delivered: разница (delivered_at - created_at) в часах. Округли до 2 знаков. Сортировка: avg_hours_to_deliver DESC. Пример: ('west', 25.0).",
    solutionSql: `
      SELECT
        zone,
        ROUND(AVG((julianday(delivered_at) - julianday(created_at)) * 24), 2) AS avg_hours_to_deliver
      FROM deliveries
      WHERE status = 'delivered'
      GROUP BY zone
      ORDER BY avg_hours_to_deliver DESC, zone;
    `
  },
  {
    id: "tb_37",
    dataset: "logistics",
    level: "medium",
    title: "Fail-rate по городу хаба",
    prompt: "Выведи колонки hub_city, fail_rate. fail_rate = failed_cnt / all_cnt по delivery на курьеров этого города. Округли до 3 знаков. Сортировка: fail_rate DESC. Пример: ('Moscow', 0.25).",
    solutionSql: `
      SELECT
        c.hub_city,
        ROUND(SUM(CASE WHEN d.status = 'failed' THEN 1 ELSE 0 END) * 1.0 / COUNT(d.delivery_id), 3) AS fail_rate
      FROM couriers c
      JOIN deliveries d ON d.courier_id = c.courier_id
      GROUP BY c.hub_city
      ORDER BY fail_rate DESC, c.hub_city;
    `
  },
  {
    id: "tb_38",
    dataset: "logistics",
    level: "hard",
    title: "Первый и последний event по delivery",
    prompt: "Выведи колонки delivery_id, first_event_at, last_event_at. Сортировка: delivery_id ASC. Пример: (201, '2026-05-20 09:00', '2026-05-20 10:05').",
    solutionSql: `
      SELECT delivery_id, MIN(event_at) AS first_event_at, MAX(event_at) AS last_event_at
      FROM delivery_events
      GROUP BY delivery_id
      ORDER BY delivery_id;
    `
  },
  {
    id: "tb_39",
    dataset: "logistics",
    level: "hard",
    title: "Курьеры с delivered и failed",
    prompt: "Выведи колонку courier_id для курьеров, у которых есть и delivered, и failed доставки. Сортировка: courier_id ASC. Пример: 1.",
    solutionSql: `
      SELECT courier_id
      FROM deliveries
      GROUP BY courier_id
      HAVING SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) > 0
         AND SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) > 0
      ORDER BY courier_id;
    `
  },
  {
    id: "tb_40",
    dataset: "logistics",
    level: "hard",
    title: "Сколько событий на доставку",
    prompt: "Выведи колонки delivery_id, events_cnt. events_cnt = COUNT(*) в delivery_events. Сортировка: events_cnt DESC, delivery_id ASC. Пример: (201, 3).",
    solutionSql: `
      SELECT delivery_id, COUNT(*) AS events_cnt
      FROM delivery_events
      GROUP BY delivery_id
      ORDER BY events_cnt DESC, delivery_id;
    `
  },
  {
    id: "tb_41",
    dataset: "social",
    level: "easy",
    title: "Посты по темам",
    prompt: "Выведи колонки topic, posts_cnt для постов с is_deleted=0. Сортировка: posts_cnt DESC, topic ASC. Пример: ('testing', 5).",
    solutionSql: `
      SELECT topic, COUNT(*) AS posts_cnt
      FROM posts
      WHERE is_deleted = 0
      GROUP BY topic
      ORDER BY posts_cnt DESC, topic;
    `
  },
  {
    id: "tb_42",
    dataset: "social",
    level: "easy",
    title: "Посты без реакций",
    prompt: "Выведи колонки post_id, topic для постов без реакций. Сортировка: post_id ASC. Пример: (304, 'travel').",
    solutionSql: `
      SELECT p.post_id, p.topic
      FROM posts p
      LEFT JOIN reactions r ON r.post_id = p.post_id
      WHERE r.reaction_id IS NULL
      ORDER BY p.post_id;
    `
  },
  {
    id: "tb_43",
    dataset: "social",
    level: "medium",
    title: "Реакции по типу",
    prompt: "Выведи колонки reaction_type, reactions_cnt. reactions_cnt = COUNT(*). Сортировка: reactions_cnt DESC, reaction_type ASC. Пример: ('like', 11).",
    solutionSql: `
      SELECT reaction_type, COUNT(*) AS reactions_cnt
      FROM reactions
      GROUP BY reaction_type
      ORDER BY reactions_cnt DESC, reaction_type;
    `
  },
  {
    id: "tb_44",
    dataset: "social",
    level: "medium",
    title: "Топ авторов по количеству постов",
    prompt: "Выведи колонки member_id, username, posts_cnt по is_deleted=0. Сортировка: posts_cnt DESC, member_id ASC. Пример: (1, 'anya', 2).",
    solutionSql: `
      SELECT m.member_id, m.username, COUNT(p.post_id) AS posts_cnt
      FROM members m
      JOIN posts p ON p.member_id = m.member_id
      WHERE p.is_deleted = 0
      GROUP BY m.member_id, m.username
      ORDER BY posts_cnt DESC, m.member_id;
    `
  },
  {
    id: "tb_45",
    dataset: "social",
    level: "medium",
    title: "Среднее реакций на пост по теме",
    prompt: "Выведи колонки topic, avg_reactions_per_post. Округли до 2 знаков, считать только is_deleted=0. Сортировка: avg_reactions_per_post DESC. Пример: ('testing', 2.0).",
    solutionSql: `
      WITH post_reactions AS (
        SELECT p.post_id, p.topic, COUNT(r.reaction_id) AS reactions_cnt
        FROM posts p
        LEFT JOIN reactions r ON r.post_id = p.post_id
        WHERE p.is_deleted = 0
        GROUP BY p.post_id, p.topic
      )
      SELECT topic, ROUND(AVG(reactions_cnt), 2) AS avg_reactions_per_post
      FROM post_reactions
      GROUP BY topic
      ORDER BY avg_reactions_per_post DESC, topic;
    `
  },
  {
    id: "tb_46",
    dataset: "social",
    level: "hard",
    title: "Пользователи, которые только лайкают",
    prompt: "Выведи колонки member_id, username для пользователей, у которых есть реакции и все они типа like. Сортировка: member_id ASC. Пример: (3, 'rita').",
    solutionSql: `
      SELECT m.member_id, m.username
      FROM members m
      JOIN reactions r ON r.member_id = m.member_id
      GROUP BY m.member_id, m.username
      HAVING SUM(CASE WHEN r.reaction_type <> 'like' THEN 1 ELSE 0 END) = 0
      ORDER BY m.member_id;
    `
  },
  {
    id: "tb_47",
    dataset: "social",
    level: "hard",
    title: "Первый пост каждого автора",
    prompt: "Выведи колонки member_id, post_id, first_post_at. Нужен первый пост пользователя (по created_at, затем post_id). Сортировка: member_id ASC. Пример: (1, 301, '2026-05-20').",
    solutionSql: `
      WITH ranked AS (
        SELECT
          p.member_id,
          p.post_id,
          p.created_at,
          ROW_NUMBER() OVER (PARTITION BY p.member_id ORDER BY p.created_at, p.post_id) AS rn
        FROM posts p
      )
      SELECT member_id, post_id, created_at AS first_post_at
      FROM ranked
      WHERE rn = 1
      ORDER BY member_id;
    `
  },
  {
    id: "tb_48",
    dataset: "social",
    level: "hard",
    title: "Конверсия поста в реакцию",
    prompt: "Выведи колонки post_id, reactions_cnt для постов, где reactions_cnt >= 2. Сортировка: reactions_cnt DESC, post_id ASC. Пример: (301, 3).",
    solutionSql: `
      SELECT p.post_id, COUNT(r.reaction_id) AS reactions_cnt
      FROM posts p
      LEFT JOIN reactions r ON r.post_id = p.post_id
      GROUP BY p.post_id
      HAVING COUNT(r.reaction_id) >= 2
      ORDER BY reactions_cnt DESC, p.post_id;
    `
  },
  {
    id: "tb_49",
    dataset: "billing",
    level: "easy",
    title: "Аккаунты с unpaid инвойсами",
    prompt: "Выведи колонки account_name, unpaid_invoices. unpaid_invoices = COUNT(*) по invoices.status='unpaid'. Сортировка: unpaid_invoices DESC, account_name ASC. Пример: ('terra', 1).",
    solutionSql: `
      SELECT s.account_name, COUNT(i.invoice_id) AS unpaid_invoices
      FROM subscriptions s
      JOIN invoices i ON i.sub_id = s.sub_id
      WHERE i.status = 'unpaid'
      GROUP BY s.account_name
      ORDER BY unpaid_invoices DESC, s.account_name;
    `
  },
  {
    id: "tb_50",
    dataset: "billing",
    level: "medium",
    title: "MRR по планам",
    prompt: "Выведи колонки plan_name, active_subs, mrr. mrr = active_subs * monthly_price только для subscriptions.status='active'. Сортировка: mrr DESC. Пример: ('enterprise', 2, 15980).",
    solutionSql: `
      SELECT p.plan_name, COUNT(s.sub_id) AS active_subs, COUNT(s.sub_id) * p.monthly_price AS mrr
      FROM plans p
      LEFT JOIN subscriptions s ON s.plan_id = p.plan_id AND s.status = 'active'
      GROUP BY p.plan_id, p.plan_name, p.monthly_price
      ORDER BY mrr DESC, p.plan_name;
    `
  },
  {
    id: "tb_51",
    dataset: "billing",
    level: "medium",
    title: "Инвойсы без успешного платежа",
    prompt: "Выведи колонки invoice_id, amount, invoice_status для инвойсов, где нет payment.status='succeeded'. Сортировка: invoice_id ASC. Пример: (404, 990, 'unpaid').",
    solutionSql: `
      SELECT i.invoice_id, i.amount, i.status AS invoice_status
      FROM invoices i
      LEFT JOIN payments p
        ON p.invoice_id = i.invoice_id
        AND p.status = 'succeeded'
      WHERE p.payment_id IS NULL
      ORDER BY i.invoice_id;
    `
  },
  {
    id: "tb_52",
    dataset: "billing",
    level: "hard",
    title: "Платежная успешность по методу",
    prompt: "Выведи колонки payment_method, success_rate. success_rate = succeeded_cnt / all_cnt. Округли до 3 знаков. Сортировка: success_rate DESC. Пример: ('bank', 1.0).",
    solutionSql: `
      SELECT
        payment_method,
        ROUND(SUM(CASE WHEN status = 'succeeded' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 3) AS success_rate
      FROM payments
      GROUP BY payment_method
      ORDER BY success_rate DESC, payment_method;
    `
  },
  {
    id: "tb_53",
    dataset: "ads",
    level: "easy",
    title: "CTR по кампаниям",
    prompt: "Выведи колонки campaign_id, campaign_name, ctr. ctr = SUM(clicks) / SUM(impressions). Округли до 4 знаков. Сортировка: ctr DESC. Пример: (5, 'B2B Leads', 0.0453).",
    solutionSql: `
      SELECT
        c.campaign_id,
        c.campaign_name,
        ROUND(SUM(k.clicks) * 1.0 / SUM(i.impressions), 4) AS ctr
      FROM campaigns c
      JOIN impressions i ON i.campaign_id = c.campaign_id
      JOIN clicks k ON k.campaign_id = c.campaign_id AND k.event_date = i.event_date
      GROUP BY c.campaign_id, c.campaign_name
      ORDER BY ctr DESC, c.campaign_id;
    `
  },
  {
    id: "tb_54",
    dataset: "ads",
    level: "medium",
    title: "ROAS по кампаниям",
    prompt: "Выведи колонки campaign_id, campaign_name, roas. roas = SUM(revenue) / SUM(spend). Округли до 3 знаков. Сортировка: roas DESC. Пример: (5, 'B2B Leads', 2.82).",
    solutionSql: `
      SELECT
        c.campaign_id,
        c.campaign_name,
        ROUND(SUM(k.revenue) * 1.0 / SUM(i.spend), 3) AS roas
      FROM campaigns c
      JOIN impressions i ON i.campaign_id = c.campaign_id
      JOIN clicks k ON k.campaign_id = c.campaign_id AND k.event_date = i.event_date
      GROUP BY c.campaign_id, c.campaign_name
      ORDER BY roas DESC, c.campaign_id;
    `
  },
  {
    id: "tb_55",
    dataset: "ads",
    level: "medium",
    title: "Конверсия клика в покупку",
    prompt: "Выведи колонки campaign_id, conv_rate. conv_rate = SUM(conversions) / SUM(clicks). Округли до 4 знаков. Сортировка: conv_rate DESC. Пример: (5, 0.1200).",
    solutionSql: `
      SELECT
        campaign_id,
        ROUND(SUM(conversions) * 1.0 / SUM(clicks), 4) AS conv_rate
      FROM clicks
      GROUP BY campaign_id
      ORDER BY conv_rate DESC, campaign_id;
    `
  },
  {
    id: "tb_56",
    dataset: "ads",
    level: "hard",
    title: "Дни, когда spend превысил бюджет",
    prompt: "Выведи колонки campaign_id, campaign_name, event_date, spend, daily_budget где spend > daily_budget. Сортировка: campaign_id, event_date. Пример: (3, 'Video Reach', '2026-05-21', 11200, 15000) — в этом датасете может быть пусто.",
    solutionSql: `
      SELECT c.campaign_id, c.campaign_name, i.event_date, i.spend, c.daily_budget
      FROM campaigns c
      JOIN impressions i ON i.campaign_id = c.campaign_id
      WHERE i.spend > c.daily_budget
      ORDER BY c.campaign_id, i.event_date;
    `
  }
];

TASK_BANK.push(...EXTRA_TASKS);

let sqlPromise = null;
let db = null;
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AS", "DISTINCT", "COUNT",
  "SUM", "AVG", "MIN", "MAX", "CASE", "WHEN", "THEN", "ELSE", "END", "AND", "OR",
  "NOT", "IN", "EXISTS", "LIKE", "BETWEEN", "IS", "NULL", "UNION", "ALL", "WITH",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP",
  "ALTER", "ADD", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CHECK", "DEFAULT",
  "VIEW", "INDEX", "IF"
];

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDatasetLibrary() {
  return { ...BUILTIN_DATASETS, ...loadJson(CUSTOM_DATASETS_KEY, {}) };
}

function isBuiltInDataset(id) {
  return Object.prototype.hasOwnProperty.call(BUILTIN_DATASETS, id);
}

function normalizeDatasetId(raw) {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function loadState() {
  return loadJson(STATE_KEY, {
    dataset: "shop",
    sql: "",
    activeTaskId: "",
    taskDatasetFilter: "all",
    taskLevelFilter: "all"
  });
}

function saveState(state) {
  saveJson(STATE_KEY, state);
}

function loadProgress() {
  return loadJson(TASK_PROGRESS_KEY, {});
}

function saveProgress(progress) {
  saveJson(TASK_PROGRESS_KEY, progress);
}

function splitSqlStatements(sql) {
  const text = sql.trim();
  const out = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (!inDouble && !inBacktick && ch === "'" && next === "'") {
      buf += "''";
      i += 1;
      continue;
    }
    if (!inSingle && !inBacktick && ch === "\"") {
      inDouble = !inDouble;
      buf += ch;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`") {
      inBacktick = !inBacktick;
      buf += ch;
      continue;
    }
    if (!inDouble && !inBacktick && ch === "'") {
      inSingle = !inSingle;
      buf += ch;
      continue;
    }
    if (!inSingle && !inDouble && !inBacktick && ch === ";") {
      const ready = buf.trim();
      if (ready) out.push(ready);
      buf = "";
      continue;
    }
    buf += ch;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = window.initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/${file}`
    });
  }
  return sqlPromise;
}

async function createDbFromSeed(seedSql) {
  const SQL = await getSql();
  const tempDb = new SQL.Database();
  if (seedSql.trim()) tempDb.run(seedSql);
  return tempDb;
}

async function initDb(datasetId, library) {
  const dataset = library[datasetId];
  if (!dataset) throw new Error(`Датасет '${datasetId}' не найден.`);
  if (db) db.close();
  db = await createDbFromSeed(dataset.seed);
}

async function cloneDb(sourceDb) {
  const SQL = await getSql();
  return new SQL.Database(sourceDb.export());
}

function runSql(targetDb, sql) {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error("SQL-запрос пуст.");
  let lastResult = null;
  let changed = 0;
  statements.forEach((statement, idx) => {
    try {
      const before = targetDb.getRowsModified();
      const sets = targetDb.exec(statement);
      changed += Math.max(targetDb.getRowsModified() - before, 0);
      if (sets.length) lastResult = sets[sets.length - 1];
    } catch (error) {
      throw new Error(`Ошибка в выражении ${idx + 1}: ${error.message}`);
    }
  });
  return {
    summary: lastResult
      ? `OK: выражений ${statements.length}, строк в результате: ${lastResult.values.length}`
      : `OK: выражений ${statements.length}, изменено строк: ${changed}`,
    lastResult
  };
}

function quoteIdentifier(name) {
  return `"${String(name).replace(/"/g, "\"\"")}"`;
}

function getSchemaSnapshot(targetDb) {
  const tablesRs = targetDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
  const tableNames = (tablesRs[0]?.values || []).map((row) => String(row[0]));
  return tableNames.map((tableName) => {
    const infoRs = targetDb.exec(`PRAGMA table_info(${quoteIdentifier(tableName)})`);
    const columns = (infoRs[0]?.values || []).map((row) => ({
      name: String(row[1]),
      type: String(row[2] || "TEXT"),
      notNull: Number(row[3]) === 1,
      pk: Number(row[5]) === 1
    }));
    return { tableName, columns };
  });
}

function normalizeResult(result) {
  if (!result) return { columns: [], rows: [] };
  return {
    columns: [...result.columns],
    rows: result.values.map((row) => row.map((v) => (v === null ? "NULL" : String(v))))
  };
}

function compareResults(a, b) {
  const left = normalizeResult(a);
  const right = normalizeResult(b);
  if (left.columns.length !== right.columns.length) return { ok: false, message: "Количество колонок не совпадает." };
  for (let i = 0; i < left.columns.length; i += 1) {
    if (left.columns[i] !== right.columns[i]) return { ok: false, message: `Колонка #${i + 1} не совпадает.` };
  }
  if (left.rows.length !== right.rows.length) return { ok: false, message: `Количество строк не совпадает (${left.rows.length} vs ${right.rows.length}).` };
  const lRows = left.rows.map((r) => JSON.stringify(r)).sort();
  const rRows = right.rows.map((r) => JSON.stringify(r)).sort();
  for (let i = 0; i < lRows.length; i += 1) {
    if (lRows[i] !== rRows[i]) return { ok: false, message: "Результат запроса отличается от ожидаемого." };
  }
  return { ok: true, message: "Верно: задача решена." };
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

function renderSchema(host, schema) {
  if (!schema.length) {
    host.innerHTML = "<p class='sql-message'>В выбранном датасете нет таблиц.</p>";
    return;
  }
  host.innerHTML = `
    <p class="sql-message">Структура базы данных</p>
    ${schema.map((table) => `
      <section class="schema-block">
        <h3>${escapeHtml(table.tableName)}</h3>
        <div class="result-scroll">
          <table class="result-table">
            <thead>
              <tr>
                <th>column</th>
                <th>type</th>
                <th>not null</th>
                <th>pk</th>
              </tr>
            </thead>
            <tbody>
              ${table.columns.map((col) => `
                <tr>
                  <td>${escapeHtml(col.name)}</td>
                  <td>${escapeHtml(col.type)}</td>
                  <td>${col.notNull ? "yes" : "no"}</td>
                  <td>${col.pk ? "yes" : "no"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `).join("")}
  `;
}

function appendHistory(entry) {
  const history = loadJson(HISTORY_KEY, []);
  history.unshift(entry);
  saveJson(HISTORY_KEY, history.slice(0, 80));
}

function renderHistory(host, onLoad) {
  const history = loadJson(HISTORY_KEY, []);
  if (!history.length) {
    host.innerHTML = "<p class='sql-message'>История пока пустая.</p>";
    return;
  }
  host.innerHTML = history.map((item, i) => `
    <article class="history-item">
      <div class="history-meta">
        <strong>${escapeHtml(item.dataset.toUpperCase())}</strong>
        <span>${escapeHtml(new Date(item.at).toLocaleString("ru-RU", { hour12: false }))}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <code>${escapeHtml(item.sql.slice(0, 140))}${item.sql.length > 140 ? "..." : ""}</code>
      <div class="saved-task-actions"><button class="btn ghost" data-load-history="${i}" type="button">Вставить</button></div>
    </article>
  `).join("");
  host.querySelectorAll("[data-load-history]").forEach((btn) => {
    btn.addEventListener("click", () => onLoad(history[Number(btn.getAttribute("data-load-history"))]));
  });
}

function renderTaskSelect(selectEl, activeTaskId, progress) {
  selectEl.innerHTML = "";
  const freeOption = new Option("Свободный режим (без задачи)", "");
  selectEl.append(freeOption);
  TASK_BANK.forEach((task) => {
    const done = Boolean(progress?.[task.id]);
    const label = `${done ? "✓ " : ""}${task.title} — ${task.dataset} / ${task.level.toUpperCase()}`;
    const option = new Option(label, task.id);
    if (done) {
      option.className = "task-option-done";
      option.style.color = "#0a7a54";
      option.style.fontWeight = "700";
      option.style.background = "#e9faf3";
    }
    selectEl.append(option);
  });
  selectEl.value = activeTaskId || "";
}

function stringifyPreviewCell(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NaN";
  return String(value);
}

function formatTaskOutputHint(hint) {
  if (!hint) return "";
  const cols = hint.columns.length ? hint.columns.join(", ") : "нет колонок";
  const sample = hint.sampleRows.length
    ? hint.sampleRows.map((row) => `(${row.map(stringifyPreviewCell).join(", ")})`).join("; ")
    : "пустой результат";
  return `
    <div class="task-output-box">
      <p class="task-output-hint"><strong>Ожидаемые колонки:</strong> ${escapeHtml(cols)}</p>
      <p class="task-output-example"><strong>Пример вывода:</strong> ${escapeHtml(sample)}</p>
    </div>
  `;
}

function formatExpectedRowsTable(columns, rows) {
  const cols = Array.isArray(columns) ? columns : [];
  const data = Array.isArray(rows) ? rows : [];
  if (!cols.length) {
    return "<p class='task-solution-note'>Не удалось построить превью эталонного результата.</p>";
  }
  return `
    <div class="result-scroll task-solution-table">
      <table class="result-table">
        <thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>
          ${data.length
            ? data.map((row) => `<tr>${row.map((v) => `<td>${escapeHtml(v === null ? "NULL" : v)}</td>`).join("")}</tr>`).join("")
            : `<tr><td colspan="${cols.length}">Пустой результат</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function extractTaskColumns(prompt) {
  const match = String(prompt || "").match(/колонки?\s*[:]\s*([^\.]+)/i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectTaskClauses(task) {
  const src = `${task.title || ""} ${task.prompt || ""} ${task.solutionSql || ""}`.toUpperCase();
  const clauses = [];
  ["WHERE", "JOIN", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "DISTINCT", "WITH"].forEach((part) => {
    if (src.includes(part)) clauses.push(part);
  });
  return clauses.length ? clauses : ["SELECT", "FROM"];
}

function buildTaskHints(task, outputHint) {
  const columns = extractTaskColumns(task.prompt);
  const columnText = columns.length ? columns.join(", ") : "только поля, которые указаны в условии";
  const clauses = detectTaskClauses(task).join(" -> ");
  const sampleRow = outputHint?.sampleRows?.[0]
    ? `Пример одной строки: (${outputHint.sampleRows[0].map(stringifyPreviewCell).join(", ")}).`
    : "Если результат пустой, проверь фильтры и JOIN-условия.";
  return [
    `Сначала собери минимальный SELECT: верни ${columnText}, без лишних вычислений.`,
    `Строи запрос по этапам: FROM/таблицы -> ${clauses}.`,
    `После каждого шага запускай SQL и проверяй, как меняется количество строк.`,
    sampleRow,
    "Перед финальной проверкой сверяй: названия колонок, порядок сортировки, отсутствие дублей и корректность NULL."
  ];
}

function formatTaskHints(task, outputHint, revealed = 0, hintKey = "") {
  const hints = buildTaskHints(task, outputHint);
  const safeRevealed = Math.max(0, Math.min(hints.length, Number(revealed) || 0));
  return `
    <details class="task-hints">
      <summary>Hints (step-by-step)</summary>
      <div class="hint-widget" data-hint-widget data-hint-key="${escapeHtml(hintKey)}" data-hint-total="${hints.length}">
        <p class="task-hints-progress">Hints opened: <span data-hint-progress>${safeRevealed}</span>/${hints.length}</p>
        <ol class="task-hints-list">
          ${hints.map((hint, idx) => `<li class="task-hint-item ${idx < safeRevealed ? "" : "is-hidden"}">${escapeHtml(hint)}</li>`).join("")}
        </ol>
        <div class="task-hints-actions">
          <button class="btn ghost" type="button" data-hint-action="next">Show next hint</button>
          <button class="btn ghost" type="button" data-hint-action="reset">Hide all hints</button>
        </div>
      </div>
    </details>
  `;
}

function formatTaskReference(task, outputHint) {
  if (!task) return "";
  const columns = outputHint?.columns || [];
  const rows = outputHint?.rows || [];
  const rowsNote = rows.length ? `Строк в эталоне: ${rows.length}.` : "Строк в эталоне: 0.";
  return `
    <details class="task-solution">
      <summary>Показать эталон (для самопроверки)</summary>
      <p class="task-solution-note">${rowsNote}</p>
      <pre class="task-solution-sql"><code>${escapeHtml((task.solutionSql || "").trim())}</code></pre>
      <p class="task-solution-note"><strong>Ожидаемый результат:</strong></p>
      ${formatExpectedRowsTable(columns, rows)}
    </details>
  `;
}

function bindHintWidgets(scope, onChange) {
  if (!scope) return;
  scope.querySelectorAll("[data-hint-widget]").forEach((widget) => {
    if (widget.dataset.hintBound === "1") return;
    widget.dataset.hintBound = "1";
    const total = Number(widget.getAttribute("data-hint-total")) || 0;
    const key = widget.getAttribute("data-hint-key") || "";
    const progressEl = widget.querySelector("[data-hint-progress]");
    const items = Array.from(widget.querySelectorAll(".task-hint-item"));
    const sync = () => {
      const revealed = items.filter((it) => !it.classList.contains("is-hidden")).length;
      if (progressEl) progressEl.textContent = String(revealed);
      const nextBtn = widget.querySelector("[data-hint-action='next']");
      if (nextBtn) nextBtn.disabled = revealed >= total;
      if (typeof onChange === "function") onChange(key, revealed, total);
    };
    widget.querySelector("[data-hint-action='next']")?.addEventListener("click", () => {
      const hidden = items.find((it) => it.classList.contains("is-hidden"));
      if (hidden) hidden.classList.remove("is-hidden");
      sync();
    });
    widget.querySelector("[data-hint-action='reset']")?.addEventListener("click", () => {
      items.forEach((it) => it.classList.add("is-hidden"));
      sync();
    });
    sync();
  });
}

function renderTaskCard(cardEl, task, done, datasetLabel, outputHints, activeHintProgress) {
  if (!task) {
    cardEl.innerHTML = `
      <h2>Свободный режим</h2>
      <p>Без активной задачи: можешь писать любые запросы на выбранном датасете.</p>
      <div class="sandbox3-task-meta">
        <span class="chip">Датасет: ${escapeHtml(datasetLabel || "не выбран")}</span>
        <span class="chip">Уровень: —</span>
        <span class="chip">Статус: —</span>
      </div>
    `;
    return;
  }
  const hintHtml = formatTaskOutputHint(outputHints?.[task.id]);
  const hintsBox = formatTaskHints(task, outputHints?.[task.id], Number(activeHintProgress?.[task.id] || 0), `active:${task.id}`);
  const referenceBox = formatTaskReference(task, outputHints?.[task.id]);
  cardEl.innerHTML = `
    <h2>${escapeHtml(task.title)}</h2>
    <p>${escapeHtml(task.prompt)}</p>
    ${hintHtml}
    ${hintsBox}
    ${referenceBox}
    <div class="sandbox3-task-meta">
      <span class="chip">Датасет: ${escapeHtml(datasetLabel)}</span>
      <span class="chip">Уровень: ${escapeHtml(task.level.toUpperCase())}</span>
      <span class="chip ${done ? "chip-ok" : ""}">Статус: ${done ? "Выполнено" : "Не выполнено"}</span>
    </div>
  `;
}

function renderTaskBank(host, filters, progress, library, outputHints, bankHintProgress) {
  const tasks = TASK_BANK.filter((task) => (filters.dataset === "all" || task.dataset === filters.dataset) && (filters.level === "all" || task.level === filters.level));
  if (!tasks.length) {
    host.innerHTML = "<p class='sql-message'>По фильтрам задач нет.</p>";
    return;
  }
  host.innerHTML = tasks.map((task) => `
    <article class="task-bank-card" data-task-id="${task.id}">
      <div class="task-bank-meta">
        <span class="chip">${escapeHtml(library[task.dataset]?.label || task.dataset)}</span>
        <span class="chip">${escapeHtml(task.level.toUpperCase())}</span>
        <span class="chip ${progress[task.id] ? "chip-ok" : ""}">${progress[task.id] ? "Выполнено" : "Не выполнено"}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.prompt)}</p>
      ${formatTaskOutputHint(outputHints?.[task.id])}
      ${formatTaskHints(task, outputHints?.[task.id], Number(bankHintProgress?.[task.id] || 0), `bank:${task.id}`)}
      <div class="saved-task-actions"><button class="btn ghost" data-pick-task="${task.id}" type="button">Решать задачу</button></div>
    </article>
  `).join("");
}

async function main() {
  const datasetSelect = document.getElementById("dataset");
  const loadDatasetBtn = document.getElementById("load-dataset");
  const deleteDatasetBtn = document.getElementById("delete-dataset");
  const resetDbBtn = document.getElementById("reset-db");
  const runBtn = document.getElementById("run-sql");
  const showSchemaBtn = document.getElementById("show-schema");
  const clearHistoryBtn = document.getElementById("clear-history");
  const status = document.getElementById("sandbox-status");
  const result = document.getElementById("sandbox-result");
  const sqlInput = document.getElementById("sandbox-sql");
  const autocompleteHint = document.getElementById("sql-autocomplete-hint");
  const historyHost = document.getElementById("history-list");
  const datasetLockHint = document.getElementById("dataset-lock-hint");

  const taskSelect = document.getElementById("task-select");
  const checkTaskBtn = document.getElementById("check-task");
  const resetTaskProgressBtn = document.getElementById("reset-task-progress");
  const activeTaskCard = document.getElementById("active-task-card");
  const taskAnalyticsHost = document.getElementById("task-analytics");
  const taskDatasetFilter = document.getElementById("task-dataset-filter");
  const taskLevelFilter = document.getElementById("task-level-filter");
  const taskRandomBtn = document.getElementById("task-random");
  const taskBankHost = document.getElementById("task-bank-list");

  const newDatasetId = document.getElementById("new-dataset-id");
  const newDatasetName = document.getElementById("new-dataset-name");
  const newDatasetSql = document.getElementById("new-dataset-sql");
  const saveDatasetBtn = document.getElementById("save-dataset");
  const importDatasetsBtn = document.getElementById("import-datasets");
  const exportDatasetsBtn = document.getElementById("export-datasets");
  const importDatasetsFile = document.getElementById("import-datasets-file");

  const state = loadState();
  let activeDataset = state.dataset;
  let activeTaskId = state.activeTaskId || "";
  let progress = loadProgress();
  let activeHintProgress = loadJson(TASK_HINT_PROGRESS_KEY, {});
  let bankHintProgress = {};
  let autocompleteWords = [];
  let activeAutocomplete = null;
  let taskOutputHints = {};

  function setStatus(text, kind = "") {
    status.className = `check-status${kind ? ` ${kind}` : ""}`;
    status.textContent = text;
  }

  function persist() {
    saveState({
      dataset: activeDataset,
      sql: sqlInput.value,
      activeTaskId,
      taskDatasetFilter: taskDatasetFilter.value,
      taskLevelFilter: taskLevelFilter.value
    });
  }

  function getActiveTask() {
    return TASK_BANK.find((task) => task.id === activeTaskId) || null;
  }

  function renderTaskAnalytics(host, progressMap, activeDatasetId) {
    if (!host) return;
    const doneTotal = TASK_BANK.filter((task) => Boolean(progressMap[task.id])).length;
    const total = TASK_BANK.length;
    const pct = total ? Math.round((doneTotal / total) * 100) : 0;
    const levels = ["easy", "medium", "hard"].map((level) => {
      const items = TASK_BANK.filter((task) => task.level === level);
      const done = items.filter((task) => Boolean(progressMap[task.id])).length;
      return `${level.toUpperCase()}: ${done}/${items.length}`;
    });
    const datasetItems = TASK_BANK.filter((task) => task.dataset === activeDatasetId);
    const datasetDone = datasetItems.filter((task) => Boolean(progressMap[task.id])).length;
    const datasetPct = datasetItems.length ? Math.round((datasetDone / datasetItems.length) * 100) : 0;
    host.innerHTML = `
      <div class="task-analytics-grid">
        <span class="chip">Всего выполнено: ${doneTotal}/${total} (${pct}%)</span>
        <span class="chip">По датасету: ${datasetDone}/${datasetItems.length} (${datasetPct}%)</span>
        <span class="chip">${levels[0]}</span>
        <span class="chip">${levels[1]}</span>
        <span class="chip">${levels[2]}</span>
      </div>
    `;
  }

  function refreshAutocompleteWords() {
    const words = new Set(SQL_KEYWORDS);
    if (db) {
      getSchemaSnapshot(db).forEach((table) => {
        words.add(table.tableName);
        table.columns.forEach((col) => words.add(col.name));
      });
    }
    autocompleteWords = Array.from(words);
  }

  
  async function buildTaskOutputHints(library) {
    const hints = {};
    const baseByDataset = {};
    try {
      for (const task of TASK_BANK) {
        const dataset = library[task.dataset];
        if (!dataset) continue;
        if (!baseByDataset[task.dataset]) {
          baseByDataset[task.dataset] = await createDbFromSeed(dataset.seed || "");
        }
        let previewDb = null;
        try {
          previewDb = await cloneDb(baseByDataset[task.dataset]);
          const runData = runSql(previewDb, task.solutionSql || "");
          const result = runData.lastResult || { columns: [], values: [] };
          hints[task.id] = {
            columns: Array.isArray(result.columns) ? result.columns.map((c) => String(c)) : [],
            sampleRows: Array.isArray(result.values) ? result.values.slice(0, 2) : [],
            rows: Array.isArray(result.values) ? result.values : []
          };
        } catch {
          hints[task.id] = { columns: [], sampleRows: [], rows: [] };
        } finally {
          if (previewDb) previewDb.close();
        }
      }
    } finally {
      Object.values(baseByDataset).forEach((baseDb) => {
        if (baseDb) baseDb.close();
      });
    }
    taskOutputHints = hints;
  }
  function clearAutocompleteHint() {
    activeAutocomplete = null;
    autocompleteHint.textContent = "";
    autocompleteHint.classList.remove("visible");
  }

  function getTokenAtCaret(text, caretPos) {
    const left = text.slice(0, caretPos);
    const match = left.match(/([A-Za-z_][A-Za-z0-9_]*)$/);
    if (!match) return null;
    const token = match[1];
    return {
      token,
      start: caretPos - token.length,
      end: caretPos
    };
  }

  function pickAutocompleteWord(token) {
    if (!token) return null;
    const normalized = token.toLowerCase();
    const candidates = autocompleteWords
      .filter((word) => word.toLowerCase().startsWith(normalized) && word.toLowerCase() !== normalized)
      .sort((a, b) => a.length - b.length || a.localeCompare(b, "ru-RU"));
    return candidates[0] || null;
  }

  function updateAutocompleteHint() {
    const tokenInfo = getTokenAtCaret(sqlInput.value, sqlInput.selectionStart);
    if (!tokenInfo) {
      clearAutocompleteHint();
      return;
    }
    const suggestion = pickAutocompleteWord(tokenInfo.token);
    if (!suggestion) {
      clearAutocompleteHint();
      return;
    }
    activeAutocomplete = {
      start: tokenInfo.start,
      end: tokenInfo.end,
      suggestion
    };
    autocompleteHint.textContent = `Tab: ${suggestion}`;
    autocompleteHint.classList.add("visible");
  }

  function acceptAutocompleteSuggestion() {
    if (!activeAutocomplete) return false;
    const { start, end, suggestion } = activeAutocomplete;
    const currentToken = sqlInput.value.slice(start, end);
    if (!currentToken || !suggestion.toLowerCase().startsWith(currentToken.toLowerCase())) {
      clearAutocompleteHint();
      return false;
    }
    const before = sqlInput.value.slice(0, start);
    const after = sqlInput.value.slice(end);
    sqlInput.value = `${before}${suggestion}${after}`;
    const newCaret = start + suggestion.length;
    sqlInput.selectionStart = newCaret;
    sqlInput.selectionEnd = newCaret;
    persist();
    updateAutocompleteHint();
    return true;
  }

  function renderDatasetSelectors() {
    const library = getDatasetLibrary();
    const ids = Object.keys(library);
    if (!ids.length) throw new Error("Нет датасетов.");
    if (!library[activeDataset]) activeDataset = ids[0];
    datasetSelect.innerHTML = ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(library[id].label)}</option>`).join("");
    datasetSelect.value = activeDataset;
    const currentFilter = taskDatasetFilter.value || state.taskDatasetFilter || "all";
    taskDatasetFilter.innerHTML = [`<option value="all">Все датасеты</option>`, ...ids.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(library[id].label)}</option>`)].join("");
    taskDatasetFilter.value = taskDatasetFilter.querySelector(`option[value="${currentFilter}"]`) ? currentFilter : "all";
  }

  async function applyTaskSelection(taskId) {
    activeTaskId = taskId || "";
    const task = getActiveTask();
    if (task) {
      activeDataset = task.dataset;
      await initDb(activeDataset, getDatasetLibrary());
      refreshAutocompleteWords();
      setStatus(`Задача выбрана. Подключен датасет '${getDatasetLibrary()[activeDataset]?.label || activeDataset}'.`, "ok");
    } else {
      setStatus("Включен свободный режим.");
    }
    renderAll();
    persist();
  }

  function renderAll() {
    const library = getDatasetLibrary();
    const activeTask = getActiveTask();
    const taskMode = Boolean(activeTask);
    datasetSelect.value = activeDataset;
    datasetSelect.disabled = taskMode;
    loadDatasetBtn.hidden = taskMode;
    deleteDatasetBtn.hidden = taskMode;
    datasetLockHint.hidden = !taskMode;
    renderTaskSelect(taskSelect, activeTaskId, progress);
    renderTaskCard(activeTaskCard, activeTask, Boolean(progress[activeTaskId]), library[activeDataset]?.label || activeDataset, taskOutputHints, activeHintProgress);
    renderTaskAnalytics(taskAnalyticsHost, progress, activeDataset);
    renderTaskBank(taskBankHost, { dataset: taskDatasetFilter.value, level: taskLevelFilter.value }, progress, library, taskOutputHints, bankHintProgress);
    bindHintWidgets(activeTaskCard, (key, revealed) => {
      if (!key.startsWith("active:")) return;
      const taskId = key.slice("active:".length);
      activeHintProgress[taskId] = revealed;
      saveJson(TASK_HINT_PROGRESS_KEY, activeHintProgress);
    });
    bindHintWidgets(taskBankHost, (key, revealed) => {
      if (!key.startsWith("bank:")) return;
      const taskId = key.slice("bank:".length);
      bankHintProgress[taskId] = revealed;
    });
    taskBankHost.querySelectorAll("[data-pick-task]").forEach((btn) => {
      btn.addEventListener("click", () => applyTaskSelection(btn.getAttribute("data-pick-task")));
    });
  }

  async function executeSql() {
    try {
      const runData = runSql(db, sqlInput.value);
      renderResult(result, runData);
      refreshAutocompleteWords();
      let message = "Код выполнен.";
      const task = getActiveTask();
      if (task) {
        let userDb = null;
        let refDb = null;
        try {
          userDb = await cloneDb(db);
          refDb = await cloneDb(db);
          const userRun = runSql(userDb, sqlInput.value);
          const refRun = runSql(refDb, task.solutionSql);
          const verdict = compareResults(userRun.lastResult, refRun.lastResult);
          if (verdict.ok) {
            progress[task.id] = true;
            saveProgress(progress);
            message = "Код выполнен. Задача автоматически отмечена как выполненная.";
            renderAll();
          }
        } catch {
          // Silent: manual check remains available.
        } finally {
          if (userDb) userDb.close();
          if (refDb) refDb.close();
        }
      }
      setStatus(message, "ok");
      appendHistory({ dataset: activeDataset, sql: sqlInput.value, summary: runData.summary, at: Date.now() });
      renderHistory(historyHost, (item) => {
        activeDataset = item.dataset;
        sqlInput.value = item.sql;
        renderAll();
        persist();
        setStatus("Запрос из истории вставлен.");
      });
      persist();
    } catch (error) {
      result.innerHTML = "";
      setStatus(`Ошибка: ${error.message}`, "fail");
    }
  }

  sqlInput.value = state.sql || "";
  taskLevelFilter.value = state.taskLevelFilter || "all";
  renderDatasetSelectors();
  await buildTaskOutputHints(getDatasetLibrary());
  await initDb(activeDataset, getDatasetLibrary());
  refreshAutocompleteWords();
  updateAutocompleteHint();
  renderHistory(historyHost, (item) => {
    activeDataset = item.dataset;
    sqlInput.value = item.sql;
    updateAutocompleteHint();
    renderAll();
    persist();
    setStatus("Запрос из истории вставлен.");
  });
  renderAll();

  loadDatasetBtn.addEventListener("click", async () => {
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshAutocompleteWords();
    updateAutocompleteHint();
    renderAll();
    setStatus("Датасет перезагружен.", "ok");
    persist();
  });

  deleteDatasetBtn.addEventListener("click", async () => {
    const id = datasetSelect.value;
    if (isBuiltInDataset(id)) {
      setStatus("Базовые датасеты удалить нельзя.", "fail");
      return;
    }
    const custom = loadJson(CUSTOM_DATASETS_KEY, {});
    delete custom[id];
    saveJson(CUSTOM_DATASETS_KEY, custom);
    renderDatasetSelectors();
    await buildTaskOutputHints(getDatasetLibrary());
    activeDataset = datasetSelect.value;
    await initDb(activeDataset, getDatasetLibrary());
    refreshAutocompleteWords();
    updateAutocompleteHint();
    renderAll();
    setStatus("Кастомный датасет удален.", "ok");
    persist();
  });

  resetDbBtn.addEventListener("click", async () => {
    await initDb(activeDataset, getDatasetLibrary());
    refreshAutocompleteWords();
    updateAutocompleteHint();
    setStatus("БД сброшена в исходное состояние датасета.");
  });

  runBtn.addEventListener("click", executeSql);
  showSchemaBtn.addEventListener("click", () => {
    try {
      renderSchema(result, getSchemaSnapshot(db));
      setStatus("Структура БД показана.", "ok");
    } catch (error) {
      setStatus(`Ошибка чтения структуры БД: ${error.message}`, "fail");
    }
  });
  sqlInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (acceptAutocompleteSuggestion()) {
        e.preventDefault();
        return;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      executeSql();
    }
  });
  sqlInput.addEventListener("input", () => {
    persist();
    updateAutocompleteHint();
  });
  sqlInput.addEventListener("click", updateAutocompleteHint);
  sqlInput.addEventListener("keyup", updateAutocompleteHint);

  taskSelect.addEventListener("change", () => {
    applyTaskSelection(taskSelect.value || "");
  });

  checkTaskBtn.addEventListener("click", async () => {
    const task = getActiveTask();
    if (!task) {
      setStatus("Сначала выбери задачу для проверки.", "fail");
      return;
    }
    if (!sqlInput.value.trim()) {
      setStatus("SQL-запрос пустой.", "fail");
      return;
    }
    let userDb = null;
    let refDb = null;
    try {
      userDb = await cloneDb(db);
      refDb = await cloneDb(db);
      const userRun = runSql(userDb, sqlInput.value);
      const refRun = runSql(refDb, task.solutionSql);
      renderResult(result, userRun);
      const verdict = compareResults(userRun.lastResult, refRun.lastResult);
      if (verdict.ok) {
        progress[task.id] = true;
        saveProgress(progress);
        setStatus("Решение принято: задача отмечена как выполненная.", "ok");
      } else {
        setStatus(verdict.message, "fail");
      }
      renderAll();
    } catch (error) {
      setStatus(`Ошибка проверки: ${error.message}`, "fail");
    } finally {
      if (userDb) userDb.close();
      if (refDb) refDb.close();
    }
  });

  resetTaskProgressBtn.addEventListener("click", () => {
    const task = getActiveTask();
    if (!task) {
      setStatus("Нет активной задачи для сброса.", "fail");
      return;
    }
    delete progress[task.id];
    saveProgress(progress);
    renderAll();
    setStatus("Прогресс задачи сброшен.");
  });

  taskDatasetFilter.addEventListener("change", () => {
    renderAll();
    persist();
  });

  taskLevelFilter.addEventListener("change", () => {
    renderAll();
    persist();
  });

  taskRandomBtn.addEventListener("click", () => {
    const cards = Array.from(taskBankHost.querySelectorAll(".task-bank-card"));
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    cards.forEach((it) => it.classList.remove("task-bank-pick"));
    card.classList.add("task-bank-pick");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  clearHistoryBtn.addEventListener("click", () => {
    saveJson(HISTORY_KEY, []);
    renderHistory(historyHost, () => {});
    setStatus("История запусков очищена.");
  });

  saveDatasetBtn.addEventListener("click", async () => {
    const id = normalizeDatasetId(newDatasetId.value);
    const label = newDatasetName.value.trim();
    const seed = newDatasetSql.value.trim();
    if (!id || id.length < 2) {
      setStatus("Укажи корректный ID датасета.", "fail");
      return;
    }
    if (!label) {
      setStatus("Укажи название датасета.", "fail");
      return;
    }
    if (!seed) {
      setStatus("SQL-скрипт датасета пустой.", "fail");
      return;
    }
    try {
      const tempDb = await createDbFromSeed(seed);
      tempDb.close();
      const custom = loadJson(CUSTOM_DATASETS_KEY, {});
      custom[id] = { label, seed };
      saveJson(CUSTOM_DATASETS_KEY, custom);
      await buildTaskOutputHints(getDatasetLibrary());
      renderDatasetSelectors();
      renderAll();
      refreshAutocompleteWords();
      updateAutocompleteHint();
      setStatus(`Кастомный датасет '${id}' сохранен.`, "ok");
    } catch (error) {
      setStatus(`Ошибка SQL-скрипта датасета: ${error.message}`, "fail");
    }
  });

  exportDatasetsBtn.addEventListener("click", () => {
    const payload = { version: 1, exportedAt: Date.now(), datasets: loadJson(CUSTOM_DATASETS_KEY, {}) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sql-datasets-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Кастомные датасеты экспортированы.", "ok");
  });

  importDatasetsBtn.addEventListener("click", () => importDatasetsFile.click());
  importDatasetsFile.addEventListener("change", async () => {
    const file = importDatasetsFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = parsed.datasets || parsed;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        throw new Error("Ожидается JSON-объект datasets.");
      }
      const custom = loadJson(CUSTOM_DATASETS_KEY, {});
      let imported = 0;
      for (const [rawId, data] of Object.entries(incoming)) {
        const id = normalizeDatasetId(rawId);
        if (!id || isBuiltInDataset(id)) continue;
        const label = String(data?.label || "").trim();
        const seed = String(data?.seed || "").trim();
        if (!label || !seed) continue;
        const tempDb = await createDbFromSeed(seed);
        tempDb.close();
        custom[id] = { label, seed };
        imported += 1;
      }
      saveJson(CUSTOM_DATASETS_KEY, custom);
      await buildTaskOutputHints(getDatasetLibrary());
      renderDatasetSelectors();
      renderAll();
      refreshAutocompleteWords();
      updateAutocompleteHint();
      setStatus(`Импортировано датасетов: ${imported}.`, "ok");
    } catch (error) {
      setStatus(`Ошибка импорта: ${error.message}`, "fail");
    } finally {
      importDatasetsFile.value = "";
    }
  });
}

main();
