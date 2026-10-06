import { Injectable } from '@angular/core';
import { Connection, DEVICE_TYPES, Device, DeviceStatus, DeviceType, Topology } from '../../modules/models';

const KEY = 'network-topology-v1';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Service dedicato alla persistenza: salva, carica e valida la topologia sul browser.
 * L'uso del Local Storage consente di ripristinare la rete senza backend.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /** Serializza e salva la topologia corrente nel Local Storage del browser. */
  save(t: Topology): void { localStorage.setItem(KEY, JSON.stringify(t)); }

  /** Rimuove la topologia salvata, lasciando il canvas in stato corrente. */
  clear(): void { localStorage.removeItem(KEY); }

  /** Verifica se nel Local Storage è presente una topologia già salvata. */
  has(): boolean { return localStorage.getItem(KEY) !== null; }

  /** Legge e valida la topologia salvata; ritorna null se manca o se il contenuto è corrotto. */
  load(): Topology | null {
    return this.parse(localStorage.getItem(KEY) ?? '');
  }

  /**
   * Converte un JSON in un oggetto `Topology` e verifica che:
   * - tutti i dispositivi abbiano campi validi;
   * - i riferimenti a sourceId/targetId puntino a dispositivi reali;
   * - non ci siano doppie connessioni né collegamenti invalidi;
   * - gli Switch non superino il numero massimo di porte.
   */
  parse(json: string): Topology | null {
    try {
      const raw: unknown = JSON.parse(json);
      if (!isRecord(raw) || !Array.isArray(raw['devices']) || !Array.isArray(raw['connections'])) return null;

      const devices: Device[] = [];
      const deviceIds = new Set<string>();
      const names = new Set<string>();
      const ips = new Set<string>();
      const hostnames = new Set<string>();
      const statuses: DeviceStatus[] = ['Online', 'Offline', 'Standby'];

      for (const item of raw['devices']) {
        if (!isRecord(item)) return null;
        const { id, type, name, x, y, ip, hostname, status, ports } = item;
        if (typeof id !== 'string' || !id || typeof type !== 'string' || !DEVICE_TYPES.includes(type as DeviceType)
          || typeof name !== 'string' || !name.trim() || typeof x !== 'number' || !Number.isFinite(x)
          || typeof y !== 'number' || !Number.isFinite(y) || typeof ip !== 'string' || !ip.trim()
          || typeof hostname !== 'string' || !hostname.trim() || typeof status !== 'string'
          || !statuses.includes(status as DeviceStatus) || deviceIds.has(id) || names.has(name)
          || ips.has(ip) || hostnames.has(hostname)) return null;
        if (ports !== undefined && (!Number.isInteger(ports) || (ports as number) < 0)) return null;
        if (type === 'Switch' && (!Number.isInteger(ports) || (ports as number) < 1)) return null;

        deviceIds.add(id);
        names.add(name);
        ips.add(ip);
        hostnames.add(hostname);
        devices.push({ id, type: type as DeviceType, name, x, y, ip, hostname, status: status as DeviceStatus,
          ...(ports === undefined ? {} : { ports: ports as number }) });
      }

      const connections: Connection[] = [];
      const connectionIds = new Set<string>();
      const pairs = new Set<string>();
      const portUse = new Map<string, number>();
      const deviceById = new Map(devices.map((device) => [device.id, device]));

      for (const item of raw['connections']) {
        if (!isRecord(item)) return null;
        const { id, sourceId, targetId } = item;
        if (typeof id !== 'string' || !id || typeof sourceId !== 'string' || typeof targetId !== 'string'
          || sourceId === targetId || !deviceById.has(sourceId) || !deviceById.has(targetId) || connectionIds.has(id)) return null;
        const pair = [sourceId, targetId].sort().join('\0');
        if (pairs.has(pair)) return null;
        pairs.add(pair);
        connectionIds.add(id);
        connections.push({ id, sourceId, targetId });

        for (const deviceId of [sourceId, targetId]) {
          const device = deviceById.get(deviceId)!;
          const used = (portUse.get(deviceId) ?? 0) + 1;
          if (device.type === 'Switch' && used > (device.ports ?? 0)) return null;
          portUse.set(deviceId, used);
        }
      }

      return { devices, connections };
    } catch {
      return null;
    }
  }
}
