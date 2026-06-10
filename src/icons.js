// icons.js
// Livello 1. Preambolo React condiviso da tutto il bundle concatenato e
// factory + definizioni delle icone SVG. Essendo il primo file concatenato,
// il binding di React (h + hook) qui e' visibile a tutti i file successivi.
// Le icone usano solo h; gli hook (useState/useEffect/useMemo) servono ai
// livelli components/panels/App, che vengono concatenati dopo.

const { createElement: h, useState, useEffect, useMemo } = React;

const icon = (paths) =>
  ({ size=24, color="currentColor", style={}, strokeWidth=2, ...rest }) =>
    h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
      stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style, ...rest },
      ...paths.map((d, i) => h("path", { key: i, d })));

const Plus          = icon(["M12 5v14M5 12h14"]);
const Minus         = icon(["M5 12h14"]);
const RotateCcw     = icon(["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8","M3 3v5h5"]);
const Calendar      = icon(["M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]);
const TrendingDown  = icon(["M22 17l-8.5-8.5-5 5L2 7","M16 17h6v-6"]);
const Check         = icon(["M20 6 9 17l-5-5"]);
const AlertCircle   = icon(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v4M12 16h.01"]);
const ChevronRight  = icon(["m9 18 6-6-6-6"]);
const ChevronLeft   = icon(["m15 18-6-6 6-6"]);
const X             = icon(["M18 6 6 18M6 6l12 12"]);
const Shield        = icon(["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]);
const BookOpen      = icon(["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"]);
const Search        = icon(["m21 21-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"]);
const Info          = icon(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 16v-4M12 8h.01"]);
const ShoppingCart  = icon(["M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z","M3 6h18","M16 10a4 4 0 0 1-8 0"]);
