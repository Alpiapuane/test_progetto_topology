/** Tipi di dispositivo ammessi. */
export type DeviceType = 'PC' | 'Switch' | 'Router';
export const DEVICE_TYPES: DeviceType[] = ['PC', 'Router', 'Switch'];
export type DeviceStatus = 'Online' | 'Offline' | 'Standby';

/** Dispositivo nel canvas. `ports` è definito solo per gli Switch (porte totali). */
export interface Device {
  id: string; type: DeviceType; name: string; x: number; y: number;
  ip: string; hostname: string; status: DeviceStatus; ports?: number;
}

/** Connessione tra due dispositivi, legata agli ID (non alle coordinate). */
export interface Connection { id: string; sourceId: string; targetId: string; }

/** Stato completo salvato nel Local Storage. */
export interface Topology { devices: Device[]; connections: Connection[]; }
