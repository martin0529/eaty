/* 城大搵食指南 CityU Eats — 評論儲存層
 *
 * 兩個 Store 實作同一個介面：
 *   list()            → Promise<Array<review>>  所有評論（含範例）
 *   add(review)       → Promise<review>         新增一則
 *   remoteAvailable() → boolean
 *
 * review: { id, dishId, rating(1-5), verdict('must'|'ok'|'avoid'),
 *           nickname, text, created(ISO), sample? }
 *
 * 預設 LocalStore：每個瀏覽器自己的 localStorage，開箱即用。
 * 填好 config.js 的 Supabase 金鑰後自動切 SupabaseStore（全校共享）。
 */
(function () {
  'use strict';
  const CFG = window.CITYU_EATS_CONFIG;
  const DATA = window.CITYU_EATS_DATA;

  /* ── 共用工具 ─────────────────────────────── */

  function uid() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function samplesHidden() {
    return CFG.HIDE_SAMPLES || localStorage.getItem(CFG.SAMPLES_KEY) === '1';
  }

  function sampleReviews() {
    if (samplesHidden()) return [];
    return DATA.sampleReviews.map((r) => ({ ...r, sample: true }));
  }

  function isValidReview(r) {
    return (
      r && DATA.dishes.some((d) => d.id === r.dishId) &&
      Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 &&
      ['must', 'ok', 'avoid'].includes(r.verdict) &&
      typeof r.text === 'string' && r.text.trim().length > 0
    );
  }

  /* ── LocalStore（預設）─────────────────────── */

  function LocalStore() {}
  LocalStore.prototype.remoteAvailable = function () { return false; };
  LocalStore.prototype._read = function () {
    try {
      const raw = localStorage.getItem(CFG.STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : { v: 1, reviews: [] };
      return Array.isArray(parsed.reviews) ? parsed.reviews : [];
    } catch (e) { return []; }
  };
  LocalStore.prototype._write = function (reviews) {
    localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify({ v: 1, reviews }));
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

  /* ── SupabaseStore（填金鑰後啟用）──────────── */

  function SupabaseStore(url, key) {
    this.url = url.replace(/\/$/, '');
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
      `${this.url}/rest/v1/${this.table}?select=*&order=created.desc&limit=500`,
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

  /* ── 選擇 Store ───────────────────────────── */

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
      // 菜品判定 = 多數 verdict（平手 → 不顯示）
      let verdict = null;
      const max = Math.max(verdictCount.must, verdictCount.ok, verdictCount.avoid);
      if (max > 0) {
        const winners = ['must', 'ok', 'avoid'].filter((v) => verdictCount[v] === max);
        if (winners.length === 1) verdict = winners[0];
      }
      // 避雷傾向：避雷票佔比
      stats[dishId] = {
        count, avg, dist, verdict,
        avoidRatio: count ? verdictCount.avoid / count : 0,
        mustRatio: count ? verdictCount.must / count : 0,
      };
    }
    return stats;
  }

  window.CityuEatsReviews = { store, aggregate, samplesHidden, toggleSamples() {
    const next = samplesHidden() ? '0' : '1';
    localStorage.setItem(CFG.SAMPLES_KEY, next);
    return !samplesHidden();
  } };
})();
