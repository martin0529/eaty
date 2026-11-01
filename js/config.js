/* Eaty — 多大學版本（Eaty Multi）站點設定
 *
 * v2.0.0 起與單校版合併，這個目錄就是唯一正式版本：
 *   1. 多一個「大學」維度，可在 CityU / HKU 之間切換（資料庫 universities 表）。
 *   2. **資料以 Supabase 為唯一真相**：universities / canteens / categories /
 *      dishes，啟動時由 menu-data.js 抓取；連不上才整批退回本地 js/data/*.js。
 *   3. 評論同樣走 Supabase（reviews 表）；沒有金鑰時退回 localStorage。
 */
window.EATY_CONFIG = {
  // v2.2.0：評論翻譯 —— 中英互譯。只在「留言語言 ≠ 介面語言」時出現「翻譯」鈕，
  //         原文保留、譯文插在下方並標「機器翻譯」。純前端：走免 key 的公開端點
  //         （Google gtx 優先、MyMemory 備援），結果快取在 localStorage，同段文字只打一次。
  // v2.1.0：品牌改回 Eaty；HKU 標語改成「覓食」與 CityU 一致；食堂卡改用真實場地照
  //         （找不到的留白，不拿無關圖充數）；hero 那碗飯改用該校主打菜自己的照片；
  //         首頁說明改成「全站已收錄 N 間大學、N 間食堂、N 道菜」；導覽復原
  //         食堂／避雷榜／最新評論，並在最前面加「今日熱門」；大學切換器改成滑動指示器。
  // v1.5.2：快速評分改成兩步 —— 按下判定只是「選取」，要再按「確認送出」才寫入，
  //         旁邊有「取消」。原本按一下即送出，誤觸無法收回，評價可信度受質疑。
  // v1.5.1：刪掉 HKU 兩間示範食堂（學生會食堂、Global Café，共 30 道虛構菜色、
  //         8 個分類）—— 全站不再有任何非真實的 HKU 資料。HKU 現在只有 CYM 與黃克競。
  // v1.5.0：HKU 換上真實菜單 —— CYM 食堂（store 102858）與黃克競食堂（store 12827）
  //         共 297 道菜，中英雙語、價錢與相片全部來自 order.place 官方 API；
  //         食堂卡與分類標題列的「網上點餐」膠囊直接連到官方點餐頁。
  // v1.4.0：品牌由 Eaty 改為 Mess（中文副名「飯堂」）；全站刪掉英文眉題，
  //         區塊標題自成層級；四校校色改成同明度的印刷色系並做成一套識別系統
  //         （頁首圓點／麵包屑／大學卡／食堂卡），切換大學時顏色會過渡。
  // v1.3.0：首頁大學卡改版 —— 上半 16:9 校園照（assets/uni/），校名壓在照片左下，
  //         下半白底資訊帶放標語與食堂菜品數；沒有照片時自動退回校色漸層。
  // v1.2.0：導覽改成三層 —— 首頁先選大學 → 該校食堂列表 → 食堂菜單。
  //         新增 PolyU 與 HKU（菜單為測試用的虛構資料）。
  // v1.1.0：把單校版（CityU 版 v0.14.1）的功能補回來 —— 一鍵評分、預設標籤、
  //         食後感可留空、檔口點餐、避雷榜評論數、頁尾說明。
  VERSION: '2.2.1',

  /* ── Supabase：資料庫是唯一來源 ──────────────
   * 兩版合併後，菜單、分類、食堂、大學清單與評論全部放在 Supabase，
   * 本地 js/data/*.js 只作為「連不上資料庫」時的離線後備。
   * publishable key 是公開金鑰，安全性由 RLS 保障（anon 只能 select，
   * reviews 額外開放 insert）。
   */
  SUPABASE_URL: 'https://adnownneldfalplbdhvd.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_CxKEG57uh9UR3f6QEGLI0Q__9Q7I46N',
  SUPABASE_TABLE: 'reviews',
  SUPABASE_ROLL_TABLE: 'roll_blacklist',

  // 預設顯示哪間大學（使用者的選擇會存在 localStorage 的 UNI_KEY）
  DEFAULT_UNI: 'cityu',

  // 本地儲存鍵（全部帶 eaty: 前綴，避免與其他專案打架）
  UNI_KEY: 'eaty:uni',                 // 目前選的大學
  LANG_KEY: 'eaty:lang',               // 語言
  REVIEWS_KEY: 'eaty:reviews:v1',      // 使用者評論
  SAMPLES_KEY: 'eaty:hide-samples',    // 是否隱藏範例評論

  // true = 全站永久隱藏範例評論（連頁尾的切換鈕一起收起來）。
  // 多大學版本目前不放種子範例評論（js/data/index.js 的 sampleReviews 為空），
  // 所以「最新評論」區塊在還沒有人留言前不會出現，這是預期行為。
  HIDE_SAMPLES: true,

  // 頁尾「意見回饋 / 補充菜單」外部問卷（Google Form）。
  // 刻意放在站外：站內掛問卷／提示會干擾「自願留言率」的量測。
  // 目前與 CityU 單校版共用同一份表單；要分校統計就換一條連結。
  FEEDBACK_URL: 'https://forms.gle/t9KX8LSuJgEMZ1Ug9',
};
