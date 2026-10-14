# -*- coding: utf-8 -*-
"""把 v0.10.0 的三組前後對照疊成一張圖，方便一眼看完改了什麼。"""
from PIL import Image, ImageDraw, ImageFont

FONT = 'C:/Windows/Fonts/msjh.ttc'
W = 1072
PAD = 24
LABEL_H = 34
GAP = 10
BG = (250, 250, 248)
INK = (20, 20, 20)
RED = (168, 39, 24)
MUTE = (110, 108, 104)

f_title = ImageFont.truetype(FONT, 22)
f_label = ImageFont.truetype(FONT, 17)
f_small = ImageFont.truetype(FONT, 13)


def load(p, maxw):
    im = Image.open(p).convert('RGB')
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    return im


def frame(im):
    """給截圖加一圈細邊，白色區塊才看得出邊界。"""
    out = Image.new('RGB', (im.width + 2, im.height + 2), (222, 220, 215))
    out.paste(im, (1, 1))
    return out


sections = [
    ('① 食堂標題膠囊：文字沒有置中 → 置中',
     '原因：chip 裡的 <i class="dot"> 因為 --ac1／--ac2／--ac3 從未定義而變全透明，'
     '但仍佔 8px 寬 + 7px 間距，把標籤整體往右推 15px（實測左 28px／右 13px → 現在 13／13）。',
     ['cmp-chip-before.png', 'cmp-chip-after.png'],
     ['修改前', '修改後']),
    ('② iPad 頁尾：文字貼邊 → 回到正常留白',
     '原因有兩層：(a) 舊 CSS 的 @media(max-width:1180px){.wrap{padding:0 40px}} 與 '
     '.footer-grid 同優先度 (0,1,0) 且排在後面，把頁尾的 padding-top:56px／padding-bottom:34px '
     '一起蓋成 0（實測 0px／0px）；(b) 左右只有 40px。現在 56／34／64。',
     ['cmp-foot-before.png', 'cmp-foot-after.png'],
     ['修改前（iPad 1024）', '修改後（iPad 1024）']),
    ('③ AC2 標題區新增「檔口點餐」入口',
     'AC2 本身沒有點餐站，但西北麵館／餃餃陣兩個檔口有。現在食堂頁標題區（時段行與評分列之間）'
     '會逐個列出「檔口名 ↗」，資料來自 categories.order_url，之後加檔口不用改程式。',
     ['cmp-ac2-after.png'],
     ['修改後']),
]

# 先量總高度
blocks = []
for title, note, imgs, caps in sections:
    ims = [frame(load(p, W - PAD * 2)) for p in imgs]
    h = LABEL_H + 40 + sum(i.height + 22 for i in ims) + GAP
    blocks.append((title, note, ims, caps, h))

total_h = PAD + 46 + sum(b[4] for b in blocks) + PAD
canvas = Image.new('RGB', (W, total_h), BG)
d = ImageDraw.Draw(canvas)

y = PAD
d.text((PAD, y), 'Eaty. v0.10.0 — 三項修正前後對照', font=f_title, fill=INK)
y += 46

for title, note, ims, caps, h in blocks:
    d.text((PAD, y), title, font=f_label, fill=RED)
    y += 26
    # 說明文字自動折行
    line = ''
    for ch in note:
        if d.textlength(line + ch, font=f_small) > W - PAD * 2:
            d.text((PAD, y), line, font=f_small, fill=MUTE)
            y += 19
            line = ''
        line += ch
    if line:
        d.text((PAD, y), line, font=f_small, fill=MUTE)
        y += 19
    y += GAP
    for im, cap in zip(ims, caps):
        d.text((PAD, y), cap, font=f_small, fill=INK)
        y += 20
        canvas.paste(im, (PAD, y))
        y += im.height + 8
    y += GAP

out = 'v0.10.0-對照.png'
canvas.save(out)
print(out, canvas.size)
