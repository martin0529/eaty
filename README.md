# Eaty — 香港校園食堂指南 · HK Campus Canteen Guide（多大學版本）

> **v2.0.0 起已與單校版合併**：這個目錄就是唯一的正式版本。
> 菜單、分類、食堂、大學清單與評論全部放在 Supabase，本地 `js/data/*.js` 只作離線後備。
>
> **關於名字**：v1.4.0 一度改叫 **Mess**（mess hall 的食堂本義），v2.1.0 **改回原來的 Eaty** ——
> 這個名字用了整個 M3，對外累積的認知不該中途換掉。

收錄香港各間大學的食堂菜單與評價，目前有 **香港城市大學（CityU）** 與 **香港大學（HKU）**。
導覽是三層的：**首頁選大學 → 該校食堂列表 → 食堂菜單**。

> ✅ **資料狀態**（2026-10-31 · v2.1.0）：
> **全部是真實菜單，站上沒有任何虛構資料。** CityU 5 間食堂（486 道，AC1 為官方完整菜單）；
> HKU 2 間食堂（297 道，CYM 與黃克競，抄錄自官方點餐系統 `now.order.place`／Aigens 平台，
> 中英雙語、價錢與相片都來自官方 API）。
> 示範用的 **PolyU（48 道）與 HKBU（1,689 道）已移出打包範圍**，檔案封存在 `js/data/archive/`。

純靜態網站：**沒有建置步驟、沒有框架、沒有 `npm install`**——打開 `index.html` 就能跑，離線也完全可用。

### 主要功能

**v2.2.1：修正翻譯時「#標籤」與正文黏在一起**

- 症狀：`#中規中矩 一般` 翻成英文變成 `#moderatelyaverage`，標籤和後面的字黏成一串。
- 原因：Google 把 `#xxx` 當成 hashtag 整體處理，中英之間不會補空白。
- 做法：送翻前把 `#標籤` 換成 `[標籤]`（Google 會原樣保留、並把裡面的字當普通句子翻），
  翻完還原成 `#`、標籤後面補一個空白，再把「字#」補成「字 #」、清掉標點前的多餘空白。
  原文自己就有方括號時不做這層保護，避免誤還原。譯文快取版本升到 `eaty:tr:v2`，舊的黏字結果自然失效。

**v2.2.0：評論翻譯（中 ⇄ 英）**

- 評論區多一顆「翻譯」鈕：**中文留言翻英文、英文留言翻中文**，原文一律保留在譯文上方。
- 只在「留言語言 ≠ 介面語言」時出現，所以同一頁不會滿是翻譯鈕；純星級、沒文字的評論也不給。
- 譯文下方標「機器翻譯」，避免被誤認成使用者自己寫的。
- 純前端：站是 Cloudflare Pages 靜態站，沒有伺服器可以代打 API，也不能把 key 放前端。
  因此走**免 key 且回 `Access-Control-Allow-Origin: *`** 的公開端點：
  Google `translate_a/single`（client=gtx）優先，失敗退 MyMemory。
- 結果快取在 `localStorage`（`eaty:tr:v2`，上限 400 條），同一段文字只會發一次請求；
  收起再展開、重新載入都不會重打。兩條通道都失敗時顯示「翻譯失敗」，**不假造內容**。
- `.quote-card` 由 `<button>` 改成 `div[role=button]`（卡片內要放翻譯鈕，按鈕不能嵌套），
  並補回 Enter / Space 的鍵盤操作。

**v2.1.2：HKU 的餐段標記補回雲端**

- HKU 兩個食堂（CYM 156 道、黃克競 141 道）**看不到「早餐／午餐／下午茶／晚餐」頁籤**，
  原因是 `categories.meal` 在 Supabase 裡 60 個分類全部是空的——本地 `js/data/hku.js` 一直有標，
  但上線讀雲端，空值就把整條餐段頁籤吃掉了。
- 已把 60 個分類的餐段寫回資料庫（`meal` 用逗號分隔，可跨段，例如「小食」＝ 下午茶、
  「單售產品」＝ 全日）。現在兩間食堂都是五個頁籤：全日／早餐／午餐／下午茶／晚餐。

**v2.1.1：補齊 133 道菜的英文名**

- 英文模式下的避雷榜有幾行只剩「AC3 · $46」，菜名是空的——因為這批菜（AC1 8 道、AC3 125 道）
  在資料庫裡的 `en` 是空字串。**已全部補上正式英文名**，`select count(*) from dishes where trim(en)=''` 現在是 0。
- 前端也加了兩層防護：`I18N.pick()` 遇到**空字串**（不只是 null）會退回另一種語言；
  避雷榜與菜品卡的副名改成「只印另一種語言」，相同或空白就不印——否則英文模式下會把同一個英文名印兩次。

**v2.1.0：品牌回歸、真實場地照、導覽復原**

- **品牌改回 Eaty**：頁首、hero、頁尾、`<title>` 全部復原；內部識別碼（`EATY_*`、`eaty:*`）本來就沒換過。
- **食堂卡換真實場地照**：AC1／AC2／AC3／CYM／黃克競改用自己的食堂內部照（部分來自 Wikimedia Commons，
  CC 授權；CYM 與黃克競另有 HKU 餐飲處的官方介紹頁作對照）。**5380 Cafe 找不到可用的場地照 → 留白**，
  前端自動用校色文字佔位，不拿不相關的食物照充數。
- **hero 那碗飯改成該校主打菜自己的照片**：以前不管哪間學校都放同一張 `assets/v7/hero-bowl.jpg`，
  HKU 的燒味雙拼飯因此配了一碗牛腩麵。CityU 的主打菜同時換成「麻辣肉丁 ‧ 醬油雞髀飯」
  （`ac1-roast-recommend-dish-4`）—— 原本用的鴨腿湯河粉照片是印滿大字的海報圖，
  放大成圓形主圖時字比食物搶眼；換過一次分類橫幅後仍與菜名對不上，最後改用這道菜自己的官方照片。
- **首頁說明改成收錄數字**：「全站已收錄 2 間大學、7 間食堂、749 道菜；菜單抄錄自官方點餐平台與現場菜牌。」
  數字直接寫進句子（舊版另起一行寫同一組數字，等於講兩次）。
- **導覽復原並加一項**：食堂／**今日熱門**／避雷榜／最新評論。這間學校還沒有評論時，
  今日熱門與避雷榜會自動變灰（HKU 目前就是 0 則）。
- **大學切換器加了滑動指示器**：墨黑膠囊從舊鈕滑到新鈕（420ms `--ease-settle`），
  不再是「兩顆按鈕同時換色」；不重建 DOM，所以動畫不會被路由切換打斷。

**v2.0.0：與單校版合併**

- **Supabase 成為唯一真相**：`universities / canteens / categories / dishes / roll_blacklist` 全部放資料庫，
  啟動時抓一次；抓不到（離線／RLS／逾時）就整批退回本地 `js/data/*.js`，不會出現半殘畫面。
- **評論改成全校／跨校共享**：從 localStorage 改為寫入 Supabase `reviews` 表，M3 的 152 則真實評論延續使用。
- **資料庫加入大學維度**：`canteens / categories / dishes` 多了 `uni` 欄，另建 `universities` 表。
- **範圍收斂為 CityU ＋ HKU**；PolyU／HKBU 移出（見下面「已封存的示範資料」）。

**資料層（v1.5.0）**

- **HKU 真實菜單**：CYM 食堂（26 分類／156 道）與黃克競食堂（34 分類／141 道）來自官方點餐系統
  `now.order.place`（Aigens 平台），中英雙語、真實價錢、真實相片。
- **官方點餐入口**：這兩間食堂的食堂卡與分類標題列有「官方網上點餐 ↗」膠囊，直接連到官方點餐頁。
- **招牌標籤**：`signature` 只給官方 `soldQty` 各食堂前 3 名（飲品不計），不是憑感覺挑的。

<details>
<summary>怎麼再抓一間食堂（點開看）</summary>

```bash
# 1. 菜單（locale=default 中文、locale=en 英文；後者是真英文菜名）
curl -s "https://aigensstoreapp.appspot.com/api/v1/menu/store/<storeId>.json?locale=default&open=true&menu=prekiosk&groupId=1000&country=hk" -o menu_zh.json
curl -s "https://aigensstoreapp.appspot.com/api/v1/menu/store/<storeId>.json?locale=en&open=true&menu=prekiosk&groupId=1000&country=hk" -o menu_en.json
```

- `now.order.place` 前端頁面有 Cloudflare，**直接爬會 403**；但上面這支 API 沒有，可以直接 curl。
- **Aigens 的模型**：`category → groupIds[] → groups[] → items[]`。
  **每個分類的第一個 group 才是菜品**，其餘 group 是「配碼／餐飲品／堂食外賣」等選項群組，不能收。
- 「外賣包裝」「其他」（餐具、餐盒）不匯入；重複分類只收一組。
- 圖片：`storage.googleapis.com`、`lh3.googleusercontent.com` 正常；`content.aigens.com` **部分 hash 已 404**，要逐條測。
- 詳見 `handover/updates/2026-10-23-eaty-multi-v1.5.0.md`。

</details>

**設計層**

- **品牌**：站名 **Eaty**（v2.1.0 起；v1.4.0～v2.0.0 曾叫 **Mess**）。
- **去掉眉題**：原本每個區塊都是「英文小眉題 ＋ 大標題 ＋ 副標」三層，掃視要跨三個層級；
  現在標題自己承重，副標只補一句話。全站 `.kicker` 已清零，勿再加回。
- **校色識別系統**：四間大學各一個識別色，只出現在「你正在看哪所學校」的地方 ——
  頁首品牌圓點、麵包屑校名、大學卡膠囊與標語、食堂卡 hover 邊框、hero 大色塊。
  首頁（未選校）維持品牌紅 `#CE2F1F`，不帶任何校色。
- **動效**：路由切換用 View Transitions（舊畫面 260ms 向上淡出、新畫面 420ms 淡入）、
  首頁統計數字從 0 滾上去、大學卡隨指標微傾斜（≤5°）、校園照以 `clip-path` 擦開。
  全部走 `transform / opacity / clip-path`，並尊重 `prefers-reduced-motion`。

**功能層**

- **三層導覽**：首頁 4 張大學卡（16:9 校園照、校名疊在照片上、食堂數／菜品數、測試資料標記）→
  大學頁列出該校食堂 → 食堂頁看完整菜單。麵包屑「所有大學／校名／食堂」隨時可以往回跳。
- **食堂地圖**：每間食堂都有菜單、價錢、現場照片，以及「官方網上點餐」入口。
- **餐段 × 分類篩選**：早餐／午餐／下午茶／晚餐，再按分類細分；可依「最多評論／最高評分／價錢」排序。
- **快速評分（兩步）**：按「必食 5 星／普通 3 星／避雷 1 星」只是**選取**，畫面下方會出現
  「已選「X」，確定送出？」與「確認送出／取消」。**再按一次確認才真的寫入** —— 誤觸不會留下錯的評分。
- **預設標籤**：抵食、份量多、好味、太油……共 9 個現成說法，點了自動以 `#標籤` 加進食後感；
  **食後感可以完全留空**，只給星級一樣算數（只給星級的評論會顯示「只給了評分，沒有留言」）。
- **避雷榜**：按「避雷票 ÷ 總評論」排名，並標出樣本數——3 則 100% 跟 30 則 100% 是兩件事。
- **今天吃什麼**：「範圍 × 時段」隨機抽一道菜；飲品甜品自動排除在抽籤池外，只抽目前這間大學的菜。
- **深連結**：`#/u/hku` 直接開某校食堂列表；舊的 `#/canteen/<id>` 連結會自動切到該食堂所屬大學。

---

## 與單校版的分別

v2.0.0 起**兩邊已合併**：本目錄是唯一正式版本；`eaty/`（單校版）保留作歷史對照，不再更新。

| | 合併前 | v2.0.0 |
|---|---|---|
| 資料來源 | 單校版走 Supabase、多校版走本地 JS | **Supabase 唯一真相**，本地為後備 |
| 評論 | 單校版共享、多校版各自本機 | **全部寫入 Supabase**，跨校共享 |
| 導覽 | 單校版首頁直接列食堂 | **三層**：選大學 → 選食堂 → 菜單 |
| 餐段 | 早／午／晚 | 早／午／**下午茶**／晚 |

> 合併的界線：**資料層與評論層取自單校版，介面與路由取自多校版**。

---

## 目錄結構

```
eaty-multi/
├── index.html              # 唯一入口；底部依序載入 config → data/* → menu-data → i18n → reviews → app
├── css/
│   └── style.css           # 全部樣式 + 動效（單檔）
├── js/
│   ├── config.js           # 站點設定：版本、localStorage 鍵、開關
│   ├── data/
│   │   ├── universities.js # 大學清單（CityU / PolyU / HKBU / HKU）
│   │   ├── cityu.js        # CityU 的食堂／分類／菜品
│   │   ├── polyu.js        # PolyU（⚠️ 測試資料：虛構菜單）
│   │   ├── hkbu.js         # HKBU 的食堂／分類／菜品（爬蟲生成）
│   │   ├── hku.js          # HKU（⚠️ 測試資料：虛構菜單）
│   │   └── index.js        # 彙整成 window.EATY_DATA，並定義抽籤黑名單
│   ├── menu-data.js        # 本地載入器：依「目前大學」過濾出作用中的菜單
│   ├── i18n.js             # 中英雙語文案
│   ├── reviews.js          # 評論儲存層（純 localStorage）
│   └── app.js              # 渲染與互動主邏輯
├── assets/                 # 菜品照片（新校暫用既有圖庫照片）
│   └── uni/                # 首頁大學卡照片：cityu / polyu / hkbu / hku .jpg（16:9，1200×675）
└── .crawl/                 # 爬蟲暫存（**不進 git**）：原始 JSON、爬蟲與生成腳本
```

---

## 路由

| Hash | 畫面 | 由誰渲染 |
|---|---|---|
| `#/` | 首頁：選大學（4 張大學卡） | `renderHome()` |
| `#/u/<uniId>` | 該校食堂列表 ＋ 熱門／避雷／最新評論 | `renderUniversity()` |
| `#/canteen/<canteenId>` | 食堂菜單 | `renderCanteen()` |

- 不認得的大學代號（`#/u/nope`）→ 退回 `#/`。
- 舊連結 `#/canteen/<id>` 冷開時，若該食堂屬於另一間大學，會自動 `setUniversity()` 再畫。

---

## 多一個「大學」是怎麼運作的

1. **資料層**：`js/data/index.js` 把各大學的資料檔合成一份 `window.EATY_DATA`，
   原始資料放在 `EATY_DATA.raw`（不變）。
2. **作用中檢視**：`EATY_DATA.canteens / categories / dishes` 是「目前大學」的切片，
   由 `EatyMenu.setUniversity(id)` 就地替換。`app.js` 只讀這三份。
3. **導覽**：首頁大學卡與頁首 `CityU｜PolyU｜HKBU｜HKU` 切換器都會導到 `#/u/<id>`，
   並把選擇存進 `localStorage`（`eaty:uni`）。
4. **手機**：頁首切換器在 ≤760px 收起（四顆按鈕會把語言／隨機鈕推出畫面），
   改由首頁的大學卡與麵包屑導航。

### 新增大學

1. **資料庫（主要途徑）**：`universities` 表加一筆；`canteens / categories / dishes` 加對應列並在 `uni` 欄填新校 id。
   可以照 `work/gen_multi_sql.cjs` 的寫法，由 `js/data/<uni>.js` 產生 SQL 貼進 SQL Editor（HKU 的 297 道就是這樣灌的）。
2. **校色**：`css/style.css` 的「校色」段加 `--uni-<id>` 與 `--uni-<id>-tint`，並把 `id` 加進 `js/app.js` 的 `UNI_IDS`。
   漏了不會壞，只是該校沒有識別色（退回品牌紅）。挑色時注意：顏色要能並置分辨、明度接近、白字 ≥4.5:1。
3. **本地後備**：新增 `js/data/<uni>.js`（`window.EATY_DATA_<UNI>`），在 `js/data/index.js` 的 `SOURCES` 加一行、
   `index.html` 加一個 `<script>`。雲端連不上時，這個檔案就是後備畫面。
4. **飲品分類**加進資料庫 `roll_blacklist`（`kind=category`），否則「今天吃什麼」會抽到飲品。
5. **大學卡照片**放 `assets/uni/<uni>.jpg`（16:9，建議 1200×675）；
   `photo` 留空也不會破圖 —— 會退回「校色漸層 ＋ 巨大幽靈短名」的無圖版本。
6. 菜品照若暫缺，`assets/` 內既有照片可重用；`dishes[].photo` 留空會自動畫文字佔位卡。

**資料欄位**

- `universities[]`: `{ id, short, zh, en, cityZh, cityEn, taglineZh, taglineEn, heroDishId, officialUrl, noteZh, noteEn, color, photo?, photoCredit? }`
  - `color`：**後備欄位**。v1.4.0 起大學卡與校色元件改用 `--uni-<id>`（見 `style.css` 的校色段）；
    若新增大學沒有在 CSS 定義 `--uni-<id>`，才會退回這裡填的 `ac1`–`ac8`
  - `photo`（選填）：首頁大學卡照片路徑。**版面照 16:9 裁切**，主體建議放中間偏上
  - `photoCredit`（選填）：照片出處／授權，只作記錄，不上畫面
  - `noteZh` 含「測試資料」字樣時，該校大學卡會自動掛上「測試資料」標籤
- `canteens`: `{ id, uni, short, zh, en, campusZh, campusEn, bldgZh, bldgEn, hoursZh, hoursEn, factZh, factEn, color, photo?, orderUrl?, alias? }`
  - `color` 可填 `ac1`–`ac8`
  - `orderUrl`（選填）：食堂自己的官方點餐站 → 卡片下方多一顆「官方網上點餐」膠囊
  - `alias`（選填）：食堂卡名字旁邊的小字。留空時自動用「另一語言名稱 → 短名 → 校園名」，
    三者都與主名相同就整塊不顯示，避免「Harmony Lounge / Harmony Lounge」這種自我重複
- `categories`: `{ id, uni, zh, en?, meal, orderUrl? }`
  - `meal`：逗號分隔 `breakfast / lunch / tea / dinner`；**留空＝不分餐**（只在「全日」出現）
  - `en` 可省略 → 英文模式下自動退回 `zh`；中英相同時分類標題不重複顯示英文副名
  - `orderUrl`（選填）：檔口自己的點餐站 → 分類標題列多一顆「網上點餐 ↗」膠囊
- `dishes`: `{ id, uni, canteenId, cat, zh, en?, price, photo?, descZh?, descEn?, tags? }`
  - `tags`: `signature`（招牌）／`spicy`（辣）／`value`（抵食）／`sweet`（甜）
  - `id` 全站唯一；新校建議加校名前綴（`polyu-…`、`hku-…`）

---

## 已封存的示範資料

`js/data/archive/` 裡有兩個**沒有被載入**的舊資料檔：

| 檔案 | 內容 | 性質 |
|---|---|---|
| `polyu.js` | PolyU 3 間食堂／48 道 | ⚠️ 虛構示範資料 |
| `hkbu.js` | HKBU 1,689 道 | 真實抄錄，但已不在站上 |

要恢復就把檔案移回 `js/data/`，並在 `js/data/index.js` 的 `SOURCES` 與 `index.html` 補回對應行。
若要走資料庫（建議），用 `work/gen_multi_sql.cjs` 產生 SQL 灌進去即可。

HKU 原本也有兩間同樣性質的示範食堂（學生會食堂、Global Café，共 30 道），已於 2026-10-31 刪除。

---

## HKBU 菜單怎麼來的

菜單**不是**手抄的，是從浸大官方**線上點餐平台**（後端 `api.aigens.com`）爬下來的：

| 餐飲點 | 點餐平台 | 菜色數 |
|---|---|---|
| Main Canteen（浸大校園餐廳） | <https://csd2.order.place/store/112867> | 134 |
| Harmony Cafeteria | <https://food.order.place/home/store/5768631610769408> | 1555 |

重跑爬蟲（會重新生成 `js/data/hkbu.js`）：

```bash
python .crawl/extract_hkbu.py     # 抓 API → hkbu-menus.json
python .crawl/gen_hkbu_js.py      # hkbu-menus.json → js/data/hkbu.js
```

> ⚠️ **只收「線上點餐平台」的資料**。其餘 11 個餐飲點（Nan Yuan、iCafe、Bistro NTT、Deli…）
> 官方只提供 PDF／圖片菜單，依指示暫不採用，**先留空待補**（網站會顯示「菜單尚未收錄」）。
> ⚠️ 爬蟲過濾了兩類非菜色項：`price = 0` 的餐內選項，與名稱以 `+`／`額外` 開頭的加購項；
> ⚠️ HKBU 舊快照有 15 組「同一菜名出現在兩間食堂」而共用 `id`（`dishById` 取第一筆），
> 這是既有問題，尚未修。

---

## 本地預覽

```bash
python -m http.server 8000     # 或 npx serve .
```

然後打開 <http://localhost:8000>。

---

## 設計系統（v1.4.0）

### 配色三層

| 層 | 只管什麼 | 值 |
|---|---|---|
| 品牌紅 | **動作**：主按鈕、focus ring、文字選取、避雷面板 | `--red #CE2F1F` / `--red-deep #A82718` |
| 校色 | **身份**：頁首圓點、麵包屑校名、大學卡、食堂卡 hover 邊框、hero 色塊 | `--uni-<id>`，由 `applyUniTheme()` 掛上 `:root` |
| 中性 | **紙張與墨**：白 → 兩層暖灰 → 墨黑 | `--bg / --soft / --tile / --line / --meta / --text-2 / --ink` |

兩條禁令：

- 校色**不壓在小字上**（它的明度只夠撐白字與大片色塊）；
- 校色**不用於按鈕**（否則「紅色按鈕」在 CityU 頁會被誤讀成校色，使用者分不清哪個是可點的）。

四校校色與白字對比：

| 大學 | 值 | 白字對比 |
|---|---|---|
| CityU | `#A81E32` 酒紅 | 7.25:1 |
| PolyU | `#8C5A1B` 磚金 | 5.85:1 |
| HKBU | `#23507F` 校藍 | 8.31:1 |
| HKU | `#1C6A4E` 墨綠 | 6.52:1 |

> CityU 官方紅本來就深，要拉成酒紅才跟品牌紅分得開；PolyU 官方也是紅，改用它紅磚校園的磚金，
> 兩校才不會撞色。

### 動效

只有四個 authored moment，其餘一律不加：

1. **路由切換**：`::view-transition-old/new(root)`，舊畫面 260ms 向上淡出、新畫面 420ms 淡入（退場比進場快，不留鬼影）。
2. **數字滾動**：首頁統計從 0 數上去，ease-out cubic 820ms，四張卡錯開 70ms。
3. **大學卡微傾斜**：`pointermove` → rAF 節流 → `rotateX/Y ≤5°`，只掛在 `(hover:hover) and (pointer:fine)`。
4. **照片擦開**：校園照 `clip-path: inset(0 0 9% 0)`，`.in` 時歸零，980ms。

`prefers-reduced-motion` 下全部中和，照片直接給完整狀態（不會停在裁掉 9% 的樣子）。
照片本身**不做 hover 縮放** —— 回饋交給卡片上浮與校色邊框。

---

## 版本號

改版時同時改 `js/config.js` 的 `VERSION` ＋ `index.html` 全部 `?v=`（共 **10 處**：1 個 CSS ＋ 9 個 JS）。
資料結構有變時記得一併考慮 `localStorage` 的舊鍵要不要換。

目前版本：**2.2.1**（2026-11-01）

---

## 版權與免責

- 程式碼 MIT License。
- 菜品照片版權屬原拍攝者／原網站所有，僅作學術與非商業展示。
  **HKU CYM 與黃克競食堂的菜品照**取自該校官方點餐系統（`now.order.place` / Aigens）的公開圖片 CDN。
- **首頁大學卡照片來自 Wikimedia Commons**（CC BY-SA 2.0 / 3.0 / 4.0），
  作者與授權記在各校 `universities[].photoCredit`，需要標示時從那裡取。
- 非官方網站，與任何院校無從屬關係；價錢與供應以食堂現場為準。
