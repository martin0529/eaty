-- Eaty v2.1.2：補回 HKU 兩個食堂的餐段標記（categories.meal 在雲端一直是空的）
-- 前端以「分類」為單位篩餐段，meal 空 = 只在「全日」出現，所以 HKU 食堂頁整條餐段頁籤不顯示。
update categories as c
set meal = v.meal
from (values
('hku-cym-corn-chicken-macaroni','breakfast'),
('hku-cym-double-noodle-soup','breakfast'),
('hku-cym-hk-style-breakfast','breakfast'),
('hku-cym-fish-cutlet-breakfast','breakfast'),
('hku-cym-onion-chicken-breakfast','breakfast'),
('hku-cym-pork-patty-breakfast','breakfast'),
('hku-cym-western-breakfast','breakfast'),
('hku-cym-congee-set','breakfast'),
('hku-cym-dim-sum','breakfast,lunch,tea'),
('hku-cym-chinese-set-rice','lunch,dinner'),
('hku-cym-hot-pot','lunch,dinner'),
('hku-cym-japanese-sizzling','lunch,dinner'),
('hku-cym-sakura-shrimp-rice','lunch,dinner'),
('hku-cym-salted-egg-bbq-rice','lunch,dinner'),
('hku-cym-century-egg-chicken','lunch,dinner'),
('hku-cym-roast-bbq','lunch,dinner'),
('hku-cym-hot-sour-mixian','lunch,tea,dinner'),
('hku-cym-mock-shark-fin','breakfast,tea'),
('hku-cym-xo-noodle','lunch,tea'),
('hku-cym-mini-bbq-dessert','lunch,tea'),
('hku-cym-chicken-leg-tea','tea'),
('hku-cym-sides','breakfast,lunch,tea,dinner'),
('hku-cym-vegetarian','lunch,dinner'),
('hku-cym-snacks','tea'),
('hku-cym-special-drinks','breakfast,lunch,tea,dinner'),
('hku-cym-drinks','breakfast,lunch,tea,dinner'),
('hku-hw-lobster-fusilli','breakfast'),
('hku-hw-hk-style-breakfast','breakfast'),
('hku-hw-oatmeal-breakfast','breakfast'),
('hku-hw-fish-cutlet-breakfast','breakfast'),
('hku-hw-chicken-steak-breakfast','breakfast'),
('hku-hw-instant-noodle','breakfast,lunch,tea'),
('hku-hw-fried-noodle','lunch,tea'),
('hku-hw-scrambled-egg-breakfast','breakfast'),
('hku-hw-congee-set','breakfast'),
('hku-hw-congee-rice-roll','breakfast'),
('hku-hw-dim-sum','breakfast,tea'),
('hku-hw-thai-chicken-tea','tea'),
('hku-hw-french-toast-tea','tea'),
('hku-hw-crispy-bun-tea','tea'),
('hku-hw-chicken-leg-tea','tea'),
('hku-hw-mini-rice-tea','tea'),
('hku-hw-mock-shark-fin-tea','tea'),
('hku-hw-soup-noodle-tea','tea'),
('hku-hw-tea-snacks','tea'),
('hku-hw-express-picks','lunch,dinner'),
('hku-hw-nanyang-chicken','lunch,dinner'),
('hku-hw-dan-dan-noodle','lunch,dinner'),
('hku-hw-sakura-shrimp-rice','lunch,dinner'),
('hku-hw-japanese-rice','lunch,dinner'),
('hku-hw-udon-ramen','lunch,dinner'),
('hku-hw-curry-rice','lunch,dinner'),
('hku-hw-vegetarian','lunch,dinner'),
('hku-hw-two-three-dishes','lunch,dinner'),
('hku-hw-salted-egg-bbq-rice','lunch,dinner'),
('hku-hw-premium-bbq','lunch,dinner'),
('hku-hw-sides','lunch,tea,dinner'),
('hku-hw-summer-soda','breakfast,lunch,tea,dinner'),
('hku-hw-drinks','breakfast,lunch,tea,dinner'),
('hku-hw-daily-soup','lunch,dinner')
) as v(id, meal)
where c.id = v.id;

-- 驗證：HKU 兩個食堂的分類都應該有值
select c.id, c.meal from categories c
where c.id like 'hku-%'
order by c.id
limit 5;
