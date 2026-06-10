// logic/suggestions.js
// Rilevamento deficit su finestra (daysBelow) e generazione tip (suggestions).
// Funzioni pure, nessun React.

// ============================================================
// SUGGESTIONS ENGINE
// ============================================================

// ============================================================
// WINDOW-BASED DEFICIT DETECTION
// ============================================================
// Returns how many of the last N days (excluding today) a tassello was below target.
// Used to decide urgency: if below target for several days in a row, it's a real problem.

function daysBelow(daysData, tasselloId, target, windowDays, todayKey) {
  let count = 0;
  let daysWithData = 0;
  for (let i = 1; i <= windowDays; i++) {
    const key = dateKeyDaysBefore(todayKey, i);
    const day = daysData[key];
    if (!day) continue;
    // Un giorno conta come "con dati" solo se almeno un tassello ha valore > 0
    const hasRealData = Object.values(day).some((v) => v > 0);
    if (!hasRealData) continue;
    daysWithData++;
    const consumed = day[tasselloId] || 0;
    if (consumed < target) count++;
  }
  if (daysWithData === 0) return -1; // sentinel: nessun dato storico reale
  return count;
}

function suggestions(today, adjustedTargets, daysData, currentDate, granelloRolling, todayFlags) {
  const tips = [];

  TASSELLI.forEach((t) => {
    const consumed = today[t.id] || 0;
    const target = adjustedTargets[t.id] ?? t.target;

    if (t.isMin) {
      // Foglia, Colore — finestra 3 giorni
      // Warning urgente solo se sotto per 3 giorni consecutivi incluso oggi
      if (consumed < target) {
        const missing = +(target - consumed).toFixed(1);
        const prevDaysBelow = daysBelow(daysData, t.id, t.target, 2, currentDate);
        // -1 = nessun dato storico → non mostrare badge streak
        const urgency = prevDaysBelow < 0 ? null : prevDaysBelow >= 2 ? "high" : prevDaysBelow === 1 ? "med" : "low";
        const suffix = urgency === "low"
          ? " (1° giorno consecutivo)"
          : urgency === "med"
          ? " (2° giorno consecutivo)"
          : " (3° giorno consecutivo — priorità alta)";
        tips.push({
          type: "needed",
          tassello: t,
          message: `Aggiungi ${missing} ${t.unit} di ${t.label}${urgency ? suffix : ""}`,
          urgency: urgency || "low",
        });
      }
    } else if (t.isMax) {
      // Energia — tetto (max 3) con floor nutrizionale morbido (min 1)
      if (consumed > target) {
        tips.push({
          type: "exceeded",
          tassello: t,
          message: `${t.label} sopra il tetto (${consumed} su ${target})`,
          urgency: "high",
        });
      } else if (t.softMin != null && consumed < t.softMin) {
        // Floor: sotto 1 parte → avviso morbido con finestra 3 giorni (stessa logica isMin)
        const missing = +(t.softMin - consumed).toFixed(1);
        const prevDaysBelow = daysBelow(daysData, t.id, t.softMin, 2, currentDate);
        const urgency = prevDaysBelow < 0 ? null : prevDaysBelow >= 2 ? "high" : prevDaysBelow === 1 ? "med" : "low";
        const suffix = urgency === "low"
          ? " (1° giorno consecutivo)"
          : urgency === "med"
          ? " (2° giorno consecutivo)"
          : " (3° giorno consecutivo — riserve di glicogeno a rischio)";
        tips.push({
          type: "needed",
          tassello: t,
          message: `${t.label} sotto il minimo funzionale${urgency ? suffix : ""} — aggiungi almeno 1 parte`,
          urgency: urgency || "low",
        });
      } else if (consumed < target - 0.5) {
        tips.push({
          type: "room",
          tassello: t,
          message: `Hai ancora ${(target - consumed).toFixed(1)} ${t.unit} di ${t.label} disponibili`,
          urgency: "low",
        });
      }
    } else if (t.id === "forza") {
      // Forza — finestra 2 giorni, non si scende mai
      if (consumed < target) {
        const missing = +(target - consumed).toFixed(1);
        const prevDaysBelow = daysBelow(daysData, t.id, t.target, 1, currentDate);
        const urgency = prevDaysBelow < 0 ? null : prevDaysBelow >= 1 ? "high" : "med";
        const suffix = urgency === "high"
          ? " (2° giorno consecutivo — rischio massa muscolare)"
          : " (1° giorno consecutivo)";
        tips.push({
          type: "needed",
          tassello: t,
          message: `Manca ${missing} ${t.unit} di ${t.label}${urgency ? suffix : ""}`,
          urgency: urgency || "med",
        });
      } else if (t.softMax && consumed > t.softMax) {
        tips.push({
          type: "exceeded",
          tassello: t,
          message: `${t.label} ha superato il limite massimo`,
          urgency: "high",
        });
      }
    } else if (t.id === "frutto") {
      // Frutto — finestra 3 giorni come Foglia/Colore
      if (consumed < target) {
        const missing = +(target - consumed).toFixed(1);
        const prevDaysBelow = daysBelow(daysData, t.id, t.target, 2, currentDate);
        const urgency = prevDaysBelow < 0 ? null : prevDaysBelow >= 2 ? "high" : prevDaysBelow === 1 ? "med" : "low";
        const suffix = !urgency || urgency === "low"
          ? " (1° giorno consecutivo)"
          : urgency === "med"
          ? " (2° giorno consecutivo)"
          : " (3° giorno — priorità alta)";
        tips.push({
          type: "needed",
          tassello: t,
          message: `Manca ${missing} ${t.unit} di ${t.label}${urgency ? suffix : ""}`,
          urgency: urgency || "low",
        });
      } else if (t.softMax && consumed > t.softMax) {
        tips.push({
          type: "exceeded",
          tassello: t,
          message: `${t.label} ha superato il limite massimo`,
          urgency: "high",
        });
      }
      } else if (t.id === "oro") {
      // Oro — softMin a 1 cucchiaio, softMax a 5
      // Controlla se ieri ha sforato il target base (> 2), indipendente da adjustedTargets
      const ORO_TARGET_BASE = 2;
      const ieriKey = dateKeyDaysBefore(currentDate, 1);
      const ieriDay = daysData[ieriKey];
      const ieriOro = ieriDay ? (ieriDay.oro || 0) : 0;
      const ieriHasData = ieriDay && Object.values(ieriDay).some(v => v > 0);
      const ieriSforato = ieriHasData && ieriOro > ORO_TARGET_BASE;

      if (consumed < target) {
        const missing = +(target - consumed).toFixed(1);
        const belowMin = consumed < (t.softMin || 0);
        tips.push({
          type: "needed",
          tassello: t,
          message: belowMin
            ? `Manca ${missing} ${t.unit} di ${t.label} — sotto il minimo funzionale (1 cucchiaio)`
            : ieriSforato
            ? `Manca ${missing} ${t.unit} di ${t.label} — ieri hai sforato, oggi prova a restare sui 2`
            : `Manca ${missing} ${t.unit} di ${t.label}`,
          urgency: belowMin ? "high" : "med",
        });
      } else if (consumed <= t.softMax) {
        // Tra target e softMax: se ieri ha sforato, mostra promemoria leggero
        if (ieriSforato) {
          tips.push({
            type: "info",
            tassello: t,
            message: `Oro ok — ieri hai sforato, cerca di restare vicino ai 2 oggi`,
            urgency: "low",
          });
        }
      } else if (t.softMax && consumed > t.softMax) {
        tips.push({
          type: "exceeded",
          tassello: t,
          message: `${t.label} ha superato il limite massimo`,
          urgency: "high",
        });
      }
    } else {
      // Tutti gli altri — comportamento standard
      if (consumed < target) {
        const missing = +(target - consumed).toFixed(1);
        tips.push({
          type: "needed",
          tassello: t,
          message: `Manca ${missing} ${t.unit} di ${t.label}`,
          urgency: missing > 1 ? "high" : "med",
        });
      } else if (t.softMax && consumed > t.softMax) {
        tips.push({
          type: "exceeded",
          tassello: t,
          message: `${t.label} ha superato il limite massimo`,
          urgency: "high",
        });
      }
    }
  });

  // A3 — Suggerimento contestuale ferro + vitamina C
  // Se oggi c'è almeno 0,5 Forza (legumi/tofu) e il flag vitc non è stato tappato,
  // aggiungi un tip informativo che ricorda la sinergia ferro+C nello stesso pasto.
  const forzaOggi = today["forza"] || 0;
  const vitcTappata = todayFlags ? !!todayFlags["vitc"] : false;
  if (forzaOggi >= 0.5 && !vitcTappata) {
    tips.push({
      type: "info",
      tassello: FLAGS.find((f) => f.id === "vitc") || { id: "vitc", label: "Vit. C", emoji: "🍋" },
      message: "Hai mangiato legumi o tofu: aggiungi vitamina C nello stesso pasto per moltiplicare l'assorbimento del ferro (limone, peperone crudo, kiwi)",
      urgency: "low",
    });
  }

  // Granello rolling softMax check
  if (granelloRolling !== undefined && GRANELLO.softMax && granelloRolling > GRANELLO.softMax) {
    tips.push({
      type: "exceeded",
      tassello: GRANELLO,
      message: `Granello oltre il tetto (${granelloRolling} su ${GRANELLO.softMax} cucchiai/7gg) — troppi grassi nella settimana`,
      urgency: "high",
    });
  }

  return tips.sort((a, b) => {
    const order = { high: 0, med: 1, low: 2 };
    return order[a.urgency] - order[b.urgency];
  });
}
