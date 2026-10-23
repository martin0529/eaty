-- ═══════════════════════════════════════════════════════════
-- Eaty · canteens 加一個「小字別名」欄位（v0.14.1）
-- 2026-10-23
--
-- 背景：食堂卡的中文／英文名旁邊有一行小字（`canteenAltName()`）。
--   原本規則是「顯示另一個語言的名稱，兩者相同就退回 canteens.id 的大寫」，
--   於是 5380 Cafe 變成「5380 Cafe　5380」（自己重複自己）、
--   CMC Cafe 變成「CMCAFE　CMC CAFE」（也是重複）。
--   使用者要的是可以自訂的短標籤：5380 → AC1（它在康樂樓，屬 AC1 那幢）、CMC → CMC。
--
-- 做法：新增 `alias` 欄（text，可空）。有值就用它，冇值就回復原本的三段邏輯，
--       所以其他食堂（AC1／AC2／AC3）完全不受影響。
--
-- 可重複執行。
-- ═══════════════════════════════════════════════════════════

alter table canteens add column if not exists alias text;

update canteens set alias = 'AC1' where id = '5380';
update canteens set alias = 'CMC' where id = 'cmc';

-- 驗證
-- select id, zh, en, alias from canteens order by sort;
