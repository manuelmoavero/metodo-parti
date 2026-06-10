// panels/ProntuarioPanel.js - prontuario alimenti + aggiunta al giorno

// ============================================================
// PRONTUARIO PANEL — searchable food classification database
// ============================================================

function ProntuarioPanel({ onClose, onAddItem, addedLabel }) {
  const [query, setQuery] = useState("");
  const [addedItems, setAddedItems] = useState({});

  // Le sezioni partono collassate a ogni apertura del prontuario.
  // openSections è solo stato di sessione: tiene quali sezioni l'utente ha
  // aperto manualmente, senza persistenza (alla riapertura riparte chiuso).
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionName) => {
    setOpenSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const norm = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return PRONTUARIO;
    return PRONTUARIO.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const hay = norm(item.name + " " + (item.note || "") + " " + item.value);
        return hay.includes(q);
      }),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const slotColor = (slot) => {
    const colors = {
      energia: "#8b6332", forza: "#b03832", foglia: "#5a7a3c",
      colore: "#c97a4d", frutto: "#a8456e", oro: "#b88824", granello: "#6b8a8a",
    };
    return colors[slot] || "#888";
  };

  const handleAdd = (item, key) => {
    if (!onAddItem) return;
    onAddItem(item);
    setAddedItems((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedItems((prev) => { const n = { ...prev }; delete n[key]; return n; }), 1800);
  };

  const parsed = (item) => parseItemValue(item.value);
  const hasAction = (item) => {
    const { tasselli, flags } = parsed(item);
    return Object.keys(tasselli).length > 0 || flags.length > 0;
  };

  return (
    <SlidePanel
      title="Prontuario dei cibi"
      subtitle="Cerca un alimento o sfoglia per categoria. Tap su una riga per vedere la classificazione."
      onClose={onClose}
    >
      {/* Search box */}
      <div
        style={{
          position: "relative",
          marginBottom: "14px",
        }}
      >
        <Search
          size={16}
          color="var(--ink-soft)"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="cerca tofu, cornetto, hummus..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            fontSize: "13px",
            fontFamily: "var(--font-body)",
            background: "var(--bg-card)",
            border: "1px solid rgba(138, 90, 44, 0.2)",
            borderRadius: "10px",
            outline: "none",
            color: "var(--ink)",
            boxSizing: "border-box",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-soft)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "30px 10px",
            color: "var(--ink-soft)",
            fontSize: "13px",
            fontStyle: "italic",
          }}
        >
          Nessun alimento corrisponde a "{query}".
          <br />
          <span style={{ fontSize: "11px" }}>
            Usa il principio dei 5 secondi: lista ingredienti corta = pieno valore nel tassello dominante, lista lunga = metà valore.
          </span>
        </div>
      )}

      {filtered.map((section) => {
        // Durante la ricerca le sezioni con risultati restano sempre aperte.
        const isCollapsed = query.trim() ? false : !openSections[section.section];
        return (
        <div key={section.section} style={{ marginBottom: "10px" }}>
          {/* Section header — cliccabile */}
          <button
            onClick={() => toggleSection(section.section)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "transparent",
              border: "none",
              borderBottom: isCollapsed
                ? "1px solid rgba(138,90,44,0.15)"
                : "1px solid rgba(138,90,44,0.15)",
              padding: "6px 4px",
              marginBottom: isCollapsed ? "2px" : "8px",
              cursor: "pointer",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.22em",
                fontWeight: 700,
                color: "var(--ink-soft)",
                textTransform: "uppercase",
                textAlign: "left",
                flex: 1,
              }}
            >
              {section.section}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--ink-soft)",
                fontStyle: "italic",
                flexShrink: 0,
                marginRight: "2px",
              }}
            >
              {isCollapsed ? `${section.items.length} voci` : ""}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="var(--ink-soft)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                flexShrink: 0,
                transition: "transform 200ms ease",
                transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
              }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Items — nascosti se collassato */}
          {!isCollapsed && section.items.map((item, i) => {
            const itemKey = `${section.section}:${i}`;
            const isAdded = addedItems[itemKey];
            const canAdd = hasAction(item);
            const { tasselli: tv } = parsed(item);
            const mainSlot = item.slots[0];
            const btnColor = mainSlot ? slotColor(mainSlot) : "#8a5a2c";

            return (
              <div
                key={i}
                style={{
                  background: isAdded ? "rgba(90,122,60,0.07)" : "var(--bg-card)",
                  border: isAdded ? "1px solid rgba(90,122,60,0.3)" : "1px solid rgba(138, 90, 44, 0.1)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  marginBottom: "6px",
                  transition: "background 200ms, border 200ms",
                }}
              >
                {/* Row 1: dots + name + add button */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  {/* Slot dots */}
                  <div style={{ display: "flex", gap: "3px", flexShrink: 0, paddingTop: "5px" }}>
                    {item.slots.length === 0 ? (
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1.5px solid #b0a090", background: "transparent" }} />
                    ) : (
                      item.slots.map((slot) => (
                        <div key={slot} style={{ width: "8px", height: "8px", borderRadius: "50%", background: slotColor(slot) }} />
                      ))
                    )}
                  </div>
                  {/* Name + portion */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-strong)", lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--ink-soft)", fontStyle: "italic", marginTop: "1px" }}>
                      {item.portion}
                    </div>
                  </div>
                  {/* Add button */}
                  {canAdd && (
                    <button
                      onClick={() => handleAdd(item, itemKey)}
                      aria-label={isAdded ? "Aggiunto" : `Aggiungi ${item.name} al giorno`}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        border: isAdded ? "none" : `1.5px solid ${btnColor}`,
                        background: isAdded ? "#5a7a3c" : "rgba(255,255,255,0.7)",
                        color: isAdded ? "white" : btnColor,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 200ms",
                        marginTop: "1px",
                      }}
                    >
                      {isAdded
                        ? <Check size={13} strokeWidth={3} />
                        : <Plus size={13} strokeWidth={2.5} />
                      }
                    </button>
                  )}
                </div>
                {/* Row 2: value */}
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: mainSlot ? slotColor(mainSlot) : "var(--ink-soft)",
                    marginTop: "4px",
                    paddingLeft: "18px",
                  }}
                >
                  {item.value}
                </div>
                {/* Row 3: note */}
                {item.note && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: item.note.startsWith("⚠") ? "#b03832" : "var(--ink-soft)",
                      fontStyle: "italic",
                      marginTop: "4px",
                      paddingLeft: "18px",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.note}
                  </div>
                )}
              </div>
            );
          })}

        </div>
        );
      })}
    </SlidePanel>
  );
}

