# -*- coding: utf-8 -*-
"""5380 Cafe 補圖（並行版）—— 只補 photo-map 未有的；Openverse CC0／PDM。

序列版每張要 15–20 秒（3–4 MB 原圖 + 逾時重試），56 張太慢，
這裡用 4 個執行緒同時跑，seed 已完成的直接跳過。
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
OUTDIR = os.path.join(REPO, 'assets', '5380')
MAP = os.path.join(HERE, 'photo-map-5380.json')
# Wikimedia 會 429 掉「假裝瀏覽器」的 UA，要用帶聯絡方式的自訂 UA
UA = 'EatyMenuBot/1.0 (https://eaty.pages.dev; student project) Python-urllib'
MAX_SIDE, QUALITY = 600, 82
API = 'https://api.openverse.org/v1/images/'


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def search(q):
    url = API + '?' + urllib.parse.urlencode({
        'q': q, 'license': 'cc0,pdm', 'page_size': '12',
        'mature': 'false', 'filter_dead': 'true',
    })
    try:
        return json.loads(get(url).decode('utf-8')).get('results') or []
    except Exception as e:
        print('  search fail %s: %s' % (q, e), file=sys.stderr)
        return []


def thumb_url(url, width=800):
    """Wikimedia 原圖動輒 3–4 MB，換成 thumb 版（~80 KB）快十倍。
    https://upload.wikimedia.org/wikipedia/commons/a/a5/X.jpg
      → https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/X.jpg/800px-X.jpg"""
    if 'upload.wikimedia.org' not in url or '/thumb/' in url:
        return url
    try:
        head, name = url.rsplit('/', 1)
        prefix, rest = head.split('/wikipedia/commons/', 1)
        if not rest:
            return url
        return '%s/wikipedia/commons/thumb/%s/%s/%dpx-%s' % (prefix, rest, name, width, name)
    except ValueError:
        return url


def work(item):
    did, kw, fn = item
    cands = []
    for it in search(kw):
        u = it.get('url') or ''
        if not u.lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png')):
            continue
        if (it.get('width') or 0) < 500 or (it.get('height') or 0) < 350:
            continue
        cands.append(it)
    cands.sort(key=lambda it: 0 if 'upload.wikimedia.org' in (it.get('url') or '') else 1)
    for it in cands[:3]:
        try:
            try:
                raw = get(thumb_url(it['url']))
            except Exception:
                raw = get(it['url'])
            if len(raw) < 8000:
                continue
            im = Image.open(BytesIO(raw)).convert('RGB')
            w, h = im.size
            if max(w, h) > MAX_SIDE:
                if w >= h:
                    im = im.resize((MAX_SIDE, max(1, round(h * MAX_SIDE / w))), Image.LANCZOS)
                else:
                    im = im.resize((max(1, round(w * MAX_SIDE / h)), MAX_SIDE), Image.LANCZOS)
            dst = os.path.join(OUTDIR, fn)
            im.save(dst, 'JPEG', quality=QUALITY, optimize=True)
            return did, {
                'file': 'assets/5380/' + fn, 'keyword': kw,
                'title': (it.get('title') or '')[:90], 'creator': it.get('creator') or '',
                'license': it.get('license'), 'source': it.get('source'),
                'page': it.get('foreign_landing_url') or it.get('detail_url'),
                'px': im.size, 'bytes': os.path.getsize(dst),
            }
        except Exception as e:
            print('  dl fail %s (%s): %s' % (did, (it.get('url') or '')[:40], e), file=sys.stderr)
            continue
    return did, None


def main():
    data = json.load(open(os.path.join(HERE, 'dishes.json'), encoding='utf-8'))
    items = [('canteen', 'doner kebab shop', 'canteen.jpg')]
    for d in data['dishes']:
        items.append((d['id'], d['photo_keyword'], d['photo'].split('/')[-1]))
    result = json.load(open(MAP, encoding='utf-8')) if os.path.exists(MAP) else {}
    todo = [x for x in items if x[0] not in result or not os.path.exists(os.path.join(OUTDIR, x[2]))]
    print('待補 %d 張（已有 %d）' % (len(todo), len(items) - len(todo)))
    os.makedirs(OUTDIR, exist_ok=True)
    fails = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(work, it): it for it in todo}
        for idx, f in enumerate(as_completed(futs), 1):
            it = futs[f]
            try:
                did, info = f.result()
            except Exception as e:
                print('  !! %s 例外：%s' % (it[0], e), file=sys.stderr)
                fails.append(it[0])
                continue
            if info:
                result[did] = info
                print('  %2d) ok %-34s %-28s %s' % (idx, did, info['keyword'], '%dx%d' % info['px']))
            else:
                fails.append(did)
                print('  !! %s 失敗' % did, file=sys.stderr)
            json.dump(result, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    json.dump(result, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('\n共 %d／%d，失敗 %d：%s' % (len(result), len(items), len(fails), fails))


if __name__ == '__main__':
    main()
