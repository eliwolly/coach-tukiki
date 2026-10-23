/* Importa un allenamento da un file Word, PDF o di testo.
   Tutto avviene nel browser, senza servizi esterni: si legge il testo,
   lo si divide in parti e si cerca l'esercizio corrispondente nella libreria. */
(function () {
  const loaded = {};
  function loadScript(src) {
    if (!loaded[src]) loaded[src] = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s);
    });
    return loaded[src];
  }

  class ImportError extends Error {}

  async function readDocx(file) {
    await loadScript('js/vendor/mammoth.browser.min.js');
    const r = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return r.value;
  }

  async function readPdf(file) {
    await loadScript('js/vendor/pdf.min.js');
    const lib = window.pdfjsLib;
    lib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
    const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    let out = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const tc = await (await pdf.getPage(p)).getTextContent();
      let lastY = null;
      for (const it of tc.items) {
        const y = it.transform ? Math.round(it.transform[5]) : null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !out.endsWith('\n')) out += '\n';
        out += it.str;
        if (it.hasEOL) out += '\n';
        lastY = y;
      }
      out += '\n\n';
    }
    return out;
  }

  async function readFile(file) {
    const name = (file.name || '').toLowerCase();
    let text;
    if (name.endsWith('.docx')) text = await readDocx(file);
    else if (name.endsWith('.pdf')) text = await readPdf(file);
    else if (name.endsWith('.txt') || name.endsWith('.md')) text = await file.text();
    else if (name.endsWith('.doc')) throw new ImportError('I file .doc del vecchio Word non si leggono. Aprilo in Word e salvalo come .docx o come PDF.');
    else throw new ImportError('Puoi caricare file Word (.docx), PDF o di testo (.txt).');
    if (!text || text.replace(/\s/g, '').length < 10) {
      throw new ImportError('Non trovo testo nel file. Se è un PDF fatto da una foto o una scansione, scrivi gli esercizi in un file Word e riprova.');
    }
    return text;
  }

  /* ---------- Analisi del testo ---------- */
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'");
  const STOP = new Set(['della', 'delle', 'dello', 'degli', 'nella', 'nelle', 'con', 'per', 'tra', 'fra', 'contro', 'sulla', 'mia', 'versione', 'gioco', 'esercizio']);
  const stem = (w) => w.slice(0, 5);
  const words = (s) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w));

  const DUR_RE = /(\d{1,3})\s*(?:-\s*\d{1,3}\s*)?(?:min\b|minuti\b|mins?\b|'|′|’)/i;
  const BULLET_RE = /^\s*(?:\d{1,2}\s*[.)\-:]|[-–—•*·▪●○►]|[a-h]\))\s+/i;
  const PHASE_RE = /^\s*(riscaldamento|attivazione|fase\b|parte\s+(iniziale|centrale|finale)|esercizio\b|esercitazione|partita|partitella|defaticamento|gioco\b|tecnica\b|situazionale|stretching|torello|circuito|percorso|conclusione|saluti|cerchio)/i;
  const GOAL_WORDS = [
    ['portiere', ['portier', 'parat', 'tuff', 'presa', 'prese ']],
    ['riscaldamento', ['riscald', 'attivaz', 'mobilit', 'stretching', 'defatic']],
    ['coordinazione', ['coordin', 'scalett', 'cerchi', 'equilibr', 'ostacol', 'specchio']],
    ['tiro', ['tiro', 'tiri ', 'tirare', 'conclusion', 'porta ']],
    ['passaggio', ['passag', 'passa ', 'torello', 'scambi', 'uno-due']],
    ['dribbling', ['dribbl', '1 contro 1', '1vs1', '1 vs 1', '1c1', 'finta', 'dribbling']],
    ['conduzione', ['conduz', 'condurre', 'conduci', 'slalom', 'palla al piede']],
    ['tattica', ['tattic', 'possesso', 'smarc', 'pressing', 'difesa', 'superiorit', '2 contro 1', '2vs1']],
    ['partita', ['partita', 'partitella', 'gioco libero']],
  ];
  function guessGoal(text) {
    const t = ' ' + norm(text) + ' ';
    for (const [g, keys] of GOAL_WORDS) if (keys.some((k) => t.includes(k))) return g;
    return '';
  }

  function cleanHeader(line) {
    return line.replace(BULLET_RE, '').replace(/[(\[]?\s*\d{1,3}\s*(?:-\s*\d{1,3}\s*)?(?:min\b|minuti\b|mins?\b|'|′|’)\.?\s*[)\]]?/i, '').replace(/^[\s:–—-]+|[\s:–—-]+$/g, '').trim();
  }

  function matchExercise(section, exs) {
    const textStems = new Set(words(section).map(stem));
    let best = null, bestScore = 0;
    for (const e of exs) {
      const tw = [...new Set(words(e.title).map(stem))];
      if (!tw.length) continue;
      const hit = tw.filter((w) => textStems.has(w)).length;
      const score = hit / tw.length;
      if (hit && (score > bestScore || (score === bestScore && best && tw.length > words(best.title).length))) { best = e; bestScore = score; }
    }
    return bestScore >= 0.66 ? best : null;
  }

  function parse(text, exs) {
    const lines = text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+/g, ' ').trim());
    const res = { title: '', focus: '', blocks: [] };
    let i = 0;
    while (i < lines.length && !lines[i]) i++;
    // titolo: prima riga breve che non è già un esercizio
    if (i < lines.length && lines[i].length <= 70 && !BULLET_RE.test(lines[i]) && !DUR_RE.test(lines[i]) && !PHASE_RE.test(lines[i])) {
      res.title = lines[i].replace(/[:.]$/, '');
      i++;
    }
    const sections = [];
    let cur = null;
    const isHeader = (l) => BULLET_RE.test(l) || PHASE_RE.test(l) || (DUR_RE.test(l) && l.length <= 90);
    for (; i < lines.length; i++) {
      const l = lines[i];
      if (!l) { if (cur) cur.blank = true; continue; }
      const obj = l.match(/^\s*(obiettiv[oi]|tema|focus)\b\s*(?:di oggi|della seduta|dell'allenamento)?\s*[:\-–]\s*(.+)$/i);
      if (obj && !res.focus) { res.focus = obj[2].trim(); continue; }
      if (/^\s*(data|squadra|categoria|mister|allenatore|luogo|campo|orario)\s*[:\-–]/i.test(l)) continue;
      if (isHeader(l) || !cur) { cur = { head: l, body: [] }; sections.push(cur); }
      else cur.body.push(l);
    }
    // nessuna struttura riconosciuta: ogni paragrafo diventa una parte
    let parts = sections;
    if (parts.length === 1 && parts[0].body.length > 3) {
      parts = text.split(/\n\s*\n/).map((p) => p.split('\n').map((x) => x.trim()).filter(Boolean)).filter((p) => p.length)
        .map((p) => ({ head: p[0], body: p.slice(1) }));
      if (res.title && parts.length && parts[0].head === res.title) parts.shift();
    }
    parts = parts.slice(0, 20);
    for (const p of parts) {
      const all = [p.head].concat(p.body).join('\n');
      const d = all.match(DUR_RE);
      const duration = d ? Math.min(120, +d[1]) : null;
      const header = cleanHeader(p.head) || p.head;
      const ex = matchExercise(header + ' ' + p.body.slice(0, 2).join(' '), exs);
      const body = p.body.join('\n');
      if (ex) {
        res.blocks.push({ exerciseId: ex.id, duration: duration || +ex.duration || 10, note: [header !== ex.title ? header : '', body].filter(Boolean).join('\n'), _found: ex.title, _src: header });
      } else {
        let title = header, rest = body;
        if (title.length > 70) { rest = title + (rest ? '\n' + rest : ''); title = title.slice(0, 60).replace(/\s+\S*$/, '') + '…'; }
        res.blocks.push({ kind: 'text', title: title || 'Esercizio', text: rest, duration: duration || 10, goal: guessGoal(all), note: '', _src: header });
      }
    }
    return res;
  }

  window.Importer = { readFile, parse, ImportError };
})();
