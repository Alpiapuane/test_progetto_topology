# Screenshot e guida operativa

Le immagini mostrano i principali flussi dell'applicazione Network Topology. Per provare i passaggi, avvia il progetto con `npm start` e apri `http://localhost:4200/`.

I nomi, gli indirizzi IP e gli hostname sono generati automaticamente e possono quindi essere diversi da quelli mostrati. Il file di esempio usato nell'immagine di importazione contiene un solo PC.

## 1. Schermata iniziale

![Schermata iniziale con palette, comandi e canvas vuoto](screenshots/01-schermata-iniziale.png)

All'avvio trovi la palette con PC, Router e Switch, i comandi per gestire la topologia e il canvas vuoto. I controlli Pan, zoom e Reset si trovano nell'angolo in alto a destra del canvas.

## 2. Inserire i dispositivi

![PC, Switch e Router inseriti nel canvas](screenshots/02-inserimento-dispositivi.png)

Trascina un elemento della palette nel canvas. Rilascia un PC, uno Switch e un Router nelle posizioni desiderate. L'app crea ogni dispositivo con nome, IP e hostname univoci; per gli Switch assegna anche il numero di porte.

## 3. Collegare i dispositivi

![Due cavi collegano PC, Switch e Router](screenshots/03-collegamento-dispositivi.png)

Clicca sul primo dispositivo e poi sul secondo: compare il cavo. Ripeti tra Switch e Router. Per deselezionare senza creare un collegamento, clicca sullo sfondo. Non sono consentiti collegamenti di un dispositivo con sé stesso o cavi duplicati.

## 4. Consultare un dispositivo

![Popup con le informazioni del PC](screenshots/04-dettaglio-dispositivo.png)

Fai clic con il tasto destro su un dispositivo per aprire il dettaglio. Qui leggi nome, tipo, IP, hostname e stato; per uno Switch sono mostrate anche le porte disponibili.

## 5. Modificare nome e IP

![Modulo di modifica del dispositivo](screenshots/05-modifica-dispositivo.png)

Nel dettaglio seleziona **Modifica**, aggiorna i campi Nome e IP e premi **Salva modifiche**. **Annulla** chiude la modifica senza applicarla. Il sistema rifiuta nomi o IP già assegnati a un altro dispositivo.

## 6. Verificare la modifica

![Dettaglio dopo la modifica di nome e IP](screenshots/06-dispositivo-aggiornato.png)

Dopo il salvataggio, il popup mostra i nuovi valori, il nome cambia anche sull'icona nel canvas e appare il messaggio di conferma.

## 7. Consultare una connessione

![Popup con gli identificativi del cavo e dei dispositivi collegati](screenshots/07-dettaglio-connessione.png)

Fai clic destro sul cavo per vedere il suo ID e gli ID dei dispositivi alle due estremità. Dal popup puoi chiudere il dettaglio oppure eliminare la connessione.

## 8. Zoom e spostamento del canvas

![Canvas ingrandito e spostato con la modalità Pan](screenshots/08-zoom-pan.png)

Usa **+** e **−**, oppure la rotella del mouse, per regolare lo zoom. Attiva **Pan** e trascina lo sfondo per spostare la vista. **Reset** riporta zoom e posizione iniziali.

## 9. Salvare nel browser

![Conferma del salvataggio della topologia](screenshots/09-salvataggio-locale.png)

Premi **Salva topologia** per memorizzare nel Local Storage la topologia corrente del browser. Il messaggio conferma l'operazione; i dati non vengono inviati a un server.

## 10. Caricare la topologia salvata

![Conferma del caricamento della topologia](screenshots/10-caricamento-locale.png)

Premi **Carica topologia** per ripristinare i dispositivi e i cavi precedentemente salvati in questo browser. Se non esiste una topologia salvata, non c'è una copia da ripristinare.

## 11. Esportare un file JSON

![Conferma dell'esportazione JSON](screenshots/11-esportazione-json.png)

Premi **Esporta JSON** per scaricare un file con i dispositivi, le loro proprietà e le connessioni della topologia corrente. Il messaggio conferma l'esportazione.

## 12. Importare un file JSON

![Topologia sostituita dai dati importati dal file JSON](screenshots/12-importazione-json.png)

Premi **Importa JSON** e scegli un file valido. Se i dati superano la validazione, la topologia corrente viene sostituita; qui il file di esempio carica il dispositivo `PC test`. Un file non valido non viene importato.

## 13. Selezionare un elemento da eliminare

![Router selezionato e comando di eliminazione abilitato](screenshots/13-selezione-da-eliminare.png)

Clicca su un dispositivo o su un cavo per selezionarlo. L'elemento selezionato viene evidenziato e il pulsante **Elimina selezione** si abilita.

## 14. Eliminare un dispositivo

![Dopo l'eliminazione restano il PC, lo Switch e il collegamento tra loro](screenshots/14-eliminazione-dispositivo.png)

Premi **Elimina selezione** oppure il tasto `Canc`. Eliminando un dispositivo vengono rimosse anche le connessioni collegate a esso; nell'immagine, il Router e il suo cavo sono scomparsi.

## 15. Cancellare la copia salvata

![Copia salvata rimossa mentre il canvas resta invariato](screenshots/15-cancella-salvataggio.png)

Premi **Cancella topologia** per rimuovere la copia nel Local Storage. Questa azione non svuota il canvas corrente: per eliminare i dispositivi visibili, selezionali e usa **Elimina selezione**.
