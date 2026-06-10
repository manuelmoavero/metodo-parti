// ============================================================
// MAIN APP
// ============================================================

function App() {
  // Config per-utente: oggi sempre da default; domani potrà venire da Supabase
  // senza toccare nessun consumatore (tasselli, compensation, suggestions leggono da qui)
  const userConfig = getDefaultConfig();
  // Tasselli semantici + parametri quantitativi per-utente fusi insieme
  const tasselli = mergeTasselli(TASSELLI, userConfig);

  // State
  const [currentDate, setCurrentDate] = useState(todayKey());
  const [daysData, setDaysData] = useState({});
  const [flagsData, setFlagsData] = useState({}); // { "2026-05-27": { vitc: true, omega3: false, calcio: true } }
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guidaOpen, setGuidaOpen] = useState(false);
  const [prontuarioOpen, setProntuarioOpen] = useState(false);
  const [spesaOpen, setSpesaOpen] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    try {
      // One-shot cleanup: rimuove chiavi obsolete (parti_week e altro) preservando solo i dati attuali
      const validPrefixes = ["parti_day:", "parti_flag:"];
      Object.keys(localStorage)
        .filter((k) => !validPrefixes.some((p) => k.startsWith(p)))
        .forEach((k) => localStorage.removeItem(k));

      const data = {};
      Object.keys(localStorage)
        .filter((k) => k.startsWith("parti_day:"))
        .forEach((key) => {
          try { data[key.replace("parti_day:", "")] = JSON.parse(localStorage.getItem(key)); } catch (e) {}
        });
      setDaysData(data);

      const flagData = {};
      Object.keys(localStorage)
        .filter((k) => k.startsWith("parti_flag:"))
        .forEach((key) => {
          try { flagData[key.replace("parti_flag:", "")] = JSON.parse(localStorage.getItem(key)); } catch (e) {}
        });
      setFlagsData(flagData);
    } catch (e) {
      console.error("Load error:", e);
    }
    setLoading(false);
  }, []);

  // Persist a day's data
  const updateDay = (dateKey, tasselloId, newValue) => {
    const newDay = { ...(daysData[dateKey] || {}), [tasselloId]: newValue };
    setDaysData((prev) => ({ ...prev, [dateKey]: newDay }));
    try {
      localStorage.setItem(`parti_day:${dateKey}`, JSON.stringify(newDay));
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const toggleFlag = (dateKey, flagId) => {
    const dayFlags = flagsData[dateKey] || {};
    const newDayFlags = { ...dayFlags, [flagId]: !dayFlags[flagId] };
    setFlagsData((prev) => ({ ...prev, [dateKey]: newDayFlags }));
    try {
      localStorage.setItem(`parti_flag:${dateKey}`, JSON.stringify(newDayFlags));
    } catch (e) {
      console.error("Save flag error:", e);
    }
  };

  const resetToday = () => {
    if (!confirm("Azzerare la giornata di " + dayLabel(currentDate) + "?")) return;
    setDaysData((prev) => {
      const next = { ...prev };
      delete next[currentDate];
      return next;
    });
    try {
      localStorage.removeItem(`parti_day:${currentDate}`);
    } catch (e) {}
  };

  // Add a prontuario item's tasselli to the current date atomically
  const handleAddProntuarioItem = (item) => {
    const { tasselli, flags } = parseItemValue(item.value);

    // Build updated day atomically (avoids stale closure issues with multiple tasselli)
    const currentDay = daysData[currentDate] || {};
    const newDay = { ...currentDay };
    let granelloIncrement = 0;
    let dayChanged = false;

    for (const [id, amount] of Object.entries(tasselli)) {
      if (id === "granello") {
        granelloIncrement += amount;
      } else {
        newDay[id] = Math.round(((newDay[id] || 0) + amount) * 10) / 10;
        dayChanged = true;
      }
    }

    if (dayChanged) {
      setDaysData((prev) => ({ ...prev, [currentDate]: newDay }));
      try { localStorage.setItem(`parti_day:${currentDate}`, JSON.stringify(newDay)); } catch (e) {}
    }

    if (granelloIncrement > 0) {
      const currentGranello = (daysData[currentDate] || {}).granello || 0;
      const newGranello = Math.round((currentGranello + granelloIncrement) * 10) / 10;
      updateDay(currentDate, "granello", newGranello);
    }

    // Toggle flags (only if not already tapped today)
    const todayFlags = flagsData[currentDate] || {};
    for (const flagId of flags) {
      if (!todayFlags[flagId]) toggleFlag(currentDate, flagId);
    }
  };

  // Derived state
  const today = daysData[currentDate] || {};
  const isToday = currentDate === todayKey();
  const compensation = useMemo(
    () => (isToday ? computeCompensation(daysData, currentDate, userConfig) : {}),
    [daysData, currentDate, isToday]
  );

  // Adjusted targets factor in compensation from previous days.
  // compensation[id] is now an object { delta, reason, sourceDates, remainingDebt }
  const adjustedTargets = useMemo(() => {
    const out = {};
    tasselli.forEach((t) => {
      const adj = compensation[t.id];
      if (adj != null) {
        const newTarget = t.target + adj.delta;
        const floor = t.softMin ?? 0;
        out[t.id] = Math.max(floor, newTarget);
      } else {
        out[t.id] = t.target;
      }
    });
    return out;
  }, [compensation]);

  const flagStates = useMemo(
    () => computeFlagStates(flagsData, currentDate),
    [flagsData, currentDate]
  );

  // Streak warnings per ogni tassello: "high" | "med" | "low" | null
  const streakWarnings = useMemo(() => {
    const out = {};
    tasselli.forEach((t) => {
      const consumed = today[t.id] || 0;
      const target = adjustedTargets[t.id] ?? t.target;
      const isBelowToday = consumed < target;
      if (!isBelowToday) { out[t.id] = null; return; }

      if (t.id === "forza") {
        const prev = daysBelow(daysData, t.id, t.target, 1, currentDate);
        out[t.id] = prev < 0 ? null : prev >= 1 ? "high" : "med";
      } else if (t.isMin || t.id === "frutto") {
        const prev = daysBelow(daysData, t.id, t.target, 2, currentDate);
        out[t.id] = prev < 0 ? null : prev >= 2 ? "high" : prev === 1 ? "med" : "low";
      } else {
        out[t.id] = null;
      }
    });
    return out;
  }, [today, adjustedTargets, daysData, currentDate]);

  const navDay = (direction) => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() + direction);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d > today) return; // can't navigate to future
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setCurrentDate(`${y}-${m}-${day}`);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-page)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--ink-soft)",
        }}
      >
        ...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "var(--font-body)",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          margin: "0 auto",
          padding: "16px 14px 28px",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            paddingTop: "4px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.32em",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              Il metodo delle parti
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontStyle: "italic",
                color: "var(--ink-strong)",
                lineHeight: 1,
              }}
            >
              {dayLabel(currentDate)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => setGuidaOpen(true)}
              aria-label="Guida"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(138, 90, 44, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
              }}
            >
              <Info size={17} />
            </button>
            <button
              onClick={() => setSpesaOpen(true)}
              aria-label="Lista della spesa"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(138, 90, 44, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
              }}
            >
              <ShoppingCart size={17} />
            </button>
            <button
              onClick={() => setProntuarioOpen(true)}
              aria-label="Prontuario dei cibi"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(138, 90, 44, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
              }}
            >
              <BookOpen size={17} />
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              aria-label="Storico"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(138, 90, 44, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
              }}
            >
              <Calendar size={18} />
            </button>
          </div>
        </header>

        {/* Day navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            background: "rgba(255,255,255,0.45)",
            borderRadius: "10px",
            padding: "6px 10px",
          }}
        >
          <button
            onClick={() => navDay(-1)}
            aria-label="Giorno precedente"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--ink-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: "11px", color: "var(--ink-soft)", fontStyle: "italic" }}>
            {!isToday && (
              <button
                onClick={() => setCurrentDate(todayKey())}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontStyle: "italic",
                  fontSize: "11px",
                  textDecoration: "underline",
                }}
              >
                torna a oggi
              </button>
            )}
            {isToday && "ultimi 7 giorni in continuo"}
          </span>
          <button
            onClick={() => navDay(1)}
            disabled={isToday}
            aria-label="Giorno successivo"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "transparent",
              cursor: isToday ? "not-allowed" : "pointer",
              color: isToday ? "rgba(0,0,0,0.15)" : "var(--ink-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Suggestions */}
        {isToday && (
          <SuggestionsPanel
            today={today}
            adjustedTargets={adjustedTargets}
            daysData={daysData}
            currentDate={currentDate}
            granelloRolling={rollingGranello(daysData, currentDate)}
            todayFlags={flagsData[currentDate] || {}}
            tasselli={tasselli}
            granelloConfig={userConfig.granello}
          />
        )}

        {/* Compensation banner */}
        {isToday && Object.keys(compensation).length > 0 && (
          <div
            style={{
              background: "rgba(176, 56, 50, 0.08)",
              border: "1px solid rgba(176, 56, 50, 0.25)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "14px",
              fontSize: "12px",
              color: "var(--ink)",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <TrendingDown size={16} color="#b03832" style={{ marginTop: "1px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontStyle: "italic", fontWeight: 600, marginBottom: "2px" }}>
                Target rivisti per il rientro
              </div>
              {Object.entries(compensation).map(([id, adj]) => {
                const t = tasselli.find((x) => x.id === id);
                const newTarget = adjustedTargets[id];
                return (
                  <div
                    key={id}
                    style={{
                      fontSize: "11px",
                      color: "var(--ink)",
                      marginTop: "2px",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{t.label}</span>: {newTarget}{" "}
                    {t.unit} oggi ({adj.delta > 0 ? "+" : ""}
                    {adj.delta} da {t.target})
                    {adj.remainingDebt && adj.remainingDebt > Math.abs(adj.delta) + 0.001 && (
                      <span style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
                        {" "}
                        — debito residuo {adj.remainingDebt.toFixed(1)}, prosegue domani
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Counters */}
        {tasselli.map((t) => {
          const inlineFlag = FLAGS.find((f) => f.tasselloId === t.id);
          const flagChip = inlineFlag ? (
            <FlagChip
              flag={inlineFlag}
              state={flagStates[inlineFlag.id] || { tappedToday: false, status: "ok", daysSince: 0 }}
              onToggle={() => toggleFlag(currentDate, inlineFlag.id)}
            />
          ) : null;
          return (
            <Counter
              key={t.id}
              tassello={t}
              value={today[t.id] || 0}
              adjustedTarget={isToday ? adjustedTargets[t.id] : t.target}
              onChange={(v) => updateDay(currentDate, t.id, v)}
              flagChip={flagChip}
              streakWarning={isToday ? (streakWarnings[t.id] || null) : null}
            />
          );
        })}

        {/* Granello (weekly) */}
        <div style={{ marginTop: "16px", marginBottom: "10px" }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.28em",
              fontWeight: 700,
              color: "var(--ink-soft)",
              textTransform: "uppercase",
              paddingLeft: "4px",
              marginBottom: "8px",
            }}
          >
            Settimanale
          </div>
          <GranelloCounter
            value={rollingGranello(daysData, currentDate)}
            granelleOggi={today.granello || 0}
            onChange={(v) => updateDay(currentDate, "granello", v)}
          />
          <FlagsStandalone
            flagStates={flagStates}
            onToggle={(flagId) => toggleFlag(currentDate, flagId)}
          />
        </div>

        {/* Reset */}
        <button
          onClick={resetToday}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            background: "transparent",
            border: "1px dashed rgba(138, 90, 44, 0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            color: "var(--ink-soft)",
            fontSize: "11px",
            fontStyle: "italic",
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <RotateCcw size={12} />
          Azzera {dayLabel(currentDate).toLowerCase()}
        </button>

        {/* Footer */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px dotted rgba(138, 90, 44, 0.25)",
            fontSize: "10px",
            color: "var(--ink-soft)",
            textAlign: "center",
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          Una parte = un quarto di piatto.
          <br />
          Nessun calcolo di calorie. Solo riconoscimento e copertura.
        </div>
      </div>

      {historyOpen && (
        <HistoryPanel
          daysData={daysData}
          onClose={() => setHistoryOpen(false)}
          onSelectDay={setCurrentDate}
        />
      )}

      {guidaOpen && <GuidaPanel onClose={() => setGuidaOpen(false)} />}
      {prontuarioOpen && (
        <ProntuarioPanel
          onClose={() => setProntuarioOpen(false)}
          onAddItem={handleAddProntuarioItem}
          addedLabel={dayLabel(currentDate)}
        />
      )}
      {spesaOpen && <SpesaPanel onClose={() => setSpesaOpen(false)} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
