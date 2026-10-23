# -*- coding: utf-8 -*-
"""5380 Cafe 補圖：Openverse API（只取 CC0 / 公有領域，免署名）

用法：
  python fetch_photos.py --dry          只列清單
  python fetch_photos.py                下載 → assets/5380/<slug>.jpg（600px 長邊）
  python fetch_photos.py --only chips   只補某一張
輸出 photo-map-5380.json（含授權、來源頁、px 尺寸）
"""
import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from io import BytesIO

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
OUTDIR = os.path.join(REPO, 'assets', '5380')
# ⚠️ Wikimedia（Openverse 大部分 CC0 圖的來源）會 429 掉「假裝成瀏覽器」的 UA，
#    要用帶聯絡方式的自訂 UA（2026-10-23 實測：瀏覽器 UA → 429；這個 → 200）。
UA = 'EatyMenuBot/1.0 (https://eaty.pages.dev; student project) Python-urllib'
MAX_SIDE, QUALITY = 600, 82
API = 'https://api.openverse.org/v1/images/'


def get(url, tries=3, timeout=45):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            print('    retry %d: %s' % (i + 1, e), file=sys.stderr)
            time.sleep(1.5 * (i + 1))
    return None


def search(q, page_size=20):
    url = API + '?' + urllib.parse.urlencode({
        'q': q, 'license': 'cc0,pdm', 'page_size': page_size,
        'mature': 'false', 'filter_dead': 'true',
    })
    raw = get(url)
    if not raw:
        return []
    try:
        return json.loads(raw.decode('utf-8')).get('results') or []
    except Exception as e:
        print('    !! 解析失敗 %s: %s' % (q, e), file=sys.stderr)
        return []


USED = set()


def candidates(q):
    """回傳可用的候選（先 Wikimedia，再其他）。
    實測 2026-10-23：flickr（live.staticflickr.com）用任何 UA 都回 403，
    upload.wikimedia.org 正常，所以 Wikimedia 排前面、其餘當後備。"""
    items = []
    for it in search(q):
        u = it.get('url') or ''
        if not u.lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png')):
            continue
        if it.get('width', 0) < 500 or it.get('height', 0) < 350:
            continue
        if u in USED:
            continue
        items.append(it)
    items.sort(key=lambda it: 0 if 'upload.wikimedia.org' in (it.get('url') or '') else 1)
    return items


def fetch_one(q):
    """逐個候選試下載，成功即回傳 (info, raw)。"""
    for it in candidates(q)[:4]:
        raw = get(it['url'], tries=1)
        if raw and len(raw) > 20000:
            USED.add(it['url'])
            return it, raw
    return None, None


def save_jpg(raw, path):
    im = Image.open(BytesIO(raw)).convert('RGB')
    w, h = im.size
    if max(w, h) > MAX_SIDE:
        if w >= h:
            im = im.resize((MAX_SIDE, max(1, round(h * MAX_SIDE / w))), Image.LANCZOS)
        else:
            im = im.resize((max(1, round(w * MAX_SIDE / h)), MAX_SIDE), Image.LANCZOS)
    im.save(path, 'JPEG', quality=QUALITY, optimize=True)
    return im.size, os.path.getsize(path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--only')
    a = ap.parse_args()

    data = json.load(open(os.path.join(HERE, 'dishes.json'), encoding='utf-8'))
    items = [('canteen', 'doner kebab shop counter', 'canteen.jpg')]
    for d in data['dishes']:
        items.append((d['id'], d['photo_keyword'], d['photo'].split('/')[-1]))

    if a.only:
        items = [x for x in items if a.only in x[0] or a.only in x[2]]

    os.makedirs(OUTDIR, exist_ok=True)
    out_json = os.path.join(HERE, 'photo-map-5380.json')
    result = json.load(open(out_json, encoding='utf-8')) if os.path.exists(out_json) else {}
    fails = []

    for i, (did, kw, fn) in enumerate(items, 1):
        dst = os.path.join(OUTDIR, fn)
        print('%3d/%d %-34s %-30s' % (i, len(items), did, kw), end=' ')
        if a.dry:
            print('→', fn)
            continue
        if os.path.exists(dst) and did in result:
            print('skip (已有)')
            continue
        it, raw = fetch_one(kw)
        if not raw:
            print('!! 找不到可下載的圖', file=sys.stderr)
            fails.append((did, kw, 'no download'))
            continue
        try:
            size, nbytes = save_jpg(raw, dst)
        except Exception as e:
            print('!! 存檔失敗 %s' % e, file=sys.stderr)
            fails.append((did, kw, 'save'))
            continue
        result[did] = {
            'file': 'assets/5380/' + fn, 'keyword': kw,
            'title': (it.get('title') or '')[:90], 'creator': it.get('creator') or '',
            'license': it.get('license'), 'source': it.get('source'),
            'page': it.get('foreign_landing_url') or it.get('detail_url'),
            'px': size, 'bytes': nbytes,
        }
        json.dump(result, open(out_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print('ok %dx%d %d KB (%s/%s)' % (size[0], size[1], nbytes // 1024,
                                          it.get('source'), it.get('license')))
        time.sleep(0.8)

    print('\n完成 %d／%d，對照表：%s' % (len(result), len(items), out_json))
    if fails:
        print('失敗 %d 張：' % len(fails))
        for f in fails:
            print('  ', f)


if __name__ == '__main__':
    main()
