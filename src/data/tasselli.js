// data/tasselli.js
// I 7 tasselli del Metodo (TASSELLI) e il Granello settimanale (GRANELLO).
// Sole costanti: nessun React, nessuna dipendenza.

// The 7 tasselli of "Il Metodo delle Parti"
const TASSELLI = [
  {
    id: "energia",
    label: "Energia",
    sub: "cereali, pane, patate",
    unit: "parti",
    target: 3,
    isMax: true,        // target is a ceiling, not a floor
    softMin: 1,         // floor nutrizionale: sotto 1 parte avviso morbido (finestra 3 giorni)
    step: 0.5,
    color: "#8b6332",
    bg: "#f4e8d6",
    help: "Tutto a base di cereali o farina: pasta, riso, pane, pizza, focaccia, prodotti da forno, fiocchi di avena, cereali per colazione. È un tetto (max 3), non un obiettivo da riempire. Attenzione ai compositi: pizza e cornetti portano anche Oro per i grassi. Preferisci sempre gli integrali, hanno più magnesio, zinco e vitamine B.",
  },
  {
    id: "forza",
    label: "Forza",
    sub: "legumi, tofu, uova, pesce",
    unit: "parti",
    target: 2,
    softMin: 1.5,
    softMax: 2.5,
    step: 0.5,
    color: "#b03832",
    bg: "#f4dad8",
    help: "Proteine dense: legumi, tofu, tempeh, seitan, uova, pesce. Almeno 1 delle 2 porzioni deve essere densa: yogurt e latte di soia contano solo 0,5 e da soli non bastano. Con i legumi aggiungi vitamina C nello stesso pasto (limone, peperone): l’assorbimento del ferro si moltiplica per 3-4.",
  },
  {
    id: "foglia",
    label: "Foglia",
    sub: "verdure a foglia verde",
    unit: "parti",
    target: 1.5,
    isMin: true,
    step: 0.5,
    color: "#5a7a3c",
    bg: "#dde6cf",
    help: "Verdure leggere e acquose, verdi o bianche: insalata, spinaci, cetriolo, finocchio, taccole. Servono a fare volume, sforo libero: più ne mangi meglio è. Le verdure colorate vanno nel Colore, non qui. Spinaci e biete valgono come Foglia ma non per il calcio, gli ossalati lo bloccano.",
  },
  {
    id: "colore",
    label: "Colore",
    sub: "verdure colorate",
    unit: "parti",
    target: 1.5,
    isMin: true,
    step: 0.5,
    color: "#c97a4d",
    bg: "#f4ddcd",
    help: "Verdure con pigmenti vivaci e micronutrienti specifici: carote, zucca, peperoni, pomodoro, zucchine, melanzane, broccoli. Sforo libero come la Foglia. Condiscile sempre con un filo d’olio: carotenoidi e licopene sono liposolubili, senza grassi non si assorbono.",
  },
  {
    id: "frutto",
    label: "Frutto",
    sub: "frutta fresca",
    unit: "unità",
    target: 2,
    softMax: 4,
    step: 0.5,
    color: "#a8456e",
    bg: "#f0d4dd",
    help: "Frutta fresca intera: la fibra tampona gli zuccheri. Sempre intera, mai in succo, è la fibra a fare la differenza. L’avocado non è qui, ha troppi grassi e va nell’Oro. Tieniti intorno a 2, oltre 4 frutti dolci diventa troppo zucchero.",
  },
  {
    id: "oro",
    label: "Oro",
    sub: "calorie accessorie",
    unit: "cucchiai",
    target: 2,
    softMin: 1,
    softMax: 5,
    step: 0.5,
    color: "#b88824",
    bg: "#f4e4c0",
    help: "Calorie accessorie: olio, formaggi, alcol, dolci, grassi di cottura. Non è da azzerare ma da misurare: serve un minimo (1) per assorbire le vitamine liposolubili, ma è facile accumularne senza accorgersene. Diverso dal Granello, che porta grassi funzionali: le mandorle sono Granello, l’olio è Oro.",
  },
];

// Granello has weekly target, handled separately
const GRANELLO = {
  id: "granello",
  label: "Granello",
  sub: "noci, mandorle, semi",
  unit: "cucchiai/sett",
  target: 7,
  softMax: 14,  // tetto morbido: sopra 14 cucchiai/7gg l'apporto calorico da grassi diventa eccessivo
  step: 1,
  color: "#6b8a8a",
  bg: "#d8e2e2",
  help: "Grassi funzionali e micronutrienti: noci, semi, mandorle. Si conta sugli ultimi 7 giorni in continuo, non a settimana fissa. Non intuitivi: cioccolato fondente >85%, tahin e burro di frutta secca 100% contano qui, non nell’Oro. Due trappole: i semi di lino vanno macinati e la chia ammollata, altrimenti passano interi senza rilasciare gli omega-3.",
};
