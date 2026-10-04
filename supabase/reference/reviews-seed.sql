-- 城大搵食指南 CityU Eats — Supabase 評論表設定
--
-- 用法：
--   1. 到 https://supabase.com 免費註冊並建立一個專案
--   2. 左欄 SQL Editor → New query → 貼上整個檔案 → Run
--   3. 左欄 Project Settings → API，抄下 Project URL 同 anon public key
--   4. 填入 app/js/config.js 的 SUPABASE_URL 和 SUPABASE_ANON_KEY
--   5. 重新整理網站——評論即刻全校共享！

create table if not exists reviews (
  id         text primary key default gen_random_uuid()::text,
  dish_id    text not null,
  rating     int  not null check (rating between 1 and 5),
  verdict    text not null check (verdict in ('must', 'ok', 'avoid')),
  nickname   text not null default '匿名同學',
  text       text not null check (char_length(text) <= 600),
  created    timestamptz not null default now()
);

create index if not exists reviews_dish_id_idx on reviews (dish_id);
create index if not exists reviews_created_idx on reviews (created desc);

-- 啟用 Row Level Security，並開放匿名讀寫（anon key 是公開金鑰，
-- 靠 RLS 限制只能做這兩件事；如果日後想加審核，收緊 insert 政策即可）
alter table reviews enable row level security;

drop policy if exists "reviews are public" on reviews;
create policy "reviews are public"
  on reviews
  for select
  to anon, authenticated
  using (true);

drop policy if exists "anyone can post a review" on reviews;
create policy "anyone can post a review"
  on reviews
  for insert
  to anon, authenticated
  with check (
    rating between 1 and 5
    and verdict in ('must', 'ok', 'avoid')
    and char_length(text) <= 600
  );

-- ⚠️ 必執行：Supabase 新專案對 SQL Editor 建立的表不再自動授權給 anon/authenticated 角色，
-- 冇呢段 GRANT 嘅話，REST API 會回 401 "permission denied for table reviews"。
grant usage on schema public to anon, authenticated;
grant select, insert on table public.reviews to anon, authenticated;

-- 注意：為咗令同學免登入都可以留言，呢度冇鎖 update/delete。
-- RLS 預設唔會比 anon update/delete，所以已經夠安全；
-- 唔想俾人洗版嘅話，可以日後加 rate limit 或者轉做要登入。
