/* Eaty — 多大學版本 · 大學清單
 *
 * 每個大學一筆。新增大學時：
 *   1. 在這裡加一筆
 *   2. 在 js/data/ 新增 <uni>.js（canteens / categories / dishes）
 *   3. 到 js/data/index.js 把新檔案掛上去
 *
 * 欄位：
 *   id          站內唯一代號（同時是 localStorage 的 key）
 *   short       顯示用的簡寫（CityU / PolyU / HKBU / HKU）
 *   zh / en     校名
 *   cityZh/cityEn  所在城市（暫時都是香港）
 *   taglineZh/En   hero 副標
 *   heroDishId  hero 主圖要用的菜品 id（找不到就退回「第一道有相片的菜」）
 *   officialUrl 官方餐飲頁（頁尾連結）
 *   noteZh/En   hero 下方那行小字
 *   color       校色（對應 style.css 的 --ac1…--ac8）；首頁大學卡用它畫徽章與漸層
 *   photo       首頁大學卡的照片（16:9，1200×675，放 assets/uni/<id>.jpg）；
 *               留空則自動退回「校色漸層 + 巨大幽靈短名」的無圖版本
 *   photoCredit 照片出處（Wikimedia Commons 檔名／授權），只作記錄用，不上畫面
 */
window.EATY_UNIVERSITIES = [
  {
    id: 'cityu',
    short: 'CityU',
    zh: '香港城市大學',
    en: 'City University of Hong Kong',
    cityZh: '香港',
    cityEn: 'Hong Kong',
    taglineZh: '城大覓食指南',
    taglineEn: 'CityU Canteen Guide',
    heroDishId: 'ac1-roast-recommend-dish-4',
    officialUrl: 'https://www.cityu.edu.hk/zh-hk/directories/catering',
    noteZh: 'AC1 官方菜單已完整收錄；AC2／AC3 為代表性菜品，陸續補充。',
    noteEn: "AC1's official menu is fully listed; AC2/AC3 entries are representative and growing.",
    color: 'ac1',
    photo: 'assets/uni/cityu.jpg',
    photoCredit: 'Wikimedia Commons · 香港城市大學 City University of Hong Kong - panoramio (1).jpg',
  },
  {
    id: 'hku',
    short: 'HKU',
    zh: '香港大學',
    en: 'The University of Hong Kong',
    cityZh: '香港',
    cityEn: 'Hong Kong',
    taglineZh: '港大覓食指南',
    taglineEn: 'HKU Canteen Guide',
    heroDishId: 'hku-cym-1100030003',
    officialUrl: 'https://www.hku.hk/',
    noteZh: '兩間食堂的菜單皆擷取自港大官方點餐系統，為真實資料。',
    noteEn: 'Both canteens are real — menus come from HKU\'s official ordering system.',
    color: 'ac4',
    photo: 'assets/uni/hku.jpg',
    photoCredit: 'Wikimedia Commons · Main Building HKU 20100926 03.JPG · CC BY-SA 3.0 · Ka-Fai, So',
  },
];
