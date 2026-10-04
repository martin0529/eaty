-- ═══════════════════════════════════════════════════
--  Eaty 一次性修正（2026-10-04）
--    1) 文案：雲端 canteens.ac1.fact_zh 的「三個飯堂」→「三大食堂」
--    2) 清理：刪掉連線驗證時留下的測試評論
-- ═══════════════════════════════════════════════════

-- 1) 用語修正（只動含「飯堂」的那一列）
update canteens
   set fact_zh = replace(fact_zh, '三個飯堂', '三大食堂')
 where fact_zh like '%飯堂%';

-- 2) 清掉測試評論
delete from reviews
 where nickname = '__conn_test__';

-- 3) 回報結果
select id, zh, fact_zh from canteens order by sort;
select count(*) as reviews_left from reviews;
