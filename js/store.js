/* Archivio dati: accesso, esercizi, squadre, allenamenti.
   Due modalità con le stesse funzioni:
   - Firebase (online, condiviso tra tutti gli allenatori) se config.js è compilato
   - Locale (modalità prova, dati solo su questo dispositivo) altrimenti */
(function () {
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => new Date().toISOString();
  const normUser = (u) => String(u || '').trim().toLowerCase();
  const USERNAME_RE = /^[a-z0-9._-]{3,30}$/;
  const SYNTH_DOMAIN = 'utenti.tukiki-allenamenti.app';

  class AppError extends Error {}

  /* ---------- Memoria locale sicura ---------- */
  const mem = {};
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? (k in mem ? mem[k] : d) : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* memoria del browser non disponibile */ } },
    del(k) { delete mem[k]; try { localStorage.removeItem(k); } catch (e) {} },
  };

  async function hash(s) {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) { return 'p:' + btoa(unescape(encodeURIComponent(s))); }
  }

  function validateSignup({ username, email, password }) {
    const u = normUser(username);
    if (!USERNAME_RE.test(u)) throw new AppError('Il nome utente deve avere da 3 a 30 caratteri: lettere, numeri, punto o trattino, senza spazi.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError('L\'email non sembra corretta.');
    if (!password || password.length < 6) throw new AppError('La password deve avere almeno 6 caratteri.');
    return u;
  }

  /* ================= MODALITÀ LOCALE ================= */
  function LocalStore() {
    this.mode = 'local';
    this.listeners = [];
    this.user = null;
    const id = ls.get('tk_current', null);
    if (id) {
      const u = ls.get('tk_users', {})[id];
      if (u) this.user = { uid: u.uid, username: u.username, name: u.name, email: u.email };
    }
  }
  LocalStore.prototype = {
    async init() { this.emit(); },
    onAuth(cb) { this.listeners.push(cb); },
    emit() { this.listeners.forEach((cb) => cb(this.user)); },
    async signUp({ username, email, password, name }) {
      const u = validateSignup({ username, email, password });
      const users = ls.get('tk_users', {});
      if (Object.values(users).some((x) => x.username === u)) throw new AppError('Questo nome utente è già usato. Scegline un altro.');
      if (email && Object.values(users).some((x) => x.email && x.email.toLowerCase() === email.toLowerCase())) throw new AppError('Esiste già un account con questa email.');
      const rec = { uid: uid(), username: u, name: (name || '').trim() || username, email: (email || '').trim(), pw: await hash(password) };
      users[rec.uid] = rec; ls.set('tk_users', users); ls.set('tk_current', rec.uid);
      this.user = { uid: rec.uid, username: rec.username, name: rec.name, email: rec.email };
      this.emit();
    },
    async signIn(identifier, password) {
      const id = String(identifier || '').trim().toLowerCase();
      const users = Object.values(ls.get('tk_users', {}));
      const rec = users.find((x) => x.username === id || (x.email && x.email.toLowerCase() === id));
      if (!rec || rec.pw !== await hash(password)) throw new AppError('Nome utente/email o password non corretti.');
      ls.set('tk_current', rec.uid);
      this.user = { uid: rec.uid, username: rec.username, name: rec.name, email: rec.email };
      this.emit();
    },
    async signOut() { ls.del('tk_current'); this.user = null; this.emit(); },
    async resetPassword() { throw new AppError('Nella modalità prova il recupero password non è disponibile.'); },
    async updateProfile({ name }) {
      const users = ls.get('tk_users', {}); users[this.user.uid].name = name; ls.set('tk_users', users);
      this.user.name = name; this.emit();
    },
    _all(c) { return ls.get('tk_' + c, {}); },
    _put(c, doc) { const all = this._all(c); all[doc.id] = doc; ls.set('tk_' + c, all); return doc; },
    _del(c, id) { const all = this._all(c); delete all[id]; ls.set('tk_' + c, all); },
    async listExercises() { return Object.values(this._all('exercises')); },
    async saveExercise(ex) {
      const doc = Object.assign({}, ex);
      if (!doc.id) { doc.id = uid(); doc.createdAt = now(); doc.authorId = this.user.uid; doc.authorName = this.user.name || this.user.username; }
      doc.updatedAt = now();
      return this._put('exercises', doc);
    },
    async deleteExercise(id) { this._del('exercises', id); },
    async listTeams() { return Object.values(this._all('teams')).filter((t) => t.ownerId === this.user.uid); },
    async saveTeam(t) {
      const doc = Object.assign({}, t);
      if (!doc.id) { doc.id = uid(); doc.createdAt = now(); doc.ownerId = this.user.uid; }
      doc.updatedAt = now();
      return this._put('teams', doc);
    },
    async deleteTeam(id) {
      this._del('teams', id);
      Object.values(this._all('sessions')).filter((s) => s.teamId === id && s.ownerId === this.user.uid).forEach((s) => this._del('sessions', s.id));
    },
    async listSessions() { return Object.values(this._all('sessions')).filter((s) => s.ownerId === this.user.uid); },
    async saveSession(s) {
      const doc = Object.assign({}, s);
      if (!doc.id) { doc.id = uid(); doc.createdAt = now(); doc.ownerId = this.user.uid; }
      doc.updatedAt = now();
      return this._put('sessions', doc);
    },
    async deleteSession(id) { this._del('sessions', id); },
  };

  /* ================= MODALITÀ FIREBASE ================= */
  const FB_VER = '10.14.1';
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
  }
  function fbMessage(e) {
    const c = (e && e.code) || '';
    const map = {
      'auth/invalid-credential': 'Nome utente/email o password non corretti.',
      'auth/wrong-password': 'Nome utente/email o password non corretti.',
      'auth/user-not-found': 'Nome utente/email o password non corretti.',
      'auth/invalid-email': 'L\'email non sembra corretta.',
      'auth/email-already-in-use': 'Esiste già un account con questa email.',
      'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
      'auth/too-many-requests': 'Troppi tentativi. Aspetta qualche minuto e riprova.',
      'auth/network-request-failed': 'Connessione assente. Controlla internet e riprova.',
      'permission-denied': 'Non hai il permesso per questa operazione.',
      'unavailable': 'Connessione assente. Controlla internet e riprova.',
    };
    return new AppError(map[c] || 'Qualcosa non ha funzionato. Riprova tra poco.');
  }
  function FirebaseStore(cfg) {
    this.mode = 'firebase';
    this.cfg = cfg;
    this.user = null;
    this.listeners = [];
  }
  FirebaseStore.prototype = {
    async init() {
      // le librerie di Firebase sono incluse nell'app; se mancano si prendono dal sito di Google
      const load = async (base) => {
        await loadScript(base + 'firebase-app-compat.js');
        await Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]);
      };
      try { await load('js/vendor/firebase/'); } catch (e) { await load(`https://www.gstatic.com/firebasejs/${FB_VER}/`); }
      firebase.initializeApp(this.cfg);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      try { await this.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* non supportato: si va solo online */ }
      return new Promise((resolve) => {
        let first = true;
        this.auth.onAuthStateChanged(async (fu) => {
          if (fu) {
            let p = {};
            try { const d = await this.db.collection('users').doc(fu.uid).get(); p = d.exists ? d.data() : {}; } catch (e) {}
            // durante la registrazione il profilo può non esistere ancora: teniamo quello appena creato
            if (p.username || !this.user || this.user.uid !== fu.uid) {
              this.user = { uid: fu.uid, username: p.username || '', name: p.name || p.username || '', email: p.email || '' };
            }
          } else this.user = null;
          this.emit();
          if (first) { first = false; resolve(); }
        });
      });
    },
    onAuth(cb) { this.listeners.push(cb); },
    emit() { this.listeners.forEach((cb) => cb(this.user)); },
    async signUp({ username, email, password, name }) {
      const u = validateSignup({ username, email, password });
      const unameRef = this.db.collection('usernames').doc(u);
      try {
        const ex = await unameRef.get();
        if (ex.exists) throw new AppError('Questo nome utente è già usato. Scegline un altro.');
      } catch (e) { if (e instanceof AppError) throw e; }
      const realEmail = (email || '').trim();
      const authEmail = realEmail || `${u}@${SYNTH_DOMAIN}`;
      let cred;
      try { cred = await this.auth.createUserWithEmailAndPassword(authEmail, password); } catch (e) { throw fbMessage(e); }
      const id = cred.user.uid;
      try {
        await unameRef.set({ uid: id, email: authEmail });
        const prof = { username: u, name: (name || '').trim() || username, email: realEmail, createdAt: now() };
        await this.db.collection('users').doc(id).set(prof);
        this.user = { uid: id, username: u, name: prof.name, email: realEmail };
        this.emit();
      } catch (e) {
        // nome utente preso nel frattempo: annulliamo l'account appena creato
        try { await cred.user.delete(); } catch (x) {}
        throw new AppError('Questo nome utente è già usato. Scegline un altro.');
      }
    },
    async signIn(identifier, password) {
      let id = String(identifier || '').trim();
      let email = id;
      if (!id.includes('@')) {
        try {
          const d = await this.db.collection('usernames').doc(normUser(id)).get();
          if (!d.exists) throw new AppError('Nome utente/email o password non corretti.');
          email = d.data().email;
        } catch (e) { if (e instanceof AppError) throw e; throw fbMessage(e); }
      }
      try { await this.auth.signInWithEmailAndPassword(email, password); } catch (e) { throw fbMessage(e); }
    },
    async signOut() { await this.auth.signOut(); },
    async resetPassword(identifier) {
      let email = String(identifier || '').trim();
      if (!email.includes('@')) {
        const d = await this.db.collection('usernames').doc(normUser(email)).get();
        if (!d.exists) throw new AppError('Non troviamo questo nome utente.');
        email = d.data().email;
      }
      if (email.endsWith('@' + SYNTH_DOMAIN)) throw new AppError('Questo account non ha un\'email: chiedi aiuto all\'amministratore.');
      try { await this.auth.sendPasswordResetEmail(email); } catch (e) { throw fbMessage(e); }
    },
    async updateProfile({ name }) {
      await this.db.collection('users').doc(this.user.uid).set({ name }, { merge: true });
      this.user.name = name; this.emit();
    },
    async _list(c, mine) {
      try {
        let q = this.db.collection(c);
        if (mine) q = q.where('ownerId', '==', this.user.uid);
        const snap = await q.get();
        return snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      } catch (e) { throw fbMessage(e); }
    },
    async _save(c, doc, ownerField) {
      const d = Object.assign({}, doc);
      try {
        if (!d.id) {
          d.createdAt = now();
          if (ownerField === 'authorId') { d.authorId = this.user.uid; d.authorName = this.user.name || this.user.username; }
          else d.ownerId = this.user.uid;
          d.updatedAt = now();
          const ref = this.db.collection(c).doc();
          d.id = ref.id;
          const data = Object.assign({}, d); delete data.id;
          await ref.set(JSON.parse(JSON.stringify(data)));
        } else {
          d.updatedAt = now();
          const data = Object.assign({}, d); delete data.id;
          await this.db.collection(c).doc(d.id).set(JSON.parse(JSON.stringify(data)));
        }
        return d;
      } catch (e) { throw fbMessage(e); }
    },
    async _delete(c, id) { try { await this.db.collection(c).doc(id).delete(); } catch (e) { throw fbMessage(e); } },
    listExercises() { return this._list('exercises', false); },
    saveExercise(ex) { return this._save('exercises', ex, 'authorId'); },
    deleteExercise(id) { return this._delete('exercises', id); },
    listTeams() { return this._list('teams', true); },
    saveTeam(t) { return this._save('teams', t, 'ownerId'); },
    async deleteTeam(id) {
      const ss = (await this.listSessions()).filter((s) => s.teamId === id);
      for (const s of ss) await this._delete('sessions', s.id);
      await this._delete('teams', id);
    },
    listSessions() { return this._list('sessions', true); },
    saveSession(s) { return this._save('sessions', s, 'ownerId'); },
    deleteSession(id) { return this._delete('sessions', id); },
  };

  const cfg = window.TUKIKI_FIREBASE_CONFIG;
  window.Store = cfg && cfg.apiKey ? new FirebaseStore(cfg) : new LocalStore();
  window.AppError = AppError;
})();
