/* Schemi del campo: disegno SVG ed editor per posizionare coni, palloni, porte, giocatori. */
(function () {
  const W = 105, H = 68;

  // Elementi disponibili nell'editor
  const TOOLS = [
    { t: 'move', label: 'Sposta' },
    { t: 'A', label: 'Squadra A' },
    { t: 'B', label: 'Squadra B' },
    { t: 'J', label: 'Jolly' },
    { t: 'M', label: 'Mister' },
    { t: 'ball', label: 'Pallone' },
    { t: 'cone', label: 'Cono' },
    { t: 'disc', label: 'Cinesino' },
    { t: 'pole', label: 'Paletto' },
    { t: 'hoop', label: 'Cerchio' },
    { t: 'ladder', label: 'Scaletta' },
    { t: 'goal', label: 'Porta' },
    { t: 'mini', label: 'Porticina' },
    { t: 'pass', label: 'Passaggio' },
    { t: 'run', label: 'Corsa' },
    { t: 'drib', label: 'Conduzione' },
    { t: 'shot', label: 'Tiro' },
  ];
  const LINE_TYPES = ['pass', 'run', 'drib', 'shot'];

  const FIELDS = [
    { v: 'free', label: 'Spazio libero' },
    { v: 'half', label: 'Metà campo' },
    { v: 'full', label: 'Campo intero' },
  ];

  const r1 = (n) => Math.round(n * 10) / 10;

  function fieldSVG(type) {
    const L = 'fill="none" stroke="rgba(255,255,255,.85)" stroke-width=".45"';
    let s = '';
    // erba a strisce
    for (let i = 0; i < 10; i++) {
      s += `<rect x="${i * 10.5}" y="0" width="10.5" height="${H}" fill="${i % 2 ? '#4C9D46' : '#47963F'}"/>`;
    }
    s += `<rect x="2.5" y="2.5" width="${W - 5}" height="${H - 5}" ${L}/>`;
    if (type === 'full') {
      s += `<line x1="52.5" y1="2.5" x2="52.5" y2="65.5" ${L}/>`;
      s += `<circle cx="52.5" cy="34" r="9.15" ${L}/><circle cx="52.5" cy="34" r=".5" fill="#fff"/>`;
      s += `<rect x="2.5" y="13.85" width="16.5" height="40.3" ${L}/><rect x="86" y="13.85" width="16.5" height="40.3" ${L}/>`;
      s += `<rect x="2.5" y="24.85" width="5.5" height="18.3" ${L}/><rect x="97" y="24.85" width="5.5" height="18.3" ${L}/>`;
      s += `<circle cx="13.5" cy="34" r=".45" fill="#fff"/><circle cx="91.5" cy="34" r=".45" fill="#fff"/>`;
      s += `<path d="M19 26.7 A9.15 9.15 0 0 1 19 41.3" ${L}/><path d="M86 26.7 A9.15 9.15 0 0 0 86 41.3" ${L}/>`;
      s += `<rect x=".6" y="30.3" width="1.9" height="7.4" fill="rgba(255,255,255,.9)"/><rect x="102.5" y="30.3" width="1.9" height="7.4" fill="rgba(255,255,255,.9)"/>`;
    } else if (type === 'half') {
      s += `<path d="M2.5 20 A14 14 0 0 1 2.5 48" ${L}/>`;
      s += `<rect x="74" y="12" width="28.5" height="44" ${L}/>`;
      s += `<rect x="92.5" y="24" width="10" height="20" ${L}/>`;
      s += `<circle cx="84" cy="34" r=".55" fill="#fff"/>`;
      s += `<path d="M74 26 A12 12 0 0 0 74 42" ${L}/>`;
      s += `<rect x="102.5" y="28.5" width="2" height="11" fill="rgba(255,255,255,.9)"/>`;
    }
    return s;
  }

  function playerSVG(e, fill, txtColor) {
    const n = e.n != null && e.n !== '' ? String(e.n) : '';
    return `<g transform="translate(${e.x} ${e.y})"><circle r="2.7" fill="${fill}" stroke="#fff" stroke-width=".5"/>` +
      (n ? `<text y=".05" text-anchor="middle" dominant-baseline="central" font-size="2.8" font-weight="700" font-family="Work Sans, Arial, sans-serif" fill="${txtColor}">${esc(n)}</text>` : '') + '</g>';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function arrowHead(x1, y1, x2, y2, color, size) {
    const a = Math.atan2(y2 - y1, x2 - x1), s = size || 2.2;
    const p1 = [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)];
    const p2 = [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)];
    return `<polygon points="${r1(x2)},${r1(y2)} ${r1(p1[0])},${r1(p1[1])} ${r1(p2[0])},${r1(p2[1])}" fill="${color}"/>`;
  }

  function lineSVG(e) {
    const { x1, y1, x2, y2 } = e;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    // la linea finisce poco prima della punta
    const ex = x2 - ux * 1.6, ey = y2 - uy * 1.6;
    if (e.t === 'pass') {
      return `<line x1="${x1}" y1="${y1}" x2="${r1(ex)}" y2="${r1(ey)}" stroke="#fff" stroke-width=".6" stroke-dasharray="1.6 1.1"/>` + arrowHead(x1, y1, x2, y2, '#fff');
    }
    if (e.t === 'run') {
      return `<line x1="${x1}" y1="${y1}" x2="${r1(ex)}" y2="${r1(ey)}" stroke="#FFE45C" stroke-width=".6"/>` + arrowHead(x1, y1, x2, y2, '#FFE45C');
    }
    if (e.t === 'shot') {
      return `<line x1="${x1}" y1="${y1}" x2="${r1(ex)}" y2="${r1(ey)}" stroke="#FF7A59" stroke-width="1"/>` + arrowHead(x1, y1, x2, y2, '#FF7A59', 2.8);
    }
    // conduzione: linea ondulata
    const steps = Math.max(4, Math.floor((len - 1.6) / 1.4));
    const nx = -uy, ny = ux;
    let pts = `${x1},${y1}`;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, d = (len - 1.6) * t, off = i === steps ? 0 : (i % 2 ? 0.8 : -0.8);
      pts += ` ${r1(x1 + ux * d + nx * off)},${r1(y1 + uy * d + ny * off)}`;
    }
    return `<polyline points="${pts}" fill="none" stroke="#fff" stroke-width=".55" stroke-linejoin="round"/>` + arrowHead(x1, y1, x2, y2, '#fff');
  }

  function elementSVG(e) {
    const rot = e.r || 0;
    switch (e.t) {
      case 'A': return playerSVG(e, '#E0452E', '#fff');
      case 'B': return playerSVG(e, '#2F6FD6', '#fff');
      case 'J': return playerSVG(e, '#FFD23F', '#1C1B18');
      case 'M': return `<g transform="translate(${e.x} ${e.y})"><rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx="1.2" fill="#1C1B18" stroke="#fff" stroke-width=".5"/><text y=".05" text-anchor="middle" dominant-baseline="central" font-size="2.9" font-weight="700" font-family="Work Sans, Arial, sans-serif" fill="#fff">M</text></g>`;
      case 'ball': return `<g transform="translate(${e.x} ${e.y})"><circle r="1.35" fill="#fff" stroke="#1C1B18" stroke-width=".3"/><circle r=".5" fill="#1C1B18"/></g>`;
      case 'cone': return `<g transform="translate(${e.x} ${e.y})"><polygon points="0,-1.9 1.7,1.4 -1.7,1.4" fill="#FF8A1F" stroke="#B85600" stroke-width=".25"/><rect x="-2" y="1.2" width="4" height=".55" rx=".2" fill="#B85600"/></g>`;
      case 'disc': return `<g transform="translate(${e.x} ${e.y})"><circle r="1.05" fill="#FFD23F" stroke="#B88F00" stroke-width=".25"/><circle r=".35" fill="#B88F00"/></g>`;
      case 'pole': return `<g transform="translate(${e.x} ${e.y})"><circle r=".9" fill="#FFE45C" stroke="#1C1B18" stroke-width=".3"/><line x1="0" y1="-.9" x2="0" y2="-3.6" stroke="#1C1B18" stroke-width=".35"/><line x1="0" y1="-3.6" x2="0" y2="-.9" stroke="#FFE45C" stroke-width=".2"/></g>`;
      case 'hoop': return `<circle cx="${e.x}" cy="${e.y}" r="2.3" fill="none" stroke="#FF4FA0" stroke-width=".6"/>`;
      case 'ladder': {
        let s = `<g transform="translate(${e.x} ${e.y}) rotate(${rot})"><rect x="-1.6" y="-7" width="3.2" height="14" fill="none" stroke="#FFE45C" stroke-width=".4"/>`;
        for (let i = 1; i < 7; i++) s += `<line x1="-1.6" y1="${-7 + i * 2}" x2="1.6" y2="${-7 + i * 2}" stroke="#FFE45C" stroke-width=".35"/>`;
        return s + '</g>';
      }
      case 'goal': return `<g transform="translate(${e.x} ${e.y}) rotate(${rot})"><rect x="-1.2" y="-5" width="2.4" height="10" fill="rgba(255,255,255,.25)" stroke="#fff" stroke-width=".55"/><path d="M-1.2 -2.5 H1.2 M-1.2 0 H1.2 M-1.2 2.5 H1.2 M0 -5 V5" stroke="rgba(255,255,255,.6)" stroke-width=".2"/></g>`;
      case 'mini': return `<g transform="translate(${e.x} ${e.y}) rotate(${rot})"><rect x="-.8" y="-2.6" width="1.6" height="5.2" fill="rgba(255,255,255,.25)" stroke="#fff" stroke-width=".45"/></g>`;
      case 'pass': case 'run': case 'drib': case 'shot': return lineSVG(e);
      default: return '';
    }
  }

  function render(diagram, opts) {
    opts = opts || {};
    const d = diagram || { field: 'free', items: [] };
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schema dell'esercizio">`;
    s += fieldSVG(d.field || 'free');
    // linee sotto, oggetti sopra
    const items = d.items || [];
    items.forEach((e, i) => { if (LINE_TYPES.includes(e.t)) s += `<g data-i="${i}">${elementSVG(e)}</g>`; });
    items.forEach((e, i) => { if (!LINE_TYPES.includes(e.t)) s += `<g data-i="${i}">${elementSVG(e)}</g>`; });
    if (opts.selected != null && items[opts.selected]) {
      const e = items[opts.selected];
      if (LINE_TYPES.includes(e.t)) {
        s += `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="#FFE45C" stroke-width="2.4" stroke-opacity=".35" stroke-linecap="round" pointer-events="none"/>`;
      } else {
        s += `<circle cx="${e.x}" cy="${e.y}" r="${e.t === 'ladder' || e.t === 'goal' ? 7.5 : 4}" fill="none" stroke="#FFE45C" stroke-width=".6" stroke-dasharray="1.2 .8" pointer-events="none"/>`;
      }
    }
    if (opts.draft) s += `<g opacity=".8">${elementSVG(opts.draft)}</g>`;
    s += '</svg>';
    return `<div class="pitch-wrap">${s}</div>`;
  }

  function toolIcon(t) {
    if (t === 'move') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>`;
    const sample = LINE_TYPES.includes(t) ? { t, x1: 2, y1: 10, x2: 20, y2: 4 } : { t, x: 11, y: 7.5, n: t === 'A' || t === 'B' ? '' : undefined, r: t === 'ladder' ? 90 : 0 };
    // gli oggetti piccoli vengono ingranditi per essere riconoscibili nel pulsante
    const vb = LINE_TYPES.includes(t) || t === 'ladder' ? '0 0 22 15' : t === 'goal' ? '3 0 16 15' : '5.5 3.5 11 8';
    return `<svg viewBox="${vb}"><rect x="-5" y="-5" width="32" height="25" fill="#4C9D46"/>${elementSVG(sample)}</svg>`;
  }

  /* ---------- Editor ---------- */
  function Editor(container, diagram, onChange) {
    this.el = container;
    this.d = JSON.parse(JSON.stringify(diagram || { field: 'free', items: [] }));
    if (!this.d.items) this.d.items = [];
    this.tool = 'move';
    this.sel = null;
    this.history = [];
    this.onChange = onChange || function () {};
    this.counters = { A: 0, B: 0 };
    this.d.items.forEach((e) => { if ((e.t === 'A' || e.t === 'B') && +e.n > this.counters[e.t]) this.counters[e.t] = +e.n; });
    this.build();
  }
  Editor.prototype.snapshot = function () {
    this.history.push(JSON.stringify(this.d));
    if (this.history.length > 60) this.history.shift();
  };
  Editor.prototype.build = function () {
    const fieldOpts = FIELDS.map((f) => `<option value="${f.v}" ${this.d.field === f.v ? 'selected' : ''}>${f.label}</option>`).join('');
    this.el.innerHTML = `
      <div class="editor">
        <div class="row" style="margin-bottom:8px">
          <label class="grow" style="margin:0"><select data-act="field" aria-label="Tipo di campo">${fieldOpts}</select></label>
        </div>
        <div class="toolbar" role="toolbar">${TOOLS.map((x) => `<button type="button" class="tool ${x.t === this.tool ? 'on' : ''}" data-tool="${x.t}">${toolIcon(x.t)}<span>${x.label}</span></button>`).join('')}</div>
        <div class="canvas"></div>
        <p class="editor-hint"></p>
        <div class="editor-actions">
          <button type="button" class="btn light small" data-act="undo">↶ Annulla</button>
          <button type="button" class="btn light small sel-only" data-act="rotate">⟳ Ruota</button>
          <button type="button" class="btn light small sel-only" data-act="number">Numero</button>
          <button type="button" class="btn danger small sel-only" data-act="delete">Elimina</button>
          <button type="button" class="btn ghost small" data-act="clear">Svuota campo</button>
        </div>
      </div>`;
    this.canvas = this.el.querySelector('.canvas');
    this.hint = this.el.querySelector('.editor-hint');
    this.el.querySelector('[data-act=field]').addEventListener('change', (ev) => { this.snapshot(); this.d.field = ev.target.value; this.draw(); this.changed(); });
    this.el.querySelectorAll('[data-tool]').forEach((b) => b.addEventListener('click', () => this.setTool(b.dataset.tool)));
    this.el.querySelector('[data-act=undo]').addEventListener('click', () => this.undo());
    this.el.querySelector('[data-act=rotate]').addEventListener('click', () => this.rotate());
    this.el.querySelector('[data-act=number]').addEventListener('click', () => this.number());
    this.el.querySelector('[data-act=delete]').addEventListener('click', () => this.remove());
    this.el.querySelector('[data-act=clear]').addEventListener('click', async () => {
      if (!this.d.items.length) return;
      if (!await window.UI.confirm('Vuoi togliere tutti gli elementi dal campo?', 'Svuota', true)) return;
      this.snapshot(); this.d.items = []; this.sel = null; this.counters = { A: 0, B: 0 }; this.draw(); this.changed();
    });
    this.draw();
  };
  Editor.prototype.setTool = function (t) {
    this.tool = t;
    this.sel = null;
    this.el.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === t));
    this.draw();
  };
  Editor.prototype.updateHint = function () {
    let h;
    if (this.tool === 'move') h = this.sel != null ? 'Trascina per spostare. Puoi anche ruotarlo o eliminarlo.' : 'Tocca un elemento per selezionarlo e trascinalo dove vuoi.';
    else if (LINE_TYPES.includes(this.tool)) h = 'Appoggia il dito dove parte la freccia e trascina fino all\'arrivo.';
    else h = 'Tocca il campo per aggiungere. Puoi aggiungerne quanti vuoi.';
    this.hint.textContent = h;
    const showSel = this.sel != null;
    this.el.querySelectorAll('.sel-only').forEach((b) => b.classList.toggle('hidden', !showSel));
    if (showSel) {
      const e = this.d.items[this.sel];
      this.el.querySelector('[data-act=rotate]').classList.toggle('hidden', !['goal', 'mini', 'ladder'].includes(e.t));
      this.el.querySelector('[data-act=number]').classList.toggle('hidden', !['A', 'B', 'J'].includes(e.t));
    }
  };
  Editor.prototype.draw = function (draft) {
    this.canvas.innerHTML = render(this.d, { selected: this.sel, draft });
    this.canvas.firstElementChild.classList.toggle('mode-move', this.tool === 'move');
    this.svg = this.canvas.querySelector('svg');
    this.bindPointer();
    this.updateHint();
  };
  Editor.prototype.pt = function (ev) {
    const p = this.svg.createSVGPoint();
    p.x = ev.clientX; p.y = ev.clientY;
    const m = this.svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const q = p.matrixTransform(m.inverse());
    return { x: r1(Math.max(1, Math.min(W - 1, q.x))), y: r1(Math.max(1, Math.min(H - 1, q.y))) };
  };
  Editor.prototype.hit = function (p) {
    let best = null, bestD = 4.5;
    this.d.items.forEach((e, i) => {
      let dist;
      if (LINE_TYPES.includes(e.t)) {
        const dx = e.x2 - e.x1, dy = e.y2 - e.y1, L2 = dx * dx + dy * dy || 1;
        let t = ((p.x - e.x1) * dx + (p.y - e.y1) * dy) / L2; t = Math.max(0, Math.min(1, t));
        dist = Math.hypot(p.x - (e.x1 + t * dx), p.y - (e.y1 + t * dy)) + 0.8;
      } else {
        dist = Math.hypot(p.x - e.x, p.y - e.y) - (e.t === 'ladder' || e.t === 'goal' ? 3 : 0);
      }
      if (dist < bestD) { bestD = dist; best = i; }
    });
    return best;
  };
  Editor.prototype.bindPointer = function () {
    const svg = this.svg;
    let drag = null;
    const down = (ev) => {
      ev.preventDefault();
      const p = this.pt(ev);
      svg.setPointerCapture && svg.setPointerCapture(ev.pointerId);
      if (this.tool === 'move') {
        const i = this.hit(p);
        this.sel = i;
        if (i != null) {
          this.snapshot();
          drag = { kind: 'move', start: p, orig: JSON.parse(JSON.stringify(this.d.items[i])), moved: false };
        }
        this.drawLight();
        this.updateHint();
      } else if (LINE_TYPES.includes(this.tool)) {
        drag = { kind: 'line', start: p, cur: p };
      } else {
        this.snapshot();
        const e = { t: this.tool, x: p.x, y: p.y };
        if (e.t === 'A' || e.t === 'B') e.n = ++this.counters[e.t];
        if (e.t === 'goal' || e.t === 'mini') e.r = p.x < W / 2 ? 0 : 180;
        this.d.items.push(e);
        this.draw();
        this.changed();
      }
    };
    const move = (ev) => {
      if (!drag) return;
      const p = this.pt(ev);
      if (drag.kind === 'move') {
        const dx = p.x - drag.start.x, dy = p.y - drag.start.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.4) drag.moved = true;
        const o = drag.orig, e = this.d.items[this.sel];
        if (LINE_TYPES.includes(e.t)) { e.x1 = r1(o.x1 + dx); e.y1 = r1(o.y1 + dy); e.x2 = r1(o.x2 + dx); e.y2 = r1(o.y2 + dy); }
        else { e.x = r1(o.x + dx); e.y = r1(o.y + dy); }
        this.drawLight();
      } else if (drag.kind === 'line') {
        drag.cur = p;
        this.drawLight({ t: this.tool, x1: drag.start.x, y1: drag.start.y, x2: p.x, y2: p.y });
      }
    };
    const up = () => {
      if (!drag) return;
      if (drag.kind === 'line') {
        const { start, cur } = drag;
        if (Math.hypot(cur.x - start.x, cur.y - start.y) > 3) {
          this.snapshot();
          this.d.items.push({ t: this.tool, x1: start.x, y1: start.y, x2: cur.x, y2: cur.y });
          this.changed();
        }
        drag = null;
        this.draw();
      } else {
        if (!drag.moved) this.history.pop();
        else this.changed();
        drag = null;
        this.draw();
      }
    };
    // drawLight ridisegna solo l'SVG senza perdere il pointer capture
    this.drawLight = (draft) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = render(this.d, { selected: this.sel, draft });
      const nsvg = tmp.querySelector('svg');
      this.svg.innerHTML = nsvg.innerHTML;
    };
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
  };
  Editor.prototype.undo = function () {
    if (!this.history.length) return;
    this.d = JSON.parse(this.history.pop());
    this.sel = null;
    const f = this.el.querySelector('[data-act=field]'); if (f) f.value = this.d.field;
    this.draw(); this.changed();
  };
  Editor.prototype.rotate = function () {
    if (this.sel == null) return;
    this.snapshot();
    const e = this.d.items[this.sel]; e.r = ((e.r || 0) + 90) % 360;
    this.draw(); this.changed();
  };
  Editor.prototype.number = async function () {
    if (this.sel == null) return;
    const e = this.d.items[this.sel];
    const v = await window.UI.prompt('Numero o lettera da mostrare sul giocatore (lascia vuoto per nessuno):', e.n != null ? String(e.n) : '');
    if (v === null) return;
    this.snapshot(); e.n = v.trim().slice(0, 2);
    this.draw(); this.changed();
  };
  Editor.prototype.remove = function () {
    if (this.sel == null) return;
    this.snapshot();
    this.d.items.splice(this.sel, 1);
    this.sel = null;
    this.draw(); this.changed();
  };
  Editor.prototype.changed = function () { this.onChange(this.value()); };
  Editor.prototype.value = function () { return JSON.parse(JSON.stringify(this.d)); };

  window.Pitch = { render, Editor, TOOLS, FIELDS };
})();
