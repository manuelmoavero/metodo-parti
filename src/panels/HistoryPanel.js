// panels/HistoryPanel.js - storico giorni

// ============================================================
// HISTORY PANEL (last 7 days as a small bar chart)
// ============================================================

function HistoryPanel({ daysData, onClose, onSelectDay, onImport, isLogged }) {
  const last14Days = [];
  for (let i = 13; i >= 0; i--) {
    last14Days.push(daysAgoKey(i));
  }

  const dayStatus = (dateKey) => {
    const day = daysData[dateKey];
    if (!day) return { closed: 0, total: TASSELLI.length, empty: true };
    let closed = 0;
    TASSELLI.forEach((t) => {
      const v = day[t.id] || 0;
      const target = t.target;
      if (t.isMin && v >= target) closed++;
      else if (t.isMax && v > 0 && v <= target) closed++;
      else if (!t.isMin && !t.isMax && v >= target) closed++;
    });
    return { closed, total: TASSELLI.length, empty: false };
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target.result);
          const validKeys = Object.keys(raw).filter(k => k.startsWith("parti_day:") || k.startsWith("parti_flag:"));
          if (validKeys.length === 0) {
            alert("File non valido: nessun dato del Metodo delle Parti trovato.");
            return;
          }
          const giorni = validKeys.filter(k => k.startsWith("parti_day:")).length;

          const msg = isLogged
            ? "Importare " + giorni + " giorni di dati?\n\nI dati attuali del tuo account verranno sostituiti e sincronizzati su tutti i tuoi dispositivi."
            : "Importare " + giorni + " giorni di dati?\n\nATTENZIONE: non hai effettuato l'accesso. Questi dati sostituiranno solo i dati salvati su questo dispositivo e NON saranno sincronizzati. Per sincronizzarli su più dispositivi, accedi prima di importare.";

          if (!window.confirm(msg)) return;

          // Costruisce daysData e flagsData dal JSON
          const daysData  = {};
          const flagsData = {};
          validKeys.forEach(k => {
            const parsed = JSON.parse(raw[k]);
            if (k.startsWith("parti_day:"))  daysData[k.replace("parti_day:", "")]  = parsed;
            if (k.startsWith("parti_flag:")) flagsData[k.replace("parti_flag:", "")] = parsed;
          });

          // Delega ad App.js che gestisce localStorage + Supabase
          onImport(daysData, flagsData);
        } catch (err) {
          alert("Errore nel leggere il file: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(58, 40, 24, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 100,
        animation: "fadeIn 200ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          margin: "0 auto",
          background: "var(--bg-page)",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "slideUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontStyle: "italic",
              color: "var(--ink-strong)",
            }}
          >
            Storico
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-soft)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: "11px", color: "var(--ink-soft)", marginBottom: "12px", fontStyle: "italic" }}>
          Ultimi 14 giorni — clicca per modificare un giorno passato
        </div>

        {last14Days.map((dateKey) => {
          const status = dayStatus(dateKey);
          const ratio = status.empty ? 0 : status.closed / status.total;
          return (
            <button
              key={dateKey}
              onClick={() => {
                onSelectDay(dateKey);
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                marginBottom: "4px",
                background: status.empty ? "rgba(0,0,0,0.02)" : "var(--bg-card)",
                border: "1px solid rgba(138, 90, 44, 0.1)",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                opacity: status.empty ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 600, minWidth: "70px" }}>
                {dayLabel(dateKey)}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "6px",
                  background: "rgba(138, 90, 44, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    background:
                      ratio >= 0.85
                        ? "#5a7a3c"
                        : ratio >= 0.6
                        ? "#b88824"
                        : "#b03832",
                  }}
                />
              </div>
              <span style={{ fontSize: "11px", color: "var(--ink-soft)", minWidth: "30px", textAlign: "right" }}>
                {status.empty ? "—" : `${status.closed}/${status.total}`}
              </span>
            </button>
          );
        })}

        {/* Export / Import */}
        <div style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px dashed rgba(138, 90, 44, 0.2)",
        }}>
          <div style={{ fontSize: "11px", color: "var(--ink-soft)", fontStyle: "italic", marginBottom: "10px" }}>
            Backup dati — usa per passare a un nuovo dispositivo
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => {
                // Esporta lo scope ATTIVO (daysData/flagsData riflettono account o anonimo).
                // Il formato resta parti_day:/parti_flag: per compatibilità con l'import.
                const data = {};
                Object.entries(daysData).forEach(([k, v]) => {
                  data[`parti_day:${k}`] = JSON.stringify(v);
                });
                Object.entries(flagsData).forEach(([k, v]) => {
                  data[`parti_flag:${k}`] = JSON.stringify(v);
                });
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const today = new Date().toISOString().slice(0, 10);
                a.download = "metodo_parti_" + today + ".json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{
                flex: 1,
                padding: "10px",
                background: "var(--bg-card)",
                border: "1px solid rgba(138, 90, 44, 0.25)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#3a2818",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              ⬇ Esporta dati
            </button>
            <button
              onClick={handleImport}
              style={{
                flex: 1,
                padding: "10px",
                background: "#3a2818",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              ⬆ Importa dati
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
