-- ═══════════════════════════════════════════════════════════
-- 城大搵食指南 v0.2.1 — 菜單雲端化（學校官方堂食菜單版）
-- AC1 = 2026-10-02 從 csd.order.place 堂食菜單完整抄錄（109 項／22 分類）
-- 分類改為資料表驅動；AC2/AC3 維持代表性資料
-- 可重複執行（upsert / delete+insert）
-- ═══════════════════════════════════════════════════════════

-- ── 分類表（網站分類 chips 跟隨此表）──
create table if not exists categories (
  id    text primary key,
  sort  int  not null default 0,
  zh    text not null,
  en    text not null
);
alter table categories enable row level security;
drop policy if exists "categories are public" on categories;
create policy "categories are public" on categories for select to anon, authenticated using (true);
grant select on table categories to anon, authenticated;

-- dishes.category 不再設限（分類由 categories 表管理）
alter table dishes drop constraint if exists dishes_category_check;
alter table dishes alter column en drop not null;

-- ── 分類種子：AC1 學校官方分類（22）＋ AC2/AC3 通用分類（7）──
delete from categories;
insert into categories (id, sort, zh, en) values
('中式早點', 1, '中式早點', 'Chinese Breakfast'),
('開學優惠', 2, '開學優惠', 'Term Deals'),
('肉燥拌麵', 3, '肉燥拌麵', 'Minced Pork Noodles'),
('台式湯麵', 4, '台式湯麵', 'Taiwanese Soup Noodles'),
('酸辣米線', 5, '酸辣米線', 'Hot & Sour Mixian'),
('泰惹味精選', 6, '泰惹味精選', 'Thai Picks'),
('泰式湯粉', 7, '泰式湯粉', 'Thai Noodle Soup'),
('明爐燒味', 8, '明爐燒味', 'Roast Meats'),
('燒味推介', 9, '燒味推介', 'Roast Recommendations'),
('燒味精選', 10, '燒味精選', 'Roast Selection'),
('城堡炸雞', 11, '城堡炸雞', 'Castle Fried Chicken'),
('披薩', 12, '披薩', 'Pizza'),
('特價燒味飯', 13, '特價燒味飯', 'Value Roast Rice'),
('豬扒包餐', 14, '豬扒包餐', 'Pork Chop Bun Set'),
('雞髀餐', 15, '雞髀餐', 'Chicken Leg Set'),
('街頭碗仔羹', 16, '街頭碗仔羹', 'Street Bowl Soup'),
('西多士', 17, '西多士', 'French Toast'),
('Coffee Lounge', 18, 'Coffee Lounge', 'Coffee Lounge'),
('單售食品', 19, '單售食品', 'A La Carte'),
('特色飲品', 20, '特色飲品', 'Signature Drinks'),
('飲品', 21, '飲品', 'Drinks'),
('其他', 22, '其他', 'Others'),
('rice', 101, '中式飯類', 'Rice & Chinese'),
('noodle', 102, '粉麵', 'Noodles'),
('japanese', 103, '日韓', 'Japanese & Korean'),
('asian', 104, '東南亞', 'Southeast Asian'),
('western', 105, '西式', 'Western'),
('snack', 106, '小食', 'Snacks'),
('drinks', 107, '飲品甜品', 'Drinks & Dessert');

-- ── 飯堂（同 v0.2.0）──
insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values
('ac1', 1, '城大食坊', 'City Express', '康樂樓 5 樓', '5/F, Amenities Building', '週一至五 07:30–20:00・週六至日 08:00–18:00（公眾假期休息）', 'Mon–Fri 07:30–20:00 · Sat–Sun 08:00–18:00 (PH closed)', '三個飯堂之中唯一有官方網上點餐的，車仔麵、燒味、日式丼一應俱全。', 'The only canteen with official online ordering — roast meats, noodles, donburi and more.', 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://csd.order.place/home/store/112870'),
('ac2', 2, 'AC2 Canteen', 'AC2 Canteen', '李達三葉耀珍學術樓 3 樓', '3/F, Li Dak Sum Yip Yio Chin Academic Building', '週一至日 07:30–21:00（農曆新年休息）', 'Mon–Sun 07:30–21:00 (CNY closed)', '全校最大的 food court（860 座），$30 雙餸飯是城大傳說級抵食。', 'The biggest food court on campus (860 seats). The HK$30 two-dish rice is legendary value.', 'https://images.pexels.com/photos/4611422/pexels-photo-4611422.jpeg?auto=compress&cs=tinysrgb&w=900', null),
('ac3', 3, 'AC3 Bistro', 'AC3 Bistro', '劉鳴煒學術樓 7 樓', '7/F, Lau Ming Wai Academic Building', '週一至五 07:30–21:00（週日及公眾假期休息）', 'Mon–Fri 07:30–21:00 (Sun & PH closed)', '座落教學樓頂層的小 Bistro，人少安靜，吞拿魚披薩是鎮店之寶。', 'A quiet little bistro on the top teaching floors — the tuna pizza is the house icon.', 'https://images.pexels.com/photos/5112594/pexels-photo-5112594.jpeg?auto=compress&cs=tinysrgb&w=900', null)
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en, hours_zh = excluded.hours_zh, hours_en = excluded.hours_en, fact_zh = excluded.fact_zh, fact_en = excluded.fact_en, photo = excluded.photo, order_url = excluded.order_url;

-- ── AC1 菜品：學校官方堂食菜單（109 項，照片為官方圖，存於 app/assets/ac1/）──
delete from dishes where canteen_id = 'ac1';
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac1-cn-breakfast-dish', 'ac1', '中式早點', '煎蛋 ‧ 豉油皇菇絲炒麵', null, 19.5, null, null, null, '{}', true, 1),
('ac1-mushroom-noodle', 'ac1', '中式早點', '豉油皇菇絲炒麵', null, 12.5, null, null, null, '{}', true, 2),
('ac1-term-deals-dish', 'ac1', '開學優惠', '香辣肉丁麻婆豆腐飯 ‧ 金桔鹹檸七喜', null, 36, 'assets/ac1/ac1-term-deals-dish.jpg', null, null, '{}', true, 3),
('ac1-term-deals-15', 'ac1', '開學優惠', '香辣肉丁麻婆豆腐飯 ‧ 熱飲 ‧ 轉凍飲品+$1.5', null, 36, 'assets/ac1/ac1-term-deals-15.jpg', null, null, '{}', true, 4),
('ac1-minced-noodle-soup', 'ac1', '肉燥拌麵', '菜脯肉燥拌麵．蝦皮湯', null, 34, null, null, null, '{}', true, 5),
('ac1-minced-noodle-spicy', 'ac1', '肉燥拌麵', '香辣菜脯肉燥拌麵', null, 31, null, null, null, '{}', true, 6),
('ac1-beef-noodle', 'ac1', '台式湯麵', '台式麻辣牛肉麵', null, 43, null, null, null, '{}', true, 7),
('ac1-beef-noodle-2', 'ac1', '台式湯麵', '台式牛肉麵', null, 40.9, null, null, null, '{}', true, 8),
('ac1-suanla-mixian', 'ac1', '酸辣米線', '酸辣米線', null, 22.5, null, null, null, '{}', true, 9),
('ac1-hot-sour-mixian-dish', 'ac1', '酸辣米線', '清湯米線', null, 20.5, null, null, null, '{}', true, 10),
('ac1-thai-chicken', 'ac1', '泰惹味精選', '泰式水門雞飯 ‧ 例湯', null, 49.1, null, null, null, '{}', true, 11),
('ac1-lemongrass-leg', 'ac1', '泰惹味精選', '香茅雞髀．油飯', null, 38.9, null, null, null, '{}', true, 12),
('ac1-duck-hofun', 'ac1', '泰式湯粉', '鴨腿湯河粉', null, 39, 'assets/ac1/ac1-duck-hofun.jpg', null, null, '{}', true, 13),
('ac1-beef-duo-fun', 'ac1', '泰式湯粉', '牛肉雙拼湯粉', null, 39.9, null, null, null, '{}', true, 14),
('ac1-beef-fun', 'ac1', '泰式湯粉', '熟牛肉湯河', null, 35.8, null, null, null, '{}', true, 15),
('ac1-fishball-fun', 'ac1', '泰式湯粉', '魚蛋湯粉', null, 29.7, null, null, null, '{}', true, 16),
('ac1-roast-meats-dish', 'ac1', '明爐燒味', '鹹蛋三寶飯', null, 32.7, null, null, null, '{}', true, 17),
('ac1-roast-meats-dish-2', 'ac1', '明爐燒味', '燒味雙拼飯', null, 28.6, null, null, null, '{}', true, 18),
('ac1-roast-meats-dish-3', 'ac1', '明爐燒味', '燒味單拼飯', null, 22, null, null, null, '{}', true, 19),
('ac1-roast-recommend-dish', 'ac1', '燒味推介', '麻辣肉丁 ‧ 豉油雞飯', null, 44, null, null, null, '{}', true, 20),
('ac1-roast-recommend-dish-2', 'ac1', '燒味推介', '麻辣肉丁 ‧ 明爐燒鴨飯', null, 44, null, null, null, '{}', true, 21),
('ac1-roast-recommend-dish-3', 'ac1', '燒味推介', '麻辣肉丁 ‧ 蜜汁叉燒飯', null, 44, null, null, null, '{}', true, 22),
('ac1-roast-recommend-dish-4', 'ac1', '燒味推介', '麻辣肉丁．燒髀飯', null, 44, null, null, null, '{}', true, 23),
('ac1-roast-select-dish', 'ac1', '燒味精選', '口水雞 ‧ 白飯', null, 40.9, null, null, null, '{}', true, 24),
('ac1-castle-fried-chicken-dish', 'ac1', '城堡炸雞', '炸雞 配 黑椒磨菇飯 ‧ 粟米', null, 45, null, null, null, '{}', true, 25),
('ac1-castle-fried-chicken-dish-2', 'ac1', '城堡炸雞', '炸雞 配 黑椒磨菇飯', null, 36.8, null, null, null, '{}', true, 26),
('ac1-castle-fried-chicken-dish-3', 'ac1', '城堡炸雞', '炸雞 ‧ 牛油粟米', null, 36.8, null, null, null, '{}', true, 27),
('ac1-castle-fried-chicken-2', 'ac1', '城堡炸雞', '炸雞 (2件)', null, 28.6, null, null, null, '{}', true, 28),
('ac1-pepperoni', 'ac1', '披薩', '辣肉腸披薩(需時製作15-20分鐘)', null, 49.1, null, null, null, '{}', true, 29),
('ac1-hawaii-pizza', 'ac1', '披薩', '夏威夷菠蘿火腿芝士披薩(需時製作15-20分鐘)', null, 49.1, null, null, null, '{}', true, 30),
('ac1-cha-lau-fan', 'ac1', '特價燒味飯', '扎肉．肉燥飯', null, 39, null, null, null, '{}', true, 31),
('ac1-thai-fishcake', 'ac1', '特價燒味飯', '泰式魚餅．肉燥飯', null, 39, null, null, null, '{}', true, 32),
('ac1-value-roast-rice-dish', 'ac1', '特價燒味飯', '雞中翼．肉燥飯', null, 39, null, null, null, '{}', true, 33),
('ac1-pork-chop-bun-set-10--15', 'ac1', '豬扒包餐', '芥末吉列豬扒包 ‧ 薯條(製作需時約 10- 15分鐘)', null, 36.8, null, null, null, '{}', true, 34),
('ac1-pork-chop-bun-set-10--15-2', 'ac1', '豬扒包餐', '洋蔥豬扒包 ‧ 薯條(製作需時約 10- 15分鐘)', null, 35.8, null, null, null, '{}', true, 35),
('ac1-pork-chop-bun-set-10--15-3', 'ac1', '豬扒包餐', '芥末吉列豬扒包(製作需時約 10- 15分鐘)', null, 30.7, 'assets/ac1/ac1-pork-chop-bun-set-10--15-3.jpg', null, null, '{}', true, 36),
('ac1-pork-chop-bun-set-10--15-4', 'ac1', '豬扒包餐', '洋蔥豬扒包(製作需時約 10- 15分鐘)', null, 29.7, 'assets/ac1/ac1-pork-chop-bun-set-10--15-4.jpg', null, null, '{}', true, 37),
('ac1-pork-chop-bun-set-10--15-5', 'ac1', '豬扒包餐', '奶油脆脆豬仔包 ‧ 薯條(製作需時約 10- 15分鐘)', null, 28.6, null, null, null, '{}', true, 38),
('ac1-pork-chop-bun-set-10--15-6', 'ac1', '豬扒包餐', '奶醬脆脆豬仔包 ‧ 薯條(製作需時約 10- 15分鐘)', null, 28.6, null, null, null, '{}', true, 39),
('ac1-chicken-leg-set-dish', 'ac1', '雞髀餐', '炸雞髀 ‧ 薯條 ‧ 魚蛋', null, 34, null, null, null, '{}', true, 40),
('ac1-chicken-leg-set-dish-2', 'ac1', '雞髀餐', '炸雞髀 ‧ 粟米條 ‧ 魚蛋', null, 34, null, null, null, '{}', true, 41),
('ac1-chicken-leg-set-dish-3', 'ac1', '雞髀餐', '炸雞髀 ‧ 粟米條 ‧ 燒賣', null, 34, null, null, null, '{}', true, 42),
('ac1-chicken-leg-set-dish-4', 'ac1', '雞髀餐', '炸雞髀 ‧ 薯條', null, 28.6, null, null, null, '{}', true, 43),
('ac1-chicken-leg-set-dish-5', 'ac1', '雞髀餐', '炸雞髀 ‧ 粟米條', null, 28.6, null, null, null, '{}', true, 44),
('ac1-chicken-leg-set-dish-6', 'ac1', '雞髀餐', '油雞髀 ‧ 薯條', null, 28.6, null, null, null, '{}', true, 45),
('ac1-chicken-leg-set-dish-7', 'ac1', '雞髀餐', '油雞髀 ‧ 薯條 ‧ 魚蛋', null, 34, null, null, null, '{}', true, 46),
('ac1-chicken-leg-set-dish-8', 'ac1', '雞髀餐', '油雞髀 ‧ 粟米條 ‧ 燒賣', null, 34, null, null, null, '{}', true, 47),
('ac1-chicken-leg-set-dish-9', 'ac1', '雞髀餐', '油雞髀 ‧ 粟米條', null, 28.6, null, null, null, '{}', true, 48),
('ac1-street-bowl-soup-dish', 'ac1', '街頭碗仔羹', '碗仔羹 ‧ 雞翼 ‧ 魚肉燒賣', null, 32.7, null, null, null, '{}', true, 49),
('ac1-street-bowl-soup-dish-2', 'ac1', '街頭碗仔羹', '碗仔羹 ‧ 雞翼 ‧ 咖喱魚蛋', null, 32.7, null, null, null, '{}', true, 50),
('ac1-street-bowl-soup-dish-3', 'ac1', '街頭碗仔羹', '碗仔羹 ‧ 雞翼 ‧ 薯條', null, 32.7, null, null, null, '{}', true, 51),
('ac1-street-bowl-soup-dish-4', 'ac1', '街頭碗仔羹', '碗仔羹 ‧ 雞翼 ‧ 粟米條', null, 32.7, null, null, null, '{}', true, 52),
('ac1-french-toast', 'ac1', '西多士', '西多士', null, 24.6, null, null, null, '{}', true, 53),
('ac1-coffee-lounge-16oz', 'ac1', 'Coffee Lounge', '大凍雲呢拿鮮奶咖啡(16oz)', null, 33.8, 'assets/ac1/ac1-coffee-lounge-16oz.jpg', null, null, '{}', true, 54),
('ac1-coffee-lounge-16oz-2', 'ac1', 'Coffee Lounge', '大凍榛子鮮奶咖啡(16oz)', null, 33.8, 'assets/ac1/ac1-coffee-lounge-16oz-2.jpg', null, null, '{}', true, 55),
('ac1-coffee-lounge-16oz-3', 'ac1', 'Coffee Lounge', '大凍焦糖鮮奶咖啡(16oz)', null, 33.8, 'assets/ac1/ac1-coffee-lounge-16oz-3.jpg', null, null, '{}', true, 56),
('ac1-coffee-lounge-16oz-4', 'ac1', 'Coffee Lounge', '大凍朱古力咖啡(16oz)', null, 32.7, 'assets/ac1/ac1-coffee-lounge-16oz-4.jpg', null, null, '{}', true, 57),
('ac1-coffee-lounge-16oz-5', 'ac1', 'Coffee Lounge', '大凍泡沫咖啡(16oz)', null, 30.7, 'assets/ac1/ac1-coffee-lounge-16oz-5.jpg', null, null, '{}', true, 58),
('ac1-coffee-lounge-16oz-6', 'ac1', 'Coffee Lounge', '大凍鮮奶咖啡(16oz)', null, 30.7, 'assets/ac1/ac1-coffee-lounge-16oz-6.jpg', null, null, '{}', true, 59),
('ac1-coffee-lounge-12oz', 'ac1', 'Coffee Lounge', '凍雲呢拿鮮奶咖啡(12oz)*', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz.jpg', null, null, '{}', true, 60),
('ac1-coffee-lounge-12oz-2', 'ac1', 'Coffee Lounge', '凍榛子鮮奶咖啡(12oz)*', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz-2.jpg', null, null, '{}', true, 61),
('ac1-coffee-lounge-12oz-3', 'ac1', 'Coffee Lounge', '凍朱古力咖啡(12oz)*', null, 30.2, 'assets/ac1/ac1-coffee-lounge-12oz-3.jpg', null, null, '{}', true, 62),
('ac1-coffee-lounge-12oz-4', 'ac1', 'Coffee Lounge', '凍焦糖鮮奶咖啡(12oz)*', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz-4.jpg', null, null, '{}', true, 63),
('ac1-coffee-lounge-16oz-7', 'ac1', 'Coffee Lounge', '大凍美式咖啡(16oz)', null, 28.1, 'assets/ac1/ac1-coffee-lounge-16oz-7.jpg', null, null, '{}', true, 64),
('ac1-coffee-lounge-12oz-5', 'ac1', 'Coffee Lounge', '凍泡沫咖啡(12oz)', null, 28.1, 'assets/ac1/ac1-coffee-lounge-12oz-5.jpg', null, null, '{}', true, 65),
('ac1-coffee-lounge-12oz-6', 'ac1', 'Coffee Lounge', '凍鮮奶咖啡 (12oz)*', null, 28.1, 'assets/ac1/ac1-coffee-lounge-12oz-6.jpg', null, null, '{}', true, 66),
('ac1-coffee-lounge-12oz-7', 'ac1', 'Coffee Lounge', '大熱鮮奶咖啡(12oz)', null, 28.1, 'assets/ac1/ac1-coffee-lounge-12oz-7.jpg', null, null, '{}', true, 67),
('ac1-coffee-lounge-12oz-8', 'ac1', 'Coffee Lounge', '凍美式咖啡(12oz)*', null, 25.1, 'assets/ac1/ac1-coffee-lounge-12oz-8.jpg', null, null, '{}', true, 68),
('ac1-coffee-lounge-12oz-9', 'ac1', 'Coffee Lounge', '大泡沫咖啡(12oz)*', null, 28.1, 'assets/ac1/ac1-coffee-lounge-12oz-9.jpg', null, null, '{}', true, 69),
('ac1-coffee-lounge-12oz-10', 'ac1', 'Coffee Lounge', '大熱焦糖鮮奶咖啡(12oz)', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz-10.jpg', null, null, '{}', true, 70),
('ac1-coffee-lounge-12oz-11', 'ac1', 'Coffee Lounge', '大熱榛子鮮奶咖啡(12oz)', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz-11.jpg', null, null, '{}', true, 71),
('ac1-coffee-lounge-12oz-12', 'ac1', 'Coffee Lounge', '大熱朱古力咖啡(12oz)', null, 30.2, 'assets/ac1/ac1-coffee-lounge-12oz-12.jpg', null, null, '{}', true, 72),
('ac1-coffee-lounge-12oz-13', 'ac1', 'Coffee Lounge', '大熱雲呢拿鮮奶咖啡(12oz)', null, 30.7, 'assets/ac1/ac1-coffee-lounge-12oz-13.jpg', null, null, '{}', true, 73),
('ac1-coffee-lounge-12oz-14', 'ac1', 'Coffee Lounge', '大熱美式咖啡((12oz)', null, 25.1, 'assets/ac1/ac1-coffee-lounge-12oz-14.jpg', null, null, '{}', true, 74),
('ac1-coffee-lounge-12oz-15', 'ac1', 'Coffee Lounge', '熱朱古力奶(12oz)', null, 18.5, null, null, null, '{}', true, 75),
('ac1-coffee-lounge-8oz', 'ac1', 'Coffee Lounge', '泡沫咖啡 (8oz)*', null, 25.1, 'assets/ac1/ac1-coffee-lounge-8oz.jpg', null, null, '{}', true, 76),
('ac1-coffee-lounge-8oz-2', 'ac1', 'Coffee Lounge', '熱鮮奶咖啡 (8oz)*', null, 25.1, 'assets/ac1/ac1-coffee-lounge-8oz-2.jpg', null, null, '{}', true, 77),
('ac1-coffee-lounge-8oz-3', 'ac1', 'Coffee Lounge', '熱榛子鮮奶咖啡(8oz)*', null, 28.1, 'assets/ac1/ac1-coffee-lounge-8oz-3.jpg', null, null, '{}', true, 78),
('ac1-coffee-lounge-8oz-4', 'ac1', 'Coffee Lounge', '熱雲呢拿鮮奶咖啡(8oz)*', null, 28.1, 'assets/ac1/ac1-coffee-lounge-8oz-4.jpg', null, null, '{}', true, 79),
('ac1-coffee-lounge-8oz-5', 'ac1', 'Coffee Lounge', '熱朱古力咖啡(8oz)*', null, 27.1, 'assets/ac1/ac1-coffee-lounge-8oz-5.jpg', null, null, '{}', true, 80),
('ac1-coffee-lounge-8oz-6', 'ac1', 'Coffee Lounge', '熱美式咖啡(8oz)*', null, 22, 'assets/ac1/ac1-coffee-lounge-8oz-6.jpg', null, null, '{}', true, 81),
('ac1-coffee-lounge-dish', 'ac1', 'Coffee Lounge', '熱鮮奶', null, 16.5, null, null, null, '{}', true, 82),
('ac1-a-la-carte-dish', 'ac1', '單售食品', '碗仔翅', null, 18, null, null, null, '{}', true, 83),
('ac1-signature-drinks-dish', 'ac1', '特色飲品', '黃皮金桔檸檬莉汽泡茶', null, 19, 'assets/ac1/ac1-signature-drinks-dish.jpg', null, null, '{}', true, 84),
('ac1-signature-drinks-dish-2', 'ac1', '特色飲品', '百香果金桔茉莉汽泡茶', null, 19, 'assets/ac1/ac1-signature-drinks-dish-2.jpg', null, null, '{}', true, 85),
('ac1-signature-drinks-dish-3', 'ac1', '特色飲品', '紅芭樂梳打', null, 19, 'assets/ac1/ac1-signature-drinks-dish-3.jpg', null, null, '{}', true, 86),
('ac1-signature-drinks-dish-4', 'ac1', '特色飲品', '金桔鹹檸七喜', null, 18, 'assets/ac1/ac1-signature-drinks-dish-4.jpg', null, null, '{}', true, 87),
('ac1-drinks-dish', 'ac1', '飲品', '熱咖啡', null, 6, 'assets/ac1/ac1-drinks-dish.jpg', null, null, '{}', true, 88),
('ac1-drinks-dish-2', 'ac1', '飲品', '熱黑咖啡', null, 6, 'assets/ac1/ac1-drinks-dish-2.jpg', null, null, '{}', true, 89),
('ac1-drinks-dish-3', 'ac1', '飲品', '熱奶茶', null, 6, 'assets/ac1/ac1-drinks-dish-3.jpg', null, null, '{}', true, 90),
('ac1-drinks-dish-4', 'ac1', '飲品', '熱鴛鴦', null, 6, 'assets/ac1/ac1-drinks-dish-4.jpg', null, null, '{}', true, 91),
('ac1-drinks-dish-5', 'ac1', '飲品', '熱檸檬茶', null, 6, 'assets/ac1/ac1-drinks-dish-5.jpg', null, null, '{}', true, 92),
('ac1-drinks-dish-6', 'ac1', '飲品', '熱檸檬水', null, 6, 'assets/ac1/ac1-drinks-dish-6.jpg', null, null, '{}', true, 93),
('ac1-drinks-dish-7', 'ac1', '飲品', '熱阿華田', null, 6, 'assets/ac1/ac1-drinks-dish-7.jpg', null, null, '{}', true, 94),
('ac1-drinks-dish-8', 'ac1', '飲品', '熱好立克', null, 6, 'assets/ac1/ac1-drinks-dish-8.jpg', null, null, '{}', true, 95),
('ac1-drinks-dish-9', 'ac1', '飲品', '凍咖啡', null, 7.5, 'assets/ac1/ac1-drinks-dish-9.jpg', null, null, '{}', true, 96),
('ac1-drinks-dish-10', 'ac1', '飲品', '凍黑咖啡', null, 7.5, 'assets/ac1/ac1-drinks-dish-10.jpg', null, null, '{}', true, 97),
('ac1-drinks-dish-11', 'ac1', '飲品', '凍奶茶', null, 7.5, 'assets/ac1/ac1-drinks-dish-11.jpg', null, null, '{}', true, 98),
('ac1-drinks-dish-12', 'ac1', '飲品', '凍鴛鴦', null, 7.5, 'assets/ac1/ac1-drinks-dish-12.jpg', null, null, '{}', true, 99),
('ac1-drinks-dish-13', 'ac1', '飲品', '凍檸檬茶', null, 7.5, 'assets/ac1/ac1-drinks-dish-13.jpg', null, null, '{}', true, 100),
('ac1-drinks-dish-14', 'ac1', '飲品', '凍檸檬水', null, 7.5, 'assets/ac1/ac1-drinks-dish-14.jpg', null, null, '{}', true, 101),
('ac1-drinks-dish-15', 'ac1', '飲品', '凍阿華田', null, 7.5, 'assets/ac1/ac1-drinks-dish-15.jpg', null, null, '{}', true, 102),
('ac1-drinks-dish-16', 'ac1', '飲品', '凍好立克', null, 7.5, 'assets/ac1/ac1-drinks-dish-16.jpg', null, null, '{}', true, 103),
('ac1-drinks-dish-17', 'ac1', '飲品', '細百事(杯)', null, 6, 'assets/ac1/ac1-drinks-dish-17.jpg', null, null, '{}', true, 104),
('ac1-drinks-dish-18', 'ac1', '飲品', '細七喜 (杯)', null, 6, 'assets/ac1/ac1-drinks-dish-18.jpg', null, null, '{}', true, 105),
('ac1-drinks-dish-19', 'ac1', '飲品', '美年達 (杯)', null, 6, 'assets/ac1/ac1-drinks-dish-19.jpg', null, null, '{}', true, 106),
('ac1-drinks-dish-20', 'ac1', '飲品', '輕怡百事(杯)', null, 6, 'assets/ac1/ac1-drinks-dish-20.jpg', null, null, '{}', true, 107),
('ac1-others-dish', 'ac1', '其他', '環保餐盒(只供外賣使用)', null, 1, 'assets/ac1/ac1-others-dish.jpg', null, null, '{}', true, 108),
('ac1-others-dish-2', 'ac1', '其他', '環保餐具 (只供外賣使用)', null, 1, 'assets/ac1/ac1-others-dish-2.jpg', null, null, '{}', true, 109);

-- ── AC2／AC3 菜品（代表性資料，不變）──
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac2-two-dish','ac2','rice','抵食雙餸飯','Two-Dish Rice (Legendarily Cheap)',30,'https://images.pexels.com/photos/2781537/pexels-photo-2781537.jpeg?auto=compress&cs=tinysrgb&w=900','$30 兩餸一飯，全城大最抵，中午排長龍。','Two dishes over rice for HK$30 — the best value on campus, queue at noon.','{signature,value}',true,1),
('ac2-claypot','ac2','rice','北菇滑雞煲仔飯','Mushroom & Chicken Claypot Rice',38,'https://images.pexels.com/photos/1618873/pexels-photo-1618873.jpeg?auto=compress&cs=tinysrgb&w=900','秋冬限定，飯焦最正。','Autumn–winter special; the crispy bottom rice is the point.','{signature}',true,2),
('ac2-mapo-tofu','ac2','rice','麻婆豆腐飯','Mapo Tofu Rice',26,null,null,null,'{spicy,value}',true,3),
('ac2-yeungchow','ac2','rice','揚州炒飯','Yeung Chow Fried Rice',28,null,null,null,'{}',true,4),
('ac2-beef-hofun','ac2','noodle','干炒牛河','Stir-fried Beef Flat Noodles',32,null,null,null,'{}',true,5),
('ac2-satay-beef','ac2','noodle','沙嗲牛肉麵','Satay Beef Noodle Soup',28,null,null,null,'{}',true,6),
('ac2-mango-shrimp','ac2','asian','凍芒果蝦沙律','Chilled Mango Shrimp Salad',28,'https://images.pexels.com/photos/6990080/pexels-photo-6990080.jpeg?auto=compress&cs=tinysrgb&w=900','AC2 名物，夏天一流。','The AC2 signature — perfect in summer.','{signature}',true,7),
('ac2-curry-brisket','ac2','asian','咖喱牛腩飯','Curry Beef Brisket Rice',34,null,null,null,'{spicy}',true,8),
('ac2-salt-chicken-wing','ac2','snack','椒鹽雞翼','Salt & Pepper Chicken Wings',22,null,null,null,'{}',true,9),
('ac2-milk-tea','ac2','drinks','凍檸檬茶','Iced Lemon Tea',9,null,null,null,'{}',true,10),
('ac3-tuna-pizza','ac3','western','吞拿魚披薩','Tuna Pizza',42,'https://images.pexels.com/photos/5175556/pexels-photo-5175556.jpeg?auto=compress&cs=tinysrgb&w=900','AC3 鎮店之寶，經常售罄。','The house icon — often sells out.','{signature}',true,1),
('ac3-carbonara','ac3','western','卡邦尼意粉','Spaghetti Carbonara',38,'https://images.pexels.com/photos/546945/pexels-photo-546945.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,2),
('ac3-bolognese','ac3','western','肉醬意粉','Spaghetti Bolognese',36,'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,3),
('ac3-chicken-sandwich','ac3','western','烤雞三文治','Roast Chicken Sandwich',32,'https://images.pexels.com/photos/2161636/pexels-photo-2161636.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,4),
('ac3-udon','ac3','japanese','海鮮烏冬','Seafood Udon',36,null,null,null,'{}',true,5),
('ac3-latte','ac3','drinks','鮮奶咖啡','Latte',24,'https://images.pexels.com/photos/5591737/pexels-photo-5591737.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,6)
on conflict (id) do update set category = excluded.category, zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags, available = excluded.available, sort = excluded.sort;
