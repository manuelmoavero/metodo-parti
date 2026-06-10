# Routine di gestione contesto e costi
### Claude.ai (decisioni) + Claude Code (esecuzione)

## Il principio in una frase
La chat serve al pensiero vivo. I file vivi del progetto servono al sedimento delle decisioni. Paghi caro quando tieni il sedimento in sospensione dentro la chat invece di depositarlo fuori. E tieni sempre separato ciò che è stabile da ciò che è fluido: così la parte stabile la riusi a costo quasi zero e ripaghi solo il poco che cambia.

---

## 0. Setup iniziale (una volta per progetto)

Prima di tutto, decidi il tipo, perché il setup cambia:

- **Tema personale o strategico senza codice** (es. salute, ricerca lavoro): serve solo il Project.
- **App da sviluppare:** servono il Project più una cartella locale (il repo) per Claude Code.

**Passi comuni a entrambi:**

1. Crea il Project (su claude.ai/projects, o "Crea un progetto" da mobile). Ti chiede due campi:
   - **Nome ("Su cosa stai lavorando?"):** specifico e riconoscibile a colpo d'occhio. Meglio "Ricerca lavoro - Data Analyst" o "App fitness - backend" che "Lavoro" o "Progetto 1".
   - **Descrizione ("Cosa stai cercando di ottenere?"):** due o tre righe per inquadrare il progetto e ritrovarlo. Attenzione: questo campo serve da riferimento per te, non è ciò che guida le risposte di Claude. A modellare il comportamento sono le istruzioni del progetto, che imposti al passo 2.

   Scheletro per la descrizione:
   ```
   Progetto: [cosa è, in una riga].
   Obiettivo: [cosa voglio ottenere].
   Su cosa lavoreremo: [temi o aree principali].
   ```
2. Dopo averlo creato, apri le impostazioni del progetto e scrivi le istruzioni con lo scheletro I dell'appendice. Sono queste, non la descrizione, a guidare Claude in tutte le chat del progetto. Tienile corte: ruolo, contesto, vincoli, cosa non fare.
3. Crea i due file vivi nel knowledge base: design-doc.md (stabile) e stato.md (fluido). All'inizio sono scheletri quasi vuoti, e va bene. Due modi per riempirli:
   - Se hai già le idee chiare, parti dagli scheletri qui sotto e compilali.
   - Se non hai ancora chiaro, fai una prima chat di brainstorming e, alla chiusura, usa il prompt di distillazione (A) per generare il primo contenuto. In pratica il primo giro della routine È il setup dei contenuti: non devi avere tutto chiaro all'inizio.
4. Consigliato, visto che hai il Drive connesso: tieni design-doc.md e stato.md come Google Doc e collegali al Project. Da quel momento li modifichi una volta sola e il Project vede l'aggiornamento, senza re-upload.

**Passi in più solo per le app:**

5. Crea la cartella del repo in locale, dove girerà Claude Code.
6. Crea il CLAUDE.md (scheletro sotto) con architettura, convenzioni e vincoli stabili. La prima volta puoi anche farlo scrivere a Claude Code dal pacchetto decisione, con il prompt C.
7. Crea un TODO.md (scheletro sotto) per stato e handoff.
8. Allinea: il CLAUDE.md deve rispecchiare le decisioni del design-doc.md. Sono lo stesso pensiero, su due piani diversi.

**Scheletri dei file iniziali:**

design-doc.md (Project, stabile)
```
# [Nome progetto] - Design Doc
## Visione
[una o due frasi: cosa è e a cosa serve]
## Macro-architettura
[componenti principali e come si parlano]
## Decisioni storiche
- [decisione] (perché) [chat NN]
## Riferimenti
- Per lo stato corrente vedi stato.md
```

stato.md (Project, fluido, lo sovrascrivi)
```
# Stato corrente
Ultimo aggiornamento: [data]
## Dove siamo
[due o tre righe]
## Decisioni recenti
-
## Questioni aperte
-
## Prossimo passo
-
```

CLAUDE.md (repo, immutabile, solo per le app)
```
# [Nome progetto]
## Architettura
[componenti, struttura cartelle, come gira]
## Convenzioni
[stile del codice, naming, pattern da seguire]
## Vincoli
[cosa non si tocca, dipendenze fisse, regole dure]
## Comandi
[come si builda, come si testa, come si avvia]

## Istruzioni di compaction
Quando comprimi il contesto, conserva: obiettivo corrente, decisioni e
vincoli, file cambiati, comandi di verifica, stato del deploy, blocchi aperti.
Scarta: log grezzi (a meno che una riga spieghi la causa di un errore) e i
tentativi falliti già superati.
```

TODO.md (repo, fluido, solo per le app)
```
# TODO / Stato
Ultimo aggiornamento: [data]
## Step corrente
[obiettivo dello step]
## Fatto
-
## Da fare
-
## Handoff ultima sessione
- File cambiati:
- Comandi e esito:
- Stato: cosa funziona, cosa no
- Rischio residuo:
- Prossima azione:
```

Da qui in poi parte il ciclo continuo descritto nelle sezioni seguenti.

---

## 1. La struttura a due piani

Separi due ruoli, come un director e un lead developer:

- **Claude.ai (Project) = piano strategico.** Brainstorming, analisi, scelte di architettura e di prodotto, trade-off, priorità. Alta astrazione, nessun codice caricato.
- **Claude Code = piano esecutivo.** Implementazione, debug, refactor, esecuzione. Legge e scrive i file veri del repo. Bassa astrazione.

Il ponte tra i due sono i file vivi: nel Project il design doc stabile e lo stato corrente, nel repo il CLAUDE.md (immutabile) e il TODO.md (stato). Le decisioni nascono nel piano strategico e scendono nei file del repo, che Claude Code legge per eseguire dentro quei vincoli.

**Regola per non sbagliare piano:**
> Se la risposta cambia un file, è Claude Code. Se la risposta cambia una decisione, è il Project.

L'errore da evitare, usare Claude Code per le scelte strategiche, costa due volte: carica contesto di codice che non ti serve, e la decisione resta sepolta in una sessione di coding che poi viene compattata via. La decisione si perde e il contesto si gonfia. Le scelte strategiche vanno nel Project, dove diventano sedimento permanente.

---

## 2. Quando chiudere una chat

Chiudi appena scatta uno di questi segnali, senza aspettare il limite:

- Hai raggiunto una decisione o completato un sotto-obiettivo definito.
- Il discorso sta cambiando argomento.
- Ti accorgi di scrollare in su per ritrovare cosa avevate deciso.
- Sei intorno al 70% della finestra. Non aspettare il 95%: a quel punto il riassunto automatico è di fretta e perde cose.
- Fine di una sessione di lavoro, anche se non hai finito: chiudi comunque con un handoff.
- La chat ha preso più fili scollegati: era da spezzare prima.

Regola guida: una chat uguale un filo di pensiero verso un esito. Esito raggiunto o filo cambiato, si chiude.

---

## 3. Come chiudere (il rituale di distillazione)

Sempre, prima di abbandonare una chat:

1. Chiedi la distillazione (prompt pronto qui sotto).
2. Rivedila e correggila. Questo è il tuo handoff supervisionato: tagli il rumore, tieni ciò che conta. Decidi tu cosa sopravvive.
3. Salvala nel posto giusto: le decisioni stabili nel design-doc.md, lo stato corrente e le questioni aperte nello stato.md (che sovrascrivi). Per il codice, i vincoli stabili nel CLAUDE.md e lo stato nel TODO.md.
4. Apri una chat nuova che parte dai file aggiornati, mai dalla cronologia.

**Prompt di distillazione da incollare:**

```
Stiamo chiudendo questa sessione. Distilla il lavoro in un blocco compatto,
fonte di verità per la prossima sessione aggiornando il file stato.md
Struttura:
1) Decisioni prese (cosa, perché in una riga, e impatto su decisioni passate)
2) Stato attuale e vincoli emersi (es. "scoperto che l'API X non supporta Y")
3) Questioni ancora aperte
4) Prossimo passo concreto e isolato
Segnala esplicitamente se qualcosa di deciso invalida o modifica parti del
design doc attuale. Conserva i vincoli ancora validi anche se non sono
cambiati stavolta. Conciso, niente cronaca.
```

Un buon checkpoint sta in 500-1.500 token e sostituisce 5.000-15.000 token di cronologia. È lì il risparmio vero.

---

## 4. Cosa fare delle chat dopo la distillazione

Regola di fondo: non cancellare, archiviare. La chat distillata è la tua rete di sicurezza: se la distillazione ha lasciato fuori qualcosa, l'originale è l'unica fonte da cui recuperarlo. Cancellare è proprio la decisione irreversibile che vuoi evitare. E tenerla non costa nulla: una chat chiusa non consuma token finché non la riapri, e le chat di un progetto non entrano nel knowledge base né vengono iniettate nelle chat nuove, quindi non gonfiano niente.

Quindi:

- **Chat distillata: tienila, rinominala, trattala come sola lettura.** Non riaprirla per continuare a lavorare: se lo fai ricominci a gonfiare il monolite. Per riprendere il tema apri una chat nuova dai file vivi, e riapri la vecchia solo se devi recuperare un dettaglio perso.
- **Chat morta (falsa partenza, vicolo cieco senza esito): cancellala**, oppure fai quel tipo di esplorazione in chat incognito, che non vengono salvate.
- **I file vivi (design doc più stato) sono la fonte di verità, le chat sono l'archivio che riapri di rado.** Lavori sempre dai file, non scorrendo le chat.

**Convenzione di nome (numero progressivo più stato):**

```
01. Diagnosi costi (chiusa)
02. Workflow di distillazione (chiusa)
03. Costruzione assistente (attiva)
```

- Il numero dà l'ordine cronologico e ti fa ritrovare al volo la fonte di una decisione.
- Lo stato distingue le chiuse (sola lettura) dall'unica attiva. In un progetto sano c'è una sola chat "(attiva)" alla volta.
- Argomento corto e concreto.

Opzionale ma utile: nel design-doc.md, accanto a una decisione, annota il numero della chat da cui viene (es. "deciso nella 02"). Così il recupero è immediato.

**Quando potare davvero:** solo se il disordine ti dà fastidio e una decisione è ormai stabile da tempo, il valore di recupero della sua chat scende e puoi cancellare le più vecchie. È facoltativo e senza urgenza: la pulizia serve alla tua testa, non al portafoglio.

---

## 5. Come aggiornare il sistema di alto livello (il Project)

Tre contenitori, tre funzioni diverse. La regola d'oro è separare lo stabile dal fluido, così lo stabile resta riusabile a costo quasi zero.

- **Istruzioni del progetto:** ciò che è stabilissimo. Il ruolo di Claude, il tono, le preferenze, i vincoli duri. Cortissime, le tocchi di rado.
- **design-doc.md (stabile):** visione, macro-architettura e decisioni storiche ancora valide. Cresce piano, per aggiunta, non lo riscrivi ogni volta. Qui annoti accanto a ogni decisione il numero della chat da cui viene.
- **stato.md (fluido):** lo stato attuale e le questioni aperte. È il file che sovrascrivi a ogni distillazione.

Perché due file invece di uno: sovrascrivere un unico documento rischiava di farti perdere la storia architetturale man mano che il progetto cresce. Separando il passato stabile (design-doc.md) dal presente fluido (stato.md) tieni la memoria lunga intatta e ripaghi solo il file piccolo che cambia.

Errore da evitare: salvare ogni riassunto di chat come file nuovo. Un solo stato.md sovrascritto, non una pila di versioni.

Accorgimento sul recupero RAG: quando un file rimanda a un altro, scrivilo esplicito nel testo (es. "vedi le regole in style-guide.md"). Il retrieval pesca per frammenti e rischia di perdere le correlazioni tra documenti diversi: i riferimenti testuali chiari fanno da ancore e lo guidano.

---

## 6. I limiti dei Project e come conviverci

Numeri reali, piani a pagamento:

- **Istruzioni del progetto:** nessun limite duro di caratteri, ma vanno tenute concise. Servono per il contesto generale e il ruolo, non per istruzioni specifiche del singolo task (quelle restano nella chat).
- **File nel knowledge base:** numero di file non limitato, fino a 30 MB ciascuno. Il totale sta nella finestra da 200K token, e quando ci si avvicina il piano a pagamento attiva da solo la modalità RAG, che espande la capacità fino a 10 volte.
- **Allegati per singola chat:** fino a 20 file.
- **Cache:** il contenuto nei Project è in cache e non conta contro i tuoi limiti quando viene riutilizzato. Per questo conviene tenere stabile il design-doc.md: quando non cambia, riusarlo costa quasi nulla.

Pratiche che ti tengono dentro i limiti senza pensarci:

- Tieni separati design-doc.md stabile e stato.md fluido: sovrascrivi solo il secondo.
- Pota i file inutilizzati con regolarità.
- Istruzioni snelle.
- Lascia pescare il RAG: non caricare tutto "per sicurezza", il retrieval prende solo le parti rilevanti.

---

## 7. Come dividere i tuoi temi

- **Un Project per ogni app:** design-doc.md stabile, stato.md fluido, specifiche stabili. L'esecuzione su quell'app va in Claude Code, con un CLAUDE.md allineato al design doc.
- **Un Project per ciascun tema personale ricorrente** (es. salute, ricerca lavoro), con gli stessi due file che aggiorni alla chiusura delle chat.
- **Le cose minori e usa e getta:** chat normali fuori dai progetti, o modelli gratuiti, senza cerimonie.

---

## 8. Lavorare con Claude Code (il piano esecutivo)

In Claude Code non ci sono i Project: il progetto è la cartella, e la memoria persistente sono i file, soprattutto CLAUDE.md, che viene riletto all'inizio di ogni sessione. Ogni sessione parte da zero, quindi il filo che continua sono i file, non una sessione lunga. Non esiste una "sessione principale" che vive nel tempo: esistono file persistenti e sessioni usa e getta.

**Due file, due funzioni (come nel Project):**

- **CLAUDE.md = immutabile.** Solo architettura, convenzioni e vincoli che non cambiano. Lo stato di avanzamento NON va qui.
- **TODO.md = fluido.** Lo stato corrente, i task dello step e l'handoff. È il file che cambia spesso.

**Il flusso a ponte (dal Project a Claude Code):**

1. Nel Project di Claude.ai decidi design, specifiche e la prossima iterazione.
2. Apri una chat-ponte nel Project con un solo compito: produrre due cose, un pacchetto decisione (il testo con architettura, vincoli e cosa cambia) e il prompt dello step.
3. Passi il pacchetto a Claude Code e fai aggiornare a lui i propri file, invece di incollarli tu a mano: fa parsing e scrittura in un colpo solo. CLAUDE.md solo se è cambiato un vincolo stabile, TODO.md per stato e task. Questo evita la frizione del copia-incolla, che è ciò che ti farebbe abbandonare la routine.
4. Apri una sessione Claude Code per quello step. Legge CLAUDE.md da solo, tu gli dai il prompt-brief, esegue.
5. A fine step gli fai aggiornare il TODO.md con l'handoff (file cambiati, comandi, stato, rischio residuo, prossima azione). Poi abbandoni la sessione.
6. Iterazione successiva: una sessione nuova che riparte dal TODO.md e dai file. Le novità con peso strategico risalgono nel design-doc.md del Project.

**Regola:**
> Una sessione Claude Code uguale uno step. Finito lo step, handoff sul TODO.md e si abbandona. Mai trascinare una sessione tra step diversi.

**Per ridurre token e contesto:**

- **CLAUDE.md immutabile e snello.** Viene caricato a ogni sessione, ogni parola di troppo la paghi ogni volta, e se lo cambi di continuo perdi il vantaggio della parte stabile. Solo architettura e regole che non cambiano. Lo stato va nel TODO.md.
- **Brief mirato all'inizio:** obiettivo, cosa è in scope e cosa no, file probabilmente coinvolti, criterio di "fatto", comandi di verifica.
- **Subagent per esplorazione, ricerca e verifica:** il rumore (lettura di tanti file, ricerche nel codice) resta isolato nel subagent, torna solo il riassunto. È il risparmio più grosso sul lavoro di codice.
- **Non fargli leggere tutto il repo:** una ricerca mirata e due file battono "leggi tutto".
- **Gestisci i bivi a ogni turno:** /compact in anticipo per un task lungo, /rewind per tornare a uno stato buono dopo una strada sbagliata, /clear quando lo step è chiuso e passi ad altro.

Attenzione: la finestra da un milione di token non ti esonera dalla disciplina. La qualità cala comunque al crescere del contesto (context rot) e ogni token lo paghi lo stesso.

**Perché lo stato su file e non sulla memoria automatica:** per lo stato di avanzamento usi un TODO.md normale, non la memoria nativa di Claude Code. Un file lo vedi, lo correggi e lo controlli tu, ed è il principio di supervisione su cui poggia tutta la routine. La memoria automatica fa da sola ma è una scatola nera, cambia spesso e vive solo dentro Claude Code; un file invece lo leggono entrambi i piani, lo versioni con git e sopravvive ai cambi di strumento. L'automazione vera (hook a fine sessione, /memory) la valuti semmai dopo, se la routine regge.

---

## Il ciclo, in breve
Pensa nella chat -> al 70% o a decisione presa, distilla -> correggi a mano -> aggiorni i file vivi (design-doc stabile, stato fluido) -> riparti pulito. La chat chiusa la tieni e la rinomini come archivio, non la riapri. Le decisioni scendono dal Project ai file del repo che Claude Code legge; Claude Code esegue uno step per sessione, aggiorna il TODO.md e poi lo abbandoni. I file vivi sono il filo che tiene tutto allineato.

---

## Appendice: prompt pronti da incollare
Ognuno con il momento in cui si usa. Adatta le parti tra parentesi quadre.

**A. Distillazione, alla chiusura di una chat (Claude.ai). Già in sezione 3.**
```
Stiamo chiudendo questa sessione. Distilla il lavoro in un blocco compatto,
fonte di verità per la prossima sessione aggiornando il file stato.md
Struttura:
1) Decisioni prese (cosa, perché in una riga, e impatto su decisioni passate)
2) Stato attuale e vincoli emersi (es. "scoperto che l'API X non supporta Y")
3) Questioni ancora aperte
4) Prossimo passo concreto e isolato
Segnala esplicitamente se qualcosa di deciso invalida o modifica parti del
design doc attuale. Conserva i vincoli ancora validi anche se non sono
cambiati stavolta. Conciso, niente cronaca.
```

**B. Chat-ponte, per tradurre una decisione in pacchetto e prompt dello step (Claude.ai).**
```
Abbiamo deciso questa iterazione: [incolla la decisione dal design doc o dallo stato].
Preparami due cose separate e pronte da usare.

1) PACCHETTO DECISIONE: un blocco di testo con architettura, vincoli e
   convenzioni rilevanti per questo step, e cosa cambia rispetto a prima.
   Conciso, niente cronaca. Lo passerò io a Claude Code perché aggiorni i
   suoi file.

2) PROMPT DELLO STEP: il brief da incollare in una sessione Claude Code, con
   Obiettivo / In scope / Fuori scope / File probabilmente coinvolti /
   Criterio di "fatto" / Comandi di verifica. Tienilo stretto a questo step.
```

**C. Flusso invertito: dai il pacchetto a Claude Code e gli fai aggiornare i suoi file (Claude Code).**
```
Ti incollo il pacchetto decisione preso nella chat strategica:
[incolla il pacchetto].
Aggiorna tu i file di contesto di conseguenza, prima di iniziare:
- CLAUDE.md solo se è cambiata una regola o un vincolo stabile (architettura,
  convenzioni). Niente stato di avanzamento qui.
- TODO.md con lo stato corrente e i task di questo step.
Poi fermati e dimmi cosa hai cambiato, prima di scrivere codice.
```

**D. Brief di avvio di una sessione Claude Code. Di solito te lo genera la chat-ponte: questo è lo scheletro per riconoscerne uno buono.**
```
Obiettivo: [una frase].
In scope: [solo questo].
Fuori scope: [cosa NON toccare].
File probabilmente coinvolti: [percorsi].
Fatto quando: [criterio verificabile].
Verifica con: [comandi, es. i test].
Se devi esplorare il repo, usa un subagent e riportami solo il riassunto.
Non leggere file fuori scope.
```
Nota: CLAUDE.md viene letto da solo a inizio sessione, quindi nel brief non ripetere il contesto generale del progetto.

**E. Delega a un subagent, dentro una sessione Claude Code.**
```
Usa un subagent per [esplorare X / trovare dove avviene Y / verificare questa
implementazione contro la spec]. Fagli fare il lavoro nel suo contesto e
riportami solo il riassunto, non i file letti.
```

**F. Handoff, alla chiusura di una sessione Claude Code.**
```
Stiamo chiudendo questa sessione. Aggiorna il TODO.md con un handoff conciso
che la prossima sessione leggerà per ripartire. Includi:
- File cambiati (una riga sul perché ciascuno)
- Comandi eseguiti e loro esito
- Stato attuale: cosa funziona, cosa no
- Rischio residuo o cose lasciate a metà
- Prossima azione concreta
Tocca CLAUDE.md solo se è emersa una decisione o un vincolo stabile.
Niente cronaca dei tentativi, solo ciò che serve dopo.
```

**G. Ripartenza di una chat nuova dai file vivi (Claude.ai).**
```
Riparto dai file vivi del progetto nel knowledge base: design-doc.md per la
visione stabile e stato.md per lo stato corrente. Non riassumermeli. Voglio
lavorare su: [tema o iterazione]. Parti dallo stato corrente e dalle questioni
aperte e proponimi come procedere.
```

**H. Istruzioni di compaction da incollare dentro CLAUDE.md (una volta sola).**
```
## Istruzioni di compaction
Quando comprimi il contesto, conserva: obiettivo corrente, decisioni e
vincoli, file cambiati, comandi di verifica, stato del deploy, blocchi aperti.
Scarta: log grezzi (a meno che una riga spieghi la causa di un errore) e i
tentativi falliti già superati.
```

**I. Scheletro delle istruzioni di progetto (Claude.ai, campo istruzioni).**
```
Ruolo: [come deve comportarsi Claude in questo progetto].
Contesto: [una o due righe su cosa è il progetto].
Vincoli e preferenze: [stack, stile, regole dure].
Cosa NON fare: [limiti].
Per i dettagli aggiornati fai riferimento ai file vivi nel knowledge base:
design-doc.md (stabile) e stato.md (corrente).
```
