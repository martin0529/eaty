/* Eaty — 香港校園食堂指南 中英雙語
 * I18N.t(key) 取字；I18N.lang() 現在語言；I18N.set(lang) 切換並廣播 'langchange'。
 *
 * 文案原則
 * ├ 標題不掛英文眉題：一句話講完，不要「小字＋大字＋副標」三層。
 * ├ 動詞開頭的按鈕講清楚會發生什麼（「抽一道」而不是「開始」）。
 * └ 中文用香港校園的說法（食堂、抵食、唔好味），英文用平輩語氣，不寫行銷腔。
 */
(function () {
  'use strict';
  const CFG = window.EATY_CONFIG;

  const DICT = {
    /* 品牌（v2.1.0 改回原本的名字 Eaty） */
    siteName: { zh: 'Eaty', en: 'Eaty' },

    /* 頁首 */
    uniSwitchLabel: { zh: '選擇大學', en: 'Choose university' },
    navCanteens: { zh: '食堂', en: 'Canteens' },
    navHot: { zh: '今日熱門', en: "Today's hot" },
    navAvoid: { zh: '避雷榜', en: 'Avoid list' },
    navReviews: { zh: '最新評論', en: 'Latest reviews' },
    navRandom: { zh: '今天吃什麼', en: 'What to eat' },
    langBtn: { zh: 'EN', en: '中' },
    langBtnLabel: { zh: '切換至英文', en: 'Switch to Chinese' },

    /* 首頁 hero */
    heroKicker: { zh: '今日主打', en: "Today's pick" },
    heroTagline: { zh: '香港校園食堂指南', en: 'A guide to Hong Kong campus canteens' },
    heroCta1: { zh: '看食堂', en: 'See the canteens' },
    heroCta2: { zh: '隨便挑一間', en: 'Pick one for me' },

    /* 首頁：選大學（第一層） */
    pickKicker: { zh: '香港校園覓食地圖', en: 'Hong Kong campus food map' },
    pickTagline: { zh: '兩間大學，一餐一餐試。', en: 'Two universities. One tray at a time.' },
    pickNote: {
      zh: '全站已收錄 {u} 間大學、{c} 間食堂、{d} 道菜；菜單抄錄自官方點餐平台與現場菜牌。',
      en: '{u} universities, {c} canteens and {d} dishes so far — menus transcribed from official ordering platforms and counter boards.',
    },
    pickCta: { zh: '選一間大學開始', en: 'Pick a university' },
    schoolsHeading: { zh: '你在哪間大學？', en: 'Which university?' },
    schoolsSub: { zh: '每間學校吃得都不一樣，點進去看。', en: 'Every campus eats differently. Tap one to see how.' },
    /* 大學卡下半的統計：數字由 app.js 直接輸出，這裡只放單位 */
    schoolCanteenUnit: { zh: '間食堂', en: 'canteens' },
    schoolDishUnit: { zh: '道菜', en: 'dishes' },
    schoolEnter: { zh: '看食堂', en: 'View canteens' },
    testDataTag: { zh: '測試資料', en: 'Test data' },

    /* 大學頁（第二層）：麵包屑與標題 */
    bcHome: { zh: '所有大學', en: 'All universities' },
    bcCanteens: { zh: '食堂', en: 'Canteens' },
    uniKicker: { zh: '校園食堂', en: 'Campus canteens' },
    uniHeading: { zh: '{uni}，{n} 間食堂', en: '{uni} — {n} canteens' },
    uniSub: { zh: '點一間，看完整菜單和同學的評價。', en: 'Open one for the full menu and student verdicts.' },
    backToCanteens: { zh: '返回食堂列表', en: 'All canteens' },

    /* 食堂卡 */
    canteensHeading: { zh: '校園食堂，一份覓食地圖。', en: 'Campus canteens, one food map.' },
    dishesCount: { zh: '道菜', en: ' dishes' },
    officialOrdering: { zh: '官方網上點餐', en: 'Official online ordering' },
    stallOrdering: { zh: '網上點餐', en: 'Order online' },
    stallOrderingLabel: { zh: '檔口點餐', en: 'Stall ordering' },
    viewMenu: { zh: '看菜單', en: 'View menu' },
    viewAll: { zh: '全部', en: 'See all' },

    /* 熱門（v2.1.0 復原已上線版的標題：今日熱門／最新評論） */
    hotHeading: { zh: '今日熱門', en: "Today's hot" },
    hotSub: { zh: '按評分與評論數即時排序——最多人推薦的先上場。', en: 'Ranked live by ratings and review counts — the most-loved dishes first.' },
    latestHeading: { zh: '最新評論', en: 'Latest reviews' },
    latestSub: { zh: '必食、普通還是避雷，由同學的評價說了算。', en: 'Must-eat, OK or avoid — students have the final say.' },
    sampleTag: { zh: '範例', en: 'Sample' },

    /* 避雷榜 */
    avoidHeading: { zh: '避雷榜', en: 'The avoid list' },
    avoidSub: { zh: '哪些菜，同學叫你不要試。', en: 'What students told you to skip.' },
    avoidNote: { zh: '以「避雷」票佔該菜總評論的比例排序，只算有 2 則或以上評論的菜。', en: 'Ranked by the share of “avoid” votes per dish; only dishes with 2+ reviews count.' },
    avoidPctOf: { zh: '避雷票佔比', en: 'avoid votes' },

    /* 隨機器 */
    randomTitle: { zh: '今天吃什麼？', en: 'What to eat today?' },
    randomSub: { zh: '選範圍與時段，按下去交給命運。', en: 'Pick a scope and a meal. Then let go.' },
    randomScopeLabel: { zh: '範圍', en: 'Scope' },
    randomMealLabel: { zh: '時段', en: 'Meal' },
    randomScopeAll: { zh: '全部食堂', en: 'All canteens' },
    randomRoll: { zh: '抽一道', en: 'Draw one' },
    randomRolling: { zh: '抽緊…', en: 'Drawing…' },
    randomAgain: { zh: '再抽一次', en: 'Draw again' },
    randomView: { zh: '看這道菜', en: 'View this dish' },
    randomPick: { zh: '今日之選', en: "TODAY'S PICK" },
    randomPool: { zh: '可抽 {n} 道菜', en: '{n} dishes in the draw' },
    randomPoolEmpty: { zh: '沒甚麼可抽——黑名單可能把全部都排除了。', en: 'Nothing to draw — the blacklist may have excluded every dish.' },

    /* 餐段（早餐／午餐／下午茶／晚餐）：食堂頁分類 chips 的上層。
       全日 = 不按餐段篩選（跟下面 chips 的「全部」是兩件事）。 */
    mealLabel: { zh: '餐段', en: 'Meal' },
    mealAll: { zh: '全日', en: 'All day' },
    mealBreakfast: { zh: '早餐', en: 'Breakfast' },
    mealLunch: { zh: '午餐', en: 'Lunch' },
    mealTea: { zh: '下午茶', en: 'Tea' },
    mealDinner: { zh: '晚餐', en: 'Dinner' },

    /* 飯堂頁 */
    backHome: { zh: '首頁', en: 'Home' },
    filterAll: { zh: '全部', en: 'All' },
    sortLabel: { zh: '排序', en: 'Sort' },
    chipsPrev: { zh: '瀏覽前面的分類', en: 'Browse earlier categories' },
    chipsNext: { zh: '瀏覽後面的分類', en: 'Browse later categories' },
    sortPopular: { zh: '最多評論', en: 'Most reviewed' },
    sortRating: { zh: '最高評分', en: 'Top rated' },
    sortPriceAsc: { zh: '價錢由低至高', en: 'Price: low first' },
    noResult: { zh: '這個分類暫時沒有菜。', en: 'No dishes in this category yet.' },
    noMenuYet: { zh: '這個食堂的菜單還未收錄——官方目前只出 PDF／圖片菜單，待補。', en: 'This canteen’s menu is not listed yet — only a PDF/image menu is published so far.' },
    noReviewsYet: { zh: '還沒有評論——做第一個講真話的人。', en: 'No reviews yet — be the first to tell the truth.' },

    /* 判定 */
    verdictMust: { zh: '必食', en: 'MUST EAT' },
    verdictOk: { zh: '普通', en: 'OK' },
    verdictAvoid: { zh: '避雷', en: 'AVOID' },

    /* 評論表單 */
    formTitle: { zh: '寫評論', en: 'Write a review' },
    formSub: { zh: '一句話就夠，整個校園都受惠。', en: 'One line is enough — the whole campus eats better for it.' },
    formStars: { zh: '你的評分', en: 'Your rating' },
    formVerdict: { zh: '你的判定', en: 'Your verdict' },
    formNickname: { zh: '暱稱（可留空＝匿名同學）', en: 'Nickname (leave blank to stay anonymous)' },
    formNicknamePlaceholder: { zh: '匿名同學', en: 'Anonymous student' },
    formText: { zh: '食後感（可留空）', en: 'Your review (optional)' },
    formTextPlaceholder: {
      zh: '份量、味道、等幾久、抵不抵……留空也可以，只給星一樣算數。',
      en: 'Portion, taste, wait time, value… or leave it blank — a rating alone still counts.',
    },
    formSubmit: { zh: '刊登', en: 'Post' },
    formSubmitting: { zh: '刊登中…', en: 'Posting…' },
    formHint: { zh: '評論會即時公開；範例評論可一鍵隱藏。', en: 'Reviews go live instantly; sample reviews can be hidden anytime.' },
    errNeedRating: { zh: '先選個星級。', en: 'Pick a star rating first.' },
    errNeedText: { zh: '請至少寫幾個字再發佈。', en: 'Write at least a few words before posting.' },
    errNetwork: { zh: '送不出去，請再試一次。', en: 'Could not post the review, please try again.' },
    formThanks: { zh: '已刊登，多謝你。', en: 'Posted — thanks for feeding the campus.' },

    /* 快速評分：兩步 —— 先揀，再確認。第一步只是選取，按「確認送出」才真的記錄 */
    quickTitle: { zh: '快速評分', en: 'Quick rating' },
    quickNote: { zh: '先揀一個，再按「確認送出」才算數。', en: 'Pick one, then tap Confirm — nothing is saved until you do.' },
    quickStars: { zh: '{n} 星', en: '{n}★' },
    quickConfirmMsg: { zh: '已選「{v}」，確定送出？', en: 'You picked “{v}” — send it?' },
    quickConfirm: { zh: '確認送出', en: 'Confirm' },
    quickCancel: { zh: '取消', en: 'Cancel' },
    quickDone: { zh: '記低咗你嗰票！', en: 'Your vote is in!' },

    /* 預設標籤：給不想打字的人一組現成說法 */
    formTags: { zh: '快速標籤（可選，可多選）', en: 'Quick tags (optional, pick any)' },
    chipValue: { zh: '抵食', en: 'Good value' },
    chipPortionBig: { zh: '份量多', en: 'Generous portion' },
    chipTasty: { zh: '好味', en: 'Tasty' },
    chipAverage: { zh: '中規中矩', en: 'Just OK' },
    chipOily: { zh: '太油', en: 'Too oily' },
    chipSmall: { zh: '份量少', en: 'Small portion' },
    chipNotTasty: { zh: '唔好味', en: 'Not tasty' },
    chipTasteless: { zh: '冇味', en: 'Flavourless' },
    chipPricey: { zh: '唔抵食', en: 'Poor value' },
    ratingOnly: { zh: '（只給了評分，沒有留言）', en: '(Rating only — no comment)' },

    /* 頁尾 */
    footerTagline: {
      zh: '香港校園覓食，由 Eaty 開始。兩間大學的食堂、價錢與避雷情報。',
      en: 'Hong Kong campus eating starts with Eaty — canteens, prices and avoid-lists across CityU and HKU.',
    },
    footerNote: {
      zh: '學生自製網站，非官方，與各院校無從屬關係。菜單抄錄自各校官方餐飲頁及餐廳菜單（2026-10）；價錢以食堂現場為準。',
      en: 'A student-built, unofficial site, not affiliated with any institution. Menus transcribed from official catering pages and outlet menus (Oct 2026); prices at the counter apply.',
    },
    footerPhotoNote: {
      zh: '食堂照片為實際場地照（部分取自 Wikimedia Commons，CC 授權）；部分菜品照片沿用同分類圖片，僅供參考，非實際商品照。',
      en: 'Canteen photos show the actual venues (some from Wikimedia Commons under CC licences); some dish photos are shared within a category and are for reference only — not actual product shots.',
    },
    footerCoverageNote: {
      zh: '本站菜單為人手整理，並非食堂全部菜品，未涵蓋所有檔口、期間限定與每日供應的菜式。菜式、價錢與供應時間或有變動，一律以食堂現場為準。',
      en: 'This menu is hand-copied and is not exhaustive — it does not cover every stall, limited-time item, or daily special. Dishes, prices and availability may change; the canteen counter always takes precedence.',
    },
    footerUpdated: {
      zh: '最後更新 2026-11-01',
      en: 'Last updated 2026-11-01',
    },
    footerSamplesHidden: { zh: '隱藏範例評論', en: 'Hide sample reviews' },
    footerSamplesShown: { zh: '顯示範例評論', en: 'Show sample reviews' },
    footerStorageLocal: { zh: '評論暫存於你的瀏覽器', en: 'Reviews stored in your browser' },
    footerStorageCloud: { zh: '評論已雲端共享', en: 'Reviews shared in the cloud' },
    footerOfficial: { zh: '官方餐廳資訊', en: 'Official catering info' },
    footerFeedback: { zh: '意見回饋 / 補充菜單', en: 'Feedback / add a dish' },

    /* 通用 */
    close: { zh: '關閉', en: 'Close' },
    starUnit: { zh: '星', en: 'star' },

    /* 標籤 */
    tagSignature: { zh: '招牌', en: 'SIGNATURE' },
    tagSpicy: { zh: '辣', en: 'Spicy' },
    tagValue: { zh: '抵食', en: 'Value' },
    tagSweet: { zh: '甜', en: 'Sweet' },
  };

  let current = 'zh';
  try {
    const saved = localStorage.getItem(CFG.LANG_KEY);
    if (saved === 'en' || saved === 'zh') current = saved;
    else if (navigator.language && /^en/i.test(navigator.language)) current = 'en';
  } catch (e) { /* 預設繁中 */ }

  const listeners = [];

  window.I18N = {
    t(key) {
      const entry = DICT[key];
      if (!entry) return key;
      return entry[current] || entry.zh || key;
    },
    /* 取名：目前語言優先；該語言是空字串（不是 null）時也要退回另一種語言，
       否則資料裡 en='' 的菜在英文模式下會變成一整行空白。 */
    pick(obj) {
      if (!obj) return '';
      const a = current === 'en' ? obj.en : obj.zh;
      const b = current === 'en' ? obj.zh : obj.en;
      return String(a || b || '').trim();
    },
    lang() { return current; },
    set(lang) {
      if (lang !== 'zh' && lang !== 'en') return;
      current = lang;
      try { localStorage.setItem(CFG.LANG_KEY, lang); } catch (e) { /* ignore */ }
      document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
      for (const fn of listeners) fn(lang);
    },
    toggle() { this.set(current === 'zh' ? 'en' : 'zh'); },
    onChange(fn) { listeners.push(fn); },
  };
  document.documentElement.lang = current === 'zh' ? 'zh-Hant' : 'en';
})();
