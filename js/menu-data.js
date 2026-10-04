/* Eaty — 城大搵食指南 菜單資料（想更新菜單就改這個檔案）
 *
 * 資料來源：
 *  - AC1 城大食坊：2026-10-02 從官方點餐站 csd.order.place/home/store/112870 抄錄的真實菜品與價錢。
 *    （價錢會浮動，以飯堂現場為準；品項可能隨時間改變。）
 *  - AC2 / AC3：官方沒有網上菜單，以下是代表性菜品（真實名氣菜＋常見檔口款式），
 *    價錢為約數，請按實際情況修改。
 *
 * 欄位說明：
 *  dishes: { id, canteenId, cat, zh, en, price, photo?, descZh?, descEn?, tags? }
 *    photo 不填 → 自動用分類 fallback 字塊
 *    tags: 'signature'（招牌）'spicy'（辣）'value'（抵食）'sweet'（甜）
 *  sampleReviews: 種子範例評論（書面語），UI 上會標示「範例」，可一鍵隱藏；真實評論由使用者產生。
 */
window.CITYU_EATS_DATA = {

  categories: [
    { id: 'rice',     zh: '中式飯類', en: 'Rice & Chinese' },
    { id: 'noodle',   zh: '粉麵',     en: 'Noodles' },
    { id: 'japanese', zh: '日韓',     en: 'Japanese & Korean' },
    { id: 'asian',    zh: '東南亞',   en: 'Southeast Asian' },
    { id: 'western',  zh: '西式',     en: 'Western' },
    { id: 'snack',    zh: '小食',     en: 'Snacks' },
    { id: 'drinks',   zh: '飲品甜品', en: 'Drinks & Dessert' },
  ],

  canteens: [
    {
      id: 'ac1', short: 'AC1',
      zh: '城大食坊', en: 'City Express',
      bldgZh: '康樂樓 5 樓', bldgEn: '5/F, Amenities Building',
      hoursZh: '週一至五 07:30–20:00・週六至日 08:00–18:00（公眾假期休息）',
      hoursEn: 'Mon–Fri 07:30–20:00 · Sat–Sun 08:00–18:00 (PH closed)',
      color: 'ac1',
      photo: 'assets/roast-pork-shop.jpg',
      orderUrl: 'https://csd.order.place/home/store/112870',
      factZh: '三大食堂中唯一設有官方網上點餐，車仔麵、燒味、日式丼飯一應俱全。',
      factEn: 'The only canteen with official online ordering — roast meats, noodles, donburi and more.',
    },
    {
      id: 'ac2', short: 'AC2',
      zh: 'AC2 Canteen', en: 'AC2 Canteen',
      bldgZh: '李達三葉耀珍學術樓 3 樓', bldgEn: '3/F, Li Dak Sum Yip Yio Chin Academic Building',
      hoursZh: '週一至日 07:30–21:00（農曆新年休息）',
      hoursEn: 'Mon–Sun 07:30–21:00 (CNY closed)',
      color: 'ac2',
      photo: 'assets/dishes-table.jpg',
      factZh: '全校最大的 food court（860 座），$30 雙餸飯是城大傳說級的超值之選。',
      factEn: 'The biggest food court on campus (860 seats). The HK$30 two-dish rice is legendary value.',
    },
    {
      id: 'ac3', short: 'AC3',
      zh: 'AC3 Bistro', en: 'AC3 Bistro',
      bldgZh: '劉鳴煒學術樓 7 樓', bldgEn: '7/F, Lau Ming Wai Academic Building',
      hoursZh: '週一至五 07:30–21:00（週日及公眾假期休息）',
      hoursEn: 'Mon–Fri 07:30–21:00 (Sun & PH closed)',
      color: 'ac3',
      photo: 'assets/sandwiches-board.jpg',
      factZh: '座落教學樓頂層的小 Bistro，人少安靜，吞拿魚披薩是鎮店之寶。',
      factEn: 'A quiet little bistro on the top teaching floors — the tuna pizza is the house icon.',
    },
  ],

  dishes: [
    /* ── AC1 城大食坊（真實菜單，2026-10-02 抄錄）────────────── */
    { id: 'ac1-sampan-fan',    canteenId: 'ac1', cat: 'rice', zh: '鹹蛋三寶飯', en: 'Salted Egg Three-Treasure Rice', price: 32.7, photo: 'assets/chicken-rice-bowl.jpg', tags: ['value'], descZh: '鹹蛋＋三款小菜鋪面，一盒滿足。', descEn: 'Salted egg and three toppings over rice — a full box of comfort.' },
    { id: 'ac1-dual-roast',    canteenId: 'ac1', cat: 'rice', zh: '燒味雙拼飯', en: 'Dual Roast Meat Rice', price: 28.6, photo: 'assets/roast-ducks-display.jpg', tags: ['signature', 'value'], descZh: '即燒叉燒、燒鴨等任選兩款，食堂主打。', descEn: 'Pick two from char siu, roast duck and more — the canteen\'s headliner.' },
    { id: 'ac1-single-roast',  canteenId: 'ac1', cat: 'rice', zh: '燒味單拼飯', en: 'Roast Meat Rice', price: 22, tags: ['value'], descZh: '最平價的燒味飯，學生恩物。', descEn: 'The cheapest roast rice on campus — a broke-student staple.' },
    { id: 'ac1-duck-spicy',    canteenId: 'ac1', cat: 'rice', zh: '麻辣肉丁‧明爐燒鴨飯', en: 'Spicy Diced Pork & Roast Duck Rice', price: 44, photo: 'assets/duck-rice.jpg', tags: ['spicy'] },
    { id: 'ac1-koushui-chicken', canteenId: 'ac1', cat: 'rice', zh: '口水雞‧白飯', en: 'Mouth-watering Chicken & Rice', price: 40.9, tags: ['spicy'] },
    { id: 'ac1-beef-noodle',   canteenId: 'ac1', cat: 'noodle', zh: '台式麻辣牛肉麵', en: 'Taiwanese Spicy Beef Noodle Soup', price: 43, photo: 'assets/noodle-beef.jpg', tags: ['spicy', 'signature'], descZh: '湯頭濃郁、牛肉大塊，冬天必食。', descEn: 'Rich broth and thick-cut beef — a winter must.' },
    { id: 'ac1-suanla-mixian', canteenId: 'ac1', cat: 'noodle', zh: '酸辣米線', en: 'Hot & Sour Rice Noodles', price: 22.5, photo: 'assets/noodle-rice.jpg', tags: ['spicy', 'value'] },
    { id: 'ac1-duck-hofun',    canteenId: 'ac1', cat: 'noodle', zh: '鴨腿湯河粉', en: 'Duck Leg Rice Noodle Soup', price: 39, photo: 'assets/noodle-hofun.jpg' },
    { id: 'ac1-fishball-fun',  canteenId: 'ac1', cat: 'noodle', zh: '魚蛋湯粉', en: 'Fish Ball Noodle Soup', price: 29.7, photo: 'assets/noodle-thai.jpg', tags: ['value'] },
    { id: 'ac1-mushroom-noodle', canteenId: 'ac1', cat: 'noodle', zh: '豉油皇菇絲炒麵', en: 'Soy Sauce Mushroom Noodles', price: 12.5, tags: ['value'], descZh: '$12.5 有菇有麵，超值之最。', descEn: 'Twelve dollars fifty — unbeatable value.' },
    { id: 'ac1-beef-don',      canteenId: 'ac1', cat: 'japanese', zh: '洋蔥牛肉丼', en: 'Beef & Onion Donburi', price: 49.1, photo: 'assets/donburi.jpg', tags: ['signature'] },
    { id: 'ac1-onsen-don',     canteenId: 'ac1', cat: 'japanese', zh: '汁煮豚肉‧溫泉玉子丼', en: 'Simmered Pork & Onsen Egg Donburi', price: 49.1 },
    { id: 'ac1-curry-katsu',   canteenId: 'ac1', cat: 'japanese', zh: '咖喱唐揚雞飯', en: 'Curry Fried Chicken Rice', price: 51.2, photo: 'assets/curry-katsu.jpg', tags: ['signature'], descZh: '日式咖喱配炸雞，食堂日系代表。', descEn: 'Japanese curry with fried chicken — the Japanese corner\'s star.' },
    { id: 'ac1-teriyaki-udon', canteenId: 'ac1', cat: 'japanese', zh: '照燒雞扒烏冬', en: 'Teriyaki Chicken Udon', price: 46, photo: 'assets/udon.jpg' },
    { id: 'ac1-thai-chicken',  canteenId: 'ac1', cat: 'asian', zh: '泰式水門雞飯‧例湯', en: 'Thai Hainanese Chicken Rice & Soup', price: 49.1 },
    { id: 'ac1-lemongrass-leg', canteenId: 'ac1', cat: 'asian', zh: '香茅雞髀‧油飯', en: 'Lemongrass Chicken Leg & Oiled Rice', price: 38.9 },
    { id: 'ac1-cha-lau-fan',   canteenId: 'ac1', cat: 'asian', zh: '扎肉‧肉燥飯', en: 'Vietnamese Pork & Minced Pork Rice', price: 39 },
    { id: 'ac1-thai-fishcake', canteenId: 'ac1', cat: 'asian', zh: '泰式魚餅‧肉燥飯', en: 'Thai Fish Cake & Minced Pork Rice', price: 39 },
    { id: 'ac1-pepperoni',     canteenId: 'ac1', cat: 'western', zh: '辣肉腸披薩', en: 'Pepperoni Pizza', price: 49.1, photo: 'assets/pizza.jpg', tags: ['signature'], descZh: '即叫即製，需等 15–20 分鐘，值得等候。', descEn: 'Made to order in 15–20 minutes — worth the wait.' },
    { id: 'ac1-hawaii-pizza',  canteenId: 'ac1', cat: 'western', zh: '夏威夷菠蘿火腿芝士披薩', en: 'Hawaiian Pineapple Ham Cheese Pizza', price: 49.1 },
    { id: 'ac1-porkchop-bun',  canteenId: 'ac1', cat: 'snack', zh: '芥末吉列豬扒包‧薯條', en: 'Wasabi Katsu Pork Chop Bun & Fries', price: 36.8, photo: 'assets/sandwich-making.jpg', descZh: '豬扒炸至香脆，配薯條就是豐盛一餐。', descEn: 'Crispy katsu pork chop in a bun with fries.' },
    { id: 'ac1-fried-chicken', canteenId: 'ac1', cat: 'snack', zh: '炸雞髀‧薯條', en: 'Fried Chicken Leg & Fries', price: 28.6, photo: 'assets/fried-chicken.jpg' },
    { id: 'ac1-french-toast',  canteenId: 'ac1', cat: 'snack', zh: '西多士', en: 'Hong Kong French Toast', price: 24.6, photo: 'assets/french-toast.jpg', tags: ['sweet'], descZh: '茶餐廳經典，下午茶之魂。', descEn: 'The cha chaan teng classic — afternoon tea\'s soul.' },
    { id: 'ac1-wun-jai-gee',   canteenId: 'ac1', cat: 'snack', zh: '碗仔翅', en: 'Street-style "Shark Fin" Soup', price: 18, photo: 'assets/porridge.jpg', tags: ['value'] },
    { id: 'ac1-iced-milktea',  canteenId: 'ac1', cat: 'drinks', zh: '凍奶茶', en: 'Iced Milk Tea', price: 7.5, photo: 'assets/milk-tea.jpg', tags: ['signature', 'value'], descZh: '$7.5 一杯，全場最超值。', descEn: 'Seven fifty a cup — the best deal in the building.' },
    { id: 'ac1-iced-yuenyeung', canteenId: 'ac1', cat: 'drinks', zh: '凍鴛鴦', en: 'Iced Yuenyeung (Tea-Coffee Mix)', price: 7.5, tags: ['value'] },
    { id: 'ac1-latte-large',   canteenId: 'ac1', cat: 'drinks', zh: '大凍鮮奶咖啡（16oz）', en: 'Large Iced Latte (16oz)', price: 30.7, photo: 'assets/latte.jpg' },

    /* ── AC2 Canteen（代表性菜品，價錢約數）────────────────── */
    { id: 'ac2-two-dish',      canteenId: 'ac2', cat: 'rice', zh: '抵食雙餸飯', en: 'Two-Dish Rice (Legendarily Cheap)', price: 30, photo: 'assets/chicken-rice-bowl.jpg', tags: ['signature', 'value'], descZh: '$30 兩餸一飯，全城大最超值，中午大排長龍。', descEn: 'Two dishes over rice for HK$30 — the best value on campus, queue at noon.' },
    { id: 'ac2-claypot',       canteenId: 'ac2', cat: 'rice', zh: '北菇滑雞煲仔飯', en: 'Mushroom & Chicken Claypot Rice', price: 38, photo: 'assets/hotpot.jpg', tags: ['signature'], descZh: '秋冬限定，鍋巴最為香脆。', descEn: 'Autumn–winter special; the crispy bottom rice is the point.' },
    { id: 'ac2-mapo-tofu',     canteenId: 'ac2', cat: 'rice', zh: '麻婆豆腐飯', en: 'Mapo Tofu Rice', price: 26, tags: ['spicy', 'value'] },
    { id: 'ac2-yeungchow',     canteenId: 'ac2', cat: 'rice', zh: '揚州炒飯', en: 'Yeung Chow Fried Rice', price: 28 },
    { id: 'ac2-beef-hofun',    canteenId: 'ac2', cat: 'noodle', zh: '干炒牛河', en: 'Stir-fried Beef Flat Noodles', price: 32 },
    { id: 'ac2-satay-beef',    canteenId: 'ac2', cat: 'noodle', zh: '沙嗲牛肉麵', en: 'Satay Beef Noodle Soup', price: 28 },
    { id: 'ac2-mango-shrimp',  canteenId: 'ac2', cat: 'asian', zh: '凍芒果蝦沙律', en: 'Chilled Mango Shrimp Salad', price: 28, photo: 'assets/mango-salad.jpg', tags: ['signature'], descZh: 'AC2 名物，夏天首選。', descEn: 'The AC2 signature — perfect in summer.' },
    { id: 'ac2-curry-brisket', canteenId: 'ac2', cat: 'asian', zh: '咖喱牛腩飯', en: 'Curry Beef Brisket Rice', price: 34, tags: ['spicy'] },
    { id: 'ac2-salt-chicken-wing', canteenId: 'ac2', cat: 'snack', zh: '椒鹽雞翼', en: 'Salt & Pepper Chicken Wings', price: 22 },
    { id: 'ac2-milk-tea',      canteenId: 'ac2', cat: 'drinks', zh: '凍檸檬茶', en: 'Iced Lemon Tea', price: 9 },

    /* ── AC3 Bistro（代表性菜品，價錢約數）────────────────── */
    { id: 'ac3-tuna-pizza',    canteenId: 'ac3', cat: 'western', zh: '吞拿魚披薩', en: 'Tuna Pizza', price: 42, photo: 'assets/pizza.jpg', tags: ['signature'], descZh: 'AC3 鎮店之寶，經常售罄。', descEn: 'The house icon — often sells out.' },
    { id: 'ac3-carbonara',     canteenId: 'ac3', cat: 'western', zh: '卡邦尼意粉', en: 'Spaghetti Carbonara', price: 38, photo: 'assets/carbonara.jpg' },
    { id: 'ac3-bolognese',     canteenId: 'ac3', cat: 'western', zh: '肉醬意粉', en: 'Spaghetti Bolognese', price: 36, photo: 'assets/bolognese.jpg' },
    { id: 'ac3-chicken-sandwich', canteenId: 'ac3', cat: 'western', zh: '烤雞三文治', en: 'Roast Chicken Sandwich', price: 32, photo: 'assets/sandwich-making.jpg' },
    { id: 'ac3-udon',          canteenId: 'ac3', cat: 'japanese', zh: '海鮮烏冬', en: 'Seafood Udon', price: 36 },
    { id: 'ac3-latte',         canteenId: 'ac3', cat: 'drinks', zh: '鮮奶咖啡', en: 'Latte', price: 24, photo: 'assets/latte.jpg' },

    /* 麻辣米線攤位備註：AC2/AC3 資料為代表性內容，請以現場為準並自行增修 */
  ],

  sampleReviews: [
    { id: 's01', dishId: 'ac2-two-dish', rating: 5, verdict: 'must', nickname: '窮學生代表', text: '$30 的兩餸飯真的無可匹敵，叉燒份量也足，記得 12 點前下去就不用排太久。', created: '2026-09-26T12:20:00+08:00' },
    { id: 's02', dishId: 'ac2-two-dish', rating: 4, verdict: 'ok', nickname: 'Exchange Eric', text: 'Unbeatable for the price. English menu is a printed A4 on the glass, just point. The queue moves fast.', created: '2026-09-24T13:05:00+08:00' },
    { id: 's03', dishId: 'ac1-iced-milktea', rating: 5, verdict: 'must', nickname: '奶茶魂', text: '七元半有這個質素，茶味足不會太甜，我每天一杯。', created: '2026-09-29T15:40:00+08:00' },
    { id: 's04', dishId: 'ac1-beef-noodle', rating: 5, verdict: 'must', nickname: '麵癡', text: '湯底有牛味並非味精水，牛肉是有筋有膏的那種，43 元很值。', created: '2026-09-22T12:35:00+08:00' },
    { id: 's05', dishId: 'ac1-beef-noodle', rating: 3, verdict: 'ok', nickname: '台灣同學會', text: '對台灣人來說不算麻辣，但在校園內是可以接受的牛肉麵。Decent but not mala enough.', created: '2026-09-25T18:30:00+08:00' },
    { id: 's06', dishId: 'ac1-mushroom-noodle', rating: 4, verdict: 'must', nickname: '十二蚊戰士', text: '$12.5 有菇有麵，豉油皇炒得香，CP 值爆錶。', created: '2026-09-30T12:10:00+08:00' },
    { id: 's07', dishId: 'ac1-pepperoni', rating: 4, verdict: 'must', nickname: 'Pizza Friday', text: '15–20 分鐘現叫現製，餅底意外地脆。一次買兩件與朋友分享最划算。', created: '2026-09-27T17:55:00+08:00' },
    { id: 's08', dishId: 'ac3-tuna-pizza', rating: 5, verdict: 'must', nickname: 'AC3常客', text: '吞拿魚給得慷慨，星期五下午三點去通常有位，安安靜靜吃完整個午餐。', created: '2026-09-20T15:10:00+08:00' },
    { id: 's09', dishId: 'ac3-carbonara', rating: 2, verdict: 'avoid', nickname: '意粉警長', text: '醬汁稀得像湯，意粉煮得過爛。這個價錢我寧願走去 AC2。', created: '2026-09-23T13:15:00+08:00' },
    { id: 's10', dishId: 'ac1-suanla-mixian', rating: 4, verdict: 'must', nickname: '辣妹一號', text: '酸辣度很合香港人口味，22 元就有一餐，加豆腐泡更好吃。', created: '2026-09-28T12:45:00+08:00' },
    { id: 's11', dishId: 'ac2-claypot', rating: 4, verdict: 'must', nickname: '飯焦控', text: '鍋巴鏟得很漂亮，臘味季節記得加錢轉臘味煲。', created: '2026-09-21T12:50:00+08:00' },
    { id: 's12', dishId: 'ac2-mapo-tofu', rating: 2, verdict: 'avoid', nickname: '豆腐愛好者', text: '豆腐只有數粒，汁多於料，下單前想清楚。', created: '2026-09-29T13:00:00+08:00' },
    { id: 's13', dishId: 'ac1-french-toast', rating: 3, verdict: 'ok', nickname: '3pm 甜點', text: '正常茶餐廳水準，蛋味足但糖漿只有細細一瓶。', created: '2026-09-19T15:20:00+08:00' },
    { id: 's14', dishId: 'ac1-curry-katsu', rating: 4, verdict: 'must', nickname: '咖喱人', text: '炸雞現炸香脆，咖喱不會太辣，吃膩了飯餐可以換換口味。', created: '2026-09-30T18:20:00+08:00' },
    { id: 's15', dishId: 'ac3-bolognese', rating: 4, verdict: 'must', nickname: 'Pasta Person', text: 'Solid bolognese for a campus bistro. Sauce is homemade-tasting, not out of a jar.', created: '2026-09-26T14:00:00+08:00' },
    { id: 's16', dishId: 'ac1-duck-hofun', rating: 3, verdict: 'ok', nickname: '河粉評論員', text: '鴨腿給足整隻算有誠意，不過湯偏鹹，點少鹹比較好。', created: '2026-09-24T12:40:00+08:00' },
    { id: 's17', dishId: 'ac3-carbonara', rating: 1, verdict: 'avoid', nickname: 'Lau Ming Wai 人辦', text: '第二次給機會還是一樣，醬與粉完全不配。避。', created: '2026-09-30T13:30:00+08:00' },
    { id: 's18', dishId: 'ac2-mapo-tofu', rating: 2, verdict: 'avoid', nickname: '無飯不歡', text: '自己煮都比這盒好，豆腐碎了又不入味。', created: '2026-09-27T12:25:00+08:00' },
  ],
};

/* ═══ 雲端菜單載入器 ═══
 * 菜單現存放於 Supabase（canteens / dishes 表），改菜單去 dashboard → Table Editor，
 * 網站重新整理即生效，毋須重新部署。
 * 載入順序：雲端 → 本地快取 → 下面內建資料（三層後備，離線/斷網都不會白屏）。
 * 執行 Supabase 菜單表的 SQL 在專案根目錄 supabase-menu.sql。
 */
(function () {
  'use strict';
  const CFG = window.CITYU_EATS_CONFIG;
  const CACHE_KEY = 'cityu-eats:menu-cache:v1';

  function apply(canteens, dishes, categories) {
    const D = window.CITYU_EATS_DATA;
    D.canteens.length = 0;
    D.canteens.push(...canteens);
    D.dishes.length = 0;
    D.dishes.push(...dishes);
    if (categories && categories.length) {
      D.categories.length = 0;
      D.categories.push(...categories);
    }
  }
  function normalizeCanteen(r) {
    return {
      id: r.id, short: (r.id || '').toUpperCase(),
      zh: r.zh || r.en || r.id, en: r.en || r.zh || r.id,
      bldgZh: r.bldg_zh || '', bldgEn: r.bldg_en || '',
      hoursZh: r.hours_zh || '', hoursEn: r.hours_en || '',
      factZh: r.fact_zh || '', factEn: r.fact_en || '',
      color: r.id, photo: r.photo || '', orderUrl: r.order_url || null,
    };
  }
  function normalizeDish(r) {
    return {
      id: r.id, canteenId: r.canteen_id, cat: r.category,
      zh: r.zh, en: r.en, price: Number(r.price),
      photo: r.photo || '', descZh: r.desc_zh || '', descEn: r.desc_en || '',
      tags: Array.isArray(r.tags) ? r.tags : [],
    };
  }
  async function fetchCloud() {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return null;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    const headers = { apikey: CFG.SUPABASE_ANON_KEY };
    try {
      const [cRes, dRes, catRes] = await Promise.all([
        fetch(CFG.SUPABASE_URL + '/rest/v1/canteens?select=*&order=sort.asc', { headers, signal: ctl.signal }),
        fetch(CFG.SUPABASE_URL + '/rest/v1/dishes?select=*&order=sort.asc', { headers, signal: ctl.signal }),
        fetch(CFG.SUPABASE_URL + '/rest/v1/categories?select=*&order=sort.asc', { headers, signal: ctl.signal }),
      ]);
      if (!cRes.ok || !dRes.ok) return null;
      const cs = await cRes.json();
      const ds = await dRes.json();
      if (!Array.isArray(cs) || !Array.isArray(ds) || !cs.length || !ds.length) return null;
      let cats = null;
      if (catRes.ok) {
        const list = await catRes.json();
        if (Array.isArray(list) && list.length) cats = list.map((c) => ({ id: c.id, zh: c.zh, en: c.en }));
      }
      return {
        canteens: cs.map(normalizeCanteen),
        dishes: ds.filter((d) => d.available !== false).map(normalizeDish),
        categories: cats,
      };
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  window.CityuEatsMenu = {
    source: 'bundled', // 'cloud' | 'cache' | 'bundled'
    async load() {
      const cloud = await fetchCloud();
      if (cloud) {
        apply(cloud.canteens, cloud.dishes, cloud.categories);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), canteens: cloud.canteens, dishes: cloud.dishes, categories: cloud.categories }));
        } catch (e) { /* 儲存空間滿了就算 */ }
        this.source = 'cloud';
        return this.source;
      }
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const c = JSON.parse(raw);
          if (c && Array.isArray(c.dishes) && c.dishes.length && Array.isArray(c.canteens) && c.canteens.length) {
            apply(c.canteens, c.dishes, c.categories);
            this.source = 'cache';
            return this.source;
          }
        }
      } catch (e) { /* 快取壞了就用內建 */ }
      this.source = 'bundled';
      return this.source;
    },
  };
})();
