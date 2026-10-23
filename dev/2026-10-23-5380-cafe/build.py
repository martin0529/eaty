# -*- coding: utf-8 -*-
"""5380 Cafe（Ebeneezer's Kebabs & Pizzeria @ CityU 康樂樓 5 樓 R5013）
菜單轉錄 + SQL 產生器（2026-10-23）

資料來源：使用者提供的現場菜牌照片（WhatsApp Image 2026-10-23 at 10.22.43.jpeg）。
輸出：
  supabase/2026-10-23-5380-cafe.sql   ← 貼進 Supabase SQL Editor 執行（可重複跑）
  dev/2026-10-23-5380-cafe/dishes.json ← 給補圖腳本與驗證用

用法：python build.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))

# ── 分類（categories 表沒有 canteen_id，靠 dishes.category 對應）──────
# sort 用 82–89：55 已被兩個檔口用、60–81 被 AC3 用、101+ 是內建後備。
CATEGORIES = [
    ('卡巴',     'Kebab',        'lunch,dinner'),
    ('印式炒飯', 'Biryani',      'lunch,dinner'),
    ('咖喱配飯', 'Curry & Rice', 'lunch,dinner'),
    ('沙律',     'Salad',        'lunch,dinner'),
    ('薄餅',     'Pizza',        'lunch,dinner'),
    ('嗜肉者',   'Meat Lovers',  'lunch,dinner'),
    ('小食（5380）', 'Side Orders', 'lunch,dinner'),
    ('飲品（5380）', 'Drinks',      'lunch,dinner'),
]

COMBO_ZH = '可升級 Combo：汽水 +$7／熱茶 +$8／咖喱角 +$10／春卷 +$11／雜菜疏豆 +$14'
COMBO_EN = 'Upgrade to Combo: soft drink +$7 / tea +$8 / samosa +$10 / spring roll +$11 / falafel +$14'

# (slug, 中文, 英文, 價錢, 分類, tags, available, descZh, descEn)
DISHES = [
    # ── 卡巴 Kebabs ──
    ('donar-lamb-kebab', '羊肉卡巴', 'Donar Lamb Kebab', 47.70, '卡巴', ['signature'], True, COMBO_ZH, COMBO_EN),
    ('gyros-chicken-kebab', '雞肉卡巴', 'Gyros Chicken Kebab', 45.60, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-tikka-kebab', '串燒雞肉卡巴', 'Chicken Tikka Kebab', 45.60, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('falafel-kebab', '雜菜疏豆卡巴', 'Falafel (Veg.) Kebab', 42.50, '卡巴', ['value'], True, COMBO_ZH + '｜素食', COMBO_EN + ' · Vegetarian'),
    ('meatball-kebab', '印式肉丸卡巴', 'Meatball Kebab', 43.60, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('real-beef-kebab', '牛肉卡巴', 'Real Beef Kebab', 49.80, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-bites-kebab', '炸雞肉球卡巴', 'Chicken Bites Kebab', 47.00, '卡巴', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),
    ('fish-kebab', '魚肉卡巴', 'Fish Kebab', 45.60, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-shish-kebab', '烤雞肉串卡巴', 'Chicken Shish Kebab', 44.00, '卡巴', [], True, COMBO_ZH, COMBO_EN),
    ('halloumi-cheese-kebab', '哈囉米芝士卡巴', 'Halloumi Cheese Kebab', 42.00, '卡巴', [], True, COMBO_ZH, COMBO_EN),

    # ── 印式炒飯 Biryanis ──
    ('vegetable-biryani', '咖喱雜菜炒飯', 'Vegetable Biryani', 39.50, '印式炒飯', ['value'], True, COMBO_ZH + '｜素食', COMBO_EN + ' · Vegetarian'),
    ('chicken-biryani', '咖喱雞肉炒飯', 'Chicken Biryani', 44.00, '印式炒飯', [], True, COMBO_ZH, COMBO_EN),
    ('fish-biryani', '咖喱魚肉炒飯', 'Fish Biryani', 39.50, '印式炒飯', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-tikka-biryani', '咖喱串燒雞肉炒飯', 'Chicken Tikka Biryani', 47.00, '印式炒飯', [], True, COMBO_ZH, COMBO_EN),
    ('meatball-biryani', '咖喱肉丸炒飯', 'Meatball Biryani', 48.00, '印式炒飯', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-bites-biryani', '咖喱炸雞肉球炒飯', 'Chicken Bites Biryani', 48.00, '印式炒飯', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),

    # ── 咖喱配飯 Curries ──
    ('vegetable-curry-rice', '咖喱雜菜配飯', 'Vegetable Curry w/ Rice', 38.40, '咖喱配飯', ['value'], True, COMBO_ZH + '｜素食', COMBO_EN + ' · Vegetarian'),
    ('chicken-curry-rice', '咖喱雞肉配飯', 'Chicken Curry w/ Rice', 39.40, '咖喱配飯', ['value'], True, COMBO_ZH, COMBO_EN),
    ('fish-curry-rice', '咖喱魚肉配飯', 'Fish Curry w/ Rice', 39.40, '咖喱配飯', ['value'], True, COMBO_ZH, COMBO_EN),
    ('meatball-curry-rice', '咖喱肉丸配飯', 'Meatball Curry w/ Rice', 42.50, '咖喱配飯', [], True, COMBO_ZH, COMBO_EN),
    ('chana-masala-rice', '香濃咖喱美國豆配飯', 'Chana Masala w/ Rice', 41.00, '咖喱配飯', [], True, COMBO_ZH + '｜素食（鷹嘴豆）', COMBO_EN + ' · Vegetarian (chickpea)'),
    ('dal-makhani-rice', '特式乳香咖喱扁豆配飯', 'Dal Makhani w/ Rice', 41.00, '咖喱配飯', [], True, COMBO_ZH + '｜素食（扁豆）', COMBO_EN + ' · Vegetarian (lentil)'),
    ('chicken-bites-curry-rice', '咖喱炸雞肉球配飯', 'Chicken Bites Curry w/ Rice', 45.00, '咖喱配飯', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),

    # ── 沙律 Salads ──
    ('garden-salad', '田園沙律', 'Garden Salad', 27.50, '沙律', ['value'], True, COMBO_ZH + '｜素食', COMBO_EN + ' · Vegetarian'),
    ('roast-chicken-salad', '燒雞肉沙律', 'Roast Chicken Salad', 39.40, '沙律', [], True, COMBO_ZH, COMBO_EN),
    ('roast-lamb-salad', '燒羊肉沙律', 'Roast Lamb Salad', 47.70, '沙律', [], True, COMBO_ZH, COMBO_EN),
    ('chicken-tikka-salad', '串燒雞肉沙律', 'Chicken Tikka Salad', 41.50, '沙律', [], True, COMBO_ZH, COMBO_EN),
    ('real-beef-salad', '牛肉沙律', 'Real Beef Salad', 49.80, '沙律', [], True, COMBO_ZH, COMBO_EN),
    ('halloumi-cheese-salad', '哈囉米芝士沙律', 'Halloumi Cheese Salad', 42.00, '沙律', [], True, COMBO_ZH, COMBO_EN),

    # ── 薄餅 Pizzas（10 吋）──
    ('pizza-margherita', '經典芝士薄餅', 'Margherita', 71.50, '薄餅', [], True, '10 吋｜素食', '10-inch · Vegetarian'),
    ('pizza-pepperoni', '香辣味牛肉薄餅', 'Pepperoni', 77.00, '薄餅', ['spicy'], True, '10 吋｜辣', '10-inch · Spicy'),
    ('pizza-supreme', '至尊薄餅', 'Supreme', 83.50, '薄餅', [], True, '10 吋', '10-inch'),
    ('pizza-chicken-tikka', '串燒雞肉薄餅', 'Chicken Tikka', 83.50, '薄餅', [], True, '10 吋', '10-inch'),
    ('pizza-vegetarian', '雜菜薄餅', 'Vegetarian', 77.00, '薄餅', [], True, '10 吋｜素食', '10-inch · Vegetarian'),
    ('pizza-hawaiian', '夏威夷薄餅', 'Hawaiian', 77.00, '薄餅', [], True, '10 吋', '10-inch'),
    ('pizza-chicken-express', '燒雞肉薄餅', 'Chicken Express', 83.50, '薄餅', [], True, '10 吋', '10-inch'),
    ('pizza-turkey-ham-mushroom', '火雞火腿蘑菇薄餅', 'Turkey-baked Ham & Mushroom', 77.00, '薄餅', [], True, '10 吋', '10-inch'),

    # ── 嗜肉者 Meat Lovers（價錢＝配飯價；配薯條另計）──
    ('meat-roast-chicken', '燒雞肉', 'Roast Chicken', 39.40, '嗜肉者', ['value'], True, '配飯 $39.40／配薯條 $45.60', 'With rice $39.40 / with chips $45.60'),
    ('meat-roast-lamb', '燒羊肉', 'Roast Lamb', 47.70, '嗜肉者', [], True, '配飯 $47.70／配薯條 $54.00', 'With rice $47.70 / with chips $54.00'),
    ('meat-chicken-tikka', '串燒雞肉', 'Chicken Tikka', 40.40, '嗜肉者', [], True, '配飯 $40.40／配薯條 $45.60', 'With rice $40.40 / with chips $45.60'),
    ('meat-real-beef', '燒牛肉', 'Real Beef', 49.80, '嗜肉者', [], True, '配飯 $49.80／配薯條 $54.50', 'With rice $49.80 / with chips $54.50'),

    # ── 小食 Side Orders ──
    ('chips', '薯條', 'Chips', 30.00, '小食（5380）', [], True, '', ''),
    ('samosas', '咖喱角（兩件）', 'Samosas (2pcs)', 19.20, '小食（5380）', ['value'], True, '素食', 'Vegetarian'),
    ('falafels', '雜菜疏豆（三件）', 'Falafels (3pcs)', 20.70, '小食（5380）', ['value'], True, '素食', 'Vegetarian'),
    ('spring-rolls', '春卷（四件）', 'Spring Rolls (4pcs)', 20.70, '小食（5380）', ['value'], True, '素食', 'Vegetarian'),
    ('hummus-pita', '雞豆蓉配中東包（一件）', 'Hummus & Pita Bread (1pc)', 28.00, '小食（5380）', [], True, '素食', 'Vegetarian'),
    ('gulab-jamun', '酷拉卜甜品（每件）', 'Gulab Jamun (each)', 9.00, '小食（5380）', ['sweet'], True, '素食｜甜品', 'Vegetarian · Dessert'),

    # ── 飲品 Beverages ──
    ('soft-drinks', '罐裝汽水', 'Soft Drinks (can)', 8.80, '飲品（5380）', ['value'], True,
     'Pepsi／Pepsi Light／7 Up／7 Up Light／Mirinda Orange／Mountain Dew',
     'Pepsi / Pepsi Light / 7 Up / 7 Up Light / Mirinda Orange / Mountain Dew'),
    ('sirma-vitamin-drinks', '有汽果汁', 'Sirma Vitamin Drinks', 12.40, '飲品（5380）', [], True,
     'Apple／Lemon／Pomegranate／Orange', 'Apple / Lemon / Pomegranate / Orange'),
    ('masala-tea', '印式奶茶', 'Masala Tea', 12.00, '飲品（5380）', ['signature'], True, '熱飲', 'Hot'),
    ('cold-lemon-tea', '支裝檸檬茶', 'Cold Lemon Tea', 13.50, '飲品（5380）', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),
    ('cold-tea', '支裝綠茶', 'Cold Tea', 13.50, '飲品（5380）', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),
    ('mango-milk', '芒果奶', 'Mango Milk', 13.50, '飲品（5380）', ['sweet'], True, '', ''),
    ('coconut-milk', '椰奶', 'Coconut Milk', 13.50, '飲品（5380）', [], False, '菜牌上已貼 SOLD OUT（2026-10-23 現場）', 'Marked SOLD OUT on the board (23 Oct 2026)'),
    ('coconut-water', '椰子水', 'Coconut Water', 13.50, '飲品（5380）', [], True, '', ''),
]

# 圖片搜尋關鍵詞（Openverse CC0／公有領域）
PHOTO_KEYWORD = {
    'donar-lamb-kebab': 'doner kebab',
    'gyros-chicken-kebab': 'chicken gyros wrap',
    'chicken-tikka-kebab': 'chicken tikka kebab',
    'falafel-kebab': 'falafel wrap',
    'meatball-kebab': 'kofta kebab',
    'real-beef-kebab': 'beef kebab',
    'chicken-bites-kebab': 'fried chicken bites',
    'fish-kebab': 'fish kebab grilled',
    'chicken-shish-kebab': 'chicken shish kebab skewer',
    'halloumi-cheese-kebab': 'halloumi grilled cheese',
    'vegetable-biryani': 'vegetable biryani',
    'chicken-biryani': 'chicken biryani',
    'fish-biryani': 'fish biryani',
    'chicken-tikka-biryani': 'chicken biryani rice',
    'meatball-biryani': 'biryani rice',
    'chicken-bites-biryani': 'biryani rice dish',
    'vegetable-curry-rice': 'vegetable curry rice',
    'chicken-curry-rice': 'chicken curry rice',
    'fish-curry-rice': 'fish curry',
    'meatball-curry-rice': 'meatball curry',
    'chana-masala-rice': 'chana masala',
    'dal-makhani-rice': 'dal makhani',
    'chicken-bites-curry-rice': 'chicken curry',
    'garden-salad': 'garden salad bowl',
    'roast-chicken-salad': 'grilled chicken salad',
    'roast-lamb-salad': 'lamb salad',
    'chicken-tikka-salad': 'chicken salad bowl',
    'real-beef-salad': 'beef salad',
    'halloumi-cheese-salad': 'halloumi salad',
    'pizza-margherita': 'margherita pizza',
    'pizza-pepperoni': 'pepperoni pizza',
    'pizza-supreme': 'supreme pizza',
    'pizza-chicken-tikka': 'chicken pizza',
    'pizza-vegetarian': 'vegetarian pizza',
    'pizza-hawaiian': 'hawaiian pizza',
    'pizza-chicken-express': 'barbecue chicken pizza',
    'pizza-turkey-ham-mushroom': 'ham mushroom pizza',
    'meat-roast-chicken': 'roast chicken rice',
    'meat-roast-lamb': 'roast lamb',
    'meat-chicken-tikka': 'chicken tikka',
    'meat-real-beef': 'roast beef plate',
    'chips': 'french fries',
    'samosas': 'samosa',
    'falafels': 'falafel',
    'spring-rolls': 'spring rolls',
    'hummus-pita': 'hummus pita bread',
    'gulab-jamun': 'gulab jamun',
    'soft-drinks': 'soda can drink',
    'sirma-vitamin-drinks': 'fruit soda bottle',
    'masala-tea': 'masala chai tea',
    'cold-lemon-tea': 'iced lemon tea',
    'cold-tea': 'iced green tea bottle',
    'mango-milk': 'mango smoothie drink',
    'coconut-milk': 'coconut milk drink',
    'coconut-water': 'coconut water drink',
}

CANTEEN = {
    'id': '5380',
    'sort': 5,
    'zh': '5380 Cafe',
    'en': '5380 Cafe',
    'bldg_zh': '康樂樓 5 樓 R5013',
    'bldg_en': '5/F, Amenities Building, R5013',
    'hours_zh': '週一至六 10:00–19:30（週日及公眾假期休息）',
    'hours_en': 'Mon–Sat 10:00–19:30 (Sun & PH closed)',
    'fact_zh': '中東菜（Ebeneezer\'s）・電話 +852 2395-3155・付款：現金／八達通／AlipayHK／支付寶・清真認證（Halal）',
    'fact_en': 'Middle Eastern (Ebeneezer\'s) · Tel +852 2395-3155 · Payment: Cash / Octopus / AlipayHK / Alipay · Halal certified',
    'photo': 'assets/5380/canteen.jpg',
    'order_url': None,
}


def q(s):
    if s is None or s == '':
        return 'null'
    return "'" + str(s).replace("'", "''") + "'"


def arr(tags):
    if not tags:
        return "'{}'"
    return "'{" + ','.join(tags) + "}'"


def build():
    # dish rows + photo path
    rows = []
    for i, (slug, zh, en, price, cat, tags, avail, dzh, den) in enumerate(DISHES):
        rows.append({
            'id': '5380-' + slug,
            'canteen_id': '5380',
            'category': cat,
            'zh': zh,
            'en': en,
            'price': price,
            'photo': 'assets/5380/%s.jpg' % slug,
            'desc_zh': dzh,
            'desc_en': den,
            'tags': tags,
            'available': avail,
            'sort': 501 + i,
            'photo_keyword': PHOTO_KEYWORD[slug],
        })

    os.makedirs(os.path.join(HERE), exist_ok=True)
    with open(os.path.join(HERE, 'dishes.json'), 'w', encoding='utf-8') as f:
        json.dump({'canteen': CANTEEN, 'categories': CATEGORIES, 'dishes': rows},
                  f, ensure_ascii=False, indent=2)

    L = []
    L.append('-- ═══════════════════════════════════════════════════════════')
    L.append('-- Eaty · 新增第 5 間食堂「5380 Cafe」（Ebeneezer\'s Kebabs & Pizzeria）')
    L.append('-- 2026-10-23｜來源：使用者提供的現場菜牌照片（WhatsApp 2026-10-23 10:22）')
    L.append('--')
    L.append('-- 位置：香港城市大學 康樂樓 5 樓 R5013（與 AC1 城大食坊同一幢樓，不同舖位）')
    L.append('-- 電話 +852 2395-3155｜週一至六 10:00–19:30｜清真認證｜無官方網上點餐')
    L.append('--')
    L.append('-- 內容：8 個分類／%d 道菜（%d 道上架、%d 道菜牌已貼 SOLD OUT → available=false）'
             % (len(rows), sum(1 for r in rows if r['available']), sum(1 for r in rows if not r['available'])))
    L.append('-- 可重複執行（全部 on conflict do update）')
    L.append('-- ═══════════════════════════════════════════════════════════')
    L.append('')
    L.append('-- ── ① 食堂本體 ─────────────────────────────────────────')
    c = CANTEEN
    L.append("insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values")
    L.append("  (%s, %d, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
             % (q(c['id']), c['sort'], q(c['zh']), q(c['en']), q(c['bldg_zh']), q(c['bldg_en']),
                q(c['hours_zh']), q(c['hours_en']), q(c['fact_zh']), q(c['fact_en']), q(c['photo']), q(c['order_url'])))
    L.append("on conflict (id) do update set")
    L.append("  sort = excluded.sort, zh = excluded.zh, en = excluded.en,")
    L.append("  bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en,")
    L.append("  hours_zh = excluded.hours_zh, hours_en = excluded.hours_en,")
    L.append("  fact_zh = excluded.fact_zh, fact_en = excluded.fact_en,")
    L.append("  photo = excluded.photo, order_url = excluded.order_url;")
    L.append('')
    L.append('-- ── ② 八個分類 ─────────────────────────────────────────')
    L.append("insert into categories (id, sort, zh, en, meal, order_url) values")
    vals = []
    for i, (cid, en, meal) in enumerate(CATEGORIES):
        vals.append('  (%s, %d, %s, %s, %s, null)' % (q(cid), 82 + i, q(cid), q(en), q(meal)))
    L.append(',\n'.join(vals))
    L.append("on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, meal = excluded.meal;")
    L.append('')
    L.append('-- ── ③ 菜品 ─────────────────────────────────────────────')
    L.append("insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values")
    vals = []
    for r in rows:
        vals.append('  (%s, %s, %s, %s, %s, %.2f, %s, %s, %s, %s, %s, %d)' % (
            q(r['id']), q(r['canteen_id']), q(r['category']), q(r['zh']), q(r['en']),
            r['price'], q(r['photo']), q(r['desc_zh']), q(r['desc_en']),
            arr(r['tags']), 'true' if r['available'] else 'false', r['sort']))
    L.append(',\n'.join(vals))
    L.append("on conflict (id) do update set")
    L.append("  canteen_id = excluded.canteen_id, category = excluded.category,")
    L.append("  zh = excluded.zh, en = excluded.en, price = excluded.price,")
    L.append("  photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en,")
    L.append("  tags = excluded.tags, available = excluded.available, sort = excluded.sort;")
    L.append('')
    L.append('-- ── ④ 抽籤黑名單：飲品分類不進「今天吃什麼」────────────')
    L.append("insert into roll_blacklist (kind, value, note)")
    L.append("select 'category', '飲品（5380）', '5380 Cafe 飲品 —— 不是一餐的答案'")
    L.append("where not exists (")
    L.append("  select 1 from roll_blacklist where kind = 'category' and value = '飲品（5380）'")
    L.append(");")
    L.append('')
    L.append('-- ── ⑤ 驗證（跑完看這兩個數字）─────────────────────────')
    L.append("-- select count(*) filter (where available) as on_sale, count(*) as total from dishes where canteen_id = '5380';")
    L.append("-- select category, count(*) from dishes where canteen_id = '5380' group by 1 order by min(sort);")

    sql = '\n'.join(L) + '\n'
    out = os.path.join(REPO, 'supabase', '2026-10-23-5380-cafe.sql')
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write(sql)
    print('SQL →', out, len(sql), 'chars')
    print('DISHES', len(rows), 'on sale', sum(1 for r in rows if r['available']))


if __name__ == '__main__':
    build()
