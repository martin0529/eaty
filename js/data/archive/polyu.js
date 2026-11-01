/* Eaty — 多大學版本 · 香港理工大學（PolyU）資料
 *
 * ⚠️ 測試資料（2026-10-23 建立）
 *   這份菜單是**虛構的**，只為驗證「選學校 → 選食堂 → 看菜單」三層流程與版面，
 *   不是理大的真實菜單。菜名與價錢取材自香港校園食堂的常見款式，數字僅供示意。
 *   之後要換成真實資料時，只需替換本檔的 categories / canteens / dishes，
 *   欄位形狀與 cityu.js 完全相同，app.js 不用改。
 *
 * 欄位：
 *   categories: { id, uni, zh, en, meal, orderUrl? }
 *   canteens:   { id, uni, short, zh, en, bldgZh, bldgEn, hoursZh, hoursEn, factZh, factEn, color, photo?, orderUrl? }
 *   dishes:     { id, uni, canteenId, cat, zh, en, price, photo?, descZh?, descEn?, tags? }
 */
window.EATY_DATA_POLYU = {

  categories: [
    /* VA 學生食堂 */
    { id: 'polyu-va-rice',    uni: 'polyu', zh: '中式飯類', en: 'Rice & Chinese',   meal: 'lunch,dinner' },
    { id: 'polyu-va-noodle',  uni: 'polyu', zh: '粉麵',     en: 'Noodles',          meal: 'breakfast,lunch,dinner' },
    { id: 'polyu-va-western', uni: 'polyu', zh: '西式',     en: 'Western',          meal: 'lunch,dinner' },
    { id: 'polyu-va-snack',   uni: 'polyu', zh: '小食',     en: 'Snacks',           meal: 'breakfast,lunch,tea,dinner' },
    { id: 'polyu-va-drinks',  uni: 'polyu', zh: '飲品',     en: 'Drinks',           meal: 'breakfast,lunch,tea,dinner' },

    /* 南北小廚 */
    { id: 'polyu-ns-dimsum',   uni: 'polyu', zh: '點心', en: 'Dim Sum',    meal: 'breakfast,lunch,tea' },
    { id: 'polyu-ns-wok',      uni: 'polyu', zh: '小炒', en: 'Wok Dishes', meal: 'lunch,dinner' },
    { id: 'polyu-ns-porridge', uni: 'polyu', zh: '粥品', en: 'Congee',     meal: 'breakfast,lunch' },
    { id: 'polyu-ns-dessert',  uni: 'polyu', zh: '甜品', en: 'Dessert',    meal: 'lunch,tea,dinner' },

    /* Z-Base Café */
    { id: 'polyu-zb-coffee',   uni: 'polyu', zh: '咖啡茶飲', en: 'Coffee & Tea', meal: 'breakfast,lunch,tea' },
    { id: 'polyu-zb-sandwich', uni: 'polyu', zh: '輕食',     en: 'Light Bites',  meal: 'breakfast,lunch,tea' },
    { id: 'polyu-zb-bake',     uni: 'polyu', zh: '烘焙',     en: 'Bakes',        meal: 'breakfast,tea' },
  ],

  canteens: [
    {
      id: 'polyu-va', uni: 'polyu', short: 'VA',
      zh: 'VA 學生食堂', en: 'VA Student Canteen',
      bldgZh: '學生會大樓 1 樓', bldgEn: '1/F, Student Amenities Centre',
      hoursZh: '週一至六 07:30–21:00・週日及公眾假期休息',
      hoursEn: 'Mon–Sat 07:30–21:00 · Closed Sun & PH',
      color: 'ac2',
      photo: 'assets/dishes-table.jpg',
      factZh: '理大最熱鬧的一間，$32 雙餸飯與車仔麵是趕課前的標準答案。',
      factEn: "PolyU's busiest hall — the $32 two-dish rice and cart noodles are the default before class.",
    },
    {
      id: 'polyu-ns', uni: 'polyu', short: 'N&S',
      zh: '南北小廚', en: 'North & South Kitchen',
      bldgZh: '邵民權樓 2 樓', bldgEn: '2/F, Shaw Amenities Building',
      hoursZh: '週一至日 11:00–21:30（點心供應至 15:00）',
      hoursEn: 'Mon–Sun 11:00–21:30 (dim sum till 15:00)',
      color: 'ac3',
      photo: 'assets/roast-ducks-display.jpg',
      factZh: '一盅兩件到小炒啤酒都有，中午飲茶要早半個鐘排隊。',
      factEn: 'From dim sum to wok dishes and beer — queue half an hour early for lunchtime yum cha.',
    },
    {
      id: 'polyu-zb', uni: 'polyu', short: 'Z-Base',
      zh: 'Z-Base Café', en: 'Z-Base Café',
      bldgZh: 'Z 座 3 樓', bldgEn: '3/F, Block Z',
      hoursZh: '週一至五 08:00–18:00・週六 09:00–14:00',
      hoursEn: 'Mon–Fri 08:00–18:00 · Sat 09:00–14:00',
      color: 'ac5',
      photo: 'assets/sandwiches-board.jpg',
      factZh: '半開放式咖啡吧，插座多、人少，是理大寫論文的秘密基地。',
      factEn: 'A semi-open coffee bar with plenty of sockets and few people — PolyU’s thesis-writing hideout.',
    },
  ],

  dishes: [
    /* ── VA 學生食堂 ── */
    { id: 'polyu-va-two-dish', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '雙餸飯', en: 'Two-dish rice', price: 32, photo: 'assets/dishes-table.jpg', tags: ['signature'], descZh: '兩餸一飯，白飯可以加底。', descEn: 'Two toppings over rice; extra rice on request.' },
    { id: 'polyu-va-three-dish', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '三餸飯', en: 'Three-dish rice', price: 38, photo: 'assets/chicken-rice-bowl.jpg' },
    { id: 'polyu-va-roast', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '燒味雙拼飯', en: 'Roast meat rice', price: 42, photo: 'assets/duck-rice.jpg', tags: ['signature'] },
    { id: 'polyu-va-curry-brisket', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '咖喱牛腩飯', en: 'Curry beef brisket rice', price: 40, photo: 'assets/curry-katsu.jpg' },
    { id: 'polyu-va-hainan', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '海南雞飯', en: 'Hainanese chicken rice', price: 42, photo: 'assets/chicken-rice-bowl.jpg' },
    { id: 'polyu-va-ribs', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-rice', zh: '豉椒排骨飯', en: 'Pork ribs in black bean sauce', price: 38, photo: 'assets/roast-pork-shop.jpg' },
    { id: 'polyu-va-cart-noodle', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-noodle', zh: '車仔麵', en: 'Cart noodles', price: 34, photo: 'assets/noodle-rice.jpg', tags: ['signature'], descZh: '配料自選三款，湯底可選清湯或沙嗲。', descEn: 'Pick three toppings; clear or satay broth.' },
    { id: 'polyu-va-brisket-noodle', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-noodle', zh: '牛腩河', en: 'Beef brisket hor fun', price: 40, photo: 'assets/noodle-hofun.jpg' },
    { id: 'polyu-va-wonton', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-noodle', zh: '雲吞麵', en: 'Wonton noodles', price: 32, photo: 'assets/noodle-beef.jpg' },
    { id: 'polyu-va-spicy-noodle', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-noodle', zh: '酸辣米線', en: 'Hot & sour rice noodles', price: 36, photo: 'assets/noodle-thai.jpg', tags: ['spicy'] },
    { id: 'polyu-va-pepper-chicken', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-western', zh: '黑椒雞扒飯', en: 'Black pepper chicken steak', price: 44, photo: 'assets/fried-chicken.jpg' },
    { id: 'polyu-va-pork-chop', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-western', zh: '香煎豬扒配薯菜', en: 'Pan-fried pork chop with veg', price: 46, photo: 'assets/chicken-rice-bowl.jpg' },
    { id: 'polyu-va-bolognese', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-western', zh: '肉醬意粉', en: 'Spaghetti bolognese', price: 38, photo: 'assets/bolognese.jpg' },
    { id: 'polyu-va-carbonara', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-western', zh: '卡邦尼意粉', en: 'Carbonara', price: 42, photo: 'assets/carbonara.jpg' },
    { id: 'polyu-va-fried-leg', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-snack', zh: '炸雞髀配薯條', en: 'Fried chicken leg & fries', price: 36, photo: 'assets/fried-chicken.jpg' },
    { id: 'polyu-va-french-toast', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-snack', zh: '西多士', en: 'French toast', price: 22, photo: 'assets/french-toast.jpg' },
    { id: 'polyu-va-fishball', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-snack', zh: '魚蛋燒賣', en: 'Fish balls & siu mai', price: 18, photo: 'assets/roast-pork-shop.jpg' },
    { id: 'polyu-va-milk-tea', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-drinks', zh: '凍奶茶', en: 'Iced milk tea', price: 16, photo: 'assets/milk-tea.jpg' },
    { id: 'polyu-va-coffee', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-drinks', zh: '熱咖啡', en: 'Hot coffee', price: 14, photo: 'assets/latte.jpg' },
    { id: 'polyu-va-lemon-tea', uni: 'polyu', canteenId: 'polyu-va', cat: 'polyu-va-drinks', zh: '檸檬茶', en: 'Lemon tea', price: 16, photo: 'assets/milk-tea.jpg' },

    /* ── 南北小廚 ── */
    { id: 'polyu-ns-hargow', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '蝦餃', en: 'Har gow', price: 26, photo: 'assets/dishes-table.jpg', tags: ['signature'] },
    { id: 'polyu-ns-siumai', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '燒賣', en: 'Siu mai', price: 24, photo: 'assets/dishes-table.jpg' },
    { id: 'polyu-ns-charsiu-bun', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '叉燒包', en: 'BBQ pork bun', price: 22, photo: 'assets/dishes-table.jpg' },
    { id: 'polyu-ns-chicken-feet', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '鳳爪', en: 'Chicken feet', price: 22, photo: 'assets/dishes-table.jpg' },
    { id: 'polyu-ns-rice-roll', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '腸粉', en: 'Rice rolls', price: 24, photo: 'assets/dishes-table.jpg' },
    { id: 'polyu-ns-turnip-cake', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dimsum', zh: '蘿蔔糕', en: 'Turnip cake', price: 22, photo: 'assets/dishes-table.jpg' },
    { id: 'polyu-ns-beef-chowfun', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-wok', zh: '干炒牛河', en: 'Beef chow fun', price: 46, photo: 'assets/noodle-hofun.jpg', tags: ['signature'] },
    { id: 'polyu-ns-sweet-sour', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-wok', zh: '咕嚕肉', en: 'Sweet & sour pork', price: 58, photo: 'assets/roast-pork-shop.jpg' },
    { id: 'polyu-ns-mapo-tofu', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-wok', zh: '麻婆豆腐', en: 'Mapo tofu', price: 48, photo: 'assets/hotpot.jpg', tags: ['spicy'] },
    { id: 'polyu-ns-salt-squid', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-wok', zh: '椒鹽鮮魷', en: 'Salt & pepper squid', price: 62, photo: 'assets/fried-chicken.jpg' },
    { id: 'polyu-ns-crab', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-wok', zh: '避風塘炒蟹', en: 'Typhoon shelter crab', price: 128, photo: 'assets/hotpot.jpg', descZh: '時價，需落單時確認。', descEn: 'Market price — confirm when ordering.' },
    { id: 'polyu-ns-century-congee', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-porridge', zh: '皮蛋瘦肉粥', en: 'Century egg & pork congee', price: 28, photo: 'assets/porridge.jpg' },
    { id: 'polyu-ns-boat-congee', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-porridge', zh: '艇仔粥', en: 'Boat congee', price: 30, photo: 'assets/porridge.jpg' },
    { id: 'polyu-ns-plain-congee', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-porridge', zh: '白粥加油炸鬼', en: 'Plain congee with fritter', price: 20, photo: 'assets/porridge.jpg' },
    { id: 'polyu-ns-mango-sago', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dessert', zh: '楊枝甘露', en: 'Mango pomelo sago', price: 28, photo: 'assets/mango-salad.jpg', tags: ['sweet', 'signature'] },
    { id: 'polyu-ns-red-bean', uni: 'polyu', canteenId: 'polyu-ns', cat: 'polyu-ns-dessert', zh: '紅豆沙', en: 'Red bean soup', price: 18, photo: 'assets/mango-salad.jpg', tags: ['sweet'] },

    /* ── Z-Base Café ── */
    { id: 'polyu-zb-pourover', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-coffee', zh: '手沖單品', en: 'Pour-over', price: 38, photo: 'assets/latte.jpg' },
    { id: 'polyu-zb-latte', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-coffee', zh: '拿鐵', en: 'Latte', price: 32, photo: 'assets/latte.jpg', tags: ['signature'] },
    { id: 'polyu-zb-americano', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-coffee', zh: '美式', en: 'Americano', price: 26, photo: 'assets/latte.jpg' },
    { id: 'polyu-zb-matcha', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-coffee', zh: '抹茶鮮奶', en: 'Matcha latte', price: 34, photo: 'assets/latte.jpg' },
    { id: 'polyu-zb-ham-cheese', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-sandwich', zh: '火腿芝士三文治', en: 'Ham & cheese sandwich', price: 30, photo: 'assets/sandwich-making.jpg' },
    { id: 'polyu-zb-salmon-bagel', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-sandwich', zh: '煙三文魚貝果', en: 'Smoked salmon bagel', price: 42, photo: 'assets/sandwiches-board.jpg' },
    { id: 'polyu-zb-caesar', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-sandwich', zh: '雞肉凱撒沙律', en: 'Chicken caesar salad', price: 44, photo: 'assets/mango-salad.jpg' },
    { id: 'polyu-zb-mango-salad', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-sandwich', zh: '芒果沙律', en: 'Mango salad', price: 36, photo: 'assets/mango-salad.jpg' },
    { id: 'polyu-zb-croissant', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-bake', zh: '牛角包', en: 'Croissant', price: 20, photo: 'assets/sandwiches-board.jpg' },
    { id: 'polyu-zb-cinnamon', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-bake', zh: '肉桂卷', en: 'Cinnamon roll', price: 24, photo: 'assets/sandwiches-board.jpg' },
    { id: 'polyu-zb-muffin', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-bake', zh: '藍莓鬆餅', en: 'Blueberry muffin', price: 22, photo: 'assets/sandwiches-board.jpg' },
    { id: 'polyu-zb-basque', uni: 'polyu', canteenId: 'polyu-zb', cat: 'polyu-zb-bake', zh: '巴斯克芝士蛋糕', en: 'Basque cheesecake', price: 32, photo: 'assets/french-toast.jpg', tags: ['sweet'] },
  ],
};
