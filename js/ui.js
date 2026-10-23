/* Finestre di dialogo semplici (al posto di alert, confirm e prompt del browser) */
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function open({ message, input, okLabel, cancelLabel, danger }) {
    return new Promise((resolve) => {
      const bg = document.createElement('div');
      bg.className = 'modal-bg dialog-bg';
      bg.innerHTML = `<form class="modal dialog" role="alertdialog" aria-modal="true">
        <p class="dialog-msg">${esc(message)}</p>
        ${input != null ? `<input type="text" class="dialog-input" value="${esc(input)}">` : ''}
        <div class="row dialog-btns">
          ${cancelLabel ? `<button type="button" class="btn light grow" data-cancel>${esc(cancelLabel)}</button>` : ''}
          <button type="submit" class="btn ${danger ? 'danger' : 'green'} grow">${esc(okLabel || 'OK')}</button>
        </div></form>`;
      document.body.appendChild(bg);
      const f = bg.querySelector('form'), inp = bg.querySelector('input');
      const done = (v) => { bg.remove(); resolve(v); };
      f.onsubmit = (ev) => { ev.preventDefault(); done(inp ? inp.value : true); };
      const c = bg.querySelector('[data-cancel]'); if (c) c.onclick = () => done(inp ? null : false);
      bg.addEventListener('click', (ev) => { if (ev.target === bg) done(inp ? null : false); });
      setTimeout(() => (inp || f.querySelector('[type=submit]')).focus(), 30);
    });
  }
  window.UI = {
    confirm: (message, okLabel, danger) => open({ message, okLabel: okLabel || 'Sì', cancelLabel: 'Annulla', danger }),
    prompt: (message, value) => open({ message, input: value || '', okLabel: 'OK', cancelLabel: 'Annulla' }),
    alert: (message) => open({ message, okLabel: 'Ho capito' }),
  };
})();
