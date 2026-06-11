// data/spesa.js
// Linee guida per la spesa settimanale (SPESA).
// Sole costanti: nessun React, nessuna dipendenza.

const SPESA = [
  {
    titolo: "Come riempire il carrello",
    colore: "#3a2818",
    emoji: "🛒",
    testo: "Riempi il carrello in questo ordine, tassello per tassello. Se arrivi alla cassa con tutti e 7 i punti coperti, la settimana è a posto. Varia almeno 2-3 alimenti per ogni categoria: la varietà fa girare i micronutrienti automaticamente.",
  },
  {
    titolo: "Foglia — 3-4 tipi diversi",
    colore: "#5a7a3c",
    emoji: "🌿",
    testo: "Quanto: una busta o mazzo abbondante per tipo, per arrivare a circa 10 porzioni settimanali in totale.\n\nEsempi: spinaci freschi o surgelati, rucola, cicoria o indivia, cavolo nero (kale), bieta, lattuga romana, valeriana.\n\nSurgelati ok: spinaci e bieta surgelati sono equivalenti al fresco per i nutrienti e durano tutta la settimana. Comprali come riserva.",
  },
  {
    titolo: "Colore — 5-6 colori diversi",
    colore: "#c97a4d",
    emoji: "🌈",
    testo: "Quanto: una porzione media per ogni colore, per circa 10 porzioni settimanali totali.\n\nRosso: pomodori (freschi o pelati), peperoni rossi.\nArancio: carote, zucca, peperoni arancioni.\nVerde non-foglia: zucchine, broccoli, cavolo cappuccio, fagiolini.\nViola: melanzane, cavolo rosso, radicchio.\nBianco: finocchi, cavolfiore, sedano rapa.\n\nTip: i peperoni crudi soddisfano anche il flag Vitamina C — comprane sempre qualcuno.",
  },
  {
    titolo: "Frutto — 5-7 tipi, almeno 14 pezzi",
    colore: "#a8456e",
    emoji: "🍎",
    testo: "Quanto: circa 2 frutti al giorno × 7 giorni = 14 pezzi. Mescola frutti grandi (1 = 1 porzione) e piccoli (1 manciata = 1 porzione).\n\nIncludin sempre: 1 tipo ricco di vitamina C (kiwi, agrumi, fragole) per il flag 🟡 Vit. C.\n\nEsempi: mele, pere, banane, kiwi, arance o mandarini, frutti di bosco (ottimi surgelati), uva, pesche o albicocche (stagione).\n\nFrutta surgelata: ottima per frullati, stessa qualità nutrizionale del fresco.",
  },
  {
    titolo: "Forza — 3-4 proteine diverse",
    colore: "#b03832",
    emoji: "💪",
    testo: "Quanto: 14 porzioni settimanali da suddividere tra le fonti. 1 fonte di legumi = circa 3-4 pasti.\n\nLegumi: compra sempre 2-3 tipi diversi (lenticchie rosse veloci, ceci, fagioli neri, piselli, azuki). In scatola ok se li sciacqui bene.\n\nTofu: 1-2 blocchi da 200g a settimana. Non contare sul tofu per il calcio: quello reperibile in Italia di norma non è coagulato col calcio. Il calcio prendilo da tahin, rucola e mandorle.\n\nTempeh: 1 panetto ogni 10-14 giorni è sufficiente per la varietà.",
  },
  {
    titolo: "Energia — 2-3 cereali integrali",
    colore: "#8b6332",
    emoji: "🌾",
    testo: "Quanto: compra in formato da 500g-1kg, basta per 1-2 settimane.\n\nRegola: almeno 2 tipi diversi per settimana, così non mangi sempre la stessa pasta.\n\nEsempi: pasta integrale, riso integrale o basmati, farro perlato, orzo, avena (per colazione), quinoa, pane integrale di forno (o di panificio, meglio).\n\nTip: l'avena in fiocchi a colazione vale come Energia e si abbina perfettamente a Granello e Frutto — è uno dei pasti più veloci da preparare.",
  },
  {
    titolo: "Oro — calorie accessorie",
    colore: "#b88824",
    emoji: "🫒",
    testo: "L'Oro non è 'i grassi'. È tutto ciò che entra nel piatto ma non costruisce, non protegge e non nutre in modo diretto.\n\nCi cadono dentro: olio di condimento, formaggi, alcol, dolci, grassi di cottura. Non è da eliminare — è da misurare, perché è facile riempire il piatto di Oro senza accorgersene.\n\nLa differenza con il Granello: il Granello è grasso funzionale (acidi grassi essenziali, vitamina E, minerali). L'Oro è caloria accessoria. Stessa categoria nutrizionale di base, filosofia opposta.\n\nPer l'olio: 3 cucchiai/giorno = circa 300ml a settimana. Una bottiglia da 750ml dura 2-3 settimane. Compra di qualità: oli di frantoio con anno del raccolto — la differenza nei polifenoli è reale.",
  },
  {
    titolo: "Granello — noci e semi",
    colore: "#6b8a8a",
    emoji: "🌰",
    testo: "Quanto: 7 cucchiai a settimana. Una confezione da 150-200g dura 2-3 settimane.\n\nRuota tra fonti diverse:\n· Semi di lino: macina al momento o compra già macinati (frigo). 🟡 Omega-3 automatico.\n· Semi di chia: in frigo ammollati, su yogurt o porridge. 🟡 Omega-3.\n· Noci: 4-5 noci = 1 porzione. 🟡 Omega-3.\n· Mandorle: buona fonte di calcio e vit. E. Complemento per il flag 🦴.\n· Tahin: pasta di sesamo, ottimo su verdure o come condimento. 🟡 Calcio (complemento).\n· Semi di zucca: ricchi di zinco e magnesio.\n· Noci del Brasile: fonte eccezionale di selenio. 1-2 noci al giorno bastano — non superare.",
  },
  {
    titolo: "🟡 Checklist flag settimanale",
    colore: "#b88824",
    emoji: "🟡",
    testo: "Prima di chiudere la spesa, verifica:\n\n✓ Vitamina C: hai kiwi, agrumi o fragole tra i frutti? Hai peperoni da mangiare crudi vicino ai pasti con legumi?\n\n✓ Omega-3: hai semi di lino o chia? Hai noci? Hai alghe (nori/wakame) in dispensa?\n\n✓ Calcio: hai latte di soia o avena addizionato con calcio (Ca ≥120mg/100ml in etichetta)? Oppure bevi acqua calcica (Ferrarelle, Contrex)? Queste sono le fonti primarie — tahin, rucola e mandorle completano ma da soli non bastano.\n\nSe sì a tutto, i tre flag possono andare verdi questa settimana senza pensarci più.",
  },
  {
    titolo: "Dispensa permanente (rinnova quando finisce)",
    colore: "#3a2818",
    emoji: "📦",
    testo: "Questi durano mesi e non devi ricomprarli ogni settimana:\n\nLegumi secchi: lenticchie, ceci, fagioli in pacco da 500g.\nCereali: avena, quinoa, riso integrale.\nConserve: pelati, passata, ceci/fagioli in scatola di riserva.\nSemi: lino (macinato e conservato in frigo), chia, zucca, girasole.\nFrutta secca: noci, mandorle.\nTahin: vasetto da 250-300g.\nOlio EVO: almeno una bottiglia di scorta.\nAlghe: nori in fogli, spirulina in polvere.\nAcqua calcica: se la bevi, prendila con Ca ≥250 mg/L.",
  },
  {
    titolo: "Esempio: giornata feriale",
    colore: "#5a7a3c",
    emoji: "🍽️",
    testo: "Descrive una giornata possibile, non un piano da seguire: serve a vedere come i tasselli si distribuiscono nei pasti reali.\n\nColazione: 1 fetta di pane con burro di nocciole o di arachidi, banana a rondelle e un goccio di sciroppo d'acero, più un bicchiere di latte di soia e uno yogurt di soia. Conta: 1 Energia + 1 Granello + 1 Frutto + 1 Forza (le due fonti complementari da 0,5 si sommano). Il goccio di sciroppo (un cucchiaino) si arrotonda a zero.\n\nPranzo: piatto unico di farro e ceci con verdure colorate saltate e un cucchiaio d'olio. Conta: 1 Energia + 1 Forza + 1 Colore + 0,5 Oro.\n\nCena: pane, insalata abbondante (qui si abbonda: lo sforo è libero), una verdura colorata, hummus o lupini come tocco proteico, olio a crudo. Conta: 1 Energia + 1,5 Foglia + 1 Colore + 0,5 Forza + 1 Oro.\n\nSpuntino: un frutto. Conta: 1 Frutto.\n\nTotali: Energia 3 (al tetto), Forza 2,5, Foglia 1,5 (e più ne metti meglio è), Colore 2, Frutto 2, Oro 1,5, Granello 1 cucchiaio. Giornata chiusa senza calcoli.",
  },
  {
    titolo: "Esempio: giornata con pranzo fuori",
    colore: "#c97a4d",
    emoji: "🍴",
    testo: "Il pranzo fuori casa (ristorante, parenti) non si pianifica: si valuta con la regola dei quarti o col classificatore, e la cena compensa.\n\nColazione: come la giornata feriale (1 Energia + 1 Granello + 1 Frutto + 1 Forza).\n\nPranzo fuori, esempio reale: una fetta di torta rustica con verdure e tofu vale circa 1 Energia + 1 Oro + 0,5 Foglia + 0,5 Colore + 0,5 Forza. Se c'è anche un dolce piccolo, aggiungi 0,5 Energia + 0,5 Oro. Non serve precisione al grammo: serve una stima onesta in 10 secondi.\n\nCena che compensa: verdure in abbondanza (1 Foglia + 1 Colore), una Forza densa (legumi o tofu, 1 Forza), poco o niente pane se il pranzo era ricco di Energia, e Oro fermo: il pranzo fuori ne porta sempre più del previsto.\n\nSpuntino: un frutto.\n\nIl principio: la giornata si bilancia sull'arco delle 24 ore, e se sfori c'è la finestra di compensazione sui 3 giorni. Un pranzo fuori non rompe niente.",
  },
  {
    titolo: "Esempio: cena pizza e birra",
    colore: "#b03832",
    emoji: "🍕",
    testo: "La serata pizzeria è la classica giornata che sfora: l'esempio serve a mostrare che si gestisce, non si evita. La regola è alleggerire il resto della giornata, non rinunciare alla pizza.\n\nColazione e pranzo leggeri: punta su Foglia, Colore, Frutto e una Forza densa, tenendo Energia e Oro bassi per lasciare spazio alla sera. Esempio: colazione con yogurt di soia e frutto (0,5 Forza + 1 Frutto), pranzo con insalatona di legumi, verdure colorate e poco olio (1 Forza + 1,5 Foglia + 1 Colore + 0,5 Oro). A metà giornata: 1 Energia + 2,5 Forza + 1,5 Foglia + 1 Colore + 1 Frutto + 0,5 Oro.\n\nCena in pizzeria: 1 pizza tonda alla parmigiana = 2 Energia (base intera, doppia delle 2 fette) + 1 Colore (le melanzane) + 2 Oro (mozzarella, parmigiano, olio di frittura delle melanzane: è una pizza ricca). 1 birra piccola (0,2L) = 0,5 Oro.\n\nTotali della giornata: Energia 3 (al tetto, giusto), Forza 2,5, Foglia 1,5, Colore 2, Frutto 1, Oro 3.\n\nLettura onesta: l'Oro a 3 sfora il target di 2, ma resta dentro il softMax di 5 e dentro la finestra di compensazione dei 3 giorni. Frutto a 1 è sotto: recuperabile l'indomani. Tutto il resto è in linea. Una pizza con birra non è uno strappo se la giornata le ha fatto spazio: è il metodo che funziona come deve.",
  },
];
