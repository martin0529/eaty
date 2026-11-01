/* Eaty — 多大學版本 · 香港城市大學（CityU）資料
 *
 * 資料來源：
 *  - AC1 城大食坊：2026-10-02 從官方點餐站 csd.order.place/home/store/112870 抄錄的真實菜品與價錢。
 *  - AC2 / AC3：官方沒有網上菜單，以下為代表性菜品（真實名氣菜＋常見檔口款式），價錢為約數。
 *
 * 欄位：
 *   categories: { id, uni, zh, en, meal }
 *   canteens:   { id, uni, short, zh, en, bldgZh, bldgEn, hoursZh, hoursEn, factZh, factEn, color, photo, orderUrl }
 *   dishes:     { id, uni, canteenId, cat, zh, en, price, photo?, descZh?, descEn?, tags? }
 */
window.EATY_DATA_CITYU = {

  categories: [
    { id: 'rice',     uni: 'cityu', zh: '中式飯類', en: 'Rice & Chinese',   meal: 'lunch,dinner' },
    { id: 'noodle',   uni: 'cityu', zh: '粉麵',     en: 'Noodles',           meal: 'lunch,dinner' },
    { id: 'japanese', uni: 'cityu', zh: '日韓',     en: 'Japanese & Korean', meal: 'lunch,dinner' },
    { id: 'asian',    uni: 'cityu', zh: '東南亞',   en: 'Southeast Asian',   meal: 'lunch,dinner' },
    { id: 'western',  uni: 'cityu', zh: '西式',     en: 'Western',           meal: 'lunch,dinner' },
    { id: 'snack',    uni: 'cityu', zh: '小食',     en: 'Snacks',            meal: 'lunch,dinner' },
    { id: 'drinks',   uni: 'cityu', zh: '飲品甜品', en: 'Drinks & Dessert',  meal: 'lunch,dinner' },
  ],

  canteens: [
    {
      id: 'ac1', uni: 'cityu', short: 'AC1',
      zh: '城大食坊', en: 'City Express',
      bldgZh: '康樂樓 5 樓', bldgEn: '5/F, Amenities Building',
      hoursZh: '週一至五 07:30–20:00・週六至日 08:00–18:00（公眾假期休息）',
      hoursEn: 'Mon–Fri 07:30–20:00 · Sat–Sun 08:00–18:00 (PH closed)',
      color: 'ac1',
      photo: 'assets/ac1/store.jpg',
      orderUrl: 'https://csd.order.place/home/store/112870',
      factZh: '三大食堂中唯一設有官方網上點餐，車仔麵、燒味、日式丼飯一應俱全。',
      factEn: 'The only canteen with official online ordering — roast meats, noodles, donburi and more.',
    },
    {
      id: 'ac2', uni: 'cityu', short: 'AC2',
      zh: 'AC2 Canteen', en: 'AC2 Canteen',
      bldgZh: '李達三葉耀珍學術樓 3 樓', bldgEn: '3/F, Li Dak Sum Yip Yio Chin Academic Building',
      hoursZh: '週一至日 07:30–21:00（農曆新年休息）',
      hoursEn: 'Mon–Sun 07:30–21:00 (CNY closed)',
      color: 'ac2',
      photo: 'assets/ac2/cover.jpg',
      factZh: '全校最大的 food court（860 座），$30 雙餸飯是城大傳說級的超值之選。',
      factEn: 'The biggest food court on campus (860 seats). The HK$30 two-dish rice is legendary value.',
    },
    {
      id: 'ac3', uni: 'cityu', short: 'AC3',
      zh: 'AC3 Bistro', en: 'AC3 Bistro',
      bldgZh: '劉鳴煒學術樓 7 樓', bldgEn: '7/F, Lau Ming Wai Academic Building',
      hoursZh: '週一至五 07:30–21:00（週日及公眾假期休息）',
      hoursEn: 'Mon–Fri 07:30–21:00 (Sun & PH closed)',
      color: 'ac3',
      photo: 'assets/ac3/cover.jpg',
      factZh: '座落教學樓頂層的小 Bistro，人少安靜，吞拿魚披薩是鎮店之寶。',
      factEn: 'A quiet little bistro on the top teaching floors — the tuna pizza is the house icon.',
    },
  ],

  dishes: [
    /* ── AC1 城大食坊（真實菜單，2026-10-02 抄錄）────────────── */
    { id: 'ac1-sampan-fan',    uni: 'cityu', canteenId: 'ac1', cat: 'rice', zh: '鹹蛋三寶飯', en: 'Salted Egg Three-Treasure Rice', price: 32.7, photo: 'assets/chicken-rice-bowl.jpg', tags: ['value'], descZh: '鹹蛋＋三款小菜鋪面，一盒滿足。', descEn: 'Salted egg and three toppings over rice — a full box of comfort.' },
    { id: 'ac1-dual-roast',    uni: 'cityu', canteenId: 'ac1', cat: 'rice', zh: '燒味雙拼飯', en: 'Dual Roast Meat Rice', price: 28.6, photo: 'assets/roast-ducks-display.jpg', tags: ['signature', 'value'], descZh: '即燒叉燒、燒鴨等任選兩款，食堂主打。', descEn: 'Pick two from char siu, roast duck and more — the canteen\'s headliner.' },
    { id: 'ac1-single-roast',  uni: 'cityu', canteenId: 'ac1', cat: 'rice', zh: '燒味單拼飯', en: 'Roast Meat Rice', price: 22, tags: ['value'], descZh: '最平價的燒味飯，學生恩物。', descEn: 'The cheapest roast rice on campus — a broke-student staple.' },
    { id: 'ac1-duck-spicy',    uni: 'cityu', canteenId: 'ac1', cat: 'rice', zh: '麻辣肉丁‧明爐燒鴨飯', en: 'Spicy Diced Pork & Roast Duck Rice', price: 44, photo: 'assets/duck-rice.jpg', tags: ['spicy'] },
    { id: 'ac1-koushui-chicken', uni: 'cityu', canteenId: 'ac1', cat: 'rice', zh: '口水雞‧白飯', en: 'Mouth-watering Chicken & Rice', price: 40.9, tags: ['spicy'] },
    { id: 'ac1-beef-noodle',   uni: 'cityu', canteenId: 'ac1', cat: 'noodle', zh: '台式麻辣牛肉麵', en: 'Taiwanese Spicy Beef Noodle Soup', price: 43, photo: 'assets/noodle-beef.jpg', tags: ['spicy', 'signature'], descZh: '湯頭濃郁、牛肉大塊，冬天必食。', descEn: 'Rich broth and thick-cut beef — a winter must.' },
    { id: 'ac1-suanla-mixian', uni: 'cityu', canteenId: 'ac1', cat: 'noodle', zh: '酸辣米線', en: 'Hot & Sour Rice Noodles', price: 22.5, photo: 'assets/noodle-rice.jpg', tags: ['spicy', 'value'] },
    { id: 'ac1-duck-hofun',    uni: 'cityu', canteenId: 'ac1', cat: 'noodle', zh: '鴨腿湯河粉', en: 'Duck Leg Rice Noodle Soup', price: 39, photo: 'assets/noodle-hofun.jpg' },
    { id: 'ac1-fishball-fun',  uni: 'cityu', canteenId: 'ac1', cat: 'noodle', zh: '魚蛋湯粉', en: 'Fish Ball Noodle Soup', price: 29.7, photo: 'assets/noodle-thai.jpg', tags: ['value'] },
    { id: 'ac1-mushroom-noodle', uni: 'cityu', canteenId: 'ac1', cat: 'noodle', zh: '豉油皇菇絲炒麵', en: 'Soy Sauce Mushroom Noodles', price: 12.5, tags: ['value'], descZh: '$12.5 有菇有麵，超值之最。', descEn: 'Twelve dollars fifty — unbeatable value.' },
    { id: 'ac1-beef-don',      uni: 'cityu', canteenId: 'ac1', cat: 'japanese', zh: '洋蔥牛肉丼', en: 'Beef & Onion Donburi', price: 49.1, photo: 'assets/donburi.jpg', tags: ['signature'] },
    { id: 'ac1-onsen-don',     uni: 'cityu', canteenId: 'ac1', cat: 'japanese', zh: '汁煮豚肉‧溫泉玉子丼', en: 'Simmered Pork & Onsen Egg Donburi', price: 49.1 },
    { id: 'ac1-curry-katsu',   uni: 'cityu', canteenId: 'ac1', cat: 'japanese', zh: '咖喱唐揚雞飯', en: 'Curry Fried Chicken Rice', price: 51.2, photo: 'assets/curry-katsu.jpg', tags: ['signature'], descZh: '日式咖喱配炸雞，食堂日系代表。', descEn: 'Japanese curry with fried chicken — the Japanese corner\'s star.' },
    { id: 'ac1-teriyaki-udon', uni: 'cityu', canteenId: 'ac1', cat: 'japanese', zh: '照燒雞扒烏冬', en: 'Teriyaki Chicken Udon', price: 46, photo: 'assets/udon.jpg' },
    { id: 'ac1-thai-chicken',  uni: 'cityu', canteenId: 'ac1', cat: 'asian', zh: '泰式水門雞飯‧例湯', en: 'Thai Hainanese Chicken Rice & Soup', price: 49.1 },
    { id: 'ac1-lemongrass-leg', uni: 'cityu', canteenId: 'ac1', cat: 'asian', zh: '香茅雞髀‧油飯', en: 'Lemongrass Chicken Leg & Oiled Rice', price: 38.9 },
    { id: 'ac1-cha-lau-fan',   uni: 'cityu', canteenId: 'ac1', cat: 'asian', zh: '扎肉‧肉燥飯', en: 'Vietnamese Pork & Minced Pork Rice', price: 39 },
    { id: 'ac1-thai-fishcake', uni: 'cityu', canteenId: 'ac1', cat: 'asian', zh: '泰式魚餅‧肉燥飯', en: 'Thai Fish Cake & Minced Pork Rice', price: 39 },
    { id: 'ac1-pepperoni',     uni: 'cityu', canteenId: 'ac1', cat: 'western', zh: '辣肉腸披薩', en: 'Pepperoni Pizza', price: 49.1, photo: 'assets/pizza.jpg', tags: ['signature'], descZh: '即叫即製，需等 15–20 分鐘，值得等候。', descEn: 'Made to order in 15–20 minutes — worth the wait.' },
    { id: 'ac1-hawaii-pizza',  uni: 'cityu', canteenId: 'ac1', cat: 'western', zh: '夏威夷菠蘿火腿芝士披薩', en: 'Hawaiian Pineapple Ham Cheese Pizza', price: 49.1 },
    { id: 'ac1-porkchop-bun',  uni: 'cityu', canteenId: 'ac1', cat: 'snack', zh: '芥末吉列豬扒包‧薯條', en: 'Wasabi Katsu Pork Chop Bun & Fries', price: 36.8, photo: 'assets/sandwich-making.jpg', descZh: '豬扒炸至香脆，配薯條就是豐盛一餐。', descEn: 'Crispy katsu pork chop in a bun with fries.' },
    { id: 'ac1-fried-chicken', uni: 'cityu', canteenId: 'ac1', cat: 'snack', zh: '炸雞髀‧薯條', en: 'Fried Chicken Leg & Fries', price: 28.6, photo: 'assets/fried-chicken.jpg' },
    { id: 'ac1-french-toast',  uni: 'cityu', canteenId: 'ac1', cat: 'snack', zh: '西多士', en: 'Hong Kong French Toast', price: 24.6, photo: 'assets/french-toast.jpg', tags: ['sweet'], descZh: '茶餐廳經典，下午茶之魂。', descEn: 'The cha chaan teng classic — afternoon tea\'s soul.' },
    { id: 'ac1-wun-jai-gee',   uni: 'cityu', canteenId: 'ac1', cat: 'snack', zh: '碗仔翅', en: 'Street-style "Shark Fin" Soup', price: 18, photo: 'assets/porridge.jpg', tags: ['value'] },
    { id: 'ac1-iced-milktea',  uni: 'cityu', canteenId: 'ac1', cat: 'drinks', zh: '凍奶茶', en: 'Iced Milk Tea', price: 7.5, photo: 'assets/milk-tea.jpg', tags: ['signature', 'value'], descZh: '$7.5 一杯，全場最超值。', descEn: 'Seven fifty a cup — the best deal in the building.' },
    { id: 'ac1-iced-yuenyeung', uni: 'cityu', canteenId: 'ac1', cat: 'drinks', zh: '凍鴛鴦', en: 'Iced Yuenyeung (Tea-Coffee Mix)', price: 7.5, tags: ['value'] },
    { id: 'ac1-latte-large',   uni: 'cityu', canteenId: 'ac1', cat: 'drinks', zh: '大凍鮮奶咖啡（16oz）', en: 'Large Iced Latte (16oz)', price: 30.7, photo: 'assets/latte.jpg' },

    /* ── AC2 Canteen（代表性菜品，價錢約數）────────────────── */
    { id: 'ac2-two-dish',      uni: 'cityu', canteenId: 'ac2', cat: 'rice', zh: '抵食雙餸飯', en: 'Two-Dish Rice (Legendarily Cheap)', price: 30, photo: 'assets/chicken-rice-bowl.jpg', tags: ['signature', 'value'], descZh: '$30 兩餸一飯，全城大最超值，中午大排長龍。', descEn: 'Two dishes over rice for HK$30 — the best value on campus, queue at noon.' },
    { id: 'ac2-claypot',       uni: 'cityu', canteenId: 'ac2', cat: 'rice', zh: '北菇滑雞煲仔飯', en: 'Mushroom & Chicken Claypot Rice', price: 38, photo: 'assets/hotpot.jpg', tags: ['signature'], descZh: '秋冬限定，鍋巴最為香脆。', descEn: 'Autumn–winter special; the crispy bottom rice is the point.' },
    { id: 'ac2-mapo-tofu',     uni: 'cityu', canteenId: 'ac2', cat: 'rice', zh: '麻婆豆腐飯', en: 'Mapo Tofu Rice', price: 26, tags: ['spicy', 'value'] },
    { id: 'ac2-yeungchow',     uni: 'cityu', canteenId: 'ac2', cat: 'rice', zh: '揚州炒飯', en: 'Yeung Chow Fried Rice', price: 28 },
    { id: 'ac2-beef-hofun',    uni: 'cityu', canteenId: 'ac2', cat: 'noodle', zh: '干炒牛河', en: 'Stir-fried Beef Flat Noodles', price: 32 },
    { id: 'ac2-satay-beef',    uni: 'cityu', canteenId: 'ac2', cat: 'noodle', zh: '沙嗲牛肉麵', en: 'Satay Beef Noodle Soup', price: 28 },
    { id: 'ac2-mango-shrimp',  uni: 'cityu', canteenId: 'ac2', cat: 'asian', zh: '凍芒果蝦沙律', en: 'Chilled Mango Shrimp Salad', price: 28, photo: 'assets/mango-salad.jpg', tags: ['signature'], descZh: 'AC2 名物，夏天首選。', descEn: 'The AC2 signature — perfect in summer.' },
    { id: 'ac2-curry-brisket', uni: 'cityu', canteenId: 'ac2', cat: 'asian', zh: '咖喱牛腩飯', en: 'Curry Beef Brisket Rice', price: 34, tags: ['spicy'] },
    { id: 'ac2-salt-chicken-wing', uni: 'cityu', canteenId: 'ac2', cat: 'snack', zh: '椒鹽雞翼', en: 'Salt & Pepper Chicken Wings', price: 22 },
    { id: 'ac2-milk-tea',      uni: 'cityu', canteenId: 'ac2', cat: 'drinks', zh: '凍檸檬茶', en: 'Iced Lemon Tea', price: 9 },

    /* ── AC3 Bistro（代表性菜品，價錢約數）────────────────── */
    { id: 'ac3-tuna-pizza',    uni: 'cityu', canteenId: 'ac3', cat: 'western', zh: '吞拿魚披薩', en: 'Tuna Pizza', price: 42, photo: 'assets/pizza.jpg', tags: ['signature'], descZh: 'AC3 鎮店之寶，經常售罄。', descEn: 'The house icon — often sells out.' },
    { id: 'ac3-carbonara',     uni: 'cityu', canteenId: 'ac3', cat: 'western', zh: '卡邦尼意粉', en: 'Spaghetti Carbonara', price: 38, photo: 'assets/carbonara.jpg' },
    { id: 'ac3-bolognese',     uni: 'cityu', canteenId: 'ac3', cat: 'western', zh: '肉醬意粉', en: 'Spaghetti Bolognese', price: 36, photo: 'assets/bolognese.jpg' },
    { id: 'ac3-chicken-sandwich', uni: 'cityu', canteenId: 'ac3', cat: 'western', zh: '烤雞三文治', en: 'Roast Chicken Sandwich', price: 32, photo: 'assets/sandwich-making.jpg' },
    { id: 'ac3-udon',          uni: 'cityu', canteenId: 'ac3', cat: 'japanese', zh: '海鮮烏冬', en: 'Seafood Udon', price: 36 },
    { id: 'ac3-latte',         uni: 'cityu', canteenId: 'ac3', cat: 'drinks', zh: '鮮奶咖啡', en: 'Latte', price: 24, photo: 'assets/latte.jpg' },
  ],
};
