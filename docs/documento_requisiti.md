# Documento dei Requisiti – Applicazione Grafica per Topologie di Rete

## 1. Obiettivo del progetto

Realizzare una piccola applicazione grafica per la **gestione visuale di una rete informatica**.

L'applicazione deve fornire un **canvas**, cioè un'area grafica nella quale l'utente può costruire una semplice topologia di rete inserendo, spostando e collegando dispositivi.

L'obiettivo principale è permettere all'utente di rappresentare graficamente una rete composta da **PC, Switch e Router**, mantenendo aggiornate sia la posizione dei dispositivi sia le connessioni tra essi.

---

# 2. Priorità dei requisiti

Per evitare ambiguità, i requisiti sono divisi in tre livelli:

- **OBBLIGATORIO**: deve essere implementato.
- **IMPORTANTE**: deve essere implementato se indicato come tale nel documento, anche se nella traccia originale era presentato come estensione.
- **BONUS**: funzionalità aggiuntiva, non necessaria per il funzionamento base.

La priorità va rispettata nell'ordine indicato.

---

# 3. Dispositivi supportati

L'applicazione deve gestire esclusivamente queste tre tipologie di dispositivi:

- **PC**
- **Switch**
- **Router**

Ogni dispositivo deve essere rappresentato graficamente mediante una **icona specifica per il proprio tipo**.

---

# 4. Modello dati dei dispositivi

Ogni dispositivo deve possedere almeno i seguenti dati:

```text
Device
├── id
├── type
├── name
├── x
└── y
```

### 4.1 Campi obbligatori

- `id`: identificativo univoco del dispositivo.
- `type`: tipo del dispositivo. Valori ammessi: `PC`, `Switch`, `Router`.
- `name`: nome o label visualizzata graficamente.
- `x`: posizione orizzontale del dispositivo nel sistema di coordinate del canvas.
- `y`: posizione verticale del dispositivo nel sistema di coordinate del canvas.

### 4.2 Dati aggiuntivi

Il dispositivo può contenere altri dati necessari alla gestione del dettaglio, ad esempio:

- indirizzo IP;
- hostname;
- stato;
- numero di porte disponibili per uno Switch.

---

# 5. Canvas e inserimento dei dispositivi

## 5.1 Canvas

L'applicazione deve avere un'area grafica centrale chiamata **canvas**.

All'interno del canvas l'utente deve poter costruire la topologia della rete.

## 5.2 Selezione del tipo di dispositivo

Sopra o vicino al canvas devono essere presenti **tre icone**:

1. PC
2. Router
3. Switch

Quando l'utente clicca su una delle tre icone:

1. l'icona selezionata deve essere evidenziata;
2. deve comparire un avviso che informa l'utente di trascinare il dispositivo selezionato all'interno del canvas;
3. l'utente può quindi effettuare il **drag & drop** nel canvas per creare il dispositivo.

## 5.3 Creazione del dispositivo

Quando il dispositivo viene rilasciato nel canvas:

- deve essere creato un nuovo elemento;
- deve ricevere un `id` univoco;
- deve ricevere un tipo (`PC`, `Switch` oppure `Router`);
- deve ricevere un nome/label;
- devono essere memorizzate le coordinate `x` e `y` del punto in cui è stato posizionato.

---

# 6. Posizionamento e spostamento

I dispositivi devono poter essere **spostati liberamente** all'interno del canvas tramite drag & drop.

Quando un dispositivo viene spostato:

- le sue coordinate `x` e `y` devono essere aggiornate;
- tutte le connessioni associate a quel dispositivo devono aggiornare automaticamente la propria posizione grafica.

L'utente non deve quindi dover ricreare manualmente i cavi dopo aver spostato un dispositivo.

---

# 7. Connessioni tra dispositivi

L'utente deve poter creare connessioni grafiche tra i dispositivi.

## 7.1 Regole di una connessione

Ogni connessione deve collegare **esattamente due dispositivi**:

- un dispositivo sorgente (`source`);
- un dispositivo destinazione (`target`).

Un singolo dispositivo può avere **N connessioni**, compatibilmente con le eventuali limitazioni sulle porte disponibili.

## 7.2 Procedura di creazione

La modalità di interazione base è:

1. click sul primo dispositivo;
2. il primo dispositivo viene evidenziato come **selezionato**;
3. click sul secondo dispositivo;
4. viene creata una connessione grafica tra i due dispositivi.

## 7.3 Rappresentazione grafica

La connessione può essere rappresentata mediante una **linea tratteggiata**.

Esempio:

```text
[PC-01] -------- [Switch-01] -------- [Router-01]
```

## 7.4 Aggiornamento automatico delle connessioni

Quando uno dei dispositivi collegati viene spostato, la linea della connessione deve essere aggiornata automaticamente affinché continui a collegare visivamente i due dispositivi.

---

# 8. Modello dati delle connessioni

Ogni connessione deve essere rappresentata da una struttura dati contenente almeno:

```text
Connection
├── id
├── sourceId
└── targetId
```

Dove:

- `id` = identificativo univoco della connessione;
- `sourceId` = ID del dispositivo sorgente;
- `targetId` = ID del dispositivo destinazione.

---

# 9. Regole di validazione delle connessioni

Le seguenti regole sono da considerare **IMPORTANTI**:

### 9.1 Divieto di connessione con sé stessi

Un dispositivo non può essere collegato a sé stesso.

Esempio non valido:

```text
[PC-01] ---- [PC-01]
```

### 9.2 Divieto di connessioni duplicate

Non deve essere possibile creare più volte la stessa connessione tra gli stessi due dispositivi.

Esempio non valido:

```text
[PC-01] ===== [Switch-01]
[PC-01] ===== [Switch-01]
```

### 9.3 Limite delle porte dello Switch

Uno Switch può avere un numero limitato di porte disponibili.

Il numero di connessioni collegate a uno Switch non può superare il numero di porte disponibili assegnato a quello Switch.

---

# 10. Selezione dei dispositivi

La selezione del dispositivo deve essere visibile graficamente.

Quando un dispositivo viene selezionato, deve essere **evidenziato** in modo chiaro.

L'evidenziazione deve permettere all'utente di capire quale dispositivo è attualmente selezionato durante le operazioni di connessione o modifica.

---

# 11. Dettaglio del dispositivo

Deve essere implementata una modalità per visualizzare i dettagli di un dispositivo presente nel canvas.

## 11.1 Apertura del dettaglio

Con un **click destro** sul dispositivo, l'applicazione deve mostrare le informazioni del dispositivo.

La visualizzazione può essere implementata tramite:

- popup;
- nuova finestra;

La traccia non impone una soluzione grafica specifica, quindi deve essere scelta quella più adatta all'architettura dell'applicazione.

## 11.2 Informazioni mostrate

Le informazioni devono dipendere dal tipo di dispositivo.

### Router

Il dettaglio può contenere:

- Nome
- Tipo
- IP
- Hostname
- Stato

Esempio:

```text
Nome: Router principale
Tipo: Router
IP: 192.168.1.1
Hostname: router-main
Stato: Online
```

### PC

Il dettaglio può contenere:

- Nome
- Tipo
- IP
- Host
- Stato

### Switch

Il dettaglio può contenere:

- Nome
- Tipo
- IP
- Hostname
- Stato
- Porte disponibili

---

# 12. Generazione casuale dei dati

I dati visualizzati nel dettaglio dei dispositivi devono essere scelti **casualmente da apposite pool di valori**.

La generazione deve prevedere un controllo per evitare copie/duplicati nel canvas quando il dato deve essere univoco.

In particolare, l'applicazione deve evitare che due dispositivi presenti contemporaneamente nel canvas ricevano accidentalmente gli stessi dati identificativi che devono risultare univoci.

Per gli Switch deve essere inoltre tenuto conto del numero di **porte disponibili**, in modo che il numero di collegamenti non possa superare tale limite.

---

# 13. Funzionalità IMPORTANTI

Le seguenti funzionalità sono indicate come importanti nella traccia e devono essere implementate:

- eliminazione di un dispositivo;
- eliminazione di una connessione;
- evidenziazione del dispositivo selezionato;
- salvataggio della topologia nel Local Storage;
- caricamento di una topologia precedentemente salvata;
- impedire il collegamento di un dispositivo a sé stesso;
- impedire connessioni duplicate.

---

# 14. Persistenza dei dati – Local Storage

La persistenza è presentata nella traccia come **bonus**, ma è marcata come importante e quindi deve essere trattata come funzionalità richiesta nel progetto.

## 14.1 Dati da salvare

Nel Local Storage devono essere salvati almeno:

- dispositivi;
- coordinate dei dispositivi;
- connessioni;
- eventuali proprietà aggiuntive dei dispositivi.

## 14.2 Comandi previsti

L'interfaccia deve prevedere almeno la possibilità di:

```text
Salva topologia
Carica topologia
Cancella topologia
```

## 14.3 Ripristino

Dopo la riapertura dell'applicazione, la topologia salvata deve poter essere ripristinata:

- automaticamente, oppure
- tramite un pulsante dedicato.

---

# 15. Funzionalità bonus

Le seguenti funzionalità sono facoltative, salvo quelle già indicate come **IMPORTANTI** nelle sezioni precedenti:

- modifica del nome del dispositivo;
- modifica dell'indirizzo IP;
- colori diversi per PC, Switch e Router;
- zoom del canvas;
- spostamento/panning del canvas;
- esportazione della configurazione in JSON;
- importazione della configurazione da JSON.

---

# 16. Modalità Edit / Connect – Bonus avanzato

È possibile implementare una modalità avanzata che separi chiaramente lo spostamento dei dispositivi dalla creazione delle connessioni.

## Modalità Edit

In modalità **Edit**:

- l'utente può spostare i dispositivi;
- il drag & drop serve a modificare la posizione dei dispositivi.

## Modalità Connect

In modalità **Connect**:

1. il primo click seleziona il dispositivo sorgente;
2. il secondo click seleziona il dispositivo destinazione;
3. viene creata la connessione tra i due dispositivi, se la connessione è valida.

Questa modalità è un **bonus avanzato**, ma deve rispettare tutte le regole di validazione definite nella sezione Connessioni.

---

# 17. Struttura logica consigliata

L'architettura può essere organizzata concettualmente nel seguente modo:

```text
UI
 |
 v
Canvas
 |
 +--> Devices
 |
 +--> Connections
 |
 v
Storage
```

Questa rappresentazione è solo concettuale. L'architettura effettiva può variare in base alle tecnologie utilizzate.

---

# 18. Tecnologie

Il documento originale fornisce come esempio:

```text
Frontend: Angular
Backend: Node.js
Persistenza: Local Storage
```

Queste tecnologie **non devono essere considerate obbligatorie** a meno che non siano state richieste esplicitamente in una consegna esterna.

La documentazione finale deve indicare esclusivamente le tecnologie realmente utilizzate.

---

# 19. Documentazione tecnica obbligatoria

Il progetto deve essere accompagnato da una breve **documentazione tecnica**.

La documentazione può essere realizzata in questo formato:

- Markdown (`README.md`);

La documentazione deve contenere almeno le sezioni seguenti.

## 19.1 Descrizione del progetto

Descrivere brevemente:

- obiettivo dell'applicazione;
- funzionalità implementate;
- eventuali funzionalità bonus.

## 19.2 Tecnologie utilizzate

Indicare le tecnologie effettivamente utilizzate.

## 19.3 Architettura del progetto

Descrivere brevemente come è organizzata l'applicazione. e dei commenti dettagliati su cosa fanno tutte le funzioni e classi

## 19.4 Modello dati

Descrivere le principali entità utilizzate, ad esempio:

```text
Device
- id
- name
- type
- x
- y
- ip

Connection
- id
- sourceId
- targetId
```

Il modello deve essere coerente con quello realmente implementato.

## 19.5 Istruzioni di avvio

Devono essere indicate chiaramente le istruzioni necessarie per eseguire il progetto.

Esempio:

```bash
npm install
npm start
```

## 19.6 Screenshot dell'applicazione

La documentazione deve contenere **screenshot reali dell'applicazione funzionante**.

Devono essere mostrati almeno:

1. canvas con alcuni dispositivi inseriti;
2. almeno una connessione tra dispositivi;
3. dispositivi posizionati in punti differenti del canvas;
4. dettaglio di un dispositivo tramite sidebar, finestra, popup o pagina;
5. funzionalità di salvataggio/caricamento, se implementata.

Gli screenshot dovrebbero essere salvati in una cartella dedicata, ad esempio:

```text
project/
├── src/
├── docs/
│   ├── canvas.png
│   ├── connections.png
│   └── device-detail.png
└── README.md
```

---

# 20. Risultato atteso

Al termine del progetto l'utente deve poter costruire graficamente una semplice topologia di rete, ad esempio:

```text
             [Router]
                 |
              [Switch]
              /      \
          [PC-01]  [PC-02]
```

Deve essere possibile:

- inserire PC, Switch e Router;
- posizionarli liberamente nel canvas;
- selezionare un dispositivo;
- collegare due dispositivi tramite una connessione;
- visualizzare graficamente le connessioni;
- spostare i dispositivi mantenendo aggiornate le connessioni;
- visualizzare il dettaglio di un dispositivo tramite click destro;
- eliminare dispositivi e connessioni;
- salvare e ricaricare la topologia tramite Local Storage;
- impedire connessioni non valide, come collegamenti verso sé stessi o duplicati;
- rispettare il limite di porte disponibili degli Switch.

---

# 21. Criteri di accettazione

Il progetto può essere considerato conforme ai requisiti principali quando tutti i seguenti punti risultano verificabili:

### Dispositivi

- [ ] È possibile inserire un PC.       
- [ ] È possibile inserire uno Switch.
- [ ] È possibile inserire un Router.
- [ ] Ogni dispositivo ha un ID univoco.
- [ ] Ogni dispositivo ha un tipo, un nome e coordinate `x`/`y`.
- [ ] Ogni dispositivo utilizza una propria icona grafica.

### Posizionamento

- [ ] I dispositivi possono essere trascinati nel canvas.
- [ ] Le coordinate vengono aggiornate dopo lo spostamento.
- [ ] Le connessioni seguono automaticamente i dispositivi spostati.

### Connessioni

- [ ] È possibile collegare due dispositivi.
- [ ] Una connessione contiene `id`, `sourceId` e `targetId`.
- [ ] Il dispositivo selezionato viene evidenziato.
- [ ] Non è possibile collegare un dispositivo a sé stesso.
- [ ] Non è possibile creare una connessione duplicata.
- [ ] Lo Switch non può superare il numero di porte disponibili.

### Dettaglio dispositivo

- [ ] Il click destro apre il dettaglio del dispositivo.
- [ ] Il dettaglio mostra informazioni coerenti con il tipo di dispositivo.
- [ ] I dati sono generati/selezionati dalle pool previste evitando duplicati dove richiesto.

### Gestione

- [ ] È possibile eliminare un dispositivo.
- [ ] È possibile eliminare una connessione.
- [ ] È possibile salvare la topologia nel Local Storage.
- [ ] È possibile caricare la topologia salvata.
- [ ] È possibile cancellare la topologia salvata.

### Documentazione

- [ ] È presente la documentazione tecnica.
- [ ] Sono indicate le tecnologie realmente utilizzate.
- [ ] È descritta l'architettura del progetto.
- [ ] È descritto il modello dati.
- [ ] Sono presenti le istruzioni di avvio.
- [ ] Sono presenti screenshot reali dell'applicazione funzionante.

---

# 22. Vincoli 

1. **Non cambiare le tre tipologie di dispositivi** richieste: PC, Switch e Router.
2. **Non eliminare il canvas**: è l'elemento centrale dell'applicazione.
3. **Le coordinate dei dispositivi devono essere persistenti nello stato dell'applicazione** e devono aggiornarsi durante il drag & drop.
4. **Le connessioni devono essere legate agli ID dei dispositivi**, non a coordinate fisse.
5. Quando un dispositivo viene spostato, **non creare una nuova connessione**: aggiornare graficamente quella esistente.
6. Una connessione deve avere sempre due estremi validi: `sourceId` e `targetId`.
7. Non consentire connessioni verso sé stessi.
8. Non consentire connessioni duplicate.
9. Rispettare il numero di porte disponibili degli Switch.
10. Le funzionalità bonus non devono rompere o sostituire le funzionalità obbligatorie.
11. La scelta di Angular, Node.js o altre tecnologie non deve essere inventata: usare solo quelle effettivamente previste dal progetto.
12. La documentazione deve descrivere ciò che è stato realmente implementato, non funzionalità solo dichiarate ma assenti.

---

# 23. Consegna finale

La consegna deve comprendere almeno:

```text
1. Codice sorgente
2. Applicazione funzionante
3. Documentazione tecnica
4. Screenshot delle principali funzionalità
```

Il risultato finale deve consentire a una persona di costruire e modificare graficamente una semplice rete composta da PC, Switch e Router, collegandoli tra loro e visualizzandone i relativi dettagli.
