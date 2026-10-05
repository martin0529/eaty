/* 城大搵食指南 CityU Eats — 站點設定
 *
 * 評論儲存方式：
 *   預設用 localStorage（每個瀏覽器各自儲存，零設定即用）。
 *   想開啟全校共享評論 → 到 supabase.com 免費開一個專案，執行根目錄的
 *   supabase-setup.sql，然後把下面 SUPABASE_URL 和 SUPABASE_ANON_KEY 填上。
 */
window.CITYU_EATS_CONFIG = {
  VERSION: '0.6.0',

  // Supabase project: Eaty (2026-10-04 由舊專案 Cityu canteen comment website 遷移)
  SUPABASE_URL: 'https://adnownneldfalplbdhvd.supabase.co',
  // publishable key — 公開金鑰，安全性由 RLS 政策保障
  SUPABASE_ANON_KEY: 'sb_publishable_CxKEG57uh9UR3f6QEGLI0Q__9Q7I46N',
  SUPABASE_TABLE: 'reviews',

  // 「今天吃什麼」抽籤黑名單表（只讀）。
  // 在 Supabase → Table Editor 加一行即時生效，毋須改程式：
  //   kind='category' → value 填 categories.id（飲品、Coffee Lounge…）
  //   kind='dish'     → value 填 dishes.id（ac1-pepperoni…）
  // 表未建立／讀不到時，會退回 js/menu-data.js 的內建黑名單。
  SUPABASE_ROLL_TABLE: 'roll_blacklist',

  // true = 全站永久隱藏種子範例評論（連頁尾的切換鈕一起收起來）。
  // 目前站上只放真實評論；Supabase reviews 表目前是空的，
  // 所以「最新評論 / 大家的真心話」區塊在還沒有人留言前不會出現。
  HIDE_SAMPLES: true,

  STORAGE_KEY: 'cityu-eats:reviews:v1',
  LANG_KEY: 'cityu-eats:lang',
  SAMPLES_KEY: 'cityu-eats:hide-samples',
};
