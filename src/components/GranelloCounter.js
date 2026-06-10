// components/GranelloCounter.js - contatore settimanale Granello (rolling 7gg)

// ============================================================
// GRANELLO COUNTER (weekly)
// ============================================================

function GranelloCounter({ value, granelleOggi, onChange }) {
  // value = totale rolling 7 giorni (display)
  // granelleOggi = granello di oggi (usato per il - che non può andare sotto 0)
  // onChange(newValueOggi) = aggiorna solo il granello di oggi
  const target = GRANELLO.target;
  const progress = Math.min(value / target, 1);
  const t = GRANELLO;
  const [helpOpen, setHelpOpen] = useState(false);

  const missing = Math.max(0, +(target - value).toFixed(1));
  const exceeded = GRANELLO.softMax && value > GRANELLO.softMax;
  const status = exceeded
    ? `oltre il tetto (max ${GRANELLO.softMax})`
    : value >= target
    ? "7 giorni coperti"
    : `mancano ${missing} ${missing === 1 ? "cucchiaio" : "cucchiai"}`;
  const statusColor = exceeded ? "#b03832" : value >= target ? "#5a7a3c" : t.color;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "12px",
        padding: "14px 16px",
        border: exceeded ? "1px solid rgba(176, 56, 50, 0.4)" : "1px solid rgba(138, 90, 44, 0.12)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${progress * 100}%`,
          background: t.bg,
          borderRadius: "12px 0 0 12px",
          opacity: 0.6,
        }}
      />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, fontStyle: "italic", color: "var(--ink-strong)" }}>
              {t.label}
            </span>
            {t.help && (
              <button
                onClick={() => setHelpOpen(h => !h)}
                aria-label="Cosa conta nel Granello"
                style={{
                  width: "17px", height: "17px", borderRadius: "50%",
                  border: `1px solid ${helpOpen ? t.color : "rgba(138,90,44,0.25)"}`,
                  background: helpOpen ? t.bg : "rgba(255,255,255,0.5)",
                  color: helpOpen ? t.color : "var(--ink-soft)",
                  cursor: "pointer", display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 700, flexShrink: 0,
                  transition: "all 150ms", padding: 0, lineHeight: 1,
                }}
              >
                ?
              </button>
            )}
            <span style={{ fontSize: "10px", color: "var(--ink-soft)", fontStyle: "italic" }}>
              ultimi 7 giorni
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, fontStyle: "italic", color: t.color, lineHeight: 1 }}>
              {value}
            </span>
            <span style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
              / {target} {t.unit}
            </span>
            <span style={{ fontSize: "10px", color: statusColor, marginLeft: "auto", fontStyle: "italic", fontWeight: 600 }}>
              {status}
            </span>
          </div>
          {granelleOggi > 0 && (
            <div style={{ fontSize: "10px", color: "var(--ink-soft)", fontStyle: "italic", marginTop: "2px" }}>
              oggi: {granelleOggi} cucchiai
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
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={() => onChange(Math.max(0, granelleOggi - 1))}
            disabled={granelleOggi === 0}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              border: "1px solid rgba(138, 90, 44, 0.3)",
              background: "rgba(255,255,255,0.6)",
              color: granelleOggi === 0 ? "#c9a878" : t.color,
              cursor: granelleOggi === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onChange(granelleOggi + 1)}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              border: "none", background: t.color, color: "white",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

