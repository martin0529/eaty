"""下載 CMC Cafe / 拾味 的示意圖（Pexels，免費可商用免署名）。
每張圖都用「關鍵字 → Pexels 搜尋 → 取第一個未用過的 photo id」下載，
避免多道菜撞同一張圖。下載後驗證是有效 JPEG 且 > 8KB。
"""
import re
import sys
import time
import urllib.request
from pathlib import Path

OUT = Path(r"C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion/assets/cmc")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

# (檔名, Pexels 搜尋關鍵字)
JOBS = [
    ("cmc-panini-chicken-caesar",        "panini"),
    ("cmc-panini-cheddar-avocado",       "avocado sandwich"),
    ("cmc-panini-spicy-chicken",         "grilled chicken sandwich"),
    ("cmc-panini-roast-beef-mushroom",   "roast beef sandwich"),
    ("cmc-panini-smoked-salmon",         "salmon sandwich"),
    ("cmc-wrap-chicken-caesar",          "chicken wrap"),
    ("cmc-wrap-spicy-chicken-pumpkin",   "tortilla wrap"),
    ("cmc-wrap-avocado-quinoa",          "avocado wrap"),
    ("cmc-wrap-roast-beef-mushroom",     "beef wrap"),
    ("cmc-wrap-smoked-salmon-egg",       "egg salad wrap"),
    ("cmc-lunch-steak-rice",             "steak rice bowl"),
    ("cmc-lunch-curry-chicken-rice",     "curry rice"),
    ("cmc-lunch-fish-pumpkin-rice",      "grilled fish rice"),
    ("cmc-lunch-mussels-spaghetti",      "mussels pasta"),
    ("cmc-daily-salmon-spaghetti",       "salmon pasta"),
    ("cmc-daily-bolognese",              "spaghetti bolognese"),
    ("cmc-daily-chicken-scallion-noodles", "scallion noodles"),
    ("cmc-daily-chicken-fusilli-soup",   "pasta soup"),
    ("ac2-thepick-6",                    "rice bowl small"),
    ("ac2-thepick-10",                   "rice bowl vegetables"),
    ("ac2-thepick-15",                   "chinese food bowl"),
    ("ac2-thepick-18",                   "asian rice meal"),
    ("ac2-thepick-21",                   "rice dishes table"),
    ("cmc-cafe-interior",                "cafe interior"),
]

used = set()


def search_ids(query):
    url = "https://www.pexels.com/search/" + urllib.parse.quote(query) + "/"
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=25) as r:
                html = r.read().decode("utf-8", "ignore")
            break
        except Exception as e:            # 429 / 403 = 被限流，退避後重試
            last = e
            time.sleep(6 * (attempt + 1))
    else:
        raise last
    ids = re.findall(r"images\.pexels\.com/photos/(\d+)/", html)
    seen, out = set(), []
    for i in ids:
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
    failures = []
    for slug, query in JOBS:
        dest = OUT / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 8000:
            print(f"  skip  {slug}.jpg (exists)")
            continue
        try:
            ids = search_ids(query)
        except Exception as e:
            failures.append((slug, f"search failed: {e}"))
            print(f"  FAIL  {slug}: search failed {e}")
            continue
        picked = None
        for pid in ids[:12]:
            if pid in used:
                continue
            picked = pid
            break
        if not picked:
            failures.append((slug, "no unused id"))
            print(f"  FAIL  {slug}: no unused id")
            continue
        try:
            n = download(picked, dest)
            used.add(picked)
            print(f"  ok    {slug}.jpg  <- {picked}  ({n // 1024} KB)  [{query}]")
        except Exception as e:
            failures.append((slug, f"download failed: {e}"))
            print(f"  FAIL  {slug}: download {e}")
        time.sleep(3.0)
    print()
    print(f"done: {len(list(OUT.glob('*.jpg')))} files in {OUT}")
    if failures:
        print("FAILURES:", failures)
        sys.exit(1)


if __name__ == "__main__":
    main()
