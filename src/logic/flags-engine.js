// logic/flags-engine.js
// Calcolo dello stato dei flag (daysSince, streak, status). Pura, nessun React.

// ============================================================
// FLAGS STATE ENGINE
// ============================================================
// Returns for each flag: { daysSince, streak, status }
// status: "ok" | "warn" | "alert" | "streak_max"

function computeFlagStates(flagsData, targetDateKey) {
  const result = {};
  FLAGS.forEach((flag) => {
    const tappedToday = !!(flagsData[targetDateKey] && flagsData[targetDateKey][flag.id]);

    // daysSince: 0 se tappato oggi, altrimenti giorni dall'ultimo tap (max 31)
    let daysSince = 0;
    if (!tappedToday) {
      daysSince = 31;
      for (let i = 1; i <= 30; i++) {
        if (flagsData[dateKeyDaysBefore(targetDateKey, i)]?.[flag.id]) {
          daysSince = i;
          break;
        }
      }
    }

    // streak: giorni consecutivi tappati fino a ieri (solo per maxStreakDays)
    let streak = 0;
    if (flag.maxStreakDays) {
      for (let i = 1; i <= 30; i++) {
        if (flagsData[dateKeyDaysBefore(targetDateKey, i)]?.[flag.id]) {
          streak++;
        } else {
          break;
        }
      }
    }

    let status = "ok";
    if (tappedToday) {
      if (flag.maxStreakDays && streak >= flag.maxStreakDays) status = "streak_max";
    } else {
      if (daysSince >= flag.alertAfterDays) status = "alert";
      else if (daysSince >= flag.warnAfterDays) status = "warn";
    }

    result[flag.id] = { daysSince, streak, status, tappedToday };
  });
  return result;
}
