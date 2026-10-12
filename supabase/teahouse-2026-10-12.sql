-- AC2 四季茶坊 TEA HOUSE ＋ 補圖 ＋ 下架 AC1 外賣餐具（2026-10-12）
-- 來源：現場點餐機照片 2.1–2.5；圖片來源 Pexels（Pexels License）
-- 可重複執行。

-- ① 分類（1 個）
insert into categories (id, sort, zh, en, meal) values
  ('四季茶坊', 55, '四季茶坊', 'TEA HOUSE', 'lunch,dinner')
on conflict (id) do update set sort=excluded.sort, zh=excluded.zh, en=excluded.en, meal=excluded.meal;

-- ② 菜品（24 道）
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-th-orange-americano', 'ac2', '四季茶坊', '甜橙美式', 'Orange Americano', 19.0, null, '元氣果咖系列', 'Fruit Coffee Series', '{}', true, 236),
  ('ac2-th-peach-americano', 'ac2', '四季茶坊', '白桃美式', 'Peach Americano', 19.0, null, '元氣果咖系列', 'Fruit Coffee Series', '{}', true, 237),
  ('ac2-th-lychee-americano', 'ac2', '四季茶坊', '粉荔美式', 'Lychee Americano', 19.0, null, '元氣果咖系列', 'Fruit Coffee Series', '{}', true, 238),
  ('ac2-th-apple-americano', 'ac2', '四季茶坊', '富士蘋果美式', 'Fuji Apple Americano', 19.0, null, '元氣果咖系列', 'Fruit Coffee Series', '{}', true, 239),
  ('ac2-th-iced-americano', 'ac2', '四季茶坊', '凍美式咖啡', 'Iced Americano', 19.0, null, '元氣果咖系列', 'Fruit Coffee Series', '{}', true, 240),
  ('ac2-th-orange-gardenia-lemon-tea', 'ac2', '四季茶坊', '甜橙栀香檸檬茶', 'Orange Gardenia Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 241),
  ('ac2-th-peach-gardenia-lemon-tea', 'ac2', '四季茶坊', '白桃栀香檸檬茶', 'Peach Gardenia Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 242),
  ('ac2-th-lychee-gardenia-lemon-tea', 'ac2', '四季茶坊', '粉荔栀香檸檬茶', 'Lychee Gardenia Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 243),
  ('ac2-th-cheese-lychee-gardenia-lemon-tea', 'ac2', '四季茶坊', '芝士荔枝栀香檸檬茶', 'Cheese Lychee Gardenia Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 244),
  ('ac2-th-gardenia-lemon-tea', 'ac2', '四季茶坊', '栀香檸檬茶', 'Gardenia Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 245),
  ('ac2-th-guava-jasmine-lemon-tea', 'ac2', '四季茶坊', '芭樂茉莉檸檬茶', 'Guava Jasmine Lemon Tea', 19.0, null, '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 246),
  ('ac2-th-peach-jasmine-sparkling', 'ac2', '四季茶坊', '水蜜桃茉莉香檳', 'Peach Jasmine Sparkling', 19.0, null, '茉莉香檳系列', 'Jasmine Sparkling Series', '{}', true, 247),
  ('ac2-th-passionfruit-jasmine-sparkling', 'ac2', '四季茶坊', '百香果茉莉香檳', 'Passion Fruit Jasmine Sparkling', 19.0, null, '茉莉香檳系列', 'Jasmine Sparkling Series', '{}', true, 248),
  ('ac2-th-green-grape-jasmine-sparkling', 'ac2', '四季茶坊', '青提茉莉香檳', 'Green Grape Jasmine Sparkling', 19.0, null, '茉莉香檳系列', 'Jasmine Sparkling Series', '{}', true, 249),
  ('ac2-th-red-grape-jasmine-sparkling', 'ac2', '四季茶坊', '紅葡萄茉莉香檳', 'Red Grape Jasmine Sparkling', 19.0, null, '茉莉香檳系列', 'Jasmine Sparkling Series', '{}', true, 250),
  ('ac2-th-fragrant-lemon-jasmine-sparkling', 'ac2', '四季茶坊', '香水檸檬茉莉香檳', 'Fragrant Lemon Jasmine Sparkling', 19.0, null, '茉莉香檳系列', 'Jasmine Sparkling Series', '{}', true, 251),
  ('ac2-th-gardenia-milk-tea', 'ac2', '四季茶坊', '栀子奶茶', 'Gardenia Milk Tea', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 252),
  ('ac2-th-matcha-milk-tea', 'ac2', '四季茶坊', '抹茶奶茶', 'Matcha Milk Tea', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 253),
  ('ac2-th-gardenia-latte', 'ac2', '四季茶坊', '栀子拿鐵', 'Gardenia Latte', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 254),
  ('ac2-th-longjing-latte', 'ac2', '四季茶坊', '龍井拿鐵', 'Longjing Latte', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 255),
  ('ac2-th-jasmine-latte', 'ac2', '四季茶坊', '茉莉拿鐵', 'Jasmine Latte', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 256),
  ('ac2-th-matcha-jasmine', 'ac2', '四季茶坊', '抹茶茉莉', 'Matcha Jasmine', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 257),
  ('ac2-th-matcha-coffee', 'ac2', '四季茶坊', '抹茶咖啡', 'Matcha Coffee', 19.0, null, '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 258),
  ('ac2-th-red-guava-soda', 'ac2', '四季茶坊', '紅芭樂梳打', 'Red Guava Soda', 19.0, null, '特飲', 'Special Drink', '{}', true, 259)
on conflict (id) do update set canteen_id=excluded.canteen_id, category=excluded.category,
  zh=excluded.zh, en=excluded.en, price=excluded.price, photo=excluded.photo,
  desc_zh=excluded.desc_zh, desc_en=excluded.desc_en, tags=excluded.tags,
  available=excluded.available, sort=excluded.sort;

-- ③ 補圖（59 道）
update dishes set photo='assets/ac2/-beef-scallion-dumpling-noodles.jpg' where id='ac2-beef-scallion-dumpling-noodles';  -- 大蔥牛肉餃(6隻)湯米線
update dishes set photo='assets/ac2/-bolognese-cherry-tomato.jpg' where id='ac2-bolognese-cherry-tomato';  -- 車厘茄肉醬意粉
update dishes set photo='assets/ac2/-build-your-own-mala-tang.jpg' where id='ac2-build-your-own-mala-tang';  -- 自選麻辣燙（每50克）
update dishes set photo='assets/ac2/-caesar-salad.jpg' where id='ac2-caesar-salad';  -- 法式凱撒沙律
update dishes set photo='assets/ac2/-carbonara.jpg' where id='ac2-carbonara';  -- 卡邦尼意粉
update dishes set photo='assets/ac2/-chicken-cartilage-dumpling-noodles.jpg' where id='ac2-chicken-cartilage-dumpling-noodles';  -- 雞軟骨雞肉餃(6隻)湯米線
update dishes set photo='assets/ac2/-coconut-split-pea-pudding.jpg' where id='ac2-coconut-split-pea-pudding';  -- 馬豆糕
update dishes set photo='assets/ac2/-coffee-layer-pudding.jpg' where id='ac2-coffee-layer-pudding';  -- 咖啡千層糕
update dishes set photo='assets/ac2/-congee-bbq-pork-bun.jpg' where id='ac2-congee-bbq-pork-bun';  -- 皮蛋瘦肉粥・叉燒包
update dishes set photo='assets/ac2/-congee-custard-bun.jpg' where id='ac2-congee-custard-bun';  -- 皮蛋瘦肉粥・奶皇包
update dishes set photo='assets/ac2/-congee-fried-dough-stick.jpg' where id='ac2-congee-fried-dough-stick';  -- 皮蛋瘦肉粥・油條
update dishes set photo='assets/ac2/-congee-glutinous-rice-roll.jpg' where id='ac2-congee-glutinous-rice-roll';  -- 皮蛋瘦肉粥・糯米卷
update dishes set photo='assets/ac2/-congee-malay-cake.jpg' where id='ac2-congee-malay-cake';  -- 皮蛋瘦肉粥・馬拉糕
update dishes set photo='assets/ac2/-congee-soy-fried-noodles.jpg' where id='ac2-congee-soy-fried-noodles';  -- 皮蛋瘦肉粥・豉油皇炒麵
update dishes set photo='assets/ac2/-hawaiian-pork-chop-baked-rice.jpg' where id='ac2-hawaiian-pork-chop-baked-rice';  -- 夏威夷菠蘿芝士焗豬扒飯
update dishes set photo='assets/ac2/-lobster-bisque.jpg' where id='ac2-lobster-bisque';  -- 龍蝦湯
update dishes set photo='assets/ac2/-minced-pork-knife-cut-noodles.jpg' where id='ac2-minced-pork-knife-cut-noodles';  -- 麻辣辣香茜肉碎撈刀削麵
update dishes set photo='assets/ac2/-okra-sesame.jpg' where id='ac2-okra-sesame';  -- 胡麻醬秋葵
update dishes set photo='assets/ac2/-pork-chili-knife-cut-noodles.jpg' where id='ac2-pork-chili-knife-cut-noodles';  -- 麻辣辣尖椒肉絲刀削麵
update dishes set photo='assets/ac2/-portuguese-chicken-baked-rice.jpg' where id='ac2-portuguese-chicken-baked-rice';  -- 焗葡國雞球飯
update dishes set photo='assets/ac2/-red-bean-sweet-soup.jpg' where id='ac2-red-bean-sweet-soup';  -- 蓮子紅豆沙(熱)
update dishes set photo='assets/ac2/-sesame-beef-scallion-dumplings.jpg' where id='ac2-sesame-beef-scallion-dumplings';  -- 混醬香茜撈大蔥牛肉餃(6隻)
update dishes set photo='assets/ac2/-sesame-chicken-cartilage-dumplings.jpg' where id='ac2-sesame-chicken-cartilage-dumplings';  -- 混醬香茜撈雞軟骨雞肉餃(6隻)
update dishes set photo='assets/ac2/-shaoxing-beef-scallion-dumplings.jpg' where id='ac2-shaoxing-beef-scallion-dumplings';  -- 酒香濃湯大蔥牛肉餃(6隻)
update dishes set photo='assets/ac2/-shaoxing-chicken-cartilage-dumplings.jpg' where id='ac2-shaoxing-chicken-cartilage-dumplings';  -- 酒香濃湯雞軟骨雞肉餃(6隻)
update dishes set photo='assets/ac2/-shredded-chicken-romaine.jpg' where id='ac2-shredded-chicken-romaine';  -- 胡麻羅馬菜手撕雞
update dishes set photo='assets/ac2/-shrimp-grapefruit-salad.jpg' where id='ac2-shrimp-grapefruit-salad';  -- 鮮蝦柚子醋汁沙律
update dishes set photo='assets/ac2/-spicy-beef-dry-pot-rice.jpg' where id='ac2-spicy-beef-dry-pot-rice';  -- 香辣牛肉乾鍋・白飯
update dishes set photo='assets/ac2/-spicy-chicken-dry-pot-rice.jpg' where id='ac2-spicy-chicken-dry-pot-rice';  -- 香辣雞肉乾鍋・白飯
update dishes set photo='assets/ac2/-th-apple-americano.jpg' where id='ac2-th-apple-americano';  -- 富士蘋果美式
update dishes set photo='assets/ac2/-th-cheese-lychee-gardenia-lemon-tea.jpg' where id='ac2-th-cheese-lychee-gardenia-lemon-tea';  -- 芝士荔枝栀香檸檬茶
update dishes set photo='assets/ac2/-th-fragrant-lemon-jasmine-sparkling.jpg' where id='ac2-th-fragrant-lemon-jasmine-sparkling';  -- 香水檸檬茉莉香檳
update dishes set photo='assets/ac2/-th-gardenia-latte.jpg' where id='ac2-th-gardenia-latte';  -- 栀子拿鐵
update dishes set photo='assets/ac2/-th-gardenia-lemon-tea.jpg' where id='ac2-th-gardenia-lemon-tea';  -- 栀香檸檬茶
update dishes set photo='assets/ac2/-th-gardenia-milk-tea.jpg' where id='ac2-th-gardenia-milk-tea';  -- 栀子奶茶
update dishes set photo='assets/ac2/-th-green-grape-jasmine-sparkling.jpg' where id='ac2-th-green-grape-jasmine-sparkling';  -- 青提茉莉香檳
update dishes set photo='assets/ac2/-th-guava-jasmine-lemon-tea.jpg' where id='ac2-th-guava-jasmine-lemon-tea';  -- 芭樂茉莉檸檬茶
update dishes set photo='assets/ac2/-th-iced-americano.jpg' where id='ac2-th-iced-americano';  -- 凍美式咖啡
update dishes set photo='assets/ac2/-th-jasmine-latte.jpg' where id='ac2-th-jasmine-latte';  -- 茉莉拿鐵
update dishes set photo='assets/ac2/-th-longjing-latte.jpg' where id='ac2-th-longjing-latte';  -- 龍井拿鐵
update dishes set photo='assets/ac2/-th-lychee-americano.jpg' where id='ac2-th-lychee-americano';  -- 粉荔美式
update dishes set photo='assets/ac2/-th-lychee-gardenia-lemon-tea.jpg' where id='ac2-th-lychee-gardenia-lemon-tea';  -- 粉荔栀香檸檬茶
update dishes set photo='assets/ac2/-th-matcha-coffee.jpg' where id='ac2-th-matcha-coffee';  -- 抹茶咖啡
update dishes set photo='assets/ac2/-th-matcha-jasmine.jpg' where id='ac2-th-matcha-jasmine';  -- 抹茶茉莉
update dishes set photo='assets/ac2/-th-matcha-milk-tea.jpg' where id='ac2-th-matcha-milk-tea';  -- 抹茶奶茶
update dishes set photo='assets/ac2/-th-orange-americano.jpg' where id='ac2-th-orange-americano';  -- 甜橙美式
update dishes set photo='assets/ac2/-th-orange-gardenia-lemon-tea.jpg' where id='ac2-th-orange-gardenia-lemon-tea';  -- 甜橙栀香檸檬茶
update dishes set photo='assets/ac2/-th-passionfruit-jasmine-sparkling.jpg' where id='ac2-th-passionfruit-jasmine-sparkling';  -- 百香果茉莉香檳
update dishes set photo='assets/ac2/-th-peach-americano.jpg' where id='ac2-th-peach-americano';  -- 白桃美式
update dishes set photo='assets/ac2/-th-peach-gardenia-lemon-tea.jpg' where id='ac2-th-peach-gardenia-lemon-tea';  -- 白桃栀香檸檬茶
update dishes set photo='assets/ac2/-th-peach-jasmine-sparkling.jpg' where id='ac2-th-peach-jasmine-sparkling';  -- 水蜜桃茉莉香檳
update dishes set photo='assets/ac2/-th-red-grape-jasmine-sparkling.jpg' where id='ac2-th-red-grape-jasmine-sparkling';  -- 紅葡萄茉莉香檳
update dishes set photo='assets/ac2/-th-red-guava-soda.jpg' where id='ac2-th-red-guava-soda';  -- 紅芭樂梳打
update dishes set photo='assets/ac2/-thai-chicken-feet.jpg' where id='ac2-thai-chicken-feet';  -- 泰式酸辣鳳爪
update dishes set photo='assets/ac2/-tofu-pudding-grass-jelly.jpg' where id='ac2-tofu-pudding-grass-jelly';  -- 鮮草芋圓小丸子豆花
update dishes set photo='assets/ac2/-tomato-chicken-wing-rice-noodles.jpg' where id='ac2-tomato-chicken-wing-rice-noodles';  -- 酸菜番茄濃湯雞中翼米線
update dishes set photo='assets/ac2/-tomato-egg-knife-cut-noodles.jpg' where id='ac2-tomato-egg-knife-cut-noodles';  -- 麻辣辣番茄炒蛋撈刀削麵
update dishes set photo='assets/ac2/-tomato-fish-fillet-rice-noodles.jpg' where id='ac2-tomato-fish-fillet-rice-noodles';  -- 酸菜番茄濃湯魚片米線
update dishes set photo='assets/ac2/-veggie-knife-cut-noodles.jpg' where id='ac2-veggie-knife-cut-noodles';  -- 麻辣辣素菜撈刀削麵

-- ④ 下架 AC1 外賣餐具（5 項，只供外賣使用的容器，非食物）
--   ac1-others-dish  環保餐盒(只供外賣使用)
--   ac1-others-dish-2  環保餐具 (只供外賣使用)
--   ac1-others-dish-3  紙杯(只供外賣使用)
--   ac1-others-dish-4  環保餐盒 ‧ 餐具(只供外賣使用)
--   ac1-others-dish-5  環保餐盒 ‧ 紙杯 ‧ 餐具 (只供外賣使用)
update dishes set available = false where id in (
  'ac1-others-dish', 'ac1-others-dish-2', 'ac1-others-dish-3', 'ac1-others-dish-4', 'ac1-others-dish-5'
);

-- ⑤ 抽籤黑名單（四季茶坊全為飲品，不進抽籤池）
insert into roll_blacklist (kind, value, note) select 'category', '四季茶坊', 'AC2 四季茶坊'
where not exists (select 1 from roll_blacklist where kind='category' and value='四季茶坊');
