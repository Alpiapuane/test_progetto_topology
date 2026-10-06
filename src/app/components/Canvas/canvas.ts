import { Component, ElementRef, HostListener, inject, viewChild } from '@angular/core';
import { DEVICE_TYPES, Device, DeviceType } from '../../modules/models';
import { TopologyService } from '../../serivice/Topology-service/topology';

/** Mantiene una coordinata entro i limiti consentiti del canvas. */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Canvas SVG principale.
 * Qui si gestiscono: drag & drop dei dispositivi, spostamento del viewport,
 * selezione di dispositivi/cavi e la creazione delle connessioni a click.
 */
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.html',
  styleUrl: './canvas.css',
})
export class CanvasComponent {
  topo = inject(TopologyService);
  private svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  zoom = 1;
  panX = 0;
  panY = 0;
  panMode = false;
  private panDrag: { sx: number; sy: number; ox: number; oy: number; moved: boolean } | null = null;
  private suppressBackgroundClick = false;
  /**
   * Stato del trascinamento in corso del dispositivo: conserva il punto iniziale
   * del mouse e la posizione originale del device per calcolare lo spostamento.
   */
  private drag: { id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null = null;

  /** Drop dalla palette: crea il dispositivo alle coordinate di rilascio. */
  onDrop(e: DragEvent) {
    e.preventDefault();
    const type = e.dataTransfer?.getData('text/plain') as DeviceType;
    if (!DEVICE_TYPES.includes(type)) return;
    const s = this.svg().nativeElement, r = s.getBoundingClientRect();
    const x = (e.clientX - r.left - this.panX) / this.zoom;
    const y = (e.clientY - r.top - this.panY) / this.zoom;
    this.topo.addDevice(type,
      clamp(x, (44 - this.panX) / this.zoom, (s.clientWidth - 44 - this.panX) / this.zoom),
      clamp(y, (44 - this.panY) / this.zoom, (s.clientHeight - 52 - this.panY) / this.zoom));
    this.topo.armedType.set(null);
  }

  /** Click sullo sfondo: deseleziona tutto. */
  onBackground(e: MouseEvent) {
    const suppress = this.suppressBackgroundClick;
    this.suppressBackgroundClick = false;
    if (suppress || this.panMode) return;
    if (e.target === e.currentTarget) { this.topo.selectDevice(null); this.topo.selectConnection(null); }
  }

  /** Ingrandisce o riduce la vista mantenendo fermo il centro del canvas. */
  zoomBy(factor: number): void {
    const svg = this.svg().nativeElement;
    const nextZoom = clamp(this.zoom * factor, 0.5, 3);
    const ratio = nextZoom / this.zoom;
    this.panX = svg.clientWidth / 2 - (svg.clientWidth / 2 - this.panX) * ratio;
    this.panY = svg.clientHeight / 2 - (svg.clientHeight / 2 - this.panY) * ratio;
    this.zoom = nextZoom;
  }

  /** Ripristina zoom e posizione iniziali del canvas. */
  resetView(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
  }

  /** Abilita o disabilita lo spostamento della vista con il puntatore. */
  togglePan(): void { this.panMode = !this.panMode; }

  /** Usa la rotella per ingrandire o ridurre il canvas. */
  onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1);
  }

  /** Avvia il pan quando la modalità è attiva. */
  beginPan(e: PointerEvent): void {
    if (!this.panMode || e.button !== 0) return;
    e.preventDefault();
    const svg = e.currentTarget as SVGSVGElement;
    svg.setPointerCapture(e.pointerId);
    this.panDrag = { sx: e.clientX, sy: e.clientY, ox: this.panX, oy: this.panY, moved: false };
  }

  /** Aggiorna l'offset della vista durante il pan. */
  panMove(e: PointerEvent): void {
    const pan = this.panDrag;
    if (!pan) return;
    const dx = e.clientX - pan.sx, dy = e.clientY - pan.sy;
    if (!pan.moved && Math.hypot(dx, dy) < 3) return;
    pan.moved = true;
    this.panX = pan.ox + dx;
    this.panY = pan.oy + dy;
  }

  /** Termina il pan e impedisce che il rilascio selezioni lo sfondo. */
  endPan(): void {
    if (this.panDrag?.moved) this.suppressBackgroundClick = true;
    this.panDrag = null;
  }

  /** Avvia il trascinamento del dispositivo e cattura gli eventi del puntatore. */
  down(e: PointerEvent, d: Device) {
    if (e.button !== 0 || this.panMode) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    this.drag = { id: d.id, sx: e.clientX, sy: e.clientY, ox: d.x, oy: d.y, moved: false };
  }

  /** Sposta il dispositivo aggiornando x/y; le connessioni si ridisegnano da sole. */
  move(e: PointerEvent) {
    const g = this.drag;
    if (!g) return;
    const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    g.moved = true;
    const s = this.svg().nativeElement;
    this.topo.moveDevice(g.id,
      clamp(g.ox + dx / this.zoom, (44 - this.panX) / this.zoom, (s.clientWidth - 44 - this.panX) / this.zoom),
      clamp(g.oy + dy / this.zoom, (44 - this.panY) / this.zoom, (s.clientHeight - 52 - this.panY) / this.zoom));
  }

  /** Rilascio senza movimento = click: seleziona o collega. */
  up(d: Device) {
    const g = this.drag;
    this.drag = null;
    if (!g || g.moved) return;
    const sel = this.topo.selectedDeviceId();
    if (!sel) return this.topo.selectDevice(d.id);
    if (sel === d.id) return this.topo.selectDevice(null);
    const err = this.topo.addConnection(sel, d.id);
    if (err) this.topo.notify(err, true);
    else this.topo.selectDevice(null);
  }

  /** Click destro: apre il dettaglio del dispositivo. */
  menu(e: MouseEvent, d: Device) { e.preventDefault(); this.topo.detailDeviceId.set(d.id); }

  /** Click destro: apre il dettaglio della connessione. */
  menuConnection(e: MouseEvent, id: string) { e.preventDefault(); this.topo.detailConnectionId.set(id); }

  /** Il tasto Canc elimina la selezione. */
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const target = e.target;
    if (target instanceof HTMLElement
      && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
    if (e.key === 'Delete') this.topo.deleteSelection();
  }
}
