// data/config.js
// Configurazione per-utente del Metodo delle Parti.
// Contiene solo i parametri quantitativi (target, soglie, finestre di compensazione).
// Le proprietà semantiche dei tasselli (nome, emoji, regole di valutazione, contenuti)
// restano in tasselli.js e non sono configurabili.
//
// Persistenza: oggi la config vive in memoria, inizializzata da getDefaultConfig() a ogni
// avvio. Il punto di lettura è predisposto per diventare "leggi da Supabase, fallback al
// default" senza toccare i consumatori.

function getDefaultConfig() {
  return {
    tasselli: {
      energia: { target: 3, softMin: 1 },
      forza:   { target: 2, softMin: 1.5, softMax: 2.5 },
      foglia:  { target: 1.5 },   // isMin, nessun tetto
      colore:  { target: 1.5 },   // isMin, nessun tetto
      frutto:  { target: 2, softMax: 4 },
      oro:     { target: 2, softMin: 1, softMax: 5 },
    },
    granello: {
      target: 7,
      softMax: 14,
      windowDays: 7,
    },
    compensation: {
      lookbackDays: 5,
      // cap derivato dal motore: softMax ?? target del tassello corrispondente
      // perDayReduction, spreadDays, floor sono i soli parametri propri della compensazione
      energia: { perDayReduction: 0.5, spreadDays: 2 },
      forza:   { perDayReduction: 0.5, spreadDays: 1, floor: 1.5 },
      oro:     { perDayReduction: 0.5, spreadDays: 2, floor: 1 },
      frutto:  { perDayReduction: 1,   spreadDays: 1, floor: 1 },
    },
  };
}

// Fonde i parametri quantitativi della config con gli oggetti semantici di TASSELLI.
// Chiamato una volta in App.js; il risultato sostituisce TASSELLI in tutto il wiring.
// Panel e componenti ricevono oggetti identici nella forma, ignari della config.
function mergeTasselli(tasselli, config) {
  return tasselli.map(t => ({
    ...t,
    ...(config.tasselli[t.id] || {}),
  }));
}
