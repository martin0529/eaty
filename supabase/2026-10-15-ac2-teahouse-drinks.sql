-- 2026-10-15 · AC2「四季茶坊」飲品同步（官方 aigens 點餐後端）
-- 來源 store 312882 / 212882 共用的 6 個飲品分類，共 47 道（另保留 2 道官方已無的舊菜）
-- 可重複執行（on conflict do update）。分類「四季茶坊」不變。

-- ① 現有 24 道：更新 sort（改為 300 起、依系列排序）＋ 換成官方商品照
update dishes set sort = 300, photo = 'assets/ac2/th-orange-americano.jpg' where id = 'ac2-th-orange-americano';
update dishes set sort = 301, photo = 'assets/ac2/th-peach-americano.jpg' where id = 'ac2-th-peach-americano';
update dishes set sort = 302, photo = 'assets/ac2/th-lychee-americano.jpg' where id = 'ac2-th-lychee-americano';
update dishes set sort = 303, photo = 'assets/ac2/th-apple-americano.jpg' where id = 'ac2-th-apple-americano';
update dishes set sort = 304, photo = 'assets/ac2/th-iced-americano.jpg' where id = 'ac2-th-iced-americano';
update dishes set sort = 305, photo = 'assets/ac2/th-orange-gardenia-lemon-tea.jpg' where id = 'ac2-th-orange-gardenia-lemon-tea';
update dishes set sort = 306, photo = 'assets/ac2/th-peach-gardenia-lemon-tea.jpg' where id = 'ac2-th-peach-gardenia-lemon-tea';
update dishes set sort = 307, photo = 'assets/ac2/th-lychee-gardenia-lemon-tea.jpg' where id = 'ac2-th-lychee-gardenia-lemon-tea';
update dishes set sort = 308, photo = 'assets/ac2/th-cheese-lychee-gardenia-lemon-tea.jpg' where id = 'ac2-th-cheese-lychee-gardenia-lemon-tea';
update dishes set sort = 310, photo = 'assets/ac2/th-gardenia-lemon-tea.jpg' where id = 'ac2-th-gardenia-lemon-tea';
update dishes set sort = 311, photo = 'assets/ac2/th-guava-jasmine-lemon-tea.jpg' where id = 'ac2-th-guava-jasmine-lemon-tea';
update dishes set sort = 312, photo = 'assets/ac2/th-peach-jasmine-sparkling.jpg' where id = 'ac2-th-peach-jasmine-sparkling';
update dishes set sort = 313, photo = 'assets/ac2/th-passionfruit-jasmine-sparkling.jpg' where id = 'ac2-th-passionfruit-jasmine-sparkling';
update dishes set sort = 314, photo = 'assets/ac2/th-green-grape-jasmine-sparkling.jpg' where id = 'ac2-th-green-grape-jasmine-sparkling';
update dishes set sort = 315, photo = 'assets/ac2/th-red-grape-jasmine-sparkling.jpg' where id = 'ac2-th-red-grape-jasmine-sparkling';
update dishes set sort = 316, photo = 'assets/ac2/th-fragrant-lemon-jasmine-sparkling.jpg' where id = 'ac2-th-fragrant-lemon-jasmine-sparkling';
update dishes set sort = 317, photo = 'assets/ac2/th-gardenia-milk-tea.jpg' where id = 'ac2-th-gardenia-milk-tea';
update dishes set sort = 318, photo = 'assets/ac2/th-matcha-milk-tea.jpg' where id = 'ac2-th-matcha-milk-tea';
update dishes set sort = 320, photo = 'assets/ac2/th-gardenia-latte.jpg' where id = 'ac2-th-gardenia-latte';
update dishes set sort = 321, photo = 'assets/ac2/th-longjing-latte.jpg' where id = 'ac2-th-longjing-latte';
update dishes set sort = 322, photo = 'assets/ac2/th-jasmine-latte.jpg' where id = 'ac2-th-jasmine-latte';
update dishes set sort = 323, photo = 'assets/ac2/th-matcha-jasmine.jpg' where id = 'ac2-th-matcha-jasmine';
update dishes set sort = 324, photo = 'assets/ac2/th-matcha-coffee.jpg' where id = 'ac2-th-matcha-coffee';
update dishes set sort = 325, photo = 'assets/ac2/th-red-guava-soda.jpg' where id = 'ac2-th-red-guava-soda';

-- ② 新增 25 道官方飲品
insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
  ('ac2-th-apple-gardenia-lemon-tea', 'ac2', '四季茶坊', '富士蘋果栀香檸檬茶', 'Fuji Apple Gardenia Lemon Tea', 19.0, 'assets/ac2/th-apple-gardenia-lemon-tea.jpg', '果味檸檬茶系列', 'Fruit Lemon Tea Series', '{}', true, 309),
  ('ac2-th-jasmine-milk-tea', 'ac2', '四季茶坊', '茉莉奶茶', 'Jasmine Milk Tea', 19.0, 'assets/ac2/th-jasmine-milk-tea.jpg', '東方茶咖系列', 'Oriental Tea & Coffee Series', '{}', true, 319),
  ('ac2-th-hot-coffee', 'ac2', '四季茶坊', '熱咖啡', 'Hot Coffee', 6.0, 'assets/ac2/th-hot-coffee.jpg', '基本飲品', 'Classic Drinks', '{}', true, 326),
  ('ac2-th-hot-black-coffee', 'ac2', '四季茶坊', '熱黑咖啡', 'Hot Black Coffee', 6.0, 'assets/ac2/th-hot-black-coffee.jpg', '基本飲品', 'Classic Drinks', '{}', true, 327),
  ('ac2-th-hot-milk-tea', 'ac2', '四季茶坊', '熱奶茶', 'Hot Milk Tea', 6.0, 'assets/ac2/th-hot-milk-tea.jpg', '基本飲品', 'Classic Drinks', '{}', true, 328),
  ('ac2-th-hot-yuanyang', 'ac2', '四季茶坊', '熱鴛鴦', 'Hot Coffee and Tea Mix', 6.0, 'assets/ac2/th-hot-yuanyang.jpg', '基本飲品', 'Classic Drinks', '{}', true, 329),
  ('ac2-th-hot-lemon-tea', 'ac2', '四季茶坊', '熱檸檬茶', 'Hot Lemon Tea', 6.0, 'assets/ac2/th-hot-lemon-tea.jpg', '基本飲品', 'Classic Drinks', '{}', true, 330),
  ('ac2-th-hot-lemon-water', 'ac2', '四季茶坊', '熱檸檬水', 'Hot Lemon Water', 6.0, 'assets/ac2/th-hot-lemon-water.jpg', '基本飲品', 'Classic Drinks', '{}', true, 331),
  ('ac2-th-hot-horlicks', 'ac2', '四季茶坊', '熱好立克', 'Hot Horlicks', 6.0, 'assets/ac2/th-hot-horlicks.jpg', '基本飲品', 'Classic Drinks', '{}', true, 332),
  ('ac2-th-hot-ovaltine', 'ac2', '四季茶坊', '熱阿華田', 'Hot Ovaltine', 6.0, 'assets/ac2/th-hot-ovaltine.jpg', '基本飲品', 'Classic Drinks', '{}', true, 333),
  ('ac2-th-iced-coffee', 'ac2', '四季茶坊', '凍咖啡', 'Iced Coffee', 7.5, 'assets/ac2/th-iced-coffee.jpg', '基本飲品', 'Classic Drinks', '{}', true, 334),
  ('ac2-th-iced-black-coffee', 'ac2', '四季茶坊', '凍黑咖啡', 'Iced Black Coffee', 7.5, 'assets/ac2/th-iced-black-coffee.jpg', '基本飲品', 'Classic Drinks', '{}', true, 335),
  ('ac2-th-iced-milk-tea', 'ac2', '四季茶坊', '凍奶茶', 'Iced Milk Tea', 7.5, 'assets/ac2/th-iced-milk-tea.jpg', '基本飲品', 'Classic Drinks', '{}', true, 336),
  ('ac2-th-iced-yuanyang', 'ac2', '四季茶坊', '凍鴛鴦', 'Iced Coffee and Tea', 7.5, 'assets/ac2/th-iced-yuanyang.jpg', '基本飲品', 'Classic Drinks', '{}', true, 337),
  ('ac2-th-iced-lemon-tea', 'ac2', '四季茶坊', '凍檸檬茶', 'Iced Lemon Tea', 7.5, 'assets/ac2/th-iced-lemon-tea.jpg', '基本飲品', 'Classic Drinks', '{}', true, 338),
  ('ac2-th-iced-lemon-water', 'ac2', '四季茶坊', '凍檸檬水', 'Iced Lemon Water', 7.5, 'assets/ac2/th-iced-lemon-water.jpg', '基本飲品', 'Classic Drinks', '{}', true, 339),
  ('ac2-th-iced-horlicks', 'ac2', '四季茶坊', '凍好立克', 'Iced Horlicks', 7.5, 'assets/ac2/th-iced-horlicks.jpg', '基本飲品', 'Classic Drinks', '{}', true, 340),
  ('ac2-th-iced-ovaltine', 'ac2', '四季茶坊', '凍阿華田', 'Iced Ovaltine', 7.5, 'assets/ac2/th-iced-ovaltine.jpg', '基本飲品', 'Classic Drinks', '{}', true, 341),
  ('ac2-th-sour-plum-tea', 'ac2', '四季茶坊', '酸梅湯', 'Sour Plum Tea', 10.0, 'assets/ac2/th-sour-plum-tea.jpg', '基本飲品', 'Classic Drinks', '{}', true, 342),
  ('ac2-th-pepsi', 'ac2', '四季茶坊', '百事', 'Pepsi', 6.0, 'assets/ac2/th-pepsi.jpg', '基本飲品', 'Classic Drinks', '{}', true, 343),
  ('ac2-th-pepsi-light', 'ac2', '四季茶坊', '輕怡百事', 'Pepsi Light', 6.0, 'assets/ac2/th-pepsi-light.jpg', '基本飲品', 'Classic Drinks', '{}', true, 344),
  ('ac2-th-7up', 'ac2', '四季茶坊', '七喜', '7up', 6.0, 'assets/ac2/th-7up.jpg', '基本飲品', 'Classic Drinks', '{}', true, 345),
  ('ac2-th-red-bull', 'ac2', '四季茶坊', '紅牛', 'Red Bull Energy Drink', 18.0, 'assets/ac2/th-red-bull.jpg', '包裝飲品', 'Packaged Drinks', '{}', true, 346),
  ('ac2-th-red-bull-sugarfree', 'ac2', '四季茶坊', '無糖紅牛', 'Red Bull Sugarfree', 18.0, 'assets/ac2/th-red-bull-sugarfree.jpg', '包裝飲品', 'Packaged Drinks', '{}', true, 347),
  ('ac2-th-red-bull-apple', 'ac2', '四季茶坊', '富士蘋果紅牛', 'Red Bull Fuji Apple', 18.0, 'assets/ac2/th-red-bull-apple.jpg', '包裝飲品', 'Packaged Drinks', '{}', true, 348)
on conflict (id) do update set
  canteen_id = excluded.canteen_id, category = excluded.category,
  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,
  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en,
  available = excluded.available, sort = excluded.sort;

