# -*- coding: utf-8 -*-
"""把所有四季茶坊商品照拼成一張聯絡表，方便一眼核對圖文是否相符。"""
import json, io, sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/eaty/'
DEV = BASE + 'dev/2026-10-20-ac2-teahouse-resync/'

rows = json.load(open(DEV + 'plan_rows.json', encoding='utf-8'))
COLS, CW, CH, PAD, LBL = 8, 150, 150, 6, 26
n = len(rows)
r = (n + COLS - 1) // COLS
W = COLS * (CW + PAD) + PAD
H = r * (CH + LBL + PAD) + PAD
sheet = Image.new('RGB', (W, H), (24, 24, 28))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 14)
except Exception:
    font = ImageFont.load_default()

for i, row in enumerate(rows):
    cx = PAD + (i % COLS) * (CW + PAD)
    cy = PAD + (i // COLS) * (CH + LBL + PAD)
    try:
        im = Image.open(BASE + row['photo']).convert('RGB').resize((CW, CH), Image.LANCZOS)
        sheet.paste(im, (cx, cy))
    except Exception as e:
        d.rectangle([cx, cy, cx + CW, cy + CH], fill=(80, 30, 30))
    d.text((cx + 2, cy + CH + 4), f"{row['zh']} ${row['price']:g}", fill=(235, 235, 240), font=font)

sheet.save(DEV + 'contact-sheet.png', 'PNG')
print('OK', sheet.size, DEV + 'contact-sheet.png')
