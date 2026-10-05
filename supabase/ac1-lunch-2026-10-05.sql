-- ═══════════════════════════════════════════════════════════
-- Eaty v0.6.2 — AC1 午市菜單同步（2026-10-05）
-- 來源：csd.order.place 堂食菜單 API（store 112870，menu version 20384）
--       https://api.aigens.com/api/v1/menu/store/112870.json?menu=dinein&locale=multi
-- 用法：Supabase → SQL Editor → 貼上整個檔案 → Run（可重複執行）
--
-- 內容：
--   ① 新增 12 個官方分類（櫻花蝦蔥油扒飯／台式肉燥飯／丼／日式一人鍋物／日式咖喱／
--      日式湯烏冬／漢堡包／特價飯／清真食品優惠餐／清真食品／家常便飯／素食精選）
--   ② 8 個既有分類的餐段按官方時段修正（T=茶餐歸入午餐；西多士、特色飲品退出早餐）
--   ③ 新增 34 道菜品（中英文名／價錢／官方照片存 repo assets/ac1/）
--
-- 官方英文名按原樣收錄（含官方 POS 本身的截斷／拼寫瑕疵），未經修改。
-- ═══════════════════════════════════════════════════════════


-- ═══ ① 新增分類（meal 由官方 periods 換算）═══
insert into categories (id, sort, zh, en, meal) values
('櫻花蝦蔥油扒飯', 32, '櫻花蝦蔥油扒飯', 'Steak with Rice', 'lunch'),
('台式肉燥飯', 33, '台式肉燥飯', 'Taiwanese Braised Pork with Rice', 'lunch,dinner'),
('丼', 34, '丼', 'Rice', 'lunch,dinner'),
('日式一人鍋物', 35, '日式一人鍋物', 'Japanese Nabe for 1', 'dinner'),
('日式咖喱', 36, '日式咖喱', 'Japanese  Curry', 'lunch,dinner'),
('日式湯烏冬', 37, '日式湯烏冬', 'Japanese Udon in Soup', 'lunch,dinner'),
('漢堡包', 38, '漢堡包', 'Hamburger', 'lunch,dinner'),
('特價飯', 39, '特價飯', 'Special Selections', 'lunch,dinner'),
('清真食品優惠餐', 40, '清真食品優惠餐', 'Halal Meal Set', 'lunch,dinner'),
('清真食品', 41, '清真食品', 'Halal Meal', 'lunch,dinner'),
('家常便飯', 42, '家常便飯', 'Two Dishes Set Meal', 'lunch,dinner'),
('素食精選', 43, '素食精選', 'Vegetarian Selections', 'lunch,dinner')
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, meal = excluded.meal;

-- ═══ ② 餐段修正（官方時段：B=07:28–11:00・L=11:00–14:30・T=14:30–17:00・D=17:00–21:00）═══
update categories set meal = 'lunch' where id = '肉燥拌麵'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '披薩'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '特價燒味飯'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '豬扒包餐'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '雞髀餐'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '街頭碗仔羹'; -- 原 lunch,dinner
update categories set meal = 'lunch' where id = '西多士'; -- 原 breakfast
update categories set meal = 'lunch,dinner' where id = '特色飲品'; -- 原 breakfast,lunch,dinner

-- ═══ ③ 新增菜品 ═══
-- 照片已存於 repo assets/ac1/（官方圖，2026-10-05 下載）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac1-sakura-shrimp-truffle-chicken', 'ac1', '櫻花蝦蔥油扒飯', '櫻花蝦松露葱油雞扒飯', 'Chicken Steak Rice with Truffle Scallion Oil and Sakura Shrimp', 47.0, 'assets/ac1/ac1-sakura-shrimp-truffle-chicken.jpg', null, null, '{}', true, 139),
('ac1-minced-pork-crispy-chicken', 'ac1', '台式肉燥飯', '肉燥 ‧ 鹽酥雞扒飯', 'Braised Minced Pork ‧  Chicken Steak with Rice', 38.9, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 140),
('ac1-spicy-minced-pork-crispy-chicken', 'ac1', '台式肉燥飯', '麻辣肉燥 ‧ 鹽酥雞扒飯', 'Spicy Minced Pork ‧ Salt Crispy Chicken Steak with Rice', 38.9, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 141),
('ac1-minced-pork-smoked-duck', 'ac1', '台式肉燥飯', '肉燥．煙鴨胸飯', 'Taiwanese Braised Minced Pork ‧ Smoked duck breast', 38.9, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 142),
('ac1-spicy-minced-pork-smoked-duck', 'ac1', '台式肉燥飯', '麻辣肉燥．煙鴨胸飯', 'Spicy Minced Pork ‧ Smoked duck breast with Rice', 38.9, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 143),
('ac1-minced-pork-braised-egg', 'ac1', '台式肉燥飯', '肉燥 ‧ 滷蛋飯', 'Braised Minced Pork ‧ Marinated Egg with Rice', 35.8, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 144),
('ac1-spicy-minced-pork-braised-egg', 'ac1', '台式肉燥飯', '麻辣肉燥 ‧ 鹵水蛋飯', 'Spicy Minced Pork ‧ Marinated Egg with Rice', 35.8, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 145),
('ac1-taiwanese-braised-pork-rice', 'ac1', '台式肉燥飯', '台式肉燥飯', 'Taiwanese Braised Po', 32.7, 'assets/ac1/lc-taiwanese-braised-pork.jpg', null, null, '{}', true, 146),
('ac1-lemongrass-wing-duo-fun', 'ac1', '泰式湯粉', '香茅雞翼雙拼湯粉', 'Lemongrass Chicken Wing ‧ One Item with Noodles in Soup', 39.9, null, null, null, '{}', true, 147),
('ac1-lemongrass-porkchop-duo-fun', 'ac1', '泰式湯粉', '香茅豬扒雙拼湯粉', 'Lemongrass Pork Chop ‧ One Item with Noodles in Soup', 39.9, null, null, null, '{}', true, 148),
('ac1-lemongrass-porkchop-fun', 'ac1', '泰式湯粉', '香茅豬扒湯粉', 'Lemongrass Pork Chop with Noodle in Soup', 35.8, null, null, null, '{}', true, 149),
('ac1-lemongrass-wing-fun', 'ac1', '泰式湯粉', '香茅雞翼湯粉', 'Lemongrass Chicken Wing with Noodle in Soup', 35.8, null, null, null, '{}', true, 150),
('ac1-pork-onsen-don', 'ac1', '丼', '汁煮豚肉 ‧ 溫泉玉子丼', 'Pork Cooked in Sauce ‧ Onsen Egg Donburi', 49.1, 'assets/ac1/lc-donburi.jpg', null, null, '{}', true, 151),
('ac1-spicy-beef-onsen-don', 'ac1', '丼', '辣味牛肉 ‧ 溫泉玉子丼', 'Spicy Beef  with Onsen Egg Donburi', 49.1, 'assets/ac1/lc-donburi.jpg', null, null, '{}', true, 152),
('ac1-karaage-oyakodon', 'ac1', '丼', '唐揚雞親子丼', 'Chicken Karaage and Egg with Rice', 49.1, 'assets/ac1/lc-donburi.jpg', null, null, '{}', true, 153),
('ac1-onion-beef-don', 'ac1', '丼', '洋蔥牛肉丼', 'Onion and Beef Donburi', 49.1, 'assets/ac1/lc-donburi.jpg', null, null, '{}', true, 154),
('ac1-chikuwa-beef-sukiyaki', 'ac1', '日式一人鍋物', '竹輪日式牛肉壽喜火鍋', 'Sukiyaki with Japanese Fish Cake and Beef', 56.3, 'assets/ac1/lc-japanese-nabe.jpg', null, null, '{}', true, 155),
('ac1-chikuwa-pork-sukiyaki', 'ac1', '日式一人鍋物', '竹輪日式豚肉壽喜火鍋', 'Sukiyaki with Japanese Fish Cake and Pork', 56.3, 'assets/ac1/lc-japanese-nabe.jpg', null, null, '{}', true, 156),
('ac1-crabstick-beef-sukiyaki', 'ac1', '日式一人鍋物', '珍寶蟹棒日式牛肉壽喜火鍋', 'Sukiyaki with Jumbo Crabstick and Beef', 56.3, 'assets/ac1/lc-japanese-nabe.jpg', null, null, '{}', true, 157),
('ac1-crabstick-pork-sukiyaki', 'ac1', '日式一人鍋物', '珍寶蟹棒日式豚肉壽喜火鍋', 'Sukiyaki with Jumbo Crabstick and Pork', 56.3, 'assets/ac1/lc-japanese-nabe.jpg', null, null, '{}', true, 158),
('ac1-beef-curry-rice', 'ac1', '日式咖喱', '咖喱牛肉飯', 'Beef Curry with Rice', 51.2, 'assets/ac1/lc-japanese-curry.jpg', null, null, '{}', true, 159),
('ac1-beef-udon-soup', 'ac1', '日式湯烏冬', '牛肉湯烏冬', 'Beef Udon in Soup', 49.1, 'assets/ac1/lc-japanese-udon.jpg', null, null, '{}', true, 160),
('ac1-curry-beef-udon', 'ac1', '日式湯烏冬', '咖喱牛肉烏冬', 'Curry Beef with Udon', 49.1, 'assets/ac1/lc-japanese-udon.jpg', null, null, '{}', true, 161),
('ac1-fish-cutlet-burger-fries', 'ac1', '漢堡包', '吉列魚柳包 ‧ 薯條(製作需時約 10- 15分鐘)', 'Fish Cutlet Burger ‧ French Fries(Cooked to order 10 - 15 mins)', 38.9, 'assets/ac1/lc-hamburger.jpg', null, null, '{}', true, 162),
('ac1-beef-burger-fries', 'ac1', '漢堡包', '牛肉漢堡包．薯條(制作需時10-15分鐘)', 'Beef Burger．French', 38.9, 'assets/ac1/lc-hamburger.jpg', null, null, '{}', true, 163),
('ac1-cheese-chicken-burger', 'ac1', '漢堡包', '芝士雞肉漢堡包', 'cheese and chicken f', 20.5, 'assets/ac1/lc-hamburger.jpg', null, null, '{}', true, 164),
('ac1-portuguese-chicken-rice', 'ac1', '特價飯', '葡國雞飯', 'PortugueChicken Ric esewith', 28.0, 'assets/ac1/lc-special-rice.jpg', null, null, '{}', true, 165),
('ac1-blackpepper-pork-rice', 'ac1', '特價飯', '黑椒肉片飯', 'Black pepper meat cubes and Mushroom with rice', 28.0, 'assets/ac1/lc-special-rice.jpg', null, null, '{}', true, 166),
('ac1-halal-tomato-fishfillet-rice', 'ac1', '清真食品優惠餐', '清真蕃茄汁魚柳 ‧ 白飯 (製作需時約 10- 15分鐘)', 'Halal Fish Fillet in Tomatoes Sauce ‧ Rice (Cooked to order 10 - 15 mins)', 38.0, 'assets/ac1/lc-halal-set.jpg', null, null, '{}', true, 167),
('ac1-halal-curry-chicken-rice', 'ac1', '清真食品', '清真咖喱雞 ‧ 白飯(製作需時約 10- 15分鐘)', 'Halal Curry Chicken ‧ Rice (Cooked to order 10 - 15 mins)', 47.1, 'assets/ac1/lc-halal.jpg', null, null, '{}', true, 168),
('ac1-home-set-three', 'ac1', '家常便飯', '家常飯(三款)', 'Set Meal (Three Dish', 32.5, 'assets/ac1/lc-home-set.jpg', '配 例湯 /咖啡/奶茶', 'with Soup/Coffee/Milk Tea', '{}', true, 169),
('ac1-home-set-two', 'ac1', '家常便飯', '家常飯(兩款)', 'Set Meal (Two Dishes)', 24.5, 'assets/ac1/lc-home-set.jpg', '配 例湯 /咖啡/奶茶', 'with Soup/Coffee/Milk Tea', '{}', true, 170),
('ac1-plant-based-bolognese', 'ac1', '素食精選', '素肉醬意粉', 'Spaghetti with Plant-based Pork Mince', 35.8, 'assets/ac1/lc-vegetarian.jpg', null, null, '{}', true, 171),
('ac1-mushroom-cream-spaghetti', 'ac1', '素食精選', '白汁磨菇意粉', 'Spaghetti with Mushroom in Cream Sauce', 35.8, 'assets/ac1/lc-vegetarian.jpg', null, null, '{}', true, 172)
on conflict (id) do update set category = excluded.category, zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, available = excluded.available, sort = excluded.sort;

-- ═══ 完成。重新整理網站即見。═══
