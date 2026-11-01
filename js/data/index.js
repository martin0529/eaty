/* Eaty — 多大學版本 · 資料彙整
 *
 * 把各大學的資料檔（universities.js / cityu.js / hkbu.js …）合成一份
 * window.EATY_DATA。這裡只做「收集」，不做過濾——過濾交給 menu-data.js
 * 的 EatyMenu.setUniversity()。
 *
 * 之後新增大學：
 *   1. universities.js 加一筆
 *   2. 新增 js/data/<uni>.js，export 成 window.EATY_DATA_<UNI>
 *   3. 下面 SOURCES 加一行
 *   4. index.html 加一個 <script>
 */
(function () {
  'use strict';

  const SOURCES = [
    window.EATY_DATA_CITYU,
    window.EATY_DATA_HKU,
  ].filter(Boolean);

  const raw = { canteens: [], categories: [], dishes: [] };
  for (const src of SOURCES) {
    if (Array.isArray(src.canteens)) raw.canteens.push(...src.canteens);
    if (Array.isArray(src.categories)) raw.categories.push(...src.categories);
    if (Array.isArray(src.dishes)) raw.dishes.push(...src.dishes);
  }

  window.EATY_DATA = {
    universities: window.EATY_UNIVERSITIES || [],

    // 全部大學的原始資料（不變）
    raw,

    // 目前大學的「作用中檢視」——app.js 只讀這三份，切換大學時由
    // menu-data.js 的 EatyMenu.setUniversity() 就地替換內容。
    canteens: [],
    categories: [],
    dishes: [],

    // 抽籤黑名單（本地；kind 只用到 category，ids 已是全站唯一）
    // 飲品／甜品不是「今天吃什麼」的答案 → 排除在抽籤池外（不影響食堂頁瀏覽）。
    rollBlacklist: {
      categories: [
        'drinks',                          // CityU：飲品甜品
        'hku-cym-drinks',                   // HKU CYM：飲品
        'hku-cym-special-drinks',           // HKU CYM：特色飲品（梳打／紅牛）
        'hku-hw-drinks',                    // HKU 黃克競：飲品
        'hku-hw-summer-soda',               // HKU 黃克競：盛夏氣泡特調
      ],
      dishes: [],
    },

    // 多大學版本不放種子範例評論
    sampleReviews: [],
  };
})();
