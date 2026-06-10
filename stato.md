# Stato corrente

Ultimo aggiornamento: [10/06/2026 - sessione 11]

## 1. Decisioni prese [sessione 11]

Sessione di implementazione backlog testuale e logico. Completati in un unico passaggio: M1, M2, M5, M6, M7 (parziale guida + completamento prontuario), A2, A3.

**Completati:**
- **M1** (B12): dose corretta in flags.js e guida.js. Due opzioni: 2×1000µg o 1×2000-2500µg/settimana.
- **M2** (Calcio): fonte primaria quotidiana promossa in flags.js, guida.js, spesa.js, prontuario.js. Latte di soia/avena addizionato e acqua calcica come anchor; rucola/mandorle/tahin come complementi.
- **M5** (Alcol): sezione "🍷 Alcol — conversioni in Oro" aggiunta in prontuario.js. Vino 125ml=1 Oro, birra 330ml=1,5 Oro, birra 500ml=2 Oro, superalcolico 40ml=1 Oro, prosecco 100ml=0,5 Oro. Nota trigliceridi esplicita.
- **M6** (Vitamina C timing): testi flag vitc e guida orientati al pasto con legumi, non genericamente al giorno.
- **M7** (Compositi): pasta/farina di legumi (1 Forza + 0,5 Energia) in prontuario.js; regola piatti misti (poke, sushi, zuppe) in guida.js; nota selenio noci del Brasile in guida.js.
- **A2** (Casi difficili): sezione "🔀 Casi difficili — compositi e piatti misti" aggiunta in prontuario.js con 8 voci: poke, sushi, zuppa legumi+cereali, buddha bowl, frullato proteico, hummus come piatto, burger vegano, granola.
- **A3** (Ferro+C contestuale): tip in suggestions.js — se oggi forza ≥ 0,5 e flag vitc non tappato, mostra suggerimento morbido (urgency: low). Parametro opzionale `todayFlags` aggiunto a suggestions() e SuggestionsPanel; App.js aggiornato per passarlo.

**File modificati in sessione 10+11:**
- flags.js (M1, M2, M6)
- guida.js (M1, M2, M6, M7 parziale)
- spesa.js (M2)
- prontuario.js (M2 latte soia, M5, M7, A2)
- suggestions.js (A3)
- SuggestionsPanel.js (A3 — nuova prop todayFlags)
- App.js (A3 — passa todayFlags a SuggestionsPanel)

## 2. Stato attuale e vincoli

- **Architettura:** migrazione modulare COMPLETATA e verificata a runtime. Sorgente in src/ per livello: icons.js, data/ (5 file), logic/ (5), ui/SlidePanel.js, components/ (5), panels/ (4); App.js solo orchestrazione, 570 righe. build.sh concatena 22 file in ordine di dipendenza e genera index.html. Struttura e motivazioni in design-doc.md.
- **Build:** niente bundler; esbuild crasha (SIGSEGV nel container, non usarlo); verifica JSX con Babel preset react; index.html è artefatto generato; deve restare apribile via file:// e static serve.
- **Workflow:** si lavora solo in chat. /mnt/project (design-doc.md, stato.md e i sorgenti) sono copie read-only: i file prodotti vanno reincollati a mano nel knowledge base. File aggiornati prodotti in questa sessione: prontuario.js, suggestions.js, SuggestionsPanel.js, App.js, stato.md.
- **Profilo utente (analisi aprile 2026):** trigliceridi 233 (elevati), colesterolo totale 262, LDL 170 (elevato), HDL 47 (sotto ottimale), glicemia 104 (limite), azotemia 24 (lievemente alta, ma creatinina 0,82 e GFR 108 normali), colinesterasi alta, ferritina 23 (bassa-normale), sideremia 74. In terapia con atorvastatina 20mg/die. Integra: omega-3 microalghe nu3 (DHA 1158 + EPA 579 + vit D 20µg/die) ogni giorno; B12 1000µg/2 volte a settimana oppure 2000-2500µg/1 volta a settimana; combinato WeightWorld 2-3 volte/settimana (schema in dispensa).
- **Prossime analisi tra circa 2 mesi.** Da aggiungere al pannello: zinco sierico, 25-OH vitamina D, omocisteina, insulina a digiuno, TSH. M2 (calcio) e M1 (B12) sono temi da portare al medico in quella sede.
- **Lacune nutrizionali in ordine:** (1) zinco, non misurato, probabilmente carente; (2) vitamina D, integrata ma non misurata; (3) calcio, parzialmente affrontato con M2; (4) adeguatezza proteica da verificare; (5) iodio, risolto con sale iodato.

## 3. Regole permanenti

- Testi autosufficienti: ogni nota e label in app deve bastare da sola, senza ricerche esterne.
- Flag affidabili vs condizionati: un cibo accende un flag (icona nel valore + auto-toggle) solo se la riga del prontuario lo garantisce sempre; altrimenti nota scritta, niente icona e niente toggle.
- Un intervento per commit: ogni passo ha perimetro preciso e validato; l'index.html concatenato deve restare funzionante.
- Preferenza di stile dell'utente: non usare il carattere trattino lungo seguito da spazio nei testi.
- **Perimetro del prodotto [sessione 10]:** il metodo è un sistema intuitivo di bilanciamento dell'alimentazione, NON un sistema per fare la dieta. La personalizzazione quantitativa (taglie, profili, fabbisogni individuali) è ambito dei nutrizionisti, non dell'app. Le parti sono bilanciate relativamente tra loro: a scalare con la persona è la dimensione del piatto di riferimento, non i target.

## 4. Decisioni precedenti ancora in vigore (sintesi)

- Granello softMax 14 cucchiai/7gg: segnale di eccesso sopra soglia, motivazione lipidica [sessione 3].
- Energia softMin 1, finestra 3 giorni, avviso morbido a urgenza crescente [sessione 8].
- localStorage cleanup al mount: rimuove chiavi che non iniziano con parti_day: o parti_flag:, idempotente [sessione 2].
- PilastriPanel e InfoPanel rimossi; i dati PILASTRI e INFO_SEZIONI restano, usati da GuidaPanel [sessione 2].
- Zinco e iodio non sono flag (zinco via integratore/dieta, iodio via sale iodato) [sessioni precedenti].
- Integratori NON tracciati nell'app, solo nota in dispensa [sessione 9].

## 5. Questioni ancora aperte

- Infrastruttura: migrazione da Netlify a GitHub Pages. Priorità alta, propedeutica allo store remoto (Netlify abbandonato: banda mensile esaurita).
- Infrastruttura: store remoto multi-utente via Supabase free tier. Da fare dopo l'hosting; A5 ridotta (target in configurazione per-utente) va fatta prima dello store.
- Design: A1 (classificatore guidato) e A6 (giornate tipo) approvati come direzione ma da studiare in dettaglio prima di implementare. Tenuti fuori dalla sessione 11.
- Architettura: Fase 5 (split di App.js tra handler e rendering). Backlog, bassa priorità.
- Contenuto: voci della spesa con 🟡 da rivedere. Bassa priorità.
- Nutrizione: adeguatezza del target Forza (2 parti). Resta in backlog; da verificare col medico.

## 5 bis. Fuori scopo dichiarato [sessione 10] (DA TRASFERIRE nel design-doc come sezione stabile)

Proposte valutate e respinte perché oltre l'obiettivo dell'app. Si conservano come confine di prodotto, non come backlog:

- **M3, taglie/profili (S-M-L sui target).** Respinta. Le parti sono già bilanciate relativamente tra loro; a scalare con la persona è la dimensione del piatto di riferimento. Introdurre profili quantitativi trasformerebbe il metodo in un sistema dietetico, che è ambito dei nutrizionisti.
- **M4, sezione esclusioni cliniche in Guida** (diabete insulino-trattato, nefropatie, gravidanza, minori, DCA). Respinta per la stessa ragione: il metodo non si propone come strumento clinico e non deve assumerne le responsabilità comunicative. Gli edge case restano noti e documentati qui.
- **A4, toggle e trasparenza del motore di compensazione.** Respinta come sopra: legata al rischio DCA, che è fuori dal perimetro dichiarato del prodotto.

## 6. Impatto sul design-doc

Due aggiunte ancora pendenti dal design-doc: (1) sezione "Fuori scopo dichiarato" (punto 5 bis); (2) regola di perimetro "bilanciamento, non dieta; scala il piatto, non i target". Nessuna modifica architetturale in questa sessione.

## 7. Prossimo passo concreto

**Infrastruttura:** migrazione da Netlify a GitHub Pages. È il collo di bottiglia principale: senza deploy funzionante il resto non è verificabile in produzione. Poi A5 ridotta (target in configurazione per-utente) prima di Supabase.

