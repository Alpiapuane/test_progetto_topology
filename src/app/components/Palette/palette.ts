import { Component, inject } from '@angular/core';
import { DEVICE_TYPES, DeviceType } from '../../modules/models';
import { TopologyService } from '../../serivice/Topology-service/topology';

/** Barra con le tre icone (PC, Router, Switch): click = evidenzia e mostra avviso, drag = crea nel canvas. */
@Component({
  selector: 'app-palette',
  templateUrl: './palette.html',
  styleUrl: './palette.css',
})
export class PaletteComponent {
  topo = inject(TopologyService);
  types = DEVICE_TYPES;
  /** Seleziona/deseleziona il tipo di dispositivo da inserire. */
  toggle(t: DeviceType) { this.topo.armedType.update((c) => (c === t ? null : t)); }
}
