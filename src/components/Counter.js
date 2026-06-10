// components/Counter.js - riga di un tassello, l'interazione principale (+/-)

// ============================================================
// COUNTER (one tassello row) — the main interaction
// ============================================================

function Counter({ tassello, value, adjustedTarget, onChange, flagChip, streakWarning }) {
  const t = tassello;
  const target = adjustedTarget ?? t.target;
  const isAdjusted = adjustedTarget != null && adjustedTarget !== t.target;

  let statusColor = t.color;
  let statusLabel = null;
  let progress = 0;

  if (t.isMin) {
    progress = Math.min(value / target, 1);
    if (value >= target) {
      statusLabel = "ok";
    } else {
      statusLabel = `manca ${(target - value).toFixed(1)}`;
    }
  } else if (t.isMax) {
    progress = Math.min(value / target, 1);
    if (value > target) {
      statusLabel = `+${(value - target).toFixed(1)} sopra`;
      statusColor = "#b03832";
    } else if (value >= target - 0.5) {
      statusLabel = "vicino al tetto";
    } else {
      statusLabel = `${(target - value).toFixed(1)} disponibili`;
    }
  } else {
    progress = Math.min(value / target, 1);
    if (value >= target) {
      if (t.softMax && value > t.softMax) {
        statusLabel = "sopra il max";
        statusColor = "#b03832";
      } else {
        statusLabel = "ok";
      }
    } else {
      statusLabel = `manca ${target - value}`;
    }
  }

  const dec = () => onChange(Math.max(0, value - t.step));
  const inc = () => onChange(value + t.step);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: "1px solid rgba(138, 90, 44, 0.12)",
        position: "relative",
      }}
    >
      {/* Progress bar in background */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${progress * 100}%`,
          background: t.bg,
          borderRadius: "12px 0 0 12px",
          opacity: 0.6,
          transition: "width 220ms ease-out",
        }}
      />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Color dot */}
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: t.color,
            flexShrink: 0,
          }}
        />
        {/* Label + Controls in one row */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontWeight: 700,
                fontStyle: "italic",
                color: "var(--ink-strong)",
              }}
            >
              {t.label}
            </span>
            {t.help && (
              <button
                onClick={() => setHelpOpen(h => !h)}
                aria-label="Cosa conta in questo tassello"
                style={{
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  border: `1px solid ${helpOpen ? t.color : "rgba(138,90,44,0.25)"}`,
                  background: helpOpen ? t.bg : "rgba(255,255,255,0.5)",
                  color: helpOpen ? t.color : "var(--ink-soft)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 150ms",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ?
              </button>
            )}
            <span
              style={{
                fontSize: "10px",
                color: "var(--ink-soft)",
                fontStyle: "italic",
              }}
            >
              {t.sub}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                fontStyle: "italic",
                color: t.color,
                lineHeight: 1,
                minWidth: "24px",
              }}
            >
              {value}
            </span>
            <span style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
              / {target} {t.unit}
              {isAdjusted && (
                <span style={{ color: "#b03832", marginLeft: "4px", fontStyle: "italic" }}>
                  (rivisto)
                </span>
              )}
            </span>
            {statusLabel && (
              <span
                style={{
                  fontSize: "10px",
                  color: statusColor,
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                {statusLabel}
              </span>
            )}
            {/* Spacer + Controls allineati a destra */}
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px", flexShrink: 0 }}>
              <button
                onClick={dec}
                disabled={value === 0}
                aria-label={`Togli ${t.step} ${t.unit}`}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid rgba(138, 90, 44, 0.3)",
                  background: "rgba(255,255,255,0.6)",
                  color: value === 0 ? "#c9a878" : t.color,
                  cursor: value === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 150ms",
                }}
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={inc}
                aria-label={`Aggiungi ${t.step} ${t.unit}`}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "none",
                  background: t.color,
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 150ms",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          {/* Streak warning badge */}
          {streakWarning && value < (adjustedTarget ?? tassello.target) && (
            <div
              style={{
                marginTop: "5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: streakWarning === "high"
                  ? "rgba(176, 56, 50, 0.10)"
                  : "rgba(184, 136, 36, 0.12)",
                border: `1px solid ${
                  streakWarning === "high" ? "rgba(176,56,50,0.3)"
                  : "rgba(184,136,36,0.3)"
                }`,
                borderRadius: "20px",
                padding: "2px 8px",
                fontSize: "10px",
                fontStyle: "italic",
                color: streakWarning === "high" ? "#b03832" : "#996600",
                fontWeight: 600,
              }}
            >
              <span>{streakWarning === "high" ? "⚠" : "·"}</span>
              <span>
                {t.id === "forza"
                  ? streakWarning === "high"
                    ? "2° giorno consecutivo — rischio massa muscolare"
                    : "1° giorno consecutivo"
                  : streakWarning === "high"
                    ? "3° giorno consecutivo — priorità alta"
                    : streakWarning === "med"
                    ? "2° giorno consecutivo"
                    : "1° giorno consecutivo"
                }
              </span>
            </div>
          )}
          {/* SoftMin warning per Oro */}
          {t.id === "oro" && t.softMin && value < t.softMin && (
            <div
              style={{
                marginTop: "5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(176, 56, 50, 0.10)",
                border: "1px solid rgba(176,56,50,0.3)",
                borderRadius: "20px",
                padding: "2px 8px",
                fontSize: "10px",
                fontStyle: "italic",
                color: "#b03832",
                fontWeight: 600,
              }}
            >
              <span>⚠</span>
              <span>sotto il minimo — vitamine liposolubili a rischio</span>
            </div>
          )}
          {flagChip && (
            <div style={{ marginTop: "6px" }}>
              {flagChip}
            </div>
          )}
          {helpOpen && t.help && (
            <div
              style={{
                marginTop: "6px",
                paddingTop: "6px",
                borderTop: "1px dashed rgba(138,90,44,0.15)",
                fontSize: "11px",
                color: "var(--ink)",
                lineHeight: 1.55,
                fontStyle: "italic",
              }}
            >
              {t.help}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

