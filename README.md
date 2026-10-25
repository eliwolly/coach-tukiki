# Coach Tukiki

App gratuita per preparare gli allenamenti di calcio degli allenatori Tukiki :)

- Libreria di esercizi divisi per obiettivo e difficoltà, con schema del campo
- Editor del campo per creare esercizi nuovi (visibili a tutti gli allenatori)
- Squadre con storico degli allenamenti e note personali
- Allenamento da file Word o PDF
- Esportazione in PDF dell'allenamento del giorno

## Come funziona

- Sito statico (HTML, CSS, JavaScript), pubblicato con GitHub Pages dalla cartella principale del ramo `main`.
- Accessi e dati su Firebase (piano gratuito Spark): configurazione in `js/config.js`, regole di sicurezza in `firestore.rules` (da incollare in Firestore → Regole).
- Le librerie esterne (Firebase, lettura Word/PDF, creazione PDF) sono incluse in `js/vendor/`.
- I caratteri (Fredoka e Work Sans, licenza SIL Open Font License) sono inclusi in `fonts/`: il sito non contatta Google Fonts.

## Privacy e condizioni d'uso

- Testi in `js/legal.js`, dati dell'associazione (nome, sede, codice fiscale, email) in `js/config.js` → `TUKIKI_LEGAL`.
- Alla registrazione si accettano privacy e condizioni; chi era già registrato le accetta al primo accesso. Se si cambiano i testi, aggiornare `versione` in `config.js`: verranno richieste di nuovo.
- Dal profilo ogni allenatore può scaricare i propri dati ed eliminare l'account. Per liberare anche il nome utente servono le regole aggiornate di `firestore.rules`.
