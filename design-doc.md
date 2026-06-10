# [00 Metodo delle Parti] - Design Doc

## Visione

[È un metodo di bilanciamento dell'alimentazione intuitivo, che si basa su principi di alimentazione scientifici, ma che li rende applicabili facilmente da tutti]

## Macro-architettura

Il "Metodo delle Parti" è composto da un framework teorico e da un tool pratico che lo applica, entrambi codificati in una web app.

Stack e runtime:

- React 18 (UMD da CDN) con transpilazione JSX nel browser tramite babel-standalone. Nessun build step è necessario per l'esecuzione.
- Persistenza: oggi è localStorage locale (sole chiavi `parti_day:` e `parti_flag:`), app a utente singolo. Direzione decisa (vedi stato.md, non ancora implementata): store remoto multi-utente, ogni utente accede al proprio JSON da più dispositivi, via Supabase (auth + dati per utente, free tier). localStorage resta come cache/fallback locale. Da realizzare dopo la migrazione dell'hosting.
- L'output deve restare apribile sia via `file://` (doppio click) sia con un semplice static serve. Hosting deciso: GitHub Pages (statico, nessun limite di banda), in sostituzione di Netlify. Oltre ai CDN di React e babel, l'unica dipendenza di rete prevista è Supabase, e solo quando lo store remoto sarà attivo.

Organizzazione del sorgente:

Il sorgente è suddiviso in moduli per livello di dipendenza e assemblato in un unico `index.html` eseguibile tramite una concatenazione ordinata (`build.sh`), senza bundler. Il runtime resta identico al monolite: babel transpila nel browser il blocco concatenato. La modularità riguarda la sorgente e la manutenzione, non il modo in cui la pagina gira.

Livelli, in ordine di dipendenza (dal più puro al più legato all'interfaccia):

1. icons: preambolo React condiviso dell'intero bundle concatenato (`const { createElement: h, useState, useEffect, useMemo } = React;`) + factory e definizioni delle icone SVG. Essendo il primo file concatenato, il binding di `h` e degli hook qui e' visibile a tutti i livelli successivi.
2. data/: sole costanti, nessun React, nessuna dipendenza. Contenuto nutrizionale e testuale (tasselli, prontuario, guida, flags, spesa).
3. logic/: funzioni pure e testabili, nessun React. Motori di calcolo (date, compensazione, stato flag, suggerimenti, parsing dei valori del prontuario).
4. ui/: infrastruttura di interfaccia riusabile (SlidePanel).
5. components/: widget sempre visibili nella schermata principale.
6. panels/: overlay slide-up aperti da pulsante; dipendono anche da ui/.
7. App: orchestrazione di stato, storage e wiring dei pannelli; include il mount finale.

Direzione delle dipendenze: a senso unico verso il basso. App dipende da panels e components; questi dipendono da ui, logic, data, icons. I file in data/ e logic/ non importano mai React e non dipendono da componenti.

Stato: la migrazione verso questa struttura modulare è completata e verificata a runtime (fasi 1-4 più la mini-fase icons+preambolo). Il seme `App.js` contiene ora solo l'orchestrazione. Avanzamento di dettaglio e fasi residue opzionali: vedi stato.md.

CSS:

- I token di design (variabili `:root`), il reset e i keyframe stanno in `style.css`, incluso nell'head via `<link>`.
- Lo stile dei singoli componenti resta inline (`style={{...}}`) e legge i token tramite `var(--...)`. `style.css` non contiene stile per-componente. Di conseguenza è un file relativamente piccolo: contiene i token, non il layout dei widget.

Build:

- `build.sh` concatena i file di `src/` nell'ordine dei livelli (data e logic prima dei loro consumatori, App per ultimo) dentro il template `index.html`. Nessun transpilatore lato build.
- Scelta motivata: esbuild va in SIGSEGV nel container attuale. La concatenazione evita del tutto il problema dello scope tra file, preserva il runtime esistente e mantiene l'apertura via `file://`.
- Piano B noto ma non adottato: più tag `<script type="text/babel" src="...">`. Più leggero, ma fa affidamento sulla condivisione di scope tra script transpilati da babel-standalone (fragile e dipendente dalla versione) e richiede di servire la pagina via http. Da considerare solo se validato.

## Struttura delle directory

```
metodo-parti/
├── index.html              # shell + blocco script generato dalla build
├── style.css               # token di design, reset, keyframe, stati :active/:focus
├── build.sh                # concatenazione ordinata di src/ -> index.html
└── src/
    ├── icons.js
    ├── data/
    │   ├── tasselli.js     # TASSELLI + GRANELLO
    │   ├── prontuario.js   # PRONTUARIO
    │   ├── guida.js        # PILASTRI + INTERAZIONI + INFO_SEZIONI
    │   ├── flags.js        # FLAGS
    │   └── spesa.js        # SPESA
    ├── logic/
    │   ├── dates.js        # todayKey, dayLabel, daysAgoKey, rollingGranello, dateKeyDaysBefore
    │   ├── compensation.js # computeCompensation, computeForTassello
    │   ├── flags-engine.js # computeFlagStates
    │   ├── suggestions.js  # daysBelow, suggestions
    │   └── parse-item.js   # parseItemValue
    ├── ui/
    │   └── SlidePanel.js
    ├── components/
    │   ├── FlagChip.js     # FlagChip + FlagsStandalone
    │   ├── Counter.js
    │   ├── GranelloCounter.js
    │   ├── DonutChart.js
    │   └── SuggestionsPanel.js
    ├── panels/
    │   ├── HistoryPanel.js
    │   ├── GuidaPanel.js
    │   ├── ProntuarioPanel.js
    │   └── SpesaPanel.js
    └── App.js
```

## Convenzioni

- Nuovo contenuto nutrizionale o testuale: va in un file di data/. Non mescolare dati con logica o interfaccia.
- Nuova regola di calcolo: va in logic/ come funzione pura, isolata e testabile.
- Ogni file ha un perimetro coeso e singolo.
- Testi autosufficienti: ogni label e nota in app deve bastare da sola, senza ricerche esterne (regola permanente, dettagli operativi in stato.md).
- Un intervento per commit: ogni passo di refactor o di modifica ha un perimetro preciso, validato prima della consegna. A ogni passo l'output concatenato deve restare un `index.html` funzionante.

## Decisioni storiche

- Adozione di un'architettura modulare con sorgenti in src/ (per manutenzione e per ridurre il contesto token per sessione: file da circa 50-350 righe invece di un monolite da circa 3400) [sessione 3, 08/06/2026]
- Build per concatenazione ordinata senza bundler (perché esbuild crasha nel container, per preservare il runtime babel-in-browser e l'apertura via file://) [sessione 3, 08/06/2026]
- Preambolo React condiviso (`const { createElement: h, useState, useEffect, useMemo } = React;`) collocato per intero in src/icons.js, primo file concatenato, così il binding è visibile a tutti i livelli successivi [sessione 6]
- Migrazione modulare completata e verificata a runtime: data/, logic/, ui/, components/, panels/ estratti dal seme; App.js ridotto alla sola orchestrazione [sessioni 4-7]
- Architettura dati evoluta da utente singolo a multi-utente: store remoto per utente via Supabase (auth + free tier) e hosting su GitHub Pages al posto di Netlify. Decisa, non ancora implementata; il prossimo passo operativo è la migrazione dell'hosting [sessione 8]

## Riferimenti

- Stato corrente, avanzamento della migrazione, questioni aperte e prossimo passo: stato.md
- Struttura e moduli del sorgente: src/
