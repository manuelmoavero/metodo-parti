#!/usr/bin/env bash
# build.sh - Metodo delle Parti
# Concatena i file di src/ in ordine di dipendenza dentro lo shell HTML e
# genera index.html. Nessun bundler, nessun transpilatore lato build: il
# runtime resta babel-in-browser (esbuild crasha con SIGSEGV nel container).
# I file di src/ condividono un unico scope <script>, quindi le costanti e le
# funzioni definite in un file sono visibili ai file concatenati dopo.

set -euo pipefail
cd "$(dirname "$0")"

SRC="src"
OUT="index.html"

# Ordine di dipendenza (dal piu puro all'interfaccia):
#   icons -> data -> logic -> ui -> components -> panels -> App
# App.js resta per ultima.
FILES=(
  icons.js
  data/tasselli.js
  data/config.js
  data/supabase.js
  data/prontuario.js
  data/guida.js
  data/flags.js
  data/spesa.js
  data/classificatore.js
  logic/dates.js
  logic/compensation.js
  logic/flags-engine.js
  logic/suggestions.js
  logic/parse-item.js
  logic/classificatore-engine.js
  ui/SlidePanel.js
  components/FlagChip.js
  components/Counter.js
  components/GranelloCounter.js
  components/DonutChart.js
  components/SuggestionsPanel.js
  panels/HistoryPanel.js
  panels/GuidaPanel.js
  panels/ClassificatorePanel.js
  panels/ProntuarioPanel.js
  panels/SpesaPanel.js
  panels/LoginPanel.js
  App.js
)

# Controllo che ogni file dichiarato esista prima di generare.
for f in "${FILES[@]}"; do
  if [ ! -f "$SRC/$f" ]; then
    echo "build: file mancante $SRC/$f" >&2
    exit 1
  fi
done

{
  cat <<'HTML_HEAD'
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#fbf5e9">
<title>Il metodo delle parti</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="react">
HTML_HEAD

  for f in "${FILES[@]}"; do
    printf '// ===== %s =====\n' "$f"
    cat "$SRC/$f"
    printf '\n'
  done

  cat <<'HTML_TAIL'
</script>
</body>
</html>
HTML_TAIL
} > "$OUT"

echo "build: $OUT generato da ${#FILES[@]} file di $SRC/."
