-- 2026-10-20 · AC2「四季茶坊」飲品 · 官方點餐站重新同步
-- 來源：https://csd.order.place/order/store/312882/mode/dinein
--       api.aigens.com / store 312882 / menu=kiosk（47 道獨立飲品）
-- 內容：官方名校正、價格校正、47 張官方商品照、2 道官方已下架、1 道舊種子重複飲品下架
-- 可重複執行（update / on conflict do update）。

-- ① 47 道官方飲品：名稱／英文／價錢／商品照／排序 全部對齊官方
update dishes set zh = '甜橙美式', en = 'Iced Orange Americano', price = 19.0, photo = 'assets/ac2/th-orange-americano.jpg', sort = 300, available = true where id = 'ac2-th-orange-americano';
update dishes set zh = '白桃美式', en = 'Iced White Peach Americano', price = 19.0, photo = 'assets/ac2/th-peach-americano.jpg', sort = 301, available = true where id = 'ac2-th-peach-americano';
update dishes set zh = '粉荔美式', en = 'Iced Lychee Americano', price = 19.0, photo = 'assets/ac2/th-lychee-americano.jpg', sort = 302, available = true where id = 'ac2-th-lychee-americano';
update dishes set zh = '富士蘋果美式', en = 'Iced Fuji Apple Americano', price = 19.0, photo = 'assets/ac2/th-apple-americano.jpg', sort = 303, available = true where id = 'ac2-th-apple-americano';
update dishes set zh = '凍美式咖啡', en = 'Iced Caffe Americano', price = 19.0, photo = 'assets/ac2/th-iced-americano.jpg', sort = 304, available = true where id = 'ac2-th-iced-americano';
update dishes set zh = '甜橙梔香檸檬茶', en = 'Orange Perfume Lemon Gardenia Green Tea', price = 19.0, photo = 'assets/ac2/th-orange-gardenia-lemon-tea.jpg', sort = 305, available = true where id = 'ac2-th-orange-gardenia-lemon-tea';
update dishes set zh = '白桃梔香檸檬茶', en = 'White Peach Perfume Lemon Gardenia Green Tea', price = 19.0, photo = 'assets/ac2/th-peach-gardenia-lemon-tea.jpg', sort = 306, available = true where id = 'ac2-th-peach-gardenia-lemon-tea';
update dishes set zh = '粉荔梔香檸檬茶', en = 'Lychee Perfume Lemon Gardenia Green Tea', price = 19.0, photo = 'assets/ac2/th-lychee-gardenia-lemon-tea.jpg', sort = 307, available = true where id = 'ac2-th-lychee-gardenia-lemon-tea';
update dishes set zh = '富士蘋果梔香檸檬茶', en = 'Fuji Apple Perfume Lemon Gardenia Green Tea', price = 19.0, photo = 'assets/ac2/th-apple-gardenia-lemon-tea.jpg', sort = 308, available = true where id = 'ac2-th-apple-gardenia-lemon-tea';
update dishes set zh = '梔香檸檬茶', en = 'Perfume Lemon Gardenia Green Tea', price = 19.0, photo = 'assets/ac2/th-gardenia-lemon-tea.jpg', sort = 309, available = true where id = 'ac2-th-gardenia-lemon-tea';
update dishes set zh = '芭樂茉莉檸檬茶', en = 'Guava Jasmine Lemon Tea', price = 19.0, photo = 'assets/ac2/th-guava-jasmine-lemon-tea.jpg', sort = 310, available = true where id = 'ac2-th-guava-jasmine-lemon-tea';
update dishes set zh = '水蜜桃茉莉香檳', en = 'White Peach Sparkling Jasmine Green Tea', price = 19.0, photo = 'assets/ac2/th-peach-jasmine-sparkling.jpg', sort = 311, available = true where id = 'ac2-th-peach-jasmine-sparkling';
update dishes set zh = '百香果茉莉香檳', en = 'Passion Fruit Sparkling Jasmine Green Tea', price = 19.0, photo = 'assets/ac2/th-passionfruit-jasmine-sparkling.jpg', sort = 312, available = true where id = 'ac2-th-passionfruit-jasmine-sparkling';
update dishes set zh = '青提茉莉香檳', en = 'Green Grape Sparkling Jasmine Green Tea', price = 19.0, photo = 'assets/ac2/th-green-grape-jasmine-sparkling.jpg', sort = 313, available = true where id = 'ac2-th-green-grape-jasmine-sparkling';
update dishes set zh = '紅葡萄茉莉香檳', en = 'Red Grape Sparkling Jasmine Green Tea', price = 19.0, photo = 'assets/ac2/th-red-grape-jasmine-sparkling.jpg', sort = 314, available = true where id = 'ac2-th-red-grape-jasmine-sparkling';
update dishes set zh = '香水檸檬茉莉香檳', en = 'Perfume Lemon Sparkling Jasmine Green Tea', price = 19.0, photo = 'assets/ac2/th-fragrant-lemon-jasmine-sparkling.jpg', sort = 315, available = true where id = 'ac2-th-fragrant-lemon-jasmine-sparkling';
update dishes set zh = '梔子奶茶', en = 'Gardenia Milk Tea', price = 19.0, photo = 'assets/ac2/th-gardenia-milk-tea.jpg', sort = 316, available = true where id = 'ac2-th-gardenia-milk-tea';
update dishes set zh = '茉莉奶茶', en = 'Jasmine Milk Tea', price = 19.0, photo = 'assets/ac2/th-jasmine-milk-tea.jpg', sort = 317, available = true where id = 'ac2-th-jasmine-milk-tea';
update dishes set zh = '梔子拿鐵', en = 'Gardenia Tea Latte', price = 19.0, photo = 'assets/ac2/th-gardenia-latte.jpg', sort = 318, available = true where id = 'ac2-th-gardenia-latte';
update dishes set zh = '龍井拿鐵', en = 'Longjing Tea Latte', price = 19.0, photo = 'assets/ac2/th-longjing-latte.jpg', sort = 319, available = true where id = 'ac2-th-longjing-latte';
update dishes set zh = '茉莉拿鐵', en = 'Jasmine Tea Latte', price = 19.0, photo = 'assets/ac2/th-jasmine-latte.jpg', sort = 320, available = true where id = 'ac2-th-jasmine-latte';
update dishes set zh = '抹茶茉莉', en = 'Jasmine Matcha', price = 19.0, photo = 'assets/ac2/th-matcha-jasmine.jpg', sort = 321, available = true where id = 'ac2-th-matcha-jasmine';
update dishes set zh = '抹茶咖啡', en = 'Dirty Matcha Latte', price = 19.0, photo = 'assets/ac2/th-matcha-coffee.jpg', sort = 322, available = true where id = 'ac2-th-matcha-coffee';
update dishes set zh = '紅芭樂梳打', en = 'Red Guava Soda', price = 19.0, photo = 'assets/ac2/th-red-guava-soda.jpg', sort = 323, available = true where id = 'ac2-th-red-guava-soda';
update dishes set zh = '熱咖啡', en = 'Hot Coffee', price = 6.0, photo = 'assets/ac2/th-hot-coffee.jpg', sort = 324, available = true where id = 'ac2-th-hot-coffee';
update dishes set zh = '熱黑咖啡', en = 'Hot Black Coffee', price = 6.0, photo = 'assets/ac2/th-hot-black-coffee.jpg', sort = 325, available = true where id = 'ac2-th-hot-black-coffee';
update dishes set zh = '熱奶茶', en = 'Hot Milk Tea', price = 6.0, photo = 'assets/ac2/th-hot-milk-tea.jpg', sort = 326, available = true where id = 'ac2-th-hot-milk-tea';
update dishes set zh = '熱鴛鴦', en = 'Hot Coffee and Tea Mix', price = 6.0, photo = 'assets/ac2/th-hot-yuanyang.jpg', sort = 327, available = true where id = 'ac2-th-hot-yuanyang';
update dishes set zh = '熱檸檬茶', en = 'Hot Lemon Tea', price = 6.0, photo = 'assets/ac2/th-hot-lemon-tea.jpg', sort = 328, available = true where id = 'ac2-th-hot-lemon-tea';
update dishes set zh = '熱檸檬水', en = 'Hot Lemon Water', price = 6.0, photo = 'assets/ac2/th-hot-lemon-water.jpg', sort = 329, available = true where id = 'ac2-th-hot-lemon-water';
update dishes set zh = '熱好立克', en = 'Hot Horlicks', price = 6.0, photo = 'assets/ac2/th-hot-horlicks.jpg', sort = 330, available = true where id = 'ac2-th-hot-horlicks';
update dishes set zh = '熱阿華田', en = 'Hot Ovaltine', price = 6.0, photo = 'assets/ac2/th-hot-ovaltine.jpg', sort = 331, available = true where id = 'ac2-th-hot-ovaltine';
update dishes set zh = '凍咖啡', en = 'Iced Coffee', price = 7.5, photo = 'assets/ac2/th-iced-coffee.jpg', sort = 332, available = true where id = 'ac2-th-iced-coffee';
update dishes set zh = '凍黑咖啡', en = 'Iced Black Coffee', price = 7.5, photo = 'assets/ac2/th-iced-black-coffee.jpg', sort = 333, available = true where id = 'ac2-th-iced-black-coffee';
update dishes set zh = '凍奶茶', en = 'Iced Milk Tea', price = 7.5, photo = 'assets/ac2/th-iced-milk-tea.jpg', sort = 334, available = true where id = 'ac2-th-iced-milk-tea';
update dishes set zh = '凍鴛鴦', en = 'Iced Coffee and Tea', price = 7.5, photo = 'assets/ac2/th-iced-yuanyang.jpg', sort = 335, available = true where id = 'ac2-th-iced-yuanyang';
update dishes set zh = '凍檸檬茶', en = 'Iced Lemon Tea', price = 7.5, photo = 'assets/ac2/th-iced-lemon-tea.jpg', sort = 336, available = true where id = 'ac2-th-iced-lemon-tea';
update dishes set zh = '凍檸檬水', en = 'Iced Lemon Water', price = 7.5, photo = 'assets/ac2/th-iced-lemon-water.jpg', sort = 337, available = true where id = 'ac2-th-iced-lemon-water';
update dishes set zh = '凍好立克', en = 'Iced Horlicks', price = 7.5, photo = 'assets/ac2/th-iced-horlicks.jpg', sort = 338, available = true where id = 'ac2-th-iced-horlicks';
update dishes set zh = '凍阿華田', en = 'Iced Ovaltine', price = 7.5, photo = 'assets/ac2/th-iced-ovaltine.jpg', sort = 339, available = true where id = 'ac2-th-iced-ovaltine';
update dishes set zh = '酸梅湯', en = 'Sour Plum Tea', price = 10.0, photo = 'assets/ac2/th-sour-plum-tea.jpg', sort = 340, available = true where id = 'ac2-th-sour-plum-tea';
update dishes set zh = '百事', en = 'Pepsi', price = 6.0, photo = 'assets/ac2/th-pepsi.jpg', sort = 341, available = true where id = 'ac2-th-pepsi';
update dishes set zh = '輕怡百事', en = 'Pepsi Light', price = 6.0, photo = 'assets/ac2/th-pepsi-light.jpg', sort = 342, available = true where id = 'ac2-th-pepsi-light';
update dishes set zh = '七喜', en = '7-Up', price = 6.0, photo = 'assets/ac2/th-7up.jpg', sort = 343, available = true where id = 'ac2-th-7up';
update dishes set zh = '紅牛', en = 'Red Bull Energy Drink', price = 18.0, photo = 'assets/ac2/th-red-bull.jpg', sort = 344, available = true where id = 'ac2-th-red-bull';
update dishes set zh = '無糖紅牛', en = 'Red Bull Sugarfree', price = 18.0, photo = 'assets/ac2/th-red-bull-sugarfree.jpg', sort = 345, available = true where id = 'ac2-th-red-bull-sugarfree';
update dishes set zh = '富士蘋果紅牛', en = 'Red Bull Apple Edition (Fuji Apple)', price = 18.0, photo = 'assets/ac2/th-red-bull-apple.jpg', sort = 346, available = true where id = 'ac2-th-red-bull-apple';

-- ③ 官方菜單上已無此項 → 下架（保留 row，舊評論不會孤兒）
-- 芝士荔枝栀香檸檬茶（官方已下架）
update dishes set available = false where id = 'ac2-th-cheese-lychee-gardenia-lemon-tea';
-- 抹茶奶茶（官方已下架）
update dishes set available = false where id = 'ac2-th-matcha-milk-tea';

-- ④ AC2 其他飲品一律歸四季茶坊：舊種子「飲品甜品」裡的凍檸檬茶（$9，與官方 $7.5 重複）下架
update dishes set available = false where id = 'ac2-milk-tea';

-- ⑤ 四季茶坊**沒有**獨立點餐平台（store 312882 是西北麵館的店，飲品只是掛在該店菜單下），
--    所以分類不給點餐連結 —— 給了會把客人帶去西北麵館的店。就算重跑本檔也要保持 NULL。
update categories set order_url = null where id = '四季茶坊';
