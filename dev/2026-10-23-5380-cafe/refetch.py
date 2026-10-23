# -*- coding: utf-8 -*-
"""指定重抓某幾張（`python refetch.py 5380-fish-kebab="grilled fish" ...`）

用來換掉明顯不對的圖（例如 fish-kebab 抓成了壽司）。
"""
import importlib.util
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('fp', os.path.join(HERE, 'fetch_photos_final.py'))
fp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fp)

data = json.load(open(os.path.join(HERE, 'dishes.json'), encoding='utf-8'))
files = {d['id']: d['photo'].split('/')[-1] for d in data['dishes']}
files['canteen'] = 'canteen.jpg'
result = json.load(open(fp.MAP, encoding='utf-8')) if os.path.exists(fp.MAP) else {}

for arg in sys.argv[1:]:
    did, kw = arg.split('=', 1)
    fn = files[did]
    dst = os.path.join(fp.OUTDIR, fn)
    got = None
    print('%-32s ← %s' % (did, kw), end=' ', flush=True)
    cands = [it for it in fp.search(kw)
             if (it.get('width') or 0) >= 400 and (it.get('height') or 0) >= 300
             and (it.get('url') or '').lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png'))]
    cands.sort(key=lambda it: 0 if 'upload.wikimedia.org' in it['url'] else 1)
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
        result[did] = got
        print('ok %dx%d' % tuple(got['px']))
        json.dump(result, open(fp.MAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    else:
        print('!! 失敗', file=sys.stderr)
    time.sleep(3)
