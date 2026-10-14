"""用 Openverse 補齊剩餘圖片，只取 CC0 / Public Domain Mark（免署名、可商用）。

點解轉場：Pexels 的 /search 端點連續請求後對本機 IP 硬性 403，
等 60 秒重試 3 次都唔通。Openverse 有官方免費 API、唔使 key，
而且可以按授權篩選 —— 只取 cc0 / pdm 就唔會產生署名義務，
同網站頁尾「圖片取自網上圖庫」的講法一致（Pexels 那批本身都免署名）。

輸出：
  assets/<folder>/<slug>.jpg
  dev/2026-10-14-ac2-cmc/image-sources.json   ← 逐張記錄來源／授權／作者
"""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(r"C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion")
ASSETS = ROOT / "assets"
MANIFEST = Path(__file__).with_name("image-sources.json")
UA = "EatyBot/1.0 (student project; contact: local)"

# (folder, slug, [查詢關鍵字，依序試])
JOBS = [
    ("cmc", "cmc-wrap-smoked-salmon-egg",                 ["egg salad wrap", "wrap sandwich", "tortilla wrap"]),
    ("ac2", "ac2-thepick-6",                              ["rice bowl", "steamed rice bowl", "white rice bowl"]),
    ("ac2", "ac2-thepick-10",                             ["rice bowl vegetables", "rice bowl", "vegetable dish rice"]),
    ("ac2", "ac2-thepick-18",                             ["rice bowl meal", "rice bowl", "chinese rice dish"]),
    ("ac2", "ac2-chicken-soup-beef-scallion-dumplings",   ["dumpling soup", "dumplings", "wonton soup"]),
    ("ac2", "ac2-rich-chicken-soup-chicken-cartilage-dumplings", ["chicken dumpling soup", "dumplings", "dumpling soup"]),
    ("ac2", "ac2-panfried-beef-scallion-dumplings",       ["fried dumplings", "dumplings", "potstickers"]),
    ("ac2", "ac2-panfried-chicken-cartilage-dumplings",   ["pan fried dumplings", "dumplings", "potstickers"]),
    ("ac2", "ac2-deepfried-beef-scallion-dumplings",      ["deep fried dumplings", "fried dumplings", "dumplings"]),
    ("ac2", "ac2-deepfried-chicken-cartilage-dumplings",  ["crispy fried dumplings", "fried dumplings", "dumplings"]),
    ("ac2", "ac2-tomato-fatty-beef-rice-noodles",         ["beef noodle soup", "noodle soup", "beef noodles"]),
    ("ac2", "ac2-fish-roll-knife-cut-noodles",            ["fish noodle soup", "noodle soup", "fish ball soup"]),
    ("ac2", "ac2-spicy-pork-dry-pot-rice",                ["pork rice bowl", "rice bowl", "braised pork rice"]),
    ("ac2", "ac2-green-bean-sweet-soup",                  ["mung bean soup", "green bean soup", "sweet soup"]),
    ("ac2", "ac2-taro-sago-cake",                         ["taro cake", "dessert cake", "taro dessert", "cake slice"]),
]

used = set()
manifest = {}


def api(params):
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8", "ignore"))
        except Exception as e:
            print(f"      api err {e}; retry", flush=True)
            time.sleep(8 * (attempt + 1))
    return {"results": []}


def candidates(query):
    d = api({
        "q": query,
        "license": "cc0,pdm",          # 免署名、可商用
        "page_size": 20,
        "mature": "false",
    })
    out = []
    for r in d.get("results") or []:
        u = r.get("url") or ""
        ft = (r.get("filetype") or "").lower()
        if not u:
            continue
        if ft and ft not in ("jpg", "jpeg"):
            continue
        if not ft and not u.lower().split("?")[0].endswith((".jpg", ".jpeg")):
            continue
        out.append(r)
    return out


def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
    if len(data) < 8000:
        raise ValueError(f"too small ({len(data)})")
    if data[:2] != b"\xff\xd8":
        raise ValueError("not a jpeg")
    if len(data) > 4_000_000:
        raise ValueError(f"too big ({len(data)})")
    dest.write_bytes(data)
    return len(data)


def main():
    fails = []
    for folder, slug, queries in JOBS:
        dest = ASSETS / folder / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 8000:
            print(f"  skip  {folder}/{slug}.jpg", flush=True)
            continue
        done = False
        for q in queries:
            for r in candidates(q):
                pid = r.get("id")
                if pid in used:
                    continue
                try:
                    n = fetch(r["url"], dest)
                except Exception as e:
                    print(f"      skip bad url ({e})", flush=True)
                    continue
                used.add(pid)
                manifest[f"{folder}/{slug}.jpg"] = {
                    "query": q, "title": r.get("title"), "creator": r.get("creator"),
                    "license": f"{r.get('license')} {r.get('license_version') or ''}".strip(),
                    "license_url": r.get("license_url"),
                    "provider": r.get("provider"), "source": r.get("foreign_landing_url"),
                    "file": r.get("url"),
                }
                print(f"  ok    {folder}/{slug}.jpg  ({n // 1024} KB)  [{q}] {r.get('license')}", flush=True)
                done = True
                break
            if done:
                break
        if not done:
            fails.append(slug)
            print(f"  FAIL  {slug}", flush=True)
        time.sleep(1.5)

    if MANIFEST.exists():
        old = json.loads(MANIFEST.read_text(encoding="utf-8"))
        old.update(manifest)
        manifest.clear()
        manifest.update(old)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nmanifest: {MANIFEST}  ({len(manifest)} entries)")
    print(f"failures: {fails}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
