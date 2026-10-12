-- AC2 菜單：按 5 家餐廳分類（2026-10-12）
-- 來源：使用者提供的 6 張現場菜單照片
-- 可重複執行（on conflict do update）。

-- ① 新增／更新 5 個餐廳分類
insert into categories (id, sort, zh, en, meal) values
  ('EURO GOURMET', 50, 'EURO GOURMET', 'EURO GOURMET', 'lunch,dinner'),
  ('開味小店', 51, '開味小店', 'Taste Corner', 'lunch,dinner'),
  ('麻辣滾燙', 52, '麻辣滾燙', 'Mala Pot', 'lunch,dinner'),
  ('西北麵館', 53, '西北麵館', 'Northwest Noodle House', 'lunch,dinner'),
  ('餃餃陣', 54, '餃餃陣', 'Dumpling City', 'lunch,dinner')
on conflict (id) do update set sort=excluded.sort, zh=excluded.zh, en=excluded.en, meal=excluded.meal;

-- ② 新增／更新菜品（35 道）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-portuguese-chicken-baked-rice', 'ac2', 'EURO GOURMET', '焗葡國雞球飯', 'Roasted Portuguese Chicken Rice', 50.4, null, '套餐 $54.4，配 熱咖啡／熱奶茶', 'Set meal $54.4, served with Coffee / Milk Tea', '{}', true, 201),
  ('ac2-hawaiian-pork-chop-baked-rice', 'ac2', 'EURO GOURMET', '夏威夷菠蘿芝士焗豬扒飯', 'Baked Rice with Pork Chop, Pineapple and Cheese in Tomato Sauce', 50.4, null, '套餐 $54.4，配 熱咖啡／熱奶茶', 'Set meal $54.4, served with Coffee / Milk Tea', '{}', true, 202),
  ('ac2-carbonara', 'ac2', 'EURO GOURMET', '卡邦尼意粉', 'Carbonara', 42.4, null, '套餐 $46.4，配 熱咖啡／熱奶茶', 'Set meal $46.4, served with Coffee / Milk Tea', '{}', true, 203),
  ('ac2-bolognese-cherry-tomato', 'ac2', 'EURO GOURMET', '車厘茄肉醬意粉', 'Spaghetti Bolognese with Cherry Tomato', 42.4, null, '套餐 $46.4，配 熱咖啡／熱奶茶', 'Set meal $46.4, served with Coffee / Milk Tea', '{}', true, 204),
  ('ac2-lobster-bisque', 'ac2', 'EURO GOURMET', '龍蝦湯', 'Lobster Bisque', 12.0, null, '是日餐湯', 'Soup of the Day', '{}', true, 205),
  ('ac2-caesar-salad', 'ac2', 'EURO GOURMET', '法式凱撒沙律', 'French Caesar Salad', 38.4, null, '', '', '{}', true, 206),
  ('ac2-shrimp-grapefruit-salad', 'ac2', 'EURO GOURMET', '鮮蝦柚子醋汁沙律', 'Shrimp Salad with Grapefruit Vinegar', 38.4, null, '', '', '{}', true, 207),
  ('ac2-congee-soy-fried-noodles', 'ac2', '開味小店', '皮蛋瘦肉粥・豉油皇炒麵', 'Congee with Lean Meat and Preserved Egg · Soy Sauce Fried Noodles', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 208),
  ('ac2-congee-malay-cake', 'ac2', '開味小店', '皮蛋瘦肉粥・馬拉糕', 'Congee with Lean Meat and Preserved Egg · Cantonese Steamed Sponge Cake', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 209),
  ('ac2-congee-glutinous-rice-roll', 'ac2', '開味小店', '皮蛋瘦肉粥・糯米卷', 'Congee with Lean Meat and Preserved Egg · Steamed Glutinous Rice Roll', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 210),
  ('ac2-congee-custard-bun', 'ac2', '開味小店', '皮蛋瘦肉粥・奶皇包', 'Congee with Lean Meat and Preserved Egg · Steamed Custard Bun', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 211),
  ('ac2-congee-bbq-pork-bun', 'ac2', '開味小店', '皮蛋瘦肉粥・叉燒包', 'Congee with Lean Meat and Preserved Egg · Steamed BBQ Pork Bun', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 212),
  ('ac2-congee-fried-dough-stick', 'ac2', '開味小店', '皮蛋瘦肉粥・油條', 'Congee with Lean Meat and Preserved Egg · Fried Dough Stick', 20.5, null, '套餐 $24.5，配 無糖豆漿／咖啡／奶茶', 'Set meal $24.5, served with No Sugar Soy Milk / Coffee / Milk Tea', '{}', true, 213),
  ('ac2-okra-sesame', 'ac2', '開味小店', '胡麻醬秋葵', 'Okra with Sesame Dressing', 18.0, null, '開胃涼菜', 'Cold Dish', '{}', true, 214),
  ('ac2-thai-chicken-feet', 'ac2', '開味小店', '泰式酸辣鳳爪', 'Thai Spicy and Sour Chicken Feet', 18.0, null, '開胃涼菜', 'Cold Dish', '{}', true, 215),
  ('ac2-shredded-chicken-romaine', 'ac2', '開味小店', '胡麻羅馬菜手撕雞', 'Shredded Chicken with Romaine Lettuce in Japanese Sesame Dressing', 18.0, null, '開胃涼菜', 'Cold Dish', '{}', true, 216),
  ('ac2-tofu-pudding-grass-jelly', 'ac2', '開味小店', '鮮草芋圓小丸子豆花', 'Tofu Pudding with Grass Jelly', 25.0, null, '人氣甜點', 'Dessert', '{}', true, 217),
  ('ac2-red-bean-sweet-soup', 'ac2', '開味小店', '蓮子紅豆沙(熱)', 'Red Bean Sweet Soup with Lotus Seeds (Hot/Cold)', 15.0, null, '人氣甜點', 'Dessert', '{}', true, 218),
  ('ac2-coconut-split-pea-pudding', 'ac2', '開味小店', '馬豆糕', 'Coconut Split Pea Pudding', 13.5, null, '人氣甜點', 'Dessert', '{}', true, 219),
  ('ac2-coffee-layer-pudding', 'ac2', '開味小店', '咖啡千層糕', 'Coffee Layer Pudding', 13.0, null, '人氣甜點', 'Dessert', '{}', true, 220),
  ('ac2-build-your-own-mala-tang', 'ac2', '麻辣滾燙', '自選麻辣燙（每50克）', 'Build-Your-Own Spicy Hot Pot (per 50g)', 6.0, null, '自選配料每50克 $6；自選湯底1款：四川麻辣燙湯／濃郁豬骨湯。辣度可選：全辣／中辣。', 'Choose your own ingredients at $6 per 50g; pick 1 soup base (Sichuan Spicy / Premium Pork Bone). Spicy levels: Hot / Medium.', '{}', true, 221),
  ('ac2-spicy-beef-dry-pot-rice', 'ac2', '麻辣滾燙', '香辣牛肉乾鍋・白飯', 'Spicy Beef Dry Pot · Rice', 53.0, null, '套餐 $57.0，配 熱咖啡／熱奶茶', 'Set meal $57.0, served with Coffee / Milk Tea', '{}', true, 222),
  ('ac2-spicy-chicken-dry-pot-rice', 'ac2', '麻辣滾燙', '香辣雞肉乾鍋・白飯', 'Spicy Chicken Dry Pot · Rice', 50.0, null, '套餐 $54.0，配 熱咖啡／熱奶茶', 'Set meal $54.0, served with Coffee / Milk Tea', '{}', true, 223),
  ('ac2-tomato-fish-fillet-rice-noodles', 'ac2', '西北麵館', '酸菜番茄濃湯魚片米線', 'Rice Noodles with Fish Fillet and Pickled Vegetables in Tomato Thick Soup', 42.0, null, '套餐 $46.0，配 熱咖啡／熱奶茶', 'Set meal $46.0, served with Coffee / Milk Tea', '{}', true, 224),
  ('ac2-tomato-chicken-wing-rice-noodles', 'ac2', '西北麵館', '酸菜番茄濃湯雞中翼米線', 'Rice Noodles with Chicken Wings and Pickled Vegetables in Tomato Thick Soup', 42.0, null, '套餐 $46.0，配 熱咖啡／熱奶茶', 'Set meal $46.0, served with Coffee / Milk Tea', '{}', true, 225),
  ('ac2-pork-chili-knife-cut-noodles', 'ac2', '西北麵館', '麻辣辣尖椒肉絲刀削麵', 'Pork Chili Pepper with Knife-cut Noodles in Soup', 38.0, null, '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 226),
  ('ac2-tomato-egg-knife-cut-noodles', 'ac2', '西北麵館', '麻辣辣番茄炒蛋撈刀削麵', 'Tomato with Scrambled Egg with Knife-cut Noodles in Soup', 38.0, null, '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 227),
  ('ac2-minced-pork-knife-cut-noodles', 'ac2', '西北麵館', '麻辣辣香茜肉碎撈刀削麵', 'Stirred Knife-cut Noodles with Minced Pork in Spicy and Sour Sauce', 38.0, null, '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 228),
  ('ac2-veggie-knife-cut-noodles', 'ac2', '西北麵館', '麻辣辣素菜撈刀削麵', 'Stirred Knife-cut Noodles with Mixed Vegetables in Spicy and Sour Sauce', 38.0, null, '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 229),
  ('ac2-beef-scallion-dumpling-noodles', 'ac2', '餃餃陣', '大蔥牛肉餃(6隻)湯米線', 'Beef and Scallion Dumplings with Rice Noodles in Soup', 42.0, null, '套餐 $46.0，配 熱咖啡／熱奶茶', 'Set meal $46.0, served with Coffee / Milk Tea', '{}', true, 230),
  ('ac2-chicken-cartilage-dumpling-noodles', 'ac2', '餃餃陣', '雞軟骨雞肉餃(6隻)湯米線', 'Chicken Cartilage and Chicken Dumplings with Rice Noodles in Soup', 38.0, null, '套餐 $42.0，配 熱咖啡／熱奶茶', 'Set meal $42.0, served with Coffee / Milk Tea', '{}', true, 231),
  ('ac2-shaoxing-beef-scallion-dumplings', 'ac2', '餃餃陣', '酒香濃湯大蔥牛肉餃(6隻)', 'Beef and Scallion Dumplings in Shaoxing Chicken Soup (6pcs)', 32.0, null, '套餐 $36.0，配 熱咖啡／熱奶茶', 'Set meal $36.0, served with Coffee / Milk Tea', '{}', true, 232),
  ('ac2-shaoxing-chicken-cartilage-dumplings', 'ac2', '餃餃陣', '酒香濃湯雞軟骨雞肉餃(6隻)', 'Chicken Cartilage and Chicken Dumplings in Chicken Soup (6pcs)', 28.0, null, '套餐 $32.0，配 熱咖啡／熱奶茶', 'Set meal $32.0, served with Coffee / Milk Tea', '{}', true, 233),
  ('ac2-sesame-beef-scallion-dumplings', 'ac2', '餃餃陣', '混醬香茜撈大蔥牛肉餃(6隻)', 'Beef and Scallion Dumplings with Spicy Sesame Sauce (6pcs)', 32.0, null, '套餐 $36.0，配 熱咖啡／熱奶茶', 'Set meal $36.0, served with Coffee / Milk Tea', '{}', true, 234),
  ('ac2-sesame-chicken-cartilage-dumplings', 'ac2', '餃餃陣', '混醬香茜撈雞軟骨雞肉餃(6隻)', 'Chicken Cartilage and Chicken Dumplings with Spicy Sesame Sauce (6pcs)', 28.0, null, '套餐 $32.0，配 熱咖啡／熱奶茶', 'Set meal $32.0, served with Coffee / Milk Tea', '{}', true, 235)
on conflict (id) do update set canteen_id=excluded.canteen_id, category=excluded.category,
  zh=excluded.zh, en=excluded.en, price=excluded.price, photo=excluded.photo,
  desc_zh=excluded.desc_zh, desc_en=excluded.desc_en, tags=excluded.tags,
  available=excluded.available, sort=excluded.sort;

-- ③ 下架舊 AC2 代表性資料（10 道，2026-10-12 由真實菜單取代）
update dishes set available = false where id in (
  'ac2-two-dish', 'ac2-claypot', 'ac2-mapo-tofu', 'ac2-yeungchow', 'ac2-beef-hofun', 'ac2-satay-beef', 'ac2-mango-shrimp', 'ac2-curry-brisket', 'ac2-salt-chicken-wing', 'ac2-milk-tea'
);
