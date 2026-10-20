/* Eaty — 城大搵食指南 中英雙語
 * I18N.t(key) 取字；I18N.lang() 現在語言；I18N.set(lang) 切換並廣播 'langchange'。
 */
(function () {
  'use strict';
  const CFG = window.CITYU_EATS_CONFIG;

  const DICT = {
    /* 頁首 */
    siteName: { zh: 'Eaty', en: 'Eaty' },
    navCanteens: { zh: '食堂', en: 'Canteens' },
    navAvoid: { zh: '避雷榜', en: 'Avoid List' },
    navReviews: { zh: '最新評論', en: 'Latest Reviews' },
    navRandom: { zh: '今天吃什麼', en: 'What to Eat' },
    langBtn: { zh: 'EN', en: '中' },
    langBtnLabel: { zh: '切換至英文', en: 'Switch to Chinese' },

    /* 首頁 hero */
    heroKicker: { zh: '今日主打', en: "Today's pick" },
    heroTagline: { zh: '城大覓食指南', en: 'CityU Canteen Guide' },
    heroCta1: { zh: '瀏覽食堂', en: 'Browse canteens' },
    heroCta2: { zh: '今天吃什麼？隨機幫你選', en: 'What to eat? Roll for me' },

    /* 飯堂卡 */
    canteensHeading: { zh: '食堂，一份覓食地圖。', en: 'All canteens, one food map.' },
    dishesCount: { zh: '項菜品', en: ' dishes' },
    officialOrdering: { zh: '官方網上點餐', en: 'Official online ordering' },
    stallOrdering: { zh: '網上點餐', en: 'Order online' },
    stallOrderingLabel: { zh: '檔口點餐', en: 'Stall ordering' },
    viewMenu: { zh: '查看菜單', en: 'View menu' },
    viewAll: { zh: '查看全部', en: 'See all' },

    /* 熱門 */
    hotHeading: { zh: '今日熱門', en: "Today's Hot" },
    hotSub: { zh: '按評分與評論數即時排序——最多人推薦的先上場。', en: 'Ranked live by ratings and review counts — the most-loved dishes first.' },
    latestHeading: { zh: '最新評論', en: 'Latest Reviews' },
    latestSub: { zh: '必食、普通還是避雷，由同學的評價說了算。', en: 'Must-eat, OK or avoid — students have the final say.' },
    sampleTag: { zh: '範例', en: 'Sample' },

    /* 避雷榜 */
    avoidHeading: { zh: '避雷排行榜', en: 'Avoid List' },
    avoidSub: { zh: '真實數據告訴你哪些不宜輕試——避雷率由同學一票一票投出來。', en: 'Real data on what to skip — the avoid rate is voted one review at a time.' },
    avoidNote: { zh: '排行以「避雷」評價佔該菜品總評論的比例計算，只統計有 2 則或以上評論的菜品。', en: 'Ranked by the share of “avoid” votes per dish; only dishes with 2+ reviews count.' },
    avoidPctOf: { zh: '避雷票佔比', en: 'avoid votes' },

    /* 隨機器 */
    randomTitle: { zh: '今天吃什麼？', en: 'What to eat today?' },
    randomSub: { zh: '選好範圍與時段，按下按鈕，交給命運。', en: 'Pick a scope and a meal, hit the button, leave it to fate.' },
    randomScopeLabel: { zh: '範圍', en: 'Scope' },
    randomMealLabel: { zh: '時段', en: 'Meal' },
    randomScopeAll: { zh: '食堂', en: 'All canteens' },
    randomRoll: { zh: '開始！', en: 'Roll!' },
    randomRolling: { zh: '選擇中…', en: 'Rolling…' },
    randomAgain: { zh: '再來一次', en: 'Roll again' },
    randomView: { zh: '查看這道菜', en: 'View this dish' },
    randomPick: { zh: '今日之選', en: "TODAY'S PICK" },
    randomPool: { zh: '可抽 {n} 道菜', en: '{n} dishes in the draw' },
    randomPoolEmpty: { zh: '沒有可抽的菜——黑名單可能把全部菜品都排除了。', en: 'Nothing to draw — the blacklist may have excluded every dish.' },

    /* 餐段（早餐／午餐／晚餐）：食堂頁分類 chips 的上層。
       全日 = 不按餐段篩選（跟下面 chips 的「全部」是兩件事）。 */
    mealLabel: { zh: '餐段', en: 'Meal' },
    mealAll: { zh: '全日', en: 'All day' },
    mealBreakfast: { zh: '早餐', en: 'Breakfast' },
    mealLunch: { zh: '午餐', en: 'Lunch' },
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
    noResult: { zh: '這個分類暫時沒有菜品。', en: 'No dishes in this category yet.' },
    noReviewsYet: { zh: '還沒有評論——成為第一個說真話的人。', en: 'No reviews yet — be the first to tell the truth.' },

    /* 判定 */
    verdictMust: { zh: '必食', en: 'MUST EAT' },
    verdictOk: { zh: '普通', en: 'OK' },
    verdictAvoid: { zh: '避雷', en: 'AVOID' },

    /* 評論表單 */
    formTitle: { zh: '寫評論', en: 'Write a review' },
    formSub: { zh: '你的一句話，幫助整個校園吃得更好。', en: 'Your one line helps the whole campus eat better.' },
    formStars: { zh: '你的評分', en: 'Your rating' },
    formVerdict: { zh: '你的判定', en: 'Your verdict' },
    formNickname: { zh: '暱稱（可留空＝匿名同學）', en: 'Nickname (leave blank to stay anonymous)' },
    formNicknamePlaceholder: { zh: '匿名同學', en: 'Anonymous student' },
    formText: { zh: '食後感（可留空）', en: 'Your review (optional)' },
    formTextPlaceholder: {
      zh: '份量、味道、等待時間、是否划算……留空也可以，只給星級一樣算數。',
      en: 'Portion, taste, wait time, value… or leave it blank — a rating alone still counts.',
    },
    formSubmit: { zh: '刊登評論', en: 'Post review' },
    formSubmitting: { zh: '刊登中…', en: 'Posting…' },
    formHint: { zh: '評論會立即公開顯示；範例評論可一鍵隱藏。', en: 'Reviews go live instantly; sample reviews can be hidden anytime.' },
    errNeedRating: { zh: '請先選擇星級評分。', en: 'Please tap a star rating first.' },
    errNeedText: { zh: '請至少寫幾個字再發佈。', en: 'Write at least a few words before posting.' },
    errNetwork: { zh: '評論傳送失敗，請再試一次。', en: 'Could not post the review, please try again.' },
    formThanks: { zh: '已刊登！謝謝你的分享。', en: 'Posted — thanks for feeding the campus.' },

    /* 一鍵評分：不用打字也能投一票 */
    quickTitle: { zh: '一鍵評分', en: 'One-tap rating' },
    quickNote: { zh: '不用寫字，按一下就算一票。', en: 'No typing needed — one tap counts as a vote.' },
    quickStars: { zh: '{n} 星', en: '{n}★' },
    quickDone: { zh: '已記下你的一票！', en: 'Your vote is in!' },

    /* 預設標籤：給不想打字的人一組現成說法 */
    formTags: { zh: '快速標籤（可選，可多選）', en: 'Quick tags (optional, pick any)' },
    chipValue: { zh: '抵食', en: 'Good value' },
    chipPortionBig: { zh: '份量足', en: 'Generous portion' },
    chipTasty: { zh: '好味', en: 'Tasty' },
    chipFast: { zh: '上菜快', en: 'Served fast' },
    chipAverage: { zh: '中規中矩', en: 'Just OK' },
    chipOily: { zh: '太油', en: 'Too oily' },
    chipSalty: { zh: '太鹹', en: 'Too salty' },
    chipSlow: { zh: '等好久', en: 'Long wait' },
    chipSmall: { zh: '份量少', en: 'Small portion' },
    ratingOnly: { zh: '（只給了評分，沒有留言）', en: '(Rating only — no comment)' },

    /* 頁尾 */
    footerTagline: {
      zh: '城大覓食，由 Eaty 開始。食堂的菜單、評價與避雷情報，一目了然。',
      en: 'CityU eating starts with Eaty — menus, reviews and avoid-list intel for every canteen, at a glance.',
    },
    footerNote: {
      zh: '學生自製網站，非官方，與香港城市大學無從屬關係。菜單最後更新：2026-10-14（AC1 抄錄自官方點餐站，AC2 現場菜單整理、兩個檔口抄錄自官方點餐平台，AC3 抄錄自官方點餐平台，CMC Cafe 抄錄自現場菜單牌）；價錢以食堂現場為準。',
      en: 'A student-built, unofficial site, not affiliated with CityU. Menu last updated 2026-10-14 (AC1 from the official ordering site; AC2 from the on-site menu boards, with two stalls from the official ordering platform; AC3 from the official ordering platform; CMC Cafe from the on-site menu board); prices at the counter apply.',
    },
    footerPhotoNote: {
      zh: '部分圖片取自網上圖庫，僅供參考，非實際商品照。',
      en: 'Some photos are sourced from online stock libraries and are for reference only — not actual product shots.',
    },
    footerCoverageNote: {
      zh: '本站菜單為人手整理，並非食堂全部菜品，未涵蓋所有檔口、期間限定與每日供應的菜式。菜式、價錢與供應時間或有變動，一律以食堂現場為準。',
      en: 'This menu is hand-copied and is not exhaustive — it does not cover every stall, limited-time item, or daily special. Dishes, prices and availability may change; the canteen counter always takes precedence.',
    },
    footerUpdated: {
      zh: '最後更新 2026-10-14',
      en: 'Last updated 2026-10-14',
    },
    footerSamplesHidden: { zh: '隱藏範例評論', en: 'Hide sample reviews' },
    footerSamplesShown: { zh: '顯示範例評論', en: 'Show sample reviews' },
    footerStorageLocal: { zh: '評論暫存於你的瀏覽器', en: 'Reviews stored in your browser' },
    footerStorageCloud: { zh: '評論已雲端共享（Supabase）', en: 'Reviews shared via Supabase' },
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
    pick(obj) {
      if (!obj) return '';
      return current === 'en' ? (obj.en ?? obj.zh ?? '') : (obj.zh ?? obj.en ?? '');
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
