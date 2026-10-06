import { Component, inject } from '@angular/core';
import { CanvasComponent } from './components/Canvas/canvas';
import { ConnectionDetailComponent } from './components/Dettaglio-connessione/connection-details';
import { DeviceDetailComponent } from './components/Dettaglio-device/device-detail';
import { PaletteComponent } from './components/Palette/palette';
import { TopologyService } from './serivice/Topology-service/topology';

/** Componente radice: barra degli strumenti, canvas, popup di dettaglio e avvisi. */
@Component({
  selector: 'app-root',
  imports: [PaletteComponent, CanvasComponent, DeviceDetailComponent, ConnectionDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  topo = inject(TopologyService);

  /** Scarica lo stato corrente come file JSON. */
  exportJson(): void {
    const blob = new Blob([this.topo.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'network-topology.json';
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    this.topo.notify('Topologia esportata in JSON.');
  }

  /** Carica e valida un file JSON, sostituendo la topologia solo se valido. */
  async importJson(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const error = this.topo.importJSON(await file.text());
      if (error) this.topo.notify(error, true);
      else this.topo.notify('Topologia importata da JSON.');
    } catch {
      this.topo.notify('Impossibile leggere il file JSON.', true);
    } finally {
      input.value = '';
    }
  }
}
