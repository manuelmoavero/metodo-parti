// logic/parse-item.js
// Parsing del valore testuale del prontuario in tasselli + flag. Pura, nessun React.

// Parses a prontuario value string like "1 Forza + 0,5 Oro + 🟡 Omega-3"
// into { tasselli: { forza: 1, oro: 0.5 }, flags: ["omega3"] }
function parseItemValue(valueStr) {
  const tasselli = {};
  const flags = [];
  if (!valueStr) return { tasselli, flags };

  const tasselloMap = {
    energia: "energia", forza: "forza", foglia: "foglia",
    colore: "colore", frutto: "frutto", oro: "oro", granello: "granello",
  };
  const flagMap = { "omega-3": "omega3", "vit. c": "vitc", "calcio": "calcio" };

  const parts = valueStr.split("+").map((s) => s.trim());

  for (const part of parts) {
    const lower = part.toLowerCase();

    // Skip "0 tasselli" and standalone "jolly"
    if (lower.startsWith("0 tasselli") || lower === "jolly") continue;

    // Detect flags (🟡 ...)
    let isFlagPart = false;
    for (const [key, id] of Object.entries(flagMap)) {
      if (lower.includes(key)) { flags.push(id); isFlagPart = true; break; }
    }
    if (isFlagPart) continue;

    // Extract leading number + tassello name
    // Handles: "1 Energia", "0,5 Forza", "1,5 Oro", "0,5 Colore (jolly)"
    const match = part.match(/^([\d,]+)\s+([A-Za-z]+)/i);
    if (match) {
      const amount = parseFloat(match[1].replace(",", "."));
      const name = match[2].toLowerCase();
      if (tasselloMap[name] && amount > 0) {
        tasselli[tasselloMap[name]] = (tasselli[tasselloMap[name]] || 0) + amount;
      }
    }
  }

  return { tasselli, flags };
}
