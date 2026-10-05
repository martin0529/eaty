/* Eaty — 城大搵食指南 中英雙語
 * I18N.t(key) 取字；I18N.lang() 現在語言；I18N.set(lang) 切換並廣播 'langchange'。
 */
(function () {
  'use strict';
  const CFG = window.CITYU_EATS_CONFIG;

  const DICT = {
    /* 頁首 */
    siteName: { zh: 'Eaty', en: 'Eaty' },
    navCanteens: { zh: '三大食堂', en: 'Canteens' },
    navAvoid: { zh: '避雷榜', en: 'Avoid List' },
    navReviews: { zh: '最新評論', en: 'Latest Reviews' },
    navRandom: { zh: '今天吃什麼', en: 'What to Eat' },
    langBtn: { zh: 'EN', en: '中' },
    langBtnLabel: { zh: '切換至英文', en: 'Switch to Chinese' },

    /* 首頁 hero */
    heroKicker: { zh: '今日主打', en: "Today's pick" },
    heroTagline: { zh: '城大覓食指南', en: 'CityU Canteen Guide' },
    heroCta1: { zh: '瀏覽三大食堂', en: 'Browse canteens' },
    heroCta2: { zh: '今天吃什麼？隨機幫你選', en: 'What to eat? Roll for me' },

    /* 飯堂卡 */
    canteensHeading: { zh: '三大食堂，一份覓食地圖。', en: 'Three canteens, one food map.' },
    dishesCount: { zh: '項菜品', en: ' dishes' },
    officialOrdering: { zh: '官方網上點餐', en: 'Official online ordering' },
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
    randomSub: { zh: '選擇範圍，按下按鈕，交給命運。', en: 'Pick a scope, hit the button, leave it to fate.' },
    randomScopeAll: { zh: '三大食堂', en: 'All canteens' },
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
    formText: { zh: '食後感', en: 'Your review' },
    formTextPlaceholder: {
      zh: '份量、味道、等待時間、是否划算……',
      en: 'Portion, taste, wait time, value for money…',
    },
    formSubmit: { zh: '刊登評論', en: 'Post review' },
    formSubmitting: { zh: '刊登中…', en: 'Posting…' },
    formHint: { zh: '評論會立即公開顯示；範例評論可一鍵隱藏。', en: 'Reviews go live instantly; sample reviews can be hidden anytime.' },
    errNeedRating: { zh: '請先選擇星級評分。', en: 'Please tap a star rating first.' },
    errNeedText: { zh: '請至少寫幾個字再發佈。', en: 'Write at least a few words before posting.' },
    errNetwork: { zh: '評論傳送失敗，請再試一次。', en: 'Could not post the review, please try again.' },
    formThanks: { zh: '已刊登！謝謝你的分享。', en: 'Posted — thanks for feeding the campus.' },

    /* 頁尾 */
    footerTagline: {
      zh: '城大覓食，由 Eaty 開始。三大食堂的菜單、評價與避雷情報，一目了然。',
      en: 'CityU eating starts with Eaty — menus, reviews and avoid-list intel for all three canteens, at a glance.',
    },
    footerNote: {
      zh: '學生自製網站，非官方，與香港城市大學無從屬關係。AC1 菜單於 2026-10-02 從官方點餐站抄錄，AC2／AC3 為代表性資料；價錢以食堂現場為準。',
      en: 'A student-built, unofficial site, not affiliated with CityU. AC1 menu copied from the official ordering site on 2026-10-02; AC2/AC3 entries are representative — prices at the counter apply.',
    },
    footerSamplesHidden: { zh: '隱藏範例評論', en: 'Hide sample reviews' },
    footerSamplesShown: { zh: '顯示範例評論', en: 'Show sample reviews' },
    footerStorageLocal: { zh: '評論暫存於你的瀏覽器', en: 'Reviews stored in your browser' },
    footerStorageCloud: { zh: '評論已雲端共享（Supabase）', en: 'Reviews shared via Supabase' },
    footerOfficial: { zh: '官方餐廳資訊', en: 'Official catering info' },

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
