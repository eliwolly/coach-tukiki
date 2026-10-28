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
  const ANON_AUTHOR = 'Un allenatore Tukiki';

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
      if (u) this.user = { uid: u.uid, username: u.username, name: u.name, email: u.email, termsVersion: u.termsVersion || '' };
    }
  }
  LocalStore.prototype = {
    async init() { this.emit(); },
    onAuth(cb) { this.listeners.push(cb); },
    emit() { this.listeners.forEach((cb) => cb(this.user)); },
    async signUp({ username, email, password, name, termsVersion }) {
      const u = validateSignup({ username, email, password });
      const users = ls.get('tk_users', {});
      if (Object.values(users).some((x) => x.username === u)) throw new AppError('Questo nome utente è già usato. Scegline un altro.');
      if (email && Object.values(users).some((x) => x.email && x.email.toLowerCase() === email.toLowerCase())) throw new AppError('Esiste già un account con questa email.');
      const rec = { uid: uid(), username: u, name: (name || '').trim() || username, email: (email || '').trim(), pw: await hash(password), termsVersion: termsVersion || '', termsAcceptedAt: now() };
      users[rec.uid] = rec; ls.set('tk_users', users); ls.set('tk_current', rec.uid);
      this.user = { uid: rec.uid, username: rec.username, name: rec.name, email: rec.email, termsVersion: rec.termsVersion };
      this.emit();
    },
    async signIn(identifier, password) {
      const id = String(identifier || '').trim().toLowerCase();
      const users = Object.values(ls.get('tk_users', {}));
      const rec = users.find((x) => x.username === id || (x.email && x.email.toLowerCase() === id));
      if (!rec || rec.pw !== await hash(password)) throw new AppError('Nome utente/email o password non corretti.');
      ls.set('tk_current', rec.uid);
      this.user = { uid: rec.uid, username: rec.username, name: rec.name, email: rec.email, termsVersion: rec.termsVersion || '' };
      this.emit();
    },
    async signOut() { ls.del('tk_current'); this.user = null; this.emit(); },
    async resetPassword() { throw new AppError('Nella modalità prova il recupero password non è disponibile.'); },
    async updateProfile({ name }) {
      const users = ls.get('tk_users', {}); users[this.user.uid].name = name; ls.set('tk_users', users);
      this.user.name = name; this.emit();
    },
    async acceptTerms(version) {
      const users = ls.get('tk_users', {}); Object.assign(users[this.user.uid], { termsVersion: version, termsAcceptedAt: now() }); ls.set('tk_users', users);
      this.user.termsVersion = version;
    },
    async exportData() {
      const p = Object.assign({}, ls.get('tk_users', {})[this.user.uid]); delete p.pw;
      return { profilo: p, squadre: await this.listTeams(), allenamenti: await this.listSessions(), esercizi: (await this.listExercises()).filter((e) => e.authorId === this.user.uid) };
    },
    async deleteAccount({ password, keepExercises }) {
      const users = ls.get('tk_users', {}); const rec = users[this.user.uid];
      if (!rec || rec.pw !== await hash(password)) throw new AppError('La password non è corretta.');
      const me = this.user.uid;
      Object.values(this._all('sessions')).filter((x) => x.ownerId === me).forEach((x) => this._del('sessions', x.id));
      Object.values(this._all('teams')).filter((x) => x.ownerId === me).forEach((x) => this._del('teams', x.id));
      Object.values(this._all('exercises')).filter((x) => x.authorId === me).forEach((x) => {
        if (keepExercises) this._put('exercises', Object.assign({}, x, { authorName: ANON_AUTHOR })); else this._del('exercises', x.id);
      });
      delete users[me]; ls.set('tk_users', users); ls.del('tk_current');
      this.user = null; this.emit();
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
    _isMine(d) { return d.ownerId === this.user.uid || (d.members || []).includes(this.user.uid); },
    async listTeams() { return Object.values(this._all('teams')).filter((t) => this._isMine(t)); },
    async saveTeam(t) {
      const doc = Object.assign({}, t);
      if (!doc.id) { doc.id = uid(); doc.createdAt = now(); doc.ownerId = this.user.uid; doc.members = [this.user.uid]; doc.memberNames = { [this.user.uid]: this.user.username }; }
      doc.updatedAt = now();
      return this._put('teams', doc);
    },
    async deleteTeam(id) {
      this._del('teams', id);
      Object.values(this._all('sessions')).filter((s) => s.teamId === id && s.ownerId === this.user.uid).forEach((s) => this._del('sessions', s.id));
    },
    async listSessions() { return Object.values(this._all('sessions')).filter((s) => this._isMine(s)); },
    async saveSession(s) {
      const doc = Object.assign({}, s);
      if (!doc.id) { doc.id = uid(); doc.createdAt = now(); doc.ownerId = this.user.uid; }
      const team = this._all('teams')[doc.teamId];
      doc.members = team && team.members ? team.members : [doc.ownerId];
      doc.updatedAt = now(); doc.updatedByName = this.user.name || this.user.username;
      return this._put('sessions', doc);
    },
    async deleteSession(id) { this._del('sessions', id); },
    async inviteToTeam() { throw new AppError('Nella versione di prova non si possono invitare altri allenatori.'); },
    async removeFromTeam() { throw new AppError('Nella versione di prova non si possono condividere le squadre.'); },
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
              this.user = { uid: fu.uid, username: p.username || '', name: p.name || p.username || '', email: p.email || '', termsVersion: p.termsVersion || '' };
            }
          } else this.user = null;
          this.emit();
          if (first) { first = false; resolve(); }
        });
      });
    },
    onAuth(cb) { this.listeners.push(cb); },
    emit() { this.listeners.forEach((cb) => cb(this.user)); },
    async signUp({ username, email, password, name, termsVersion }) {
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
        const prof = { username: u, name: (name || '').trim() || username, email: realEmail, createdAt: now(), termsVersion: termsVersion || '', termsAcceptedAt: now() };
        await this.db.collection('users').doc(id).set(prof);
        this.user = { uid: id, username: u, name: prof.name, email: realEmail, termsVersion: prof.termsVersion };
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
    async acceptTerms(version) {
      try { await this.db.collection('users').doc(this.user.uid).set({ termsVersion: version, termsAcceptedAt: now() }, { merge: true }); } catch (e) { throw fbMessage(e); }
      this.user.termsVersion = version;
    },
    async exportData() {
      let p = {};
      try { const d = await this.db.collection('users').doc(this.user.uid).get(); p = d.exists ? d.data() : {}; } catch (e) { throw fbMessage(e); }
      const [squadre, allenamenti, esercizi] = await Promise.all([this.listTeams(), this.listSessions(), this._mine('exercises', 'authorId')]);
      return { profilo: p, squadre, allenamenti, esercizi };
    },
    async _mine(c, field) {
      try {
        const snap = await this.db.collection(c).where(field, '==', this.user.uid).get();
        return snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      } catch (e) { throw fbMessage(e); }
    },
    async deleteAccount({ password, keepExercises }) {
      const fu = this.auth.currentUser;
      if (!fu) throw new AppError('Devi prima entrare nel tuo account.');
      // Firebase chiede di confermare la password prima di eliminare un account
      try { await fu.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(fu.email, password)); }
      catch (e) { throw (e && ['auth/wrong-password', 'auth/invalid-credential'].includes(e.code)) ? new AppError('La password non è corretta.') : fbMessage(e); }
      const me = this.user.uid, username = this.user.username;
      const [ss, ts, exs] = await Promise.all([this.listSessions(), this.listTeams(), this._mine('exercises', 'authorId')]);
      try {
        // squadre mie: cancellate con i loro allenamenti; squadre di altri: esco e lascio a loro gli allenamenti
        for (const t of ts) { if (t.ownerId === me) await this.deleteTeam(t.id); else await this.removeFromTeam(t.id, me); }
        const handled = new Set(ts.map((t) => t.id));
        await Promise.all(ss.filter((x) => !handled.has(x.teamId) && x.ownerId === me).map((x) => this.db.collection('sessions').doc(x.id).delete()));
        await Promise.all(exs.map((x) => keepExercises
          ? this.db.collection('exercises').doc(x.id).update({ authorName: ANON_AUTHOR, updatedAt: now() })
          : this.db.collection('exercises').doc(x.id).delete()));
      } catch (e) { throw fbMessage(e); }
      // il nome utente si libera solo con le regole aggiornate: se non si può, l'account viene eliminato comunque
      if (username) { try { await this.db.collection('usernames').doc(username).delete(); } catch (e) { console.warn('nome utente non cancellato', e); } }
      try { await this.db.collection('users').doc(me).delete(); await fu.delete(); } catch (e) { throw fbMessage(e); }
    },
    async _list(c, mine) {
      try {
        if (!mine) return (await this.db.collection(c).get()).docs.map((d) => Object.assign({ id: d.id }, d.data()));
        // i miei documenti: quelli che ho creato e quelli condivisi con me
        const col = this.db.collection(c), me = this.user.uid;
        const [own, shared] = await Promise.all([col.where('ownerId', '==', me).get(), col.where('members', 'array-contains', me).get()
          .catch((e) => { console.warn('condivisione non attiva (regole da aggiornare?)', e); return { docs: [] }; })]);
        const out = {};
        own.docs.concat(shared.docs).forEach((d) => { out[d.id] = Object.assign({ id: d.id }, d.data()); });
        // documenti creati prima della condivisione: aggiungo l'elenco dei membri
        Object.values(out).filter((d) => !d.members && d.ownerId === me).forEach((d) => {
          const patch = c === 'teams' ? { members: [me], memberNames: { [me]: this.user.username } } : { members: [me] };
          Object.assign(d, patch);
          col.doc(d.id).update(patch).catch((e) => console.warn('aggiornamento membri', e));
        });
        return Object.values(out);
      } catch (e) { throw fbMessage(e); }
    },
    async _save(c, doc, ownerField) {
      const d = Object.assign({}, doc);
      try {
        if (!d.id) {
          d.createdAt = now();
          if (ownerField === 'authorId') { d.authorId = this.user.uid; d.authorName = this.user.name || this.user.username; }
          else d.ownerId = this.user.uid;
          if (c === 'teams') { d.members = [this.user.uid]; d.memberNames = { [this.user.uid]: this.user.username }; }
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
    async _team(id) {
      if (!id) return null;
      try { const d = await this.db.collection('teams').doc(id).get(); return d.exists ? d.data() : null; } catch (e) { return null; }
    },
    async saveSession(s) {
      // gli allenamenti li vedono tutti gli allenatori della squadra (le regole controllano che l'elenco coincida)
      const team = await this._team(s.teamId);
      const d = Object.assign({}, s, { updatedByName: this.user.name || this.user.username });
      d.members = team && team.members ? team.members : [d.ownerId || this.user.uid];
      return this._save('sessions', d, 'ownerId');
    },
    async _syncSessions(teamId, team, members) {
      const ss = (await this.listSessions()).filter((x) => x.teamId === teamId);
      // gli allenamenti creati da chi esce passano a chi ha creato la squadra
      await Promise.all(ss.map((x) => this.db.collection('sessions').doc(x.id)
        .update(members.includes(x.ownerId) ? { members } : { members, ownerId: team.ownerId })));
    },
    async inviteToTeam(teamId, username) {
      const u = normUser(username).replace(/^@/, '');
      let d;
      try { d = await this.db.collection('usernames').doc(u).get(); } catch (e) { throw fbMessage(e); }
      if (!u || !d.exists) throw new AppError('Non troviamo nessun allenatore con questo nome utente. Controlla come l\'ha scritto nel suo profilo.');
      const other = d.data().uid;
      const team = await this._team(teamId);
      if ((team.members || []).includes(other)) throw new AppError('Questo allenatore fa già parte della squadra.');
      const members = (team.members || [this.user.uid]).concat(other);
      try {
        await this.db.collection('teams').doc(teamId).update({ members, ['memberNames.' + other]: u, updatedAt: now() });
        await this._syncSessions(teamId, team, members);
      } catch (e) { throw fbMessage(e); }
    },
    async removeFromTeam(teamId, who) {
      const team = await this._team(teamId);
      const members = (team.members || []).filter((x) => x !== who);
      try {
        await this.db.collection('teams').doc(teamId).update({ members, ['memberNames.' + who]: firebase.firestore.FieldValue.delete() });
        await this._syncSessions(teamId, team, members);
      } catch (e) { throw fbMessage(e); }
    },
    deleteSession(id) { return this._delete('sessions', id); },
  };

  const cfg = window.TUKIKI_FIREBASE_CONFIG;
  window.Store = cfg && cfg.apiKey ? new FirebaseStore(cfg) : new LocalStore();
  window.AppError = AppError;
})();
