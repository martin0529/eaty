/* Eaty — 多大學版本 · 菜單載入器（雲端優先，本地後備）
 *
 * v2.0.0 起與單校版合併：菜單、分類、食堂、大學清單都放在 Supabase，
 * 本地 js/data/*.js 只在「連不上資料庫」時頂上。載入器做三件事：
 *   1. 啟動時抓雲端（universities / canteens / categories / dishes），
 *      成功就把 EATY_DATA.raw 換成雲端版本；任何一步失敗就整批保留本地。
 *   2. 依「目前選的大學」把 EATY_DATA.raw 過濾進 EATY_DATA.canteens /
 *      categories / dishes（app.js 只讀這三份作用中檢視）。
 *   3. 提供抽籤黑名單（雲端 roll_blacklist 優先，失敗用本地清單）。
 *
 * 餐段（meal）：分類的 meal 是逗號分隔字串，這裡統一解析成固定次序的陣列；
 * 空陣列＝不分餐（只在「全日」出現）。接受中文別名與全角分隔號。
 */
(function () {
  'use strict';
  const CFG = window.EATY_CONFIG;
  const DATA = window.EATY_DATA;

  /* ── 餐段解析 ─────────────────────────────── */
  const MEALS = ['breakfast', 'lunch', 'tea', 'dinner'];
  const MEAL_ALIAS = {
    b: 'breakfast', breakfast: 'breakfast', 早餐: 'breakfast', 早點: 'breakfast', 早市: 'breakfast',
    l: 'lunch', lunch: 'lunch', 午餐: 'lunch', 中餐: 'lunch', 午市: 'lunch',
    t: 'tea', tea: 'tea', 下午茶: 'tea', 茶餐: 'tea', 茶市: 'tea', 茶點: 'tea', 下午: 'tea',
    d: 'dinner', dinner: 'dinner', supper: 'dinner', 晚餐: 'dinner', 晚市: 'dinner',
  };
  const MEAL_ALL = ['all', 'always', 'day', '全天', '三餐', '全日'];
  function parseMeal(v) {
    if (Array.isArray(v)) {
      const set = new Set(v.map((x) => String(x).trim().toLowerCase()));
      return MEALS.filter((m) => set.has(m));
    }
    const raw = String(v == null ? '' : v).trim();
    if (!raw) return [];
    const set = new Set();
    for (const part of raw.split(/[,，、;；/|\s]+/)) {
      const t = part.trim().toLowerCase();
      if (!t) continue;
      if (MEAL_ALL.indexOf(t) >= 0) { MEALS.forEach((m) => set.add(m)); continue; }
      if (MEAL_ALIAS[t]) set.add(MEAL_ALIAS[t]);
    }
    return MEALS.filter((m) => set.has(m));
  }
  function normalizeCategory(r) {
    return {
      id: r.id, uni: r.uni,
      zh: r.zh || r.id, en: r.en || r.zh || r.id,
      meal: parseMeal(r.meal),
      // 檔口（＝分類）自己的官方點餐連結，選填。有值時食堂頁的分類標題列會多一顆
      // 「網上點餐 ↗」膠囊（AC2 的西北麵館／餃餃陣就是這種：食堂沒有總站，檔口各自有）。
      // 兩種來源欄位名都要吃：雲端 Supabase 是蛇形 order_url，
      // 本地回退 js/data/*.js 是駝峰 orderUrl。只認一種就會靜默丟連結
      // （v2.2.2 前只寫 r.orderUrl → AC2 的西北麵館／餃餃陣在線上整個消失）。
      orderUrl: r.order_url || r.orderUrl || '',
    };
  }

  // 先把原始分類的 meal 統一成陣列，讓過濾進來的形狀一致
  DATA.raw.categories.forEach((c) => { c.meal = parseMeal(c.meal); });

  /* ── 抽籤黑名單（本地）────────────────────── */
  function blacklistSets() {
    const bl = DATA.rollBlacklist || {};
    return {
      dishes: new Set(Array.isArray(bl.dishes) ? bl.dishes : []),
      categories: new Set(Array.isArray(bl.categories) ? bl.categories : []),
    };
  }

  /* ── 目前大學 ─────────────────────────────── */
  function savedUni() {
    try {
      const v = localStorage.getItem(CFG.UNI_KEY);
      if (v && DATA.universities.some((u) => u.id === v)) return v;
    } catch (e) { /* ignore */ }
    return CFG.DEFAULT_UNI || (DATA.universities[0] && DATA.universities[0].id) || '';
  }

  /* ── 雲端（Supabase）───────────────────────────
   * v2.0.0 起資料庫是唯一來源：universities / canteens / categories / dishes。
   * 任何一步失敗（離線、RLS 擋住、逾時、表還是空的）就整批退回本地
   * js/data/*.js —— 寧可顯示舊資料，也不要半殘的畫面。
   */
  const CLOUD_TIMEOUT = 8000;
  const PAGE = 1000;

  function cloudHeaders(extra) {
    return Object.assign({
      apikey: CFG.SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY,
    }, extra || {});
  }

  /** 分頁抓整張表（Supabase 預設單次上限 1000 列，HKBU 那種規模會截斷） */
  async function cloudGetAll(path, signal) {
    const base = String(CFG.SUPABASE_URL).replace(/\/$/, '') + '/rest/v1/' + path;
    const out = [];
    for (let from = 0; from < 40000; from += PAGE) {
      const res = await fetch(base, {
        headers: cloudHeaders({ Range: from + '-' + (from + PAGE - 1) }),
        signal,
      });
      if (!res.ok) throw new Error('http ' + res.status);
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new Error('bad payload');
      out.push(...rows);
      if (rows.length < PAGE) break;
    }
    return out;
  }

  function normalizeUniversity(r) {
    return {
      id: r.id,
      short: r.short || String(r.id || '').toUpperCase(),
      zh: r.zh || r.id, en: r.en || r.zh || r.id,
      cityZh: r.city_zh || '', cityEn: r.city_en || '',
      taglineZh: r.tagline_zh || '', taglineEn: r.tagline_en || '',
      noteZh: r.note_zh || '', noteEn: r.note_en || '',
      officialUrl: r.official_url || '', color: r.color || '',
      photo: r.photo || '', photoCredit: r.photo_credit || '',
      heroDishId: r.hero_dish_id || '',
    };
  }
  function normalizeCanteen(r) {
    return {
      id: r.id, uni: r.uni || '',
      // alias ＝「食堂卡名旁邊那行小字」，已上線版（單校版 v0.14.1）的規則：
      // alias 有值就用它（5380 Cafe → AC1、CMCAFE → CMC），否則退回另一語言名稱。
      // 這裡照抄，免得同一個食堂在兩版顯示不同名字。
      alias: (r.alias && String(r.alias).trim()) || '',
      short: r.short || String(r.id || '').toUpperCase(),
      zh: r.zh || r.en || r.id, en: r.en || r.zh || r.id,
      bldgZh: r.bldg_zh || '', bldgEn: r.bldg_en || '',
      hoursZh: r.hours_zh || '', hoursEn: r.hours_en || '',
      factZh: r.fact_zh || '', factEn: r.fact_en || '',
      color: r.color || r.id, photo: r.photo || '',
      // 同 normalizeCategory：雲端蛇形、本地駝峰，兩種都認
      orderUrl: r.order_url || r.orderUrl || null,
    };
  }
  function normalizeDish(r) {
    return {
      id: r.id, uni: r.uni || '', canteenId: r.canteen_id, cat: r.category,
      zh: r.zh, en: r.en || r.zh,
      price: r.price == null || r.price === '' ? null : Number(r.price),
      photo: r.photo || '', descZh: r.desc_zh || '', descEn: r.desc_en || '',
      tags: Array.isArray(r.tags) ? r.tags : [],
      available: r.available !== false,
    };
  }

  async function fetchCloud() {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return null;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), CLOUD_TIMEOUT);
    try {
      const [us, cs, cats, ds] = await Promise.all([
        cloudGetAll('universities?select=*&order=sort.asc', ctl.signal),
        cloudGetAll('canteens?select=*&order=sort.asc', ctl.signal),
        cloudGetAll('categories?select=*&order=sort.asc', ctl.signal),
        cloudGetAll('dishes?select=*&order=sort.asc', ctl.signal),
      ]);
      if (!us.length || !cs.length || !ds.length) return null;
      let black = null;
      try {
        const rows = await cloudGetAll((CFG.SUPABASE_ROLL_TABLE || 'roll_blacklist') + '?select=kind,value', ctl.signal);
        black = rows.filter((x) => x.kind === 'category').map((x) => x.value);
      } catch (e) { /* 黑名單是加分項，掛掉不影響菜單 */ }
      return {
        universities: us.map(normalizeUniversity),
        canteens: cs.map(normalizeCanteen),
        categories: cats.length ? cats.map(normalizeCategory) : null,
        dishes: ds.filter((d) => d.available !== false).map(normalizeDish),
        blackCategories: black,
      };
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  window.EatyMenu = {
    source: 'local',
    rollBlacklistSource: 'local',
    currentUni: '',
    universities: DATA.universities,
    rollBlacklist: blacklistSets(),

    university(id) {
      return DATA.universities.find((u) => u.id === id) || DATA.universities[0] || null;
    },

    /** 切換目前大學：把該校的食堂／分類／菜品過濾進作用中檢視。 */
    setUniversity(id) {
      const uni = this.university(id);
      if (!uni) return null;
      this.currentUni = uni.id;

      const raw = DATA.raw;
      const canteens = raw.canteens.filter((c) => c.uni === uni.id);
      const canteenIds = new Set(canteens.map((c) => c.id));
      const categories = raw.categories.filter((c) => c.uni === uni.id).map(normalizeCategory);
      const dishes = raw.dishes.filter((d) => d.uni === uni.id || canteenIds.has(d.canteenId));

      DATA.canteens.length = 0; DATA.canteens.push(...canteens);
      DATA.categories.length = 0; DATA.categories.push(...categories);
      DATA.dishes.length = 0; DATA.dishes.push(...dishes);

      this.rollBlacklist = blacklistSets();

      try { localStorage.setItem(CFG.UNI_KEY, uni.id); } catch (e) { /* ignore */ }
      return uni;
    },

    /** 啟動時用：先試雲端，連不上才用本地；最後套用上次選的大學。 */
    async load() {
      const cloud = await fetchCloud();
      if (cloud) {
        DATA.universities.length = 0;
        DATA.universities.push(...cloud.universities);
        DATA.raw.canteens.length = 0;
        DATA.raw.canteens.push(...cloud.canteens);
        DATA.raw.dishes.length = 0;
        DATA.raw.dishes.push(...cloud.dishes);
        if (cloud.categories) {
          DATA.raw.categories.length = 0;
          DATA.raw.categories.push(...cloud.categories);
        }
        if (cloud.blackCategories && cloud.blackCategories.length) {
          DATA.rollBlacklist.categories = cloud.blackCategories;
        }
        this.universities = DATA.universities;
        this.rollBlacklistSource = 'cloud';
        this.source = 'cloud';
      } else {
        this.source = 'local';
        this.rollBlacklistSource = 'local';
      }
      this.setUniversity(savedUni());
      return this.source;
    },
  };
})();
