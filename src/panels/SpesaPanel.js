// panels/SpesaPanel.js - lista della spesa

// ============================================================
// INFO PANEL — Come funziona l'app
// ============================================================

// ============================================================
// SPESA PANEL — Linee guida per la spesa settimanale
// ============================================================

function SpesaPanel({ onClose }) {
  return (
    <SlidePanel
      title="Lista della spesa"
      subtitle="Guida settimanale per coprire tutti i tasselli"
      onClose={onClose}
    >
      {SPESA.map((s, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: `1px solid ${s.colore}22`,
            borderLeft: `3px solid ${s.colore}`,
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "7px",
            }}
          >
            <span style={{ fontSize: "16px" }} aria-hidden="true">{s.emoji}</span>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontStyle: "italic",
                fontWeight: 700,
                color: s.colore,
                lineHeight: 1.2,
              }}
            >
              {s.titolo}
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--ink)",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {s.testo}
          </div>
        </div>
      ))}
    </SlidePanel>
  );
}

