-- ═══════════════════════════════════════════════════════════
-- Eaty · 新增第 5 間食堂「5380 Cafe」（Ebeneezer's Kebabs & Pizzeria）
-- 2026-10-23｜來源：使用者提供的現場菜牌照片（WhatsApp 2026-10-23 10:22）
--
-- 位置：香港城市大學 康樂樓 5 樓 R5013（與 AC1 城大食坊同一幢樓，不同舖位）
-- 電話 +852 2395-3155｜週一至六 10:00–19:30｜清真認證｜無官方網上點餐
--
-- 內容：8 個分類／55 道菜（49 道上架、6 道菜牌已貼 SOLD OUT → available=false）
-- 可重複執行（全部 on conflict do update）
-- ═══════════════════════════════════════════════════════════

-- ── ① 食堂本體 ─────────────────────────────────────────
insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values
  ('5380', 5, '5380 Cafe', '5380 Cafe', '康樂樓 5 樓 R5013', '5/F, Amenities Building, R5013', '週一至六 10:00–19:30（週日及公眾假期休息）', 'Mon–Sat 10:00–19:30 (Sun & PH closed)', '中東菜（Ebeneezer''s）・電話 +852 2395-3155・付款：現金／八達通／AlipayHK／支付寶・清真認證（Halal）', 'Middle Eastern (Ebeneezer''s) · Tel +852 2395-3155 · Payment: Cash / Octopus / AlipayHK / Alipay · Halal certified', 'assets/5380/canteen.jpg', null)
on conflict (id) do update set
  sort = excluded.sort, zh = excluded.zh, en = excluded.en,
  bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en,
  hours_zh = excluded.hours_zh, hours_en = excluded.hours_en,
  fact_zh = excluded.fact_zh, fact_en = excluded.fact_en,
  photo = excluded.photo, order_url = excluded.order_url;

-- ── ② 八個分類 ─────────────────────────────────────────
insert into categories (id, sort, zh, en, meal, order_url) values
  ('卡巴', 82, '卡巴', 'Kebab', 'lunch,dinner', null),
  ('印式炒飯', 83, '印式炒飯', 'Biryani', 'lunch,dinner', null),
  ('咖喱配飯', 84, '咖喱配飯', 'Curry & Rice', 'lunch,dinner', null),
  ('沙律', 85, '沙律', 'Salad', 'lunch,dinner', null),
  ('薄餅', 86, '薄餅', 'Pizza', 'lunch,dinner', null),
  ('嗜肉者', 87, '嗜肉者', 'Meat Lovers', 'lunch,dinner', null),
  ('小食（5380）', 88, '小食（5380）', 'Side Orders', 'lunch,dinner', null),
  ('飲品（5380）', 89, '飲品（5380）', 'Drinks', 'lunch,dinner', null)
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, meal = excluded.meal;

-- ── ③ 菜品 ─────────────────────────────────────────────
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('5380-donar-lamb-kebab', '5380', '卡巴', '羊肉卡巴', 'Donar Lamb Kebab', 47.70, 'assets/5380/donar-lamb-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{signature}', true, 501),
  ('5380-gyros-chicken-kebab', '5380', '卡巴', '雞肉卡巴', 'Gyros Chicken Kebab', 45.60, 'assets/5380/gyros-chicken-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 502),
  ('5380-chicken-tikka-kebab', '5380', '卡巴', '串燒雞肉卡巴', 'Chicken Tikka Kebab', 45.60, 'assets/5380/chicken-tikka-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 503),
  ('5380-falafel-kebab', '5380', '卡巴', '雜菜疏豆卡巴', 'Falafel (Veg.) Kebab', 42.50, 'assets/5380/falafel-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian', '{value}', true, 504),
  ('5380-meatball-kebab', '5380', '卡巴', '印式肉丸卡巴', 'Meatball Kebab', 43.60, 'assets/5380/meatball-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 505),
  ('5380-real-beef-kebab', '5380', '卡巴', '牛肉卡巴', 'Real Beef Kebab', 49.80, 'assets/5380/real-beef-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 506),
  ('5380-chicken-bites-kebab', '5380', '卡巴', '炸雞肉球卡巴', 'Chicken Bites Kebab', 47.00, 'assets/5380/chicken-bites-kebab.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 507),
  ('5380-fish-kebab', '5380', '卡巴', '魚肉卡巴', 'Fish Kebab', 45.60, 'assets/5380/fish-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 508),
  ('5380-chicken-shish-kebab', '5380', '卡巴', '烤雞肉串卡巴', 'Chicken Shish Kebab', 44.00, 'assets/5380/chicken-shish-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 509),
  ('5380-halloumi-cheese-kebab', '5380', '卡巴', '哈囉米芝士卡巴', 'Halloumi Cheese Kebab', 42.00, 'assets/5380/halloumi-cheese-kebab.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 510),
  ('5380-vegetable-biryani', '5380', '印式炒飯', '咖喱雜菜炒飯', 'Vegetable Biryani', 39.50, 'assets/5380/vegetable-biryani.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian', '{value}', true, 511),
  ('5380-chicken-biryani', '5380', '印式炒飯', '咖喱雞肉炒飯', 'Chicken Biryani', 44.00, 'assets/5380/chicken-biryani.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 512),
  ('5380-fish-biryani', '5380', '印式炒飯', '咖喱魚肉炒飯', 'Fish Biryani', 39.50, 'assets/5380/fish-biryani.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 513),
  ('5380-chicken-tikka-biryani', '5380', '印式炒飯', '咖喱串燒雞肉炒飯', 'Chicken Tikka Biryani', 47.00, 'assets/5380/chicken-tikka-biryani.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 514),
  ('5380-meatball-biryani', '5380', '印式炒飯', '咖喱肉丸炒飯', 'Meatball Biryani', 48.00, 'assets/5380/meatball-biryani.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 515),
  ('5380-chicken-bites-biryani', '5380', '印式炒飯', '咖喱炸雞肉球炒飯', 'Chicken Bites Biryani', 48.00, 'assets/5380/chicken-bites-biryani.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 516),
  ('5380-vegetable-curry-rice', '5380', '咖喱配飯', '咖喱雜菜配飯', 'Vegetable Curry w/ Rice', 38.40, 'assets/5380/vegetable-curry-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian', '{value}', true, 517),
  ('5380-chicken-curry-rice', '5380', '咖喱配飯', '咖喱雞肉配飯', 'Chicken Curry w/ Rice', 39.40, 'assets/5380/chicken-curry-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{value}', true, 518),
  ('5380-fish-curry-rice', '5380', '咖喱配飯', '咖喱魚肉配飯', 'Fish Curry w/ Rice', 39.40, 'assets/5380/fish-curry-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{value}', true, 519),
  ('5380-meatball-curry-rice', '5380', '咖喱配飯', '咖喱肉丸配飯', 'Meatball Curry w/ Rice', 42.50, 'assets/5380/meatball-curry-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 520),
  ('5380-chana-masala-rice', '5380', '咖喱配飯', '香濃咖喱美國豆配飯', 'Chana Masala w/ Rice', 41.00, 'assets/5380/chana-masala-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食（鷹嘴豆）', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian (chickpea)', '{}', true, 521),
  ('5380-dal-makhani-rice', '5380', '咖喱配飯', '特式乳香咖喱扁豆配飯', 'Dal Makhani w/ Rice', 41.00, 'assets/5380/dal-makhani-rice.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食（扁豆）', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian (lentil)', '{}', true, 522),
  ('5380-chicken-bites-curry-rice', '5380', '咖喱配飯', '咖喱炸雞肉球配飯', 'Chicken Bites Curry w/ Rice', 45.00, 'assets/5380/chicken-bites-curry-rice.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 523),
  ('5380-garden-salad', '5380', '沙律', '田園沙律', 'Garden Salad', 27.50, 'assets/5380/garden-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14｜素食', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14 · Vegetarian', '{value}', true, 524),
  ('5380-roast-chicken-salad', '5380', '沙律', '燒雞肉沙律', 'Roast Chicken Salad', 39.40, 'assets/5380/roast-chicken-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 525),
  ('5380-roast-lamb-salad', '5380', '沙律', '燒羊肉沙律', 'Roast Lamb Salad', 47.70, 'assets/5380/roast-lamb-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 526),
  ('5380-chicken-tikka-salad', '5380', '沙律', '串燒雞肉沙律', 'Chicken Tikka Salad', 41.50, 'assets/5380/chicken-tikka-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 527),
  ('5380-real-beef-salad', '5380', '沙律', '牛肉沙律', 'Real Beef Salad', 49.80, 'assets/5380/real-beef-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 528),
  ('5380-halloumi-cheese-salad', '5380', '沙律', '哈囉米芝士沙律', 'Halloumi Cheese Salad', 42.00, 'assets/5380/halloumi-cheese-salad.jpg', '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14', 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14', '{}', true, 529),
  ('5380-pizza-margherita', '5380', '薄餅', '經典芝士薄餅', 'Margherita', 71.50, 'assets/5380/pizza-margherita.jpg', '10 吋｜素食', '10-inch · Vegetarian', '{}', true, 530),
  ('5380-pizza-pepperoni', '5380', '薄餅', '香辣味牛肉薄餅', 'Pepperoni', 77.00, 'assets/5380/pizza-pepperoni.jpg', '10 吋｜辣', '10-inch · Spicy', '{spicy}', true, 531),
  ('5380-pizza-supreme', '5380', '薄餅', '至尊薄餅', 'Supreme', 83.50, 'assets/5380/pizza-supreme.jpg', '10 吋', '10-inch', '{}', true, 532),
  ('5380-pizza-chicken-tikka', '5380', '薄餅', '串燒雞肉薄餅', 'Chicken Tikka', 83.50, 'assets/5380/pizza-chicken-tikka.jpg', '10 吋', '10-inch', '{}', true, 533),
  ('5380-pizza-vegetarian', '5380', '薄餅', '雜菜薄餅', 'Vegetarian', 77.00, 'assets/5380/pizza-vegetarian.jpg', '10 吋｜素食', '10-inch · Vegetarian', '{}', true, 534),
  ('5380-pizza-hawaiian', '5380', '薄餅', '夏威夷薄餅', 'Hawaiian', 77.00, 'assets/5380/pizza-hawaiian.jpg', '10 吋', '10-inch', '{}', true, 535),
  ('5380-pizza-chicken-express', '5380', '薄餅', '燒雞肉薄餅', 'Chicken Express', 83.50, 'assets/5380/pizza-chicken-express.jpg', '10 吋', '10-inch', '{}', true, 536),
  ('5380-pizza-turkey-ham-mushroom', '5380', '薄餅', '火雞火腿蘑菇薄餅', 'Turkey-baked Ham & Mushroom', 77.00, 'assets/5380/pizza-turkey-ham-mushroom.jpg', '10 吋', '10-inch', '{}', true, 537),
  ('5380-meat-roast-chicken', '5380', '嗜肉者', '燒雞肉', 'Roast Chicken', 39.40, 'assets/5380/meat-roast-chicken.jpg', '配飯 $39.40／配薯條 $45.60', 'With rice $39.40 / with chips $45.60', '{value}', true, 538),
  ('5380-meat-roast-lamb', '5380', '嗜肉者', '燒羊肉', 'Roast Lamb', 47.70, 'assets/5380/meat-roast-lamb.jpg', '配飯 $47.70／配薯條 $54.00', 'With rice $47.70 / with chips $54.00', '{}', true, 539),
  ('5380-meat-chicken-tikka', '5380', '嗜肉者', '串燒雞肉', 'Chicken Tikka', 40.40, 'assets/5380/meat-chicken-tikka.jpg', '配飯 $40.40／配薯條 $45.60', 'With rice $40.40 / with chips $45.60', '{}', true, 540),
  ('5380-meat-real-beef', '5380', '嗜肉者', '燒牛肉', 'Real Beef', 49.80, 'assets/5380/meat-real-beef.jpg', '配飯 $49.80／配薯條 $54.50', 'With rice $49.80 / with chips $54.50', '{}', true, 541),
  ('5380-chips', '5380', '小食（5380）', '薯條', 'Chips', 30.00, 'assets/5380/chips.jpg', null, null, '{}', true, 542),
  ('5380-samosas', '5380', '小食（5380）', '咖喱角（兩件）', 'Samosas (2pcs)', 19.20, 'assets/5380/samosas.jpg', '素食', 'Vegetarian', '{value}', true, 543),
  ('5380-falafels', '5380', '小食（5380）', '雜菜疏豆（三件）', 'Falafels (3pcs)', 20.70, 'assets/5380/falafels.jpg', '素食', 'Vegetarian', '{value}', true, 544),
  ('5380-spring-rolls', '5380', '小食（5380）', '春卷（四件）', 'Spring Rolls (4pcs)', 20.70, 'assets/5380/spring-rolls.jpg', '素食', 'Vegetarian', '{value}', true, 545),
  ('5380-hummus-pita', '5380', '小食（5380）', '雞豆蓉配中東包（一件）', 'Hummus & Pita Bread (1pc)', 28.00, 'assets/5380/hummus-pita.jpg', '素食', 'Vegetarian', '{}', true, 546),
  ('5380-gulab-jamun', '5380', '小食（5380）', '酷拉卜甜品（每件）', 'Gulab Jamun (each)', 9.00, 'assets/5380/gulab-jamun.jpg', '素食｜甜品', 'Vegetarian · Dessert', '{sweet}', true, 547),
  ('5380-soft-drinks', '5380', '飲品（5380）', '罐裝汽水', 'Soft Drinks (can)', 8.80, 'assets/5380/soft-drinks.jpg', 'Pepsi／Pepsi Light／7 Up／7 Up Light／Mirinda Orange／Mountain Dew', 'Pepsi / Pepsi Light / 7 Up / 7 Up Light / Mirinda Orange / Mountain Dew', '{value}', true, 548),
  ('5380-sirma-vitamin-drinks', '5380', '飲品（5380）', '有汽果汁', 'Sirma Vitamin Drinks', 12.40, 'assets/5380/sirma-vitamin-drinks.jpg', 'Apple／Lemon／Pomegranate／Orange', 'Apple / Lemon / Pomegranate / Orange', '{}', true, 549),
  ('5380-masala-tea', '5380', '飲品（5380）', '印式奶茶', 'Masala Tea', 12.00, 'assets/5380/masala-tea.jpg', '熱飲', 'Hot', '{signature}', true, 550),
  ('5380-cold-lemon-tea', '5380', '飲品（5380）', '支裝檸檬茶', 'Cold Lemon Tea', 13.50, 'assets/5380/cold-lemon-tea.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 551),
  ('5380-cold-tea', '5380', '飲品（5380）', '支裝綠茶', 'Cold Tea', 13.50, 'assets/5380/cold-tea.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 552),
  ('5380-mango-milk', '5380', '飲品（5380）', '芒果奶', 'Mango Milk', 13.50, 'assets/5380/mango-milk.jpg', null, null, '{sweet}', true, 553),
  ('5380-coconut-milk', '5380', '飲品（5380）', '椰奶', 'Coconut Milk', 13.50, 'assets/5380/coconut-milk.jpg', '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)', '{}', false, 554),
  ('5380-coconut-water', '5380', '飲品（5380）', '椰子水', 'Coconut Water', 13.50, 'assets/5380/coconut-water.jpg', null, null, '{}', true, 555)
on conflict (id) do update set
  canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price,
  photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en,
  tags = excluded.tags, available = excluded.available, sort = excluded.sort;

-- ── ④ 抽籤黑名單：飲品分類不進「今天吃什麼」────────────
insert into roll_blacklist (kind, value, note)
select 'category', '飲品（5380）', '5380 Cafe 飲品 —— 不是一餐的答案'
where not exists (
  select 1 from roll_blacklist where kind = 'category' and value = '飲品（5380）'
);

-- ── ⑤ 驗證（跑完看這兩個數字）─────────────────────────
-- select count(*) filter (where available) as on_sale, count(*) as total from dishes where canteen_id = '5380';
-- select category, count(*) from dishes where canteen_id = '5380' group by 1 order by min(sort);
