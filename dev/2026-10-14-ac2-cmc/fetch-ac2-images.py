"""補 AC2 新收 11 道菜的示意圖（Pexels，免費可商用免署名）。
AC2 其他 59 道全部有圖（teahouse-2026-10-12.sql 補的），所以新收的都要補，
否則同一頁會有「有圖／冇圖」混住。

用法：先等 fetch-images.py 跑完再跑（避免同時打 Pexels 被 403）。
"""
import re
import sys
import time
import urllib.request
from pathlib import Path

OUT = Path(r"C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion/assets/ac2")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

JOBS = [
    ("ac2-chicken-soup-beef-scallion-dumplings",          "dumpling soup"),
    ("ac2-rich-chicken-soup-chicken-cartilage-dumplings", "chicken dumpling soup"),
    ("ac2-panfried-beef-scallion-dumplings",              "fried dumplings"),
    ("ac2-panfried-chicken-cartilage-dumplings",          "pan fried dumplings"),
    ("ac2-deepfried-beef-scallion-dumplings",             "deep fried dumplings"),
    ("ac2-deepfried-chicken-cartilage-dumplings",         "crispy fried dumplings"),
    ("ac2-tomato-fatty-beef-rice-noodles",                "beef noodle soup"),
    ("ac2-fish-roll-knife-cut-noodles",                   "fish ball noodle soup"),
    ("ac2-spicy-pork-dry-pot-rice",                       "pork rice bowl"),
    ("ac2-green-bean-sweet-soup",                         "mung bean soup"),
    ("ac2-taro-sago-cake",                                "taro dessert"),
]

used = set()


def search_ids(query):
    url = "https://www.pexels.com/search/" + urllib.parse.quote(query) + "/"
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=25) as r:
                html = r.read().decode("utf-8", "ignore")
            break
        except Exception as e:
            last = e
            time.sleep(5 * (attempt + 1))
    else:
        raise last
    seen, out = set(), []
    for i in re.findall(r"images\.pexels\.com/photos/(\d+)/", html):
        if i not in seen:
            seen.add(i)
            out.append(i)
    return out


def download(pid, dest):
    url = (f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg"
           "?auto=compress&cs=tinysrgb&w=800")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    if len(data) < 8000 or data[:2] != b"\xff\xd8":
        raise ValueError(f"bad jpeg ({len(data)} bytes)")
    dest.write_bytes(data)
    return len(data)


def main():
    fails = []
    for slug, query in JOBS:
        dest = OUT / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 8000:
            print(f"  skip  {slug}.jpg")
            continue
        try:
            ids = search_ids(query)
            picked = next((p for p in ids[:12] if p not in used), None)
            if not picked:
                raise RuntimeError("no unused id")
            n = download(picked, dest)
            used.add(picked)
            print(f"  ok    {slug}.jpg <- {picked} ({n // 1024} KB) [{query}]")
        except Exception as e:
            fails.append((slug, str(e)))
            print(f"  FAIL  {slug}: {e}")
        time.sleep(2.5)
    print(f"\n{len(list(OUT.glob('*.jpg')))} files in {OUT}")
    if fails:
        print("FAILURES:", fails)
        sys.exit(1)


if __name__ == "__main__":
    main()
