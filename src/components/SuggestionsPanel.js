// components/SuggestionsPanel.js - suggerimenti del giorno

// ── SuggestionsPanel ─────────────────────────────────────────────────────────

function SuggestionsPanel({ today, adjustedTargets, daysData, currentDate, granelloRolling, todayFlags, tasselli, granelloConfig }) {
  const tips = suggestions(today, adjustedTargets, daysData, currentDate, granelloRolling, todayFlags, tasselli, granelloConfig);
  const closedCount = tasselli.filter((t) => {
    const v = today[t.id] || 0;
    const target = adjustedTargets[t.id] ?? t.target;
    if (t.isMin) return v >= target;
    if (t.isMax) return v > 0 && v <= target;
    if (t.softMax) return v >= target && v <= t.softMax;
    return v >= target;
  }).length;

  const allDone = closedCount === tasselli.length;

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "16px",
        border: "1px solid rgba(176, 56, 50, 0.18)",
        background: "linear-gradient(135deg, rgba(176, 56, 50, 0.04), rgba(212, 160, 42, 0.04))",
      }}
    >
      {/* Titolo */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontStyle: "italic",
          fontWeight: 700,
          color: "var(--ink-strong)",
          marginBottom: "10px",
        }}
      >
        Cosa ti manca
      </div>

      {/* Layout a due colonne: tips a sinistra, donut a destra */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

        {/* Colonna sinistra: lista */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {allDone ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "22px" }}>🎉</span>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: "#5a7a3c",
                  }}
                >
                  Giornata chiusa!
                </div>
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--ink-soft)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  paddingLeft: "30px",
                }}
              >
                {(() => {
                  const ieriKey = dateKeyDaysBefore(currentDate, 1);
                  const ieriDay = daysData[ieriKey];
                  const ieriOro = ieriDay ? (ieriDay.oro || 0) : 0;
                  const ieriHasData = ieriDay && Object.values(ieriDay).some(v => v > 0);
                  const ieriSforatoOro = ieriHasData && ieriOro > (tasselli.find(t => t.id === "oro")?.target ?? 2);
                  return ieriSforatoOro
                    ? "Tutti i tasselli coperti. Ieri hai sforato l'Oro — oggi ci sei riuscito, ottimo."
                    : "Tutti i tasselli coperti. Il tuo corpo ti ringrazia.";
                })()}
              </div>
            </div>
          ) : (
            tips.slice(0, 6).map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "7px",
                  marginBottom: "5px",
                  fontSize: "11.5px",
                  color: "var(--ink)",
                  lineHeight: 1.4,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    marginTop: "4px",
                    flexShrink: 0,
                    background:
                      tip.urgency === "high"
                        ? "#b03832"
                        : tip.urgency === "med"
                        ? "#b88824"
                        : "#6b8a8a",
                  }}
                />
                <span>{tip.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Colonna destra: donut */}
        <DonutChart today={today} adjustedTargets={adjustedTargets} />
      </div>
    </div>
  );
}


