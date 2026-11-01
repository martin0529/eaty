-- 2026-11-01：三間食堂換成真正的門店照（用戶提供的現場照）
-- ac1  城大食坊 City Express：舊圖是翻新前的收銀台，換成新的自助點餐機牆 + 招牌
-- cmc  CMC Cafe：舊圖是豎構圖內景，在 16:10 卡片裡被裁成一條縫，換成正門外觀
-- 5380 5380 Cafe：原本沒有場地照（photo 是空字串 → 走文字佔位），這次補上
-- 檔名統一為 assets/<id>/store.jpg（不動舊檔，方便回滾）

update canteens set photo = v.photo
from (values
  ('ac1',  'assets/ac1/store.jpg'),
  ('cmc',  'assets/cmc/store.jpg'),
  ('5380', 'assets/5380/store.jpg')
) as v(id, photo)
where canteens.id = v.id;

select id, photo from canteens order by uni, sort;
