-- ════════════════════════════════════════════════════════════════════════
-- 2026-10-14：AC2 兩個檔口官方點餐菜單同步 ＋ AC2「拾味」＋ 新食堂 CMC Cafe
-- 來源：
--   ① 官方 aigens 點餐後端（csd.order.place 兩個檔口）
--      - store 212882 = AC2 Canteen (Dumpling City)  → 餃餃陣
--      - store 312882 = AC2 Canteen (Xibei Mian Guan) → 西北麵館
--      API：https://api.aigens.com/api/v1/menu/store/<id>.json?menu=kiosk
--      （要帶 User-Agent；menu=kiosk 才是完整菜單）
--   ② 使用者提供現場照片：拾味 The Pick（自選飯價目牌）
--   ③ 使用者提供現場照片：CMC Cafe（熱烘三文治 ＋ 午餐牌）
--   CMC Cafe 位置／時間／電話：城大官方餐飲目錄
--      https://www.cityu.edu.hk/zh-hk/directories/catering （CMCAFE）
--
-- 可重複執行（on conflict do update）。菜單最後更新：2026-10-14
-- ════════════════════════════════════════════════════════════════════════

-- ── ① categories 加 order_url 欄（檔口級的官方點餐連結）────────────
-- 大食堂的下單連結在 canteens.order_url；檔口（＝分類）沒有地方放，
-- 所以這裡加一欄。前端 menu-data.js 的 normalizeCategory 會讀它。
alter table categories add column if not exists order_url text;

-- 兩個檔口的官方點餐連結（餃餃陣 212882 ／ 西北麵館 312882）
update categories set order_url = 'https://csd.order.place/home/store/212882'
  where id = '餃餃陣';
update categories set order_url = 'https://csd.order.place/home/store/312882'
  where id = '西北麵館';


-- ── ② AC2 新增「拾味 The Pick」自選飯檔口 ────────────────────────────
-- 現場價目牌：先選菜、後付款；價錢按容器大小計（$6／$10／$15／$18／$21）。
-- 冇固定菜式 → 用 5 個容器價位代表。
insert into categories (id, sort, zh, en, meal) values
  ('拾味 The Pick', 55, '拾味', 'The Pick', 'lunch,dinner')
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh,
  en = excluded.en, meal = excluded.meal;

insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-thepick-bowl-6',  'ac2', '拾味 The Pick', '自選飯・細碗',  'Pick-Your-Own Rice · Small Bowl',      6,  'assets/ac2/thepick-6.jpg',  '先選菜、後付款；價錢按容器大小計。', 'Pay after you pick — the price is set by the container size.', '{}', true, 250),
  ('ac2-thepick-bowl-10', 'ac2', '拾味 The Pick', '自選飯・方碗',  'Pick-Your-Own Rice · Square Bowl',     10, 'assets/ac2/thepick-10.jpg', '先選菜、後付款；價錢按容器大小計。', 'Pay after you pick — the price is set by the container size.', '{}', true, 251),
  ('ac2-thepick-bowl-15', 'ac2', '拾味 The Pick', '自選飯・中碟',  'Pick-Your-Own Rice · Medium Plate',    15, 'assets/ac2/thepick-15.jpg', '先選菜、後付款；價錢按容器大小計。', 'Pay after you pick — the price is set by the container size.', '{}', true, 252),
  ('ac2-thepick-bowl-18', 'ac2', '拾味 The Pick', '自選飯・大碟',  'Pick-Your-Own Rice · Large Plate',     18, 'assets/ac2/thepick-18.jpg', '先選菜、後付款；價錢按容器大小計。', 'Pay after you pick — the price is set by the container size.', '{}', true, 253),
  ('ac2-thepick-bowl-21', 'ac2', '拾味 The Pick', '自選飯・特大碟', 'Pick-Your-Own Rice · Extra-Large Plate', 21, 'assets/ac2/thepick-21.jpg', '先選菜、後付款；價錢按容器大小計。', 'Pay after you pick — the price is set by the container size.', '{}', true, 254)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;


-- ── ③ 餃餃陣：補上官方菜單有、網站未收的 6 道 ─────────────────────────
-- （原有 6 道湯餃／撈餃／餃米線經核對價錢一致，毋須改動。）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-chicken-soup-beef-scallion-dumplings',          'ac2', '餃餃陣', '雞湯大蔥牛肉餃(6隻)',     'Beef and Scallion Dumplings in Chicken Soup (6pcs)',            32, 'assets/ac2/ac2-chicken-soup-beef-scallion-dumplings.jpg',          '套餐 $36.0，配 熱咖啡／熱奶茶', 'Set meal $36.0, served with Coffee / Milk Tea', '{}', true, 236),
  ('ac2-rich-chicken-soup-chicken-cartilage-dumplings', 'ac2', '餃餃陣', '濃雞湯雞軟骨雞肉餃(6隻)', 'Chicken & Chicken Cartilage Dumplings in Rich Chicken Soup (6pcs)', 28, 'assets/ac2/ac2-rich-chicken-soup-chicken-cartilage-dumplings.jpg', '套餐 $32.0，配 熱咖啡／熱奶茶', 'Set meal $32.0, served with Coffee / Milk Tea', '{}', true, 237),
  ('ac2-panfried-beef-scallion-dumplings',              'ac2', '餃餃陣', '煎大蔥牛肉餃子',         'Pan-fried Beef and Scallion Dumplings',                          32, 'assets/ac2/ac2-panfried-beef-scallion-dumplings.jpg',              '套餐 $36.0，配 熱咖啡／熱奶茶', 'Set meal $36.0, served with Coffee / Milk Tea', '{}', true, 238),
  ('ac2-panfried-chicken-cartilage-dumplings',          'ac2', '餃餃陣', '煎雞軟骨雞肉餃子',       'Pan-fried Chicken & Chicken Cartilage Dumplings',                28, 'assets/ac2/ac2-panfried-chicken-cartilage-dumplings.jpg',          '套餐 $32.0，配 熱咖啡／熱奶茶', 'Set meal $32.0, served with Coffee / Milk Tea', '{}', true, 239),
  ('ac2-deepfried-beef-scallion-dumplings',             'ac2', '餃餃陣', '炸大蔥牛肉餃子',         'Deep-fried Beef and Scallion Dumplings',                         32, 'assets/ac2/ac2-deepfried-beef-scallion-dumplings.jpg',             '套餐 $36.0，配 熱咖啡／熱奶茶', 'Set meal $36.0, served with Coffee / Milk Tea', '{}', true, 240),
  ('ac2-deepfried-chicken-cartilage-dumplings',         'ac2', '餃餃陣', '炸雞軟骨雞肉餃子',       'Deep-fried Chicken & Chicken Cartilage Dumplings',               28, 'assets/ac2/ac2-deepfried-chicken-cartilage-dumplings.jpg',         '套餐 $32.0，配 熱咖啡／熱奶茶', 'Set meal $32.0, served with Coffee / Milk Tea', '{}', true, 241)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;


-- ── ④ 西北麵館：補上官方菜單有、網站未收的 2 道 ───────────────────────
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-tomato-fatty-beef-rice-noodles', 'ac2', '西北麵館', '酸菜番茄濃湯肥牛米線', 'Rice Noodles with Fatty Beef and Pickled Vegetables in Tomato Thick Soup', 42, 'assets/ac2/ac2-tomato-fatty-beef-rice-noodles.jpg', '套餐 $46.0，配 熱咖啡／熱奶茶', 'Set meal $46.0, served with Coffee / Milk Tea', '{}', true, 242),
  ('ac2-fish-roll-knife-cut-noodles',    'ac2', '西北麵館', '麻辣辣魚肉春卷撈刀削麵', 'Stirred Knife-cut Noodles with Fried Fish Roll in Spicy and Sour Sauce',   38, 'assets/ac2/ac2-fish-roll-knife-cut-noodles.jpg',    '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 243)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;


-- ── ⑤ 麻辣滾燙：補上香辣豬肉乾鍋（官方有、網站冇）────────────────────
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-spicy-pork-dry-pot-rice', 'ac2', '麻辣滾燙', '香辣豬肉乾鍋・白飯', 'Spicy Pork Dry Pot · Rice', 50, 'assets/ac2/ac2-spicy-pork-dry-pot-rice.jpg', '套餐 $54.0，配 熱咖啡／熱奶茶', 'Set meal $54.0, served with Coffee / Milk Tea', '{}', true, 244)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;


-- ── ⑥ 開味小店（甜品）：補 2 道 ＋ 修正咖啡千層糕價錢 ────────────────
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-green-bean-sweet-soup', 'ac2', '開味小店', '綠豆沙糖水', 'Green Bean Sweet Soup', 15, 'assets/ac2/ac2-green-bean-sweet-soup.jpg', '人氣甜點', 'Dessert', '{}', true, 245),
  ('ac2-taro-sago-cake',        'ac2', '開味小店', '香芋西米糕', 'Taro and Sago Cake',     13.5, 'assets/ac2/ac2-taro-sago-cake.jpg', '人氣甜點', 'Dessert', '{}', true, 246)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;

-- 咖啡千層糕：官方 $13.5（網站舊值 $13.0）
update dishes set price = 13.5 where id = 'ac2-coffee-layer-pudding';


-- ── ⑦ 新食堂：CMC Cafe（邵逸夫創意媒體中心 3 樓）─────────────────────
-- 官方目錄：08:00–20:00 (Mon–Fri)／08:00–17:00 (Sat)／週日及公眾假期休息；只收現金。
insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values
  ('cmc', 4, 'CMC Cafe', 'CMCAFE',
   '邵逸夫創意媒體中心 3 樓', '3/F, Run Run Shaw Creative Media Centre',
   '週一至五 08:00–20:00・週六 08:00–17:00（週日及公眾假期休息）',
   'Mon–Fri 08:00–20:00 · Sat 08:00–17:00 (Sun & PH closed)',
   '電話 +852 2778-7390・付款：現金',
   'Tel +852 2778-7390 · Payment: Cash',
   'assets/cmc/cmc-cafe-interior.jpg', null)
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en,
  bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en, hours_zh = excluded.hours_zh,
  hours_en = excluded.hours_en, fact_zh = excluded.fact_zh, fact_en = excluded.fact_en,
  photo = excluded.photo, order_url = excluded.order_url;

-- CMC Cafe 分類：三文治／墨西哥卷全日供應；午餐兩類 11:30–14:30
insert into categories (id, sort, zh, en, meal) values
  ('意式三文治', 60, '意式三文治', 'Panini',            'breakfast,lunch,dinner'),
  ('墨西哥卷',   61, '墨西哥卷',   'Wraps',             'breakfast,lunch,dinner'),
  ('本週精選',   62, '本週精選',   'Weekly Highlights', 'lunch'),
  ('是日推介',   63, '是日推介',   'Daily Specials',    'lunch')
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh,
  en = excluded.en, meal = excluded.meal;

-- CMC Cafe 菜品（18 道，抄自現場菜單牌）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  -- 意式三文治 PANINI（全日供應）
  ('cmc-panini-chicken-caesar',      'cmc', '意式三文治', '慢煮雞胸凱撒意式三文治',       'Slow Cooked Chicken Caesar Panini',            36, 'assets/cmc/cmc-panini-chicken-caesar.jpg',      '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 401),
  ('cmc-panini-cheddar-avocado',     'cmc', '意式三文治', '車打芝士・牛油果・水耕菜意式三文治', 'Cheddar Cheese, Avocado & HydroVeg Panini',      36, 'assets/cmc/cmc-panini-cheddar-avocado.jpg',     '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 402),
  ('cmc-panini-spicy-chicken',       'cmc', '意式三文治', '慢煮辣雞胸意式三文治',         'Slow Cooked Spicy Chicken Breast Panini',       36, 'assets/cmc/cmc-panini-spicy-chicken.jpg',       '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 403),
  ('cmc-panini-roast-beef-mushroom', 'cmc', '意式三文治', '蜜糖芥末燒牛肉野菌意式三文治', 'Roast Beef, Wild Mushroom & Mustard Panini',    38, 'assets/cmc/cmc-panini-roast-beef-mushroom.jpg', '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 404),
  ('cmc-panini-smoked-salmon',       'cmc', '意式三文治', '美式蜜糖芥末煙三文魚意式三文治', 'Honey Mustard & Smoked Salmon Panini',          38, 'assets/cmc/cmc-panini-smoked-salmon.jpg',       '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 405),
  -- 墨西哥卷 WRAP（全日供應）
  ('cmc-wrap-chicken-caesar',        'cmc', '墨西哥卷', '慢煮雞胸凱撒意墨西哥卷',       'Slow Cooked Chicken Caesar Mexican Wrap',       34, 'assets/cmc/cmc-wrap-chicken-caesar.jpg',        '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 406),
  ('cmc-wrap-spicy-chicken-pumpkin', 'cmc', '墨西哥卷', '慢煮辣雞胸・烤南瓜墨西哥卷',   'Slow Cooked Spicy Chicken Breast & Roasted Pumpkin Mexican Wrap', 34, 'assets/cmc/cmc-wrap-spicy-chicken-pumpkin.jpg', '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 407),
  ('cmc-wrap-avocado-quinoa',        'cmc', '墨西哥卷', '牛油果藜麥雜菜墨西哥卷',       'Avocado & Quinoa Mexican Wrap',                 34, 'assets/cmc/cmc-wrap-avocado-quinoa.jpg',        '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 408),
  ('cmc-wrap-roast-beef-mushroom',   'cmc', '墨西哥卷', '蜜糖芥末燒牛肉蘑菇墨西哥卷',   'Roast Beef, Wild Mushroom & Honey Mustard Wrap', 36, 'assets/cmc/cmc-wrap-roast-beef-mushroom.jpg',   '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 409),
  ('cmc-wrap-smoked-salmon-egg',     'cmc', '墨西哥卷', '煙三文魚碎蛋墨西哥卷',         'Smoked Salmon & Egg Salad Mexican Wrap',        36, 'assets/cmc/cmc-wrap-smoked-salmon-egg.jpg',     '全日供應｜加 $6 配黑咖啡／港式奶茶／檸檬茶／檸檬水', 'All day · +$6 with Black Coffee / Milk Tea / Lemon Tea / Lemon Water', '{}', true, 410),
  -- 本週精選 WEEKLY HIGHLIGHTS（午餐 11:30–14:30）
  ('cmc-lunch-steak-rice',           'cmc', '本週精選', '香煎牛扒煎蛋飯',               'Pan Seared Steak with Rice',                    48, 'assets/cmc/cmc-lunch-steak-rice.jpg',           '午餐時段 11:30–14:30 供應', 'Available 11:30–14:30', '{}', true, 411),
  ('cmc-lunch-curry-chicken-rice',   'cmc', '本週精選', '焗馬來咖哩雞扒飯',             'Baked Rice with Malaysian Curry Chicken Balls', 48, 'assets/cmc/cmc-lunch-curry-chicken-rice.jpg',   '午餐時段 11:30–14:30 供應', 'Available 11:30–14:30', '{}', true, 412),
  ('cmc-lunch-fish-pumpkin-rice',    'cmc', '本週精選', '法式龍蝦汁南瓜魚柳飯',         'Fish Fillet and Pumpkin with Rice in French Lobster Sauce', 49, 'assets/cmc/cmc-lunch-fish-pumpkin-rice.jpg', '午餐時段 11:30–14:30 供應', 'Available 11:30–14:30', '{}', true, 413),
  ('cmc-lunch-mussels-spaghetti',    'cmc', '本週精選', '龍蝦汁青口野菌意粉',           'Mussels & Wild Mushroom Spaghetti in Lobster Sauce', 47, 'assets/cmc/cmc-lunch-mussels-spaghetti.jpg', '午餐時段 11:30–14:30 供應', 'Available 11:30–14:30', '{}', true, 414),
  -- 是日推介 DAILY SPECIALS（午餐 11:30–14:30）
  ('cmc-daily-salmon-spaghetti',     'cmc', '是日推介', '意式番茄煙三文魚意粉',         'Italian Smoked Salmon Spaghetti with Tomato Sauce', 46, 'assets/cmc/cmc-daily-salmon-spaghetti.jpg', '是日推介，午餐時段 11:30–14:30 供應', 'Daily special, available 11:30–14:30', '{}', true, 415),
  ('cmc-daily-bolognese',            'cmc', '是日推介', '芝士肉醬意粉',                 'Cheesy Spaghetti Bolognese',                    44, 'assets/cmc/cmc-daily-bolognese.jpg',            '是日推介，午餐時段 11:30–14:30 供應', 'Daily special, available 11:30–14:30', '{}', true, 416),
  ('cmc-daily-chicken-scallion-noodles', 'cmc', '是日推介', '特式雞扒蔥油拌麵',         'Signature Chicken Steak Scallion Oil Noodles',  46, 'assets/cmc/cmc-daily-chicken-scallion-noodles.jpg', '是日推介，午餐時段 11:30–14:30 供應', 'Daily special, available 11:30–14:30', '{}', true, 417),
  ('cmc-daily-chicken-fusilli-soup', 'cmc', '是日推介', '雞胸蘑菇忌廉湯螺絲粉',         'Chicken Breast & Mushroom Fusilli in Cream Soup', 44, 'assets/cmc/cmc-daily-chicken-fusilli-soup.jpg', '是日推介，午餐時段 11:30–14:30 供應', 'Daily special, available 11:30–14:30', '{}', true, 418)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags,
  available = excluded.available, sort = excluded.sort;

-- 註：本檔新增的菜品，圖片路徑直接寫在 insert 的 photo 欄（唔另開 update），
-- 免得只跑一半 SQL 就會出現「有菜冇圖」。圖片全部來自免費圖庫
-- （Pexels 為主，少量 Openverse 的 CC0／公有領域），非店家實拍。

