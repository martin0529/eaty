-- ═══════════════════════════════════════════════════════════════════
-- Eaty v0.6.0 遷移：餐段（早餐／午餐／晚餐）＋「今天吃什麼」抽籤黑名單
--
-- 在 Supabase dashboard → SQL Editor 貼上整份執行即可。
-- 可重複執行：①加欄位用 if not exists、②更新只補「未設定」的分類、
--             ③黑名單用 on conflict do nothing（不會蓋掉你之後自己加的行）。
-- ═══════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────
-- ① 餐段：categories 加一個 meal 欄位
--
-- 值＝逗號分隔的餐段代碼，可用 breakfast / lunch / dinner（大小寫不拘），
-- 亦接受中文別名（早餐／午餐／晚餐）與 all（=三餐都算）。
--
--   早餐           → breakfast
--   午餐晚餐都有    → lunch,dinner
--   早餐、午餐、晚餐 → breakfast,lunch,dinner
--   留空（NULL）    → 不分餐：只在「全部」看得到，早餐／午餐／晚餐都不會出現
--                    （例：其他 → 環保餐盒／餐具，根本不是一餐的菜）
--
-- 未列在下面的分類一律維持 NULL（不分餐），不會被這份腳本動到。
-- ───────────────────────────────────────────────────────────────────

alter table public.categories add column if not exists meal text;

comment on column public.categories.meal is
  '餐段：逗號分隔的 breakfast / lunch / dinner；留空＝不分餐（只在「全部」顯示）';

update public.categories c
set meal = m.meal
from (values
  -- ── 只有早餐 ──────────────────────────────────────────────
  ('中式早點',      'breakfast'),
  ('西多士',        'breakfast'),
  -- ── 三餐通用：飲料、咖啡 ──────────────────────────────────
  ('飲品',          'breakfast,lunch,dinner'),
  ('特色飲品',      'breakfast,lunch,dinner'),
  ('Coffee Lounge', 'breakfast,lunch,dinner'),
  -- AC2／AC3 的通用「飲品甜品」不算早餐：那兩間食堂目前完全沒有早餐資料，
  -- 掛上去只會生出一顆「早餐 = 一杯凍檸茶」的死 tab。
  ('drinks',        'lunch,dinner'),
  -- ── 午市＋晚市（AC1 正餐檔口，07:30–20:00 連續供餐）────────
  ('開學優惠',      'lunch,dinner'),
  ('肉燥拌麵',      'lunch,dinner'),
  ('台式湯麵',      'lunch,dinner'),
  ('酸辣米線',      'lunch,dinner'),
  ('泰惹味精選',    'lunch,dinner'),
  ('泰式湯粉',      'lunch,dinner'),
  ('明爐燒味',      'lunch,dinner'),
  ('燒味推介',      'lunch,dinner'),
  ('燒味精選',      'lunch,dinner'),
  ('城堡炸雞',      'lunch,dinner'),
  ('披薩',          'lunch,dinner'),
  ('特價燒味飯',    'lunch,dinner'),
  ('豬扒包餐',      'lunch,dinner'),
  ('雞髀餐',        'lunch,dinner'),
  ('街頭碗仔羹',    'lunch,dinner'),
  ('單售食品',      'lunch,dinner'),
  ('rice',          'lunch,dinner'),
  ('noodle',        'lunch,dinner'),
  ('asian',         'lunch,dinner'),
  ('snack',         'lunch,dinner'),
  ('japanese',      'lunch,dinner'),
  ('western',       'lunch,dinner')
) as m(id, meal)
-- 只補未設定的；你之後自己改過的值不會被覆蓋。
-- 想整批重設 → 先跑：update public.categories set meal = null;
where c.id = m.id and c.meal is null;


-- ───────────────────────────────────────────────────────────────────
-- ② 抽籤黑名單：roll_blacklist
--
-- 一行 = 一個排除項。網站只讀，你在 Table Editor 加／刪一行即時生效。
--
--   kind = 'category' → value 填 categories.id
--                       （例：飲品 / 特色飲品 / Coffee Lounge / drinks / 其他）
--   kind = 'dish'     → value 填 dishes.id
--                       （例：ac1-pepperoni、ac2-claypot…可在 dishes 表查到）
--
-- 想「臨時不想抽到某道菜」但不想動分類 → 加一行 kind='dish' 即可。
-- ───────────────────────────────────────────────────────────────────

create table if not exists public.roll_blacklist (
  kind       text not null check (kind in ('dish', 'category')),
  value      text not null,
  note       text,
  created_at timestamptz not null default now(),
  primary key (kind, value)
);

comment on table public.roll_blacklist is
  '「今天吃什麼」抽籤黑名單。kind=category 填 categories.id；kind=dish 填 dishes.id。';

alter table public.roll_blacklist enable row level security;

-- 只開 select：前端只讀得到，寫入只能由 dashboard（service role）做，
-- 所以任何人都不可能透過網站把整個抽籤池清空。
drop policy if exists "roll_blacklist is public readable" on public.roll_blacklist;
create policy "roll_blacklist is public readable"
  on public.roll_blacklist for select to anon, authenticated using (true);

-- ⚠️ 必執行：新專案對 SQL Editor 建的表不會自動授權給 anon，
-- 少了這行 REST API 會回 401 permission denied for table roll_blacklist。
grant select on table public.roll_blacklist to anon, authenticated;

-- 預設排除：飲料不是「一餐的答案」，$1 環保餐盒更不是食物。
-- 想恢復全部可抽 → 把這幾行刪掉即可（刪光＝不排除任何東西）。
insert into public.roll_blacklist (kind, value, note) values
  ('category', 'drinks',        '飲品甜品（AC2／AC3）——不是一餐的答案'),
  ('category', '飲品',          'AC1 熱／凍飲料'),
  ('category', '特色飲品',      'AC1 汽泡茶／梳打'),
  ('category', 'Coffee Lounge', 'AC1 咖啡角（29 款咖啡）'),
  ('category', '其他',          '環保餐盒／餐具，非食品')
on conflict (kind, value) do nothing;


-- ───────────────────────────────────────────────────────────────────
-- ③ 驗證
-- ───────────────────────────────────────────────────────────────────

-- 餐段分佈（每個餐段有幾個分類）
select meal, count(*) as 分類數
from public.categories
group by meal
order by meal nulls last;

-- 黑名單現況
select kind, value, note from public.roll_blacklist order by kind, value;
