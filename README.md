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
