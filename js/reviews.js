/* Eaty — 多大學版本 · 評論儲存層
 *
 * 兩個 Store 實作同一個介面（與單校版相同）：
 *   list()            → Promise<Array<review>>  所有評論
 *   add(review)       → Promise<review>         新增一則
 *   remoteAvailable() → boolean
 *
 * review: { id, dishId, rating(1-5), verdict('must'|'ok'|'avoid'),
 *           nickname, text, created(ISO), sample? }
 *
 * v2.0.0 起預設走 Supabase（全校／跨校共享）；沒填金鑰或金鑰失效時
 * 自動退回 localStorage，網站仍然可用，只是評論不外傳。
 */
(function () {
  'use strict';
  const CFG = window.EATY_CONFIG;
  const DATA = window.EATY_DATA;

  function uid() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function samplesHidden() {
    return CFG.HIDE_SAMPLES || localStorage.getItem(CFG.SAMPLES_KEY) === '1';
  }

  function sampleReviews() {
    if (samplesHidden()) return [];
    const list = Array.isArray(DATA.sampleReviews) ? DATA.sampleReviews : [];
    return list.map((r) => ({ ...r, sample: true }));
  }

  function isValidReview(r) {
    return (
      r && DATA.dishes.some((d) => d.id === r.dishId) &&
      Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 &&
      ['must', 'ok', 'avoid'].includes(r.verdict) &&
      // 食後感可以留空：一鍵評分（只按判定）與「只給星級」都算一票，
      // 只要不超過 600 字就收。門檻壓到最低，留言率才上得去。
      typeof r.text === 'string' && r.text.trim().length <= 600
    );
  }

  /* ── LocalStore（唯一的 Store）─────────────── */

  function LocalStore() {}
  LocalStore.prototype.remoteAvailable = function () { return false; };
  LocalStore.prototype._read = function () {
    try {
      const raw = localStorage.getItem(CFG.REVIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : { v: 1, reviews: [] };
      return Array.isArray(parsed.reviews) ? parsed.reviews : [];
    } catch (e) { return []; }
  };
  LocalStore.prototype._write = function (reviews) {
    localStorage.setItem(CFG.REVIEWS_KEY, JSON.stringify({ v: 1, reviews }));
  };
  LocalStore.prototype.list = async function () {
    return sampleReviews().concat(this._read());
  };
  LocalStore.prototype.add = async function (r) {
    if (!isValidReview(r)) throw new Error('invalid review');
    const review = {
      id: uid(),
      dishId: r.dishId,
      rating: r.rating,
      verdict: r.verdict,
      nickname: (r.nickname || '').trim().slice(0, 24) || '匿名同學',
      text: r.text.trim().slice(0, 600),
      created: new Date().toISOString(),
    };
    const all = this._read();
    all.push(review);
    this._write(all);
    return review;
  };

  /* ── SupabaseStore（填了金鑰就啟用，全校／跨校共享）────── */

  function SupabaseStore(url, key) {
    this.url = String(url).replace(/\/$/, '');
    this.key = key;
    this.table = CFG.SUPABASE_TABLE || 'reviews';
  }
  SupabaseStore.prototype.remoteAvailable = function () { return true; };
  SupabaseStore.prototype._headers = function () {
    return {
      apikey: this.key,
      Authorization: 'Bearer ' + this.key,
      'Content-Type': 'application/json',
    };
  };
  SupabaseStore.prototype.list = async function () {
    const res = await fetch(
      `${this.url}/rest/v1/${this.table}?select=*&order=created.desc&limit=1000`,
      { headers: this._headers() }
    );
    if (!res.ok) throw new Error('supabase list failed: ' + res.status);
    const rows = await res.json();
    const remote = rows.map((row) => ({
      id: row.id,
      dishId: row.dish_id,
      rating: row.rating,
      verdict: row.verdict,
      nickname: row.nickname || '匿名同學',
      text: row.text || '',
      created: row.created,
    }));
    return sampleReviews().concat(remote);
  };
  SupabaseStore.prototype.add = async function (r) {
    if (!isValidReview(r)) throw new Error('invalid review');
    const row = {
      dish_id: r.dishId,
      rating: r.rating,
      verdict: r.verdict,
      nickname: (r.nickname || '').trim().slice(0, 24) || '匿名同學',
      text: r.text.trim().slice(0, 600),
    };
    const res = await fetch(`${this.url}/rest/v1/${this.table}`, {
      method: 'POST',
      headers: { ...this._headers(), Prefer: 'return=representation' },
      body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error('supabase add failed: ' + res.status);
    const saved = (await res.json())[0];
    return {
      id: saved.id, dishId: saved.dish_id, rating: saved.rating,
      verdict: saved.verdict, nickname: saved.nickname,
      text: saved.text, created: saved.created,
    };
  };

  /* ── 選擇 Store：有金鑰走雲端，沒有就退回本地 ────────── */

  const useSupabase = CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY;
  const store = useSupabase
    ? new SupabaseStore(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY)
    : new LocalStore();

  /* ── 聚合：每道菜的評分與判定 ──────────────── */

  function aggregate(reviews) {
    const byDish = {};
    for (const r of reviews) {
      (byDish[r.dishId] = byDish[r.dishId] || []).push(r);
    }
    const stats = {};
    for (const dishId in byDish) {
      const rs = byDish[dishId];
      const count = rs.length;
      const avg = rs.reduce((s, r) => s + r.rating, 0) / count;
      const verdictCount = { must: 0, ok: 0, avoid: 0 };
      const dist = [0, 0, 0, 0, 0];
      for (const r of rs) { verdictCount[r.verdict]++; dist[r.rating - 1]++; }
      let verdict = null;
      const max = Math.max(verdictCount.must, verdictCount.ok, verdictCount.avoid);
      if (max > 0) {
        const winners = ['must', 'ok', 'avoid'].filter((v) => verdictCount[v] === max);
        if (winners.length === 1) verdict = winners[0];
      }
      stats[dishId] = {
        count, avg, dist, verdict,
        avoidRatio: count ? verdictCount.avoid / count : 0,
        mustRatio: count ? verdictCount.must / count : 0,
      };
    }
    return stats;
  }

  window.EatyReviews = {
    store, aggregate, samplesHidden,
    toggleSamples() {
      const next = samplesHidden() ? '0' : '1';
      localStorage.setItem(CFG.SAMPLES_KEY, next);
      return !samplesHidden();
    },
  };
})();
