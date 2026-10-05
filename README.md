# Eaty. — 城大搵食指南 · CityU Canteen Guide

一個為香港城市大學（CityU HK）而寫的飯堂菜單與評價指南。收錄 **三大食堂**（AC1 城大食坊、AC2 Canteen、AC3 Bistro）共 **125 道菜**，可以按 **餐段（早餐／午餐／晚餐）** 與菜品分類篩選，看每一道菜的價錢、照片與同學的真實評價，還有「今天吃什麼」隨機抽籤。

純靜態網站：**沒有建置步驟、沒有框架、沒有 `npm install`**——打開 `index.html` 就能跑。

A static, build-free menu & review guide for the three CityU HK canteens. No framework, no bundler, no dependencies to install — just open `index.html`.

---

## 功能 Features

| | |
|---|---|
| 🍜 **菜單瀏覽** | 125 道菜 / 29 個分類，可按食堂與菜品分類篩選 |
| 🕗 **餐段切換** | 食堂頁最上層是「全日／早餐／午餐／晚餐」，切換後分類與菜品一起收窄 |
| ⭐ **真實評價** | 1–5 星 + 必食／普通／避雷三種評價，寫入 Supabase（全校共享） |
| 🎲 **今天吃什麼** | 隨機抽籤；排除清單存在 Supabase，隨時自己改，十秒內有答案 |
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
supabase/ac1-breakfast-2026-10-05.sql ← 增量：AC1 早餐菜單同步（9 分類／29 菜品＋官方英文名補齊）
supabase/ac1-lunch-2026-10-05.sql     ← 增量：AC1 午市菜單同步（12 分類／34 菜品＋餐段修正）
```

跑完會建立 5 張表並灌入資料（再加上早餐＋午市增量後：50 分類／188 道菜）：

| 表 | 內容 |
|---|---|
| `canteens` | 3 間食堂 |
| `categories` | 29 個菜品分類（含 `meal` 餐段欄位） |
| `dishes` | 125 道菜 |
| `reviews` | 使用者評論（初始為空） |
| `roll_blacklist` | 「今天吃什麼」抽籤排除清單 |

這個檔案**可重複執行**，不會弄壞既有資料。

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

「今天吃什麼」的視窗裡會顯示**可抽 N 道菜**，那就是排除清單生效之後的實際池子大小
（例：AC1 109 道 − 55 道飲品與非食品 = 54 道）。把整張表刪光 = 不再排除任何東西。

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
| 抽籤要排除哪些菜品／分類 | **Supabase `roll_blacklist` 表**（刪光＝不排除） |
| 是否顯示範例評論 | `js/config.js` 的 `HIDE_SAMPLES` |
| 配色與動效 | `css/style.css` 最上方的 CSS 變數 |

---

## 授權 License

程式碼採用 [MIT License](LICENSE)。

菜品照片版權屬原拍攝者／原網站所有，僅作學術與非商業展示用途。食堂資訊請以 [CityU 官方餐飲頁面](https://www.cityu.edu.hk/zh-hk/directories/catering) 及現場公告為準。
