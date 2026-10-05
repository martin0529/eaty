-- ═══════════════════════════════════════════════════════════
-- Eaty v0.6.x — AC1 早餐菜單同步（2026-10-05）
-- 來源：csd.order.place 堂食菜單 API（store 112870，menu=dinein，當日早餐時段）
--       https://api.aigens.com/api/v1/menu/store/112870.json?menu=dinein&locale=multi
-- 用法：Supabase → SQL Editor → 貼上整個檔案 → Run（可重複執行）
--
-- 內容：
--   ① 新增 9 個早餐分類（categories.meal='breakfast'）
--   ② 「其他」分類補 meal（官方站四個時段都有）
--   ③ 新增 27 道早餐菜品（中英文名／價錢／官方照片存 repo assets/ac1/）
--   ④ 舊「中式早點」2 項已不在官方菜單 → available=false
--   ⑤ 「開學優惠」2 項已不在官方菜單 → available=false
--   ⑥ 為 103 項現有 AC1 菜品補上官方英文名（此前 en 全為空）
--
-- 注意：官方點餐站的「售罄」是即時狀態（Firestore 推送），不在本次同步範圍；
--       售罄／補貨請在 dashboard 改該行的 available。
-- 官方英文名按原樣收錄（含官方本身的拼寫瑕疵，如 Cogee／Pesi），未經修改。
-- ═══════════════════════════════════════════════════════════


-- ═══ ① 新增早餐分類 ═══
insert into categories (id, sort, zh, en, meal) values
('龍蝦濃湯牛仔腸螺絲粉早餐', 23, '龍蝦濃湯牛仔腸螺絲粉早餐', 'Sliced Veal Sausage with Fusilli in  Lobster Bisque Breakfast', 'breakfast'),
('脆炸魚柳早餐', 24, '脆炸魚柳早餐', 'Deep-Fried Fish Cutlet Breakfast', 'breakfast'),
('香煎雞扒早餐', 25, '香煎雞扒早餐', 'Pan-Fried Chicken Steak Breakfast', 'breakfast'),
('香煎豬扒早餐', 26, '香煎豬扒早餐', 'Pan-fried Pork Chop Breakfast', 'breakfast'),
('西式早餐', 27, '西式早餐', 'Western Style Breakfast', 'breakfast'),
('麥皮早餐', 28, '麥皮早餐', 'Oatmeal Breakfast', 'breakfast'),
('雙拼湯粉麵', 29, '雙拼湯粉麵', 'Two Item with Noodle Soup', 'breakfast'),
('豐衣足食系列', 30, '豐衣足食系列', 'Feast in Abundance series', 'breakfast'),
('單售食品（早餐）', 31, '單售食品（早餐）', 'A-La Carte Item', 'breakfast')
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, meal = excluded.meal;

-- ═══ ② 「其他」分類：官方站四個時段都有（此前 meal=NULL 只在「全部」顯示）═══
update categories set meal = 'breakfast,lunch,dinner' where id = '其他';

-- ═══ ③ 新增早餐菜品 ═══
-- 照片已存於 repo assets/ac1/（官方圖，2026-10-05 下載）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac1-lobster-bisque-fusilli', 'ac1', '龍蝦濃湯牛仔腸螺絲粉早餐', '龍蝦濃湯牛仔腸螺絲粉', 'Sliced Veal Sausage', 33.8, 'assets/ac1/bf-lobster-bisque.jpg', '配 牛油多士．咖啡/ 奶茶/ 汽水', 'Served with Butter Toast．Coffee/ Milk Tea/ Soft Drink', '{}', true, 110),
('ac1-fish-cutlet-breakfast', 'ac1', '脆炸魚柳早餐', '脆嫩魚柳早餐', 'Fish Cutlet Breakfas', 27.6, 'assets/ac1/bf-fish-cutlet.jpg', '配 班蘭包或多士‧ 咖啡/ 奶茶/ 汽水', 'Served Pandan Bun or Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 111),
('ac1-chicken-fish-fillet', 'ac1', '香煎雞扒早餐', '香煎雞扒 ‧ 脆嫩魚柳', 'Pan-fried Chicken Steak ‧ Fish Cutlet', 34.8, 'assets/ac1/bf-chicken-steak.jpg', '配 班蘭包/多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Pandan Bun or Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 112),
('ac1-chicken-steak-breakfast', 'ac1', '香煎雞扒早餐', '香煎雞扒早餐', 'Pan-Fried Chicken Steak Breakfast', 29.7, 'assets/ac1/bf-chicken-steak.jpg', '配 班蘭包/多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Pandan Bun or Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 113),
('ac1-pork-chop-fish-cutlet', 'ac1', '香煎豬扒早餐', '香煎豬扒 ‧ 脆炸魚柳', 'Pan-fried Pork Chop ‧ Fish Fillet', 34.8, 'assets/ac1/bf-pork-chop.jpg', '配 班蘭包/多士 ‧ 咖啡/ 奶茶/ 汽水', 'ServedPandan Bun or Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 114),
('ac1-pork-chop-breakfast', 'ac1', '香煎豬扒早餐', '香煎豬扒早餐', 'Pan-fried Pork Chop Breakfast', 29.7, 'assets/ac1/bf-pork-chop.jpg', '配 班蘭包/多士 ‧ 咖啡/ 奶茶/ 汽水', 'ServedPandan Bun or Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 115),
('ac1-western-breakfast', 'ac1', '西式早餐', '西式早餐', 'Western Breakfast', 23.5, 'assets/ac1/bf-western.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 116),
('ac1-oatmeal-scrambled-egg', 'ac1', '麥皮早餐', '健怡蛋白麥皮 ‧ 炒滑蛋', 'Oatmeal with Egg White ‧ Scrambled Egg', 25.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 117),
('ac1-oatmeal-boiled-egg', 'ac1', '麥皮早餐', '健怡蛋白麥皮 ‧ 烚蛋', 'Oatmeal with Egg White ‧ Boiled Eggs', 25.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 118),
('ac1-oatmeal-double-fried-egg', 'ac1', '麥皮早餐', '健怡蛋白麥皮 ‧ 煎雙蛋', 'Oatmeal with Egg White ‧ Double Fried Eggs', 25.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 119),
('ac1-oatmeal-sunny-egg', 'ac1', '麥皮早餐', '健怡蛋白麥皮．太陽蛋', 'Oatmeal ‧ Sunny-Side', 25.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 120),
('ac1-nissin-double-fried-egg', 'ac1', '麥皮早餐', '日清雜果穀物脆脆蛋白麥皮 ‧ 煎雙蛋', 'Oatmeal with Egg White & Fruits Crunchy Granola ‧ Fried Eggs', 27.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 121),
('ac1-nissin-boiled-egg', 'ac1', '麥皮早餐', '日清雜果穀物脆脆蛋白麥皮 ‧ 烚蛋', 'Oatmeal with Egg White & Fruits Crunchy Granola ‧ Boiled Eggs', 27.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 122),
('ac1-nissin-scrambled-egg', 'ac1', '麥皮早餐', '日清雜果穀物脆脆蛋白麥皮 ‧ 炒滑蛋', 'Oatmeal with Egg White & Fruits Crunchy Granola ‧ Scrambled Eggs', 27.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 123),
('ac1-nissin-ham-fried-egg', 'ac1', '麥皮早餐', '日清雜果穀物脆脆蛋白麥皮 ‧ 火腿 ‧ 煎蛋', 'Oatmeal with Egg White & Fruits Crunchy Granola ‧ Ham ‧ Fried Egg', 27.6, 'assets/ac1/bf-oatmeal.jpg', '配多士 ‧ 咖啡/ 奶茶/ 汽水', 'Served Toast ‧ Coffee/ Milk Tea/ Soft Drink', '{}', true, 124),
('ac1-duo-instant-noodle', 'ac1', '雙拼湯粉麵', '雙拼即食麵', 'Two Item with Instant Noodles in Soup', 28.0, 'assets/ac1/bf-duo-noodle.jpg', 'Served Coffee/ Milk Tea/ Soft Drink', '配 咖啡/ 奶茶/ 汽水', '{}', true, 125),
('ac1-duo-macaroni-soup', 'ac1', '雙拼湯粉麵', '雙拼湯通粉', 'Two Item with Macaroni in Soup', 28.0, 'assets/ac1/bf-duo-noodle.jpg', 'Served Coffee/ Milk Tea/ Soft Drink', '配 咖啡/ 奶茶/ 汽水', '{}', true, 126),
('ac1-duo-rice-noodle-soup', 'ac1', '雙拼湯粉麵', '雙拼湯米粉', 'Two Item with Vermicelli in Soup', 28.0, 'assets/ac1/bf-duo-noodle.jpg', 'Served Coffee/ Milk Tea/ Soft Drink', '配 咖啡/ 奶茶/ 汽水', '{}', true, 127),
('ac1-congee-set', 'ac1', '豐衣足食系列', '粥套餐', 'Congee Set', 20.5, 'assets/ac1/bf-abundance.jpg', null, null, '{}', true, 128),
('ac1-piden-lean-congee', 'ac1', '豐衣足食系列', '皮蛋瘦肉粥', 'Congee with Lean Meat and Preserved Egg', 11.0, 'assets/ac1/bf-abundance.jpg', null, null, '{}', true, 129),
('ac1-seaweed-corn-congee', 'ac1', '豐衣足食系列', '紫菜粟米粥', 'Cogee with Sweet Corn amd Seaweed', 11.0, 'assets/ac1/bf-abundance.jpg', null, null, '{}', true, 130),
('ac1-oatmeal-a-la-carte', 'ac1', '單售食品（早餐）', '健怡麥皮', 'Oatmeal', 8.2, 'assets/ac1/bf-a-la-carte.jpg', null, null, '{}', true, 131),
('ac1-chinese-soup', 'ac1', '單售食品', '中湯', 'Chinese Soup', 8.2, null, null, null, '{}', true, 132),
('ac1-steamed-rice', 'ac1', '單售食品', '白飯', 'Rice', 5.1, null, null, null, '{}', true, 133),
('ac1-others-dish-3', 'ac1', '其他', '紙杯(只供外賣使用)', 'Paper Cup(For Takeaway)', 1.0, 'assets/ac1/ac1-others-dish-3.jpg', null, null, '{}', true, 134),
('ac1-others-dish-4', 'ac1', '其他', '環保餐盒 ‧ 餐具(只供外賣使用)', 'Meal Box with Cutlery(For Takeaway)', 2.0, 'assets/ac1/ac1-others-dish-4.jpg', null, null, '{}', true, 135),
('ac1-others-dish-5', 'ac1', '其他', '環保餐盒 ‧ 紙杯 ‧ 餐具 (只供外賣使用)', 'Meal Box ‧ Cup ‧ Cutlery (For Takeaway)', 2.0, 'assets/ac1/ac1-others-dish-5.jpg', null, null, '{}', true, 136)
on conflict (id) do update set category = excluded.category, zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, available = excluded.available, sort = excluded.sort;

-- ═══ ④⑤ 已不在官方菜單的舊項目 → available=false（可隨時在 dashboard 翻回 true）═══
update dishes set available = false where id = 'ac1-cn-breakfast-dish'; -- 煎蛋 ‧ 豉油皇菇絲炒麵
update dishes set available = false where id = 'ac1-mushroom-noodle'; -- 豉油皇菇絲炒麵
update dishes set available = false where id = 'ac1-term-deals-dish'; -- 香辣肉丁麻婆豆腐飯 ‧ 金桔鹹檸七喜
update dishes set available = false where id = 'ac1-term-deals-15'; -- 香辣肉丁麻婆豆腐飯 ‧ 熱飲 ‧ 轉凍飲品+$1.5

-- ═══ ⑥ 官方英文名補齊（菜品表 en 欄；此前 AC1 的 109 項全部 en=NULL）═══
update dishes d set en = v.en from (values
('ac1-minced-noodle-soup', 'Spicy Minced Pork & Preserved  Radish Noodles with Seaweed &  Dried Shrimp Soup'),
  ('ac1-minced-noodle-spicy', 'Spicy Minced Pork & Preserved  Radish Noodles'),
  ('ac1-beef-noodle', 'Spicy Beef Noodle Soup in Taiwanese Style'),
  ('ac1-beef-noodle-2', 'Taiwan Style Beef Noodle in Soup'),
  ('ac1-suanla-mixian', 'Rice Vermicelli in Spicy Soup'),
  ('ac1-hot-sour-mixian-dish', 'Round Rice Noodle in Soup'),
  ('ac1-thai-chicken', 'Pratunam Chicken Rice ‧ Soup'),
  ('ac1-lemongrass-leg', 'Thai-Style Lemongrass Chicken Thigh with Oily Rice'),
  ('ac1-duck-hofun', 'Duck Leg  with Noodles in Soup'),
  ('ac1-beef-duo-fun', 'Beef．One Item with Noodles in Soup'),
  ('ac1-beef-fun', 'Pho Noodle Soup with Well-done Beef'),
  ('ac1-fishball-fun', 'Fish Balls in Soup with Noodle in Soup'),
  ('ac1-roast-meats-dish', 'Signature BBQ Rice (BBQ Pork ‧ Chicken wing Mid-Joint ‧ Sausage ‧ Salted Egg)'),
  ('ac1-roast-meats-dish-2', 'Siu Mei Two Choice with Rice'),
  ('ac1-roast-meats-dish-3', 'Siu Mei One Choice with Rice'),
  ('ac1-roast-recommend-dish', 'Spicy Pork Cubes and Soyed Chicken with Rice'),
  ('ac1-roast-recommend-dish-2', 'Spicy Pork Cubes and Roasted Duck with Rice'),
  ('ac1-roast-recommend-dish-3', 'Spicy Pork Cubes and BBQ Pork with Rice'),
  ('ac1-roast-select-dish', 'Soya Chicken Beancurd with Chilli ‧ Rice'),
  ('ac1-castle-fried-chicken-dish', 'Deep-Fried Chicken． with Black Pepper Mushroom Rice & Corn'),
  ('ac1-castle-fried-chicken-dish-2', 'Deep-Fried Chicken． with Black Pepper Mushroom Rice'),
  ('ac1-castle-fried-chicken-dish-3', 'Deep-Fried Chicken ‧ Buttered Corn'),
  ('ac1-castle-fried-chicken-2', 'Deep-Fried Chicken．'),
  ('ac1-pepperoni', 'Pepperoni Pizza(To Be Ready in 15-20 Mins)'),
  ('ac1-cha-lau-fan', 'Vietnamese Sausage．'),
  ('ac1-thai-fishcake', 'Fish Cakes．Minced P'),
  ('ac1-value-roast-rice-dish', 'Chicken Wing．Minced'),
  ('ac1-pork-chop-bun-set-10--15', 'Cutlet Pork Chop Bun with Mustard Mayo Sauce served with Fries(Cooked to order 10 - 15 mins)'),
  ('ac1-pork-chop-bun-set-10--15-2', 'Pork Chop Bun with Onion served with Fries(Cooked to order 10 - 15 mins)'),
  ('ac1-pork-chop-bun-set-10--15-3', 'Cutlet Pork Chop Bun with Mustard Mayo Sauce(Cooked to order 10 - 15 mins)'),
  ('ac1-pork-chop-bun-set-10--15-4', 'Pork Chop Bun with Onion(Cooked to order 10 - 15 mins)'),
  ('ac1-pork-chop-bun-set-10--15-5', 'Crispy Bun with Condensed Milk and Butter served with Fries(Cooked to order 10 - 15 mins)'),
  ('ac1-pork-chop-bun-set-10--15-6', 'Crispy Bun with Condensed Milk and Peanut Butter served with Fries(Cooked to order 10 - 15 mins)'),
  ('ac1-chicken-leg-set-dish', 'Deep-fried Chicken Thigh ‧ French Fries ‧ Fish Ball'),
  ('ac1-chicken-leg-set-dish-2', 'Deep-fried Chicken Thigh ‧ Sweet Corn ‧ Balls'),
  ('ac1-chicken-leg-set-dish-3', 'Deep-fried Chicken Thigh ‧ Sweet Corn ‧ Siu Mai'),
  ('ac1-chicken-leg-set-dish-4', 'Deep-fried Chicken Thigh ‧ French Fries'),
  ('ac1-chicken-leg-set-dish-5', 'Deep-fried Chicken Thigh ‧ Sweet Corn'),
  ('ac1-chicken-leg-set-dish-6', 'Soya Chicken Thigh ‧ French Fries'),
  ('ac1-chicken-leg-set-dish-7', 'Soya Chicken Thigh ‧ French Fries ‧ Fish Ball'),
  ('ac1-chicken-leg-set-dish-8', 'Soya Chicken Thigh ‧ Sweet Corn ‧ Siu Mai'),
  ('ac1-chicken-leg-set-dish-9', 'Soya Chicken Thigh  ‧ Sweet Corn'),
  ('ac1-street-bowl-soup-dish', 'Mock Shark s Fin Soup ‧ Chicken Wing ‧ Fish Meat Siu Mai'),
  ('ac1-street-bowl-soup-dish-2', 'Mock Shark s Fin Soup ‧ Chicken Wing ‧Curry  Fish Balls'),
  ('ac1-street-bowl-soup-dish-3', 'Mock Shark s Fin Soup ‧ Chicken Wing ‧ French Fries'),
  ('ac1-street-bowl-soup-dish-4', 'Mock Shark s Fin Soup ‧ Chicken Wing ‧ Sweet Corn'),
  ('ac1-french-toast', 'French Toast'),
  ('ac1-coffee-lounge-16oz', 'Iced Vanilla Latte(16oz)'),
  ('ac1-coffee-lounge-16oz-2', 'Iced Hazelunt Latte(16oz)'),
  ('ac1-coffee-lounge-16oz-3', 'Iced Caraml Latte(16oz)'),
  ('ac1-coffee-lounge-16oz-4', 'Iced Mocha(16oz)'),
  ('ac1-coffee-lounge-16oz-5', 'Iced Cappuccino(16oz)'),
  ('ac1-coffee-lounge-16oz-6', 'Iced Caffe Latte(16oz)'),
  ('ac1-coffee-lounge-12oz', 'Iced Vanilla Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-2', 'Iced Hazelunt (12oz)'),
  ('ac1-coffee-lounge-12oz-3', 'Iced Mocha(12oz)'),
  ('ac1-coffee-lounge-12oz-4', 'Iced Caramel Latte(12oz)'),
  ('ac1-coffee-lounge-16oz-7', 'Iced Americano(16oz)'),
  ('ac1-coffee-lounge-12oz-5', 'Icde Cappuccino(12oz)'),
  ('ac1-coffee-lounge-12oz-6', 'Iced Caffee Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-7', 'Hot Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-8', 'Iced Caffe Americano(12oz)'),
  ('ac1-coffee-lounge-12oz-9', 'Cappuccino(12oz)'),
  ('ac1-coffee-lounge-12oz-10', 'Hot Careml Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-11', 'Hot Hazinut Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-12', 'Hot Caffee Mocha (12oz)'),
  ('ac1-coffee-lounge-12oz-13', 'Hot Vanilla Latte(12oz)'),
  ('ac1-coffee-lounge-12oz-14', 'Hot Americano(12oz)'),
  ('ac1-coffee-lounge-12oz-15', 'Hot Chocolate Milk'),
  ('ac1-coffee-lounge-8oz', 'Cappuccino (8oz)'),
  ('ac1-coffee-lounge-8oz-2', 'Latte (8oz)'),
  ('ac1-coffee-lounge-8oz-3', 'Hazelnut Latte(8oz)'),
  ('ac1-coffee-lounge-8oz-4', 'Vanilla Latte(8oz)'),
  ('ac1-coffee-lounge-8oz-5', 'Mocha(8oz)'),
  ('ac1-coffee-lounge-8oz-6', 'Americano (8oz)'),
  ('ac1-coffee-lounge-dish', 'Hot Milk'),
  ('ac1-signature-drinks-dish', 'Kumquat Wampee Perfume Lemon  Sparkling Jasmine Green Tea'),
  ('ac1-signature-drinks-dish-2', 'Kumquat Passion Fruit Sparkling  Jasmine Green Tea'),
  ('ac1-signature-drinks-dish-3', 'Pink Guava Soda'),
  ('ac1-signature-drinks-dish-4', 'Kumquat and Salted L'),
  ('ac1-drinks-dish', 'Hot Coffee'),
  ('ac1-drinks-dish-2', 'Hot Black Coffee'),
  ('ac1-drinks-dish-3', 'Hot Milk Tea'),
  ('ac1-drinks-dish-4', 'Hot Coffee and Tea Mix'),
  ('ac1-drinks-dish-5', 'Hot Lemon Tea'),
  ('ac1-drinks-dish-6', 'Hot Lemon Water'),
  ('ac1-drinks-dish-7', 'Hot Ovaltine'),
  ('ac1-drinks-dish-8', 'Hot Horlicks'),
  ('ac1-drinks-dish-9', 'Iced Coffee'),
  ('ac1-drinks-dish-10', 'Iced Hot Black Coffe'),
  ('ac1-drinks-dish-11', 'Iced Milk Tea'),
  ('ac1-drinks-dish-12', 'Iced Coffee and Tea'),
  ('ac1-drinks-dish-13', 'Iced Lemon Tea'),
  ('ac1-drinks-dish-14', 'Iced Lemon Water'),
  ('ac1-drinks-dish-15', 'Iced Ovaltine'),
  ('ac1-drinks-dish-16', 'Iced Horlicks'),
  ('ac1-drinks-dish-17', 'Pesi (Cup)'),
  ('ac1-drinks-dish-18', '7-up (Cup)'),
  ('ac1-drinks-dish-19', 'Mirinda (Cup)'),
  ('ac1-drinks-dish-20', 'Pepsi Light(Cup)')
) as v(id, en) where d.id = v.id and d.en is null;

-- ═══ ⑦ 比對過程中發現的官方菜單變動（燒味推介／披薩，非早餐時段）═══
-- 「麻辣肉丁．燒髀飯」官方已改名為「麻辣肉丁 ‧ 醬油雞髀飯」（同一道菜，補英文名＋官方相）
update dishes set zh = '麻辣肉丁 ‧ 醬油雞髀飯', en = 'Spicy Pork Cubes and Soyed Chicken Thigh with Rice',
  photo = 'assets/ac1/ac1-roast-recommend-dish-4.jpg'
  where id = 'ac1-roast-recommend-dish-4';
-- 「夏威夷菠蘿火腿芝士披薩」已不在官方菜單 → available=false
update dishes set available = false where id = 'ac1-hawaii-pizza'; -- 夏威夷菠蘿火腿芝士披薩
-- 「燒味推介」新增 2 道（白胡椒雞扒飯官方相為壞連結，暫不配圖）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac1-white-pepper-chicken-rice', 'ac1', '燒味推介', '白胡椒雞扒飯', 'Nanyang Style Roasted White Pepper Chicken Steak with Rice', 44, null, null, null, '{}', true, 137),
('ac1-salted-egg-rice', 'ac1', '燒味推介', '鹹蛋 ‧ 肉燥 ‧ 油雞髀飯', 'Soya Chicken Leg ‧ Tainan Dried Meat Salted Egg with Rice', 43, 'assets/ac1/ac1-salted-egg-rice.jpg', null, null, '{}', true, 138)
on conflict (id) do update set zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, sort = excluded.sort;

-- ═══ 完成。重新整理網站即見：早餐頁籤會出現 9 個新分類 ═══
