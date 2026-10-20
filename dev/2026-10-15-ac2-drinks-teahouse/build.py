# -*- coding: utf-8 -*-
"""
AC2「四季茶坊」飲品同步（2026-10-15）
來源：aigens 官方點餐後端（store 312882 / 212882 共用的飲品分類）
產出：① assets/ac2/th-*.jpg 官方商品照 ② supabase/2026-10-15-ac2-teahouse-drinks.sql
"""
import json, os, re, sys, io, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion/'
DEV = BASE + 'dev/2026-10-15-ac2-drinks-teahouse/'
ASSETS = BASE + 'assets/ac2/'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))

# ── 最終排序（sort 300 起，避開餃餃陣 230–241 / 拾味 250–254 的重疊）────────
# 每項：(官方 zh 或 DB zh, 是否新菜, 新菜的 id slug, en, desc_zh, desc_en)
D_C = ('基本飲品', 'Classic Drinks')
D_P = ('包裝飲品', 'Packaged Drinks')
D_A = ('元氣果咖系列', 'Fruit Coffee Series')
D_L = ('果味檸檬茶系列', 'Fruit Lemon Tea Series')
D_S = ('茉莉香檳系列', 'Jasmine Sparkling Series')
D_T = ('東方茶咖系列', 'Oriental Tea & Coffee Series')

# (官方 zh, 新 id, en, (desc_zh, desc_en))
PLAN = [
    # 美式系列 5（沿用現有 row）
    ('甜橙美式',      None, None, D_A),
    ('白桃美式',      None, None, D_A),
    ('粉荔美式',      None, None, D_A),
    ('富士蘋果美式',   None, None, D_A),
    ('凍美式咖啡',     None, None, D_A),
    # 檸香系列 6 + 保留的芝士荔枝
    ('甜橙梔香檸茶',   None, None, D_L),
    ('白桃梔香檸檬茶', None, None, D_L),
    ('粉荔梔香檸檬茶', None, None, D_L),
    ('芝士荔枝栀香檸檬茶', None, None, D_L),          # DB 原有，不動
    ('富士蘋果栀香檸檬茶', 'ac2-th-apple-gardenia-lemon-tea', 'Fuji Apple Gardenia Lemon Tea', D_L),
    ('梔香檸檬茶',     None, None, D_L),
    ('芭樂茉莉檸檬茶', None, None, D_L),
    # 香檳系列 5
    ('水蜜桃茉莉香檳', None, None, D_S),
    ('百香果茉莉香檳', None, None, D_S),
    ('青提茉莉香檳',   None, None, D_S),
    ('紅葡茉莉香檳',   None, None, D_S),
    ('香水檸檬茉莉香檳', None, None, D_S),
    # 茶拿鐵系列 7 + 保留的抹茶奶茶
    ('梔子奶茶',      None, None, D_T),
    ('抹茶奶茶',      None, None, D_T),                # DB 原有，不動
    ('茉莉奶茶',      'ac2-th-jasmine-milk-tea', 'Jasmine Milk Tea', D_T),
    ('梔子拿鐵',      None, None, D_T),
    ('龍井拿鐵',      None, None, D_T),
    ('茉莉拿鐵',      None, None, D_T),
    ('抹茶茉莉',      None, None, D_T),
    ('抹茶咖啡',      None, None, D_T),
    # 基本飲品 21
    ('紅芭樂梳打',     None, None, ('特飲', 'Special Drink')),
    ('熱咖啡',        'ac2-th-hot-coffee', 'Hot Coffee', D_C),
    ('熱黑咖啡',      'ac2-th-hot-black-coffee', 'Hot Black Coffee', D_C),
    ('熱奶茶',        'ac2-th-hot-milk-tea', 'Hot Milk Tea', D_C),
    ('熱鴛鴦',        'ac2-th-hot-yuanyang', 'Hot Coffee and Tea Mix', D_C),
    ('熱檸檬茶',      'ac2-th-hot-lemon-tea', 'Hot Lemon Tea', D_C),
    ('熱檸檬水',      'ac2-th-hot-lemon-water', 'Hot Lemon Water', D_C),
    ('熱好立克',      'ac2-th-hot-horlicks', 'Hot Horlicks', D_C),
    ('熱阿華田',      'ac2-th-hot-ovaltine', 'Hot Ovaltine', D_C),
    ('凍咖啡',        'ac2-th-iced-coffee', 'Iced Coffee', D_C),
    ('凍黑咖啡',      'ac2-th-iced-black-coffee', 'Iced Black Coffee', D_C),
    ('凍奶茶',        'ac2-th-iced-milk-tea', 'Iced Milk Tea', D_C),
    ('凍鴛鴦',        'ac2-th-iced-yuanyang', 'Iced Coffee and Tea', D_C),
    ('凍檸檬茶',      'ac2-th-iced-lemon-tea', 'Iced Lemon Tea', D_C),
    ('凍檸檬水',      'ac2-th-iced-lemon-water', 'Iced Lemon Water', D_C),
    ('凍好立克',      'ac2-th-iced-horlicks', 'Iced Horlicks', D_C),
    ('凍阿華田',      'ac2-th-iced-ovaltine', 'Iced Ovaltine', D_C),
    ('酸梅湯',        'ac2-th-sour-plum-tea', 'Sour Plum Tea', D_C),
    ('百事',          'ac2-th-pepsi', 'Pepsi', D_C),
    ('輕怡百事',      'ac2-th-pepsi-light', 'Pepsi Light', D_C),
    ('七喜',          'ac2-th-7up', '7up', D_C),
    # 包裝飲品 3
    ('紅牛',          'ac2-th-red-bull', 'Red Bull Energy Drink', D_P),
    ('無糖紅牛',      'ac2-th-red-bull-sugarfree', 'Red Bull Sugarfree', D_P),
    ('富士蘋果紅牛',   'ac2-th-red-bull-apple', 'Red Bull Fuji Apple', D_P),
]


def norm(s):
    if not s:
        return ''
    s = re.sub(r'\s+', '', s)
    return s.replace('栀', '梔').replace('檸檬茶', '檸茶').replace('紅葡萄', '紅葡')


def main():
    off = json.load(open(DEV + 'official_drinks.json', encoding='utf-8'))['official']
    omap = {norm(o['zh']): o for o in off}
    db = [d for d in json.load(open(DEV + 'raw/db_dishes_ac2.json', encoding='utf-8'))
          if d['category'] == '四季茶坊']
    dmap = {norm(d['zh']): d for d in db}

    rows, problems, dl = [], [], []
    for i, (zh, new_id, en, (dz, de)) in enumerate(PLAN):
        sort = 300 + i
        o = omap.get(norm(zh))
        d = dmap.get(norm(zh))
        if d:                                   # 現有 row：保留 id / zh / en / desc
            row = dict(d)
            row['sort'] = sort
            if o:                               # 有官方圖 → 換成官方商品照
                row['photo'] = 'assets/ac2/' + row['id'].replace('ac2-', '') + '.jpg'
                dl.append((o['img'], row['photo']))
            rows.append(row)
            continue
        if not o:
            problems.append(f'找不到官方資料：{zh}')
            continue
        row = {
            'id': new_id, 'canteen_id': 'ac2', 'category': '四季茶坊',
            'zh': zh, 'en': en or o['en'],
            'price': o['price'], 'photo': 'assets/ac2/' + new_id.replace('ac2-', '') + '.jpg',
            'desc_zh': dz, 'desc_en': de, 'tags': [], 'available': True, 'sort': sort,
        }
        rows.append(row)
        dl.append((o['img'], row['photo']))

    # ── 下載圖片 ─────────────────────────────────────────────
    from PIL import Image
    os.makedirs(ASSETS, exist_ok=True)
    ok = fail = 0
    for url, rel in dl:
        dst = BASE + rel
        try:
            b = OPENER.open(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30).read()
            tmp = DEV + '_dl.tmp'
            open(tmp, 'wb').write(b)
            im = Image.open(tmp)
            src_size = im.size
            if im.mode in ('RGBA', 'LA', 'P'):
                bg = Image.new('RGB', im.size, (255, 255, 255))
                im = im.convert('RGBA')
                bg.paste(im, mask=im.split()[-1])
                im = bg
            else:
                im = im.convert('RGB')
            im = im.resize((600, 600), Image.LANCZOS)
            im.save(dst, 'JPEG', quality=84, optimize=True)
            ok += 1
        except Exception as e:
            fail += 1
            problems.append(f'圖片下載失敗 {rel}: {e}')
    print(f'圖片：成功 {ok} / 失敗 {fail}')

    rows.sort(key=lambda r: r['sort'])
    json.dump(rows, open(DEV + 'plan_rows.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # ── 產生 SQL ─────────────────────────────────────────────
    def q(v):
        if v is None:
            return 'null'
        if isinstance(v, bool):
            return 'true' if v else 'false'
        if isinstance(v, (int, float)):
            return str(v)
        return "'" + str(v).replace("'", "''") + "'"

    L = []
    L.append('-- 2026-10-15 · AC2「四季茶坊」飲品同步（官方 aigens 點餐後端）')
    L.append('-- 來源 store 312882 / 212882 共用的 6 個飲品分類，共 47 道（另保留 2 道官方已無的舊菜）')
    L.append('-- 可重複執行（on conflict do update）。分類「四季茶坊」不變。')
    L.append('')
    L.append('-- ① 現有 24 道：更新 sort（改為 300 起、依系列排序）＋ 換成官方商品照')
    for r in rows:
        if r['id'] in {d['id'] for d in db}:
            L.append(f"update dishes set sort = {r['sort']}, photo = {q(r['photo'])} where id = {q(r['id'])};")
    L.append('')
    L.append('-- ② 新增 25 道官方飲品')
    cols = ['id', 'canteen_id', 'category', 'zh', 'en', 'price', 'photo',
            'desc_zh', 'desc_en', 'tags', 'available', 'sort']
    new = [r for r in rows if r['id'] not in {d['id'] for d in db}]
    L.append(f"insert into dishes ({', '.join(cols)}) values")
    vals = []
    for r in new:
        # tags 是 text[]，空陣列要寫 '{}' 而不是 '[]'
        cells = ["'{}'" if c == 'tags' else q(r.get(c)) for c in cols]
        vals.append('  (' + ', '.join(cells) + ')')
    L.append(',\n'.join(vals))
    L.append('on conflict (id) do update set')
    L.append('  canteen_id = excluded.canteen_id, category = excluded.category,')
    L.append('  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,')
    L.append('  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en,')
    L.append('  available = excluded.available, sort = excluded.sort;')
    L.append('')
    sql = '\n'.join(L) + '\n'
    os.makedirs(BASE + 'supabase', exist_ok=True)
    open(BASE + 'supabase/2026-10-15-ac2-teahouse-drinks.sql', 'w', encoding='utf-8').write(sql)

    print(f'最終 {len(rows)} 道（新增 {len(new)}、更新 {len(rows)-len(new)}）')
    for r in rows:
        print(f"  {r['sort']}  {r['id']!r:44} {r['zh']!r:22} ${r['price']:<6} {r['desc_zh']}")
    if problems:
        print('\n⚠️ 問題：')
        for p in problems:
            print('  ', p)


if __name__ == '__main__':
    main()
