import { Injectable, computed, inject, signal } from '@angular/core';
import { Connection, Device, DeviceType } from '../../modules/models';
import { RandomDataService } from '../RandomData-service/random-data';
import { StorageService } from '../Storage-service/storage';

/** Verifica che l'indirizzo abbia quattro ottetti decimali compresi tra 0 e 255. */
const isValidIpv4 = (ip: string): boolean => {
  const octets = ip.split('.');
  return octets.length === 4 && octets.every((octet) =>
    /^(0|[1-9]\d{0,2})$/.test(octet) && Number(octet) <= 255);
};

/** Stato centrale dell'applicazione: dispositivi, connessioni, selezioni e regole di validazione. */
@Injectable({ providedIn: 'root' })
export class TopologyService {
  private random = inject(RandomDataService);
  private storage = inject(StorageService);

  readonly devices = signal<Device[]>([]);
  readonly connections = signal<Connection[]>([]);
  readonly selectedDeviceId = signal<string | null>(null);
  readonly selectedConnectionId = signal<string | null>(null);
  readonly detailDeviceId = signal<string | null>(null);
  readonly detailConnectionId = signal<string | null>(null);
  /** Tipo scelto dalla palette (in attesa di essere trascinato nel canvas). */
  readonly armedType = signal<DeviceType | null>(null);
  readonly message = signal<{ text: string; error: boolean } | null>(null);

  /** Restituisce il dispositivo corrispondente all'ID aperto nel popup, se esiste. */
  readonly detailDevice = computed(() => this.devices().find((d) => d.id === this.detailDeviceId()) ?? null);

  /** Restituisce la connessione corrispondente all'ID aperto nel popup, se esiste. */
  readonly detailConnection = computed(() => this.connections().find((c) => c.id === this.detailConnectionId()) ?? null);

  /** Segmenti da disegnare: derivati dalle coordinate correnti, quindi seguono i dispositivi spostati. */
  readonly lines = computed(() => {
    const map = new Map(this.devices().map((d) => [d.id, d]));
    return this.connections().flatMap((c) => {
      const a = map.get(c.sourceId), b = map.get(c.targetId);
      return a && b ? [{ id: c.id, x1: a.x, y1: a.y, x2: b.x, y2: b.y }] : [];
    });
  });

  /** ID composto da prefisso, timestamp in base 36 e fino a 5 caratteri casuali in base 36. */
  private id(p: string) { return `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`; }

  /** Mostra un avviso temporaneo. */
  notify(text: string, error = false): void {
    this.message.set({ text, error });
    setTimeout(() => this.message.set(null), 3500);
  }

  /** Crea un dispositivo con dati generati e lo aggiunge allo stato della topologia. */
  addDevice(type: DeviceType, x: number, y: number): void {
    const device: Device = { id: this.id('dev'), type, x, y, ...this.random.generate(type, this.devices()) };
    this.devices.update((l) => [...l, device]);
  }

  /** Aggiorna la posizione del dispositivo identificato, mantenendo invariati gli altri dati. */
  moveDevice(id: string, x: number, y: number): void {
    this.devices.update((l) => l.map((d) => (d.id === id ? { ...d, x, y } : d)));
  }

  /** Modifica nome e IP, validando IPv4 e impedendo valori vuoti o duplicati. */
  updateDevice(id: string, name: string, ip: string): string | null {
    const cleanName = name.trim(), cleanIp = ip.trim();
    if (!cleanName || !cleanIp) return 'Nome e IP sono obbligatori.';
    if (!isValidIpv4(cleanIp)) return 'Inserisci un indirizzo IPv4 valido, ad esempio 192.168.1.10.';
    const devices = this.devices();
    if (!devices.some((device) => device.id === id)) return 'Dispositivo non trovato.';
    const otherDevices = devices.filter((device) => device.id !== id);
    if (otherDevices.some((device) => device.name === cleanName)) return 'Questo nome è già assegnato a un altro dispositivo.';
    if (otherDevices.some((device) => device.ip === cleanIp)) return 'Questo IP è già assegnato a un altro dispositivo.';
    this.devices.update((list) => list.map((device) =>
      device.id === id ? { ...device, name: cleanName, ip: cleanIp } : device));
    return null;
  }

  /** Rimuove un dispositivo, i suoi collegamenti e l'eventuale selezione o dettaglio aperto. */
  removeDevice(id: string): void {
    this.devices.update((l) => l.filter((d) => d.id !== id));
    this.connections.update((l) => l.filter((c) => c.sourceId !== id && c.targetId !== id));
    if (this.selectedDeviceId() === id) this.selectedDeviceId.set(null);
    if (this.detailDeviceId() === id) this.detailDeviceId.set(null);
  }

  /** Rimuove una connessione e azzera la selezione se riguardava quel cavo. */
  removeConnection(id: string): void {
    this.connections.update((l) => l.filter((c) => c.id !== id));
    if (this.selectedConnectionId() === id) this.selectedConnectionId.set(null);
  }

  /** Numero di connessioni (porte occupate) di un dispositivo. */
  usedPorts(id: string): number {
    return this.connections().filter((c) => c.sourceId === id || c.targetId === id).length;
  }

  /** Crea una connessione; restituisce il messaggio d'errore se non valida, altrimenti null. */
  addConnection(sourceId: string, targetId: string, id = this.id('con')): string | null {
    if (sourceId === targetId) return 'Un dispositivo non può essere collegato a sé stesso.';
    const a = this.devices().find((d) => d.id === sourceId), b = this.devices().find((d) => d.id === targetId);
    if (!a || !b) return 'Dispositivo non trovato.';
    if (this.connections().some((c) => (c.sourceId === sourceId && c.targetId === targetId)
      || (c.sourceId === targetId && c.targetId === sourceId))) return 'Questa connessione esiste già.';
    for (const d of [a, b]) {
      if (d.type === 'Switch' && this.usedPorts(d.id) >= (d.ports ?? 0)) {
        return `${d.name} ha esaurito le porte disponibili (${d.ports}/${d.ports}).`;
      }
    }
    this.connections.update((l) => [...l, { id, sourceId, targetId }]);
    return null;
  }

  /** Elimina l'elemento selezionato (connessione o dispositivo). */
  deleteSelection(): void {
    const c = this.selectedConnectionId(), d = this.selectedDeviceId();
    if (c) this.removeConnection(c);
    else if (d) this.removeDevice(d);
  }

  /** Salva lo stato corrente della topologia e mostra una conferma. */
  save(): void {
    this.storage.save({ devices: this.devices(), connections: this.connections() });
    this.notify('Topologia salvata.');
  }

  /** Restituisce la topologia corrente come JSON formattato per il download. */
  exportJSON(): string {
    return JSON.stringify({ devices: this.devices(), connections: this.connections() }, null, 2);
  }

  /** Valida un JSON importato e sostituisce lo stato solo se tutta la topologia è valida. */
  importJSON(json: string): string | null {
    const topology = this.storage.parse(json);
    if (!topology) return 'Il file JSON non contiene una topologia valida.';
    this.devices.set(topology.devices);
    this.connections.set(topology.connections);
    this.selectedDeviceId.set(null);
    this.selectedConnectionId.set(null);
    this.detailDeviceId.set(null);
    this.detailConnectionId.set(null);
    return null;
  }

  /** Ricarica la topologia salvata; le connessioni passano di nuovo dalla validazione. */
  load(): void {
    const t = this.storage.load();
    if (!t) return this.notify('Nessuna topologia salvata.', true);
    this.devices.set(t.devices);
    this.connections.set([]);
    this.selectedDeviceId.set(null); this.selectedConnectionId.set(null); this.detailDeviceId.set(null);
    t.connections.forEach((c) => this.addConnection(c.sourceId, c.targetId, c.id));
    this.notify('Topologia caricata.');
  }

  /** Cancella la topologia salvata nel Local Storage (il canvas resta invariato). */
  clearSaved(): void {
    this.storage.clear();
    this.notify('Topologia salvata cancellata.');
  }

  /** Seleziona un dispositivo e deseleziona l'eventuale connessione. */
  selectDevice(id: string | null): void { this.selectedDeviceId.set(id); this.selectedConnectionId.set(null); }

  /** Seleziona una connessione e deseleziona l'eventuale dispositivo. */
  selectConnection(id: string | null): void { this.selectedConnectionId.set(id); this.selectedDeviceId.set(null); }
}
