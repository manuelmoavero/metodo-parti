// data/guida.js
// Contenuto testuale della Guida: PILASTRI, INTERAZIONI, INFO_SEZIONI.
// Sole costanti: nessun React, nessuna dipendenza.

const PILASTRI = [
  {
    id: "regola-piatto",
    title: "La regola visiva del piatto",
    icon: "🍽",
    body: "A pranzo e cena visualizza il piatto diviso in quarti: metà alle verdure (Foglia + Colore), un quarto alla Forza, un quarto all'Energia. Con questa proporzione tutti i target giornalieri si coprono quasi automaticamente senza calcoli.",
  },
  {
    id: "soglia-proteica",
    title: "La soglia dell'8% per la Forza",
    icon: "🛡",
    body: "Un alimento conta come Forza piena solo se ha ≥8g di proteine per 100g. Sotto quella soglia conta al massimo come 0,5 Forza complementare.\n\nForza densa (≥8g/100g): legumi, tofu, tempeh, seitan, uova, pesce, formaggi.\nForza complementare (5-8g/100g): yogurt greco di soia, latte di soia, hummus.\nNon conta come Forza: latte di avena, latte di riso, mozzarella vegana industriale — troppo sotto soglia.\n\nRegola pratica: almeno 1 delle 2 porzioni giornaliere di Forza deve essere una fonte densa. Yogurt e latte di soia contano ma non possono essere l'unica Forza del giorno.",
  },
  {
    id: "granello-vs-oro",
    title: "Granello vs Oro — grassi funzionali vs calorie accessorie",
    icon: "⚖️",
    body: "Entrambi contengono grassi, ma la logica è opposta.\n\nGranello: grassi insaturi concentrati + micronutrienti reali (omega-3, vitamina E, calcio, magnesio). Piccole quantità con alta densità nutrizionale. Da raggiungere ogni settimana.\n\nOro: calorie che entrano nel piatto senza costruire, proteggere o nutrire in modo diretto. Olio di condimento, alcol, formaggi, dolci, grassi di cottura. Da misurare perché è facile accumularne senza accorgersene.\n\nEsempio: le mandorle sono Granello (omega-3, vitamina E, calcio). L'olio EVO è Oro (calorie accessorie, anche se buone).\n\nNota selenio: le noci del Brasile sono una fonte eccezionale di selenio. 1-2 noci al giorno bastano a coprire il fabbisogno: non superare questa quantità perché il selenio in eccesso è tossico.",
  },
  {
    id: "costo-doppio",
    title: "La penale degli ultra-trasformati",
    icon: "⚠",
    body: "Se la lista ingredienti è lunga (7+ elementi, additivi, oli idrogenati, zuccheri aggiunti), la penale è sempre +0,5 Oro, indipendentemente dal tassello base.\n\nEsempi:\nCornetto da bar → 1 Energia + 0,5 Oro (penale)\nBiscotti industriali → 1 Energia + 0,5 Oro (penale)\nHamburger vegano → 1 Forza + 0,5 Oro (penale) + eventuale 0,5 Oro base\nPatatine fritte → 1 Energia + 1,5 Oro (1 base grasso + 0,5 penale)\n\nPerché Oro? Gli ultra-trasformati hanno sempre grassi nascosti (olio di palma, margarina, frittura). La penale va dove appartiene: alle calorie accessorie.",
  },
  {
    id: "ancora-sazieta",
    title: "L'ancora della sazietà",
    icon: "🌿",
    body: "In caso di fame improvvisa fuori dai pasti, il tassello Foglia non ha limite: finocchi, sedano, carote crude, cetrioli, insalata. Volume illimitato senza impatto su nessun target.\n\nLa Foglia funziona da ancora perché il volume riempie lo stomaco e le fibre rallentano lo svuotamento gastrico, azzerando la fame emotiva senza contribuire a sfori.",
  },
  {
    id: "idratazione",
    title: "L'idratazione invisibile",
    icon: "💧",
    body: "Un bicchiere d'acqua prima di ogni pasto. Il corpo confonde spesso la disidratazione con la fame: bere prima riduce le porzioni in modo naturale.\n\n8 bicchieri totali al giorno tra acqua, tè e tisane non zuccherate. Se bevi acqua calcica (Ferrarelle, Contrex ≥250mg/L di Ca) contribuisce silenziosamente al flag 🦴.",
  },
  {
    id: "iodio",
    title: "Iodio: basta il sale iodato",
    icon: "🧂",
    body: "Il fabbisogno di iodio è 150 µg al giorno. Con un uso regolare di sale iodato in cucina (3-5g) si copre senza bisogno di monitoraggio attivo.\n\nControlla l'etichetta: il sale marino e quello himalayano non contengono iodio aggiunto. Solo il sale esplicitamente etichettato come \"iodato\" garantisce la dose.\n\nLe alghe nori ne contengono, ma in quantità imprevedibili (da 16 µg a oltre 2.000 µg per foglio a seconda dell'origine): non sono una fonte affidabile. Le alghe kelp e kombu possono portare a un eccesso.",
  },
  {
    id: "vitd",
    title: "Vitamina D: monitora in inverno",
    icon: "☀️",
    body: "La vitamina D non si ricava dalla dieta in quantità significativa, nemmeno da quella onnivora. La produce il corpo con l'esposizione solare.\n\nIn inverno (ottobre-aprile) alle latitudini italiane la produzione è quasi zero. Il tuo medico ha già richiesto il test del 25-OH vitamina D agli esami di controllo: appena hai il risultato, valuta con lui se integrare.\n\nNota: l'olio di microalghe nu3 che stai già prendendo per gli omega-3 contiene 20µg di vitamina D per dose giornaliera.",
  },
];

// ============================================================
// INTERAZIONI — Sinergie e blocchi nutrizionali
// ============================================================

const INTERAZIONI = [
  {
    verb: "Potenzia",
    subtitle: "insieme valgono di più",
    color: "#5a7a3c",
    items: [
      {
        title: "Ferro vegetale + Vitamina C",
        body: "Assorbimento ×3-4. Aggiungi limone, peperone crudo, kiwi o arancia nello stesso pasto dei legumi. La sinergia più importante per chi ha ferritina bassa.",
      },
      {
        title: "Carotenoidi + grassi",
        body: "Carote, zucca, peperoni e pomodoro rilasciano il betacarotene solo con un grasso. Un filo d'olio EVO, avocado o semi sono sufficienti: senza non vengono assorbiti.",
      },
      {
        title: "Licopene + cottura con grassi",
        body: "La salsa di pomodoro cotta con olio rilascia più licopene del pomodoro crudo scondito. Cottura e grasso moltiplicano la biodisponibilità.",
      },
      {
        title: "Vitamina E + Omega-3",
        body: "La vitamina E protegge gli omega-3 (e le LDL) dall'ossidazione. Abbina mandorle a semi di lino o noci nello stesso giorno.",
      },
      {
        title: "Curcuma + pepe nero",
        body: "La piperina del pepe nero aumenta la biodisponibilità della curcumina fino a ~20 volte. La curcumina è liposolubile: aggiungi anche un filo d'olio.",
      },
    ],
  },
  {
    verb: "Blocca",
    subtitle: "si annullano a vicenda",
    color: "#b03832",
    items: [
      {
        title: "Caffè e tè + ferro",
        body: "I tannini bloccano l'assorbimento del ferro vegetale entro 1h dal pasto. Con ferritina bassa è critico: tieni il caffè lontano dai pasti con legumi.",
      },
      {
        title: "Ossalati + calcio",
        body: "Spinaci e biete bloccano il proprio calcio all'80-90% (ossalati). Non valgono per il flag 🦴: usa rucola, mandorle, tahin, cavolo nero o broccoli abbondanti.",
      },
      {
        title: "Fitati + minerali",
        body: "Legumi e cereali integrali riducono l'assorbimento di ferro, zinco e calcio. Si riduce del 50-80% con l'ammollo (vedi Attiva).",
      },
    ],
  },
  {
    verb: "Attiva",
    subtitle: "la preparazione sblocca i nutrienti",
    color: "#8b6332",
    items: [
      {
        title: "Semi di lino → macinare",
        body: "Interi passano senza rilasciare gli omega-3. Macina al momento o conserva già macinati in frigo: si ossidano rapidamente.",
      },
      {
        title: "Semi di chia → ammollare 15-20 min",
        body: "Il gel che si forma rilascia i nutrienti molto meglio dei semi secchi. Aggiungili in acqua o latte vegetale prima di usarli.",
      },
      {
        title: "Legumi → ammollo 8-12h",
        body: "Riduce i fitati del 50-80%, migliorando l'assorbimento di ferro e zinco. 24h con cambio acqua o germogliazione raddoppiano l'effetto.",
      },
    ],
  },
];

// ============================================================
// INFO — Come funziona l'app
// ============================================================

const INFO_SEZIONI = [
  {
    titolo: "Il sistema in 30 secondi",
    testo: "7 tasselli al giorno. Non conti calorie né grammi: riconosci a quale tassello appartiene quello che mangi e fai in modo di toccarli tutti entro sera. Ogni tassello ha un'unità di misura pratica — parti visive, pezzi interi, cucchiai — calibrata su porzioni normali.",
  },
  {
    titolo: "Come classificare un alimento",
    testo: "Applica queste domande nell'ordine:\n\n1. Ha amido ≥15g/100g e proteine <8g/100g? → Energia (cereali, pane, patate).\n2. Ha proteine ≥8g/100g? → Forza densa (legumi, tofu, pesce, uova). Tra 5-8g/100g → 0,5 Forza complementare (yogurt soia, latte soia).\n3. È una verdura verde o bianca, leggera, acquosa? → Foglia (lattuga, taccole, indivia, cetriolo, sedano).\n4. È una verdura con pigmenti vivaci o micronutrienti specifici? → Colore (carote, peperoni, zucchine, melanzane, pomodori, broccoli).\n5. È frutta fresca intera? → Frutto. Se ha grassi dominanti (avocado) → Oro.\n6. È frutta secca, semi, creme 100%? → Granello (grassi funzionali + micronutrienti).\n7. Tutto il resto — olio, formaggi, alcol, dolci, grassi di cottura → Oro (calorie accessorie).\n\nCompositi di confine:\n· Pasta o farina di legumi (es. pasta di ceci, di lenticchie): 1 Forza + 0,5 Energia — ha le proteine dei legumi ma anche l'amido del formato pasta.\n· Piatti misti (poke, sushi, zuppe legumi + cereali, buddha bowl): somma i componenti visibili a quarti di piatto. Il riso del poke vale Energia, il tofu vale Forza, l'avocado vale Oro: conta ognuno per quello che è.",
  },
  {
    titolo: "I 7 tasselli e i loro target",
    testo: "Energia (max 3 parti): carboidrati complessi strutturali — cereali, pane, patate. Tetto, non obiettivo.\nForza (2 parti min): proteine dense — legumi, tofu, tempeh, seitan, uova, pesce. Almeno 1 delle 2 parti deve essere una fonte primaria: yogurt e latte di soia contano ma non possono essere l'unica Forza.\nFoglia (min 1,5 parti): verdure leggere a foglia o struttura acquosa. Sforo libero.\nColore (min 1,5 parti): verdure con pigmenti antiossidanti o micronutrienti specifici. Sforo libero.\nFrutto (min 2 unità): frutta fresca intera con fibra intatta.\nOro (2 cucchiai target, max 5): calorie accessorie — olio, formaggi (animali e vegetali), alcol, dolci, grassi di cottura. Non è da eliminare, è da misurare.\nGranello (7 cucchiai negli ultimi 7 giorni): grassi funzionali — noci, semi, mandorle. Rolling, non settimanale fisso.",
  },
  {
    titolo: "Cos'è una parte",
    testo: "Una parte = un quarto di piatto fisico. Frutto si conta in pezzi interi. Oro e Granello in cucchiai. Il tap + aggiunge 0,5 parti per Energia, Forza, Foglia e Colore; 1 unità per Frutto; 0,5 cucchiai per Oro; 1 cucchiaio per Granello. Approssima alla porzione più vicina: non serve la bilancia.",
  },
  {
    titolo: "Il pannello Cosa ti manca",
    testo: "Si aggiorna in tempo reale. I pallini indicano l'urgenza: rosso = tassello critico o secondo giorno consecutivo in difetto, giallo = primo giorno sotto o parzialmente coperto, grigio = nota informativa. Quando tutti i tasselli sono chiusi mostra solo 'Giornata chiusa'.",
  },
  {
    titolo: "Se sfori",
    testo: "Energia: l'app abbassa automaticamente il target dei giorni successivi e spalma il rientro fino a 5 giorni. Forza: abbassa di 0,5 il giorno dopo, mai sotto 1,5 parti. Oro: se ieri hai superato i 2 cucchiai, oggi l'app ti ricorda di restare vicino al target. Foglia e Colore: non esiste sforo, più ne mangi meglio è. Frutto: sopra 4 frutti dolci il giorno dopo resta a 1.",
  },
  {
    titolo: "Il Granello è rolling",
    testo: "Il Granello si conta sugli ultimi 7 giorni in continuo, non sulla settimana lunedì-domenica. Se oggi aggiungi 2 cucchiai, il contatore mostra il totale degli ultimi 7 giorni incluso oggi. Il - riduce solo il contributo di oggi.",
  },
  {
    titolo: "I flag micronutrizionali",
    testo: "4 flag sotto il Granello. Si tappano quando consumi una fonte sufficiente. Se li salti troppo a lungo l'app ti avvisa.\n\n🍋 Vitamina C: kiwi, agrumi, fragole, peperoni crudi. Avviso dopo 3 giorni. Fondamentale nello stesso pasto dei legumi: moltiplica per 3-4x l'assorbimento del ferro vegetale. Un limone sulla zuppa di lenticchie vale più di un integratore.\n🌿 Omega-3: semi di lino macinati, chia, noci, alghe. Avviso dopo 4 giorni. L'olio di microalghe copre EPA e DHA direttamente.\n🦴 Calcio: 1 fonte primaria al giorno (latte di soia o avena addizionato, acqua calcica ≥250mg/L) + fonti complementari (rucola, tahin, mandorle, broccoli abbondanti). Avviso dopo 4 giorni. Spinaci e biete NON contano: gli ossalati bloccano l'assorbimento.\n💊 B12: 1 compressa da 1000µg 2 volte a settimana, oppure 1 compressa da 2000-2500µg una volta a settimana. Avviso dopo 8 giorni.",
  },
  {
    titolo: "Lo storico",
    testo: "Il bottone calendario mostra gli ultimi 14 giorni con barra di completamento (verde ≥85%, giallo ≥60%, rosso sotto). Tocca un giorno passato per modificarlo retroattivamente.",
  },
  {
    titolo: "Il prontuario",
    testo: "Il bottone libro apre il prontuario con ricerca: scrivi un alimento per sapere in quale tassello va e quanto vale. Le sezioni del flag 🦴 Calcio, 🌿 Omega-3 e 🍋 Vitamina C listano le fonti specifiche con i valori nutrizionali.",
  },
  {
    titolo: "I dati sono tuoi",
    testo: "Tutto è salvato localmente nel browser del tuo telefono. Non c'è server, non c'è login, non si sincronizza tra dispositivi. Se cancelli i dati del sito dalle impostazioni del browser, lo storico viene perso.",
  },
];
