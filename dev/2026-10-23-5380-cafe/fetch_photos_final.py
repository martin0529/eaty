# -*- coding: utf-8 -*-
"""收尾：序列、慢速（每次請求間隔 3 秒）補最後幾張，並回填對照表。

背景：並行版把 Wikimedia 打到 429（Your bot is making too many requests），
而且上一輪崩潰時有 9 張圖已寫入磁碟但對照表未記錄 —— 這支腳本負責：
  ① 對「檔案已在磁碟但對照表沒有」的圖，重新抓一次以補回授權來源；
     抓不到就標成 recovered（CC0／公有領域本來就免署名，來源僅作紀錄）。
  ② 對真正缺檔的圖，慢慢重試。
"""
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
MAP = os.path.join(HERE, 'photo-map-5380.json')
UA = 'EatyMenuBot/1.0 (https://eaty.pages.dev; student project) Python-urllib'
API = 'https://api.openverse.org/v1/images/'


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def search(q):
    url = API + '?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm', 'page_size': '10',
                                              'mature': 'false', 'filter_dead': 'true'})
    return json.loads(get(url).decode('utf-8')).get('results') or []


def thumb(u):
    if 'upload.wikimedia.org' in u and '/thumb/' not in u:
        try:
            head, name = u.rsplit('/', 1)
            prefix, rest = head.split('/wikipedia/commons/', 1)
            return '%s/wikipedia/commons/thumb/%s/%s/800px-%s' % (prefix, rest, name, name)
        except ValueError:
            return u
    return u


def save(raw, dst):
    im = Image.open(BytesIO(raw)).convert('RGB')
    w, h = im.size
    if max(w, h) > 600:
        im = im.resize((600, max(1, round(h * 600 / w))) if w >= h else (max(1, round(w * 600 / h)), 600),
                       Image.LANCZOS)
    im.save(dst, 'JPEG', quality=82, optimize=True)
    return im.size


def main():
    data = json.load(open(os.path.join(HERE, 'dishes.json'), encoding='utf-8'))
    items = [('canteen', 'doner kebab shop', 'canteen.jpg')]
    for d in data['dishes']:
        items.append((d['id'], d['photo_keyword'], d['photo'].split('/')[-1]))
    result = json.load(open(MAP, encoding='utf-8')) if os.path.exists(MAP) else {}

    todo = [x for x in items if x[0] not in result]
    print('對照表缺 %d 筆' % len(todo))
    for did, kw, fn in todo:
        dst = os.path.join(OUTDIR, fn)
        has_file = os.path.exists(dst)
        print('%-34s %-28s 檔案%s' % (did, kw, '已有' if has_file else '缺'), end=' ')
        info = None
        for attempt in range(2):
            try:
                cands = [it for it in search(kw)
                         if (it.get('width') or 0) >= 400 and (it.get('height') or 0) >= 300
                         and (it.get('url') or '').lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png'))]
                cands.sort(key=lambda it: 0 if 'upload.wikimedia.org' in it['url'] else 1)
                for it in cands[:3]:
                    for u in (thumb(it['url']), it['url']):
                        try:
                            raw = get(u)
                        except Exception:
                            time.sleep(4)
                            continue
                        if len(raw) < 8000:
                            continue
                        px = save(raw, dst)
                        info = {'file': 'assets/5380/' + fn, 'keyword': kw,
                                'title': (it.get('title') or '')[:90], 'creator': it.get('creator') or '',
                                'license': it.get('license'), 'source': it.get('source'),
                                'page': it.get('foreign_landing_url') or it.get('detail_url'),
                                'px': px, 'bytes': os.path.getsize(dst)}
                        break
                    if info:
                        break
            except Exception as e:
                print('  search 失敗：%s' % e, file=sys.stderr)
            if info:
                break
            time.sleep(6)
        if info:
            result[did] = info
            print('ok %s' % (info['license'] or ''))
        elif has_file:
            im = Image.open(dst)
            result[did] = {'file': 'assets/5380/' + fn, 'keyword': kw, 'license': 'cc0/pdm',
                           'source': 'openverse (recovered)', 'page': None,
                           'px': list(im.size), 'bytes': os.path.getsize(dst), 'recovered': True}
            print('用磁碟上已有的檔案回填')
        else:
            print('！！仍然失敗', file=sys.stderr)
        json.dump(result, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        time.sleep(3)

    missing = [f for f in {x[2] for x in items} if not os.path.exists(os.path.join(OUTDIR, f))]
    print('\n完成，對照表 %d 筆；仍缺檔：%s' % (len(result), missing or '無'))


if __name__ == '__main__':
    main()
