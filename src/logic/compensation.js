// logic/compensation.js
// Motore di compensazione degli sforamenti. Funzioni pure, nessun React.

// ============================================================
// COMPENSATION LOGIC
// ============================================================
//
// Strategy:
// For each tassello that has a max/target rule, we walk backward from the
// target day looking at each previous day. For every day where the user
// exceeded the target, we generate a "debt" that is spread over N days
// following that overflow. The spread (days and amount per day) is
// determined by the rules from the "Metodo delle parti" poster.
//
// As we walk forward through days after the overflow, we subtract the
// daily compensation if and only if the user actually reduced consumption
// on those days. If on a subsequent day the user also overflowed, that
// generates additional debt.
//
// We return the net adjustment that should apply to the target day, in
// the form of an object { tasselloId: { delta, reason, sourceDate } }.

function computeCompensation(daysData, targetDateKey) {
  // Look back at most LOOKBACK_DAYS days to find recent overflows
  const LOOKBACK_DAYS = 5;

  const adjustments = {};

  // Energia: if exceeded (>3), spread -0.5/day over next 2 days
  computeForTassello(
    daysData,
    targetDateKey,
    LOOKBACK_DAYS,
    {
      id: "energia",
      cap: 3,
      perDayReduction: 0.5,
      spreadDays: 2,
    },
    adjustments
  );

  // Forza: if exceeded (>2.5), spread -0.5 over 1 day (next day only),
  // but never push target below 1.5
  computeForTassello(
    daysData,
    targetDateKey,
    LOOKBACK_DAYS,
    {
      id: "forza",
      cap: 2.5,
      perDayReduction: 0.5,
      spreadDays: 1,
      floor: 1.5,
    },
    adjustments
  );

  // Oro: if exceeded (>5), reduce 0.5 over 2 days, floor at 1
  computeForTassello(
    daysData,
    targetDateKey,
    LOOKBACK_DAYS,
    {
      id: "oro",
      cap: 5,
      perDayReduction: 0.5,
      spreadDays: 2,
      floor: 1,
    },
    adjustments
  );

  // Frutto: if exceeded (>4 sweet), reduce 1 unit next day, floor 1
  computeForTassello(
    daysData,
    targetDateKey,
    LOOKBACK_DAYS,
    {
      id: "frutto",
      cap: 4,
      perDayReduction: 1,
      spreadDays: 1,
      floor: 1,
    },
    adjustments
  );

  return adjustments;
}

// Helper: walks days from oldest to most-recent within the window
// and accumulates the active debt for a given tassello, then returns
// the residual adjustment that applies to targetDateKey
function computeForTassello(daysData, targetDateKey, lookbackDays, rule, adjustments) {
  // Build the sequence of date keys from lookbackDays ago up to (but excluding)
  // the target day
  const sequence = [];
  for (let i = lookbackDays; i >= 1; i--) {
    sequence.push(dateKeyDaysBefore(targetDateKey, i));
  }
  // sequence is now [oldest, ..., yesterday]

  // Walk through and accumulate debt
  // debt = how many parti the user still owes back
  let debt = 0;
  let sourceDates = [];

  for (const dayKey of sequence) {
    const day = daysData[dayKey];
    const consumed = day ? (day[rule.id] || 0) : null;

    if (consumed != null && consumed > rule.cap) {
      // User overflowed this day. Add to debt.
      const overflow = consumed - rule.cap;
      debt += overflow;
      sourceDates.push(dayKey);
    } else if (debt > 0 && consumed != null) {
      // User had a normal day. If they consumed below the cap, they "paid" debt.
      // We measure payment as how much under the cap they went, but no more than
      // the per-day reduction allowed.
      const wouldOweToday = rule.perDayReduction;
      const actualReduction = Math.max(0, rule.cap - consumed);
      const paid = Math.min(wouldOweToday, actualReduction, debt);
      debt -= paid;
    }
    // If no data for that day, we don't change debt (we don't know what happened)
  }

  if (debt > 0.001) {
    // There's still residual debt to apply to the target day
    // The reduction we apply today is min(perDayReduction, remaining debt)
    const reduction = Math.min(rule.perDayReduction, debt);
    adjustments[rule.id] = {
      delta: -reduction,
      reason: "rientro da sfori dei giorni scorsi",
      sourceDates: sourceDates,
      remainingDebt: debt,
    };
  }
}
