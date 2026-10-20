# Eaty. — 城大搵食指南 · CityU Canteen Guide

一個為香港城市大學（CityU HK）而寫的飯堂菜單與評價指南。收錄 **4 間食堂**（AC1 城大食坊、AC2 Canteen、AC3 Bistro、CMC Cafe）共 **405 道菜**，可以按 **餐段（早餐／午餐／晚餐）** 與菜品分類篩選，看每一道菜的價錢、照片與同學的真實評價，還有「今天吃什麼」隨機抽籤。

純靜態網站：**沒有建置步驟、沒有框架、沒有 `npm install`**——打開 `index.html` 就能跑。

A static, build-free menu & review guide for the CityU HK canteens. No framework, no bundler, no dependencies to install — just open `index.html`.

---

## 功能 Features

| | |
|---|---|
| 🍜 **菜單瀏覽** | 405 道菜 / 73 個分類，可按食堂與菜品分類篩選；AC2 部分檔口可直接跳官方點餐 |
| 🧋 **官方商品照** | AC2「四季茶坊」**49 道飲品全部採用點餐站的真實商品照**（600×600），價錢與官方菜單同步 |
| 🛒 **點餐入口** | 食堂頁標題區就有入口：食堂有點餐站顯示「官方網上點餐」，只有檔口有（AC2）則列成「檔口點餐　西北麵館 ↗　餃餃陣 ↗」 |
| 🕗 **餐段切換** | 食堂頁最上層是「全日／早餐／午餐／晚餐」，切換後分類與菜品一起收窄 |
| ⭐ **真實評價** | 1–5 星 + 必食／普通／避雷三種評價，寫入 Supabase（全校共享） |
| 🎲 **今天吃什麼** | 隨機抽籤；**可選食堂範圍 ＋ 時段（全日／早餐／午餐／晚餐）**；排除清單存在 Supabase，隨時自己改，十秒內有答案 |
| 🌏 **中英雙語** | 一鍵切換繁體中文 / English |
| 📱 **響應式** | 手機、平板、寬螢幕皆可用 |
| ✨ **動效** | 純 CSS 關鍵影格驅動，`transform` / `opacity` / `clip-path`，尊重 `prefers-reduced-motion` |

---

## 專案結構 Project structure

```
.
├── index.html              # 唯一入口
├── css/
│   └── style.css           # 全部樣式 + 動效（單檔）
├── js/
│   ├── config.js           # 站點設定：版本、Supabase 連線、儲存鍵名
│   ├── menu-data.js        # 內建菜單後備資料 + 雲端載入器（含餐段與抽籤黑名單）
│   ├── i18n.js             # 中英雙語文案表
│   ├── reviews.js          # 評論儲存層（Supabase / localStorage 雙實作）
│   └── app.js              # 渲染與互動主邏輯
├── assets/                 # 菜品與版面照片
└── supabase/               # 資料庫設定（見下）
```

---

## 資料來源 Data source

菜單與評論採**三層後備**，由上而下依序嘗試：

1. **Supabase 雲端**（唯一真相來源）
2. **`localStorage` 快取**（曾成功載入過就有）
3. **`js/menu-data.js` 內建資料**（最後防線，即使離線網站也不會空白）

實際走了哪一層可以在瀏覽器 console 看 `window.CityuEatsMenu.source`，值為 `'cloud'` / `'cache'` / `'bundled'`。

> ⚠️ 所以**使用者看到的菜名、價錢、食堂介紹幾乎都來自雲端**。只改 `menu-data.js` 不會反映到線上網站，要改文案請改 Supabase 的資料表。

---

## 資料庫設定 Database setup

需要一個免費的 [Supabase](https://supabase.com) 專案。到 **SQL Editor** 執行：

```
supabase/setup.sql                    ← 完整設定，從零可跑（建表 + 權限 + 種子資料）
```

之後按日期順序跑增量（全部可重複執行）：

```
supabase/ac1-breakfast-2026-10-05.sql        ← AC1 早餐菜單同步
supabase/ac1-lunch-2026-10-05.sql            ← AC1 午市菜單同步
supabase/ac2-menu-2026-10-12.sql             ← AC2 按現場檔口重建菜單
supabase/ac3-menu-2026-10-12.sql             ← AC3 上線（爬自官方點餐平台）
supabase/teahouse-2026-10-12.sql             ← AC2 四季茶坊 + 全站補圖
supabase/ac3-snacks-photo-fix-2026-10-12.sql ← 修 AC3「小食」7 張相同佔位圖
supabase/canteen-contact-2026-10-12.sql      ← 食堂簡介改「電話 + 付款方式」
supabase/ac2-stalls-cmc-2026-10-14.sql       ← AC2 兩個檔口官方菜單 + 拾味 + 新食堂 CMC Cafe
supabase/2026-10-15-ac2-teahouse-drinks.sql  ← AC2 四季茶坊飲品同步官方點餐站（24 → 49 道）
```

跑完會建立 5 張表並灌入資料。下表是**跑完全部增量之後**的現況：

| 表 | 內容 |
|---|---|
| `canteens` | 4 間食堂（`order_url` 放大食堂的官方下單連結） |
| `categories` | 73 個被用到的菜品分類（含 `meal` 餐段欄位、`order_url` 檔口下單連結） |
| `dishes` | 405 道菜 |
| `reviews` | 使用者評論（初始為空） |
| `roll_blacklist` | 「今天吃什麼」抽籤排除清單 |

`setup.sql` 與每個增量檔都**可重複執行**，不會弄壞既有資料。

然後把 **Project Settings → API Keys** 的兩個值填進 `js/config.js`：

```js
SUPABASE_URL: 'https://<你的專案>.supabase.co',
SUPABASE_ANON_KEY: 'sb_publishable_...',
```

> 🔒 **只能放 `sb_publishable_` / `anon` 這把公開金鑰。** 它會隨網頁送到每一位訪客的瀏覽器，安全性完全由資料庫的 RLS（Row Level Security）政策把關——本專案的 RLS 政策只給匿名使用者 `select` 權限。
>
> **絕對不要把 `sb_secret_` 或 `service_role` 放進來**，那等於把整座資料庫的讀寫權公開在網頁原始碼裡。

### 其他 SQL

| 檔案 | 用途 |
|---|---|
| `supabase/setup.sql` | 完整設定，**一般情況只需要這一個** |
| `supabase/ac2-stalls-cmc-2026-10-14.sql` | AC2 餃餃陣／西北麵館同步官方點餐菜單 + 兩個檔口下單連結 + 新增「拾味 The Pick」+ 新食堂 CMC Cafe |
| `supabase/2026-10-15-ac2-teahouse-drinks.sql` | AC2「四季茶坊」飲品同步官方點餐站：24 → **49 道**（補 23 道基本熱／凍飲 + 汽水 + 紅牛，換 47 張官方商品照，價錢校正） |
| `supabase/ac3-snacks-photo-fix-2026-10-12.sql` | 修 AC3「小食」7 張相同佔位圖（原本 7 道菜共用同一張卡通圖 → 前端顯示空白卡） |
| `supabase/canteen-contact-2026-10-12.sql` | 食堂簡介改為「電話 + 付款方式」（來源：CityU 官方餐飲目錄） |
| `supabase/v0.6.0-meal-and-blacklist.sql` | v0.6.0 增量遷移（餐段欄位 + 抽籤黑名單）。內容已包含在 `setup.sql` 的 Part 4，舊專案才需要單獨跑 |
| `supabase/fix-fact-zh.sql` | 一次性資料修正（歷史遺留，新專案不需要跑） |
| `supabase/reference/*.sql` | 建置 `setup.sql` 所用的原始片段，**僅供參考、不要直接執行**——它們假設表已存在，在全新專案會報錯 |

---

## 兩個設定放在資料庫裡（改資料，不用改程式）

### 1. 餐段：`categories.meal`

每一列填**逗號分隔**的餐段代碼，存檔即生效（網站重新整理即可）：

| 填什麼 | 意思 |
|---|---|
| `breakfast` | 只在早餐出現 |
| `lunch,dinner` | 午餐、晚餐都出現 |
| `breakfast,lunch,dinner`（或 `all`） | 三餐都出現 |
| **留空（NULL）** | **不分餐**：只在「全日」出現，三個餐段都不算它 |

也接受中文別名（`早餐` / `午餐` / `晚餐` / `三餐`）與全角逗號。

> 設計成「可以跨餐共用」是因為同一道菜常常午晚都賣；而「留空 = 不分餐」（而不是「= 三餐都算」）
> 讓 `其他`（$1 環保餐盒／餐具那種根本不是餐點的品項）不會滲進早餐清單。
>
> 某個食堂如果**完全沒有**某個餐段的菜，那一顆 tab 會自動不出現，不會留一顆按下去空空如也的按鈕。

### 2. 抽籤排除清單：`roll_blacklist`

一行 = 一個排除項。網站**只讀**這張表（RLS 只開 `select`），所以任何人都無法透過網站清空抽籤池。

| `kind` | `value` 填什麼 | 例子 |
|---|---|---|
| `category` | `categories.id` | `飲品`、`Coffee Lounge`、`drinks` |
| `dish` | `dishes.id` | `ac1-pepperoni`、`ac2-claypot` |

「今天吃什麼」的視窗裡會顯示**可抽 N 道菜**，那就是「範圍 × 時段」再扣掉排除清單之後的實際池子大小
（2026-10-15 實測：全部 405 道 − 153 道飲品與非食品 = **252 道**；
分食堂為 AC1 109／AC2 51／AC3 74／CMC 18。視窗可再按**時段**收窄，
某時段在該範圍內一道菜都沒有時，那顆 chip 會變灰禁用 —— 例如 AC2 冇早餐）。
把整張表刪光 = 不再排除任何東西。

### 3. 檔口下單連結：`categories.order_url`

大食堂的官方下單連結放在 `canteens.order_url`；**檔口**（在網站上就是一個分類）沒有對應的
`canteens` 列，所以改用 `categories.order_url`：

```sql
update categories set order_url = 'https://csd.order.place/home/store/212882' where id = '餃餃陣';
```

填了就會在該分類的標題列（以及單獨選中該分類時）出現「網上點餐」按鈕；留空則不顯示。
目前 AC2 只有 **餃餃陣**（store `212882`）與 **西北麵館**（store `312882`）兩個檔口有官方點餐店。

v0.10.0 起，這些檔口的點餐連結也會一併出現在**食堂頁的標題區**（時段行與評分列之間）：
食堂自己有點餐站（AC1／AC3）就顯示「官方網上點餐」，食堂沒有但檔口有（AC2）就逐個列成
「檔口點餐　西北麵館 ↗　餃餃陣 ↗」，兩者都沒有（CMC）整行不顯示。判斷完全是資料驅動 ——
只要在 `categories.order_url` 填上網址，標題區就會自動多一顆膠囊，不需要改程式。

### 4. 從官方點餐站同步菜單（aigens 後端）

CityU 的檔口點餐站（`csd.order.place`）背後是 **aigens**，菜單有一支公開 JSON API：

```bash
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 \
  (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  "https://api.aigens.com/api/v1/menu/store/312882.json?menu=kiosk"
```

- ⚠️ **必須帶瀏覽器 UA**，否則回 404（不帶 UA 會被當成爬蟲擋掉）。
- `312882` = 西北麵館／四季茶坊；`212882` = 餃餃陣；`112882` = AC2 食堂本體（兩個檔口共用它的分類）。
- `menu=kiosk` 才是完整菜單；`menu=dinein` 只給時段菜單。
- 菜品圖在 `images.default.url`（`content.aigens.com`，**600×600 正方形**，可直接 `object-fit:cover` 裁成 4:3）。
- 分類名只有英文（`name`），中文要自己對應。

實作範例見 `dev/2026-10-15-ac2-drinks-teahouse/build.py`（下載圖 + 生成 SQL 一次做完）。

---

## 本機預覽 Run locally

`file://` 直接開 `index.html` 也能看，但 Supabase 載入與 `localStorage` 在某些瀏覽器會有跨來源限制，建議起一個簡單的靜態伺服器：

```bash
# Python
python -m http.server 8000

# 或 Node
npx serve .
```

然後開 <http://localhost:8000>。

---

## 部署 Deploy

純靜態、無建置步驟，任何靜態主機都能直接用：

- **GitHub Pages** — Settings → Pages → Source 選 `main` 分支 `/ (root)`
- **Netlify / Vercel / Cloudflare Pages** — 直接連這個 repo，不用填 build command

---

## 客製化 Customisation

| 想改什麼 | 改哪裡 |
|---|---|
| 介面文案（中英） | `js/i18n.js` |
| 版本號（同時刷新快取） | `js/config.js` 的 `VERSION` + `index.html` 裡的 `?v=` 查詢字串 |
| 食堂介紹、菜名、價錢 | **Supabase `canteens` / `dishes` 表**（不是在 `menu-data.js`） |
| 某個分類屬於哪個餐段 | **Supabase `categories.meal`** |
| 哪個檔口可以網上點餐 | **Supabase `categories.order_url`**（留空＝不顯示按鈕） |
| 食堂本身的官方下單連結 | **Supabase `canteens.order_url`** |
| 抽籤要排除哪些菜品／分類 | **Supabase `roll_blacklist` 表**（刪光＝不排除） |
| 是否顯示範例評論 | `js/config.js` 的 `HIDE_SAMPLES` |
| 配色與動效 | `css/style.css` 最上方的 CSS 變數 |

---

## 授權 License

程式碼採用 [MIT License](LICENSE)。

菜品照片版權屬原拍攝者／原網站所有，僅作學術與非商業展示用途。食堂資訊請以 [CityU 官方餐飲頁面](https://www.cityu.edu.hk/zh-hk/directories/catering) 及現場公告為準。
