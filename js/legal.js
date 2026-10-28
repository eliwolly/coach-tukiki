/* Testi legali: informativa privacy e condizioni d'uso.
   I dati dell'associazione sono in config.js (TUKIKI_LEGAL). */
(function () {
  const L = window.TUKIKI_LEGAL || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const v = (k) => (L[k] ? esc(L[k]) : '<mark>[da completare]</mark>');
  // senza email si indica la sede: per legge basta un recapito
  const mail = () => (L.email ? `<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>` : `${esc(L.nome || 'l\'associazione')}, ${v('sede')}`);
  const fmt = (iso) => { try { return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return iso; } };

  function privacy() {
    return `
      <h1>Informativa sulla privacy</h1>
      <p class="small muted">Ultimo aggiornamento: ${esc(fmt(L.versione))}</p>
      <p>Questa pagina spiega, in modo semplice, quali dati usa Coach Tukiki, perché e quali sono i tuoi diritti (Regolamento europeo 2016/679, "GDPR").</p>

      <h2>1. Chi è responsabile dei dati</h2>
      <p>Il titolare del trattamento è <b>${v('nome')}</b>, con sede in ${v('sede')}${L.codiceFiscale ? `, codice fiscale ${esc(L.codiceFiscale)}` : ''}.<br>
      Per qualsiasi domanda o richiesta sulla privacy scrivi a ${mail()}.</p>

      <h2>2. Quali dati usiamo</h2>
      <ul>
        <li><b>Dati dell'account:</b> nome e cognome, nome utente, email (facoltativa) e password. La password è salvata in forma cifrata: nessuno, nemmeno l'associazione, può leggerla.</li>
        <li><b>Quello che scrivi nell'app:</b> squadre, allenamenti, note ed esercizi che crei, e gli allenatori con cui condividi una squadra.</li>
        <li><b>Dati tecnici:</b> quando usi il sito, i fornitori del servizio (vedi punto 5) registrano per sicurezza dati come l'indirizzo IP e l'ora di accesso.</li>
      </ul>

      <h2>3. Dati dei ragazzi e delle ragazze</h2>
      <p>Coach Tukiki serve a preparare gli allenamenti, <b>non</b> a raccogliere dati sugli atleti. Per proteggere i ragazzi, molti dei quali minorenni o persone fragili, chiediamo a ogni allenatore di:</p>
      <ul>
        <li>scrivere al massimo il nome o le iniziali, senza cognomi, date di nascita, foto, indirizzi o numeri di telefono;</li>
        <li><b>non scrivere mai informazioni sulla salute</b> (diagnosi, disabilità, terapie, certificati medici) né altre informazioni delicate;</li>
        <li>non inserire dati di persone negli esercizi condivisi, che sono visibili a tutti gli allenatori.</li>
      </ul>
      <p>Se nelle note compaiono comunque dati di atleti, l'associazione li tratta solo per organizzare l'attività sportiva, secondo l'informativa privacy che l'associazione fornisce alle famiglie al momento dell'iscrizione.</p>

      <h2>4. Perché usiamo i dati</h2>
      <ul>
        <li>Per farti usare l'app (creare l'account, salvare squadre, allenamenti ed esercizi): è necessario per darti il servizio che chiedi registrandoti (art. 6.1.b GDPR).</li>
        <li>Per mostrare agli altri allenatori il tuo nome accanto agli esercizi che condividi e nelle squadre in cui allenate insieme (art. 6.1.b GDPR).</li>
        <li>Per la sicurezza del sito e per evitare abusi: legittimo interesse dell'associazione (art. 6.1.f GDPR).</li>
      </ul>
      <p>Non usiamo i dati per pubblicità, non li vendiamo e non creiamo profili.</p>

      <h2>5. Chi può vedere i dati</h2>
      <ul>
        <li>Le tue squadre, i tuoi allenamenti e le tue note li vedi <b>solo tu</b> e gli allenatori che inviti nella squadra. Se ti invitano in una squadra, gli altri allenatori vedono il tuo nome utente e le modifiche che fai.</li>
        <li>Gli esercizi che crei, con il tuo nome, li vedono <b>tutti gli allenatori registrati</b>.</li>
        <li><b>Google (Firebase)</b> conserva account e dati per conto dell'associazione, come responsabile del trattamento (art. 28 GDPR).</li>
        <li><b>GitHub</b> (servizio GitHub Pages) pubblica il sito e può registrare dati tecnici delle visite.</li>
      </ul>
      <p>Questi fornitori possono trattare dati anche negli Stati Uniti. Il trasferimento è protetto dal Data Privacy Framework UE-USA e dalle clausole contrattuali standard approvate dalla Commissione europea.</p>

      <h2>6. Per quanto tempo</h2>
      <p>Conserviamo i dati finché il tuo account esiste. Quando elimini l'account, i dati vengono cancellati subito dal database; le copie tecniche dei fornitori si cancellano entro i loro tempi standard. Se smetti di collaborare con l'associazione, l'associazione può chiederti di eliminare l'account o eliminarlo dopo averti avvisato.</p>

      <h2>7. Cookie e memoria del dispositivo</h2>
      <p>Coach Tukiki <b>non usa cookie pubblicitari né statistiche</b>. Usa solo la memoria del browser per tenerti collegato e per far funzionare l'app anche con poca connessione. Sono strumenti tecnici necessari, per i quali la legge non chiede il consenso (art. 122 Codice Privacy e Linee guida del Garante del 10 giugno 2021). I caratteri e le librerie sono inclusi nel sito, senza collegamenti a servizi esterni.</p>

      <h2>8. I tuoi diritti</h2>
      <p>Puoi chiedere in ogni momento di vedere, correggere, scaricare o cancellare i tuoi dati, limitarne l'uso o opporti (artt. 15-22 GDPR). Molte cose le puoi fare da solo, dalla pagina <a href="#/profilo">Il mio profilo</a>:</p>
      <ul>
        <li><b>Scarica i miei dati</b>: un file con tutto quello che hai salvato;</li>
        <li><b>Elimina il mio account</b>: cancella account, squadre, allenamenti e note. Dalle squadre di altri allenatori esci, e i loro allenamenti restano a loro.</li>
      </ul>
      <p>Per tutto il resto scrivi a ${mail()}. Se pensi che i tuoi dati non siano trattati correttamente puoi presentare reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).</p>

      <h2>9. Chi può registrarsi</h2>
      <p>L'app è pensata per allenatori e volontari maggiorenni dell'associazione. Non è destinata ai minori.</p>`;
  }

  function terms() {
    return `
      <h1>Condizioni d'uso</h1>
      <p class="small muted">Ultimo aggiornamento: ${esc(fmt(L.versione))}</p>

      <h2>1. Il servizio</h2>
      <p>Coach Tukiki è un'app gratuita offerta da <b>${v('nome')}</b> ai propri allenatori e volontari per preparare gli allenamenti di calcio.</p>

      <h2>2. Chi può usarla</h2>
      <p>Possono registrarsi le persone maggiorenni che allenano o collaborano con l'associazione. L'associazione può sospendere o eliminare gli account non legati alle sue attività o usati in modo scorretto.</p>

      <h2>3. Il tuo account</h2>
      <p>Tieni segreta la tua password e non condividere l'account con altre persone. Se pensi che qualcuno lo stia usando al posto tuo, cambia la password e avvisa l'associazione.</p>

      <h2>4. Esercizi condivisi</h2>
      <ul>
        <li>Gli esercizi che crei sono visibili a <b>tutti gli allenatori</b>, con il tuo nome.</li>
        <li>Pubblica solo esercizi tuoi o che hai il diritto di condividere: non copiare testi, disegni o immagini da libri, siti o app di altri.</li>
        <li>Condividendo un esercizio permetti gratuitamente agli altri allenatori e all'associazione di usarlo, copiarlo e adattarlo per gli allenamenti.</li>
        <li>Non scrivere negli esercizi nomi o informazioni sugli atleti, né contenuti offensivi.</li>
      </ul>

      <h2>5. Squadre condivise</h2>
      <ul>
        <li>Chi crea una squadra può invitare altri allenatori con il loro nome utente. Tutti gli allenatori della squadra vedono e modificano i suoi allenamenti e le note.</li>
        <li>Invita solo allenatori che seguono davvero quella squadra. Chi ha creato la squadra può togliere un allenatore; chi è stato invitato può uscire quando vuole.</li>
        <li>Sei responsabile di ciò che scrivi. L'associazione può modificare o togliere contenuti non adatti.</li>
      </ul>

      <h2>6. Sicurezza in campo</h2>
      <p>Gli esercizi sono spunti. Prima di proporli, l'allenatore valuta se sono adatti all'età, alle capacità e alle condizioni dei propri atleti, del campo e del materiale, e li adatta se serve. L'associazione non risponde dell'uso degli esercizi in modo non adatto, nei limiti previsti dalla legge.</p>

      <h2>7. Disponibilità</h2>
      <p>L'app è offerta così com'è, senza garanzia che sia sempre disponibile o priva di errori. Può cambiare o essere interrotta. Per gli allenamenti importanti scarica il PDF.</p>

      <h2>8. Eliminare l'account</h2>
      <p>Puoi eliminare il tuo account in ogni momento da <a href="#/profilo">Il mio profilo</a>. Puoi scegliere se lasciare i tuoi esercizi nella libreria comune, senza il tuo nome, o cancellarli.</p>

      <h2>9. Modifiche</h2>
      <p>Se queste condizioni cambiano, te lo chiederemo al prossimo accesso.</p>

      <h2>10. Legge applicabile</h2>
      <p>Si applica la legge italiana. Per i dati personali vale l'<a href="#/privacy">informativa sulla privacy</a>.</p>
      <p>Per domande: ${mail()}.</p>`;
  }

  window.Legal = { version: L.versione || '1', privacy, terms };
})();
