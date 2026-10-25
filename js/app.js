/* Coach Tukiki — interfaccia */
(function () {
  const S = window.Store;
  const app = document.getElementById('app');

  /* ---------- Dati di riferimento ---------- */
  const GOALS = [
    { k: 'riscaldamento', label: 'Riscaldamento', color: '#F2A541' },
    { k: 'coordinazione', label: 'Coordinazione', color: '#E8699A' },
    { k: 'conduzione', label: 'Conduzione', color: '#3FA7D6' },
    { k: 'passaggio', label: 'Passaggio', color: '#69B32D' },
    { k: 'tiro', label: 'Tiro', color: '#E5533D' },
    { k: 'dribbling', label: 'Dribbling e 1 contro 1', color: '#8E6CCF' },
    { k: 'tattica', label: 'Tattica', color: '#2E6E8E' },
    { k: 'portiere', label: 'Portiere', color: '#D9A400' },
    { k: 'partita', label: 'Partita', color: '#1C1B18' },
  ];
  const DIFF = { 1: 'Facile', 2: 'Media', 3: 'Difficile' };
  const goalOf = (k) => GOALS.find((g) => g.k === k) || { k, label: k || 'Altro', color: '#888' };

  /* ---------- Utilità ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nl2br = (s) => esc(s).replace(/\n/g, '<br>');
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const fmtDate = (iso, opts) => { if (!iso) return ''; const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('it-IT', opts || { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
  const fmtShort = (iso) => { if (!iso) return { d: '', m: '' }; const d = new Date(iso + 'T12:00:00'); return { d: d.getDate(), m: d.toLocaleDateString('it-IT', { month: 'short' }).replace('.', '') }; };
  const initials = (n) => (n || '?').trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  const diffDots = (n) => `<span class="diff" title="${DIFF[n] || ''}"><i class="on"></i><i class="${n >= 2 ? 'on' : ''}"></i><i class="${n >= 3 ? 'on' : ''}"></i></span>`;
  const goalTag = (k) => { const g = goalOf(k); return `<span class="tag" style="background:${g.color}1f;color:${g.color === '#1C1B18' ? '#1C1B18' : shade(g.color)}"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:${g.color}"></span>${esc(g.label)}</span>`; };
  function shade(hex) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.round(v * 0.72)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }

  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
    ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 7V3M16 10l4-1.5M14.5 14.5 17 18M9.5 14.5 7 18M8 10 4 8.5"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.4 2 5 4.9"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v6M9 15l3 3 3-3"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
  };

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }
  function errText(e) { return e instanceof window.AppError ? e.message : 'Qualcosa non ha funzionato. Riprova.'; }

  /* ---------- Cache dei dati ---------- */
  const cache = { exercises: null, teams: null, sessions: null };
  async function exercises() {
    if (!cache.exercises) {
      const mine = await S.listExercises();
      cache.exercises = window.SEED_EXERCISES.concat(mine.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
    }
    return cache.exercises;
  }
  async function teams() { if (!cache.teams) cache.teams = (await S.listTeams()).sort((a, b) => a.name.localeCompare(b.name)); return cache.teams; }
  async function sessions() { if (!cache.sessions) cache.sessions = (await S.listSessions()).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || '')); return cache.sessions; }
  const invalidate = (...k) => k.forEach((x) => { cache[x] = null; });
  const exById = async (id) => (await exercises()).find((e) => e.id === id);
  // copia dell'esercizio dentro l'allenamento, così lo storico resta leggibile anche se l'esercizio viene cancellato
  const snap = (e) => ({ title: e.title, goal: e.goal, difficulty: e.difficulty, description: e.description || '', steps: e.steps || [], equipment: e.equipment || '', diagram: e.diagram });
  const sessionMinutes = (s) => (s.blocks || []).reduce((t, b) => t + (+b.duration || 0), 0);

  /* ---------- Router ---------- */
  const routes = [];
  const PUBLIC = ['/privacy', '/condizioni'];
  let signingUp = false; // durante la registrazione le condizioni sono appena state accettate
  const route = (re, fn) => routes.push({ re, fn });
  let cleanup = null;
  function parseHash() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?');
    return { path, q: new URLSearchParams(qs || '') };
  }
  async function render() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const { path, q } = parseHash();
    const pub = PUBLIC.includes(path);
    if (!S.user && path !== '/accedi' && !pub) { location.replace('#/accedi'); return; }
    if (S.user && path === '/accedi') { location.replace('#/'); return; }
    document.body.classList.toggle('logged-out', !S.user);
    renderChrome(path);
    if (S.user && !pub && !signingUp && S.user.termsVersion !== Legal.version) { termsGate(); window.scrollTo(0, 0); return; }
    for (const r of routes) {
      const m = path.match(r.re);
      if (m) {
        try { await r.fn(m, q); } catch (e) { console.error(e); app.innerHTML = `<div class="error-msg">${esc(errText(e))}</div><a class="btn light" href="#/">Torna all'inizio</a>`; }
        window.scrollTo(0, 0);
        return;
      }
    }
    app.innerHTML = '<div class="empty">Pagina non trovata. <br><a class="btn light" href="#/">Torna all\'inizio</a></div>';
  }
  function renderChrome(path) {
    const nav = $('#bottomnav'), top = $('#topbar-user');
    nav.classList.toggle('hidden', !S.user);
    top.innerHTML = S.user ? `<a class="avatar" href="#/profilo" aria-label="Il mio profilo">${esc(initials(S.user.name || S.user.username))}</a>` : '';
    const sec = path.startsWith('/esercizi') ? 'esercizi' : path.startsWith('/allenament') ? 'allenamenti' : path.startsWith('/squadr') ? 'squadre' : path === '/' ? 'home' : '';
    $$('#bottomnav a').forEach((a) => a.classList.toggle('active', a.dataset.sec === sec));
  }
  window.addEventListener('hashchange', render);

  const demoNotice = () => S.mode === 'local' ? '<div class="notice"><b>Versione di prova.</b> I dati restano salvati solo su questo dispositivo. Quando l\'app sarà online, tutti gli allenatori condivideranno gli esercizi.</div>' : '';

  /* ================= PRIVACY E CONDIZIONI ================= */
  const legalLinks = () => '<p class="small muted legal-links"><a href="#/privacy">Privacy</a> · <a href="#/condizioni">Condizioni d\'uso</a></p>';
  const legalPage = (html) => {
    const back = S.user ? '#/profilo' : '#/accedi';
    app.innerHTML = `<a class="backlink" href="${back}">${I.back} Indietro</a><article class="card legal">${html}</article>`;
  };
  route(/^\/privacy$/, async () => legalPage(Legal.privacy()));
  route(/^\/condizioni$/, async () => legalPage(Legal.terms()));

  // chi si è registrato prima delle condizioni (o dopo una loro modifica) le accetta qui
  function termsGate() {
    app.innerHTML = `
      <div class="auth-wrap">
        <h1>Prima di continuare</h1>
        <form id="tg" class="card">
          <p>Abbiamo scritto l'<a href="#/privacy">informativa sulla privacy</a> e le <a href="#/condizioni">condizioni d'uso</a> di Coach Tukiki. Leggile e conferma per continuare.</p>
          <p class="small">In breve: le tue squadre e le tue note le vedi solo tu, gli esercizi che crei li vedono tutti gli allenatori. <b>Non scrivere mai informazioni sulla salute dei ragazzi</b> e usa solo nomi o iniziali.</p>
          <label class="check"><input type="checkbox" name="ok" required><span>Ho letto l'informativa sulla privacy e accetto le condizioni d'uso. Sono maggiorenne.</span></label>
          <button class="btn green block" type="submit">Continua</button>
        </form>
        <button class="btn light block" id="out" type="button">Esci</button>
      </div>`;
    $('#tg').onsubmit = async (ev) => {
      ev.preventDefault();
      try { await S.acceptTerms(Legal.version); render(); } catch (e) { UI.alert(errText(e)); }
    };
    $('#out').onclick = async () => { await S.signOut(); invalidate('exercises', 'teams', 'sessions'); location.hash = '#/accedi'; };
  }

  /* ================= ACCESSO ================= */
  route(/^\/accedi$/, async () => {
    let tab = 'login';
    const draw = (err) => {
      app.innerHTML = `
      <div class="auth-wrap">
        <img class="auth-logo" src="img/logo.png" alt="Tukiki">
        <p class="auth-sub">Prepara gli allenamenti di calcio, per tutti gli allenatori Tukiki</p>
        ${demoNotice()}
        <div class="tabs" role="tablist">
          <button type="button" data-tab="login" class="${tab === 'login' ? 'on' : ''}">Accedi</button>
          <button type="button" data-tab="signup" class="${tab === 'signup' ? 'on' : ''}">Registrati</button>
        </div>
        ${err ? `<div class="error-msg">${esc(err)}</div>` : ''}
        ${tab === 'login' ? `
        <form id="f" class="card">
          <label class="field"><span>Email o nome utente</span><input name="id" type="text" autocomplete="username" autocapitalize="off" required></label>
          <label class="field"><span>Password</span><input name="pw" type="password" autocomplete="current-password" required></label>
          <button class="btn green block" type="submit">Entra</button>
          <p class="small muted" style="text-align:center;margin:12px 0 0"><a href="#" id="forgot">Ho dimenticato la password</a></p>
        </form>` : `
        <form id="f" class="card">
          <label class="field"><span>Nome e cognome</span><input name="name" type="text" autocomplete="name" placeholder="Es. Giulia Rossi"></label>
          <label class="field"><span>Nome utente</span><input name="user" type="text" autocomplete="username" autocapitalize="off" placeholder="Es. giulia.rossi" required></label>
          <label class="field"><span>Email <em>(consigliata, serve per recuperare la password)</em></span><input name="email" type="email" autocomplete="email"></label>
          <label class="field"><span>Password <em>(almeno 6 caratteri)</em></span><input name="pw" type="password" autocomplete="new-password" required minlength="6"></label>
          <label class="check"><input type="checkbox" name="terms" required><span>Ho letto l'<a href="#/privacy">informativa sulla privacy</a> e accetto le <a href="#/condizioni">condizioni d'uso</a>. Sono maggiorenne.</span></label>
          <button class="btn green block" type="submit">Crea il mio account</button>
        </form>`}
        ${legalLinks()}
      </div>`;
      $$('[data-tab]').forEach((b) => b.onclick = () => { tab = b.dataset.tab; draw(); });
      const f = $('#f');
      f.onsubmit = async (ev) => {
        ev.preventDefault();
        const btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Un momento…';
        try {
          if (tab === 'login') await S.signIn(f.id.value, f.pw.value);
          else {
            signingUp = true;
            try { await S.signUp({ name: f.name.value, username: f.user.value, email: f.email.value, password: f.pw.value, termsVersion: Legal.version }); } finally { signingUp = false; }
          }
          invalidate('exercises', 'teams', 'sessions');
          if (location.hash === '#/') render(); else location.hash = '#/';
        } catch (e) { draw(errText(e)); }
      };
      const fg = $('#forgot');
      if (fg) fg.onclick = async (ev) => {
        ev.preventDefault();
        const v = await UI.prompt('Scrivi la tua email o il tuo nome utente: ti mandiamo un link per scegliere una nuova password.');
        if (!v) return;
        try { await S.resetPassword(v); UI.alert('Fatto! Controlla la tua email (anche nella cartella spam).'); } catch (e) { UI.alert(errText(e)); }
      };
    };
    draw();
  });

  /* ================= HOME ================= */
  route(/^\/$/, async () => {
    const [ss, ts, exs] = await Promise.all([sessions(), teams(), exercises()]);
    const name = (S.user.name || S.user.username).split(' ')[0];
    const today = todayISO();
    const todays = ss.filter((s) => s.date === today);
    const recent = ss.slice(0, 4);
    const community = exs.filter((e) => !e.base).slice(0, 4);
    const teamName = (id) => (ts.find((t) => t.id === id) || {}).name || 'Senza squadra';
    app.innerHTML = `
      ${demoNotice()}
      <section class="hero">
        <h1>Ciao ${esc(name)}!</h1>
        <p>${todays.length ? 'Oggi hai un allenamento pronto.' : 'Prepariamo insieme l\'allenamento di oggi?'}</p>
        ${todays.length ? `<a class="btn green" href="#/allenamento/${todays[0].id}">Apri l'allenamento di oggi</a>` : `<a class="btn green" href="#/allenamento/nuovo">${I.plus} Nuovo allenamento</a>`}
        <svg class="smile" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="36" cy="30" rx="7" ry="13" fill="#69B32D"/><ellipse cx="64" cy="30" rx="7" ry="13" fill="#69B32D"/><path d="M14 52 Q50 104 86 52" fill="none" stroke="#69B32D" stroke-width="9" stroke-linecap="round"/></svg>
      </section>

      ${!ts.length ? `<div class="card"><h3>Primo passo: crea la tua squadra</h3><p class="muted">Così potrai salvare lo storico degli allenamenti per ogni gruppo.</p><a class="btn" href="#/squadre?nuova=1">${I.plus} Crea una squadra</a></div>` : ''}

      <div class="section-title"><h2>Ultimi allenamenti</h2>${ss.length ? '<a href="#/allenamenti">Vedi tutti</a>' : ''}</div>
      ${recent.length ? recent.map((s) => sessionItem(s, teamName(s.teamId))).join('') : '<div class="empty">Non hai ancora preparato allenamenti.</div>'}

      <div class="section-title"><h2>Esplora gli esercizi</h2><a href="#/esercizi">Tutti</a></div>
      <div class="chips">${GOALS.map((g) => `<a class="chip" href="#/esercizi?obiettivo=${g.k}"><span class="dot" style="background:${g.color}"></span>${g.label}</a>`).join('')}</div>

      ${community.length ? `<div class="section-title"><h2>Nuovi dagli allenatori</h2></div><div class="ex-list">${community.map(exCard).join('')}</div>` : ''}
    `;
  });

  function sessionItem(s, teamName) {
    const d = fmtShort(s.date);
    const n = (s.blocks || []).length;
    return `<a class="list-item" href="#/allenamento/${s.id}">
      <div class="ico">${d.d}<small>${esc(d.m)}</small></div>
      <div class="grow"><div class="t">${esc(s.title || 'Allenamento')}</div><div class="s">${esc(teamName)} · ${n} eserciz${n === 1 ? 'io' : 'i'} · ${sessionMinutes(s)} min</div></div>
      ${I.chev}</a>`;
  }

  function exCard(e) {
    return `<a class="ex-card" href="#/esercizio/${e.id}">
      ${window.Pitch.render(e.diagram)}
      <div class="body">
        ${goalTag(e.goal)}
        <h3>${esc(e.title)}</h3>
        <div class="meta">${diffDots(e.difficulty)} <span>${DIFF[e.difficulty] || ''}</span> · <span>${+e.duration || '?'} min</span>${e.base ? '' : ` · <span>di ${esc(e.authorName || 'un allenatore')}</span>`}</div>
      </div></a>`;
  }

  /* ================= ESERCIZI ================= */
  function filterExercises(list, f) {
    const q = (f.q || '').trim().toLowerCase();
    return list.filter((e) =>
      (!f.goal || e.goal === f.goal) &&
      (!f.diff || +e.difficulty === +f.diff) &&
      (!f.mine || e.authorId === S.user.uid) &&
      (!q || (e.title + ' ' + (e.description || '') + ' ' + (e.equipment || '')).toLowerCase().includes(q)));
  }
  function filterBar(f) {
    return `
      <div class="searchbox">${I.search}<input type="search" id="q" placeholder="Cerca un esercizio" value="${esc(f.q || '')}"></div>
      <div class="chips" id="goal-chips">
        <button type="button" class="chip ${!f.goal ? 'on' : ''}" data-goal="">Tutti</button>
        ${GOALS.map((g) => `<button type="button" class="chip ${f.goal === g.k ? 'on' : ''}" data-goal="${g.k}"><span class="dot" style="background:${g.color}"></span>${g.label}</button>`).join('')}
      </div>
      <div class="chips" id="diff-chips">
        <button type="button" class="chip ${!f.diff ? 'on' : ''}" data-diff="">Ogni difficoltà</button>
        ${[1, 2, 3].map((d) => `<button type="button" class="chip ${+f.diff === d ? 'on' : ''}" data-diff="${d}">${diffDots(d)} ${DIFF[d]}</button>`).join('')}
        <button type="button" class="chip ${f.mine ? 'on' : ''}" data-mine="1">Solo i miei</button>
      </div>`;
  }
  function bindFilters(root, f, onChange) {
    const q = $('#q', root);
    q.oninput = () => { f.q = q.value; onChange(); };
    $$('[data-goal]', root).forEach((b) => b.onclick = () => { f.goal = b.dataset.goal; $$('[data-goal]', root).forEach((x) => x.classList.toggle('on', x === b)); onChange(); });
    $$('[data-diff]', root).forEach((b) => b.onclick = () => { f.diff = b.dataset.diff; $$('[data-diff]', root).forEach((x) => x.classList.toggle('on', x === b)); onChange(); });
    const m = $('[data-mine]', root); m.onclick = () => { f.mine = !f.mine; m.classList.toggle('on', f.mine); onChange(); };
  }

  route(/^\/esercizi$/, async (m, q) => {
    const all = await exercises();
    const f = { goal: q.get('obiettivo') || '', diff: '', q: '', mine: false };
    app.innerHTML = `
      <div class="row between" style="margin-bottom:12px"><h1 style="margin:0">Esercizi</h1><a class="btn green small" href="#/esercizio/nuovo">${I.plus} Nuovo</a></div>
      ${filterBar(f)}
      <p class="small muted" id="count" style="margin:6px 0 10px"></p>
      <div class="ex-list" id="list"></div>`;
    const draw = () => {
      const list = filterExercises(all, f);
      $('#count').textContent = `${list.length} eserciz${list.length === 1 ? 'io' : 'i'}`;
      $('#list').innerHTML = list.length ? list.map(exCard).join('') : '<div class="empty">Nessun esercizio trovato con questi filtri.</div>';
    };
    bindFilters(app, f, draw);
    draw();
  });

  route(/^\/esercizio\/nuovo$/, async (m, q) => exerciseForm(null, q.get('copia')));
  route(/^\/esercizio\/([^/]+)\/modifica$/, async (m) => exerciseForm(m[1]));

  route(/^\/esercizio\/([^/]+)$/, async (m) => {
    const e = await exById(m[1]);
    if (!e) { app.innerHTML = '<div class="empty">Esercizio non trovato.</div>'; return; }
    const mine = e.authorId && e.authorId === S.user.uid;
    const steps = Array.isArray(e.steps) ? e.steps : String(e.steps || '').split('\n').filter((x) => x.trim());
    app.innerHTML = `
      <a class="backlink" href="#/esercizi">${I.back} Esercizi</a>
      <div class="detail-head">
        <div class="tags">${goalTag(e.goal)} <span class="tag">${diffDots(e.difficulty)} ${DIFF[e.difficulty] || ''}</span></div>
        <h1>${esc(e.title)}</h1>
        <p class="muted small">${e.base ? 'Dalla libreria Tukiki' : `Creato da ${esc(e.authorName || 'un allenatore')}`}</p>
      </div>
      ${window.Pitch.render(e.diagram)}
      <div class="facts">
        <div><b>${+e.duration || '–'}'</b><span>minuti</span></div>
        <div><b style="font-size:.95rem">${esc(e.players || '–')}</b><span>giocatori</span></div>
        <div><b style="font-size:.95rem">${DIFF[e.difficulty] || '–'}</b><span>difficoltà</span></div>
      </div>
      ${e.description ? `<p style="font-size:1.05rem">${nl2br(e.description)}</p>` : ''}
      ${steps.length ? `<div class="card"><h3>Come si fa</h3><ol class="steps">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
      ${e.equipment ? `<div class="card flat"><h3>Materiale</h3><p style="margin:0">${esc(e.equipment)}</p></div>` : ''}
      ${e.tips ? `<div class="card flat"><h3>Consigli per il mister</h3><p style="margin:0">${nl2br(e.tips)}</p></div>` : ''}
      ${e.easier || e.harder ? `<h3 style="margin-top:18px">Adattalo al gruppo</h3><div class="adapt">
        ${e.easier ? `<div class="easy"><h4>Più facile</h4>${nl2br(e.easier)}</div>` : ''}
        ${e.harder ? `<div class="hard"><h4>Più difficile</h4>${nl2br(e.harder)}</div>` : ''}</div>` : ''}
      <div class="stack" style="margin-top:20px">
        <a class="btn green block" href="#/allenamento/nuovo?esercizio=${e.id}">${I.plus} Usa in un nuovo allenamento</a>
        <div class="row">
          ${mine ? `<a class="btn light grow" href="#/esercizio/${e.id}/modifica">Modifica</a>` : ''}
          <a class="btn light grow" href="#/esercizio/nuovo?copia=${e.id}">${I.copy} Crea una mia versione</a>
        </div>
        ${mine ? '<button class="btn danger block" id="del">Elimina esercizio</button>' : ''}
      </div>`;
    const del = $('#del');
    if (del) del.onclick = async () => {
      if (!await UI.confirm('Eliminare questo esercizio? Sparirà anche per gli altri allenatori.', 'Elimina', true)) return;
      try { await S.deleteExercise(e.id); invalidate('exercises'); toast('Esercizio eliminato'); location.hash = '#/esercizi'; } catch (err) { UI.alert(errText(err)); }
    };
  });

  async function exerciseForm(id, copyId) {
    let e;
    if (id) {
      e = await exById(id);
      if (!e || e.authorId !== S.user.uid) { app.innerHTML = '<div class="empty">Puoi modificare solo gli esercizi che hai creato tu.</div>'; return; }
      e = JSON.parse(JSON.stringify(e));
    } else if (copyId) {
      const src = await exById(copyId);
      e = JSON.parse(JSON.stringify(src || {}));
      delete e.id; delete e.base; delete e.authorId; delete e.authorName; delete e.createdAt;
      e.title = (e.title || '') + ' (mia versione)';
    } else {
      e = { title: '', goal: 'passaggio', difficulty: 1, duration: 10, players: '', equipment: '', description: '', steps: [], tips: '', easier: '', harder: '', diagram: { field: 'free', items: [] } };
    }
    const stepsText = Array.isArray(e.steps) ? e.steps.join('\n') : (e.steps || '');
    app.innerHTML = `
      <a class="backlink" href="${id ? '#/esercizio/' + id : '#/esercizi'}">${I.back} Indietro</a>
      <h1>${id ? 'Modifica esercizio' : 'Nuovo esercizio'}</h1>
      <p class="muted small">Gli esercizi che crei sono visibili a tutti gli allenatori Tukiki.</p>
      <div id="err"></div>
      <form id="f">
        <label class="field"><span>Nome dell'esercizio</span><input name="title" type="text" required value="${esc(e.title)}" placeholder="Es. Slalom e tiro"></label>
        <div class="grid2 resp">
          <label class="field"><span>Obiettivo</span><select name="goal">${GOALS.map((g) => `<option value="${g.k}" ${e.goal === g.k ? 'selected' : ''}>${g.label}</option>`).join('')}</select></label>
          <label class="field"><span>Difficoltà</span><select name="difficulty">${[1, 2, 3].map((d) => `<option value="${d}" ${+e.difficulty === d ? 'selected' : ''}>${DIFF[d]}</option>`).join('')}</select></label>
        </div>
        <div class="grid2">
          <label class="field"><span>Durata (minuti)</span><input name="duration" type="number" min="1" max="120" inputmode="numeric" value="${esc(e.duration)}"></label>
          <label class="field"><span>Giocatori</span><input name="players" type="text" value="${esc(e.players)}" placeholder="Es. 6-12"></label>
        </div>
        <h3 style="margin-top:6px">Schema del campo</h3>
        <p class="small muted" style="margin-bottom:4px">Scegli un elemento qui sotto e tocca il campo per metterlo. Per le frecce, trascina il dito.</p>
        <div id="editor"></div>
        <label class="field" style="margin-top:16px"><span>Materiale</span><input name="equipment" type="text" value="${esc(e.equipment)}" placeholder="Es. 6 coni, 1 pallone a testa"></label>
        <label class="field"><span>Descrizione breve</span><textarea name="description" placeholder="In due righe: cosa si fa?">${esc(e.description)}</textarea></label>
        <label class="field"><span>Come si fa <em>(un passaggio per riga)</em></span><textarea name="steps" rows="5">${esc(stepsText)}</textarea></label>
        <label class="field"><span>Consigli per il mister</span><textarea name="tips">${esc(e.tips)}</textarea></label>
        <div class="grid2 resp">
          <label class="field"><span>Per renderlo più facile</span><textarea name="easier">${esc(e.easier)}</textarea></label>
          <label class="field"><span>Per renderlo più difficile</span><textarea name="harder">${esc(e.harder)}</textarea></label>
        </div>
        <button class="btn green block" type="submit">Salva esercizio</button>
      </form>`;
    const ed = new window.Pitch.Editor($('#editor'), e.diagram, () => {});
    const f = $('#f');
    f.onsubmit = async (ev) => {
      ev.preventDefault();
      if (!f.title.value.trim()) { $('#err').innerHTML = '<div class="error-msg">Dai un nome all\'esercizio.</div>'; return; }
      const doc = Object.assign(e, {
        title: f.title.value.trim(), goal: f.goal.value, difficulty: +f.difficulty.value, duration: +f.duration.value || 10,
        players: f.players.value.trim(), equipment: f.equipment.value.trim(), description: f.description.value.trim(),
        steps: f.steps.value.split('\n').map((x) => x.trim()).filter(Boolean), tips: f.tips.value.trim(),
        easier: f.easier.value.trim(), harder: f.harder.value.trim(), diagram: ed.value(),
      });
      const btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Salvataggio…';
      try {
        const saved = await S.saveExercise(doc);
        invalidate('exercises'); toast('Esercizio salvato!');
        location.hash = '#/esercizio/' + saved.id;
      } catch (err) { btn.disabled = false; btn.textContent = 'Salva esercizio'; $('#err').innerHTML = `<div class="error-msg">${esc(errText(err))}</div>`; window.scrollTo(0, 0); }
    };
  }

  /* ================= SQUADRE ================= */
  route(/^\/squadre$/, async (m, q) => {
    const [ts, ss] = await Promise.all([teams(), sessions()]);
    app.innerHTML = `
      <div class="row between" style="margin-bottom:12px"><h1 style="margin:0">Le mie squadre</h1><button class="btn green small" id="new">${I.plus} Nuova</button></div>
      ${ts.length ? ts.map((t) => {
        const n = ss.filter((s) => s.teamId === t.id).length;
        return `<a class="list-item" href="#/squadra/${t.id}"><div class="ico">${esc(initials(t.name))}</div><div class="grow"><div class="t">${esc(t.name)}</div><div class="s">${esc(t.group || '')}${t.group ? ' · ' : ''}${n} allenament${n === 1 ? 'o' : 'i'}</div></div>${I.chev}</a>`;
      }).join('') : '<div class="empty">Non hai ancora squadre.<br>Crea la prima per salvare lo storico degli allenamenti.</div>'}`;
    $('#new').onclick = () => teamModal();
    if (q.get('nuova')) teamModal();
  });

  function teamModal(t) {
    t = t || { name: '', group: '', notes: '' };
    modal(t.id ? 'Modifica squadra' : 'Nuova squadra', `
      <form id="tf">
        <label class="field"><span>Nome della squadra</span><input name="name" type="text" required value="${esc(t.name)}" placeholder="Es. Tukiki Lunedì"></label>
        <label class="field"><span>Gruppo o categoria <em>(facoltativo)</em></span><input name="group" type="text" value="${esc(t.group)}" placeholder="Es. Calcio integrato, Under 14…"></label>
        <label class="field"><span>Note sulla squadra <em>(facoltativo)</em></span><textarea name="notes" placeholder="Es. orari, campo, cose da ricordare sul gruppo">${esc(t.notes)}</textarea></label>
        <p class="small muted privacy-hint">Per proteggere i ragazzi: usa solo nomi o iniziali e non scrivere informazioni sulla salute.</p>
        <button class="btn green block" type="submit">Salva squadra</button>
      </form>`, (root, close) => {
      const f = $('#tf', root);
      setTimeout(() => f.name.focus(), 50);
      f.onsubmit = async (ev) => {
        ev.preventDefault();
        try {
          const saved = await S.saveTeam(Object.assign({}, t, { name: f.name.value.trim(), group: f.group.value.trim(), notes: f.notes.value.trim() }));
          invalidate('teams'); close(); toast('Squadra salvata!');
          if (location.hash === '#/squadra/' + saved.id) render(); else location.hash = '#/squadra/' + saved.id;
        } catch (err) { UI.alert(errText(err)); }
      };
    });
  }

  route(/^\/squadra\/([^/]+)$/, async (m) => {
    const [ts, ss] = await Promise.all([teams(), sessions()]);
    const t = ts.find((x) => x.id === m[1]);
    if (!t) { app.innerHTML = '<div class="empty">Squadra non trovata.</div>'; return; }
    const list = ss.filter((s) => s.teamId === t.id);
    const totalMin = list.reduce((a, s) => a + sessionMinutes(s), 0);
    app.innerHTML = `
      <a class="backlink" href="#/squadre">${I.back} Squadre</a>
      <h1>${esc(t.name)}</h1>
      ${t.group ? `<p class="muted">${esc(t.group)}</p>` : ''}
      ${t.notes ? `<div class="card flat"><p style="margin:0">${nl2br(t.notes)}</p></div>` : ''}
      <div class="facts"><div><b>${list.length}</b><span>allenamenti</span></div><div><b>${totalMin}</b><span>minuti totali</span></div><div><b>${list[0] ? fmtShort(list[0].date).d + ' ' + fmtShort(list[0].date).m : '–'}</b><span>ultimo</span></div></div>
      <a class="btn green block" href="#/allenamento/nuovo?squadra=${t.id}">${I.plus} Nuovo allenamento</a>
      <div class="section-title"><h2>Storico allenamenti</h2></div>
      ${list.length ? list.map((s) => sessionItem(s, t.group || t.name)).join('') : '<div class="empty">Nessun allenamento salvato per questa squadra.</div>'}
      <div class="row" style="margin-top:24px"><button class="btn light grow" id="edit">Modifica</button><button class="btn danger grow" id="del">Elimina</button></div>`;
    $('#edit').onclick = () => teamModal(t);
    $('#del').onclick = async () => {
      if (!await UI.confirm(`Eliminare la squadra "${t.name}" e tutti i suoi ${list.length} allenamenti? Non si può annullare.`, 'Elimina', true)) return;
      try { await S.deleteTeam(t.id); invalidate('teams', 'sessions'); toast('Squadra eliminata'); location.hash = '#/squadre'; } catch (err) { UI.alert(errText(err)); }
    };
  });

  /* ================= ALLENAMENTI ================= */
  route(/^\/allenamenti$/, async () => {
    const [ss, ts] = await Promise.all([sessions(), teams()]);
    let team = '';
    app.innerHTML = `
      <div class="row between" style="margin-bottom:12px"><h1 style="margin:0">Allenamenti</h1><a class="btn green small" href="#/allenamento/nuovo">${I.plus} Nuovo</a></div>
      ${ts.length > 1 ? `<div class="chips"><button type="button" class="chip on" data-team="">Tutte le squadre</button>${ts.map((t) => `<button type="button" class="chip" data-team="${t.id}">${esc(t.name)}</button>`).join('')}</div>` : ''}
      <div id="list" style="margin-top:8px"></div>`;
    const draw = () => {
      const list = ss.filter((s) => !team || s.teamId === team);
      const tn = (id) => (ts.find((t) => t.id === id) || {}).name || 'Senza squadra';
      $('#list').innerHTML = list.length ? list.map((s) => sessionItem(s, tn(s.teamId))).join('') : '<div class="empty">Ancora nessun allenamento.<br><a class="btn green" href="#/allenamento/nuovo">Prepara il primo</a></div>';
    };
    $$('[data-team]').forEach((b) => b.onclick = () => { team = b.dataset.team; $$('[data-team]').forEach((x) => x.classList.toggle('on', x === b)); draw(); });
    draw();
  });

  route(/^\/allenamento\/([^/]+)$/, async (m, q) => {
    const [ts, ss, exs] = await Promise.all([teams(), sessions(), exercises()]);
    let s;
    if (m[1] === 'nuovo') {
      const copy = q.get('copia') && ss.find((x) => x.id === q.get('copia'));
      s = copy ? Object.assign(JSON.parse(JSON.stringify(copy)), { id: undefined, date: todayISO(), notes: '', createdAt: undefined }) :
        { title: '', teamId: q.get('squadra') || (ts[0] && ts[0].id) || '', date: todayISO(), focus: '', blocks: [], notes: '' };
      if (copy) delete s.id;
      const exId = q.get('esercizio');
      if (exId) { const e = exs.find((x) => x.id === exId); if (e) s.blocks.push({ exerciseId: e.id, duration: +e.duration || 10, note: '', snapshot: snap(e) }); }
    } else {
      s = ss.find((x) => x.id === m[1]);
      if (!s) { app.innerHTML = '<div class="empty">Allenamento non trovato.</div>'; return; }
      s = JSON.parse(JSON.stringify(s));
    }
    if (!s.blocks) s.blocks = [];

    let saveTimer = null, saving = Promise.resolve(), dirty = false;
    const status = (txt) => { const el = $('#savestate'); if (el) el.textContent = txt; };
    const doSave = async () => {
      if (!s.teamId && !ts.length) return;
      dirty = false;
      status('Salvataggio…');
      try {
        const saved = await S.saveSession(s);
        const wasNew = !s.id;
        s.id = saved.id; s.createdAt = saved.createdAt; s.ownerId = saved.ownerId;
        invalidate('sessions');
        if (wasNew && location.hash.startsWith('#/allenamento/nuovo')) history.replaceState(null, '', '#/allenamento/' + s.id);
        status('Salvato ✓');
      } catch (e) { status('Non salvato'); toast(errText(e)); }
    };
    const scheduleSave = () => { dirty = true; status('Modifiche…'); clearTimeout(saveTimer); saveTimer = setTimeout(() => { saving = saving.then(doSave); }, 700); };
    cleanup = () => { if (dirty) { clearTimeout(saveTimer); saving.then(doSave); } };

    const exFor = (b) => b.kind === 'text' ? { title: b.title, description: b.text, goal: b.goal, free: true } :
      exs.find((e) => e.id === b.exerciseId) || b.snapshot || { title: 'Esercizio non più disponibile', diagram: { field: 'free', items: [] } };

    const drawBlocks = () => {
      const el = $('#blocks');
      el.innerHTML = s.blocks.length ? s.blocks.map((b, i) => {
        const e = exFor(b);
        const ctrls = `<div class="ctrls">
            <label class="row small" style="gap:6px"><input type="number" min="1" max="120" inputmode="numeric" data-dur value="${esc(b.duration)}" aria-label="Minuti"> min</label>
            <span class="grow"></span>
            <button type="button" class="iconbtn" data-up aria-label="Sposta su" ${i === 0 ? 'disabled style="opacity:.35"' : ''}>${I.up}</button>
            <button type="button" class="iconbtn" data-down aria-label="Sposta giù" ${i === s.blocks.length - 1 ? 'disabled style="opacity:.35"' : ''}>${I.down}</button>
            <button type="button" class="iconbtn" data-rm aria-label="Togli">${I.x}</button>
          </div>`;
        if (b.kind === 'text') {
          return `<div class="block free" data-i="${i}">
          <div class="block-head">
            <div class="block-num">${i + 1}</div>
            <div class="grow">
              <input type="text" data-title value="${esc(b.title)}" aria-label="Nome dell'esercizio" placeholder="Nome dell'esercizio">
              <div style="margin-top:6px" class="row">${b.goal ? goalTag(b.goal) : ''}<span class="tag">Scritto da te</span></div>
            </div>
          </div>
          ${ctrls}
          <textarea data-text placeholder="Come si fa, materiale, regole…">${esc(b.text || '')}</textarea>
        </div>`;
        }
        return `<div class="block" data-i="${i}">
          <div class="block-head">
            <div class="block-num">${i + 1}</div>
            <div class="grow">
              <a href="#/esercizio/${esc(b.exerciseId)}" style="color:inherit;text-decoration:none"><b>${esc(e.title)}</b></a>
              <div style="margin-top:4px">${goalTag(e.goal)}</div>
            </div>
            <div class="mini">${window.Pitch.render(e.diagram)}</div>
          </div>
          ${ctrls}
          <textarea data-note placeholder="Nota su questo esercizio (es. chi fa cosa, variante da usare)">${esc(b.note || '')}</textarea>
        </div>`;
      }).join('') : '<div class="empty">Aggiungi gli esercizi di oggi dalla libreria.</div>';
      $$('.block', el).forEach((node) => {
        const i = +node.dataset.i;
        $('[data-dur]', node).oninput = (ev) => { s.blocks[i].duration = +ev.target.value || 0; updTotal(); scheduleSave(); };
        const on = (sel, key) => { const x = $(sel, node); if (x) x.oninput = (ev) => { s.blocks[i][key] = ev.target.value; scheduleSave(); }; };
        on('[data-note]', 'note'); on('[data-title]', 'title'); on('[data-text]', 'text');
        $('[data-up]', node).onclick = () => { if (i > 0) { [s.blocks[i - 1], s.blocks[i]] = [s.blocks[i], s.blocks[i - 1]]; drawBlocks(); scheduleSave(); } };
        $('[data-down]', node).onclick = () => { if (i < s.blocks.length - 1) { [s.blocks[i + 1], s.blocks[i]] = [s.blocks[i], s.blocks[i + 1]]; drawBlocks(); scheduleSave(); } };
        $('[data-rm]', node).onclick = () => { s.blocks.splice(i, 1); drawBlocks(); scheduleSave(); };
      });
      updTotal();
    };
    const updTotal = () => { const t = $('#total'); if (t) t.textContent = `${s.blocks.length} eserciz${s.blocks.length === 1 ? 'io' : 'i'} · ${sessionMinutes(s)} min`; };

    app.innerHTML = `
      <a class="backlink" href="${s.teamId ? '#/squadra/' + s.teamId : '#/allenamenti'}">${I.back} Indietro</a>
      <div class="row between"><h1 style="margin:0">${m[1] === 'nuovo' ? 'Nuovo allenamento' : 'Allenamento'}</h1><span class="small muted" id="savestate"></span></div>
      <p class="small muted">Le modifiche si salvano da sole.</p>
      ${!ts.length ? `<div class="notice">Per salvare l'allenamento serve una squadra. <a href="#/squadre?nuova=1">Creala ora</a>.</div>` : ''}
      <div class="card">
        <label class="field"><span>Titolo</span><input id="title" type="text" value="${esc(s.title)}" placeholder="Es. Passaggi e partitella"></label>
        <div class="grid2 resp">
          <label class="field"><span>Squadra</span><select id="team">${ts.length ? '' : '<option value="">Nessuna squadra</option>'}${ts.map((t) => `<option value="${t.id}" ${s.teamId === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label>
          <label class="field"><span>Data</span><input id="date" type="date" value="${esc(s.date)}"></label>
        </div>
        <label class="field" style="margin:0"><span>Obiettivo di oggi <em>(facoltativo)</em></span><input id="focus" type="text" value="${esc(s.focus || '')}" placeholder="Es. migliorare i passaggi corti"></label>
      </div>

      <div class="section-title"><h2>Esercizi</h2></div>
      <div id="blocks"></div>
      <button type="button" class="btn light block" id="add">${I.plus} Aggiungi esercizio dalla libreria</button>
      <div class="row" style="margin-top:10px">
        <button type="button" class="btn ghost grow small" id="addfree">${I.plus} Scrivi un esercizio libero</button>
        <button type="button" class="btn ghost grow small" id="import">${I.upload} Da file Word o PDF</button>
      </div>
      <input type="file" id="importfile" accept=".docx,.pdf,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" hidden>

      <div class="card notes-box" style="margin-top:18px">
        <h3>Le mie note personali</h3>
        <p class="small muted">Visibili solo a te. Es. presenze, com'è andata, cosa riprovare. Usa solo nomi o iniziali e non scrivere informazioni sulla salute dei ragazzi.</p>
        <textarea id="notes" rows="5" placeholder="Scrivi qui…">${esc(s.notes || '')}</textarea>
      </div>

      <div class="row" style="margin-top:6px">
        <button type="button" class="btn grow" id="pdf">${I.pdf} Scarica PDF</button>
        ${s.id ? `<a class="btn light grow" href="#/allenamento/nuovo?copia=${s.id}">${I.copy} Duplica</a>` : ''}
      </div>
      ${s.id ? '<button type="button" class="btn danger block" id="del" style="margin-top:10px">Elimina allenamento</button>' : ''}

      <div class="total-bar"><span id="total"></span><button type="button" class="btn green small" id="add2">${I.plus} Esercizio</button></div>`;
    status(s.id ? 'Salvato ✓' : '');
    drawBlocks();

    const bindField = (sel, key, fn) => { const el = $(sel); el.oninput = el.onchange = () => { s[key] = el.value; if (fn) fn(); scheduleSave(); }; };
    bindField('#title', 'title'); bindField('#team', 'teamId'); bindField('#date', 'date'); bindField('#focus', 'focus'); bindField('#notes', 'notes');
    const openPicker = () => pickExercise(exs, (e) => { s.blocks.push({ exerciseId: e.id, duration: +e.duration || 10, note: '', snapshot: snap(e) }); drawBlocks(); scheduleSave(); toast('Aggiunto: ' + e.title); });
    $('#add').onclick = openPicker; $('#add2').onclick = openPicker;
    $('#addfree').onclick = () => { s.blocks.push({ kind: 'text', title: '', text: '', duration: 10, goal: '', note: '' }); drawBlocks(); scheduleSave(); const t = $$('[data-title]'); if (t.length) t[t.length - 1].focus(); };
    const fileIn = $('#importfile');
    $('#import').onclick = () => { fileIn.value = ''; fileIn.click(); };
    fileIn.onchange = async () => {
      const file = fileIn.files[0]; if (!file) return;
      const btn = $('#import'); const old = btn.innerHTML; btn.disabled = true; btn.textContent = 'Leggo il file…';
      try {
        const text = await window.Importer.readFile(file);
        const r = window.Importer.parse(text, exs);
        if (!r.blocks.length) throw new window.Importer.ImportError('Non ho trovato esercizi nel file. Prova a scriverli uno per riga, per esempio "1. Riscaldamento 10 min".');
        reviewImport(r, file.name, exs, (blocks) => {
          if (!s.title && r.title) { s.title = r.title; $('#title').value = r.title; }
          if (!s.focus && r.focus) { s.focus = r.focus; $('#focus').value = r.focus; }
          blocks.forEach((b) => { if (b.exerciseId) b.snapshot = snap(exs.find((e) => e.id === b.exerciseId)); });
          s.blocks.push(...blocks);
          drawBlocks(); scheduleSave();
          toast(`Aggiunti ${blocks.length} esercizi dal file`);
        });
      } catch (e) {
        UI.alert(e instanceof window.Importer.ImportError ? e.message : 'Non riesco a leggere questo file. Prova a salvarlo di nuovo come PDF o .docx.');
      } finally { btn.disabled = false; btn.innerHTML = old; }
    };
    $('#pdf').onclick = () => exportPDF(s, ts.find((t) => t.id === s.teamId), exFor);
    const del = $('#del');
    if (del) del.onclick = async () => {
      if (!await UI.confirm('Eliminare questo allenamento?', 'Elimina', true)) return;
      clearTimeout(saveTimer); dirty = false;
      try { await S.deleteSession(s.id); invalidate('sessions'); toast('Allenamento eliminato'); location.hash = s.teamId ? '#/squadra/' + s.teamId : '#/allenamenti'; } catch (err) { UI.alert(errText(err)); }
    };
    if (m[1] === 'nuovo' && s.blocks.length && ts.length) scheduleSave();
  });

  // schermata di controllo: per ogni parte del file si sceglie l'esercizio della libreria o il testo libero
  function reviewImport(r, fileName, exs, onDone) {
    const blocks = r.blocks.map((b) => Object.assign({}, b));
    const opts = (sel) => `<option value="" ${!sel ? 'selected' : ''}>Testo libero (come nel file)</option>` +
      GOALS.map((g) => `<optgroup label="${esc(g.label)}">${exs.filter((e) => e.goal === g.k).map((e) => `<option value="${e.id}" ${sel === e.id ? 'selected' : ''}>${esc(e.title)}</option>`).join('')}</optgroup>`).join('');
    const found = blocks.filter((b) => b.exerciseId).length;
    modal('Ecco cosa ho trovato', `
      <p class="muted small">Dal file <b>${esc(fileName)}</b> ho trovato ${blocks.length} parti${found ? `, di cui ${found} riconosciut${found === 1 ? 'a' : 'e'} nella libreria` : ''}. Controlla e cambia quello che non va: dopo potrai modificare tutto.</p>
      ${r.title ? `<p class="small" style="margin:0 0 4px">Titolo: <b>${esc(r.title)}</b></p>` : ''}
      ${r.focus ? `<p class="small">Obiettivo: <b>${esc(r.focus)}</b></p>` : ''}
      <div id="ilist">${blocks.map((b, i) => `
        <div class="block" data-i="${i}">
          <div class="block-head"><div class="block-num">${i + 1}</div>
            <div class="grow"><div class="small muted">Nel file:</div><b>${esc(b._src || b.title)}</b>${b.kind === 'text' && b.text ? `<p class="small muted" style="margin:4px 0 0;white-space:pre-line">${esc(b.text.slice(0, 220))}${b.text.length > 220 ? '…' : ''}</p>` : ''}</div>
          </div>
          <div class="ctrls">
            <select data-ex aria-label="Esercizio da usare" class="grow" style="min-width:0;flex:1">${opts(b.exerciseId || '')}</select>
            <label class="row small" style="gap:6px"><input type="number" min="1" max="120" inputmode="numeric" data-dur value="${esc(b.duration)}" aria-label="Minuti"> min</label>
            <button type="button" class="iconbtn" data-rm aria-label="Togli">${I.x}</button>
          </div>
        </div>`).join('')}</div>
      <button type="button" class="btn green block" id="iok" style="margin-top:8px">Aggiungi all'allenamento</button>`, (root, close) => {
      const removed = new Set();
      $$('#ilist .block', root).forEach((node) => {
        const i = +node.dataset.i;
        $('[data-ex]', node).onchange = (ev) => { blocks[i].choice = ev.target.value; blocks[i].changed = true; };
        $('[data-dur]', node).oninput = (ev) => { blocks[i].duration = +ev.target.value || 0; };
        $('[data-rm]', node).onclick = () => { removed.add(i); node.remove(); };
      });
      $('#iok', root).onclick = () => {
        const out = [];
        blocks.forEach((b, i) => {
          if (removed.has(i)) return;
          const choice = b.changed ? b.choice : (b.exerciseId || '');
          const srcText = b.kind === 'text' ? [b.title, b.text].filter(Boolean).join('\n') : (b.note || '');
          if (choice) out.push({ exerciseId: choice, duration: b.duration, note: b.kind === 'text' ? srcText : (b.note || '') });
          else if (b.kind === 'text') out.push({ kind: 'text', title: b.title, text: b.text, duration: b.duration, goal: b.goal, note: '' });
          else out.push({ kind: 'text', title: b._src || 'Esercizio', text: b.note || '', duration: b.duration, goal: (exs.find((e) => e.id === b.exerciseId) || {}).goal || '', note: '' });
        });
        close();
        if (out.length) onDone(out);
      };
    });
  }

  function pickExercise(exs, onPick) {
    const f = { goal: '', diff: '', q: '', mine: false };
    modal('Scegli un esercizio', `${filterBar(f)}<div class="ex-list" id="plist" style="margin-top:10px"></div>`, (root, close) => {
      const draw = () => {
        const list = filterExercises(exs, f);
        $('#plist', root).innerHTML = list.length ? list.map((e) => `<button type="button" class="ex-card" data-id="${e.id}">${window.Pitch.render(e.diagram)}<div class="body">${goalTag(e.goal)}<h3>${esc(e.title)}</h3><div class="meta">${diffDots(e.difficulty)} ${DIFF[e.difficulty] || ''} · ${+e.duration || '?'} min</div></div></button>`).join('') : '<div class="empty">Nessun esercizio trovato.</div>';
        $$('[data-id]', root).forEach((b) => b.onclick = () => { onPick(exs.find((e) => e.id === b.dataset.id)); close(); });
      };
      bindFilters(root, f, draw);
      draw();
    });
  }

  function modal(title, html, setup) {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${esc(title)}</h2><button type="button" class="iconbtn" data-close aria-label="Chiudi">${I.x}</button></div>${html}</div>`;
    document.body.appendChild(bg);
    document.body.style.overflow = 'hidden';
    const close = () => { bg.remove(); document.body.style.overflow = ''; window.removeEventListener('hashchange', close); };
    bg.addEventListener('click', (ev) => { if (ev.target === bg) close(); });
    $('[data-close]', bg).onclick = close;
    window.addEventListener('hashchange', close);
    setup($('.modal', bg), close);
  }

  /* ================= PDF ================= */
  function pdfHTML(s, team, exFor) {
    const blocks = s.blocks || [];
    return `<div class="pdf-page">
      <div class="pdf-head"><img src="img/logo.png" alt="Tukiki"><div class="r"><b>${esc(team ? team.name : '')}</b><br>${esc(fmtDate(s.date))}</div></div>
      <h1 class="pdf-title">${esc(s.title || 'Allenamento')}</h1>
      <div class="pdf-meta">${blocks.length} eserciz${blocks.length === 1 ? 'io' : 'i'} · durata totale ${sessionMinutes(s)} minuti${s.focus ? ' · Obiettivo: ' + esc(s.focus) : ''} · Mister: ${esc(S.user.name || S.user.username)}</div>
      ${blocks.map((b, i) => {
        const e = exFor(b);
        const steps = Array.isArray(e.steps) ? e.steps : String(e.steps || '').split('\n').filter(Boolean);
        if (e.free) {
          return `<div class="pdf-ex free"><div>
          <h3>${i + 1}. ${esc(e.title || 'Esercizio')} <span style="font-weight:400;color:#666">· ${+b.duration || 0} min</span></h3>
          ${e.goal ? `<p style="color:#555">${esc(goalOf(e.goal).label)}</p>` : ''}
          ${e.description ? `<p style="white-space:pre-line">${esc(e.description)}</p>` : ''}
        </div></div>`;
        }
        return `<div class="pdf-ex"><div>${window.Pitch.render(e.diagram)}</div><div>
          <h3>${i + 1}. ${esc(e.title)} <span style="font-weight:400;color:#666">· ${+b.duration || 0} min</span></h3>
          <p style="color:#555">${esc(goalOf(e.goal).label)} · ${DIFF[e.difficulty] || ''}${e.equipment ? ' · ' + esc(e.equipment) : ''}</p>
          ${e.description ? `<p>${esc(e.description)}</p>` : ''}
          ${steps.length ? `<ol>${steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
          ${b.note ? `<p class="pnote"><b>Nota:</b> ${esc(b.note)}</p>` : ''}
        </div></div>`;
      }).join('')}
      ${s.notes ? `<div class="pdf-notes"><b>Note personali</b><br>${esc(s.notes)}</div>` : ''}
      <div class="pdf-foot">Tukiki :) — Il sorriso è la risposta più potente a ogni difficoltà</div>
    </div>`;
  }
  let h2pPromise = null;
  function loadHtml2pdf() {
    if (window.html2pdf) return Promise.resolve();
    if (!h2pPromise) h2pPromise = new Promise((res, rej) => {
      const sc = document.createElement('script');
      sc.src = 'js/vendor/html2pdf.bundle.min.js';
      sc.onload = res; sc.onerror = rej; document.head.appendChild(sc);
    });
    return h2pPromise;
  }
  // gli schemi SVG diventano immagini, così il PDF li disegna in modo fedele
  async function svgsToImages(root) {
    const svgs = $$('svg', root);
    await Promise.all(svgs.map((svg) => new Promise((res) => {
      const c = svg.cloneNode(true);
      c.setAttribute('width', '1050'); c.setAttribute('height', '680');
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c));
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement('canvas'); cv.width = 1050; cv.height = 680;
        cv.getContext('2d').drawImage(img, 0, 0, 1050, 680);
        const out = new Image(); out.src = cv.toDataURL('image/jpeg', 0.92); out.style.width = '100%'; out.style.display = 'block';
        out.onload = () => { svg.replaceWith(out); res(); };
        out.onerror = res;
      };
      img.onerror = res;
      img.src = url;
    })));
  }
  async function exportPDF(s, team, exFor) {
    if (!(s.blocks || []).length) { toast('Aggiungi almeno un esercizio'); return; }
    const root = $('#print-root');
    root.innerHTML = pdfHTML(s, team, exFor);
    // dentro l'anteprima (pagina incorporata) il browser blocca i download: mostriamo il PDF a schermo
    let embedded = false; try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
    if (embedded) {
      modal('Il tuo PDF', `<div class="notice">Questa è l'anteprima: qui il browser non permette di scaricare file. Sul sito vero il pulsante scarica il PDF così com'è qui sotto.</div><div class="pdf-preview">${root.innerHTML}</div>`, () => {});
      return;
    }
    const name = `Allenamento ${team ? team.name + ' ' : ''}${s.date || ''}`.replace(/[^\w\- àèéìòù]/gi, '').trim() + '.pdf';
    const btn = $('#pdf'); const old = btn.innerHTML; btn.disabled = true; btn.textContent = 'Preparo il PDF…';
    try {
      await loadHtml2pdf();
      const holder = document.createElement('div');
      holder.style.cssText = 'position:absolute;left:0;top:0;z-index:-1;background:#fff;width:190mm';
      holder.innerHTML = root.innerHTML;
      document.body.appendChild(holder);
      await svgsToImages(holder);
      await window.html2pdf().set({
        margin: [10, 10, 10, 10], filename: name,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.pdf-ex' },
      }).from(holder.firstElementChild).save();
      holder.remove();
    } catch (e) {
      $$('body > div[style*="z-index:-1"]').forEach((x) => x.remove());
      // in alternativa: stampa del browser, da cui si può scegliere "Salva come PDF"
      try { window.print(); } catch (x) { UI.alert('Non riesco a creare il PDF su questo dispositivo.'); }
    } finally { btn.disabled = false; btn.innerHTML = old; }
  }

  /* ================= PROFILO ================= */
  route(/^\/profilo$/, async () => {
    const [ts, ss, exs] = await Promise.all([teams(), sessions(), exercises()]);
    const myEx = exs.filter((e) => e.authorId === S.user.uid).length;
    app.innerHTML = `
      <h1>Il mio profilo</h1>
      <div class="card">
        <form id="pf">
          <label class="field"><span>Nome</span><input name="name" type="text" value="${esc(S.user.name)}"></label>
          <p class="small muted">Nome utente: <b>${esc(S.user.username)}</b>${S.user.email ? `<br>Email: <b>${esc(S.user.email)}</b>` : ''}</p>
          <button class="btn light" type="submit">Salva nome</button>
        </form>
      </div>
      <div class="facts"><div><b>${ts.length}</b><span>squadre</span></div><div><b>${ss.length}</b><span>allenamenti</span></div><div><b>${myEx}</b><span>miei esercizi</span></div></div>
      ${demoNotice()}
      <button class="btn danger block" id="out">Esci</button>
      <div class="card flat" style="margin-top:22px">
        <h3>I miei dati</h3>
        <p class="small muted">Puoi scaricare una copia di tutto quello che hai salvato, oppure eliminare il tuo account.</p>
        <div class="row">
          <button type="button" class="btn light grow" id="export">Scarica i miei dati</button>
          <button type="button" class="btn danger grow" id="del">Elimina il mio account</button>
        </div>
      </div>
      ${legalLinks()}
      <p class="small muted" style="text-align:center;margin-top:8px">Coach Tukiki · fatto con il sorriso per gli allenatori Tukiki :)</p>`;
    $('#export').onclick = async () => {
      try {
        const data = await S.exportData();
        const blob = new Blob([JSON.stringify(Object.assign({ app: 'Coach Tukiki', scaricatoIl: new Date().toISOString() }, data), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = `coach-tukiki-${S.user.username || 'dati'}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      } catch (e) { UI.alert(errText(e)); }
    };
    $('#del').onclick = () => modal('Elimina il mio account', `
      <form id="df">
        <p>Verranno cancellati per sempre il tuo account, le tue squadre, i tuoi allenamenti e le tue note. Non si può tornare indietro.</p>
        ${myEx ? `<label class="check"><input type="checkbox" name="keep" checked><span>Lascia i miei ${myEx} esercizi nella libreria degli altri allenatori, senza il mio nome</span></label>` : ''}
        <label class="field"><span>Per confermare, scrivi la tua password</span><input name="pw" type="password" autocomplete="current-password" required></label>
        <button class="btn danger block" type="submit">Elimina per sempre</button>
      </form>`, (root, close) => {
      const f = $('#df', root);
      f.onsubmit = async (ev) => {
        ev.preventDefault();
        const btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Un momento…';
        try {
          await S.deleteAccount({ password: f.pw.value, keepExercises: !!(f.keep && f.keep.checked) });
          close(); invalidate('exercises', 'teams', 'sessions');
          location.hash = '#/accedi';
          UI.alert('Il tuo account è stato eliminato. Grazie per aver allenato con noi!');
        } catch (e) { btn.disabled = false; btn.textContent = 'Elimina per sempre'; UI.alert(errText(e)); }
      };
    });
    $('#pf').onsubmit = async (ev) => { ev.preventDefault(); try { await S.updateProfile({ name: ev.target.name.value.trim() }); toast('Salvato!'); render(); } catch (e) { UI.alert(errText(e)); } };
    $('#out').onclick = async () => { await S.signOut(); invalidate('exercises', 'teams', 'sessions'); location.hash = '#/accedi'; };
  });

  /* ---------- Avvio ---------- */
  (async function start() {
    app.innerHTML = '<p class="muted" style="text-align:center;margin-top:40px">Caricamento…</p>';
    try { await S.init(); } catch (e) {
      app.innerHTML = '<div class="error-msg">Non riesco a collegarmi. Controlla la connessione internet e ricarica la pagina.</div>';
      return;
    }
    let lastUid = S.user ? S.user.uid : null, lastTerms = S.user ? S.user.termsVersion : null;
    S.onAuth((u) => {
      const id = u ? u.uid : null, terms = u ? u.termsVersion : null;
      if (id !== lastUid) { lastUid = id; lastTerms = terms; invalidate('exercises', 'teams', 'sessions'); render(); }
      else if (terms !== lastTerms) { lastTerms = terms; render(); }
    });
    render();
  })();
})();
