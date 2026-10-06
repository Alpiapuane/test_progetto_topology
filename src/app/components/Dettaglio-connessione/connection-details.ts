import { Component, inject } from '@angular/core';
import { Connection } from '../../modules/models';
import { TopologyService } from '../../serivice/Topology-service/topology';

/** Popup con i dettagli della connessione [cavo] (aperto con il click destro). */
@Component({
  selector: 'app-connection-detail',
  templateUrl: './connection-details.html',
  styleUrl: './connection-details.css',
})
export class ConnectionDetailComponent {
  topo = inject(TopologyService);

  /** Chiude il popup azzerando la connessione visualizzata. */
  close() { this.topo.detailConnectionId.set(null); }

  /** Prepara le righe con l'ID della connessione e gli ID dei dispositivi collegati. */
  rows(c: Connection): [string, string][] {
    return [['ID', c.id], ['Source ID', c.sourceId], ['Target ID', c.targetId]];
  }
}
