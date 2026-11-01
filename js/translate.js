/* Eaty — 評論翻譯（中 → 英 / 英 → 中）
 *
 * 為甚麼是純前端：
 *   這個站是 Cloudflare Pages 的靜態站，沒有伺服器可以代打 API，也不能把任何 key 放進前端。
 *   所以只用「免 key、且回應 Access-Control-Allow-Origin: *」的公開端點，
 *   並在瀏覽器端快取，同一段文字只發一次請求。
 *
 * 通道順序：
 *   1. Google translate_a/single（client=gtx，免 key，品質最好）
 *   2. MyMemory（免 key，備援；單次上限約 500 字）
 *   兩個都失敗就回報失敗，**不退回假造或空字串**——寧可顯示「翻譯失敗」。
 *
 * 只在「評論語言 ≠ 介面語言」時才提供翻譯，所以中文介面翻譯英文評論、
 * 英文介面翻譯中文評論，兩個方向自然都會出現。
 */
(function () {
  'use strict';

  var CACHE_KEY = 'eaty:tr:v2';  // v1 的譯文含「#標籤黏字」缺陷，換版讓舊快取自然失效
  var MAX_CHARS = 1200;          // gtx 走 GET，太長的 q 會被 URL 長度截斷
  var MAX_CACHE = 400;           // 快取上限，超過就丟掉最舊的一半
  var TIMEOUT = 9000;

  var mem = null;

  function load() {
    if (mem) return mem;
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      mem = raw ? JSON.parse(raw) : {};
      if (!mem || typeof mem !== 'object') mem = {};
    } catch (e) {
      mem = {};                  // 私密模式／配額爆掉：只留記憶體快取
    }
    return mem;
  }

  function save() {
    try {
      var keys = Object.keys(mem);
      if (keys.length > MAX_CACHE) {
        var next = {};
        keys.slice(keys.length - Math.floor(MAX_CACHE / 2)).forEach(function (k) { next[k] = mem[k]; });
        mem = next;
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(mem));
    } catch (e) { /* 寫不進去就算了，功能不受影響 */ }
  }

  /* djb2：只需要穩定、短、不用加密，碰撞機率在這個量級可忽略 */
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  function keyOf(text, lang) { return lang + ':' + hash(text); }

  /* ── 井號標籤（#份量少、#抵食）───────────────────────────────────────────
   *
   * Google 把「#xxx」當成 hashtag 整體處理，中英之間不會補空格，
   * 所以「#中規中矩 一般」會翻成「#moderatelyaverage」——標籤和正文黏成一串。
   *
   * 做法：送翻前把 #標籤 換成 [標籤]。方括號 Google 會原樣保留、並把裡面的字當普通句子翻
   * （實測「[Small portion] [Not worth eating]」），翻完再換回來並補回空白。
   * 原文自己就有 [ ] 時不做這層保護，否則還原會誤傷。
   */
  var TAG_RE = /[#＃]([^\s#＃]+)/g;

  function protectTags(text) {
    var t = String(text || '');
    var on = /[#＃]/.test(t) && !/[[\]［］]/.test(t);
    return { on: on, text: on ? t.replace(TAG_RE, function (m, body) { return '[' + body + ']'; }) : t };
  }

  function restoreTags(text) {
    var out = String(text || '')
      .replace(/[[［][ \t]*/g, '#')      // [  → #（不吃換行）
      .replace(/[ \t]*[\]］]/g, ' ');    // ]  → 一個空白，標籤與後文分開
    return out
      .split('\n')
      .map(function (line) {
        return line
          .replace(/[ \t]{2,}/g, ' ')
          .replace(/([^\s#])#/g, '$1 #') // 標籤前留一個空白
          .replace(/[ \t]+([,.!?;:，。！？；：、）)\]」』])/g, '$1') // 標點前不留空格
          .replace(/^[ \t]+|[ \t]+$/g, '');
      })
      .join('\n')
      .trim();
  }

  /** 判斷文字主要語言：'zh' 或 'en'。混寫時以中文字數佔比為準。 */
  function detectLang(text) {
    var t = String(text || '');
    var cjk = (t.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
    if (!cjk) return 'en';
    var latin = (t.match(/[A-Za-z]/g) || []).length;
    return cjk >= latin * 0.5 ? 'zh' : 'en';
  }

  /** 這段文字需要翻譯嗎？（空字串、或本來就是介面語言 → 不需要） */
  function need(text, uiLang) {
    var t = String(text || '').trim();
    return !!t && detectLang(t) !== uiLang;
  }

  function cached(text, lang) {
    var v = load()[keyOf(String(text || '').trim(), lang)];
    return typeof v === 'string' && v ? v : null;
  }

  async function fetchJson(url) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), TIMEOUT) : null;
    try {
      const r = await fetch(url, ctl ? { signal: ctl.signal } : undefined);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async function viaGoogle(text, to) {
    const u = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=' +
      encodeURIComponent(to) + '&q=' + encodeURIComponent(text);
    const j = await fetchJson(u);
    // 回傳是 [[[譯文, 原文, ...], [下一段...]], ...]，長句會被切成多段，要串回去
    const out = ((j && j[0]) || []).map((s) => (s && s[0]) || '').join('').trim();
    if (!out) throw new Error('empty');
    return out;
  }

  async function viaMyMemory(text, to) {
    const pair = to === 'en' ? 'zh-TW|en' : 'en|zh-TW';
    const u = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) +
      '&langpair=' + encodeURIComponent(pair);
    const j = await fetchJson(u);
    const out = j && j.responseData && j.responseData.translatedText;
    if (!out || /^MYMEMORY WARNING/i.test(out)) throw new Error('empty');
    return String(out).trim();
  }

  /** translate(text, 'en'|'zh') → Promise<string> */
  async function translate(text, to) {
    const src = String(text || '').trim();
    if (!src) return '';
    const hit = cached(src, to);
    if (hit) return hit;

    const prot = protectTags(src);
    const q = prot.text.length > MAX_CHARS ? prot.text.slice(0, MAX_CHARS) : prot.text;
    let out;
    try {
      out = await viaGoogle(q, to);
    } catch (e1) {
      out = await viaMyMemory(q, to);   // 第一條不通才走備援，兩條都失敗就往外丟
    }
    if (prot.on) out = restoreTags(out);
    load()[keyOf(src, to)] = out;
    save();
    return out;
  }

  window.EatyTranslate = {
    detectLang: detectLang,
    need: need,
    cached: cached,
    translate: translate,
    // 供測試用：拆開驗「標籤保護／還原」而不必真的打 API
    protectTags: protectTags,
    restoreTags: restoreTags,
  };
})();
