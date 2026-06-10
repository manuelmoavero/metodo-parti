// panels/ClassificatorePanel.js - classificatore guidato per alimenti fuori prontuario

// ============================================================
// CLASSIFICATORE PANEL — guided food classification wizard
// ============================================================
// Cammina l'albero CLASSIFICATORE (data/classificatore.js).
// Accumula tasselli e fattore di dimensione lungo il percorso,
// poi chiede la quantità (ramo alimento singolo) e mostra l'esito
// nel formato del prontuario, con aggiunta diretta al giorno.

function ClassificatorePanel({ onClose, onAddItem, addedLabel }) {
  const initial = {
    nodeId: CLASSIFICATORE.start,
    acc: {},
    factor: 1,
    unit: null,
    stage: "tree", // tree | qty | esito
  };
  const [state, setState] = useState(initial);
  const [history, setHistory] = useState([]);
  const [added, setAdded] = useState(false);
  const [multiSelected, setMultiSelected] = useState([]);

  const pushAndGo = (nextState) => {
    setHistory((prev) => [...prev, state]);
    setState(nextState);
    setMultiSelected([]);
    setAdded(false);
  };

  const handleOption = (opt) => {
    const acc = { ...state.acc };
    if (opt.add) {
      for (const [id, v] of Object.entries(opt.add)) {
        acc[id] = (acc[id] || 0) + v;
      }
    }
    const next = {
      nodeId: opt.next === "qty" || opt.next === "esito" ? state.nodeId : opt.next,
      acc,
      factor: opt.factor != null ? opt.factor : state.factor,
      unit: opt.unit || state.unit,
      stage: opt.next === "qty" ? "qty" : opt.next === "esito" ? "esito" : "tree",
    };
    pushAndGo(next);
  };

  const handleQty = (factor) => {
    pushAndGo({ ...state, factor, stage: "esito" });
  };

  const toggleMulti = (i) => {
    setMultiSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const confirmMulti = (node) => {
    const adds = multiSelected.map((i) => node.opzioni[i].add).filter(Boolean);
    const merged = mergeRipienoAdds(adds);
    const acc = { ...state.acc };
    for (const [id, v] of Object.entries(merged)) {
      acc[id] = (acc[id] || 0) + v;
    }
    pushAndGo({
      ...state,
      acc,
      stage: node.next === "qty" ? "qty" : node.next === "esito" ? "esito" : "tree",
      nodeId: node.next === "qty" || node.next === "esito" ? state.nodeId : node.next,
    });
  };

  const goBack = () => {
    if (history.length === 0) return;
    setState(history[history.length - 1]);
    setHistory((prev) => prev.slice(0, -1));
    setMultiSelected([]);
    setAdded(false);
  };

  const restart = () => {
    setState(initial);
    setHistory([]);
    setMultiSelected([]);
    setAdded(false);
  };

  const finale = scaleTasselli(state.acc, state.factor);
  const finaleLabel = formatTasselli(finale);
  const hasTasselli = Object.keys(finale).length > 0;

  const handleAdd = () => {
    if (!onAddItem || !hasTasselli) return;
    onAddItem({ name: "Alimento classificato", value: finaleLabel });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const node = CLASSIFICATORE.nodes[state.nodeId];

  const optionBtnStyle = {
    width: "100%",
    textAlign: "left",
    background: "var(--bg-card)",
    border: "1px solid rgba(138, 90, 44, 0.2)",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "8px",
    cursor: "pointer",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
  };

  const navBtnStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--ink-soft)",
    fontSize: "12px",
    fontFamily: "var(--font-body)",
    padding: "6px 8px",
    textDecoration: "underline",
  };

  return (
    <SlidePanel
      title="Classifichiamolo insieme"
      subtitle="Qualche domanda visiva, nessuna etichetta da leggere."
      onClose={onClose}
    >
      {/* Navigazione: indietro e ricomincia */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={goBack} style={{ ...navBtnStyle, visibility: history.length ? "visible" : "hidden" }}>
          ← Indietro
        </button>
        <button onClick={restart} style={{ ...navBtnStyle, visibility: history.length ? "visible" : "hidden" }}>
          Ricomincia
        </button>
      </div>

      {state.stage === "tree" && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              color: "var(--ink-strong)",
              marginBottom: node.nota ? "6px" : "14px",
            }}
          >
            {node.domanda}
          </div>
          {node.nota && (
            <div style={{ fontSize: "12px", color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: "14px" }}>
              {node.nota}
            </div>
          )}
          {node.opzioni.map((opt, i) => {
            const isMulti = !!node.multi;
            const isSelected = isMulti && multiSelected.includes(i);
            return (
              <button
                key={i}
                onClick={() => (isMulti ? toggleMulti(i) : handleOption(opt))}
                style={{
                  ...optionBtnStyle,
                  border: isSelected
                    ? "2px solid #8a5a2c"
                    : optionBtnStyle.border,
                  background: isSelected ? "rgba(138, 90, 44, 0.08)" : optionBtnStyle.background,
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  {isMulti ? (isSelected ? "✓ " : "") : ""}{opt.label}
                </div>
                {opt.hint && (
                  <div style={{ fontSize: "11px", color: "var(--ink-soft)", marginTop: "3px" }}>{opt.hint}</div>
                )}
              </button>
            );
          })}
          {node.multi && (
            <button
              onClick={() => confirmMulti(node)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#8a5a2c",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                marginTop: "4px",
              }}
            >
              {multiSelected.length === 0 ? "Nessun ripieno rilevante, avanti" : "Conferma"}
            </button>
          )}
        </div>
      )}

      {state.stage === "qty" && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              color: "var(--ink-strong)",
              marginBottom: "6px",
            }}
          >
            Quanto ne hai mangiato?
          </div>
          {state.unit && (
            <div style={{ fontSize: "12px", color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: "14px" }}>
              Riferimento per 1 porzione: {state.unit}.
            </div>
          )}
          {CLASSIFICATORE_QTY.map((q, i) => (
            <button key={i} onClick={() => handleQty(q.factor)} style={optionBtnStyle}>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>{q.label}</div>
            </button>
          ))}
        </div>
      )}

      {state.stage === "esito" && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              color: "var(--ink-strong)",
              marginBottom: "10px",
            }}
          >
            Ecco come conta
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(138, 90, 44, 0.25)",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--ink-strong)",
              marginBottom: "12px",
            }}
          >
            {finaleLabel}
          </div>
          {hasTasselli ? (
            <button
              onClick={handleAdd}
              disabled={added}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                cursor: added ? "default" : "pointer",
                background: added ? "rgba(90,122,60,0.85)" : "#8a5a2c",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                marginBottom: "12px",
              }}
            >
              {added ? `Aggiunto a ${addedLabel}` : `Aggiungi a ${addedLabel}`}
            </button>
          ) : (
            <div style={{ fontSize: "12px", color: "var(--ink-soft)", textAlign: "center", marginBottom: "12px" }}>
              Questo alimento non muove tasselli: nessuna aggiunta necessaria.
            </div>
          )}
          <div style={{ fontSize: "12px", color: "var(--ink-soft)", lineHeight: 1.5, textAlign: "center" }}>
            Nel dubbio tra due tasselli vicini, scegli e vai: il metodo regge l'approssimazione, è fatto per questo.
          </div>
        </div>
      )}
    </SlidePanel>
  );
}
