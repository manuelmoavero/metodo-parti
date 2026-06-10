// data/classificatore.js
// Albero decisionale del classificatore guidato (CLASSIFICATORE).
// Sole costanti: nessun React, nessuna dipendenza.
//
// Struttura: nodi con domanda e opzioni. Ogni opzione può:
//   - next: id del nodo successivo, oppure "qty" (passo quantità) o "esito"
//   - add: tasselli da accumulare (es. { energia: 1 })
//   - factor: moltiplicatore di dimensione (ramo preparazioni fuse)
//   - unit: il riferimento di quantità mostrato nel passo finale
//   - hint: esempi concreti sotto l'etichetta
// I nodi possono avere una "nota" mostrata sotto la domanda.

const CLASSIFICATORE = {
  start: "tipo",
  nodes: {

    // ── Bivio iniziale ──────────────────────────────────────────────
    tipo: {
      domanda: "Cosa devi valutare?",
      nota: "Prima troviamo il tassello, poi la quantità. Nel dubbio tra due strade simili, scegli e vai: il metodo regge l'approssimazione.",
      opzioni: [
        { label: "Un alimento singolo", hint: "un frutto, una verdura, un ingrediente", next: "s_frutta" },
        { label: "Un piatto con componenti distinguibili", hint: "poke, pasta col sugo, zuppa, buddha bowl", next: "quarti" },
        { label: "Una preparazione fusa", hint: "torta, pizza ripiena, sformato, fritto, gateau", next: "c_dimensione" },
      ],
    },

    // ── Ramo 1: alimento singolo ────────────────────────────────────
    s_frutta: {
      domanda: "È frutta fresca?",
      opzioni: [
        { label: "Sì", next: "s_frutta_tipo" },
        { label: "No", next: "s_verdura" },
      ],
    },
    s_frutta_tipo: {
      domanda: "Che tipo di frutto?",
      opzioni: [
        { label: "Frutto grande", hint: "mela, arancia, banana, pera: 1 pezzo = 1 unità", add: { frutto: 1 }, unit: "1 frutto intero", next: "qty" },
        { label: "Frutti piccoli", hint: "fragole, ciliegie, uva, frutti di bosco", add: { frutto: 1 }, unit: "1 manciata", next: "qty" },
        { label: "Si taglia a fette", hint: "melone, anguria, ananas", add: { frutto: 1 }, unit: "2 fette medie", next: "qty" },
        { label: "Grassi dominanti", hint: "avocado, cocco: contano Oro, non Frutto", add: { oro: 1 }, unit: "mezzo avocado o 1 fetta di cocco", next: "qty" },
      ],
    },
    s_verdura: {
      domanda: "È una verdura o un ortaggio?",
      opzioni: [
        { label: "Sì", next: "s_verdura_tipo" },
        { label: "No", next: "s_amido" },
      ],
    },
    s_verdura_tipo: {
      domanda: "Com'è fatta?",
      nota: "Il dubbio Foglia/Colore non costa nulla: hanno gli stessi target e lo sforo è libero per entrambi. Scegli quello che ti sembra e vai avanti. L'unico bivio che conta è il terzo: se sazia come il pane, è Energia.",
      opzioni: [
        { label: "Leggera, acquosa, verde o bianca", hint: "lattuga, sedano, finocchio, cetriolo, germogli", add: { foglia: 1 }, unit: "un quarto di piatto", next: "qty" },
        { label: "Colore vivo o struttura compatta", hint: "carote, broccoli, melanzane, peperoni, funghi, topinambur", add: { colore: 1 }, unit: "un quarto di piatto", next: "qty" },
        { label: "Farinosa, sazia come il pane", hint: "patate, batate, platano", add: { energia: 1 }, unit: "un quarto di piatto (circa 150g, 2 patate piccole)", next: "qty" },
      ],
    },
    s_amido: {
      domanda: "È farinoso o amidaceo? Sazia come pane o pasta?",
      nota: "Cereali, pane, pasta, riso, polenta, couscous, ma anche pseudocereali come quinoa e grano saraceno: sembrano semi, sono Energia.",
      opzioni: [
        { label: "Sì", add: { energia: 1 }, unit: "un quarto di piatto, o 1 fetta di pane", next: "qty" },
        { label: "No", next: "s_proteina" },
      ],
    },
    s_proteina: {
      domanda: "È una fonte proteica?",
      opzioni: [
        { label: "Sì, densa", hint: "legumi, tofu, tempeh, seitan, pesce, 2 uova", add: { forza: 1 }, unit: "un quarto di piatto denso", next: "qty" },
        { label: "Sì, ma leggera", hint: "yogurt di soia, latte di soia: contano metà e non possono essere l'unica Forza del giorno", add: { forza: 0.5 }, unit: "1 vasetto o 1 bicchiere", next: "qty" },
        { label: "No", next: "s_granello" },
      ],
    },
    s_granello: {
      domanda: "È frutta secca, semi, o una crema 100%?",
      nota: "Noci, mandorle, semi di lino o chia, tahin, burro di arachidi senza zuccheri.",
      opzioni: [
        { label: "Sì", add: { granello: 1 }, unit: "1 cucchiaio, o 1 manciata piccola", next: "qty" },
        { label: "No", add: { oro: 1 }, unit: "1 cucchiaio (olio) o una porzione piccola", next: "qty" },
      ],
    },

    // ── Ramo 2: piatto con componenti distinguibili ─────────────────
    quarti: {
      domanda: "Usa la regola dei quarti",
      nota: "Guarda il piatto e dividilo a quarti con gli occhi: ogni quarto va al suo tassello. Esempio con un poke: il riso è 1 Energia, il tofu o il salmone è 1 Forza, l'avocado e le salse sono 0,5-1 Oro, le verdure colorate sono Colore. Somma ogni componente per quello che è. Se un componente ti lascia il dubbio, valutalo da solo qui sotto.",
      opzioni: [
        { label: "Valuta un componente singolo", next: "s_frutta" },
      ],
    },

    // ── Ramo 3: preparazione fusa (si parte dalla dimensione) ───────
    c_dimensione: {
      domanda: "Quanto è grande?",
      nota: "Nelle preparazioni fuse la dimensione conta quanto il contenuto: un arancino vale come due supplì.",
      opzioni: [
        { label: "Piccolo: sta nel palmo", hint: "supplì, pasticcino, tramezzino, mini quiche", factor: 0.5, next: "c_base" },
        { label: "Medio: una fetta o un pezzo da bar", hint: "trancio di pizza, fetta di torta, crocchetta grande", factor: 1, next: "c_base" },
        { label: "Grande: porzione piena", hint: "arancino siciliano, pizza ripiena intera, fetta abbondante", factor: 2, next: "c_base" },
      ],
    },
    c_base: {
      domanda: "Qual è la base?",
      nota: "La base è ciò che tiene insieme la preparazione e ne fa il volume.",
      opzioni: [
        { label: "Farinosa o amidacea", hint: "pasta, pane, farina, riso, patate: il caso più comune", add: { energia: 1 }, next: "c_ricco" },
        { label: "Proteica", hint: "uova, farina di ceci, tofu: frittate, tortilla, farinata, sformati di legumi", add: { forza: 1 }, next: "c_ricco" },
        { label: "Nessuna delle due", hint: "raro: sformato di sole verdure", next: "c_ricco" },
      ],
    },
    c_ricco: {
      domanda: "È dolce, fritto, o visibilmente ricco?",
      nota: "Creme, formaggio, molto olio, glasse: la ricchezza si paga in Oro, qualunque sia l'origine.",
      opzioni: [
        { label: "Sì", add: { oro: 1 }, next: "c_ripieno" },
        { label: "No, salato semplice", add: { oro: 0.5 }, next: "c_ripieno" },
      ],
    },
    c_ripieno: {
      domanda: "C'è un ripieno o condimento abbondante e visibile?",
      nota: "Conta solo se è una quota rilevante del pezzo, non una guarnizione.",
      opzioni: [
        { label: "Patate o altro amido", hint: "frittata di patate, torta di riso", add: { energia: 1 }, next: "esito" },
        { label: "Verdure a foglia", hint: "misticanza, spinaci, scarola", add: { foglia: 1 }, next: "esito" },
        { label: "Verdure colorate", hint: "zucca, peperoni, melanzane, pomodoro abbondante", add: { colore: 1 }, next: "esito" },
        { label: "Legumi o tofu", add: { forza: 1 }, next: "esito" },
        { label: "Pesce o uova", add: { forza: 1 }, next: "esito" },
        { label: "No, o solo formaggio", hint: "il formaggio è già contato nella ricchezza Oro", next: "esito" },
      ],
    },
  },
};

// Moltiplicatori del passo quantità (ramo alimento singolo).
const CLASSIFICATORE_QTY = [
  { label: "Metà", factor: 0.5 },
  { label: "1 porzione", factor: 1 },
  { label: "1 e mezza", factor: 1.5 },
  { label: "Doppia", factor: 2 },
];
