"""把 supabase/ac2-stalls-cmc-2026-10-14.sql 解析成 JSON fixture，
供 verify_local.cjs 在 Playwright 攔截 Supabase REST 時疊加。

唔想喺驗證腳本手抄一次資料 —— 抄一次就一定會同 SQL 走樣，
所以直接讀 SQL，保證「驗證嘅就係入庫嘅」。
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SQL = ROOT / "supabase" / "ac2-stalls-cmc-2026-10-14.sql"
OUT = Path(__file__).with_name("fixture.json")


def split_rows(block):
    """把 VALUES 之後嘅 `(...)` 逐筆切開。用括號深度掃描，唔靠「一行一筆」——
    canteens 那筆是跨行寫的。要尊重單引號（字串內嘅括號／逗號唔算）。"""
    rows, depth, buf, in_str, i = [], 0, "", False, 0
    while i < len(block):
        c = block[i]
        if in_str:
            buf += c
            if c == "'" and i + 1 < len(block) and block[i + 1] == "'":
                buf += "'"
                i += 2
                continue
            if c == "'":
                in_str = False
            i += 1
            continue
        if c == "'":
            in_str = True
            buf += c
            i += 1
            continue
        if c == "(":
            depth += 1
            if depth == 1:
                buf = ""
            else:
                buf += c
            i += 1
            continue
        if c == ")":
            depth -= 1
            if depth == 0:
                rows.append(buf)
                buf = ""
            else:
                buf += c
            i += 1
            continue
        if depth >= 1:
            buf += c
        i += 1
    return rows


def parse_values(body):
    """解析 `a, b, 1, null, 'x', '{}', true` —— 尊重單引號、'' 轉義。
    body 是 split_rows() 交出來、已剝掉最外層括號的內容。"""
    body = body.strip()
    out, buf, in_str, i = [], "", False, 0
    while i < len(body):
        c = body[i]
        if in_str:
            if c == "'" and i + 1 < len(body) and body[i + 1] == "'":
                buf += "'"
                i += 2
                continue
            if c == "'":
                in_str = False
                i += 1
                continue
            buf += c
        else:
            if c == "'":
                in_str = True
                i += 1
                continue
            if c == ",":
                out.append(buf.strip())
                buf = ""
                i += 1
                continue
            buf += c
        i += 1
    out.append(buf.strip())
    return out


def lit(tok):
    """SQL 字面值 → Python 值。"""
    t = tok.strip()
    if t.lower() == "null":
        return None
    if t.lower() == "true":
        return True
    if t.lower() == "false":
        return False
    if t.startswith("'") and t.endswith("'"):
        return t[1:-1].replace("''", "'")
    try:
        return float(t) if "." in t else int(t)
    except ValueError:
        return t


def find_insert(sql, table):
    """抓出所有 `insert into <table> (cols) values ...;` 區塊。
    VALUES 只取到 `on conflict` 或 `;` 為止 —— 否則 on conflict (id) 那個
    括號會被當成一筆資料。"""
    out = []
    for m in re.finditer(
        r"insert into " + table + r"\s*\(([^)]*)\)\s*values(.*?)(?:on conflict|;)", sql, re.S | re.I
    ):
        cols = [c.strip() for c in m.group(1).split(",")]
        for row in split_rows(m.group(2)):
            vals = [lit(v) for v in parse_values(row)]
            if len(vals) != len(cols):
                raise SystemExit(f"column/value mismatch in {table}: {row!r}")
            out.append(dict(zip(cols, vals)))
    return out


def main():
    sql = SQL.read_text(encoding="utf-8")

    canteens = find_insert(sql, "canteens")
    categories = find_insert(sql, "categories")
    dishes = find_insert(sql, "dishes")

    # update categories set order_url = '<url>' where id = '<id>';
    cat_orders = dict(
        (i, u)
        for u, i in re.findall(
            r"update categories set order_url = '([^']*)'\s*where id = '([^']*)'", sql
        )
    )
    # update dishes set price = <n> where id = '<id>';
    dish_prices = dict(
        (i, float(p))
        for p, i in re.findall(
            r"update dishes set price = ([\d.]+) where id = '([^']*)'", sql
        )
    )
    # update dishes set photo='<path>' where id='<id>';
    dish_photos = dict(
        (i, p)
        for p, i in re.findall(
            r"update dishes set photo\s*=\s*'([^']*)'\s*where id\s*=\s*'([^']*)'", sql
        )
    )

    fixture = {
        "canteens": canteens,
        "categories": categories,
        "dishes": dishes,
        "categoryOrderUrls": cat_orders,
        "dishPrices": dish_prices,
        "dishPhotos": dish_photos,
        "alterCategories": bool(
            re.search(r"alter table categories add column if not exists order_url", sql)
        ),
    }
    OUT.write_text(json.dumps(fixture, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"canteens={len(canteens)} categories={len(categories)} dishes={len(dishes)}")
    print(f"categoryOrderUrls={cat_orders}")
    print(f"dishPrices={dish_prices}")
    print(f"dishPhotos={len(dish_photos)}")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    sys.exit(main())
