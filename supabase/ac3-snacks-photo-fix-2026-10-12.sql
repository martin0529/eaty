-- AC3 7 道小食／炸物的圖片修復，2026-10-12
--
-- 背景：assets/ac3/ 有 7 個檔案其實是同一張「卡通佔位圖」（6781 bytes、600x450），
--       前端因此顯示空白卡片（炸薯條／魷魚圈／香烤雞翼…都是小食分類）。
--       dishes.photo 的路徑本身沒錯 → 修的是「檔案內容」，不是 DB 欄位。
--       本檔把 photo 路徑重寫一次，確保只要部署了新圖檔就一定對得上。
-- 圖片來源：Pexels（Pexels License：可商用、免署名）。逐張對照見
--       handover/dev/2026-10-12-ac3-snacks/photo-map-ac3-snacks.json
--
-- 可重複執行。

update dishes set photo = 'assets/ac3/french-fries.jpg'
 where id = 'ac3-french-fries';

update dishes set photo = 'assets/ac3/calamari-rings.jpg'
 where id = 'ac3-calamari-rings';

update dishes set photo = 'assets/ac3/roasted-chicken-wings-2pcs.jpg'
 where id = 'ac3-roasted-chicken-wings-2pcs';

update dishes set photo = 'assets/ac3/crispy-chicken-nuggets-6pcs.jpg'
 where id = 'ac3-crispy-chicken-nuggets-6pcs';

update dishes set photo = 'assets/ac3/chicken-nuggets-fries-mayo.jpg'
 where id = 'ac3-chicken-nuggets-fries-mayo';

update dishes set photo = 'assets/ac3/buffalo-wings-salt-pepper-fries.jpg'
 where id = 'ac3-buffalo-wings-salt-pepper-fries';

update dishes set photo = 'assets/ac3/honey-yuzu-wings-salt-pepper-fries.jpg'
 where id = 'ac3-honey-yuzu-wings-salt-pepper-fries';
