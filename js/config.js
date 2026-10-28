/* Configurazione del database online (Firebase) di Coach Tukiki.
   Questi valori non sono segreti: servono all'app per trovare il database.
   La sicurezza dei dati è garantita dalle regole in firestore.rules.
   Se si mette null, l'app torna in "modalità prova" con i dati solo sul dispositivo. */
window.TUKIKI_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAgSQWg4dl4hYGG3f4sYQP3VkyiQKCVNzs",
  authDomain: "tukiki-app-allenamenti.firebaseapp.com",
  projectId: "tukiki-app-allenamenti",
  storageBucket: "tukiki-app-allenamenti.firebasestorage.app",
  messagingSenderId: "891974256079",
  appId: "1:891974256079:web:96e13b36a949ae1d26feba"
};

/* Dati dell'associazione per l'informativa privacy e le condizioni d'uso.
   I campi vuoti compaiono come "da completare" nelle pagine. */
window.TUKIKI_LEGAL = {
  nome: "TUKIKI :) ASD",        // denominazione esatta, come nello statuto
  sede: "Via Nino Oxilia 20, Milano", // indirizzo della sede legale
  codiceFiscale: "",            // codice fiscale dell'associazione
  email: "segreteria.tukiki@gmail.com", // email per le richieste sulla privacy
  versione: "2026-10-25"        // cambiarla quando si modificano i testi: agli allenatori verrà chiesto di rileggerli
};
