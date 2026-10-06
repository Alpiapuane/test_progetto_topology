import { Component, inject } from '@angular/core';
import { Device } from '../../modules/models';
import { TopologyService } from '../../serivice/Topology-service/topology';

/** Popup con i dettagli del dispositivo (aperto con il click destro). */
@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.html',
  styleUrl: './device-detail.css',
})
export class DeviceDetailComponent {
  topo = inject(TopologyService);
  editing = false;
  editName = '';
  editIp = '';

  /** Chiude il popup azzerando il dispositivo visualizzato. */
  close() {
    this.editing = false;
    this.topo.detailDeviceId.set(null);
  }

  /** Copia i valori correnti nei campi del modulo di modifica. */
  startEdit(d: Device): void {
    this.editName = d.name;
    this.editIp = d.ip;
    this.editing = true;
  }

  /** Aggiorna il nome digitato nel modulo. */
  changeName(event: Event): void { this.editName = (event.target as HTMLInputElement).value; }

  /** Aggiorna l'IP digitato nel modulo. */
  changeIp(event: Event): void { this.editIp = (event.target as HTMLInputElement).value; }

  /** Salva i nuovi valori oppure lascia aperto il modulo se la validazione fallisce. */
  saveEdit(event: SubmitEvent, d: Device): void {
    event.preventDefault();
    const error = this.topo.updateDevice(d.id, this.editName, this.editIp);
    if (error) return this.topo.notify(error, true);
    this.editing = false;
    this.topo.notify('Dispositivo aggiornato.');
  }

  /** Righe mostrate in base al tipo (PC usa "Host", Switch aggiunge le porte). */
  rows(d: Device): [string, string][] {
    const r: [string, string][] = [['Nome', d.name], ['Tipo', d.type], ['IP', d.ip],
      [d.type === 'PC' ? 'Host' : 'Hostname', d.hostname], ['Stato', d.status]];
    if (d.type === 'Switch') {
      const used = this.topo.usedPorts(d.id);
      r.push(['Porte disponibili', `${(d.ports ?? 0) - used} su ${d.ports} (${used} occupate)`]);
    }
    return r;
  }
}
