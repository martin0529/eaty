# -*- coding: utf-8 -*-
"""對 8 張仍缺檔的圖，換第二批關鍵詞重試（慢速）。"""
import importlib.util
import json
import os
import sys
import time

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('fp', os.path.join(HERE, 'fetch_photos_final.py'))
fp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fp)

ALT = {
    'canteen': ['shawarma restaurant', 'kebab shop', 'middle eastern food counter'],
    '5380-meatball-kebab': ['kebab sandwich', 'kofta sandwich', 'doner wrap'],
    '5380-chicken-bites-kebab': ['popcorn chicken', 'chicken nuggets', 'fried chicken pieces'],
    '5380-chicken-shish-kebab': ['shish kebab', 'chicken skewers grilled', 'kebab skewer'],
    '5380-fish-biryani': ['biryani', 'rice dish curry', 'pilaf rice'],
    '5380-pizza-chicken-express': ['chicken pizza slice', 'pizza chicken topping', 'pizza'],
    '5380-samosas': ['samosa snack', 'samosa plate', 'fried pastry snack'],
    '5380-cold-tea': ['green tea drink', 'tea bottle', 'iced tea glass'],
}

MAP = fp.MAP
result = json.load(open(MAP, encoding='utf-8'))
data = json.load(open(os.path.join(HERE, 'dishes.json'), encoding='utf-8'))
files = {d['id']: d['photo'].split('/')[-1] for d in data['dishes']}
files['canteen'] = 'canteen.jpg'

for did, kws in ALT.items():
    fn = files[did]
    dst = os.path.join(fp.OUTDIR, fn)
    if os.path.exists(dst) and did in result:
        continue
    got = None
    for kw in kws:
        print('%-32s ← %s' % (did, kw), end=' ', flush=True)
        try:
            cands = [it for it in fp.search(kw)
                     if (it.get('width') or 0) >= 400 and (it.get('height') or 0) >= 300
                     and (it.get('url') or '').lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png'))]
            cands.sort(key=lambda it: 0 if 'upload.wikimedia.org' in it['url'] else 1)
        except Exception as e:
            print('search 失敗', e)
            time.sleep(8)
            continue
        for it in cands[:4]:
            for u in (fp.thumb(it['url']), it['url']):
                try:
                    raw = fp.get(u)
                except Exception:
                    time.sleep(3)
                    continue
                if len(raw) < 8000:
                    continue
                px = fp.save(raw, dst)
                got = {'file': 'assets/5380/' + fn, 'keyword': kw,
                       'title': (it.get('title') or '')[:90], 'creator': it.get('creator') or '',
                       'license': it.get('license'), 'source': it.get('source'),
                       'page': it.get('foreign_landing_url') or it.get('detail_url'),
                       'px': px, 'bytes': os.path.getsize(dst)}
                break
            if got:
                break
        if got:
            print('ok %dx%d' % tuple(got['px']))
            break
        print('—')
        time.sleep(5)
    if got:
        result[did] = got
        json.dump(result, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    else:
        print('  !! %s 仍失敗' % did, file=sys.stderr)
    time.sleep(4)

missing = [f for f in set(files.values()) if not os.path.exists(os.path.join(fp.OUTDIR, f))]
print('\n對照表 %d；仍缺：%s' % (len(result), missing or '無'))
