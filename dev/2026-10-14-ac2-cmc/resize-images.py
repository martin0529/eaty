"""把新下載的圖片統一壓到「同既有圖片一致」的大小。

Openverse 那批係 Flickr 原圖（最大 3.7MB），同站內其他圖（平均 ~240KB）差太遠，
會拖慢部署同首次載入。統一：最長邊 ≤ 900px、JPEG quality 82、漸進式。

只處理本檔指定的清單，唔會掃全個 assets（避免誤壓既有圖片）。
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:/Users/1/WorkBuddy/2026-10-04-16-49-21/cityu-eats-motion")
MAX_EDGE = 900
QUALITY = 82

MANIFEST = Path(__file__).with_name("resized.json")


def targets():
    out = list((ROOT / "assets/cmc").glob("*.jpg"))
    # 拾味 + 本次新收的 11 道 AC2 菜（其餘 59 張係上一手加，唔郁）
    out += list((ROOT / "assets/ac2").glob("thepick-*.jpg"))
    for p in (ROOT / "assets/ac2").glob("ac2-*.jpg"):
        if p.stat().st_size > 400_000:      # 只處理明顯過大的新圖
            out.append(p)
    return sorted(set(out))


def main():
    before = after = 0
    changed = []
    for p in targets():
        b = p.stat().st_size
        before += b
        try:
            im = Image.open(p)
            im = im.convert("RGB")
            w, h = im.size
            scale = min(1.0, MAX_EDGE / max(w, h))
            if scale < 1.0:
                im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
            im.save(p, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        except Exception as e:
            print(f"  FAIL {p.name}: {e}")
            continue
        a = p.stat().st_size
        after += a
        if a < b:
            changed.append({"file": str(p.relative_to(ROOT)), "before": b, "after": a,
                            "size": f"{im.size[0]}x{im.size[1]}"})
            print(f"  {p.name}: {b // 1024}KB -> {a // 1024}KB  ({im.size[0]}x{im.size[1]})")
    MANIFEST.write_text(json.dumps(changed, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\ntotal {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
