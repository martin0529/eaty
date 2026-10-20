# -*- coding: utf-8 -*-
"""比對 aigens 官方飲品菜單 vs 資料庫現有「四季茶坊」，輸出同步計劃。"""
import json, re, sys, io, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion/'
RAW = BASE + 'dev/2026-10-15-ac2-drinks-teahouse/raw/aigens_312882.json'

# 官方 6 個飲品分類（兩個檔口共用，內容一致）
BEV_SERIES = [
    ('Fruity Iced Americano Series',                '美式系列'),
    ('Fruity Iced Lemon Tea',                       '檸香系列'),
    ('Fruity Iced Sparkling Jasmine Green Tea',     '香檳系列'),
    ('Taste the Oriental Tea-Espresso Goodness',    '茶拿鐵系列'),
    ('Beverage',                                    '基本飲品'),
    ('Pack Drinks',                                 '包裝飲品'),
]


def norm(s):
    """官方與 DB 的標點／異體字混用 → 正規化後再比。"""
    if not s:
        return ''
    s = s.replace('．', '‧').replace('.', '‧')
    s = re.sub(r'\s+', '', s)
    for a, b in [('栀', '梔'), ('柠', '檸'), ('柠', '檸'), ('红茶', '紅茶')]:
        s = s.replace(a, b)
    s = s.replace('檸檬茶', '檸茶')          # 官方「甜橙梔香檸茶」vs DB「甜橙栀香檸檬茶」
    s = s.replace('紅葡萄', '紅葡')          # 官方「紅葡茉莉香檳」vs DB「紅葡萄茉莉香檳」
    return s


def official_items():
    menu = json.load(open(RAW, encoding='utf-8'))['data']['menu']
    gmap = {g['id']: g for g in menu['groups']}
    out = []
    for c in menu['categories']:
        if c['name'] not in dict(BEV_SERIES):
            continue
        series = dict(BEV_SERIES)[c['name']]
        g = gmap.get((c.get('groupIds') or [None])[0])
        if not g:
            continue
        for it in g.get('items', []):
            img = (it.get('images') or {}).get('default') or {}
            out.append({
                'series': series,
                'series_en': c['name'],
                'zh': it.get('printName') or it.get('backendName'),
                'en': it.get('name'),
                'price': float(it.get('price') or 0),
                'img': img.get('url'),
                'img_w': img.get('width'),
                'periods': c.get('periods'),
                'item_id': it.get('id'),
            })
    return out


def db_items():
    cats = {c['id']: c for c in json.load(open(RAW.replace('aigens_312882.json','db_cats.json'), encoding='utf-8'))}
    dishes = json.load(open(RAW.replace('aigens_312882.json','db_dishes_ac2.json'), encoding='utf-8'))
    return [d for d in dishes if d['category'] == '四季茶坊']


def main():
    off = official_items()
    db = db_items()
    print(f'官方飲品：{len(off)} 道')
    by_series = collections.OrderedDict()
    for o in off:
        by_series.setdefault(o['series'], []).append(o)
    for s, items in by_series.items():
        print(f'  {s}: {len(items)}')
    print(f'\nDB「四季茶坊」：{len(db)} 道')

    omap = {norm(o['zh']): o for o in off}
    dmap = {norm(d['zh']): d for d in db}
    matched = [k for k in dmap if k in omap]
    db_only = [k for k in dmap if k not in omap]
    off_only = [k for k in omap if k not in dmap]

    print(f'\n=== 名稱可對上：{len(matched)} ===')
    for k in matched:
        o, d = omap[k], dmap[k]
        flag = '' if o['price'] == float(d['price']) else f"  ⚠️ 價錢 {d['price']} → {o['price']}"
        print(f"  {d['zh']!r:24} ${d['price']}  [{o['series']}]{flag}")

    print(f'\n=== 只在 DB（官方現已無）：{len(db_only)} ===')
    for k in db_only:
        d = dmap[k]
        print(f"  {d['id']!r:34} {d['zh']!r:24} ${d['price']}")

    print(f'\n=== 只在官方（DB 缺）：{len(off_only)} ===')
    for k in off_only:
        o = omap[k]
        print(f"  [{o['series']}] {o['zh']!r:24} {o['en']!r:34} ${o['price']} img={'Y' if o['img'] else 'N'}")

    json.dump({'official': off}, open(BASE + 'dev/2026-10-15-ac2-drinks-teahouse/official_drinks.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('\n已輸出 official_drinks.json')


if __name__ == '__main__':
    main()
