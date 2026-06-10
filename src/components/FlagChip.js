// components/FlagChip.js - FlagChip (badge inline) + FlagsStandalone (Omega-3, Calcio)

// ============================================================
// FLAG COMPONENTS
// ============================================================

// FlagChip: piccolo badge tappabile inline (usato sul tassello Frutto)
function FlagChip({ flag, state, onToggle }) {
  const { tappedToday, status } = state;

  const bgColor = tappedToday
    ? "#5a7a3c"
    : status === "alert"
    ? "#b03832"
    : status === "warn"
    ? "#b88824"
    : status === "streak_max"
    ? "#6b8a8a"
    : "rgba(138,90,44,0.12)";

  const textColor = tappedToday || status === "alert" || status === "warn"
    ? "white"
    : "var(--ink-soft)";

  const label = tappedToday
    ? `${flag.emoji} ${flag.label} ✓`
    : status === "alert"
    ? `${flag.emoji} ${flag.label} !`
    : status === "warn"
    ? `${flag.emoji} ${flag.label} ·`
    : status === "streak_max"
    ? `${flag.emoji} ${flag.label} ~`
    : `${flag.emoji} ${flag.label}`;

  return (
    <button
      onClick={onToggle}
      title={
        status === "streak_max"
          ? `${flag.fullLabel}: sei coperto per diversi giorni, puoi variare`
          : status === "alert"
          ? `${flag.fullLabel}: ${state.daysSince} giorni senza — considera di includerlo`
          : status === "warn"
          ? `${flag.fullLabel}: ${state.daysSince} giorni senza`
          : tappedToday
          ? `${flag.fullLabel}: tappato oggi`
          : flag.fullLabel
      }
      style={{
        padding: "3px 8px",
        borderRadius: "20px",
        border: "none",
        background: bgColor,
        color: textColor,
        fontSize: "10px",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 200ms ease",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </button>
  );
}

// FlagsStandalone: due flag (Omega-3 e Calcio) con riga espansa, sotto Granello
function FlagsStandalone({ flagStates, onToggle }) {
  const standaloneFlags = FLAGS.filter((f) => f.tasselloId === null);

  return (
    <div style={{ marginTop: "8px" }}>
      {standaloneFlags.map((flag) => {
        const state = flagStates[flag.id] || { tappedToday: false, status: "ok", daysSince: 0 };
        const { tappedToday, status, daysSince } = state;

        const rowBg = tappedToday
          ? "rgba(90, 122, 60, 0.1)"
          : status === "alert"
          ? "rgba(176, 56, 50, 0.08)"
          : status === "warn"
          ? "rgba(184, 136, 36, 0.08)"
          : "var(--bg-card)";

        const dotColor = tappedToday
          ? "#5a7a3c"
          : status === "alert"
          ? "#b03832"
          : status === "warn"
          ? "#b88824"
          : status === "streak_max"
          ? "#6b8a8a"
          : flag.id === "omega3" ? "#5a7a3c" : "#6b8a8a";

        const statusText = tappedToday
          ? "ok oggi"
          : status === "alert"
          ? `${daysSince} giorni senza`
          : status === "warn"
          ? `${daysSince} giorni senza`
          : status === "streak_max"
          ? "coperto, puoi variare"
          : "non segnato oggi";

        return (
          <div
            key={flag.id}
            style={{
              background: rowBg,
              border: "1px solid rgba(138, 90, 44, 0.12)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "8px",
              transition: "background 200ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: dotColor,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-strong)" }}>
                  {flag.emoji} {flag.fullLabel}
                </div>
                <div style={{ fontSize: "10px", color: "var(--ink-soft)", fontStyle: "italic", marginTop: "1px" }}>
                  {statusText}
                </div>
                {flag.dose && (
                  <div style={{ fontSize: "10px", color: "var(--ink)", marginTop: "3px", lineHeight: 1.4 }}>
                    {flag.dose}
                  </div>
                )}
              </div>
              <button
                onClick={() => onToggle(flag.id)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: tappedToday
                    ? "none"
                    : "1px solid rgba(138, 90, 44, 0.3)",
                  background: tappedToday ? "#5a7a3c" : "rgba(255,255,255,0.6)",
                  color: tappedToday ? "white" : dotColor,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 200ms ease",
                }}
                aria-label={tappedToday ? `Rimuovi flag ${flag.fullLabel}` : `Segna ${flag.fullLabel}`}
              >
                {tappedToday ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
              </button>
            </div>
            {(status === "warn" || status === "alert") && !tappedToday && (
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px dashed rgba(138, 90, 44, 0.15)",
                  fontSize: "10.5px",
                  color: "var(--ink-soft)",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {flag.dose && (
                  <div style={{ marginBottom: "4px", color: "var(--ink)", fontWeight: 600, fontStyle: "normal" }}>
                    📋 {flag.dose}
                  </div>
                )}
                Fonti: {flag.sources}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

