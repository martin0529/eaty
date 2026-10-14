"""補齊剩餘圖片（Pexels，免費可商用免署名）。
Pexels 的 /search 端點限流很兇（連續請求會 403），所以這裡：
  - 每次搜尋之間固定等 25 秒
  - 撞 403 就等 60 秒重試，最多 8 次
  - 已存在的檔案直接跳過（可重複執行、斷了再跑）

涵蓋：CMC Cafe 缺 1 張、拾味缺 3 張、AC2 新收 11 道。
"""
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(r"C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion/assets")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

JOBS = [
    ("cmc", "cmc-wrap-smoked-salmon-egg",                 "egg salad wrap"),
    ("ac2", "ac2-thepick-6",                              "small rice bowl"),
    ("ac2", "ac2-thepick-10",                             "vegetable rice bowl"),
    ("ac2", "ac2-thepick-18",                             "rice bowl meal"),
    ("ac2", "ac2-chicken-soup-beef-scallion-dumplings",          "dumpling soup"),
    ("ac2", "ac2-rich-chicken-soup-chicken-cartilage-dumplings", "chicken dumpling soup"),
    ("ac2", "ac2-panfried-beef-scallion-dumplings",              "fried dumplings"),
    ("ac2", "ac2-panfried-chicken-cartilage-dumplings",          "pan fried dumplings"),
    ("ac2", "ac2-deepfried-beef-scallion-dumplings",             "deep fried dumplings"),
    ("ac2", "ac2-deepfried-chicken-cartilage-dumplings",         "crispy fried dumplings"),
    ("ac2", "ac2-tomato-fatty-beef-rice-noodles",                "beef noodle soup"),
    ("ac2", "ac2-fish-roll-knife-cut-noodles",                   "fish noodle soup"),
    ("ac2", "ac2-spicy-pork-dry-pot-rice",                       "pork rice bowl"),
    ("ac2", "ac2-green-bean-sweet-soup",                         "mung bean soup"),
    ("ac2", "ac2-taro-sago-cake",                                "taro dessert"),
]

used = set()


def search_ids(query):
    url = "https://www.pexels.com/search/" + urllib.parse.quote(query) + "/"
    last = None
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                html = r.read().decode("utf-8", "ignore")
            seen, out = set(), []
            for i in re.findall(r"images\.pexels\.com/photos/(\d+)/", html):
                if i not in seen:
                    seen.add(i)
                    out.append(i)
            if out:
                return out
            last = RuntimeError("no ids in page")
        except Exception as e:
            last = e
        print(f"      ...403/err, wait 60s (attempt {attempt + 1})", flush=True)
        time.sleep(60)
    raise last


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
    for folder, slug, query in JOBS:
        dest = ROOT / folder / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 8000:
            print(f"  skip  {folder}/{slug}.jpg", flush=True)
            continue
        try:
            ids = search_ids(query)
            picked = next((p for p in ids[:15] if p not in used), None)
            if not picked:
                raise RuntimeError("no unused id")
            n = download(picked, dest)
            used.add(picked)
            print(f"  ok    {folder}/{slug}.jpg <- {picked} ({n // 1024} KB)", flush=True)
        except Exception as e:
            fails.append((slug, str(e)))
            print(f"  FAIL  {slug}: {e}", flush=True)
        time.sleep(25)
    print(f"\ndone. failures={len(fails)}")
    for f in fails:
        print("   ", f)
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
