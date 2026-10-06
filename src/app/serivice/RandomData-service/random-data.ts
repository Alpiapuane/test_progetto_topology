import { Injectable } from '@angular/core';
import { Device, DeviceStatus, DeviceType } from '../../modules/models';

/** Crea una lista di stringhe numerate dal valore iniziale a quello finale inclusi. */
const range = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

/** Pool di valori da cui vengono estratti i dati casuali. */
const NAMES = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet',
  'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango'];
const IPS: Record<DeviceType, string[]> = {
  PC: range('192.168.1.', 100, 199),
  Switch: range('192.168.1.', 200, 230),
  Router: ['192.168.1.1', '192.168.2.1', '10.0.0.1', '172.16.0.1', '192.168.100.1', '10.10.10.1'],
};
const HOSTS: Record<DeviceType, string[]> = {
  PC: ['pc-ufficio', 'pc-segreteria', 'pc-lab', 'pc-magazzino', 'pc-direzione', 'pc-reception', 'pc-sviluppo'],
  Switch: ['sw-piano0', 'sw-piano1', 'sw-core', 'sw-server', 'sw-lab'],
  Router: ['router-main', 'router-edge', 'router-branch', 'router-backup'],
};
const STATUSES: DeviceStatus[] = ['Online', 'Online', 'Online', 'Offline', 'Standby'];
const SWITCH_PORTS = [4, 8, 16, 24];

/**
 * Genera i dati iniziali dei dispositivi con un controllo anti-collisione.
 * Il servizio evita che due dispositivi abbiano lo stesso nome, lo stesso IP o lo stesso hostname,
 * mantenendo la topologia coerente e leggibile.
 */
@Injectable({ providedIn: 'root' })
export class RandomDataService {
  /**
   * Crea un set di proprietà per un nuovo dispositivo, garantendo che i valori usati
   * non siano già presenti tra i dispositivi esistenti.
   */
  generate(type: DeviceType, existing: readonly Device[]) {
    const used = (f: (d: Device) => string) => new Set(existing.map(f));
    return {
      name: this.unique(NAMES.map((n) => `${type}-${n}`), used((d) => d.name), (n) => `${type}-${n}`),
      ip: this.unique(IPS[type], used((d) => d.ip), (n) => `10.99.${n}.1`),
      hostname: this.unique(HOSTS[type], used((d) => d.hostname), (n) => `${type.toLowerCase()}-${n}`),
      status: this.pick(STATUSES),
      ports: type === 'Switch' ? this.pick(SWITCH_PORTS) : undefined,
    };
  }

  /** Estrae un elemento casuale dalla lista fornita. */
  private pick<T>(list: T[]): T { return list[Math.floor(Math.random() * list.length)]; }

  /**
   * Seleziona un valore disponibile nella pool; se la pool è esaurita,
   * crea un suffisso numerico per evitare duplicati senza bloccare l'inserimento.
   */
  private unique(pool: string[], used: Set<string>, fallback: (n: number) => string): string {
    const free = pool.filter((v) => !used.has(v));
    if (free.length) return this.pick(free);
    let n = 2;
    while (used.has(fallback(n))) n++;
    return fallback(n);
  }
}
