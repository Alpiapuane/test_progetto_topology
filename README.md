# Network Topology

## 1. Descrizione del progetto

Questa applicazione permette di creare e gestire graficamente una semplice topologia di rete composta da PC, Switch e Router. L'interfaccia principale è un canvas SVG in cui l'utente può aggiungere dispositivi, spostarli, collegarli tra loro e visualizzare i dettagli dei singoli elementi.

Le funzionalità implementate includono:

- inserimento di dispositivi dalla palette tramite drag & drop;
- spostamento dei dispositivi nel canvas con aggiornamento automatico delle connessioni;
- connessioni tra dispositivi con validazione di regole di integrità;
- evidenziazione del dispositivo selezionato;
- dettaglio di un dispositivo con click destro;
- eliminazione di dispositivi e connessioni;
- salvataggio, caricamento e cancellazione della topologia in Local Storage;
- esportazione e importazione JSON della configurazione;
- zoom e pan del canvas;
- generazione automatica di dati univoci (nome, IP, hostname, porte per Switch).

Funzioni bonus implementate:

- modifica di nome e IP del dispositivo;
- colori distinti per ogni tipo di dispositivo;
- zoom e panning del canvas;
- export/import JSON.

## 2. Tecnologie utilizzate

- Angular 20
- TypeScript
- Signals di Angular
- SVG per il canvas grafico
- Local Storage per la persistenza

## 3. Architettura del progetto

L'applicazione è organizzata in modo modulare e segue una logica basata su stato centrale, view e servizi.

- `src/app/app.ts` e `src/app/app.html`: componente principale dell'interfaccia con palette, azioni e area di lavoro.
- `src/app/components/Palette/`: componenti della palette dei dispositivi, con icone PC, Router e Switch.
- `src/app/components/Canvas/`: componente del canvas SVG che gestisce drag & drop, spostamento, click, selezione, zoom e pan.
- `src/app/components/Dettaglio-device/`: popup di dettaglio del dispositivo con modifica dei campi.
- `src/app/components/Dettaglio-connessione/`: popup di dettaglio della connessione.
- `src/app/modules/models.ts`: definisce i modelli `Device`, `Connection` e `Topology`.
- `src/app/serivice/Topology-service/topology.ts`: contiene lo stato dell'applicazione, le regole di validazione e le operazioni di modifica della topologia.
- `src/app/serivice/RandomData-service/random-data.ts`: genera dati casuali per nome, IP, hostname e porte dei dispositivi.
- `src/app/serivice/Storage-service/storage.ts`: legge, valida e persiste la topologia in Local Storage.

Il flusso di funzionamento è il seguente:

1. l'utente seleziona un tipo di dispositivo dalla palette;
2. trascina il dispositivo nel canvas;
3. il servizio di topologia crea il modello `Device` con dati univoci;
4. l'utente collega i dispositivi tramite click su due elementi;
5. il servizio valida eventuali errori (stesso dispositivo, duplicato, porte insufficienti);
6. la vista SVG ridisegna automaticamente le linee in base alle coordinate aggiornate;
7. la topologia può essere salvata e ricaricata dal browser.
8. la topologia può essere scaricata con un jason e poi importata.

## 4. Modello dati

Le entità principali sono:

```ts
interface Device {
  id: string;
  type: 'PC' | 'Switch' | 'Router';
  name: string;
  x: number;
  y: number;
  ip: string;
  hostname: string;
  status: 'Online' | 'Offline' | 'Standby';
  ports?: number;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

interface Topology {
  devices: Device[];
  connections: Connection[];
}
```

Le regole del progetto principali sono:

- ogni dispositivo ha un ID univoco;
- nome e IP non possono essere duplicati tra dispositivi diversi;
- non è consentito collegare un dispositivo a sé stesso;
- non è consentita la stessa connessione in doppio;
- gli Switch hanno un numero massimo di porte, che limita il numero di connessioni accettate.

## 5. Istruzioni di avvio

Prerequisiti:

- Node.js
- npm

Esegui da terminale nella cartella del progetto:

```bash
npm install
npm start
```

Poi apri nel browser:

```text
http://localhost:4200/
```

In alternativa sul terminale una volta entrato nel progetto:

```bash
ng serve
```

## 6. Screenshot dell'applicazione

Gli screenshot reali sono disponibili nella cartella dedicata:

- [docs/screenshots](docs/screenshots)
- [docs/screnshots.md](docs/screnshots.md)

I file mostrano in modo reale il funzionamento dell'applicazione, tra cui:

1. canvas con dispositivi inseriti;
2. connessioni tra dispositivi;
3. dettaglio di un dispositivo;
4. zoom e pan del canvas;
5. salvataggio e caricamento della topologia;
6. esportazione/importazione JSON;
7. eliminazione di un dispositivo e di una connessione.

## 7. Uso rapido

1. seleziona un dispositivo dalla palette;
2. trascinalo nel canvas;
3. clicca su due dispositivi per creare una connessione;
4. fai click destro su un dispositivo per aprire il dettaglio;
5. usa i comandi di salvataggio, caricamento e cancellazione della topologia;
6. usa **Elimina selezione** per rimuovere il dispositivo o la connessione attualmente selezionata.

Questo progetto è stato sviluppato come applicazione frontend standalone in Angular, senza backend, e la persistenza è gestita direttamente dal browser tramite Local Storage.
