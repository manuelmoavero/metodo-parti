// components/DonutChart.js - ciambella a 7 spicchi, uno per tassello

// ============================================================
// SUGGESTIONS PANEL
// ============================================================

// ── DonutChart: 7 spicchi, uno per tassello ──────────────────────────────────

function DonutChart({ today, adjustedTargets }) {
  const cx = 50, cy = 50, rOut = 44, rIn = 27;
  const total = TASSELLI.length;
  const sliceDeg = 360 / total;
  const gapDeg = 3;
  const startOffset = -90;

  const polar = (angle, r) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const arcPath = (startAngle, endAngle) => {
    const s1 = polar(startAngle, rOut);
    const e1 = polar(endAngle, rOut);
    const s2 = polar(endAngle, rIn);
    const e2 = polar(startAngle, rIn);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)}`,
      `A ${rOut} ${rOut} 0 ${large} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)}`,
      `L ${s2.x.toFixed(2)} ${s2.y.toFixed(2)}`,
      `A ${rIn} ${rIn} 0 ${large} 0 ${e2.x.toFixed(2)} ${e2.y.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  // Returns { progress 0-1, exceeded bool, closed bool }
  const sliceState = (t) => {
    const v = today[t.id] || 0;
    const target = adjustedTargets[t.id] ?? t.target;

    if (t.isMin) {
      // Foglia, Colore: no max, più è meglio
      const progress = Math.min(v / target, 1);
      return { progress, exceeded: false, closed: v >= target };
    }

    if (t.isMax) {
      // Energia: ha un tetto — chiuso solo se hai mangiato qualcosa e non hai sforato
      if (v > target) return { progress: 1, exceeded: true, closed: false };
      const progress = target > 0 ? v / target : 0;
      const closed = v > 0 && v <= target;
      return { progress, exceeded: false, closed };
    }

    // Forza, Frutto, Oro: target morbido con eventuale softMax
    if (t.softMax && v > t.softMax) {
      return { progress: 1, exceeded: true, closed: false };
    }
    const progress = Math.min(v / target, 1);
    const closed = v >= target && (!t.softMax || v <= t.softMax);
    return { progress, exceeded: false, closed };
  };

  const states = TASSELLI.map(sliceState);
  const closedCount = states.filter((s) => s.closed).length;
  const allDone = closedCount === total;

  return (
    <svg
      viewBox="0 0 100 100"
      width="88"
      height="88"
      style={{ flexShrink: 0 }}
      aria-label={`${closedCount} tasselli chiusi su ${total}`}
    >
      {TASSELLI.map((t, i) => {
        const start = startOffset + i * sliceDeg + gapDeg / 2;
        const end = startOffset + (i + 1) * sliceDeg - gapDeg / 2;
        const { progress, exceeded } = states[i];
        // Opacità: 0.13 (vuoto) → 1.0 (pieno), interpolata sul progresso
        const opacity = 0.13 + progress * 0.87;
        // Colore: rosso accent se sforato, colore del tassello altrimenti
        const fill = exceeded ? "#b03832" : t.color;
        return (
          <path
            key={t.id}
            d={arcPath(start, end)}
            fill={fill}
            opacity={opacity}
            style={{ transition: "opacity 280ms ease, fill 280ms ease" }}
          />
        );
      })}
      {/* Testo centrale */}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="Palatino, Georgia, serif"
        fontStyle="italic"
        fill={allDone ? "#5a7a3c" : "#3a2818"}
      >
        {closedCount}
      </text>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontFamily="Palatino, Georgia, serif"
        fontStyle="italic"
        fill="#8a5a2c"
      >
        {"/ " + total}
      </text>
    </svg>
  );
}

