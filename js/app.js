/* Eaty — 城大搵食指南：應用層（路由、畫面、評論、隨機器）
 * v0.5.0「新鮮白盒 · 動效強化」：渲染層對齊 design/eaty-v7.html 視覺稿。
 *
 * 動效約定
 * ├ 進場由 CSS 關鍵影格驅動（宣告式、可被 prefers-reduced-motion 全域中和）；
 * ├ JS 只負責「決定何時播」——首次載入、進入視口、路由切換、操作回饋；
 * ├ 需要以計時器為準的狀態轉換（modal 退場）不依賴 animationend；
 * └ 所有裝飾性動效在 reduceMotion() 為真時直接跳過。
 */
(function () {
  'use strict';
  const DATA = window.CITYU_EATS_DATA;
  const I18N = window.I18N;
  const Reviews = window.CityuEatsReviews;
  const store = Reviews.store;

  /* 使用者偏好：減少動態（不預先快取 matches，讓系統設定切換即時生效） */
  const REDUCE_Q = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    reviews: [],
    stats: {},
    filters: {},          // canteenId → { cat, sort }
    route: { view: 'home', canteenId: null },
    modalReturnFocus: null,
  };

  /* ── 小工具 ─────────────────────────────── */

  const appEl = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');

  const dishById = (id) => DATA.dishes.find((d) => d.id === id);
  const canteenById = (id) => DATA.canteens.find((c) => c.id === id);
  const catById = (id) => DATA.categories.find((c) => c.id === id) || { zh: id, en: id };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmtPrice(p) {
    return '$' + (Number.isInteger(p) ? p : +p.toFixed(1));
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    const zh = I18N.lang() === 'zh';
    return zh
      ? `${d.getMonth() + 1}月${d.getDate()}日`
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  /* ── 動效工具 ───────────────────────────── */

  const reduceMotion = () => REDUCE_Q.matches;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /** 觸發一次性「彈跳」回饋（chip / 星等 / 判定鈕）；純裝飾，不承載狀態。 */
  function popOnce(el, ms) {
    if (!el || reduceMotion()) return;
    el.classList.add('is-pop');
    setTimeout(() => el.classList.remove('is-pop'), ms || 420);
  }

  /** 重新觸發一個只播一次的動畫（例如錯誤訊息抖動）。 */
  function retrigger(el, cls) {
    if (!el || reduceMotion()) return;
    el.classList.remove(cls);
    void el.offsetWidth;          // 強制 reflow，讓同一個動畫能重新開始
    el.classList.add(cls);
  }

  /* ── 圖標（同一套 1.8 stroke）──────────────── */

  const ICONS = {
    star: '<path d="M12 2.8l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.8 3l1.1-6.4L2.7 9.5l6.4-.9z"/>',
    bolt: '<path d="M13 2.5L4.8 13.4h5.7L9.6 21.5l8.6-11.4h-5.9z"/>',
    pin: '<path d="M12 21.5s-7-5.6-7-11.2a7 7 0 1 1 14 0c0 5.6-7 11.2-7 11.2z"/><circle cx="12" cy="10" r="2.6"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.4 2.1"/>',
    dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.4" cy="8.4" r="1.35" class="dot"/><circle cx="15.6" cy="15.6" r="1.35" class="dot"/><circle cx="15.6" cy="8.4" r="1.35" class="dot"/><circle cx="8.4" cy="15.6" r="1.35" class="dot"/>',
    back: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    chevR: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    ext: '<path d="M13.5 5.5H18.5V10.5M18.5 5.5L11 13M17 13.5v5H5.5V7h5"/>',
    flame: '<path d="M12 2.5s4.8 4.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-1.9.9-3.6 1.9-4.9.3 1.1 1 2 1.9 2.5-.3-2.4 0-4.7 1-6.8z"/>',
    arrow: '<path d="M5 12h13.5M13 5.5L19.5 12 13 18.5"/>',
  };
  const FILLED = ['star', 'bolt', 'flame'];
  function icon(name, cls) {
    const fill = FILLED.includes(name) ? ' icn-fill' : '';
    return `<svg class="icn${fill} ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
  }

  /* ── hero 點綴（綠葉為自繪 SVG，辣椒為去背照片）── */
  const LEAF_A = '<path d="M14 92C10 52 30 14 88 6c8 44-16 82-66 88-3 .4-5.6.1-8-2z" fill="#3E9B4F"/><path d="M22 86C30 58 50 30 78 16" stroke="#2C7A3B" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M40 66c6-2 12-2 17 0M52 48c6-2 12-2 17 0" stroke="#2C7A3B" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  const LEAF_B = '<path d="M50 4c30 22 40 52 28 78-8 16-28 20-42 10C14 76 16 40 50 4z" fill="#57AE63"/><path d="M50 16v74" stroke="#2C7A3B" stroke-width="3.2" stroke-linecap="round"/><path d="M50 36c8 0 15 3 20 9M50 56c-8 0-15 3-20 9" stroke="#2C7A3B" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  function leafSvg(cls, body) {
    return `<svg class="leaf ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  /* ── 資料載入 ────────────────────────────── */

  async function loadReviews() {
    try {
      state.reviews = await store.list();
    } catch (e) {
      state.reviews = [];
    }
    state.stats = Reviews.aggregate(state.reviews);
  }

  function dishReviews(dishId) {
    return state.reviews
      .filter((r) => r.dishId === dishId)
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  function hotPicks(n) {
    return DATA.dishes
      .map((d) => {
        const s = state.stats[d.id];
        if (!s || s.count < 1) return null;
        const score = (s.avg * s.count + 3.6 * 3) / (s.count + 3); // 貝葉斯平滑
        return { d, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map((x) => x.d);
  }

  function avoidList(n) {
    return DATA.dishes
      .map((d) => {
        const s = state.stats[d.id];
        if (!s || s.count < 2 || !(s.avoidRatio >= 0.34 || s.verdict === 'avoid')) return null;
        return { d, s };
      })
      .filter(Boolean)
      .sort((a, b) => b.s.avoidRatio - a.s.avoidRatio || a.s.avg - b.s.avg || b.s.count - a.s.count)
      .slice(0, n)
      .map((x) => x.d);
  }

  /* ── 共用元件 ────────────────────────────── */

  function reviewCountText(n) {
    return I18N.lang() === 'zh' ? `${n}則評論` : (n === 1 ? `${n} review` : `${n} reviews`);
  }

  function tagLabel(tag) {
    const known = { signature: 'tagSignature', spicy: 'tagSpicy', value: 'tagValue', sweet: 'tagSweet' };
    return known[tag] ? I18N.t(known[tag]) : tag;
  }

  function starsSvg(avg) {
    const pct = Math.max(0, Math.min(100, (avg / 5) * 100));
    const row = (cls) =>
      `<span class="${cls}">${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')}</span>`;
    // 金色星層用 clip-path 揭示（--fill），比動畫 width 更省：不觸發 layout
    return `<span class="stars" aria-hidden="true">${row('stars-row')}<span class="stars-fill" style="--fill:${pct.toFixed(1)}%">${row('stars-row')}</span></span>`;
  }

  function ratingLine(dishId) {
    const s = state.stats[dishId];
    if (!s || !s.count) {
      return `<span class="rating-line muted">${esc(I18N.t('noReviewsYet'))}</span>`;
    }
    return `<span class="rating-line"><b class="avg">${s.avg.toFixed(1)}</b>${starsSvg(s.avg)}<span class="count">${reviewCountText(s.count)}</span></span>`;
  }

  function verdictTag(verdict) {
    if (!verdict) return '';
    const key = { must: 'verdictMust', ok: 'verdictOk', avoid: 'verdictAvoid' }[verdict];
    return `<span class="stamp stamp-${verdict}">${esc(I18N.t(key))}</span>`;
  }

  /* 暱稱 → avatar 底色（穩定雜湊） */
  const AV_COLORS = ['#C63325', '#2E7D42', '#8A6BB8', '#B67E0F', '#33689B', '#7A4A98', '#4A6B2F', '#A0522D'];
  function avColor(nick) {
    let h = 0;
    for (const ch of String(nick || '')) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return AV_COLORS[h % AV_COLORS.length];
  }
  function avatar(nick, extraCls) {
    const ch = (String(nick || '?').trim().charAt(0) || '?').toUpperCase();
    return `<span class="review-av ${extraCls || ''}" style="background:${avColor(nick)}" aria-hidden="true">${esc(ch)}</span>`;
  }

  function dishPhoto(dish, cls) {
    if (dish.photo) {
      return `<img class="${cls}" src="${esc(dish.photo)}" alt="${esc(I18N.pick(dish))}" loading="lazy">`;
    }
    const cat = catById(dish.cat);
    const name = I18N.pick(dish) || '?';
    const parts = name.split(/[‧・·]/).map((p) => p.trim()).filter(Boolean);
    const glyph = (parts.length > 1 ? parts.join('<br>') : name.slice(0, 4));
    return `<span class="${cls} dish-ph" role="img" aria-label="${esc(name)}">
      <span class="dish-ph-glyph">${glyph}</span>
      <span class="dish-ph-cat">${esc(I18N.pick(cat))}</span></span>`;
  }

  /** i 有值時附上 --i，供 .grid-enter 逐項錯開進場使用 */
  function dishCard(dish, i) {
    const s = state.stats[dish.id];
    const idx = typeof i === 'number' ? ` style="--i:${i}"` : '';
    return `
      <button class="dish-card reveal"${idx} data-action="open-dish" data-id="${dish.id}">
        <span class="dish-card-media">
          ${dishPhoto(dish, 'dish-card-img')}
          <span class="price-tag"><span class="p">${fmtPrice(dish.price)}</span></span>
          ${dish.tags && dish.tags.includes('signature') ? `<span class="sig-flag">${esc(I18N.lang() === 'zh' ? '招牌' : 'SIGNATURE')}</span>` : ''}
        </span>
        <span class="dish-card-body">
          <span class="dish-card-name">${esc(I18N.pick(dish))}<span class="dish-card-en">${esc(I18N.lang() === 'zh' ? dish.en : dish.zh)}</span></span>
          ${verdictTag(s && s.verdict)}
          ${ratingLine(dish.id)}
        </span>
      </button>`;
  }

  function sectionHead(kick, titleKey, subKey, action) {
    return `
      <div class="section-head reveal">
        <div>
          <p class="kicker">${esc(kick)}</p>
          <h2 class="section-title">${esc(I18N.t(titleKey))}</h2>
          ${subKey ? `<p class="section-sub">${esc(I18N.t(subKey))}</p>` : ''}
        </div>
        ${action || ''}
      </div>`;
  }

  /* ── 畫面：首頁 ──────────────────────────── */

  function heroDish() {
    return DATA.dishes.find((d) => d.zh === '鴨腿湯河粉')
      || DATA.dishes.find((d) => (d.photo || '').includes('noodle-hofun'))
      || DATA.dishes.find((d) => d.photo);
  }

  function heroPhotos() {
    const hd = heroDish();
    const c = hd ? canteenById(hd.canteenId) : null;
    const s = hd ? state.stats[hd.id] : null;
    const stamp = s && s.verdict
      ? `<span class="hero-stamp stamp-${s.verdict}">${esc(I18N.t({ must: 'verdictMust', ok: 'verdictOk', avoid: 'verdictAvoid' }[s.verdict]))}</span>`
      : '';
    const dishLink = hd
      ? `<button class="bowl-img" data-action="open-dish" data-id="${hd.id}" aria-label="${esc(I18N.pick(hd))}">
           <img src="assets/v7/hero-bowl.jpg" alt="${esc(hd.photo ? '' : I18N.pick(hd))}">
         </button>`
      : '';
    const kicker = c
      ? esc(I18N.lang() === 'zh' ? `${c.short} ${c.zh}・今日主打` : `${c.short} ${c.en} · Today's pick`)
      : esc(I18N.t('heroKicker'));
    return { hd, c, kicker, dishLink, stamp };
  }

  /* hero 的分層進場只在「首次載入」播一次：語言切換、從飯堂頁返回都不重播，
     避免使用者只是想換語言卻被整頁重演一次開場。 */
  let heroEntered = false;

  function renderHero() {
    const { hd, kicker, dishLink, stamp } = heroPhotos();
    const ac1 = DATA.dishes.filter((d) => d.canteenId === 'ac1').length;
    const enterAttr = heroEntered || reduceMotion() ? '' : ' data-enter';
    heroEntered = true;
    appEl.innerHTML = `
      <section class="hero"${enterAttr}>
        <svg class="hero-blob" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M470 -60 C 300 -20 160 100 118 275 C 76 450 150 610 320 700 C 470 778 660 790 810 720 C 890 683 950 635 1000 575 L 1000 -60 Z" fill="#CE2F1F"/></svg>
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <p class="kicker">${kicker}</p>
            <h1 class="hero-title">Eaty<i>.</i></h1>
            <p class="hero-tagline">${esc(I18N.t('heroTagline'))}</p>
            <p class="hero-note">${esc(I18N.lang() === 'zh'
              ? `AC1 官方菜單已收錄 ${ac1} 項；AC2／AC3 為代表性菜品，陸續補充。`
              : `AC1's official menu is fully listed (${ac1} items); AC2/AC3 entries are representative and growing.`)}</p>
            <div class="hero-actions">
              <button class="btn btn-ink" data-action="open-random">${icon('dice')}${esc(I18N.t('heroCta2'))}</button>
              <a class="btn btn-ghost" href="#/" data-scroll="canteens">${esc(I18N.t('heroCta1'))}</a>
            </div>
          </div>
          <div class="hero-art">
            <div class="bowl">
              ${dishLink}
              ${hd ? `<div class="price-tag">
                  <span class="p">${fmtPrice(hd.price)}</span>
                  <span class="d">${esc(I18N.pick(hd))}${(I18N.lang() === 'zh' ? hd.en : hd.zh) && (I18N.lang() === 'zh' ? hd.en : hd.zh) !== I18N.pick(hd) ? `<small>${esc(I18N.lang() === 'zh' ? hd.en : hd.zh)}</small>` : ''}</span>
                </div>` : ''}
              ${stamp}
              <img class="garnish chili-1" src="assets/v7/chili-a.png" alt="" aria-hidden="true">
              <img class="garnish chili-2" src="assets/v7/chili-b.png" alt="" aria-hidden="true">
              ${leafSvg('leaf-1', LEAF_A)}
              ${leafSvg('leaf-2', LEAF_B)}
              ${leafSvg('leaf-3', LEAF_A)}
              <span class="sprk sp-1"></span><span class="sprk sp-2"></span><span class="sprk sp-3"></span><span class="sprk sp-4"></span>
            </div>
          </div>
        </div>
      </section>`;
  }

  function canteenCard(c) {
    const dishes = DATA.dishes.filter((d) => d.canteenId === c.id);
    const rated = dishes.filter((d) => state.stats[d.id]);
    const avg = rated.length
      ? (rated.reduce((s, d) => s + state.stats[d.id].avg, 0) / rated.length)
      : 0;
    return `
      <a class="canteen-card canteen-${c.color} reveal" href="#/canteen/${c.id}">
        ${c.photo ? `<figure><img src="${esc(c.photo)}" alt="${esc(I18N.lang() === 'zh' ? c.zh : c.en)}" loading="lazy"></figure>` : ''}
        <span class="canteen-card-body">
          <span class="chip"><i class="dot"></i>${esc(c.short)}${I18N.lang() === 'zh' ? ` · ${esc(c.bldgZh)}` : ` · ${esc(c.bldgEn)}`}</span>
          <span class="canteen-card-name">
            <h3>${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</h3>
            <span>${esc(I18N.lang() === 'zh' ? c.en : c.zh)}</span>
          </span>
          <span class="canteen-card-meta">
            <span class="row">${icon('clock')}${esc(I18N.lang() === 'zh' ? c.hoursZh : c.hoursEn)}</span>
          </span>
          <p class="canteen-card-fact">${esc(I18N.lang() === 'zh' ? c.factZh : c.factEn)}</p>
          <span class="canteen-card-foot">
            <span class="n"><b>${dishes.length}</b> ${esc(I18N.t('dishesCount'))}${rated.length ? ` · ★ ${avg.toFixed(1)}` : ''}</span>
            <span class="go">${esc(I18N.t('viewMenu'))}${icon('arrow')}</span>
          </span>
        </span>
      </a>`;
  }

  function latestReviewCards() {
    const list = [...state.reviews]
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 6);
    if (!list.length) return '';
    return `
      ${sectionHead('Fresh Reviews', 'latestHeading', 'latestSub', `<a class="linklike" href="#/" data-scroll="canteens">${esc(I18N.t('heroCta1'))}${icon('arrow')}</a>`)}
      <div class="review-wall">
        ${list.map((r) => {
          const d = dishById(r.dishId);
          if (!d) return '';
          const c = canteenById(d.canteenId);
          return `
            <button class="quote-card reveal" data-action="open-dish" data-id="${d.id}">
              <span class="quote-who">
                ${avatar(r.nickname)}
                <span class="quote-nick">${esc(r.nickname)}${r.sample ? ` <span class="sample-flag">${esc(I18N.t('sampleTag'))}</span>` : ''}
                  <small>${fmtDate(r.created)}</small></span>
              </span>
              <span class="quote-stars">${starsSvg(r.rating)}${verdictTag(r.verdict)}</span>
              <p class="quote-text">${esc(r.text)}</p>
              <span class="quote-dish">${esc(I18N.pick(d))} · ${esc(c ? c.short : '')}</span>
            </button>`;
        }).join('')}
      </div>`;
  }

  function renderHome() {
    const hot = hotPicks(6);
    const avoid = avoidList(5);
    renderHero();

    const canteensSec = `
      <section class="section" id="canteens">
        <div class="wrap">
          ${sectionHead('The Canteens', 'canteensHeading')}
          <div class="canteen-grid">
            ${DATA.canteens.map(canteenCard).join('')}
          </div>
        </div>
      </section>`;

    const hotSec = hot.length ? `
      <section class="section section--soft">
        <div class="wrap">
          ${sectionHead("Today's Hot", 'hotHeading', 'hotSub', `<a class="linklike" href="#/" data-scroll="canteens">${esc(I18N.t('viewAll'))}${icon('arrow')}</a>`)}
          <div class="h-scroll">
            ${hot.map((d) => dishCard(d)).join('')}
          </div>
        </div>
      </section>` : '';

    const avoidSec = avoid.length ? `
      <section class="section" id="avoid">
        <div class="wrap">
          <div class="avoid-panel reveal">
            <div>
              <p class="kicker">Avoid List</p>
              <h2 class="section-title">${esc(I18N.t('avoidHeading'))}</h2>
              <p class="section-sub">${esc(I18N.t('avoidSub'))}</p>
              <p class="avoid-note">${esc(I18N.t('avoidNote'))}</p>
            </div>
            <ol class="avoid-list">
              ${avoid.map((d, i) => {
                const c = canteenById(d.canteenId);
                const s = state.stats[d.id];
                const avoidPct = Math.round(s.avoidRatio * 100);
                return `
                <li class="avoid-row" style="--i:${i}">
                  <span class="avoid-rank" aria-hidden="true">${i + 1}</span>
                  <button class="avoid-dish" data-action="open-dish" data-id="${d.id}">
                    <span class="avoid-dish-name">${esc(I18N.pick(d))}<span class="avoid-dish-en">${esc(d.en)}</span></span>
                    <span class="avoid-dish-meta">${esc(c ? c.short : '')} · ${fmtPrice(d.price)}</span>
                  </button>
                  <span class="avoid-votes"><b>${avoidPct}%</b><i>${esc(I18N.t('avoidPctOf'))}</i></span>
                </li>`;
              }).join('')}
            </ol>
          </div>
        </div>
      </section>` : '';

    const reviewsSec = `
      <section class="section" id="reviews" style="padding-top:24px">
        <div class="wrap">${latestReviewCards()}</div>
      </section>`;

    appEl.insertAdjacentHTML('beforeend', canteensSec + hotSec + avoidSec + reviewsSec + renderFooter());
    bindReveals();
    queueScrollFx();
  }

  /* ── 畫面：飯堂頁 ────────────────────────── */

  function getFilter(canteenId) {
    if (!state.filters[canteenId]) state.filters[canteenId] = { cat: null, sort: 'popular' };
    return state.filters[canteenId];
  }

  function renderCanteen(canteenId, opts) {
    const enter = !!(opts && opts.enter) && !reduceMotion();
    const c = canteenById(canteenId);
    if (!c) { location.hash = '#/'; return; }
    // 換飯堂才把 chip 列的捲動位置歸零；同一個飯堂重繪（篩選／排序）要留住位置，
    // 否則點完右邊的分類、整列就跳回起點，那個分類馬上又不見了。
    if (chipScopeKey !== canteenId) { chipScopeKey = canteenId; chipScrollLeft = 0; }
    const f = getFilter(canteenId);
    let dishes = DATA.dishes.filter((d) => d.canteenId === canteenId);
    const ratedAll = dishes.filter((d) => state.stats[d.id]);
    const bandAvg = ratedAll.length ? ratedAll.reduce((s2, d) => s2 + state.stats[d.id].avg, 0) / ratedAll.length : 0;
    const totalReviews = dishes.reduce((n, d) => n + (state.stats[d.id] ? state.stats[d.id].count : 0), 0);
    if (f.cat) dishes = dishes.filter((d) => d.cat === f.cat);

    const stat = (d) => state.stats[d.id] || { count: 0, avg: 0 };
    if (f.sort === 'popular') dishes.sort((a, b) => stat(b).count - stat(a).count || stat(b).avg - stat(a).avg);
    else if (f.sort === 'rating') dishes.sort((a, b) => stat(b).avg - stat(a).avg || stat(b).count - stat(a).count);
    else if (f.sort === 'price') dishes.sort((a, b) => a.price - b.price);

    const chips = [{ id: null, zh: I18N.t('filterAll'), en: I18N.t('filterAll') }]
      .concat(DATA.categories)
      .map((cat) => {
        const n = DATA.dishes.filter((d) => d.canteenId === canteenId && (!cat.id || d.cat === cat.id)).length;
        if (cat.id && !n) return '';
        return `
          <button class="chip ${f.cat === cat.id ? 'chip-on' : ''}" data-action="set-cat" data-id="${cat.id || ''}">
            ${esc(I18N.pick(cat))}<i>${n}</i>
          </button>`;
      }).join('');

    const sorts = [
      { id: 'popular', key: 'sortPopular' },
      { id: 'rating', key: 'sortRating' },
      { id: 'price', key: 'sortPriceAsc' },
    ].map((s) => `<option value="${s.id}" ${f.sort === s.id ? 'selected' : ''}>${esc(I18N.t(s.key))}</option>`).join('');

    // 切換篩選／排序時讓網格重新進場。--i 逐項錯開，並夾在 0–9：
    // 再往後延遲會讓整體變得拖沓（技能規範：stagger ≤ 8–9 項）。
    const enterCls = enter ? ' grid-enter' : '';
    let gridHtml = '';
    if (!dishes.length) {
      gridHtml = `<p class="empty-note">${esc(I18N.t('noResult'))}</p>`;
    } else if (f.cat) {
      gridHtml = `<div class="dish-grid${enterCls}">${dishes.map((d, i) => dishCard(d, enter ? clamp(i, 0, 9) : undefined)).join('')}</div>`;
    } else {
      let seen = 0;
      gridHtml = DATA.categories.map((cat) => {
        const list = dishes.filter((d) => d.cat === cat.id);
        if (!list.length) return '';
        const base = seen;
        seen += list.length;
        return `
          <div class="cat-group${enter ? ' enter' : ''}"${enter ? ` style="--gi:${clamp(base + 1, 0, 9)}"` : ''}>
            <h3 class="cat-head">${esc(I18N.pick(cat))}<span class="cat-head-en">${esc(cat.en)}</span><i>${list.length}</i></h3>
            <div class="dish-grid${enterCls}">${list.map((d, i) => dishCard(d, enter ? clamp(base + i, 0, 9) : undefined)).join('')}</div>
          </div>`;
      }).join('');
    }

    // 注意下方菜品列表：.wrap 一定要寫成 .section 的「子元素」。
    // 兩者疊在同一顆上時，.section{padding:96px 0 88px} 的 padding 簡寫
    // 會整個蓋掉 .wrap 的左右 64px 內距 → 卡片貼齊畫面邊緣。
    appEl.innerHTML = `
      <div class="wrap">
        <p class="crumb"><a href="#/">${icon('back')}${esc(I18N.t('backHome'))}</a><span>／</span><b style="color:var(--ink)">${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</b></p>
        <section class="canteen-band canteen-band-${c.color}">
          <div class="canteen-band-grid">
            ${(c.photo || '')
              ? `<figure class="canteen-band-photo"><img src="${esc(c.photo)}" alt="${esc(I18N.lang() === 'zh' ? c.zh : c.en)}"></figure>`
              : `<figure class="canteen-band-photo"><div class="dish-ph"><span class="dish-ph-glyph">${esc(c.short)}</span></div></figure>`}
            <div class="canteen-band-copy">
              <span class="chip"><i class="dot"></i>${esc(c.short)} · ${esc(I18N.lang() === 'zh' ? c.en : c.zh)}</span>
              <h1 class="canteen-name">${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</h1>
              <p class="canteen-bldg">${icon('pin')}${esc(I18N.lang() === 'zh' ? c.bldgZh : c.bldgEn)}</p>
              <p class="canteen-hours">${icon('clock')}${esc(I18N.lang() === 'zh' ? c.hoursZh : c.hoursEn)}</p>
              ${c.orderUrl ? `<a class="order-link" href="${esc(c.orderUrl)}" target="_blank" rel="noopener">${esc(I18N.t('officialOrdering'))}${icon('ext')}</a>` : ''}
              <div class="canteen-stats">
                ${ratedAll.length ? `<span class="big">${bandAvg.toFixed(1)}<small>★</small></span>` : ''}
                ${totalReviews ? `<span class="rating-line"><span class="count">${reviewCountText(totalReviews)}</span></span>` : ''}
                <span class="chip">${dishes.length} ${esc(I18N.t('dishesCount'))}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="filter-bar">
        <div class="wrap filter-bar-row">
          <div class="chips" id="chip-strip">${chips}</div>
          <!-- 桌機沒有觸控可以橫向滑，而 .chips 的滾動條本來就被藏掉了（原專案如此），
               AC1 現在有 23 個分類 chip，沒有這組箭頭的話後面 13 個根本選不到。
               只在真的溢出時才出現（JS 切 .is-off），裝得下就完全不佔位。 -->
          <div class="chips-nav is-off" id="chips-nav">
            <button class="chips-arrow" data-action="chips-prev" aria-label="${esc(I18N.t('chipsPrev'))}">${icon('back')}</button>
            <button class="chips-arrow" data-action="chips-next" aria-label="${esc(I18N.t('chipsNext'))}">${icon('chevR')}</button>
          </div>
          <label class="sort-box">
            <span>${esc(I18N.t('sortLabel'))}</span>
            <select data-action="set-sort">${sorts}</select>
          </label>
        </div>
      </div>

      <section class="section" style="padding-top:44px">
        <div class="wrap">${gridHtml}</div>
      </section>
      ${renderFooter()}`;
    bindChipNav();
    bindReveals();
    queueScrollFx();
  }

  /* ── 頁尾 ──────────────────────────────── */

  function renderFooter() {
    const samplesHidden = !state.reviews.some((r) => r.sample);
    // HIDE_SAMPLES 開啟時範例評論無法被叫回來（reviews.js 的 samplesHidden()
    // 用 `CFG.HIDE_SAMPLES || ...` 短路），切換鈕按了也不會動 —— 索性不畫。
    const sampleToggle = window.CITYU_EATS_CONFIG.HIDE_SAMPLES
      ? ''
      : `<button class="linklike" data-action="toggle-samples">${esc(I18N.t(samplesHidden ? 'footerSamplesShown' : 'footerSamplesHidden'))}</button>`;
    return `
      <footer class="footer">
        <div class="wrap footer-grid">
          <div>
            <p class="footer-brand">Eaty<i>.</i></p>
            <p class="footer-note">${esc(I18N.t('footerTagline'))}</p>
            <p class="footer-note">${esc(I18N.t('footerNote'))}</p>
          </div>
          <div class="footer-links">
            <a href="https://www.cityu.edu.hk/zh-hk/directories/catering" target="_blank" rel="noopener">${esc(I18N.t('footerOfficial'))}${icon('ext')}</a>
            ${sampleToggle}
            <span class="footer-storage">v${esc(window.CITYU_EATS_CONFIG.VERSION || '')} · ${esc(I18N.t(store.remoteAvailable() ? 'footerStorageCloud' : 'footerStorageLocal'))}</span>
          </div>
        </div>
      </footer>`;
  }

  /* ── 菜品詳情 modal ──────────────────────── */

  /** 遞增即作廢所有進行中的退場計時器，避免「剛關上又重開」被舊計時器清掉。 */
  let modalToken = 0;

  function openDish(dishId) {
    const d = dishById(dishId);
    if (!d) return;
    modalToken++;
    modalRoot.classList.remove('is-closing');
    state.modalReturnFocus = document.activeElement;
    const c = canteenById(d.canteenId);
    const s = state.stats[d.id] || { count: 0, avg: 0, dist: [0, 0, 0, 0, 0], verdict: null };
    const rs = dishReviews(d.id);

    const distRows = [5, 4, 3, 2, 1].map((star, i) => {
      const n = s.dist[star - 1] || 0;
      const ratio = s.count ? n / s.count : 0;
      // --w 為 0–1 比例，供 scaleX 成長；--i 讓五條長條依序長出來
      return `
        <div class="dist-row">
          <span>${star}</span>
          <span class="dist-bar"><span style="--w:${ratio.toFixed(4)};--i:${i}"></span></span>
          <span>${n}</span>
        </div>`;
    }).join('');

    const okRatio = s.count ? Math.max(0, 1 - s.mustRatio - s.avoidRatio) : 0;
    const verdictSum = s.count ? `
      <div class="verdict-sum">
        <div class="v-pill must"><b>${Math.round(s.mustRatio * 100)}%</b><span>${esc(I18N.t('verdictMust'))}</span></div>
        <div class="v-pill ok"><b>${Math.round(okRatio * 100)}%</b><span>${esc(I18N.t('verdictOk'))}</span></div>
        <div class="v-pill avoid"><b>${Math.round(s.avoidRatio * 100)}%</b><span>${esc(I18N.t('verdictAvoid'))}</span></div>
      </div>` : '';

    const reviewList = rs.length ? rs.map((r) => `
      <li class="review-item">
        <div class="review-head">
          ${avatar(r.nickname)}
          <span class="review-nick">${esc(r.nickname)}${r.sample ? `<i class="sample-flag">${esc(I18N.t('sampleTag'))}</i>` : ''}</span>
          <span class="review-date">${fmtDate(r.created)}</span>
        </div>
        <div class="review-stars">${starsSvg(r.rating)}${verdictTag(r.verdict)}</div>
        <p class="review-text">${esc(r.text)}</p>
      </li>`).join('')
      : `<li class="review-item review-empty">${esc(I18N.t('noReviewsYet'))}</li>`;

    // 可捲動的內容包進 .modal-scroll，關閉鈕放在它「外面」——
    // 否則鈕會落在滾動容器內，滑到評論區時就一起被捲出畫面。
    modalRoot.innerHTML = `
      <div class="overlay" data-action="close-modal"></div>
      <div class="modal dish-modal" role="dialog" aria-modal="true" aria-label="${esc(I18N.pick(d))}">
        <div class="modal-scroll">
        <div class="dish-modal-grid">
          <figure class="dish-modal-photo">
            ${dishPhoto(d, 'dish-modal-img')}
            ${s.verdict ? `<span class="stamp stamp-${s.verdict}">${esc(I18N.t({ must: 'verdictMust', ok: 'verdictOk', avoid: 'verdictAvoid' }[s.verdict]))}</span>` : ''}
            <span class="price-tag"><span class="p">${fmtPrice(d.price)}</span></span>
          </figure>
          <div class="dish-modal-info">
            <span class="chip dish-modal-canteen canteen-${c.color}"><i class="dot"></i>${esc(c.short)} ${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</span>
            <div>
              <h2 class="dish-modal-name">${esc(I18N.pick(d))}</h2>
              <p class="dish-modal-en">${esc(I18N.lang() === 'zh' ? d.en : d.zh)}</p>
            </div>
            <div class="dish-modal-price-row">
              <span class="p">${fmtPrice(d.price)}</span>
              <span class="loc">${esc(I18N.lang() === 'zh' ? c.bldgZh : c.bldgEn)}</span>
            </div>
            <!-- 食物分類標籤：取代原本的「菜品簡介」與「推薦標籤」兩行。
                 那兩行都是「有些菜品有、有些沒有」，版面永遠對不齊；
                 分類是每道菜都有的欄位，一定畫得出來。 -->
            <div class="dish-modal-tags">
              <span class="tag-chip tag-cat">${esc(I18N.pick(catById(d.cat)))}</span>
            </div>
            ${s.count ? `
            <div class="dish-modal-rating">
              <b class="avg">${s.avg.toFixed(1)}</b>
              <div>${starsSvg(s.avg)}<span class="count">${reviewCountText(s.count)}</span></div>
            </div>
            <div class="dist">${distRows}</div>` : ''}
            ${verdictSum}
          </div>
        </div>

        <div class="dish-modal-reviews">
          <h3 class="block-head">${esc(I18N.t('latestHeading'))}</h3>
          <ul class="review-list">${reviewList}</ul>
        </div>

        <form class="review-form" data-action="submit-review" data-dish="${d.id}" novalidate>
          <h3 class="block-head">${esc(I18N.t('formTitle'))}</h3>
          <p class="form-sub">${esc(I18N.t('formSub'))}</p>
          <fieldset class="star-field">
            <legend>${esc(I18N.t('formStars'))}</legend>
            <div class="star-input" role="radiogroup" aria-label="${esc(I18N.t('formStars'))}">
              ${[1, 2, 3, 4, 5].map((v) => `
                <button type="button" class="star-btn" role="radio" aria-checked="false" aria-label="${v}" data-value="${v}">${icon('star')}</button>`).join('')}
            </div>
          </fieldset>
          <fieldset class="verdict-field">
            <legend>${esc(I18N.t('formVerdict'))}</legend>
            <div class="verdict-input" role="radiogroup" aria-label="${esc(I18N.t('formVerdict'))}">
              <button type="button" class="verdict-opt verdict-opt-must" role="radio" aria-checked="false" data-value="must">${esc(I18N.t('verdictMust'))}</button>
              <button type="button" class="verdict-opt verdict-opt-ok" role="radio" aria-checked="false" data-value="ok">${esc(I18N.t('verdictOk'))}</button>
              <button type="button" class="verdict-opt verdict-opt-avoid" role="radio" aria-checked="false" data-value="avoid">${esc(I18N.t('verdictAvoid'))}</button>
            </div>
          </fieldset>
          <div class="form-row">
            <label class="nick-field">
              <span>${esc(I18N.t('formNickname'))}</span>
              <input type="text" name="nickname" maxlength="24" placeholder="${esc(I18N.t('formNicknamePlaceholder'))}">
            </label>
            <div><!-- 判定欄已在上方 --></div>
          </div>
          <label class="text-field">
            <span>${esc(I18N.t('formText'))}</span>
            <textarea name="text" rows="3" maxlength="600" placeholder="${esc(I18N.t('formTextPlaceholder'))}" required></textarea>
          </label>
          <p class="form-error" hidden></p>
          <div class="form-foot">
            <button class="btn btn-ink btn-sm" type="submit">${esc(I18N.t('formSubmit'))}</button>
            <span class="form-hint">${esc(I18N.t('formHint'))}</span>
          </div>
        </form>
        </div>
        <button class="modal-close" data-action="close-modal" aria-label="${esc(I18N.t('close'))}">${icon('close')}</button>
      </div>`;
    document.body.classList.add('modal-open');
    const closeBtn = modalRoot.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    bindModalFade();
  }

  /**
   * 藏掉滾動條後，改用底部漸層提示「下方還有內容」。
   * 只有真的溢出、且還沒捲到底時才亮起。
   */
  function bindModalFade() {
    const modalEl = modalRoot.querySelector('.modal.dish-modal');
    const scrollEl = modalRoot.querySelector('.modal-scroll');
    if (!modalEl || !scrollEl) return;
    const sync = () => {
      const rest = scrollEl.scrollHeight - scrollEl.clientHeight - scrollEl.scrollTop;
      modalEl.classList.toggle('has-more', rest > 8);
    };
    scrollEl.addEventListener('scroll', sync, { passive: true });
    // 內容進場動畫只改 transform/opacity，但字體與圖片仍可能改變高度 → 補兩次量測
    requestAnimationFrame(sync);
    setTimeout(sync, 420);
  }

  /**
   * 關閉 modal。
   * @param {boolean} [instant] 供路由切換使用——直接拆掉，不在新畫面上疊一層退場動畫。
   * 退場以「計時器」為準而非 animationend：動畫被中斷或跳過時狀態仍然正確。
   */
  function closeModal(instant) {
    if (!modalRoot.innerHTML) return;
    const token = ++modalToken;

    const finish = () => {
      if (token !== modalToken) return;           // 期間已重開／再次關閉 → 作廢
      modalRoot.innerHTML = '';
      modalRoot.classList.remove('is-closing');
      document.body.classList.remove('modal-open');
      if (state.modalReturnFocus && document.contains(state.modalReturnFocus)) {
        state.modalReturnFocus.focus();
      }
      state.modalReturnFocus = null;
    };

    if (instant || reduceMotion()) { finish(); return; }

    modalRoot.classList.add('is-closing');
    setTimeout(finish, 220);                       // 對齊 CSS 的 --dur-2 退場時長
  }

  /* ── 今日食咩 modal ──────────────────────── */

  let rollToken = 0;

  /**
   * 不進「今天吃什麼」抽籤池的分類。
   * 飲品／甜品不是一餐的答案——抽到「凍檸茶」對「今天吃什麼」毫無幫助。
   * 只影響抽籤，不影響飯堂頁的分類瀏覽（那裡照樣看得到飲品）。
   */
  const ROLL_EXCLUDED_CATS = ['drinks'];

  function openRandom() {
    modalToken++;
    modalRoot.classList.remove('is-closing');
    state.modalReturnFocus = document.activeElement;
    rollToken++;
    modalRoot.innerHTML = `
      <div class="overlay" data-action="close-modal"></div>
      <div class="modal random-modal" role="dialog" aria-modal="true" aria-label="${esc(I18N.t('randomTitle'))}">
        <button class="modal-close" data-action="close-modal" aria-label="${esc(I18N.t('close'))}">${icon('close')}</button>
        <h2 class="random-title">${esc(I18N.t('randomTitle'))}</h2>
        <p class="random-sub">${esc(I18N.t('randomSub'))}</p>
        <div class="random-scopes" role="radiogroup" aria-label="${esc(I18N.t('randomTitle'))}">
          <button class="chip chip-on" data-action="set-scope" data-id="">${esc(I18N.t('randomScopeAll'))}</button>
          ${DATA.canteens.map((c) => `<button class="chip" data-action="set-scope" data-id="${c.id}">${esc(c.short)}</button>`).join('')}
        </div>
        <div class="random-stage" aria-live="polite">
          <div class="random-dish" id="random-dish">
            <span class="random-flip">${esc(I18N.t('randomRoll'))}</span>
          </div>
          <span class="random-stamp-slot" id="random-stamp"></span>
        </div>
        <button class="btn btn-ink btn-random" data-action="roll" id="roll-btn">${icon('dice')}<span id="roll-label">${esc(I18N.t('randomRoll'))}</span></button>
        <div class="random-result-actions" id="random-actions"></div>
      </div>`;
    document.body.classList.add('modal-open');
    const closeBtn = modalRoot.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  async function roll() {
    const btn = document.getElementById('roll-btn');
    const label = document.getElementById('roll-label');
    const flip = modalRoot.querySelector('.random-flip');
    const stage = document.getElementById('random-dish');
    const stageBox = modalRoot.querySelector('.random-stage');
    const stampSlot = document.getElementById('random-stamp');
    const actions = document.getElementById('random-actions');
    if (!btn || !flip) return;

    const scope = modalRoot.querySelector('.random-scopes .chip-on');
    const scopeId = scope ? scope.getAttribute('data-id') : '';
    const pool = DATA.dishes.filter((d) => !ROLL_EXCLUDED_CATS.includes(d.cat) && (!scopeId || d.canteenId === scopeId));
    if (!pool.length) return;

    const animated = !reduceMotion();
    const token = ++rollToken;
    btn.disabled = true;
    btn.classList.add('is-rolling');                 // 骰子圖示旋轉中
    if (label) label.textContent = I18N.t('randomRolling');
    stage.classList.remove('landed');
    if (stageBox) stageBox.classList.remove('landed');
    if (animated && stageBox) stageBox.classList.add('is-rolling');  // 光澤掃過的「轉動中」感
    stampSlot.innerHTML = '';
    actions.innerHTML = '';

    const winner = pool[Math.floor(Math.random() * pool.length)];
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let t = 0;
    const duration = 1500;
    let i = 0;
    while (true) {
      const p = t / duration;
      if (p >= 1) break;
      const d = pool[i % pool.length];
      flip.textContent = I18N.pick(d);
      i++;
      // 每一格進來都給一次短促的「跳一下」，用 WAAPI 而非切換 class：
      // 不必為了重播動畫而強制 reflow，且動畫結束自動回收。
      if (animated && flip.animate) {
        flip.animate(
          [{ opacity: .18, transform: 'translate3d(0,-7px,0) scale(.985)' }, { opacity: 1, transform: 'none' }],
          { duration: 110, easing: 'cubic-bezier(.22,.68,0,1)' }
        );
      }
      const step = 55 + 320 * p * p;
      await delay(step);
      t += step;
    }
    if (token !== rollToken) return; // modal 已關

    flip.textContent = I18N.pick(winner);
    stage.classList.add('landed');
    if (stageBox) {
      stageBox.classList.remove('is-rolling');
      if (animated) stageBox.classList.add('landed');   // 底色變化 + 外圈脈衝
    }
    stampSlot.innerHTML = `<span class="stamp stamp-must stamp-slam">${esc(I18N.t('randomPick'))}</span>`;
    btn.disabled = false;
    btn.classList.remove('is-rolling');
    if (label) label.textContent = I18N.t('randomAgain');
    actions.innerHTML = `
      <button class="linklike" data-action="open-dish" data-id="${winner.id}">${esc(I18N.t('randomView'))}${icon('arrow')}</button>`;
  }

  /* ── reveal 動效 ─────────────────────────── */

  let observer = null;
  let revealToken = 0;
  const revealTimers = new Map();

  /**
   * 揭示完成後卸下 armed/in。
   * 原因：`.reveal.reveal-armed.in` 的 transition 宣告優先於 `.dish-card` 自己的，
   * 若一直掛著，卡片 hover 抬升會被迫用 700ms 而不是設計的 340ms。
   * 卸下後計算值完全相同（opacity:1 / transform:none），不會有視覺跳動。
   */
  function settleReveal(el) {
    revealTimers.delete(el);
    el.classList.remove('reveal-armed', 'in');
    el.style.removeProperty('--rd');
  }

  function revealNow(el, delayMs) {
    if (delayMs) el.style.setProperty('--rd', delayMs + 'ms');
    el.classList.add('in');
    const prev = revealTimers.get(el);
    if (prev) clearTimeout(prev);
    revealTimers.set(el, setTimeout(() => settleReveal(el), delayMs + 1250));
  }

  function bindReveals() {
    const token = ++revealToken;
    const els = Array.from(appEl.querySelectorAll('.reveal'));

    revealTimers.forEach((t) => clearTimeout(t));
    revealTimers.clear();

    if (reduceMotion() || !('IntersectionObserver' in window)) {
      els.forEach(settleReveal);
      return;
    }
    if (observer) observer.disconnect();

    const effBottom = window.innerHeight * 0.92;
    const inRange = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < effBottom && r.bottom > 0;
    };

    /**
     * 同一批進場的兄弟元素依序錯開，形成由左至右／由上而下的波浪。
     * 只有「同一個父容器、同一批進入視口」時才錯開——單獨進場的元素不會無故延遲。
     */
    const arrive = (list) => {
      if (token !== revealToken) return;
      const groups = new Map();
      for (const el of list) {
        const p = el.parentElement;
        if (!groups.has(p)) groups.set(p, []);
        groups.get(p).push(el);
      }
      groups.forEach((group) => {
        group.forEach((el, idx) => {
          revealNow(el, group.length > 1 ? clamp(idx, 0, 8) * 70 : 0);
          if (observer) observer.unobserve(el);
        });
      });
    };

    const pending = [];
    observer = new IntersectionObserver((entries) => {
      const incoming = [];
      for (const en of entries) {
        if (en.isIntersecting && inRange(en.target)) incoming.push(en.target);
      }
      if (incoming.length) arrive(incoming);
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    els.forEach((el) => {
      if (inRange(el)) {
        el.classList.add('in'); // 首屏可見的內容永不隱藏
      } else {
        el.classList.add('reveal-armed');
        pending.push(el);
        observer.observe(el);
      }
    });

    // 字體交換會令版面位移把元素帶入視口；IO 不一定重估，定時補漏
    setTimeout(() => {
      if (token !== revealToken) return;
      const late = pending.filter((el) =>
        el.classList.contains('reveal-armed') && !el.classList.contains('in') && inRange(el));
      if (late.length) arrive(late);
    }, 1400);
  }

  /* ── 捲動狀態（頁首陰影 / 閱讀進度 / 篩選列浮起）─────
     單一 rAF 節流：讀寫集中在同一幀，且只碰 transform 與 class，
     不量測會被動畫影響的屬性，避免 layout thrashing。 */

  let scrollRaf = 0;

  function updateScrollFx() {
    scrollRaf = 0;
    const y = window.scrollY || window.pageYOffset || 0;

    const header = document.getElementById('site-header');
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
      const bar = header.querySelector('.scroll-progress');
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty('--p', max > 4 ? clamp(y / max, 0, 1).toFixed(4) : '0');
      }
    }

    const bar = document.querySelector('.filter-bar');
    if (bar) {
      const stickyTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= stickyTop + 1);
    }
  }

  function queueScrollFx() {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollFx);
  }

  window.addEventListener('scroll', queueScrollFx, { passive: true });
  window.addEventListener('resize', queueScrollFx, { passive: true });

  /* ── 分類 chip 列：左右捲動 ──────────────────
     .chips 是 overflow-x:auto 但滾動條被藏起來（原專案設計）。
     觸控可以滑、鍵盤 Tab 會自動帶到，滑鼠則完全無路可走 ——
     所以補一組看得見的箭頭，並接上滾輪。 */

  const chipStrip = () => document.getElementById('chip-strip');
  const chipNav = () => document.getElementById('chips-nav');

  let chipScrollLeft = 0;   // 目前的捲動位置，重繪後還原
  let chipScopeKey = '';    // 位置是屬於哪個飯堂的
  let chipScrollTarget = null;  // 箭頭指定的目標位置（平滑捲動中尚未抵達）

  function syncChipNav() {
    const strip = chipStrip();
    const nav = chipNav();
    if (!strip || !nav) return;
    const max = strip.scrollWidth - strip.clientWidth;
    if (max <= 2) { nav.classList.add('is-off'); return; }   // 裝得下 → 整組收起來，不佔位
    nav.classList.remove('is-off');
    const prev = nav.querySelector('[data-action="chips-prev"]');
    const next = nav.querySelector('[data-action="chips-next"]');
    // 到頭了就把該方向的箭頭停用（而不是藏起來，免得按鈕左右跳）
    if (prev) prev.disabled = strip.scrollLeft <= 2;
    if (next) next.disabled = strip.scrollLeft >= max - 2;
  }

  function scrollChips(dir) {
    const strip = chipStrip();
    if (!strip) return;
    const step = Math.max(160, strip.clientWidth * 0.8);
    const max = strip.scrollWidth - strip.clientWidth;
    // 平滑捲動期間 scrollLeft 不會馬上更新，連點兩下會各自算到同一個目標而互相抵消，
    // 所以用「上一次的目標」當基準繼續累加。
    const from = (chipScrollTarget !== null && Math.abs(chipScrollTarget - strip.scrollLeft) > 2)
      ? chipScrollTarget
      : strip.scrollLeft;
    const to = clamp(from + dir * step, 0, max);
    chipScrollTarget = to;
    strip.scrollTo({ left: to, behavior: reduceMotion() ? 'auto' : 'smooth' });
    syncChipNav();
  }

  /** 每次重繪飯堂頁都會換掉整個 .chips，所以監聽要在這裡重綁 */
  function bindChipNav() {
    const strip = chipStrip();
    if (!strip) return;
    strip.scrollLeft = chipScrollLeft;   // 還原上次的位置（換飯堂時已歸零）
    chipScrollTarget = null;             // 新的元素，先前的目標作廢
    strip.addEventListener('scroll', () => {
      chipScrollLeft = strip.scrollLeft;
      // 到達箭頭指定的位置後就把它清掉，之後的基準重新回到真實位置
      if (chipScrollTarget !== null && Math.abs(chipScrollTarget - strip.scrollLeft) < 2) chipScrollTarget = null;
      syncChipNav();
    }, { passive: true });
    strip.addEventListener('wheel', (e) => {
      // 觸控板的橫向手勢交給瀏覽器自己處理
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      if (max <= 2) return;
      const to = strip.scrollLeft + e.deltaY;
      if (to < 0 || to > max) return;  // 捲到頭就放行，讓頁面正常捲動，不困住使用者
      e.preventDefault();
      chipScrollTarget = null;         // 使用者自己捲了，箭頭的目標作廢
      strip.scrollLeft = to;
      syncChipNav();
    }, { passive: false });
    syncChipNav();
    // 網頁字體（Poppins／Noto Sans TC）載入後 chip 寬度會變，要重新量一次
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (chipStrip() === strip) syncChipNav(); });
    }
  }

  // 視窗變寬變窄都會改變裝得下幾個 chip
  window.addEventListener('resize', () => { if (chipStrip()) syncChipNav(); }, { passive: true });

  /* ── 路由 ──────────────────────────────── */

  function parseRoute() {
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/canteen\/([\w-]+)/);
    if (m) state.route = { view: 'canteen', canteenId: m[1] };
    else state.route = { view: 'home', canteenId: null };
  }

  function scrollToSection(id) {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /**
   * 是否已可啟用 View Transition。
   * 首次繪製必須關閉：那時「舊畫面」還是載入用的骨架，
   * 交叉淡入會蓋掉 hero 的分層進場。只有真正的頁面／語言切換才值得做轉場。
   */
  let vtReady = false;

  function render() {
    parseRoute();
    closeModal(true);            // 路由切換：直接拆掉，不讓退場動畫疊在新畫面上

    const paint = () => {
      if (state.route.view === 'canteen') renderCanteen(state.route.canteenId);
      else renderHome();
      window.scrollTo(0, 0);
      queueScrollFx();
    };

    // View Transitions：支援的瀏覽器會自動交叉淡入新舊畫面（含語言切換），
    // 不支援或已在轉場中就退回直接重繪——純漸進增強，不影響既有行為。
    if (vtReady && document.startViewTransition && !reduceMotion()) {
      try { document.startViewTransition(paint); return; } catch (e) { /* fall through */ }
    }
    paint();
  }

  /* ── 事件 ──────────────────────────────── */

  function setStarInput(form, value) {
    form.querySelectorAll('.star-btn').forEach((b) => {
      const on = Number(b.getAttribute('data-value')) <= value;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', Number(b.getAttribute('data-value')) === value ? 'true' : 'false');
    });
  }

  document.addEventListener('click', async (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');

    if (action === 'open-dish') {
      e.preventDefault();
      openDish(actionEl.getAttribute('data-id'));
    } else if (action === 'close-modal') {
      if (e.target === actionEl || actionEl.classList.contains('modal-close') || actionEl.classList.contains('overlay')) closeModal();
    } else if (action === 'open-random') {
      openRandom();
    } else if (action === 'roll') {
      roll();
    } else if (action === 'set-scope') {
      modalRoot.querySelectorAll('.random-scopes .chip').forEach((c) => c.classList.remove('chip-on'));
      actionEl.classList.add('chip-on');
      popOnce(actionEl, 400);
    } else if (action === 'chips-prev' || action === 'chips-next') {
      scrollChips(action === 'chips-next' ? 1 : -1);
    } else if (action === 'set-cat') {
      const canteenId = state.route.canteenId;
      const f = getFilter(canteenId);
      f.cat = actionEl.getAttribute('data-id') || null;
      renderCanteen(canteenId, { enter: true });    // 網格重新進場
      // 重繪會把舊 chip 換掉，所以彈跳要加在「新的」選中 chip 上，否則動效一閃即逝
      popOnce(appEl.querySelector('.filter-bar .chip-on'), 400);
    } else if (action === 'toggle-samples') {
      Reviews.toggleSamples();
      await loadReviews();
      render();
    }
  });

  // 頁首／hero 的分區連結：跨頁先返首頁再捲動
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-scroll]');
    if (!link) return;
    e.preventDefault();
    const target = link.getAttribute('data-scroll');
    if (state.route.view !== 'home') {
      location.hash = '#/';
      setTimeout(() => scrollToSection(target), 80);
    } else {
      scrollToSection(target);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('select[data-action="set-sort"]')) {
      const f = getFilter(state.route.canteenId);
      f.sort = e.target.value;
      renderCanteen(state.route.canteenId, { enter: true });
    }
  });

  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (starBtn) {
      const form = starBtn.closest('form');
      setStarInput(form, Number(starBtn.getAttribute('data-value')));
      popOnce(starBtn, 400);                        // 只有被按的那顆星彈跳
      return;
    }
    const verdictOpt = e.target.closest('.verdict-opt');
    if (verdictOpt) {
      verdictOpt.closest('.verdict-input').querySelectorAll('.verdict-opt').forEach((b) => {
        const on = b === verdictOpt;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      popOnce(verdictOpt, 400);
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-action="submit-review"]');
    if (!form) return;
    e.preventDefault();
    const errEl = form.querySelector('.form-error');
    const dishId = form.getAttribute('data-dish');
    const stars = form.querySelectorAll('.star-btn');
    const rating = (() => {
      let picked = 0;
      stars.forEach((b) => { if (b.classList.contains('on')) picked = Math.max(picked, Number(b.getAttribute('data-value'))); });
      return picked;
    })();
    const verdictBtn = form.querySelector('.verdict-opt.on');
    const text = form.querySelector('textarea[name="text"]').value;
    const nickname = form.querySelector('input[name="nickname"]').value;

    const fail = (msgKey) => {
      errEl.textContent = I18N.t(msgKey);
      errEl.hidden = false;
      retrigger(errEl, 'is-shake');
    };
    if (!rating) return fail('errNeedRating');
    if (!text || text.trim().length < 2) return fail('errNeedText');
    errEl.hidden = true;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.classList.add('is-busy');            // 送出中：按鈕內顯示轉圈
    btn.textContent = I18N.t('formSubmitting');
    try {
      await store.add({
        dishId, rating, verdict: verdictBtn ? verdictBtn.getAttribute('data-value') : 'ok',
        nickname, text,
      });
      await loadReviews();
      // 重開 modal 顯示新評論
      const canteenId = dishById(dishId).canteenId;
      if (state.route.view === 'canteen') renderCanteen(canteenId);
      else renderHome();
      openDish(dishId);
      const banner = document.createElement('p');
      banner.className = 'form-thanks is-new';
      banner.textContent = I18N.t('formThanks');
      const reopenedForm = modalRoot.querySelector('.review-form');
      if (reopenedForm) reopenedForm.prepend(banner);
    } catch (err) {
      errEl.textContent = I18N.t('errNetwork');
      errEl.hidden = false;
      retrigger(errEl, 'is-shake');
      btn.disabled = false;
      btn.classList.remove('is-busy');
      btn.textContent = orig;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalRoot.innerHTML) closeModal();
    if (e.key === 'Tab' && modalRoot.innerHTML) {
      const focusables = modalRoot.querySelectorAll('button, input, textarea, select, a[href]');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('hashchange', render);
  I18N.onChange(() => { renderHeader(); render(); });

  /* ── 頁首 ──────────────────────────────── */

  function renderHeader() {
    const header = document.getElementById('site-header');
    header.innerHTML = `
      <div class="wrap header-row">
        <a class="masthead" href="#/">Eaty<i>.</i></a>
        <nav class="header-nav" aria-label="${esc(I18N.t('navCanteens'))}">
          <a class="header-link" href="#/" data-scroll="canteens">${esc(I18N.t('navCanteens'))}</a>
          <a class="header-link" href="#/" data-scroll="avoid">${esc(I18N.t('navAvoid'))}</a>
          <a class="header-link" href="#/" data-scroll="reviews">${esc(I18N.t('navReviews'))}</a>
        </nav>
        <div class="header-actions">
          <button class="lang-btn" data-action-lang aria-label="${esc(I18N.t('langBtnLabel'))}">${esc(I18N.t('langBtn'))}</button>
          <button class="btn btn-ink btn-sm btn-random-header" data-action="open-random">${icon('dice')}<span>${esc(I18N.t('navRandom'))}</span></button>
        </div>
      </div>
      <span class="scroll-progress" aria-hidden="true"></span>`;

    header.querySelector('[data-action-lang]').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (reduceMotion()) { I18N.toggle(); return; }
      btn.classList.add('is-flip');
      // 趁文字轉到側面（約 90°，視覺上最短）的瞬間才替換語言，像真的翻了一張牌
      setTimeout(() => I18N.toggle(), 230);
    });
  }

  /* ── 啟動 ──────────────────────────────── */

  async function boot() {
    renderHeader();
    if (window.CityuEatsMenu) {
      try { await window.CityuEatsMenu.load(); } catch (e) { /* 內建資料後備 */ }
    }
    await loadReviews();
    render();                 // 首次繪製：不套用 View Transition，讓 hero 進場完整播出
    vtReady = true;           // 之後的路由／語言切換才做轉場
    queueScrollFx();
  }
  boot();
})();
