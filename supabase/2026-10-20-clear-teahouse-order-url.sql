-- 2026-10-20 · 移除「四季茶坊」分類的點餐連結
--
-- 背景：v0.12.0 誤把 store 312882（= 西北麵館的店）的 dinein 連結掛到「四季茶坊」分類上。
--       四季茶坊**沒有自己的點餐平台**，飲品只是掛在西北麵館的店（312882）菜單下。
--       保留連結會把客人帶去西北麵館的店，屬於錯誤指引。
--
-- 影響：AC2 食堂頁標題區的檔口點餐列只剩「西北麵館 ↗」「餃餃陣 ↗」；
--       四季茶坊分類標題列與單獨分類頁都不再出現「網上點餐」。
--
-- 可重複執行（idempotent）。

update categories
   set order_url = null
 where id = '四季茶坊';

-- 驗證：應只剩 2 個分類有點餐連結
-- select id, zh, order_url from categories where order_url is not null order by id;
--   餃餃陣    https://csd.order.place/home/store/212882
--   西北麵館  https://csd.order.place/home/store/312882
