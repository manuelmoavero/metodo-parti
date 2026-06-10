// panels/GuidaPanel.js - framework teorico (pilastri, interazioni, sezioni)

// ============================================================
// GUIDA PANEL — come funziona, pilastri, interazioni
// ============================================================

function GuidaPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("come-funziona");
  const tabs = [
    { id: "come-funziona", label: "Come funziona" },
    { id: "pilastri",      label: "Pilastri" },
    { id: "interazioni",   label: "Interazioni" },
  ];
  return (
    <SlidePanel title="Guida" subtitle="metodo, principi e sinergie nutrizionali" onClose={onClose}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "7px 4px",
              borderRadius: "20px",
              border: activeTab === tab.id ? "none" : "1px solid rgba(138,90,44,0.25)",
              background: activeTab === tab.id ? "var(--accent)" : "rgba(255,255,255,0.6)",
              color: activeTab === tab.id ? "white" : "var(--ink-soft)",
              fontSize: "11px",
              fontWeight: activeTab === tab.id ? 700 : 400,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Come funziona */}
      {activeTab === "come-funziona" && INFO_SEZIONI.map((s, i) => (
        <div
          key={i}
          style={{ background: "var(--bg-card)", border: "1px solid rgba(138, 90, 44, 0.12)", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px" }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontStyle: "italic", fontWeight: 700, color: "var(--ink-strong)", marginBottom: "6px" }}>
            {s.titolo}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {s.testo}
          </div>
        </div>
      ))}

      {/* Pilastri */}
      {activeTab === "pilastri" && PILASTRI.map((p) => (
        <div
          key={p.id}
          style={{ background: "var(--bg-card)", border: "1px solid rgba(138, 90, 44, 0.12)", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", display: "flex", gap: "14px" }}
        >
          <div style={{ fontSize: "22px", flexShrink: 0, lineHeight: 1.2 }} aria-hidden="true">{p.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontStyle: "italic", fontWeight: 700, color: "var(--ink-strong)", marginBottom: "4px", lineHeight: 1.2 }}>
              {p.title}
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {p.body}
            </div>
          </div>
        </div>
      ))}

      {/* Interazioni */}
      {activeTab === "interazioni" && INTERAZIONI.map((group, gi) => (
        <div key={gi} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "10px", paddingBottom: "6px", borderBottom: "2px solid " + group.color }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontStyle: "italic", fontWeight: 700, color: group.color }}>
              {group.verb}
            </span>
            <span style={{ fontSize: "11px", color: "var(--ink-soft)", fontStyle: "italic" }}>
              {group.subtitle}
            </span>
          </div>
          {group.items.map((item, ii) => (
            <div key={ii} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: "2px solid " + group.color + "40" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-strong)", marginBottom: "3px" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "11px", color: "var(--ink)", lineHeight: 1.6 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      ))}
    </SlidePanel>
  );
}

