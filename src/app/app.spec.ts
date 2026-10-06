import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TopologyService } from './serivice/Topology-service/topology';

describe('App', () => {
  it('crea il componente', () => {
    TestBed.configureTestingModule({ imports: [App] });
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('rifiuta auto-connessioni, duplicati e oltre il limite di porte dello Switch', () => {
    const t = TestBed.inject(TopologyService);
    t.addDevice('PC', 100, 100); t.addDevice('Switch', 200, 200);
    const [pc, sw] = t.devices();
    expect(t.addConnection(pc.id, pc.id)).toBeTruthy();
    expect(t.addConnection(pc.id, sw.id)).toBeNull();
    expect(t.addConnection(sw.id, pc.id)).toBeTruthy();
    t.devices.update((l) => l.map((d) => (d.id === sw.id ? { ...d, ports: 1 } : d)));
    t.addDevice('PC', 300, 300);
    expect(t.addConnection(sw.id, t.devices()[2].id)).toContain('porte');
  });
});
