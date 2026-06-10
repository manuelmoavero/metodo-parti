// logic/classificatore-engine.js
// Funzioni pure del classificatore guidato: scala per quantità,
// arrotonda al mezzo e formatta l'esito nel formato del prontuario
// (compatibile con parseItemValue). Nessun React.

// Combina gli add di un nodo a scelta multipla (ripieni).
// Un solo componente vale pieno; da due in su si dividono lo spazio:
// ogni add viene dimezzato. Tasselli uguali si sommano.
function mergeRipienoAdds(adds) {
  const share = adds.length >= 2 ? 0.5 : 1;
  const out = {};
  for (const add of adds) {
    for (const [id, v] of Object.entries(add)) {
      out[id] = (out[id] || 0) + v * share;
    }
  }
  return out;
}

// Scala i tasselli accumulati per il fattore di quantità/dimensione.
// Arrotonda al mezzo; ogni voce presente non scende mai sotto 0,5.
function scaleTasselli(tasselli, factor) {
  const out = {};
  for (const [id, amount] of Object.entries(tasselli)) {
    if (amount <= 0) continue;
    const scaled = Math.round(amount * factor * 2) / 2;
    out[id] = Math.max(0.5, scaled);
  }
  return out;
}

// Formatta { energia: 1, oro: 0.5 } in "1 Energia + 0,5 Oro",
// lo stesso formato testuale del prontuario, parsabile da parseItemValue.
function formatTasselli(tasselli) {
  const labels = {
    energia: "Energia", forza: "Forza", foglia: "Foglia",
    colore: "Colore", frutto: "Frutto", oro: "Oro", granello: "Granello",
  };
  const order = ["energia", "forza", "foglia", "colore", "frutto", "oro", "granello"];
  const parts = [];
  for (const id of order) {
    const v = tasselli[id];
    if (!v) continue;
    const num = String(v).replace(".", ",");
    parts.push(`${num} ${labels[id]}`);
  }
  return parts.length ? parts.join(" + ") : "0 tasselli";
}
