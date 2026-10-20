# -*- coding: utf-8 -*-
"""
AC2「四季茶坊」飲品 · 官方點餐站重新同步（2026-10-20）

來源：aigens 後端（csd.order.place 背後的 API）
  https://api.aigens.com/api/v1/menu/store/312882.json?menu=kiosk
  對應店面：https://csd.order.place/order/store/312882/mode/dinein

做四件事：
  ① 從飲品分類抽出所有獨立飲品（排除 +$4 加配升級項與 $0 轉茶選項）
  ② 重新下載全部官方商品照 → assets/ac2/th-*.jpg（600×600）
  ③ 對照線上 dishes 表，算出「要更新 / 要新增 / 要下架」三份清單
  ④ 產生可重複執行的 SQL → supabase/2026-10-20-ac2-teahouse-resync.sql
"""
import json, os, re, sys, io, hashlib, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/eaty/'
DEV = BASE + 'dev/2026-10-20-ac2-teahouse-resync/'
ASSETS = BASE + 'assets/ac2/'
RAW = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/work/raw/'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))

# 只收「真正獨立販售」的飲品分類。
# 排除：Xibei/Dumpling/+Drinks（$4 加配升級項）、Tea（$0 轉茶選項）、Sweet Soup（糖水糕點，屬開味小店）
GROUPS = [
    ('Fruity Iced Americano Series',          '元氣果咖系列', 'Fruit Coffee Series'),
    ('Fruity Iced Lemon Tea',                 '果味檸檬茶系列', 'Fruit Lemon Tea Series'),
    ('Fruity Iced Sparkling Jasmine Green Tea', '茉莉香檳系列', 'Jasmine Sparkling Series'),
    ('Taste The Oriental Tea',                '東方茶咖系列', 'Oriental Tea & Coffee Series'),
    ('Beverage',                              '基本飲品',    'Classic Drinks'),
    ('Can Coke',                              '包裝飲品',    'Packaged Drinks'),
]

# 官方名 ↔ 線上 DB 名（只在寫法不同時才需要）
ALIAS = {
    '甜橙梔香檸茶':  '甜橙栀香檸檬茶',
    '紅葡茉莉香檳':  '紅葡萄茉莉香檳',
}
# 只修字，不改詞：簡體「栀」→ 繁體「梔」
FIX = [('栀', '梔'), ('駌', '鴛')]


def norm(s):
    s = re.sub(r'\s+', '', s or '')
    for a, b in FIX:
        s = s.replace(a, b)
    return s.replace('檸檬茶', '檸茶').replace('紅葡萄', '紅葡')


def tidy(s):
    for a, b in FIX:
        s = s.replace(a, b)
    return s


def main():
    os.makedirs(DEV, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)

    # ── ① 抽官方飲品 ─────────────────────────────────────────
    menu = json.load(open(RAW + 'menu_312882.json', encoding='utf-8'))['data']
    official = []
    for gname, zh_series, en_series in GROUPS:
        grp = next((g for g in menu['menu']['groups'] if g['name'] == gname), None)
        if not grp:
            print('⚠️ 找不到分類', gname)
            continue
        for it in (grp.get('items') or []):
            im = (it.get('images') or {}).get('default') or {}
            official.append({
                'group': gname, 'series_zh': zh_series, 'series_en': en_series,
                'zh': (it.get('printName') or it.get('name') or '').strip(),
                'en': (it.get('name') or '').strip(),
                'price': it.get('price'),
                'img': im.get('source') or im.get('url'),
                'aigens_id': it['id'],
            })
    # 官方菜單本身的錯字／同系列寫法不一致 → 站內統一（只改字面，不改品項、不改價錢）
    ZH_FIX = {'甜橙梔香檸茶': '甜橙梔香檸檬茶', '紅葡茉莉香檳': '紅葡萄茉莉香檳'}
    EN_FIX = {'Iced Hot Black Coffe': 'Iced Black Coffee',
              'red guava soda': 'Red Guava Soda',
              '7up': '7-Up',
              'Longjine Tea Latte': 'Longjing Tea Latte'}
    for o in official:
        o['raw_zh'], o['raw_en'] = o['zh'], o['en']
        o['zh'] = ZH_FIX.get(o['zh'], o['zh'])
        o['en'] = EN_FIX.get(o['en'], o['en'])

    print(f'官方獨立飲品：{len(official)} 道')
    json.dump({'store': 312882, 'source': 'api.aigens.com menu=kiosk', 'official': official},
              open(DEV + 'official_drinks.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    # ── ② 對照線上 DB ────────────────────────────────────────
    live = [d for d in json.load(open('C:/Users/1/WorkBuddy/2026-10-20-15-31-29/ac2_live.json',
                                      encoding='utf-8')) if d['category'] == '四季茶坊']
    dmap = {norm(d['zh']): d for d in live}

    plan = []
    for i, o in enumerate(official):
        key = norm(ALIAS.get(o['zh'], o['zh']))
        d = dmap.get(key)
        row = {'sort': 300 + i, 'official': o, 'db': d}
        if d:
            row.update(id=d['id'], action='update',
                       photo='assets/ac2/' + d['id'].replace('ac2-', '') + '.jpg')
        else:
            slug = 'ac2-th-' + re.sub(r'[^a-z0-9]+', '-', o['en'].lower()).strip('-')
            row.update(id=slug, action='insert', photo='assets/ac2/' + slug.replace('ac2-', '') + '.jpg')
        plan.append(row)

    matched = {p['id'] for p in plan}
    retired = [d for d in live if d['id'] not in matched]
    print(f'對上現有 {sum(1 for p in plan if p["action"] == "update")} 道；'
          f'需新增 {sum(1 for p in plan if p["action"] == "insert")} 道；'
          f'官方已無 {len(retired)} 道 → 下架')

    # ── ③ 下載官方商品照 ─────────────────────────────────────
    from PIL import Image
    ok = fail = 0
    seen = {}
    for p in plan:
        dst = BASE + p['photo']
        try:
            b = OPENER.open(urllib.request.Request(p['official']['img'],
                                                   headers={'User-Agent': UA}), timeout=30).read()
            seen.setdefault(hashlib.md5(b).hexdigest(), []).append(p['official']['zh'])
            tmp = DEV + '_dl.tmp'
            open(tmp, 'wb').write(b)
            im = Image.open(tmp)
            if im.mode in ('RGBA', 'LA', 'P'):
                bg = Image.new('RGB', im.size, (255, 255, 255))
                im2 = im.convert('RGBA')
                bg.paste(im2, mask=im2.split()[-1])
                im = bg
            else:
                im = im.convert('RGB')
            im.resize((600, 600), Image.LANCZOS).save(dst, 'JPEG', quality=84, optimize=True)
            ok += 1
        except Exception as e:
            fail += 1
            print('  ⚠️ 圖片失敗', p['official']['zh'], e)
    print(f'圖片：成功 {ok} / 失敗 {fail}（{len(seen)} 張不同原圖）')
    for h, names in seen.items():
        if len(names) > 1:
            print('  ℹ️ 官方本身重用同一張圖：', '、'.join(names))

    # ── ④ 產生 SQL ───────────────────────────────────────────
    def q(v):
        if v is None:
            return 'null'
        if isinstance(v, bool):
            return 'true' if v else 'false'
        if isinstance(v, (int, float)):
            return str(v)
        return "'" + str(v).replace("'", "''") + "'"

    L = []
    L.append('-- 2026-10-20 · AC2「四季茶坊」飲品 · 官方點餐站重新同步')
    L.append('-- 來源：https://csd.order.place/order/store/312882/mode/dinein')
    L.append('--       api.aigens.com / store 312882 / menu=kiosk（47 道獨立飲品）')
    L.append('-- 內容：官方名校正、價格校正、47 張官方商品照、2 道官方已下架、1 道舊種子重複飲品下架')
    L.append('-- 可重複執行（update / on conflict do update）。')
    L.append('')

    L.append('-- ① 47 道官方飲品：名稱／英文／價錢／商品照／排序 全部對齊官方')
    for p in plan:
        o = p['official']
        sets = [
            f"zh = {q(tidy(o['zh']))}",
            f"en = {q(o['en'])}",
            f"price = {q(o['price'])}",
            f"photo = {q(p['photo'])}",
            f"sort = {p['sort']}",
            'available = true',
        ]
        L.append(f"update dishes set {', '.join(sets)} where id = {q(p['id'])};")

    ins = [p for p in plan if p['action'] == 'insert']
    if ins:
        L.append('')
        L.append(f'-- ② 新增 {len(ins)} 道官方飲品')
        cols = ['id', 'canteen_id', 'category', 'zh', 'en', 'price', 'photo',
                'desc_zh', 'desc_en', 'tags', 'available', 'sort']
        L.append(f"insert into dishes ({', '.join(cols)}) values")
        vals = []
        for p in ins:
            o = p['official']
            rec = {'id': p['id'], 'canteen_id': 'ac2', 'category': '四季茶坊',
                   'zh': tidy(o['zh']), 'en': o['en'], 'price': o['price'],
                   'photo': p['photo'], 'desc_zh': o['series_zh'], 'desc_en': o['series_en'],
                   'tags': '{}', 'available': True, 'sort': p['sort']}
            vals.append('  (' + ', '.join('{}' if c == 'tags' else q(rec[c]) for c in cols) + ')')
        L.append(',\n'.join(vals))
        L.append('on conflict (id) do update set')
        L.append('  zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo,')
        L.append('  desc_zh = excluded.desc_zh, desc_en = excluded.desc_en,')
        L.append('  available = excluded.available, sort = excluded.sort;')

    L.append('')
    L.append('-- ③ 官方菜單上已無此項 → 下架（保留 row，舊評論不會孤兒）')
    for d in retired:
        L.append(f"-- {d['zh']}（官方已下架）")
        L.append(f"update dishes set available = false where id = {q(d['id'])};")

    L.append('')
    L.append('-- ④ AC2 其他飲品一律歸四季茶坊：舊種子「飲品甜品」裡的凍檸檬茶（$9，與官方 $7.5 重複）下架')
    L.append("update dishes set available = false where id = 'ac2-milk-tea';")

    L.append('')
    L.append('-- ⑤ 四季茶坊分類補上官方點餐入口（飲品都在 store 312882）')
    L.append("update categories set order_url = 'https://csd.order.place/order/store/312882/mode/dinein' "
             "where id = '四季茶坊';")

    sql = '\n'.join(L) + '\n'
    open(BASE + 'supabase/2026-10-20-ac2-teahouse-resync.sql', 'w', encoding='utf-8').write(sql)

    json.dump([{'sort': p['sort'], 'id': p['id'], 'zh': tidy(p['official']['zh']),
                'en': p['official']['en'], 'price': p['official']['price'],
                'photo': p['photo'], 'action': p['action']} for p in plan],
              open(DEV + 'plan_rows.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    print(f'\nSQL 已寫入 supabase/2026-10-20-ac2-teahouse-resync.sql（{len(sql.splitlines())} 行）')
    for p in plan:
        print(f"  {p['sort']}  {p['id']:42} {tidy(p['official']['zh']):12} ${p['official']['price']:<6} {p['action']}")
    print('  下架：', '、'.join(d['zh'] for d in retired))


if __name__ == '__main__':
    main()
